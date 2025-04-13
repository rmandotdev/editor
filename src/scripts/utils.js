/**
 * Renders the pages list
 * @param {Array<{ name: string, content: string }>} pages - Array of page objects
 * @param {HTMLElement} pagesList - The pages list element
 * @param {HTMLTextAreaElement} textarea - The main textarea
 * @param {HTMLElement} contextMenu - The context menu element
 * @returns {void}
 */
export function renderPages(pages, pagesList, textarea, contextMenu) {
	pagesList.innerHTML = '';
	pages.forEach((page, index) => {
		const pageButton = document.createElement('button'); // NEVER EVER FUCKING CHANGE THIS TO 'li'
		pageButton.textContent = page.name;

		pageButton.addEventListener('click', () => {
			localStorage.setItem('currentPage', index.toString());
			textarea.value = page.content;
		});

		pageButton.addEventListener('contextmenu', (event) => {
			event.preventDefault();
			contextMenu.style.display = 'block';
			contextMenu.style.left = `${event.pageX}px`;
			contextMenu.style.top = `${event.pageY}px`;
			contextMenu.dataset.pageIndex = index.toString();

			if (pages.length === 1) {
				document.getElementById('context-menu-delete-button').style.display = 'none';
			} else {
				document.getElementById('context-menu-delete-button').style.display = 'block';
			}
		});

		pagesList.appendChild(pageButton);
	});
}

/**
 * Handles clicks outside of elements
 * @param {MouseEvent} event - The click event
 * @param {HTMLElement} pagesFloat - The pages float element
 * @param {HTMLElement} pagesButton - The pages button
 * @param {HTMLElement} contextMenu - The context menu element
 * @returns {void}
 */
export function handleClickOutside(event, pagesFloat, pagesButton, contextMenu) {
	if (!pagesFloat.contains(event.target) && !pagesButton.contains(event.target) && !contextMenu.contains(event.target) && pagesFloat.classList.contains('open')) {
		pagesFloat.classList.remove('open');
	}
}
