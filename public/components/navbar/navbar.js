// import Handlebars from "handlebars";

const header = document.getElementsByName("header");

class Navbar {
    #parent;
    #config;

    constructor(parent, config) {
        this.#parent = parent;
        this.#config = config;
    }

    getParent() {
        return this.#parent;
    }

    getConfig() {
        return this.#config;
    }

    setParent(new_parent) {
        this.#parent = new_parent;
    }

    setConfig(new_config) {
        this.#config = new_config;
    }


    render() {
        if (this.#parent == null) {
            return;
        }


        let navbar = document.createElement('div');

        navbar.classList.add('navbar');


        const par = document.getElementsByTagName('header')[0];
        // par.appendChild(navbar);
        this.#parent.appendChild(navbar);

        return


    }







}

export default Navbar;