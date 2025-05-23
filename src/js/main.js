import Header from './components/header';

const headerContainer = document.getElementById('header');
const header = new Header();
headerContainer.prepend(header.render());