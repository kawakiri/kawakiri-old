import Component from './component.js';

export default class Modal extends Component {
    static componentName = 'Modal';
    static classes = {
        root: 'modal',
        shown: 'modal--shown',
        dialog: 'modal__dialog',
        modalBody: 'modal-body'
    };
    static shown = null;

    constructor(rootElement, buttonElement) {
        super();

        this.elements = {
            root: rootElement,
            dialog: rootElement.querySelector(`.${Modal.classes.dialog}`),
            button: buttonElement
        };

        rootElement.tabIndex = -1;

        this._transitionDuration = this._getTransitionDuration();

        Modal.setData(rootElement, this);
    }

    _getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }

    _onOutsideClick(event) {
        if (event.target.closest(`.${Modal.classes.dialog}`) === null) {
            Modal.shown.hide();
        }
    }

    _onEscapeKeydown(event) {
        if (event.key === 'Escape') {
            Modal.shown.hide();
        }
    }

    _onFocusin(event) {
        if (event.target.closest(`.${Modal.classes.root}`) === null) {
            event.relatedTarget.focus();
        }
    }

    show() {
        if (this.elements.root.classList.contains(Modal.classes.shown)) {
            return false;
        }

        if (Modal.shown !== null) {
            Modal.shown.hide();
        }

        Modal.shown = this;

        const scrollbarWidth = this._getScrollbarWidth();
        if (scrollbarWidth !== 0) {
            document.body.style.paddingRight = scrollbarWidth + 'px';
        }

        this.elements.root.addEventListener('transitionend', () => {
            this.elements.root.focus();
        }, { once: true });

        document.body.classList.add(Modal.classes.modalBody);
        this.elements.root.style.display = 'flex';
        setTimeout(() => this.elements.root.classList.add(Modal.classes.shown), 100);

        document.addEventListener('click', this._onOutsideClick);
        document.addEventListener('keydown', this._onEscapeKeydown);
        document.addEventListener('focusin', this._onFocusin);

        return true;
    }

    hide() {
        if (!this.elements.root.classList.contains(Modal.classes.shown)) {
            return false;
        }

        document.removeEventListener('click', this._onOutsideClick);
        document.removeEventListener('keydown', this._onEscapeKeydown);
        document.removeEventListener('focusin', this._onFocusin);

        this.elements.root.addEventListener('transitionend', event => {
            document.body.style.paddingRight = '';
            document.body.classList.remove(Modal.classes.modalBody);
            event.target.scrollTop = 0;

            this.elements.root.style.display = '';
            this.elements.button.focus();
        }, { once: true });

        this.elements.root.classList.remove(Modal.classes.shown);

        Modal.shown = null;

        return true;
    }

    toggle() {
        return this.show() || this.hide();
    }

    static _onClick(event) {
        const target = event.target;

        if (target.dataset.component === 'modal') {
            window.kawakiri.Modal.do(target);
        }
    }

    static init() {
        document.addEventListener('click', this._onClick);
    }
}
