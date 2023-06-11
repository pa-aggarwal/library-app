/* eslint-disable import/extensions */
import helpers from "./helpers.js";

const {
    stringToProperCase: properCase,
    findAncestorElement,
    checkAncestorHasClass,
} = helpers;

function View() {
    this.libraryRoot = this.getElement("#library");
    this.modalRoot = this.getElement("#modal-container");
    this.modalHeading = this.getElement("#modal-container h2");
    this.bookForm = this.getElement("#book-form");
    this.addBookBtn = this.getElement("#book-btn");
    this.closeBtn = this.getElement("#close-btn");
    this.cancelBtn = this.getElement("#cancel-btn");
    this.submitBtn = this.getElement("#submit-btn");
    this.formInEditState = false;

    this.listenToAddBtn();
    this.listenToCancelBtn();
    this.listenToCloseBtn();
}

/**
 * Search for and return an element in the DOM.
 * @param {string} selector - CSS selector for the DOM element to get.
 * @returns {Element}
 */
View.prototype.getElement = function getElement(selector) {
    const element = document.querySelector(selector);
    return element;
};

/**
 * Create and return an element with an optional list of classes applied.
 * @param {string} tag - The name of the type of HTML element to create.
 * @param {...string} classes - Names of classes to apply on the element.
 * @returns {Element}
 */
View.prototype.makeElement = function makeElement(tag, ...classes) {
    const element = document.createElement(tag);
    classes.forEach((className) => element.classList.add(className));
    return element;
};

View.prototype.getReadToggle = function getReadToggle(isRead) {
    const text = isRead ? "Read" : "Not Read";
    const checkedAttr = isRead ? "checked" : "";
    return `<label class="read-status">
                <input type="checkbox" class="toggle-read" ${checkedAttr}>
                <span class="btn toggle-read-text">${text}</span>
            </label>`;
};

View.prototype.getDeleteBtnHTML = function getDeleteBtnHTML() {
    return `<button class="btn btn--danger action-btn delete-btn">
                <i class="fa-solid fa-trash"></i>
                <span>Delete</span>
            </button>`;
};

View.prototype.getEditBtnHTML = function getEditBtnHTML() {
    return `<button class="btn btn--primary action-btn edit-btn">
                <i class="fa-regular fa-pen-to-square"></i>
                <span>Edit</span>
            </button>`;
};

/**
 * Add an actions column to a table's head and body.
 * @param {Element} thead - Element with thead tag to modify.
 * @param {Element} tbody - Element with tbody tag to modify.
 */
View.prototype.addActionsColumn = function addActionsColumn(thead, tbody) {
    const th = `<th scope="col" class="library-th">Actions</th>`;
    thead.children[0].insertAdjacentHTML("beforeend", th);
    const tbodyRows = Array.from(tbody.children);
    const buttonHTML = this.getDeleteBtnHTML() + this.getEditBtnHTML();
    const td = `<td class="td-actions">${buttonHTML}</td>`;
    tbodyRows.forEach((row) => row.insertAdjacentHTML("beforeend", td));
};

/**
 * Return a table view of a library's book collection.
 * @param {Array<Book>} books - An array of Book instances to display.
 * @returns {Element}
 */
View.prototype.displayLibraryAsTable = function makeTable(books) {
    const table = this.makeElement("table", "library-table");
    const thead = this.makeElement("thead", "library-thead", "title");
    const tbody = this.makeElement("tbody", "library-tbody");

    let tableRow = this.makeElement("tr");
    const columnTitles = ["Title", "Author", "Pages", "Status"];
    columnTitles.forEach((title) => {
        const th = `<th scope="col" class="library-th">${title}</th>`;
        tableRow.insertAdjacentHTML("beforeend", th);
    });
    thead.appendChild(tableRow);

    books.forEach((book, bookIndex) => {
        tableRow = this.makeElement("tr", "library-book");
        tableRow.setAttribute("data-index", bookIndex);
        const { title, author, pageCount, isRead } = book;
        const td1 = `<td class="td-title">${title}</td>`;
        const td2 = `<td class="td-author">${author}</td>`;
        const td3 = `<td class="td-pages">${pageCount}</td>`;
        tableRow.insertAdjacentHTML("beforeend", td1 + td2 + td3);
        const td4 = this.makeElement("td", "td-status");
        const td4Content = this.getReadToggle(isRead);
        td4.insertAdjacentHTML("beforeend", td4Content);
        tableRow.appendChild(td4);
        tbody.appendChild(tableRow);
    });

    this.addActionsColumn(thead, tbody);

    table.append(thead, tbody);
    return table;
};

View.prototype.displayLibrary = function displayLibrary(books) {
    const oldTable = this.getElement(".library-table");
    if (oldTable) {
        this.libraryRoot.removeChild(oldTable);
    }
    const newTable = this.displayLibraryAsTable(books);
    this.libraryRoot.appendChild(newTable);
};

View.prototype.closeModal = function closeModal() {
    if (this.formInEditState) {
        this.modalInAddState();
        this.formInEditState = false;
    }
    this.bookForm.reset();
    this.modalRoot.classList.add("hidden");
};

View.prototype.showModal = function showModal() {
    this.modalRoot.classList.remove("hidden");
};

View.prototype.fillForm = function fillForm(bookProps) {
    const { title, author, pageCount, isRead } = bookProps;
    const formControls = this.bookForm.elements;
    formControls["book-title"].value = title;
    formControls["book-author"].value = author;
    formControls["book-pages"].value = pageCount.toString();
    formControls["book-completion"].checked = isRead;
};

View.prototype.getFormValues = function getFormValues() {
    const formControls = this.bookForm.elements;
    const title = properCase(formControls["book-title"].value);
    const author = properCase(formControls["book-author"].value);
    const pages = parseInt(formControls["book-pages"].value, 10);
    const isRead = formControls["book-completion"].checked;
    return { title, author, pages, isRead };
};

View.prototype.modalInAddState = function modalInAddState() {
    this.modalHeading.textContent = "Add Book to Library";
    this.submitBtn.innerHTML = `<i class="fa-light fa-plus"></i>Add Book`;
};

View.prototype.modalInEditState = function modalInEditState() {
    this.modalHeading.textContent = "Edit Book";
    this.submitBtn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i>Save`;
};

View.prototype.listenToAddBtn = function listenToAddBtn() {
    this.addBookBtn.addEventListener("click", () => this.showModal());
};

View.prototype.listenToCloseBtn = function listenToCloseBtn() {
    this.closeBtn.addEventListener("click", () => this.closeModal());
};

View.prototype.listenToCancelBtn = function listenToCancelBtn() {
    this.cancelBtn.addEventListener("click", () => this.closeModal());
};

View.prototype.bindAddBook = function bindAddBook(handler) {
    this.bookForm.addEventListener("submit", () => {
        if (this.formInEditState) {
            return;
        }
        const formValues = this.getFormValues();
        this.closeModal();
        handler(formValues);
    });
};

View.prototype.bindRemoveBook = function bindRemoveBook(handler) {
    this.libraryRoot.addEventListener("click", (event) => {
        if (!checkAncestorHasClass(event.target, "delete-btn")) {
            return;
        }
        const bookRow = findAncestorElement(event.target, "tr");
        const bookIndex = parseInt(bookRow.dataset.index, 10);
        handler(bookIndex);
    });
};

View.prototype.bindUpdateBook = function bindUpdateBook(handlers) {
    const { handleGet, handleUpdate } = handlers;
    let bookIndex;

    this.libraryRoot.addEventListener("click", (event) => {
        if (!checkAncestorHasClass(event.target, "edit-btn")) {
            return;
        }
        const bookRow = findAncestorElement(event.target, "tr");
        bookIndex = parseInt(bookRow.dataset.index, 10);
        this.formInEditState = true;
        this.fillForm(handleGet(bookIndex));
        this.modalInEditState();
        this.showModal();
    });

    this.bookForm.addEventListener("submit", () => {
        if (!this.formInEditState) {
            return;
        }
        const formValues = this.getFormValues();
        this.closeModal();
        handleUpdate(bookIndex, formValues);
    });
};

View.prototype.bindStatusChange = function bindStatusChange(handler) {
    this.libraryRoot.addEventListener("click", (event) => {
        if (!event.target.classList.contains("toggle-read-text")) {
            return;
        }
        const bookRow = findAncestorElement(event.target, "tr");
        const bookIndex = parseInt(bookRow.dataset.index, 10);
        handler(bookIndex);
    });
};

export default View;
