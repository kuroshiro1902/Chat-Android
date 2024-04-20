function formatDate(date: Date): string {
  const day = date.getDay();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = `${date.getMinutes()}`.padStart(2, '0');
  const second = `${date.getSeconds()}`.padStart(2, '0');
  return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
}

export default formatDate;
