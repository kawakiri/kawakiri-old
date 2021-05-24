(function () {
  'use strict';

  const data = new Map();

  class Component {
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

  class Alert extends Component {
    constructor(rootElement) {
      super();
      this.elements = {
        root: rootElement
      };
      Alert.setData(rootElement, this);
    }

    hide() {
      this.elements.root.addEventListener('transitionend', () => {
        this.elements.root.remove();
      }, {
        once: true
      });
      this.elements.root.classList.add(Alert.classes.hidden);
      Alert.deleteData(this.elements.root);
      return true;
    }

    static _onClick(event) {
      const target = event.target;

      if (target.dataset.component === 'alert') {
        window.kawakiri.Alert.do(target);
      }
    }

    static init() {
      document.addEventListener('click', this._onClick);
    }

  }

  Alert.componentName = 'alert';
  Alert.classes = {
    root: 'alert',
    hidden: 'alert--hidden'
  };

  class Modal extends Component {
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
      }, {
        once: true
      });
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
      }, {
        once: true
      });
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

  Modal.componentName = 'modal';
  Modal.classes = {
    root: 'modal',
    shown: 'modal--shown',
    dialog: 'modal__dialog',
    modalBody: 'modal-body'
  };
  Modal.shown = null;

  class Popup extends Component {
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

  Popup.componentName = 'popup';
  Popup.classes = {
    root: 'popup',
    button: 'popup__button',
    content: 'popup__content',
    upContent: 'popup__content--up',
    downContent: 'popup__content--down',
    shownContent: 'popup__content--shown'
  };
  Popup.shown = null;

  class Kawakiri {
    constructor(components) {
      window.kawakiri = this;

      for (const component of components) {
        this[component.name] = component;
        component.init();
      }
    }

  }

  new Kawakiri([Alert, Modal, Popup]);
})();