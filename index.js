'use strict';

const exec = require('child_process').exec;
const promisify = require('util').promisify;

const asyncExec = promisify(exec);

const getAllChromeProcesses = async () => {
  const command = 'wmic process where Caption=\'chrome.exe\' get CommandLine,ProcessId /value';
  const { stdout } = await asyncExec(command);
  const regex = /CommandLine=(.+)\s+ProcessId=(\d+)/g;
  const processIds = [];
  do {
    var match = regex.exec(stdout);
    if (match) {
      const { 1:commandLine, 2:processId } = [...match];
      if (commandLine.indexOf('--extension-process') < 0 && commandLine.indexOf('--type=renderer') > 0) {
          processIds.push(processId);
      }
    }
  } while (match);
  return processIds;
};

const KillProcess = processList => {
  const command = 'taskkill /PID {ID} /F';
  processList.forEach(async processId => {
    await asyncExec(command.replace('{ID}', processId));
  });
  console.log('Found [' + processList.length + '] chrome process');
};

(async () => {
  const processList = await getAllChromeProcesses();
  KillProcess(processList);
})();
