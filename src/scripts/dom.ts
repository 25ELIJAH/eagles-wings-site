// Small DOM helpers shared by the page scripts.
export const $ = <T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document) => root.querySelector<T>(selector);
export const $$ = <T extends HTMLElement = HTMLElement>(selector: string, root: ParentNode = document) => [...root.querySelectorAll<T>(selector)];

/** True when the visitor's system asks for less motion. Continuous and large movement is switched off for them. */
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;
