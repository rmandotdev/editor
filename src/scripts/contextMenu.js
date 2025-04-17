import { renderPages } from './utils.js';

/**
 * Handles the delete action from context menu
 * @param {import('./app.js').App} app - The app instance
 * @returns {void}
 */
export function handleDeleteAction(app) {
	const deletedIndex = parseInt(app.elements.contextMenu.dataset.pageIndex, 10);
	let currentPage = parseInt(localStorage.getItem('currentPage') || '0', 10);

	app.pages.splice(deletedIndex, 1);

	if (currentPage >= app.pages.length) {
		currentPage = app.pages.length - 1;
	} else if (deletedIndex < currentPage) {
		currentPage--;
	}

	localStorage.setItem('currentPage', currentPage.toString());
	localStorage.setItem('pages', JSON.stringify(app.pages));
	app.elements.textarea.value = app.pages[currentPage].content;
	app.elements.currentPageTitle.textContent = app.pages[currentPage].name;

	app.elements.contextMenu.style.display = 'none';
	renderPages(app);
}

/**
 * Handles the rename action from context menu
 * @param {import('./app.js').App} app - The app instance
 * @returns {void}
 */
export function handleRenameAction(app) {
	const pageIndex = parseInt(app.elements.contextMenu.dataset.pageIndex ?? '0', 10);
	const newName = prompt('Enter new name:', app.pages[pageIndex].name);

	if (newName && newName.trim()) {
		app.pages[pageIndex].name = newName.trim();
		localStorage.setItem('pages', JSON.stringify(app.pages));

		const currentPage = parseInt(localStorage.getItem('currentPage') || '0', 10);
		if (pageIndex === currentPage) {
			app.elements.currentPageTitle.textContent = newName.trim();
		}

		app.elements.contextMenu.style.display = 'none';
		renderPages(app);
	}
}
