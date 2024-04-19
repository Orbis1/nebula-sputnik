const playwright = require('playwright');
const https = require('https');
const fs = require('fs');

const arraySortDesc = (a, b) => {
  if (a.version > b.version) {
    return -1;
  }
  if (a.version < b.version) {
    return 1;
  }
  return 0;
};

(async (mainPage, unlockName) => {
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage();
  await page.goto(mainPage);

  // Clicks all Assets
  const assets = await page.getByText('Assets').all();
  for (const a of assets) {
    await a.click();
  }

  const unlocks = await page.getByText(unlockName).all();
  const links = [];

  for (const unlock of unlocks) {
    const link = await unlock.evaluate(node => {
      const href = node.parentElement.getAttribute('href');
      const version = href.match(/\/v(.*)\//)[1];
      return { href, version };
    });
    links.push(link);
  }

  if (links.length === 0) {
    console.log('No .unlock file here');
    await browser.close();
    return;
  }

  links.sort(arraySortDesc);
  const downloadLink = 'https://github.com' + links[0].href;
  console.log(`download -> ${downloadLink}`);

  await browser.close();

  // Download unlock file to trial folder
  const trialPath = process.env.QLIK_SENSE_DOC_PATH + '\\trial';

  if (!fs.existsSync(trialPath)) {
    fs.mkdirSync(trialPath, { recursive: true });
  }

  const file = fs.createWriteStream(`${trialPath}\\${unlockName}`);

  https.get(downloadLink, getFileLink);

  function getFileLink(res) {
    if ((res.statusCode = 302)) {
      const link = res.headers.location;
      https.get(link, getFile);
    }
  }

  function getFile(res) {
    if ((res.statusCode = 200)) {
      res.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log('Download Completed');
      });
    }
  }
})(
  'https://github.com/qlik-download/qlik-sense-desktop/releases',
  'Qlik_Sense_Desktop.unlock'
);
