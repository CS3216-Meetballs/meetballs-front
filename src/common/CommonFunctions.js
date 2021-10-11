export function getFormattedDateTime(isoDate) {
  const date = new Date(isoDate);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleString('en-us', options);
}

export function getFormattedTime(date) {
  const options = {
    hour: 'numeric',
    minute: 'numeric',
  };
  return date.toLocaleString('en-us', options);
}

export function getFormattedDate(isoDate) {
  const date = new Date(isoDate);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  return date.toLocaleString('en-US', options);
}

export function getFormattedDuration(duration) {
  var remainingDuration = duration;
  var result = '';
  if (remainingDuration >= 3600000) {
    const hours = Math.floor(remainingDuration / 3600000);
    remainingDuration -= hours * 3600000;
    result += hours + 'h ';
  }
  const minutes = Math.floor(remainingDuration / 60000);
  remainingDuration -= minutes * 60000;
  result += minutes + 'min ';
  if (remainingDuration !== 0) {
    const seconds = Math.floor(remainingDuration / 1000);
    result += seconds + 's';
  }
  return result;
}

export function openLinkInNewTab(link) {
  const newWindow = window.open(link, '_blank', 'noopener,noreferer');
  if (newWindow) newWindow = null;
}

export function getDateInfo(isoDate, durationInMilli) {
  const date = new Date(isoDate);
  let options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };
  const dateStr = date.toLocaleString('en-US', options);

  options = {
    hour: 'numeric',
    minute: 'numeric',
  };
  const startTime = date.toLocaleString('en-US', options);
  date.setMilliseconds(date.getMilliseconds() + durationInMilli);
  const endTime = date.toLocaleString('en-US', options);

  const durationStr = getFormattedDuration(durationInMilli);

  return Object.freeze({
    date: dateStr,
    startTime: startTime,
    endTime: endTime,
    duration: durationStr,
  });
}

export function agendaReviver(key, value) {
  if (typeof value === 'string' && key === 'startTime') {
    if (value) {
      return new Date(value).getTime();
    }
  }
  return value;
}
