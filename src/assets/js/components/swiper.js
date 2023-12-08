import Swiper from 'swiper';
import { EffectFade, Thumbs } from 'swiper/modules';

const thumbnailSlider = new Swiper('.thumbnail-slider', {
	freeMode: true,
	watchSlidesProgress: true,
});

const mainSlider = new Swiper('.main-slider', {
	modules: [Thumbs, EffectFade],
	speed: 500,
	effect: 'fade',
	thumbs: {
		swiper: thumbnailSlider,
	},
	breakpoints: {
		767.98: {
			direction: 'vertical',
		},
	},
});
