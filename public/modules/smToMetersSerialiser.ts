export const cmToMeters = (heightCm: string | null): string => {
  if (!heightCm) {
    return '';
  }

  const height = parseFloat(heightCm);

  if (isNaN(height)) {
    return '';
  }

  const meters = height / 100;
  return `${meters.toFixed(2)}`;
};
