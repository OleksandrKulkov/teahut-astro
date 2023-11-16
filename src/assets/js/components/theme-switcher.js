localStorage.theme === 'dark' ||
(!('theme' in localStorage) &&
	window.matchMedia('(prefers-color-scheme: dark)').matches)
	? document.documentElement.classList.add('dark')
	: document.documentElement.classList.remove('dark');

document.documentElement.style.visibility = 'visible';

const button = document.querySelector('[data-theme-toggle]');

button.addEventListener('click', () => {
	const theme = document.documentElement.classList.contains('dark')
		? 'light'
		: 'dark';
	localStorage.setItem('theme', theme);
	document.documentElement.classList.toggle('dark', theme === 'dark');
});
