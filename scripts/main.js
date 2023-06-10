/* eslint-disable import/extensions */
import constructors from "./constructors.js";
import helpers from "./helpers.js";
import config from "./config.js";

(function main() {
    const { Library, Book, Modal } = constructors;
    const {
        stringToProperCase: properCase,
        checkAncestorHasClass,
        findAncestorElement,
    } = helpers;
    const { IDs, classes } = config.CSS;

    const librarySection = document.getElementById(IDs.library);
    const modalContainer = document.querySelector(`.${classes.modalContainer}`);
    const bookBtn = document.getElementById(IDs.addBookBtn);
    const closeBtn = document.getElementById(IDs.closeBookBtn);
    const cancelBtn = document.getElementById(IDs.cancelBtn);
    const submitBtn = document.getElementById(IDs.submitBtn);
    const bookForm = document.getElementById(IDs.bookForm);

    // Manually add some books to view the display
    const book1 = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
    const book2 = new Book("Pride and Prejudice", "Jane Austen", 279, false);
    const book3 = new Book("The Fault in Our Stars", "John Green", 313, true);

    const myLibrary = new Library([book1, book2], librarySection);

    const modal = new Modal(modalContainer, bookForm, submitBtn);

    myLibrary.addBook(book3);
    myLibrary.display();

    const resetFormAndHideModal = () => {
        modal.resetForm();
        modal.hide();
    };

    const submitBookEntry = (event) => {
        event.preventDefault();
        const title = properCase(bookForm.elements["book-title"].value);
        const author = properCase(bookForm.elements["book-author"].value);
        const pages = parseInt(bookForm.elements["book-pages"].value, 10);
        const isRead = bookForm.elements["book-completion"].checked;
        const book = new Book(title, author, pages, isRead);
        resetFormAndHideModal();
        if (submitBtn.hasAttribute("data-submit-edit")) {
            const bookIndex = parseInt(submitBtn.dataset.bookIndex, 10);
            myLibrary.editBook(bookIndex, book);
        } else {
            myLibrary.addBook(book);
        }
        myLibrary.display();
    };

    const checkForBookDelete = (event) => {
        const { target } = event;
        if (!checkAncestorHasClass(target, classes.deleteBtn)) {
            return;
        }
        const rowToDelete = findAncestorElement(target, "tr");
        const bookIndex = parseInt(rowToDelete.dataset.indexNum, 10);
        myLibrary.deleteBook(bookIndex);
        myLibrary.display();
    };

    const checkForBookEdit = (event) => {
        const { target } = event;
        if (!checkAncestorHasClass(target, classes.editBtn)) {
            return;
        }
        const rowToUpdate = findAncestorElement(target, "tr");
        const bookIndex = parseInt(rowToUpdate.dataset.indexNum, 10);
        const book = myLibrary.getBook(bookIndex);
        modal.showWithFilledForm(book, bookIndex);
    };

    const checkForBookStatusChange = (event) => {
        const { target } = event;
        if (!checkAncestorHasClass(target, classes.readStatus)) {
            return;
        }
        const rowToUpdate = findAncestorElement(target, "tr");
        const bookIndex = parseInt(rowToUpdate.dataset.indexNum, 10);
        myLibrary.editBookStatus(bookIndex);
    };

    bookBtn.addEventListener("click", modal.showWithEmptyForm.bind(modal));
    closeBtn.addEventListener("click", modal.hide.bind(modal));
    cancelBtn.addEventListener("click", resetFormAndHideModal);
    bookForm.addEventListener("submit", submitBookEntry);
    librarySection.addEventListener("click", checkForBookDelete);
    librarySection.addEventListener("click", checkForBookEdit);
    librarySection.addEventListener("click", checkForBookStatusChange);
})();
