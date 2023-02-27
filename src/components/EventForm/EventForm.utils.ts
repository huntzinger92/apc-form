export const getDefaultDate = () => {
  const today = new Date();
  return `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
};

export const formatDateForPicker = (dateString: string) => {
  const dateObj = new Date(dateString);
  const utcMonth =
    (dateObj.getUTCMonth() + 1).toString().length === 1
      ? `0${(dateObj.getUTCMonth() + 1).toString()}`
      : (dateObj.getUTCMonth() + 1).toString();
  const utcDay =
    dateObj.getUTCDate().toString().length === 1
      ? `0${dateObj.getUTCDate().toString()}`
      : dateObj.getUTCDate().toString();
  return `${dateObj.getUTCFullYear()}-${utcMonth}-${utcDay}`;
};
