#!/usr/bin/env node

const fs = require('fs');
const commander = require('commander');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');
const del = require('delete');
const path = require('path');
const buildFolder = require('./folder');
const clearConsole = require('react-dev-utils/clearConsole');

let baseConfig = require('./config');

const configs = {
  // eslint-disable-next-line
  build: require('./production'),
  // eslint-disable-next-line
  start: require('./development'),
  // eslint-disable-next-line
  watch: require('./development'),
  // eslint-disable-next-line
  dll: require('./dll'),
};

commander
  .version(require('../package.json').version)
  .option('--init, init', 'init a config file', () => {
    init();
  })
  .option('--start, start [configPath]', 'start a dev server', (p) => {
    run('start', p);
  })
  .option('--watch, watch [configPath]', 'watch a dev server', (p) => {
    run('watch', p);
  })
  .option('--dll, dll [configPath]', 'build dll', (p) => {
    run('dll', p);
  })
  .option('--build, build [configPath]', 'build project', (p) => {
    run('build', p);
  })
  .parse(process.argv);

// 默认输入帮助
if (!process.argv.slice(2).length) {
  commander.outputHelp();
}

function init() {
  // 复制文件
  fs.copyFileSync(
    path.resolve(__dirname, './template/ywebpack.config.js'),
    path.resolve(process.cwd(), './ywebpack.config.js'),
  );

  const jsonPath = path.resolve(process.cwd(), './package.json');

  if (!fs.existsSync(jsonPath)) {
    console.log(chalk.red('file package.json could not be find'));
    return;
  }

  const json = JSON.parse(fs
    .readFileSync(jsonPath, {
      encoding: 'utf-8',
    })
    .toString());

  json.scripts.start = 'ywebpack start ./ywebpack.config.js';
  json.scripts.watch = 'ywebpack watch ./ywebpack.config.js';
  json.scripts.build = 'ywebpack build ./ywebpack.config.js';

  if (!json.browserslist) {
    json.browserslist = [
      'iOS >= 8',
      'Android >= 4.4',
      'ie >= 9',
      'Firefox >= 68',
      'Chrome >= 77',
      'last 2 QQAndroid version',
    ];
  }

  fs.writeFileSync(jsonPath, JSON.stringify(json, null, 2), {
    encoding: 'utf-8',
  });

  console.log(chalk.green('init completed'));
}

function run(type, configPath) {
  if (configPath && fs.existsSync(path.resolve(process.cwd(), configPath))) {
    // eslint-disable-next-line
    baseConfig = Object.assign(baseConfig, require(path.resolve(process.cwd(), configPath)));
  }

  // 设置开发环境
  if (type === 'start' || type === 'watch') {
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

  const webpackConfig = configs[type];

  switch (type) {
    case 'dll':
      {
        const dllConfig = webpackConfig(baseConfig, true);

        if (dllConfig) {
          webpack(dllConfig).run((err, stats) => {
            if (runCallback(err, stats)) {
              console.log(chalk.green('\r\ndll complete \r\n'));
            }
          });
        }
      }

      break;
    case 'build':
      {
        const dllConfig = configs.dll(baseConfig);

        del.sync([path.resolve(process.cwd(), baseConfig.path)], {
          force: true,
        });

        if (dllConfig) {
          const dllCompiler = webpack(dllConfig);

          dllCompiler.run((err, stats) => {
            if (runCallback(err, stats)) {
              console.log(chalk.green('\r\n dll complete \r\n'));
              runBuild(webpackConfig);
            }
          });
        } else {
          runBuild(webpackConfig);
        }
      }

      break;
    case 'watch':
    case 'start':
      {
        const dllConfig = configs.dll(baseConfig);

        if (dllConfig) {
          const dllCompiler = webpack(dllConfig);

          dllCompiler.run((err, stats) => {
            if (runCallback(err, stats)) {
              console.log(chalk.green('\r\n dll complete \r\n'));
              runDev(webpackConfig, type);
            }
          });
        } else {
          runDev(webpackConfig, type);
        }
      }
      break;
    default:
  }
}

function runBuild(webpackConfig) {
  webpack(webpackConfig(baseConfig)).run((err, stats) => {
    if (runCallback(err, stats)) {
      console.log(chalk.green('\r\nbuild complete \r\n'));
      if (baseConfig.afterBuild) {
        if (baseConfig.folder === true) {
          buildFolder(baseConfig);
        }
        baseConfig.afterBuild(baseConfig);
      }
    }
  });
}

function runDev(webpackConfig, type) {
  const config = webpackConfig(baseConfig);
  const compiler = webpack(config);
  let cDate = +new Date();

  // 这段不能加。。。
  // compiler.run(runCallback);

  compiler.hooks.invalid.tap('SyncHook', () => {
    // clearConsole();
    cDate = +new Date();
    console.log(chalk.yellow('Compiling'));
  });

  // "done" event fires when Webpack has finished recompiling the bundle.
  // Whether or not you have warnings or errors, you will get this event.
  compiler.hooks.done.tap('SyncHook', (stats) => {
    // clearConsole();
    const ncDate = +new Date();

    console.log(chalk.green('-----------------------------'));
    console.log();
  });
  if (type === 'start') {
    const devServer = new WebpackDevServer(compiler, config.devServer);

    devServer.listen(config.devServer.port, config.devServer.host, (serr) => {
      if (serr) {
        console.log(chalk.red(serr));
        return;
      }
      // clearConsole();
      console.log(chalk.cyan('\r\n\r\nStarting the development server...\r\n'));
      console.log(chalk.green(`${config.devServer.https ? 'https' : 'http'}://${config.devServer.host}:${
        config.devServer.port
        }${config.output.publicPath}`));
      console.log();

      if (baseConfig.afterStart) {
        baseConfig.afterStart(baseConfig);
      }
    });
  } else {
    compiler.watch(
      {
        aggregateTimeout: 300,
      },
      (err, stats) => {
        // if (runCallback(err, stats)) {
        //   console.log(chalk.green('[webpack]: build done!\r\n'));
        // }
      },
    );
  }
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
