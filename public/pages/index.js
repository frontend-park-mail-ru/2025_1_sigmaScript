const rootElement = document.getElementById('root');
const headerElement = document.createElement('header');
const menuElement = document.createElement('aside');
const pageElement = document.createElement('main');

rootElement.appendChild(headerElement);
rootElement.appendChild(menuElement);
rootElement.appendChild(pageElement);

headerElement.innerHTML = "FilmLook"
menuElement.innerHTML = "Menu"
pageElement.innerHTML = "Some content"

