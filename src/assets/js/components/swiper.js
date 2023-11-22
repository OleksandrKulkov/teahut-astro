import Swiper from 'swiper';
import { Thumbs } from 'swiper/modules';

const thumbnailSlider = new Swiper('.thumbnail-slider', {
	freeMode: true,
	watchSlidesProgress: true,
});

const mainSlider = new Swiper('.main-slider', {
	modules: [Thumbs],
	speed: 500,
	thumbs: {
		swiper: thumbnailSlider,
	},
});
