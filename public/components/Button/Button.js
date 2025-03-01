import { createID } from '/createID.js';

export class Button {
    #parent;
    #data;
    #id;

    constructor(parent, type, text) {
        this.#parent = parent;
        this.#id = 'button--' + createID();
        this.#data = { id: this.#id, type, text };
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
        if (!this.parentDefined) {
            return;
        }
        const template = Handlebars.templates['Button.hbs'];
        this.#parent.innerHTML += template(this.#data);
    }
}
