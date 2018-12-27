---
title: create-react-app 源代码简析(1)
commentIdentifier: create-react-app 源代码简析(1)
date: '2018-12-30'
tags: ['webpack', 'react', 'npm']
---

## 前言

> `create-react-app` 简称为 `CRA`, 之后均用 `CRA`表示 `create-react-app`

> `create-react-app`是个多包仓库, 我 fork 了一份([地址](https://github.com/JennerChen/create-react-app)), 以便追溯。

> 核心包: `react-scripts` 简析版本为`2.1.1`, 发布日期为 2018-11-01

> `typescript` 由于我不熟悉, 故相关部分会会不准确,请见谅！

`webpack`是功能强大的自动化前端构建工具, 但是配置复杂多变。`create-react-app`将`webpack`配置隐藏起来,适合新入门`react`的开发者。
另外一种使用场景为需要同时在多个项目中开发, 又想保证不同项目配置统一, `create-react-app`是一种不错的选择。为了能在工作中用好`create-react-app`, 所以需要深入了解去实现源码,故作此笔记。

## 项目目录介绍

整个 CRA 包含多个 npm 包, 分别放置于 `~/packages` 目录下

- create-react-app : 安装脚手架
- react-scripts: 核心包
- eslint-config-react-app: eslint 配置
- react-dev-utils: 构建过程中需要用到的工具方法
- react-error-overly: react 构建出错时, 页面弹出的 ui 组件
- babel-preset-react-app: 构建时, react 的 babel 依赖
- babel-plugin-named-asset-import, confusing-browser-globals 等一些辅助功能的文件

`~/docusaurus`下的为文档存放区, 基于 FB 的`docusaurus`文档框架编写, 我的`mogul`的文档也是基于该框架。有空我会另外写一遍笔记, 介绍 docusaurus。

其他都是一些 npm 发布, github, ci 相关的配置, 不影响业务逻辑, 所以全都跳过。

## CRA 安装

```bash
npx create-react-app my-app
cd my-app
npm start
```

为什么 🤔`npx create-react-app my-app`能够执行?
在 `~/packages/create-react-app/package.json`

```bash{2}
"bin": {
   "create-react-app": "./index.js"
}
```

> npx 方式 bin."create-react-app" 不是一定需要的, 但最好保持一致

查看代码位于`~/packages/create-react-app/index.js`

```js{2}
// 这一行很特别, 必须加入这一行, 才可以让该文件变为命令行可执行文件
#!/usr/bin/env node
'use strict';

// 一些nodejs版本的检查
var chalk = require('chalk');

var currentNodeVersion = process.versions.node;
var semver = currentNodeVersion.split('.');
var major = semver[0];

if (major < 8) {
  console.error(
    chalk.red(
      'You are running Node ' +
        currentNodeVersion +
        '.\n' +
        'Create React App requires Node 8 or higher. \n' +
        'Please update your version of Node.'
    )
  );
  process.exit(1);
}

//启动文件
require('./createReactApp');

```

于`~/packages/create-react-app/createReactApp.js`

设置项目名称

```javascript{7-9}
let projectName

const program = new commander.Command(packageJson.name)
  .version(packageJson.version)
  .arguments('<project-directory>')
  .usage(`${chalk.green('<project-directory>')} [options]`)
  .action(name => {
    projectName = name // 获取项目名称
  })

//...然后执行一系列项目名称的检验
// 执行创建方法
createApp(
  projectName,
  program.verbose,
  program.scriptsVersion,
  program.useNpm,
  program.usePnp,
  program.typescript,
  hiddenProgram.internalTestingTemplate
)
```

```javascript{23,25-28,39-42}
/**
 * 注意, 只有 name 参数是必要的，其他的都是可选
 * template 参数在实际使用永远为false
 */
function createApp(
  name,
  verbose,
  version,
  useNpm,
  usePnp,
  useTypescript,
  template
) {
  const root = path.resolve(name)
  const appName = path.basename(root)

  /**
   * 检查项目名称是否合法
   * 包含:
   *  1.检查是否符合 npm命名规范
   *  2.名称黑名单检测: 不允许 react, react-dom, react-scripts等
   */
  checkAppName(appName)
  // 检查目录并不存在， 如果存在, 那么检查文件是否可以创建
  fs.ensureDirSync(name)
  if (!isSafeToCreateProjectIn(root, name)) {
    process.exit(1)
  }

  console.log(`Creating a new React app in ${chalk.green(root)}.`)
  console.log()

  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
  }
  // 写入package.json文件
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL
  )

  // yarn或者npm 选择判断,以及权限判定
  const useYarn = useNpm ? false : shouldUseYarn()
  const originalDirectory = process.cwd()
  process.chdir(root)
  if (!useYarn && !checkThatNpmCanReadCwd()) {
    process.exit(1)
  }

  if (!semver.satisfies(process.version, '>=6.0.0')) {
    console.log(
      chalk.yellow(
        `You are using Node ${
          process.version
        } so the project will be bootstrapped with an old unsupported version of tools.\n\n` +
          `Please update to Node 6 or higher for a better, fully supported experience.\n`
      )
    )
    // Fall back to latest supported react-scripts on Node 4
    version = 'react-scripts@0.9.x'
  }

  if (!useYarn) {
    const npmInfo = checkNpmVersion()
    if (!npmInfo.hasMinNpm) {
      if (npmInfo.npmVersion) {
        console.log(
          chalk.yellow(
            `You are using npm ${
              npmInfo.npmVersion
            } so the project will be boostrapped with an old unsupported version of tools.\n\n` +
              `Please update to npm 3 or higher for a better, fully supported experience.\n`
          )
        )
      }
      // Fall back to latest supported react-scripts for npm 3
      version = 'react-scripts@0.9.x'
    }
  } else if (usePnp) {
    const yarnInfo = checkYarnVersion()
    if (!yarnInfo.hasMinYarnPnp) {
      if (yarnInfo.yarnVersion) {
        chalk.yellow(
          `You are using Yarn ${
            yarnInfo.yarnVersion
          } together with the --use-pnp flag, but Plug'n'Play is only supported starting from the 1.12 release.\n\n` +
            `Please update to Yarn 1.12 or higher for a better, fully supported experience.\n`
        )
      }
      // 1.11 had an issue with webpack-dev-middleware, so better not use PnP with it (never reached stable, but still)
      usePnp = false
    }
  }
  // 应用 yarn的缓存功能
  if (useYarn) {
    fs.copySync(
      require.resolve('./yarn.lock.cached'),
      path.join(root, 'yarn.lock')
    )
  }

  // 生成代码
  run(
    root,
    appName,
    version,
    verbose,
    originalDirectory,
    template,
    useYarn,
    usePnp,
    useTypescript
  )
}
```

```javascript{13,67-77}
function run(
  root,
  appName,
  version,
  verbose,
  originalDirectory,
  template,
  useYarn,
  usePnp,
  useTypescript
) {
  // 获取react-scripts, 如果设置了版本, 那么会安装对应版本的 react-scripts, 否则就为 react-scripts
  const packageToInstall = getInstallPackage(version, originalDirectory)
  const allDependencies = ['react', 'react-dom', packageToInstall]
  if (useTypescript) {
    // TODO: get user's node version instead of installing latest
    allDependencies.push(
      '@types/node',
      '@types/react',
      '@types/react-dom',
      '@types/jest',
      'typescript'
    )
  }

  console.log('Installing packages. This might take a couple of minutes.')
  // promise形式安装依赖
  getPackageName(packageToInstall)
    .then(packageName =>
      // 是否使用 yarn的离线功能
      checkIfOnline(useYarn).then(isOnline => ({
        isOnline: isOnline,
        packageName: packageName,
      }))
    )
    .then(info => {
      const isOnline = info.isOnline
      const packageName = info.packageName
      console.log(
        `Installing ${chalk.cyan('react')}, ${chalk.cyan(
          'react-dom'
        )}, and ${chalk.cyan(packageName)}...`
      )
      console.log()

      // 真正执行安装依赖
      return install(
        root,
        useYarn,
        usePnp,
        allDependencies,
        verbose,
        isOnline
      ).then(() => packageName)
    })
    .then(async packageName => {
      // 再次检测node版本(个人感觉有点多余😅)
      checkNodeVersion(packageName)
      // 把 修改 react, react-dom 依赖版本写法 e.g. 16.0.2 => ^16.0.2
      setCaretRangeForRuntimeDeps(packageName)

      const pnpPath = path.resolve(process.cwd(), '.pnp.js')

      const nodeArgs = fs.existsSync(pnpPath) ? ['--require', pnpPath] : []

      // bash 调用 react-scripts中的init脚本, 执行模板初始化
      await executeNodeScript(
        {
          cwd: process.cwd(),
          args: nodeArgs,
        },
        [root, appName, verbose, originalDirectory, template],
        `var init = require('${packageName}/scripts/init.js');
        init.apply(null, JSON.parse(process.argv[1]));
      `
      )

      if (version === 'react-scripts@0.9.x') {
        console.log(
          chalk.yellow(
            `\nNote: the project was bootstrapped with an old unsupported version of tools.\n` +
              `Please update to Node >=6 and npm >=3 to get supported tools in new projects.\n`
          )
        )
      }
    })
    .catch(reason => {
      // 在 错误处理上, 需要保证打印足够多的日志,并且还原设置
      console.log()
      console.log('Aborting installation.')
      if (reason.command) {
        console.log(`  ${chalk.cyan(reason.command)} has failed.`)
      } else {
        console.log(chalk.red('Unexpected error. Please report it as a bug:'))
        console.log(reason)
      }
      console.log()

      // On 'exit' we will delete these files from target directory.
      const knownGeneratedFiles = ['package.json', 'yarn.lock', 'node_modules']
      const currentFiles = fs.readdirSync(path.join(root))
      currentFiles.forEach(file => {
        knownGeneratedFiles.forEach(fileToMatch => {
          // This remove all of knownGeneratedFiles.
          if (file === fileToMatch) {
            console.log(`Deleting generated file... ${chalk.cyan(file)}`)
            fs.removeSync(path.join(root, file))
          }
        })
      })
      const remainingFiles = fs.readdirSync(path.join(root))
      if (!remainingFiles.length) {
        // Delete target folder if empty
        console.log(
          `Deleting ${chalk.cyan(`${appName}/`)} from ${chalk.cyan(
            path.resolve(root, '..')
          )}`
        )
        process.chdir(path.resolve(root, '..'))
        fs.removeSync(path.join(root))
      }
      console.log('Done.')
      process.exit(1)
    })
}
```

至此, `create-react-app` 跳转至 `react-scripts`的`init`脚本, init 脚本主要是生成 template 文件

于 `~/packages/react-scripts/scripts/init.js`

```javascript{20-25}
function(
  appPath,
  appName,
  verbose,
  originalDirectory,
  template
) {
  const ownPath = path.dirname(
    require.resolve(path.join(__dirname, '..', 'package.json'))
  );
  const appPackage = require(path.join(appPath, 'package.json'));
  const useYarn = fs.existsSync(path.join(appPath, 'yarn.lock'));

  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {};

  const useTypeScript = appPackage.dependencies['typescript'] != null;

  // 设置脚本
  appPackage.scripts = {
    start: 'react-scripts start',
    build: 'react-scripts build',
    test: 'react-scripts test',
    eject: 'react-scripts eject',
  };

  // 设置 eslint 规则, 这在稍后该属性会被读取
  appPackage.eslintConfig = {
    extends: 'react-app',
  };

  // 设置 浏览器兼容 browserslist
  appPackage.browserslist = defaultBrowsers;

  // 再次写入package.json
  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );

  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'));
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    );
  }

  // ❗️注意, 实际template永远为 false, 只有当开发create-react-app时, 可能把其设为true
  const templatePath = template
    ? path.resolve(originalDirectory, template)
    : path.join(ownPath, useTypeScript ? 'template-typescript' : 'template');

  // 复制 `~/packages/react-scripts/template` 到模板目录
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
    return;
  }

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  try {
    fs.moveSync(
      path.join(appPath, 'gitignore'),
      path.join(appPath, '.gitignore'),
      []
    );
  } catch (err) {
    // Append if there's already a `.gitignore` file there
    if (err.code === 'EEXIST') {
      const data = fs.readFileSync(path.join(appPath, 'gitignore'));
      fs.appendFileSync(path.join(appPath, '.gitignore'), data);
      fs.unlinkSync(path.join(appPath, 'gitignore'));
    } else {
      throw err;
    }
  }

  let command;
  let args;

  if (useYarn) {
    command = 'yarnpkg';
    args = ['add'];
  } else {
    command = 'npm';
    args = ['install', '--save', verbose && '--verbose'].filter(e => e);
  }
  args.push('react', 'react-dom');

  // Install additional template dependencies, if present
  const templateDependenciesPath = path.join(
    appPath,
    '.template.dependencies.json'
  );
  if (fs.existsSync(templateDependenciesPath)) {
    const templateDependencies = require(templateDependenciesPath).dependencies;
    args = args.concat(
      Object.keys(templateDependencies).map(key => {
        return `${key}@${templateDependencies[key]}`;
      })
    );
    fs.unlinkSync(templateDependenciesPath);
  }

  // Install react and react-dom for backward compatibility with old CRA cli
  // which doesn't install react and react-dom along with react-scripts
  // or template is presetend (via --internal-testing-template)
  if (!isReactInstalled(appPackage) || template) {
    console.log(`Installing react and react-dom using ${command}...`);
    console.log();

    const proc = spawn.sync(command, args, { stdio: 'inherit' });
    if (proc.status !== 0) {
      console.error(`\`${command} ${args.join(' ')}\` failed`);
      return;
    }
  }

  if (useTypeScript) {
    verifyTypeScriptSetup();
  }

  // 尝试 git初始化
  if (tryGitInit(appPath)) {
    console.log();
    console.log('Initialized a git repository.');
  }

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }
  //  ..........
};
```

最后, 完成项目生成, `react-scripts`成功安装！

#### 小结一下

> 纵览 `create-react-app`项目生成, 其实就是一个 bash 脚本的 js 版本。脚本内包含大量边界情况的判断,非常值得学习。另外, 如果要执行自己的 webpack 工具包, 那么只要稍微修改一下, 就能成为你的脚本, 值得收藏

## react-scripts

CRA 中, 一共有 4 个脚本, 重点是 `start`, `build`, 故只会对开发和生产构建深入了解。😁 我相信你读这篇文章, 一定也特别想了解这 2 个脚本

```js
{
    start: 'react-scripts start', // webpack开发模式
    build: 'react-scripts build',// webpack生产模式
    test: 'react-scripts test', // 测试
    eject: 'react-scripts eject', // 重置
}
```

- test: 测试页面, 这个脚本我从没使用过, 大致浏览过代码, 只是调用 `jest`进行测试 ui, 但是我对 ui 测试的必要性抱有很大疑虑
- eject: 将 CRA 隐藏的脚本, 暴露出来, 完全自定义。(我用这个脚本, 为什么不自己写, 就因为你这个完善??)

### 开发构建

```bash
yarn run start
```

此时会执行 `~/packages/react-scripts/bin/index.js` 然后通过跳板, 执行 `~/packages/react-scripts/scripts/start.js`

首先检测依赖

```javascript
// react-scripts 使用了诸如 eslint, jest 等依赖,
// 但是用户会在自己的项目中再次安装这些依赖, 故会导致潜在错误, 所以提示用户删除这些依赖
const verifyPackageTree = require('./utils/verifyPackageTree')
// 当然, 用户也可以通过设置 SKIP_PREFLIGHT_CHECK=true 跳过这步检测
if (process.env.SKIP_PREFLIGHT_CHECK !== 'true') {
  verifyPackageTree()
}
// typescript相关的检测, 我对 typescript不是很熟悉, 跳过
const verifyTypeScriptSetup = require('./utils/verifyTypeScriptSetup')
verifyTypeScriptSetup()

// 略过...等等一系类的变量定义...

const { checkBrowsers } = require('react-dev-utils/browsersHelper');
// 检测浏览器, 即选择一个浏览器打开页面
// 如果系统存在默认浏览器, 那么会选择他, 如果没有, 那么会弹出提示, 要求用户选择
checkBrowsers(paths.appPath, isInteractive)
  .then(() => {
    // We attempt to use the default port but if it is busy, we offer the user to
    // run on a different port. `choosePort()` Promise resolves to the next free port.
    // 基于HOST选择端口, 如果冲突, 给出相应提示
    return choosePort(HOST, DEFAULT_PORT);
  })
  .then(port => {
    if (port == null) {
      // We have not found a port.
      return;
    }
    // 🔥获取整个 webpack dev 环境配置, 🔑关键部分,稍后详解
    const config = configFactory('development');
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    const appName = require(paths.appPackageJson).name;
    const urls = prepareUrls(protocol, HOST, port);
    // Create a webpack compiler that is configured with custom messages.
    const compiler = createCompiler(webpack, config, appName, urls, useYarn);
    // Load proxy config
    const proxySetting = require(paths.appPackageJson).proxy;
    const proxyConfig = prepareProxy(proxySetting, paths.appPublic);
    // Serve webpack assets generated by the compiler over a web server.
    // 构建 devServer, 传入 proxy, 如果需要自定义devServer都在这里
    const serverConfig = createDevServerConfig(
      proxyConfig,
      urls.lanUrlForConfig
    );
    // compose devServer和 webpack;
    const devServer = new WebpackDevServer(compiler, serverConfig);
    // 启动服务
    devServer.listen(port, HOST, err => {
      if (err) {
        return console.log(err);
      }
      if (isInteractive) {
        clearConsole();
      }
      console.log(chalk.cyan('Starting the development server...\n'));
      // 打开浏览器
      openBrowser(urls.localUrlForBrowser);
    });

    // 一些错误处理
    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close();
        process.exit();
      });
    });
  })
  .catch(err => {
    if (err && err.message) {
      console.log(err.message);
    }
    process.exit(1);
  });
```

`build` 版本的启动和 `start` 几乎一样, 只是去掉了 webpackDevServer, 另外加了
关于webpack配置详解,请见[create-react-app 源代码简析(2)](./2)

