export class Button {
    #parent;
    #data;
    #id;

    constructor(parent, type, text) {
        this.#parent = parent;
        this.#id = 'button--' + crypto.randomUUID();
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

    self() {
        return document.querySelector('.' + this.#id);
    }

    destroy() {
        if (this.self()) {
            this.self().remove();
        }
    }

    render() {
        this.destroy();
        if (this.#parent === null || this.#parent === undefined) {
            return;
        }
        const template = Handlebars.templates['Button.hbs'];
        this.#parent.innerHTML += template(this.#data);
    }
}
