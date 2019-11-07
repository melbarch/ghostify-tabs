const getAllChromeProcesses = () => {
  return ['0','1'];
};

const KillProcess = (process) => {
  console.log('killing process : ' + process);
};

const process = getAllChromeProcesses();
process.forEach(KillProcess);

console.log('Done successfully');
