import chalk from 'chalk';
const log = console.log;

const command = chalk.bold.green;
const note = chalk.bold.blue;
const important = chalk.bold.red;

log(command('setup-variables'), '\tSetup environment and netrc variables.');
log(command('show-variables'), '\t\tShow environment and netrc variables.');
log(
  `${important(
    'IMPORTANT',
  )}: It's mandatory to setup all environment variables before execute the app.`,
);
log();
log(command('android-dev'), '\t\tDebug with dev configs.');
log(command('android-qas'), '\t\tDebug with qas configs.');
log(command('android-prod'), '\t\tDebug with prod configs.');
log(command('android-dev-release'), '\tRelease with dev configs.');
log(command('android-qas-release'), '\tRelease with qas configs.');
log(command('android-prod-release'), '\tRelease with prod configs.');
log(
  `${note('NOTE')}: Add ${chalk.bold(
    '-bundle',
  )} if you'd like to generate a bundle (e.g. android-dev-bundle)`,
);
log();
log(command('ios-dev'), '\t\tDebug with dev configs.');
log(command('ios-qas'), '\t\tDebug with qas configs.');
log(command('ios-prod'), '\t\tDebug with prod configs.');
log(`${note('NOTE')}: Make an iOS release with XCode.`);
