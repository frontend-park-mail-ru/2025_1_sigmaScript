export class Switch {
    #parent;
    #data;

    constructor(parent, leftButtonText, rightButtonText) {
        this.#parent = parent;
        this.#data = { leftButtonText, rightButtonText };
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
        return document.querySelector('.switch');
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
        const template = Handlebars.templates['Switch.hbs'];
        this.#parent.innerHTML += template(this.#data);
    }
}
