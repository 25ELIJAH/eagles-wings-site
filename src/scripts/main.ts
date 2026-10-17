// Entry point: starts each feature. Every module is small, independent and safe to run on any page.
import { initNav } from './nav';
import { initReveal } from './reveal';
import { initSlideshows } from './slideshow';
import { initLightbox } from './lightbox';
import { initCookieNotice } from './cookie';
import { initForms } from './forms';
import { initHero } from './hero';
import { initProgress } from './progress';

initNav();
initReveal();
initSlideshows();
initLightbox();
initCookieNotice();
initForms();
initHero();
initProgress();
