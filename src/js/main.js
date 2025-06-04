import Header from './components/header.js';
import Footer from './components/footer.js';

const LEFT_LINKS = ['countrybase', 'statistics', 'about'];
const RIGHT_LINKS = ['setting', 'educational', 'tutorial'];
const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];

const activeNavUrl = window.location.pathname;
let activeNav = activeNavUrl.split('/').slice(-1)
activeNav[0] = activeNav[0].replace(/\.html$/, '')
activeNav = activeNav[0]

const header = new Header();
document.body.prepend(header.render());

const footer = new Footer();
if (ALL_LINKS.includes(activeNav)) {
    document.body.append(footer.render());
}

ALL_LINKS.forEach((link) => {
    const activeLink = document.querySelector(`a[data-nav=${link}]`);
    if (activeNav === link) {
        activeLink.classList.add('active-nav')
    } else {
        activeLink.classList.remove('active-nav')
    }
})