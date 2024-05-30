const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);
const qlik = { path: process.env.QLIK_SENSE_EXE_PATH };

async function runQlikDesktop() {
  const disk = qlik.path.match(/\w:/);
  const { stdout, stderr } = await exec(
    `${disk[0]} && cd ${qlik.path} && QlikSense.exe`
  );
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}

async function openUrl(url) {
  const disk = qlik.path.match(/\w:/);
  const { stdout, stderr } = await exec(`start ${url}`);
  console.log('stdout:', stdout);
  console.error('stderr:', stderr);
}

runQlikDesktop()
  .then(() => {
    console.log('now u can open localhost:4848');
    openUrl('http://localhost:4848/hub');
  })
  .catch(console.error);
