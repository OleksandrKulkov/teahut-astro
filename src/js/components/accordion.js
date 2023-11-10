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