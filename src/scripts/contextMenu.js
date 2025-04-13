import { renderPages } from './utils.js';

/**
 * Handles the delete action from context menu
 * @param {Array<{ name: string, content: string }>} pages - Array of page objects
 * @param {HTMLElement} contextMenu - The context menu element
 * @param {HTMLTextAreaElement} textarea - The main textarea
 * @param {HTMLElement} pagesList - The pages list element
 * @returns {void}
 */
export function handleDeleteAction(pages, contextMenu, textarea, pagesList) {
	const pageIndex = parseInt(contextMenu.dataset.pageIndex || '0');
	pages.splice(pageIndex, 1);

	if (pages.length === 0) {
		pages.push({ name: 'Page 1', content: '' });
	}

	localStorage.setItem('pages', JSON.stringify(pages));
	localStorage.setItem('currentPage', '0');
	textarea.value = pages[0].content;

	contextMenu.style.display = 'none';
	renderPages(pages, pagesList, textarea, contextMenu);
}

/**
 * Handles the rename action from context menu
 * @param {Array<{ name: string, content: string }>} pages - Array of page objects
 * @param {HTMLElement} contextMenu - The context menu element
 * @param {HTMLElement} pagesList - The pages list element
 * @param {HTMLTextAreaElement} textarea - The main textarea
 * @returns {void}
 */
export function handleRenameAction(pages, pagesList, textarea, contextMenu) {
	const pageIndex = parseInt(contextMenu.dataset.pageIndex || '0');
	const newName = prompt('Enter new name:', pages[pageIndex].name);

	if (newName) {
		pages[pageIndex].name = newName;
		localStorage.setItem('pages', JSON.stringify(pages));
		contextMenu.style.display = 'none';
		renderPages(pages, pagesList, textarea, contextMenu);
	}
}
