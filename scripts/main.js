// eslint-disable-next-line import/extensions
import constructors from "./constructors.js";


(function main() {

    const { Library, Book } = constructors;
    const container = document.querySelector("#library");

    // Manually add some books to view the display
    const book1 = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
    const book2 = new Book("Pride and Prejudice", "Jane Austen", 279, false);
    const book3 = new Book("The Fault in Our Stars", "John Green", 313, true);

    const myLibrary = new Library([book1, book2]);
    myLibrary.addBook(book3);

    myLibrary.displayBooks(container);

})();
