const data = new Map();

export default class Component {
    _getTransitionDuration() {
        return parseFloat(getComputedStyle(this.elements.root).transitionDuration) * 1000;
    }

    static getData(key) {
        return data.get(key);
    }

    static setData(key, value) {
        data.set(key, value);
    }

    static hasData(key) {
        return data.has(key);
    }

    static deleteData(key) {
        data.delete(key);
    }

    static do(targetElement) {
        const action = targetElement.dataset.action;

        if (action === undefined || action === '') {
            return false;
        }

        const elementSelector = targetElement.dataset.target;
        let element;

        if (elementSelector === undefined || elementSelector === '') {
            element = targetElement.closest(`.${this.classes.root}`);
        } else {
            element = document.querySelector(elementSelector);
        }

        if (element === null) {
            return false;
        }

        let elementObject = this.getData(element);

        if (elementObject === undefined) {
            elementObject = new this(element, targetElement);
        }

        return elementObject[action]();
    }
}
