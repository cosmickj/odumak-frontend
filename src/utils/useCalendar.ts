// https://bobbyhadz.com/blog/javascript-get-previous-sunday
export const getPreviousSunday = (date = new Date()) => {
  const result = new Date();
  result.setDate(date.getDate() - date.getDay());
  result.setHours(0, 0, 0, 0);
  return result;
};
