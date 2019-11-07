'use strict';

const exec = require('child_process').exec;
const promisify = require('util').promisify;

const asyncExec = promisify(exec);

const getAllChromeProcesses = async () => {
  const command =
    'wmic process where Caption=\'chrome.exe\' get CommandLine,ProcessId /value';
  const result = await asyncExec(command);
  const stdout = result.stdout;
  const regex = /CommandLine=(.+)\s+ProcessId=(\d+)/g;
  const processIds = [];
  do {
    var match = regex.exec(stdout);
    if (match) {
      const IsExtension = match[1].indexOf('--extension-process') > 0;
      if (!IsExtension) {
        processIds.push(match[2]);
      }
    }
  } while (match);

  return processIds;
};

const KillProcess = processList => {
  const command = 'echo {ID}';
  processList.forEach(async processId => {
    await asyncExec(command.replace('{ID}', processId));
  });
  console.log('Found [' + processList.length + '] chrome process');
};

(async () => {
  const processList = await getAllChromeProcesses();
  KillProcess(processList);
})();
