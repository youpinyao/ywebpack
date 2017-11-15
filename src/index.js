const type = process.argv[2];
const configPath = process.argv[3];

const fs = require('fs');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const del = require('delete');
const path = require('path');
let config = require('./config');

if (configPath && fs.existsSync(path.resolve(process.cwd(), configPath))) {
  config = Object.assign(config, require(path.resolve(process.cwd(), configPath)));
}

const clearConsole = require('react-dev-utils/clearConsole');

const configs = {
  build: require('./production'),
  start: require('./development'),
  dll: require('./dll'),
};
let webpackConfig = configs[type];

switch (type) {
  case 'dll':
    del.sync([path.resolve(process.cwd(), '.dll')], {
      force: true
    });
    webpack(webpackConfig()).run(runCallback);
    console.log(chalk.green('\r\ndll complete \r\n'));

    break;
  case 'build':
    del.sync([path.resolve(process.cwd(), config.path)], {
      force: true
    });
    webpack(webpackConfig()).run((err, stats) => {
      if (runCallback(err, stats)) {
        console.log(chalk.green('\r\nbuild complete \r\n'));
      }
    });

    break;
  case 'start':
    {
      del.sync([path.resolve(process.cwd(), '.dll')], {
        force: true
      });
      const dllCompiler = webpack(configs.dll());

      dllCompiler.run((err, stats) => {
        if (runCallback(err, stats)) {
          console.log(chalk.green('\r\n dll complete \r\n'));
          runDev();
        }
      });
    }
    break;
  default:
}

function runDev() {
  webpackConfig = webpackConfig();
  const compiler = webpack(webpackConfig);
  let cDate = +new Date();

  // compiler.outputFileSystem = fs;

  compiler.run(runCallback);

  compiler.plugin('invalid', function () {
    clearConsole();
    cDate = +new Date();
    console.log(chalk.green('Compiling'));
  });

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.plugin('done', function (stats) {
    clearConsole();
    const ncDate = +new Date();

    console.log(chalk.green(`Compiled ${ncDate - cDate}ms`));
  });

  const devServer = new WebpackDevServer(compiler, webpackConfig.devServer);

  devServer.listen(webpackConfig.devServer.port, webpackConfig.devServer.host, function (serr) {
    if (serr) {
      console.log(chalk.red(serr));
      return;
    }
    clearConsole();
    console.log(chalk.cyan('\r\n\r\nStarting the development server...\r\n'));
  });
}


function runCallback(err, stats) {

  if (err) {
    console.log(chalk.red(err.stack || err));
    if (err.details) {
      console.log(chalk.red(err.details));
    }
    return false;
  }

  const info = stats.toJson();

  if (stats.hasErrors()) {
    console.log(chalk.red(info.errors));
  }

  if (stats.hasWarnings()) {
    console.log(chalk.yellow(info.warnings));
  }

  return true;
}
