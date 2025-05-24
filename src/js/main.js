import Header from './components/header.js';

const LEFT_LINKS = ['countrybase', 'statistics', 'about'];
const RIGHT_LINKS = ['setting', 'educational', 'tutorial'];
const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS]

// const headerContainer = document.getElementById('header');
const header = new Header();
document.body.prepend(header.render());

const activeNavUrl = window.location.pathname;
let activeNav = activeNavUrl.split('/').slice(-1)
activeNav[0] = activeNav[0].slice(0, -5)
activeNav = activeNav[0]
// console.log(activeNav)
ALL_LINKS.forEach((link) => {
    const activeLink = document.querySelector(`a[data-nav=${link}]`);
    if (activeNav === link) {
        activeLink.classList.add('active-nav')
    } else {
        activeLink.classList.remove('active-nav')
    }
})