from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 390, "height": 844})
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1500)

    # Mobile hero
    page.screenshot(path="/tmp/pp-mobile-hero.png", full_page=False)

    # Open burger menu
    page.click("[aria-label='Toggle menu']")
    page.wait_for_timeout(500)
    page.screenshot(path="/tmp/pp-mobile-menu.png", full_page=False)

    # Close menu and scroll to performance
    page.click("[aria-label='Toggle menu']")
    page.wait_for_timeout(300)
    page.evaluate("document.getElementById('performance')?.scrollIntoView({behavior:'instant'})")
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/pp-mobile-perf.png", full_page=False)

    browser.close()
