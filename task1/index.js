const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const { COPYFILE_EXCL } = fs.constants;
const args = yargs.usage('Usage: node $0 [options]')
  .help('help').alias('help', 'h')
  .version('1.0.0').alias('version', 'v')
  .example('node $0 --entry ./path/path --dist ./path/path --delete')
  .option('entry', {
    alias: 'e',
    describe: 'Путь к исходной папке',
    demandOption: true
  })
  .option('dist', {
    alias: 'd',
    describe: 'Путь до целевой папки',
    default: './dist'
  })
  .option('delete', {
    alias: 'del',
    describe: 'Удалить исходную папку',
    boolean: true,
    default: false
  })
  .argv;

const config = {
  entry: path.join(__dirname, args.entry),
  dist: path.join(__dirname, args.dist),
  delete: args.delete
};

function createDir (src, callback) {
  fs.mkdir(src, (err) => {
    if (err && err.code === 'EEXIST') {
      callback();
    } else {
      if (err) throw err;
    }
    callback();
  });
}

function sorter (src) {
  fs.readdir(src, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      const currentPath = path.join(src, file);
      fs.stat(currentPath, (err, stat) => {
        if (err) throw err;

        if (stat.isDirectory()) {
          sorter(currentPath);
        } else {
          createDir(config.dist, () => {
            const folderPath = path.join(config.dist, file.charAt(0).toUpperCase());

            createDir(folderPath, () => {
              fs.copyFile(currentPath, path.join(folderPath, file), COPYFILE_EXCL, (err) => {
                if (config.delete) {
                  fs.unlink(currentPath, (err) => {
                    fs.rm(config.entry, { recursive: true }, err => {
                      if (err && (err.code === 'ENOENT' || err.code === 'ENOTEMPTY')) {
                        return false;
                      } else {
                        if (err) console.log(err.message);
                      }
                    });
                    if (err && err.code === 'ENOENT') {
                      return false;
                    } else {
                      if (err) {
                        console.log(err.message);
                      }
                    }
                  });
                }
                if (err && err.code === 'EEXIST') {
                  return false;
                } else {
                  if (err) throw err;
                }
              });
            });
          });
        }
      });
    });
  });
}

try {
  sorter(config.entry);
} catch (error) {
  console.log(error.message);
}
