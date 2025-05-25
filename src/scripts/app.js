import { renderPages, handleClickOutside } from './utils.js';
import { handleDeleteAction, handleRenameAction } from './contextMenu.js';

export class App {
	constructor() {
		this.pages = [];
		this.currentPage = 0;
		this.elements = {};
	}

	init() {
		document.addEventListener('DOMContentLoaded', () => {
			this.initializeElements();
			this.loadState();
			this.setupEventListeners();
			this.initializeToolbar();
			this.initializeSettings();
		});
	}

	initializeElements() {
		this.elements = {
			textarea: document.getElementById('text-area'),
			toolbar: document.getElementById('toolbar'),
			pagesList: document.getElementById('pages-list'),
			addPageButton: document.getElementById('add-page-button'),
			contextMenu: document.getElementById('context-menu'),
			pagesButton: document.getElementById('pages-button'),
			pagesFloat: document.getElementById('pages-float'),
			currentPageTitle: document.getElementById('current-page-title'),
			settingsForm: document.getElementById('settings-form'),
			autocorrectToggle: document.getElementById('text-autocorrection-toggle'),
			fontSizeInput: document.getElementById('font-size-input'),
			fontFamilySelect: document.getElementById('font-family-select'),
			textJustifySelect: document.getElementById('text-justify-select'),
			settingsButton: document.getElementById('settings-button'),
			settingsModal: document.getElementById('settings-modal')
		};
	}

	initializeToolbar() {
		this.elements.toolbar.addEventListener('mousemove', () => {
			this.elements.toolbar.style.opacity = '1';
		});

		this.elements.textarea.addEventListener('input', () => {
			this.elements.toolbar.style.opacity = '0';
			this.elements.pagesFloat.classList.remove('open');
		});
	}

	loadState() {
		this.pages = JSON.parse(localStorage.getItem('pages') || JSON.stringify([{ name: 'Page 1', content: '' }]));
		this.currentPage = parseInt(localStorage.getItem('currentPage') || '0', 10);
		this.updateView();
		renderPages(this);
	}

	updateView() {
		this.elements.textarea.value = this.pages[this.currentPage].content;
		this.elements.currentPageTitle.textContent = this.pages[this.currentPage].name;
	}

	setupEventListeners() {
		this.elements.textarea.addEventListener('input', () => {
			this.pages[this.currentPage].content = this.elements.textarea.value;
			localStorage.setItem('pages', JSON.stringify(this.pages));
		});

		this.elements.addPageButton.addEventListener('click', () => {
			const newPage = {
				name: `Page ${this.pages.length + 1}`,
				content: ''
			};
			this.pages.push(newPage);
			this.currentPage = this.pages.length - 1;
			localStorage.setItem('pages', JSON.stringify(this.pages));
			localStorage.setItem('currentPage', this.currentPage.toString());
			this.updateView();
			renderPages(this);
		});

		this.elements.pagesList.addEventListener('click', (event) => {
			const pageItem = event.target.closest('.page-item');
			if (pageItem) {
				this.currentPage = parseInt(pageItem.dataset.index, 10);
				localStorage.setItem('currentPage', this.currentPage.toString());
				this.updateView();
				Array.from(this.elements.pagesList.children).forEach((item) =>
					item.classList.toggle('selected', item === pageItem)
				);
			}
		});

		this.elements.pagesButton.addEventListener('click', () => {
			this.elements.pagesFloat.classList.toggle('open');
		});

		document.addEventListener('click', (event) => {
			if (this.elements.contextMenu.style.display === 'block' && !this.elements.contextMenu.contains(event.target)) {
				this.elements.contextMenu.style.display = 'none';
			}
			handleClickOutside(event, this);
		});

		document.getElementById('context-menu-delete-button').addEventListener('click', () => {
			handleDeleteAction(this);
			this.currentPage = parseInt(localStorage.getItem('currentPage') || '0', 10);
		});

		document.getElementById('context-menu-rename-button').addEventListener('click', () => {
			handleRenameAction(this);
		});

		this.elements.settingsButton.addEventListener('click', () => {
			this.elements.settingsModal.showModal();
		});

		this.elements.settingsModal.addEventListener('click', (event) => {
			if (event.target === this.elements.settingsModal) {
				this.elements.settingsModal.close();
			}
		});
	}

	initializeSettings() {
		const { textarea, autocorrectToggle, fontSizeInput, fontFamilySelect, textJustifySelect } = this.elements;

		const loadSettings = () => {
			const settings = JSON.parse(localStorage.getItem('editor-settings') || '{}');

			autocorrectToggle.checked = settings.autocorrect ?? true;
			textarea.spellcheck = settings.autocorrect ?? true;

			fontSizeInput.value = settings.fontSize ?? 16;
			textarea.style.fontSize = `${settings.fontSize ?? 16}px`;

			fontFamilySelect.value = settings.fontFamily ?? 'Cousine';
			textarea.style.fontFamily = settings.fontFamily ?? 'Cousine';

			textJustifySelect.value = settings.textAlign ?? 'left';
			textarea.style.textAlign = settings.textAlign ?? 'left';
		};

		const saveSettings = () => {
			const settings = {
				autocorrect: autocorrectToggle.checked,
				fontSize: parseInt(fontSizeInput.value),
				fontFamily: fontFamilySelect.value,
				textAlign: textJustifySelect.value
			};
			localStorage.setItem('editor-settings', JSON.stringify(settings));
		};

		autocorrectToggle.addEventListener('change', () => {
			textarea.spellcheck = autocorrectToggle.checked;
			saveSettings();
		});

		fontSizeInput.addEventListener('input', () => {
			textarea.style.fontSize = `${fontSizeInput.value}px`;
			saveSettings();
		});

		fontFamilySelect.addEventListener('change', () => {
			textarea.style.fontFamily = fontFamilySelect.value;
			saveSettings();
		});

		textJustifySelect.addEventListener('change', () => {
			textarea.style.textAlign = textJustifySelect.value;
			saveSettings();
		});

		loadSettings();
	}
}

const app = new App();
app.init();
