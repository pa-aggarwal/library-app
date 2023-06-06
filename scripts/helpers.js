const helpers = (function helpers() {
    function checkInnerLengths(array, length) {
        return array.every((innerArray) => innerArray.length === length);
    }

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

    function clearNode(node) {
        while (node.lastChild) {
            node.removeChild(node.lastChild);
        }
    }

    function updateRowIndices(rows, startIndex) {
        rows.forEach((row, index) => {
            row.setAttribute("data-index-num", startIndex + index);
        });
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
        checkInnerLengths,
        checkAncestorHasClass,
        findAncestorElement,
        clearNode,
        updateRowIndices,
        stringToProperCase,
    };
})();

export default helpers;
