export function formatDate(pubDate: string): string {
  return new Date(pubDate)
    .toLocaleDateString('uk-UA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .replace(' р.', '');
}