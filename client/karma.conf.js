// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

console.log('ENV', process.env.NODE_ENV)

const isCI = process.env.NODE_ENV && process.env.NODE_ENV.includes('testing')
let launcher = [require('karma-chrome-launcher')]

if (isCI) {
    launcher = [require('karma-phantomjs-launcher')]
}

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      ...launcher,
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    files: [
        './node_modules/phantomjs-polyfill/bind-polyfill.js'
    ],
    exclude: [
        './src/app/race/**/*.js'
    ],
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: 'debug',
    autoWatch: !isCI,
    browsers: isCI ? ['PhantomJS'] : ['Chrome'],
    singleRun: isCI,
    phantomjsLauncher: {
        exitOnResourceError: false
    }
  });
};