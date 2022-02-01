const { Walker } = require('../dist/walker');

const rootPath = __dirname;
const walker = new Walker(rootPath);

let filesFound = 0;

// Walker has found a new file/directory
walker.on('data', (result) => {
    if (result.isFile()) {
        filesFound++;
        console.log('File found: %s', result.path);
    } else if (result.isDirectory()) {
        console.log('Directory found: %s', result.path);
    }
});

// Walker couldn't find any more directories
walker.on('done', () => {
    console.log('Finished walking, found %s files.', filesFound);
});

// Start walker
walker.walk();