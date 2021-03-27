export const timeDifference = (date: Date): number => {
  return new Date(date).getTime() - new Date().getTime();
};
