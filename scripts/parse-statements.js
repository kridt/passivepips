import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const STATEMENTS_DIR = join(import.meta.dirname, "..", "statements");
const OUTPUT_FILE = join(import.meta.dirname, "..", "public", "performance.json");

// Only show results from this date onwards
const START_DATE = "2025-03";

// --- CSV Parser (PAMM portal transactions export) ---
function parseCsv(csv) {
  const lines = csv.split("\n").filter((l) => l.trim());
  const header = lines[0].split(",");
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < header.length) continue;
    const row = {};
    for (let j = 0; j < header.length; j++) {
      row[header[j].trim()] = cols[j]?.trim() ?? "";
    }
    rows.push(row);
  }
  return rows;
}

function processCSV(filePath) {
  const csv = readFileSync(filePath, "utf-8");
  const rows = parseCsv(csv);

  // Separate deposits and trade results
  let initialBalance = 0;
  const trades = [];

  let wins = 0;
  let losses = 0;

  for (const row of rows) {
    const amount = parseFloat(row.Amount) || 0;
    const time = row.Time || "";
    const month = time.slice(0, 7); // "2025-03"

    if (row.Reason === "Deposit") {
      initialBalance += amount;
    } else if (row.Reason === "TradeResults") {
      trades.push({ month, amount });
      if (amount > 0) wins++;
      else if (amount < 0) losses++;
    }
    // PerformanceFee excluded — we show gross returns (manager's perspective)
  }

  console.log(`  Initial deposit: $${initialBalance.toFixed(2)}`);
  console.log(`  Total trade results: ${trades.length}`);

  // Build monthly P/L from all trades (need full history for running balance)
  const allMonthly = {};
  for (const t of trades) {
    if (!allMonthly[t.month]) allMonthly[t.month] = { profit: 0, trades: 0 };
    allMonthly[t.month].profit += t.amount;
    allMonthly[t.month].trades++;
  }

  // Sort all months chronologically to build running balance
  const allMonthsSorted = Object.entries(allMonthly)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));

  // Calculate gain % using forward-running balance
  let balance = initialBalance;
  for (const m of allMonthsSorted) {
    m.gain = balance > 0 ? Number(((m.profit / balance) * 100).toFixed(2)) : 0;
    balance += m.profit;
    m.profit = Number(m.profit.toFixed(2));
  }

  const currentBalance = Number(balance.toFixed(2));
  console.log(`  Current balance: $${currentBalance}`);

  // Filter to only months from START_DATE onwards
  const filtered = allMonthsSorted
    .filter((m) => m.month >= START_DATE)
    .sort((a, b) => b.month.localeCompare(a.month)) // newest first
    .slice(0, 12);

  const winRate = (wins + losses) > 0 ? Number(((wins / (wins + losses)) * 100).toFixed(1)) : 0;
  console.log(`  Win rate: ${winRate}% (${wins}W / ${losses}L)`);

  return { monthly: filtered, balance: currentBalance, winRate };
}

// --- MT4 HTML Statement Parser ---
function parseStatement(html) {
  const trades = [];
  const rowRegex =
    /<tr[^>]*>\s*<td[^>]*>(\d+)<\/td>\s*<td[^>]*>([\d.:\s]+)<\/td>\s*<td>(buy|sell)<\/td>\s*<td[^>]*>([\d.]+)<\/td>\s*<td>([^<]+)<\/td>\s*<td[^>]*>([\d.]+)<\/td>\s*<td[^>]*>([\d.]+)<\/td>\s*<td[^>]*>([\d.]+)<\/td>\s*<td[^>]*>([\d.:\s]+)<\/td>\s*<td[^>]*>([\d.]+)<\/td>\s*<td[^>]*>([-\d.]+)<\/td>\s*<td[^>]*>([-\d.]+)<\/td>\s*<td[^>]*>([-\d.]+)<\/td>\s*<td[^>]*>([-\d.]+)<\/td>/gi;

  let match;
  while ((match = rowRegex.exec(html)) !== null) {
    const closeTime = match[9].trim();
    if (!closeTime || closeTime === "&nbsp;") continue;
    trades.push({
      ticket: match[1],
      closeTime,
      commission: parseFloat(match[11]),
      swap: parseFloat(match[13]),
      profit: parseFloat(match[14]),
    });
  }

  const balanceMatch = html.match(
    /Balance:<\/b><\/td>\s*<td[^>]*><b>([\d\s,.]+)<\/b>/i
  );
  const balance = balanceMatch
    ? parseFloat(balanceMatch[1].replace(/\s/g, "").replace(",", "."))
    : null;

  return { trades, balance };
}

function processHTM(files) {
  let allTrades = [];
  let latestBalance = null;

  for (const file of files) {
    const html = readFileSync(join(STATEMENTS_DIR, file), "utf-8");
    const { trades, balance } = parseStatement(html);
    console.log(`  ${file}: ${trades.length} trades, balance: $${balance}`);
    allTrades.push(...trades);
    if (balance != null) latestBalance = balance;
  }

  // Deduplicate
  const seen = new Set();
  allTrades = allTrades.filter((t) => {
    if (seen.has(t.ticket)) return false;
    seen.add(t.ticket);
    return true;
  });

  // Group by month
  const monthlyMap = {};
  for (const t of allTrades) {
    const parts = t.closeTime.split(".");
    if (parts.length < 2) continue;
    const key = `${parts[0]}-${parts[1]}`;
    if (!monthlyMap[key]) monthlyMap[key] = { trades: 0, profit: 0 };
    monthlyMap[key].trades++;
    monthlyMap[key].profit += t.profit + t.swap + t.commission;
  }

  const monthly = Object.entries(monthlyMap)
    .map(([month, data]) => ({
      month,
      profit: Number(data.profit.toFixed(2)),
      trades: data.trades,
    }))
    .sort((a, b) => b.month.localeCompare(a.month));

  // Calculate gain % backwards from known balance
  let runningBalance = latestBalance;
  for (const m of monthly) {
    const startBalance = runningBalance - m.profit;
    m.gain = startBalance > 0 ? Number(((m.profit / startBalance) * 100).toFixed(2)) : 0;
    runningBalance = startBalance;
  }

  // Filter by start date
  const filtered = monthly.filter((m) => m.month >= START_DATE).slice(0, 12);

  const wins = allTrades.filter((t) => (t.profit + t.swap + t.commission) > 0).length;
  const losses = allTrades.filter((t) => (t.profit + t.swap + t.commission) < 0).length;
  const winRate = (wins + losses) > 0 ? Number(((wins / (wins + losses)) * 100).toFixed(1)) : 0;
  console.log(`  Win rate: ${winRate}% (${wins}W / ${losses}L)`);

  return { monthly: filtered, balance: latestBalance, winRate };
}

// --- Main ---
const allFiles = readdirSync(STATEMENTS_DIR);
const csvFiles = allFiles.filter((f) => f.endsWith(".csv"));
const htmFiles = allFiles.filter((f) => f.endsWith(".htm") || f.endsWith(".html"));

let result;

if (csvFiles.length > 0) {
  // Prefer CSV (PAMM portal export)
  const csvPath = join(STATEMENTS_DIR, csvFiles[0]);
  console.log(`Parsing CSV: ${csvFiles[0]}`);
  result = processCSV(csvPath);
} else if (htmFiles.length > 0) {
  console.log(`Parsing ${htmFiles.length} HTM file(s):`);
  result = processHTM(htmFiles);
} else {
  console.error("No .csv or .htm/.html files found in statements/ folder");
  process.exit(1);
}

const { monthly, balance, winRate } = result;

// Aggregate stats
let compoundedGain = 1;
let totalTrades = 0;
let totalProfit = 0;
let positiveMonths = 0;

for (const m of monthly) {
  compoundedGain *= 1 + m.gain / 100;
  totalTrades += m.trades;
  totalProfit += m.profit;
  if (m.gain > 0) positiveMonths++;
}

const windowGain = Number(((compoundedGain - 1) * 100).toFixed(2));
const avgMonthly = Number((windowGain / (monthly.length || 1)).toFixed(2));

const output = {
  gain: windowGain,
  monthlyGain: avgMonthly,
  trades: totalTrades,
  totalProfit: Number(totalProfit.toFixed(2)),
  monthsActive: monthly.length,
  positiveMonths,
  winRate,
  balance,
  monthlyAnalytics: monthly,
  generatedAt: new Date().toISOString(),
};

writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
console.log(`\nWritten to ${OUTPUT_FILE}`);
console.log(`  Period: from ${START_DATE} (${monthly.length} months)`);
console.log(`  Total gain: ${windowGain}%`);
console.log(`  Avg monthly: ${avgMonthly}%`);
console.log(`  Trades: ${totalTrades}`);
console.log(`  Profit: $${totalProfit.toFixed(2)}`);
console.log(`  Positive months: ${positiveMonths}/${monthly.length}`);
console.log(`  Balance: $${balance}`);
