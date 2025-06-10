import Header from './components/header.js';
import Footer from './components/footer.js';

import { createGameModeModal } from './utils/chooseGame.js';

const LEFT_LINKS = ['countrybase', 'statistics', 'about'];
const RIGHT_LINKS = ['settings', 'educational', 'tutorial'];
const ALL_LINKS = [...LEFT_LINKS, ...RIGHT_LINKS];
const GAMEMODES = ['gamemodeone', 'gamemodethree']

const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');
document.body.prepend(wrapper);

const mains = document.getElementsByTagName('main')[0];
const mainContent = document.querySelector('.main-content');

const activeNavUrl = window.location.pathname;
let activeNav = activeNavUrl.split('/').slice(-1)
activeNav[0] = activeNav[0].replace(/\.html$/, '')
activeNav = activeNav[0]
console.log(activeNav)

const header = new Header();
const footer = new Footer();

wrapper.append(header.render());
if (activeNav === GAMEMODES[0]) wrapper.append(mainContent);
if (ALL_LINKS.includes(activeNav) || GAMEMODES.includes(activeNav)) {
    mains && wrapper.append(mains);
    wrapper.append(footer.render());
}

ALL_LINKS.forEach((link) => {
    const activeLink = document.querySelector(`a[data-nav=${link}]`);
    if (activeNav === link) {
        activeLink.classList.add('active-nav')
    } else {
        activeLink.classList.remove('active-nav')
    }
})

const gamemode = document.getElementById('gamemode');
gamemode?.addEventListener('click', () => {
    window.location.href = '/democracy-game/src/pages/settings';
})
gamemode?.setAttribute('role', 'link')

document.getElementById('gameChoose')?.addEventListener('click', createGameModeModal);