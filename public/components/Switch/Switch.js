import { createID } from '/createID.js';

export class Switch {
    #parent;
    #data;
    #id;

    constructor(parent, leftButtonText, rightButtonText) {
        this.#parent = parent;
        this.#id = 'switch--' + createID();
        this.#data = { id: this.#id, leftButtonText, rightButtonText };
    }

    get parent() {
        return this.#parent;
    }

    get data() {
        return this.#data;
    }

    setParent(newParent) {
        this.#parent = newParent;
    }

    parentDefined() {
        return !(this.#parent === null || this.#parent === undefined);
    }

    self() {
        if (this.parentDefined()) {
            return document.getElementById(this.#id);
        }
    }

    destroy() {
        if (this.self()) {
            this.self().remove();
        }
    }

    render() {
        this.destroy();
        if (!this.parentDefined()) {
            return;
        }
        const template = Handlebars.templates['Switch.hbs'];
        this.#parent.innerHTML += template(this.#data);
    }
}
