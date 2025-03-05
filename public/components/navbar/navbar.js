import Icon from '../icon/icon.js';
import SearchField from '../search_field/search_field.js';

const searchSvg = '/svg/search_button.svg';
const logoSvg = '/svg/logo_text_border_lining.svg';
const userSvg = '/svg/Avatar large.svg';

/**
 * Навигационная панель
 * @param {HTMLElement} parent - родительский элемент
 * @param {Object} config - конфигурация
 * @param {string} config.id - уникальный id элемента
 * @param {string} config.color - цвет содержимого кнопки
 * @param {boolean} config.disabled - флаг, что кнопка disabled
 * @param {string} config.form - форма, которая отправляется при нажатии кнопки.
 * Кнопка автоматически становится типа submit
 * @param {string} config.srcIcon - путь до иконки, которая будет внутри кнопки
 * @param {string} config.text - текст кнопки
 * @param {string} config.textColor - класс текста кнопки
 * @param {boolean} config.autofocus - автофокус на кнопку
 * @returns {Class}
 * @example
 * const nav = new Navbar(parent);
 */
class Navbar {
    #parent;

    constructor(parent) {
        this.#parent = parent;
    }

    self() {
        return document.querySelector('.navbar');
    }

    destroy() {
        if (this.self()) {
            this.self().remove();
        }
    }

    #elements() {
        return document.querySelector('.navbar_elements');
    }

    render() {
        if (!this.#parent) {
            return;
        }
        this.destroy();

        const navbar = document.createElement('navbar');
        navbar.classList.add('navbar');
        this.#parent.appendChild(navbar);
        // eslint-disable-next-line no-undef
        const navbarTempl = Handlebars.templates['navbar.hbs'];
        navbar.innerHTML = navbarTempl({});

        const navbarLogo = document.createElement('div');
        navbarLogo.classList.add('navbar__logo');
        this.#elements().appendChild(navbarLogo);

        const logo = new Icon(navbarLogo, {
            id: 'navbarLogo',
            srcIcon: logoSvg,
            link: '#'
        });
        logo.render();

        // поле поиска
        const searchField = new SearchField(this.#elements(), {
            id: 'search',
            placeholder: 'Название фильма для поиска',
            type: 'text',
            searchFormId: 'navbarsearchform',
            rightBtnId: 'rightBtn',
            rightIcon: searchSvg
        });
        searchField.render();

        // аватар Пользователя
        const user = new Icon(this.#elements(), {
            id: 'user',
            srcIcon: userSvg,
            size: 'large',
            text: 'Войти',
            textColor: 'secondary',
            link: '#',
            circular: true,
            direction: 'row'
        });
        user.render();
    }
}

export default Navbar;
