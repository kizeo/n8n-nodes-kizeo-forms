const path = require('path');
const fs = require('fs');

function matchExtension(file, ext) {
  if (Array.isArray(ext)) {
    return ext.some((extension) => matchExtension(file, extension));
  }

  return path.extname(file) === ext;
}

function retrieveFilesFromDir(startPath, filter) {
  if (Array.isArray(startPath)) {
    startPath.forEach((path) => {
      retrieveFilesFromDir(path, filter);
    });

    return;
  }

  if (!fs.existsSync(startPath)) {
    console.log('no dir ', startPath);

    return;
  }

  const files = fs.readdirSync(startPath);

  for (const file of files) {
    const filename = path.join(startPath, file);
    const stat = fs.lstatSync(filename);

    if (stat.isDirectory()) {
      retrieveFilesFromDir(filename, filter);
    } else if (matchExtension(file, filter)) {
      return copyFiles(filename);
    }
  }
}

function copyFiles(file) {
  const copyDir = 'dist';

  // File destination.txt will be created or overwritten by default.
  fs.copyFile(file, `${copyDir}/${file}`, (err) => {
    if (err) throw err;
    console.log(`${copyDir}/${file} was copied.`);
  });
}

const directories = ['./nodes', './credentials'];
const extensions = ['.png', '.svg'];

retrieveFilesFromDir(directories, extensions);
