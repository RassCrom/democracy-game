import Header from './components/header.js';

const headerContainer = document.getElementById('header');
const header = new Header();
headerContainer.prepend(header.render());