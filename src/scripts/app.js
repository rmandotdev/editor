import { initializeToolbar } from './toolbar.js';
import { renderPages, handleClickOutside } from './utils.js';
import { handleDeleteAction, handleRenameAction } from './contextMenu.js';

/**
 * Initializes the main application
 * @returns {void}
 */
export function initializeApp() {
	document.addEventListener('DOMContentLoaded', () => {
		/** @type {HTMLTextAreaElement} */
		const textarea = document.querySelector('textarea');
		/** @type {HTMLElement} */
		const pagesList = document.getElementById('pages-list');
		/** @type {HTMLButtonElement} */
		const addPageButton = document.getElementById('add-page-button');
		/** @type {HTMLElement} */
		const contextMenu = document.getElementById('context-menu');
		/** @type {HTMLButtonElement} */
		const pagesButton = document.getElementById('pages-button');
		/** @type {HTMLElement} */
		const pagesFloat = document.getElementById('pages-float');

		// Initialize toolbar
		initializeToolbar();

		// Load pages from localStorage
		/** @type {{ name: string, content: string }[]} */
		const pages = JSON.parse(localStorage.getItem('pages') || JSON.stringify([{ name: 'Page 1', content: '' }])) || [{ name: 'Page 1', content: '' }];

		// Render pages in the sidebar
		renderPages(pages, pagesList, textarea, contextMenu);

		// Load content of the current page
		/** @type {number} */
		const currentPage = parseInt(localStorage.getItem('currentPage') || '0', 10) || 0;
		textarea.value = pages[currentPage].content;

		// Save content to the current page
		textarea.addEventListener('input', () => {
			pages[currentPage].content = textarea.value;
			localStorage.setItem('pages', JSON.stringify(pages));
		});

		// Add a new page
		addPageButton.addEventListener('click', () => {
			const newPage = {
				name: `Page ${pages.length + 1}`,
				content: ''
			};
			pages.push(newPage);
			const newPageIndex = pages.length - 1;
			localStorage.setItem('pages', JSON.stringify(pages));
			localStorage.setItem('currentPage', newPageIndex.toString());
			textarea.value = newPage.content;
			renderPages(pages, pagesList, textarea, contextMenu);
		});

		// Toggle pages list visibility
		pagesButton.addEventListener('click', () => {
			pagesFloat.classList.toggle('open');
		});

		// Handle outside clicks
		document.addEventListener('click', (event) => {
			if (contextMenu.style.display === 'block' && !contextMenu.contains(event.target)) {
				contextMenu.style.display = 'none';
			}
			handleClickOutside(event, pagesFloat, pagesButton, contextMenu);
		});

		// Context menu actions
		document.getElementById('context-menu-delete-button').addEventListener('click', () => {
			handleDeleteAction(pages, contextMenu, textarea, pagesList);
		});

		document.getElementById('context-menu-rename-button').addEventListener('click', () => {
			handleRenameAction(pages, pagesList, textarea, contextMenu);
		});
	});
}

initializeApp();
initializeToolbar();
