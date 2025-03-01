import { createID } from '/createID.js';

export class Input {
    #parent;
    #data;
    #id;
    constructor(parent, type, name, placeholder) {
        this.#parent = parent;
        this.#id = 'input--' + createID();
        this.#data = { id: this.#id, type, name, placeholder };
    }

    get parent() {
        return this.#parent;
    }

    get data() {
        return this.#data;
    }

    parentDefined() {
        return !(this.#parent === null || this.#parent === undefined);
    }

    getErrorContainer() {
        if (this.parentDefined()) {
            return this.self().querySelector('.input__error-container');
        }
    }

    setParent(newParent) {
        this.#parent = newParent;
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
        const template = Handlebars.templates['Input.hbs'];
        this.#parent.innerHTML += template(this.#data);
    }
}
