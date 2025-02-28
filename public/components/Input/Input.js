export class Input {
    #parent;
    #data;
    #id;
    constructor(parent, type, name, placeholder) {
        this.#parent = parent;
        this.#id = 'input--' + crypto.randomUUID();
        this.#data = { id: this.#id, type, name, placeholder };
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
        const template = Handlebars.templates['Input.hbs'];
        this.#parent.innerHTML += template(this.#data);
    }
}
