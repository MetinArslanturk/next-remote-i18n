const { createServer } = require('http');
const next = require('next');
const { promises, constants } = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const checkExists = async (filePath) => {
  return promises.access(filePath, constants.F_OK)
           .then(() => true)
           .catch(() => false)
}

const purgeDirectory = async (dirPath) => {
  await checkExists(dirPath) && await promises.rm(dirPath, { recursive: true, force: true });
}

const purgeFile = async (filePath) => {
  const fullPathHTML = `${filePath}.html`;
  const fullPathJSON = `${filePath}.json`;
  await checkExists(fullPathHTML) && await promises.unlink(fullPathHTML);
  await checkExists(fullPathJSON) && await promises.unlink(fullPathJSON);
}

const purgeData = async (newKey) => {
  const fullPathEnUS = '.next/server/pages/en-US';
  const fullPathEsMX = '.next/server/pages/es-MX';
  await purgeDirectory(fullPathEnUS);
  await purgeDirectory(fullPathEsMX);
  await purgeFile(fullPathEnUS);
  await purgeFile(fullPathEsMX);

  try {

    await app.server.incrementalCache.cache.reset();
    process.env.newKey = newKey;
    console.log(`Cache successfully purged`);
  } catch (err) {
    console.error(`Could not purge cache - ${err}`);
  }
};

app.prepare().then(() => {
  createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost:3000/');
    if (url.pathname === '/purge') {
      const newKey = url.searchParams.get('newKey');
      purgeData(newKey);
    }
    handle(req, res);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000/');
  });
});