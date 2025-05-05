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
    let date: Date | null = null;
    const isoRegex = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d+)Z$/;
    let match = timeString.match(isoRegex);
    if (match) {
      date = new Date(timeString);
    } else {
      const timeStringRegex = /(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})\.(\d+)\s([+-]\d{4})\s(\w+)\sm=\+(.+)/;
      match = timeString.match(timeStringRegex);
      if (!match) {
        return 'Некорректный формат времени';
      }

      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const hour = parseInt(match[4], 10);
      const minute = parseInt(match[5], 10);
      const second = parseInt(match[6], 10);

      const offsetSign = match[8].slice(0, 1);
      const offsetHours = parseInt(match[8].slice(1, 3), 10);
      const offsetMinutes = parseInt(match[8].slice(3, 5), 10);

      let utcMilliseconds = Date.UTC(year, month, day, hour, minute, second);

      const offsetTotalMinutes = offsetHours * 60 + offsetMinutes;
      const offsetInMillis = offsetSign === '+' ? offsetTotalMinutes * 60 * 1000 : -offsetTotalMinutes * 60 * 1000;

      date = new Date(utcMilliseconds - offsetInMillis);
    }

    const optionsDate: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = date.toLocaleDateString('ru-RU', optionsDate);

    const optionsTime: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric' };
    const formattedTime = date.toLocaleTimeString('ru-RU', optionsTime);

    return `${formattedDate} в ${formattedTime}`;
  } catch {
    return 'Ошибка при обработке времени';
  }
};

export const serializeTimeZToHumanDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const serializeTimeZToHumanYear = (timestamp: string | undefined): string => {
  if (!timestamp) return 'Нет данных';
  return new Date(timestamp).getFullYear().toString();
};
