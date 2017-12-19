#!/usr/bin/env node

const fs = require('fs');
const commander = require('commander');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const del = require('delete');
const path = require('path');
const clearConsole = require('react-dev-utils/clearConsole');

let config = require('./config');
const configs = {
  build: require('./production'),
  start: require('./development'),
  dll: require('./dll'),
};

commander
  .version(require('../package.json').version)
  .option('--start, start [configPath]', 'start a dev server', function (path) {
    run('start', path);
  })
  .option('--dll, dll [configPath]', 'build dll', function (path) {
    run('dll', path);
  })
  .option('--build, build [configPath]', 'build project', function (path) {
    run('build', path);
  }).parse(process.argv);

function run(type, configPath) {

  if (configPath && fs.existsSync(path.resolve(process.cwd(), configPath))) {
    config = Object.assign(config, require(path.resolve(process.cwd(), configPath)));
  }

  let webpackConfig = configs[type];

  switch (type) {
    case 'dll':
      if (!config.vendors && !config.vendor) {
        console.log(chalk.red('please config vendor or vendors'));
        return;
      }
      del.sync([path.resolve(process.cwd(), '.dll')], {
        force: true
      });
      webpack(webpackConfig()).run((err, stats) => {
        if (runCallback(err, stats)) {
          console.log(chalk.green('\r\ndll complete \r\n'));
        }
      });

      break;
    case 'build':
      del.sync([path.resolve(process.cwd(), config.path)], {
        force: true
      });
      webpack(webpackConfig()).run((err, stats) => {
        if (runCallback(err, stats)) {
          console.log(chalk.green('\r\nbuild complete \r\n'));
          if (config.afterBuild) {
            config.afterBuild(config);
          }
        }
      });

      break;
    case 'start':
      {
        del.sync([path.resolve(process.cwd(), '.dll')], {
          force: true
        });

        if (!config.vendors && !config.vendor) {
          runDev();
        } else {
          const dllCompiler = webpack(configs.dll());

          dllCompiler.run((err, stats) => {
            if (runCallback(err, stats)) {
              console.log(chalk.green('\r\n dll complete \r\n'));
              runDev(webpackConfig);
            }
          });
        }
      }
      break;
    default:
  }
}

function runDev(webpackConfig) {
  const config = webpackConfig();
  const compiler = webpack(config);
  let cDate = +new Date();

  // 这段不能加。。。
  // compiler.run(runCallback);

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

    console.log(chalk.green(`http://${config.devServer.host}:${config.devServer.port}${config.output.publicPath}`));
    console.log(chalk.green(`Compiled ${ncDate - cDate}ms`));
  });

  const devServer = new WebpackDevServer(compiler, config.devServer);

  devServer.listen(config.devServer.port, config.devServer.host, function (serr) {
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
