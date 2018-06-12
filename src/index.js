#!/usr/bin/env node

const fs = require('fs');
const commander = require('commander');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const del = require('delete');
const path = require('path');
const clearConsole = require('react-dev-utils/clearConsole');

let baseConfig = require('./config');
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

// 默认输入帮助
if (!process.argv.slice(2).length) {
  commander.outputHelp();
}

function run(type, configPath) {

  if (configPath && fs.existsSync(path.resolve(process.cwd(), configPath))) {
    baseConfig = Object.assign(baseConfig, require(path.resolve(process.cwd(), configPath)));
  }

  // 设置开发环境
  if (type === 'start') {
    baseConfig.env = 'development';
    if (baseConfig.development) {
      baseConfig = Object.assign(baseConfig, baseConfig.development);
    }
  } else {
    baseConfig.env = 'production';
    if (baseConfig.production) {
      baseConfig = Object.assign(baseConfig, baseConfig.production);
    }
  }

  let webpackConfig = configs[type];

  switch (type) {
    case 'dll':
      if (!baseConfig.vendors && !baseConfig.vendor) {
        console.log(chalk.red('please config vendor or vendors'));
        return;
      }
      del.sync([path.resolve(process.cwd(), '.dll')], {
        force: true
      });
      webpack(webpackConfig(baseConfig)).run((err, stats) => {
        if (runCallback(err, stats)) {
          console.log(chalk.green('\r\ndll complete \r\n'));
        }
      });

      break;
    case 'build':
      del.sync([path.resolve(process.cwd(), baseConfig.path)], {
        force: true
      });
      webpack(webpackConfig(baseConfig)).run((err, stats) => {
        if (runCallback(err, stats)) {
          console.log(chalk.green('\r\nbuild complete \r\n'));
          if (baseConfig.afterBuild) {
            baseConfig.afterBuild(baseConfig);
          }
        }
      });

      break;
    case 'start':
      {
        del.sync([path.resolve(process.cwd(), '.dll')], {
          force: true
        });

        if (!baseConfig.vendors && !baseConfig.vendor) {
          runDev(webpackConfig);
        } else {
          const dllCompiler = webpack(configs.dll(baseConfig));

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
  const config = webpackConfig(baseConfig);
  const compiler = webpack(config);
  let cDate = +new Date();

  // 这段不能加。。。
  // compiler.run(runCallback);

  compiler.hooks.invalid.tap('SyncHook', function () {
    // clearConsole();
    cDate = +new Date();
    console.log(chalk.yellow('Compiling'));
  });

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.hooks.done.tap('SyncHook', function (stats) {
    // clearConsole();
    const ncDate = +new Date();

    console.log(chalk.green(`-----------------------------`));
    console.log();
  });

  const devServer = new WebpackDevServer(compiler, config.devServer);

  devServer.listen(config.devServer.port, config.devServer.host, function (serr) {
    if (serr) {
      console.log(chalk.red(serr));
      return;
    }
    // clearConsole();
    console.log(chalk.cyan('\r\n\r\nStarting the development server...\r\n'));
    console.log(chalk.green(`http://${config.devServer.host}:${config.devServer.port}${config.output.publicPath}`));
    console.log();
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
