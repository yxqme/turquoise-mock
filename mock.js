#!/usr/bin/env node

const { boot, watcher } = require('./dist/index.js');

boot();
watcher();
