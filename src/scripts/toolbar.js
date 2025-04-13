/**
 * Initializes the toolbar functionality
 * @returns {void}
 */
export function initializeToolbar() {
	/** @type {HTMLTextAreaElement} */
	const textarea = document.querySelector('textarea');
	/** @type {HTMLElement} */
	const toolbar = document.querySelector('.toolbar');

	toolbar.addEventListener('mousemove', () => {
		toolbar.style.opacity = '1';
	});

	textarea.addEventListener('input', () => {
		toolbar.style.opacity = '0';
	});
}
