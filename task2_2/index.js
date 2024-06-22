const path = require('path');
const fs = require('fs/promises');
const { COPYFILE_EXCL } = fs.constants;
const yargs = require('yargs');

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

async function createDir (src) {
  try {
    await fs.stat(src);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      await fs.mkdir(src);
    }
  }
}

async function deleteDir (src) {
  try {
    await fs.rmdir(src);
    await fs.rm(config.entry, { recursive: true });
  } catch (error) {
    if (error && (error.code === 'ENOENT' || error.code === 'ENOTEMPTY')) {
      return false;
    }
  }
}

async function sorter (src) {
  await createDir(config.dist);
  const files = await fs.readdir(src);

  for (const file of files) {
    const currentPath = path.join(src, file);
    const stat = await fs.stat(currentPath);

    if (stat.isDirectory()) {
      sorter(currentPath);
    } else {
      const folderPath = path.join(config.dist, file.charAt(0).toUpperCase());
      await createDir(folderPath);
      await fs.copyFile(currentPath, path.join(folderPath, file), COPYFILE_EXCL);
      if (config.delete) {
        await fs.unlink(currentPath);
        await deleteDir(src);
      }
    }
  }
}

sorter(config.entry);
