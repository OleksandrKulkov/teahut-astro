export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function exchangePrice(price) {
  const coursePrice = 39 * price;
 return coursePrice;
}