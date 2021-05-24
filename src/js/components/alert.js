import Component from './component.js';

export default class Alert extends Component {
    static componentName = 'alert';
    static classes = {
        root: 'alert',
        hidden: 'alert--hidden'
    };

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
        }, { once: true });

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
