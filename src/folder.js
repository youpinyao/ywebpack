const path = require('path');
const fs = require('fs');

function folder(config) {
  const dir = path.resolve(process.cwd(), config.path);
  const replacePath = path.join(config.publicPath, 'folder_assets/');
  const dirs = [];
  const htmls = [];
  const jses = [];
  const csses = [];
  const images = [];
  const isJs = v => /\.js$/.test(v);
  const isCss = v => /\.css$/.test(v);
  const isImage = v => /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg|ico|mp3|mp4|pdf)$/.test(v);
  const isHtml = v => /\.html$/.test(v);

  const jsPath = path.resolve(dir, 'js');
  const cssPath = path.resolve(dir, 'css');
  const imagePath = path.resolve(dir, 'images');

  const files = fs.readdirSync(dir);

  if (!fs.existsSync(jsPath)) {
    fs.mkdirSync(jsPath);
  }
  if (!fs.existsSync(cssPath)) {
    fs.mkdirSync(cssPath);
  }
  if (!fs.existsSync(imagePath)) {
    fs.mkdirSync(imagePath);
  }

  function doReplacePath(item) {
    let str = fs.readFileSync(item).toString();
    const prefix = isHtml(item) ? './' : '../';

    files.forEach((file) => {
      const filePath = path.join(replacePath, file);

      if (isJs(file)) {
        str = str.replace(new RegExp(filePath, 'g'), path.join(prefix, 'js/', file));
      } else if (isCss(file)) {
        str = str.replace(new RegExp(filePath, 'g'), path.join(prefix, 'css/', file));
      } else if (isImage(file)) {
        str = str.replace(new RegExp(filePath, 'g'), path.join(prefix, 'images/', file));
      } else if (isHtml(file)) {
        str = str.replace(new RegExp(filePath, 'g'), path.join(prefix, '', file));
      }
    });

    fs.writeFileSync(item, str);
  }

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const data = fs.statSync(filePath);

    if (data.isFile()) {
      if (isJs(filePath)) {
        doReplacePath(filePath);
        fs.renameSync(filePath, filePath.replace(dir, jsPath));
      } else if (isCss(filePath)) {
        doReplacePath(filePath);
        fs.renameSync(filePath, filePath.replace(dir, cssPath));
      } else if (isImage(filePath)) {
        fs.renameSync(filePath, filePath.replace(dir, imagePath));
      } else if (isHtml(filePath)) {
        // html
        doReplacePath(filePath);
      }
      dirs.push(filePath);
    }
  });
}
module.exports = folder;
