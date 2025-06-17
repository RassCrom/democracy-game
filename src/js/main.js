import Header from './components/header.js';
import Footer from './components/footer.js';
import { createGameModeModal } from './utils/chooseGame.js';

const LEFT_LINKS = ['countrybase', 'statistics', 'about'];
const RIGHT_LINKS = ['settings', 'educational', 'tutorial'];
const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS, 'home'];
const GAMEMODES = ['gamemodeone', 'gamemodethree'];

const currentPath = window.location.pathname;
const activeNav = currentPath.split('/').pop().replace(/\.html$/, '');

const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');

const mainElement = document.querySelector('main');

const header = new Header();
const footer = new Footer();

if (activeNav !== 'dragthecountry') {
    document.body.prepend(wrapper);
}

if (ALL_LINKS.includes(activeNav)) {
    wrapper.append(header.render());
}

if ((ALL_LINKS.includes(activeNav) || GAMEMODES.includes(activeNav)) && activeNav !== 'home') {
    if (mainElement) wrapper.append(mainElement);
    wrapper.append(footer.render());
}

if (activeNav === 'dragthecountry' || activeNav === 'gamemodefour') {
    // console.log(activeNav);
    document.body.append(footer.render());
}

ALL_LINKS.forEach(link => {
    const navLink = document.querySelector(`a[data-nav="${link}"]`);
    if (!navLink) return;

    if (activeNav === link && activeNav !== 'home') {
        navLink.classList.add('active-nav');
        // console.log(link);
    } else {
        navLink.classList.remove('active-nav');
    }
});

const gamemodeBtn = document.getElementById('gamemode');
if (gamemodeBtn) {
    gamemodeBtn.setAttribute('role', 'link');
    gamemodeBtn.addEventListener('click', () => {
        window.location.href = '/democracy-game/src/pages/settings';
    });
}

const gameChooseBtn = document.getElementById('gameChoose');
gameChooseBtn?.addEventListener('click', createGameModeModal);
