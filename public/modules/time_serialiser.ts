export const serializeTime = (timeString: string): string => {
  try {
    const timeStringRegex =
      /(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):(\d{2})\.(\d+)\s([+-]\d{4})\s(\w+)\sm=\+(\d+\.\d+)/;
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
  } catch (error) {
    console.error('Ошибка при обработке строки времени:', error);
    return 'Ошибка при обработке времени';
  }
};

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
