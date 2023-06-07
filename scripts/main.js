/* eslint-disable import/extensions */
import constructors from "./constructors.js";
import helpers from "./helpers.js";
import config from "./config.js";

(function main() {
    const { Library, Book } = constructors;
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
    const bookForm = document.getElementById(IDs.bookForm);

    // Manually add some books to view the display
    const book1 = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
    const book2 = new Book("Pride and Prejudice", "Jane Austen", 279, false);
    const book3 = new Book("The Fault in Our Stars", "John Green", 313, true);

    const myLibrary = new Library([book1, book2], librarySection);

    myLibrary.addBook(book3);
    myLibrary.display();

    const showModal = () => {
        modalContainer.classList.remove(classes.hide);
    };

    const hideModal = () => {
        modalContainer.classList.add(classes.hide);
    };

    const resetFormAndHideModal = () => {
        bookForm.reset();
        hideModal();
    };

    const submitBookEntry = (event) => {
        event.preventDefault();
        const title = properCase(bookForm.elements["book-title"].value);
        const author = properCase(bookForm.elements["book-author"].value);
        const pages = parseInt(bookForm.elements["book-pages"].value, 10);
        const isRead = bookForm.elements["book-completion"].checked;
        resetFormAndHideModal();
        myLibrary.addBook(new Book(title, author, pages, isRead));
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

    const checkForBookStatusChange = (event) => {
        const { target } = event;
        if (!checkAncestorHasClass(target, classes.readStatus)) {
            return;
        }
        const rowToUpdate = findAncestorElement(target, "tr");
        const bookIndex = parseInt(rowToUpdate.dataset.indexNum, 10);
        myLibrary.editBookStatus(bookIndex);
    };

    bookBtn.addEventListener("click", showModal);
    closeBtn.addEventListener("click", hideModal);
    cancelBtn.addEventListener("click", resetFormAndHideModal);
    bookForm.addEventListener("submit", submitBookEntry);
    librarySection.addEventListener("click", checkForBookDelete);
    librarySection.addEventListener("click", checkForBookStatusChange);
})();
