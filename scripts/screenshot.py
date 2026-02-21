from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 900})
    page.goto("http://localhost:5173")
    page.wait_for_load_state("networkidle")
    page.wait_for_timeout(1500)

    # Hero
    page.screenshot(path="/tmp/pp-1-hero.png", full_page=False)

    # Scroll to performance to trigger animations
    page.evaluate("document.getElementById('performance')?.scrollIntoView({behavior:'instant'})")
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/pp-2-performance.png", full_page=False)

    # Scroll to about
    page.evaluate("document.getElementById('about')?.scrollIntoView({behavior:'instant'})")
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/pp-3-about.png", full_page=False)

    # Scroll to guide
    page.evaluate("document.getElementById('guide')?.scrollIntoView({behavior:'instant'})")
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/pp-4-guide.png", full_page=False)

    # Scroll to contact
    page.evaluate("document.getElementById('contact')?.scrollIntoView({behavior:'instant'})")
    page.wait_for_timeout(1000)
    page.screenshot(path="/tmp/pp-5-contact.png", full_page=False)

    browser.close()
