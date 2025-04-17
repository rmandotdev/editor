/**
 * Renders the pages list
 * @param {import('./app.js').App} app - The app instance
 * @returns {void}
 */
export function renderPages(app) {
	app.elements.pagesList.innerHTML = '';
	const currentPage = parseInt(localStorage.getItem('currentPage') || '0', 10);

	app.pages.forEach((page, index) => {
		// NEVER EVER FUCKING CHANGE THIS TO ANYTHING ELSE THAN BUTTON OR DELETE THIS COMMENT
		const pageItem = document.createElement('button');
		pageItem.textContent = page.name;
		pageItem.classList.add('page-item');
		if (index === currentPage) {
			pageItem.classList.add('selected');
		}
		pageItem.dataset.index = index.toString();

		pageItem.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			app.elements.contextMenu.style.display = 'block';
			app.elements.contextMenu.style.left = `${event.pageX}px`;
			app.elements.contextMenu.style.top = `${event.pageY}px`;
			app.elements.contextMenu.dataset.pageIndex = index.toString();

			document.getElementById('context-menu-delete-button').style.display = app.pages.length === 1 ? 'none' : 'block';
		});

		app.elements.pagesList.appendChild(pageItem);
	});
}

/**
 * Handles clicks outside of elements
 * @param {MouseEvent} event - The click event
 * @param {import('./app.js').App} app - The app instance
 * @returns {void}
 */
export function handleClickOutside(event, app) {
	if (
		!app.elements.pagesFloat.contains(event.target) &&
		!app.elements.pagesButton.contains(event.target) &&
		!app.elements.contextMenu.contains(event.target)
	) {
		app.elements.contextMenu.style.display = 'none';
	}
}
