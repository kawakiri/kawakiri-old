import Component from './component.js';

export default class Popup extends Component {
    static componentName = 'Popup';
    static classes = {
        root: 'popup',
        button: 'popup__button',
        content: 'popup__content',
        upContent: 'popup__content--up',
        downContent: 'popup__content--down',
        shownContent: 'popup__content--shown'
    };
    static shown = null;

    constructor(rootElement) {
        super();

        this.elements = {
            root: rootElement,
            button: rootElement.querySelector('.' + Popup.classes.button),
            content: rootElement.querySelector('.' + Popup.classes.content)
        };

        Popup.setData(rootElement, this);
    }

    _onOutsideClick(event) {
        if (event.target.closest('.' + Popup.classes.content) === null) {
            Popup.shown.hide();
        }
    }

    _onEscapeKeydown(event) {
        if (event.key === 'Escape') {
            Popup.shown.elements.button.focus();
            Popup.shown.hide();
        }
    }

    _onTabKeydown(event) {
        if (event.key === 'Tab' && (document.activeElement === null || document.activeElement.closest('.' + Popup.classes.content) === null)) {
            Popup.shown.hide();
        }
    }

    show() {
        if (this.elements.content.classList.contains(Popup.classes.shownContent)) {
            return false;
        }

        if (Popup.shown !== null) {
            Popup.shown.hide();
        }

        Popup.shown = this;

        const buttonBox = this.elements.button.getBoundingClientRect();
        const availableTop = buttonBox.top;
        const availableBottom = document.documentElement.clientHeight - buttonBox.bottom;

        if (availableTop > availableBottom) {
            this.elements.content.classList.add(Popup.classes.upContent);
        } else {
            this.elements.content.classList.add(Popup.classes.downContent);
        }

        this.elements.content.classList.add(Popup.classes.shownContent);

        document.addEventListener('click', this._onOutsideClick);
        document.addEventListener('keydown', this._onEscapeKeydown);
        document.addEventListener('keyup', this._onTabKeydown);

        return true;
    }

    hide() {
        if (!this.elements.content.classList.contains(Popup.classes.shownContent)) {
            return false;
        }

        document.removeEventListener('click', this._onOutsideClick);
        document.removeEventListener('keydown', this._onEscapeKeydown);
        document.removeEventListener('keyup', this._onTabKeydown);

        this.elements.content.classList.remove(Popup.classes.shownContent);
        this.elements.content.classList.remove(Popup.classes.upContent);
        this.elements.content.classList.remove(Popup.classes.downContent);

        Popup.shown = null;

        return true;
    }

    toggle() {
        return this.show() || this.hide();
    }

    static _onClick(event) {
        const target = event.target;

        if (target.dataset.component === 'popup') {
            window.kawakiri.Popup.do(target);
        }
    }

    static init() {
        document.addEventListener('click', this._onClick);
    }
}
