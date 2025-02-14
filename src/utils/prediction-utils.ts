
export const formatPoleTime = (input: string) => {
  const numbers = input.replace(/\D/g, '');
  const limited = numbers.slice(0, 6);
  if (limited.length < 6) return limited;
  const minutes = parseInt(limited[0]);
  const seconds = parseInt(limited[1] + limited[2]);
  if (seconds > 59) return "";
  return `${minutes}:${limited[1]}${limited[2]}.${limited[3]}${limited[4]}${limited[5]}`;
};
