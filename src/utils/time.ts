export const msToMinSec = (ms: number): string => {
  let hours = Math.floor(ms / 3600000);
  let minutes = Math.floor((ms % 3600000) / 60000);
  let seconds = Number((((ms % 3600000) % 60000) / 1000).toFixed(0));

  if (seconds === 60) {
    minutes++;
    seconds -= 60;
  }

  if (minutes >= 60) {
    minutes -= 60;
    hours += 1;
  }

  return `${hours ? hours + ':' : ''}${
    minutes ? (minutes < 10 ? '0' : '') + minutes : '00'
  }:${seconds ? (seconds < 10 ? '0' : '') + seconds : '00'}`;
};
