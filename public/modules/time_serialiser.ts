function pluralizeYears(years: number): string {
  const lastDigit = years % 10;
  const lastTwoDigits = years % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return 'лет';
  }

  switch (lastDigit) {
    case 1:
      return 'год';
    case 2:
    case 3:
    case 4:
      return 'года';
    default:
      return 'лет';
  }
}

export const serializeTimeZToHumanTimeAndYearsOld = (timeString: string): string => {
  try {
    const timeStringRegex =
      /(\d{4})-(\d{1,2})-(\d{1,2})\s(\d{1,2}):(\d{1,2}):(\d{1,2})\.(\d+)\s([+-]\d{4})\s(\w+)\sm=\+(.+)/;
    const match = timeString.match(timeStringRegex);

    if (!match) {
      return 'Некорректный формат времени';
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);
    const offsetHours = parseInt(match[8].slice(0, 3), 10);

    const utcHour = hour - offsetHours;
    const adjustedHour = utcHour < 0 ? utcHour + 24 : utcHour;

    const date = new Date(year, month, day, adjustedHour, minute);

    const optionsWithoutYear: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    const formattedDateWithoutYear = date.toLocaleDateString('ru-RU', optionsWithoutYear);

    const currentDate = new Date();
    let years = currentDate.getFullYear() - date.getFullYear();

    if (
      currentDate.getMonth() < date.getMonth() ||
      (currentDate.getMonth() === date.getMonth() && currentDate.getDate() < date.getDate())
    ) {
      years--;
    }

    const yearsString = `${years} ${pluralizeYears(years)}`;

    return `${formattedDateWithoutYear} ${date.getFullYear()}, ${yearsString}`;
  } catch {
    return 'Ошибка при обработке времени';
  }
};

export const serializeTimeZToHumanTime = (timeString: string): string => {
  try {
    const timeStringRegex = /(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})\.(\d+)\s([+-]\d{4})\s(\w+)\sm=\+(.+)/;
    const match = timeString.match(timeStringRegex);

    if (!match) {
      return 'Некорректный формат времени';
    }

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10) - 1;
    const day = parseInt(match[3], 10);
    const hour = parseInt(match[4], 10);
    const minute = parseInt(match[5], 10);
    const second = parseInt(match[6], 10);
    // const milliseconds = parseInt(match[7], 10); // Not directly used in Date creation

    const offsetSign = match[8].slice(0, 1);
    const offsetHours = parseInt(match[8].slice(1, 3), 10);
    const offsetMinutes = parseInt(match[8].slice(3, 5), 10);

    let utcMilliseconds = Date.UTC(year, month, day, hour, minute, second);

    const offsetTotalMinutes = offsetHours * 60 + offsetMinutes;
    const offsetInMillis = offsetSign === '+' ? offsetTotalMinutes * 60 * 1000 : -offsetTotalMinutes * 60 * 1000;

    const date = new Date(utcMilliseconds - offsetInMillis);

    const optionsDate: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('ru-RU', optionsDate);

    const optionsTime: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = date.toLocaleTimeString('ru-RU', optionsTime);

    return `${formattedDate} в ${formattedTime}`;
  } catch (error) {
    return 'Ошибка при обработке времени';
  }
};

export const formatDateTime = (date: Date): string => {
  const optionsDate: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  const formattedDate = date.toLocaleDateString('ru-RU', optionsDate);

  const optionsTime: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };
  const formattedTime = date.toLocaleTimeString('ru-RU', optionsTime);

  return `${formattedDate} в ${formattedTime}`;
};

export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return formatDateTime(date);
};
