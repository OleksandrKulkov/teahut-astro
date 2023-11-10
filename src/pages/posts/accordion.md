---
layout: '@layouts/PostLayout.astro'
title: 'Компонент Аккордеону'
pubDate: 2023-10-08
description: 'Дуже простий модуль аккордеону побудований на JavaScript з використанням семантичних тегів, що дозволяє налаштувати швидкість анімації та має додаткові опції.'
author: 'Олексій Якуба'
tags: ['JavaScript', A11y]
---

## Основні можливості

1. Використання безлічі блоків із аккордеонами
2. Опція "сінгл" режиму, коли в блоці може бути одночасно відкритий лише один елемент
3. Можливість анімованого відкриття
4. Семантика та доступність

## Майбутні доробки

1. Вимкнення/увімкнення функціоналу на певній ширині екрану
2. Можливість закриття по кліку за межами аккордеону

## Підключення функціоналу

**[HTML]** Задля того щоб бажані айтеми були відразу активними (відкритими), їм потрібно додати атрибут **open**

```html
<div class="accordion">
	<details class="accordion__item" open>
		<summary class="accordion__title">Accordion item 1</summary>
		<div class="accordion__content">Accordion 2 content</div>
	</details>
	<details class="accordion__item">
		<summary class="accordion__title">Accordion item 2</summary>
		<div class="accordion__content">Accordion 2 content</div>
	</details>
	<details class="accordion__item">
		<summary class="accordion__title">Accordion item 3</summary>
		<div class="accordion__content">Accordion 3 content</div>
	</details>
</div>
```

**[JS]**

```js
import { modules } from '@js/base/modules';

class Accordion {
	constructor(el, options) {
		self = this;

		//we use this to check whether `prefers-reduced-motion` is set or not, if it is set to "reduce" then we remove all the click handlers (or do not add them in the first place)
		const prm = window.matchMedia('(prefers-reduced-motion: reduce)');

		self.el = el;
		self.options = options ? options : {};
		self.closeOthers = self.options.closeOthers ? true : false;
		self.duration = self.options.duration ? self.options.duration : 400;
		self.easing = self.options.easing ? self.options.easing : 'ease-out';

		self.allDetails = self.el.querySelectorAll('.accordion__item');
		self.allDetails.forEach((det) => {
			det.summary = det.querySelector('.accordion__title');
			det.content = det.querySelector('.accordion__content');
			det.animation = null;
			det.isClosing = false;
			det.isExpanding = false;
			if (!prm.matches) {
				self.addListener(det);
			}
		});

		console.log('prm initial', prm.matches);
		prm.addEventListener('change', () => {
			console.log('prm change', prm.matches);
			if (prm.matches) {
				self.allDetails.forEach((det) => {
					self.removeListener(det);
				});
			} else {
				self.allDetails.forEach((det) => {
					self.addListener(det);
				});
			}
		});
	}

	addListener(det) {
		det.summary.addEventListener('click', self.onClick);
	}

	removeListener(det) {
		det.summary.removeEventListener('click', self.onClick);
	}

	onClick(e) {
		e.preventDefault();
		const det = this.parentElement;
		if (det.isClosing || !det.open) {
			self.open(det);
		} else if (det.isExpanding || det.open) {
			self.shrink(det);
		}
	}

	shrink(det) {
		//we set "inert" attribute before doing anything else to make sure none of the content is accessible to keyboard users during the transition to ensure focus is not lost.
		det.content.setAttribute('inert', true);
		det.style.overflow = 'hidden';
		det.isClosing = true;
		det.startHeight = `${det.offsetHeight}px`;
		det.endHeight = `${det.summary.offsetHeight}px`;
		if (det.animation) {
			det.animation.cancel();
		}

		det.animation = det.animate(
			{
				height: [det.startHeight, det.endHeight],
			},
			{
				duration: self.duration,
				easing: self.easing,
			},
		);

		det.animation.onfinish = () => self.onAnimationFinish(det, false);
		det.animation.oncancel = () => (det.isClosing = false);
	}

	open = function (det) {
		det.style.overflow = 'hidden';
		det.style.height = `${det.offsetHeight}px`;
		det.open = true;
		window.requestAnimationFrame(() => self.expand(det));
	};

	expand(det) {
		//we cycle through and close all other <details> that are part of this accordion.
		if (self.closeOthers) {
			self.allDetails.forEach((dets) => {
				self.shrink(dets);
			});
		}

		//we unset the "inert" attribute so the content is accessible via keyboard again.
		det.content.setAttribute('inert', false);
		det.isExpanding = true;

		det.startHeight = `${det.offsetHeight}px`;
		det.endHeight = `${det.summary.offsetHeight + det.content.offsetHeight}px`;

		if (det.animation) {
			det.animation.cancel();
		}

		det.animation = det.animate(
			{
				height: [det.startHeight, det.endHeight],
			},
			{
				duration: self.duration,
				easing: self.easing,
			},
		);
		det.animation.onfinish = () => self.onAnimationFinish(det, true);
		det.animation.oncancel = () => (det.isExpanding = false);
	}

	onAnimationFinish(det, open) {
		det.open = open;
		det.animation = null;
		det.isClosing = false;
		det.isExpanding = false;
		det.style.height = det.style.overflow = '';
	}

	destroy() {
		self.allDetails.forEach((det) => {
			self.removeListener(det);
			det.content.removeAttribute('inert');
			det.style.height = det.style.overflow = '';
			det.open = false;
			det.animation = null;
			det.isClosing = false;
			det.isExpanding = false;
		});
	}
}

document.querySelectorAll('.accordion').forEach((el) => {
	modules[`accordion_${el.getAttribute('data-id')}`] = new Accordion(el, {
		closeOthers: true, //default false
		duration: 300, //default 400
		easing: 'linear', //default ease-out
	});
});
```

**_Використання функціоналу_**

При ініціалізації аккордеону можна вказати наступні опції:

1. `closeOthers: Boolean` - якщо **true** то тільки один айтем може бути відкритим одночасно
2. `duration: Number` - швидкість анімації
3. `easing: String` - вказати функцію плавності

**[SCSS]** Набір базових стилів.

```scss
.accordion {
	width: 100%;
	&__item {
		transition: box-shadow 0.5s 0s ease;
		box-sizing: border-box;
		margin-top: 14px;
		box-shadow: 0px 0px 0px 0px #333;
		border-radius: 1rem;
		background: #151618;
		&:focus-within {
			box-shadow:
				0 0 0 5px #000,
				0 0 0 7px #2cdce6;
		}
		&[open] > .accordion__title:after {
			transform: rotate(-180deg);
		}
	}
	&__title {
		display: flex;
		position: relative;
		justify-content: space-between;
		align-items: center;
		gap: 1rem;
		cursor: pointer;
		outline: transparent;
		padding: 2rem 1.5rem;
		color: #fff;
		&::marker,
		&::-webkit-details-marker {
			display: none;
		}
		&::after {
			opacity: 0.6;
			transition: transform 0.3s ease 0s;
			background: url('https://assets.codepen.io/7212043/rounded-arrow.svg')
				no-repeat center / cover;
			width: 2rem;
			height: 2rem;
			content: '';
		}
	}
	// .accordion__content
	&__content {
		border-top: none;
		padding: 0.5rem 2rem 2rem 2rem;
		color: #a9abb3;
	}
}
```

<h2 class="mb-10 text-center">Приклад використання:</h2>

<div data-id="modifier" class='accordion'>
<details class="accordion__item">
  <summary class="accordion__title">Accordion item 1</summary>
  <div class='accordion__content'>
    <ol>
      <li>test one</li>
      <li>test two</li>
      <li>test three</li>
      <li>test four</li>
    </ol>
  </div>
</details>
<details class="accordion__item" open>
  <summary class="accordion__title">Accordion item 2</summary>
  <div class='accordion__content'>Accordion 2 content</div>
</details>
<details class="accordion__item">
  <summary class="accordion__title">Accordion item 3</summary>
  <div class='accordion__content'>Accordion 3 content</div>
</details>
</div>
