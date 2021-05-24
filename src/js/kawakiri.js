import Alert from './components/alert.js';
import Modal from './components/modal.js';
import Popup from './components/popup.js';

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
