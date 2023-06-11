const helpers = (function helpers() {
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

    function findAncestorElement(node, elementName) {
        let parent = node.parentElement;
        while (parent && parent.nodeName !== elementName.toUpperCase()) {
            parent = parent.parentElement;
        }
        return parent || null;
    }

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
