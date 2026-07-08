const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.goto('file://' + process.cwd() + '/index.html');
    await page.evaluate(() => { document.documentElement.style.zoom = '1.5'; });
    const rects = await page.evaluate(() => {
      const h = document.querySelector('.header__inner').getBoundingClientRect();
      const s = document.querySelector('.hero-slider').getBoundingClientRect();
      return { header: h.width, headerLeft: h.left, slider: s.width, sliderLeft: s.left, body: document.body.clientWidth, viewport: window.innerWidth };
    });
    console.log(rects);
    await browser.close();
  } catch (e) {
    console.error(e);
  }
})();
