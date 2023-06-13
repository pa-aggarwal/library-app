const helpers = (function helpers() {
    /**
     * Return True if the given node or one of its ancestors has a class.
     * @param {Element} node - The element with ancestors to check.
     * @param {string} className - The name of the class to search for.
     * @returns {boolean}
     */
    function checkAncestorHasClass(node, className) {
        let elementToCheck = node;
        while (elementToCheck) {
            if (elementToCheck.classList.contains(className)) {
                return true;
            }
            elementToCheck = elementToCheck.parentElement;
        }
        return false;
    }

    /**
     * Return an ancestor element with the given tag name or null.
     * @param {Element} node - The element with ancestors to check.
     * @param {string} elementName - The tag name of the element to find.
     * @returns {Element|null}
     */
    function findAncestorElement(node, elementName) {
        let parent = node.parentElement;
        while (parent && parent.nodeName !== elementName.toUpperCase()) {
            parent = parent.parentElement;
        }
        return parent || null;
    }

    /**
     * Return a string with each word capitalized.
     * @param {string} string - String to convert to proper case.
     * @returns {string}
     */
    function stringToProperCase(string) {
        // Removes apostrophe from word boundaries
        const pattern = /\b(?<!('))\w+/g;
        return string.replace(
            pattern,
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
    }

    return {
        checkAncestorHasClass,
        findAncestorElement,
        stringToProperCase,
    };
})();

export default helpers;
