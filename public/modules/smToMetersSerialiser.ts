export const cmToMeters = (heightCm: string | null): string => {
  if (!heightCm) {
    console.log('Некорректный ввод');
    return '';
  }

  const height = parseFloat(heightCm);

  if (isNaN(height)) {
    console.log('Некорректный ввод');
    return '';
  }

  const meters = height / 100;
  return `${meters.toFixed(2)} м`;
};
