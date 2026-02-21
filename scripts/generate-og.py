"""Generate OG preview image (1200x630) using Playwright."""
from playwright.sync_api import sync_playwright
import os

HTML = """<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #080A12; color: #E2E8F0;
    font-family: 'Plus Jakarta Sans', sans-serif;
    display: flex; align-items: center; justify-content: center;
    position: relative;
  }
  .bg-orb {
    position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
  }
  .bg-orb-1 {
    width: 400px; height: 400px; top: -80px; left: -60px;
    background: radial-gradient(circle, rgba(165,215,232,0.12), transparent 70%);
  }
  .bg-orb-2 {
    width: 350px; height: 350px; bottom: -60px; right: -40px;
    background: radial-gradient(circle, rgba(74,222,128,0.08), transparent 70%);
  }
  .bg-orb-3 {
    width: 250px; height: 250px; top: 50%; left: 55%;
    background: radial-gradient(circle, rgba(165,215,232,0.06), transparent 70%);
  }
  .content {
    position: relative; z-index: 1; text-align: center; padding: 0 80px;
  }
  .logo-row {
    display: flex; align-items: center; justify-content: center; gap: 14px;
    margin-bottom: 32px;
  }
  .logo-mark {
    width: 48px; height: 48px; border-radius: 14px;
    background: linear-gradient(135deg, #A5D7E8, rgba(165,215,232,0.3));
    display: flex; align-items: center; justify-content: center;
  }
  .logo-mark svg { color: #080A12; }
  .logo-name {
    font-size: 28px; font-weight: 700; letter-spacing: -0.02em;
  }
  h1 {
    font-size: 64px; font-weight: 700; line-height: 1.1;
    letter-spacing: -0.03em; margin-bottom: 24px;
  }
  .accent {
    background: linear-gradient(135deg, #A5D7E8, #4ADE80, #C4E8F2);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .sub {
    font-size: 22px; color: rgba(226,232,240,0.5); line-height: 1.6;
    max-width: 700px; margin: 0 auto 40px;
  }
  .metrics {
    display: flex; justify-content: center; gap: 48px;
  }
  .metric { text-align: center; }
  .metric-val {
    font-size: 32px; font-weight: 700; color: #4ADE80;
    letter-spacing: -0.02em;
  }
  .metric-lbl {
    font-size: 12px; color: rgba(226,232,240,0.3); text-transform: uppercase;
    letter-spacing: 0.1em; margin-top: 4px;
  }
  .metric-sep {
    width: 1px; height: 50px; background: rgba(165,215,232,0.1);
    align-self: center;
  }
</style>
</head>
<body>
  <div class="bg-orb bg-orb-1"></div>
  <div class="bg-orb bg-orb-2"></div>
  <div class="bg-orb bg-orb-3"></div>
  <div class="content">
    <div class="logo-row">
      <div class="logo-mark">
        <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
          <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <path d="M12 8L17 11V15L12 18L7 15V11L12 8Z" fill="currentColor" opacity="0.3"/>
        </svg>
      </div>
      <span class="logo-name">PassivePips</span>
    </div>
    <h1>Automated Forex<br><span class="accent">PAMM Trading</span></h1>
    <p class="sub">Consistent monthly returns through automated strategies.<br>No hidden fees. $10 minimum deposit.</p>
    <div class="metrics">
      <div class="metric">
        <div class="metric-val">+28%</div>
        <div class="metric-lbl">Total Return</div>
      </div>
      <div class="metric-sep"></div>
      <div class="metric">
        <div class="metric-val">11</div>
        <div class="metric-lbl">Months Active</div>
      </div>
      <div class="metric-sep"></div>
      <div class="metric">
        <div class="metric-val">3,600+</div>
        <div class="metric-lbl">Trades Executed</div>
      </div>
    </div>
  </div>
</body>
</html>"""

out_dir = os.path.join(os.path.dirname(__file__), "..", "public")
html_path = os.path.join(out_dir, "_og-temp.html")
out_path = os.path.join(out_dir, "og-preview.png")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(HTML)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1200, "height": 630})
    page.goto(f"file:///{os.path.abspath(html_path).replace(os.sep, '/')}")
    page.wait_for_timeout(1000)
    page.screenshot(path=out_path, full_page=False)
    browser.close()

os.remove(html_path)
print(f"OG image saved to {out_path}")
