#!/usr/bin/env node

'use strict';

const axios = require('axios');
const spawn = require('cross-spawn');
const yargs = require('yargs');

const chalk = require('chalk');
const latestVersion = require('latest-version');
const pkg = require('./package.json');

// Display update notification if it's not the last version
latestVersion('epfl-elements-toolbox-utils')
  .then(version => {
    if (version !== pkg.version) {
      const msg = ` Version ${version} (current ${pkg.version}) of epfl-elements-toolbox-utils is available ! `;
      console.log(`
  ${chalk.white.bgRed.bold(` ${' '.repeat(msg.length)} \n ${msg} \n${' '.repeat(msg.length)}  `)}

  To update your beloved builder, do :
  $ ${chalk.green('yarn upgrade epfl-elements-toolbox-utils')} (recommended)
  or
  $ ${chalk.green('npm update epfl-elements-toolbox-utils')}
      `);
    }
  })
  .catch(err => err);

const script = process.argv[2];
const args = process.argv[3] ? '--' + process.argv[3] : process.argv[3];

let env = script === 'build' ? '--production' : '--dev';

const binaries = ['deploy'];

if (binaries.includes(script)) {
  spawn(
    'sh',
    [`./bin/${script}.sh`, '--project', process.cwd(), env, args],
    { stdio: 'inherit', cwd: './node_modules/epfl-elements-toolbox-utils' },
  );
} else {
  spawn(
    'gulp',
    [script, '--project', process.cwd(), env, args],
    { stdio: 'inherit', cwd: './node_modules/epfl-elements-toolbox-utils' },
  );
}
