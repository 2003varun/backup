const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto('file:///' + __dirname.replace(/\\/g, '/') + '/index.html', { waitUntil: 'networkidle0' });
  
  // Open menu
  await page.click('.qd-hamburger');
  await page.waitForSelector('.qd-nav-panel[data-open="true"]');
  
  const header = await page.evaluate(() => {
    const wrapper = document.querySelector('header > div');
    const panel = document.querySelector('.qd-nav-panel');
    const hamburger = document.querySelector('.qd-hamburger');
    const firstLink = document.querySelector('.qd-navlink');
    
    return {
      wrapperRect: wrapper.getBoundingClientRect(),
      hamburgerRect: hamburger.getBoundingClientRect(),
      panelRect: panel.getBoundingClientRect(),
      firstLinkRect: firstLink.getBoundingClientRect(),
      wrapperStyles: {
        alignItems: window.getComputedStyle(wrapper).alignItems,
        alignContent: window.getComputedStyle(wrapper).alignContent,
        gap: window.getComputedStyle(wrapper).gap,
        rowGap: window.getComputedStyle(wrapper).rowGap
      },
      panelStyles: {
        paddingTop: window.getComputedStyle(panel).paddingTop,
        marginTop: window.getComputedStyle(panel).marginTop
      }
    };
  });
  
  console.log(JSON.stringify({
    hamburgerBottom: header.hamburgerRect.bottom,
    panelTop: header.panelRect.top,
    firstLinkTop: header.firstLinkRect.top,
    gap: header.firstLinkRect.top - header.hamburgerRect.bottom,
    wrapperStyles: header.wrapperStyles,
    panelStyles: header.panelStyles
  }, null, 2));

  await browser.close();
})();
