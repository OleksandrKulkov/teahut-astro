export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function slugify(string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function generateCategoryData(categories) {
  let categoryData = [];
  categories.forEach((category) => {
    categoryData.push({
      name: category,
      slug: `${slugify(category)}`,
    });
  });
  return categoryData;
}

export function exchangePrice(price) {
  const coursePrice = 39 * price;
 return coursePrice;
}