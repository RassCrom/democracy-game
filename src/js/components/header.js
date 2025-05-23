// // HEADER usable component for all pages
const LEFT_LINKS = ['countrybase', 'stats', 'about'];
const RIGHT_LINKS = ['setting', 'educational', 'tutorial'];
const HEADER_TITLE = 'State of Mind';

class Header {
    constructor() {}

    render() {
        const container = document.createElement('div');
        const navLeft = document.createElement('nav');
        const navRight = document.createElement('nav');
        const headerTitle = document.createElement('div');
        const textTitle = document.createElement('h1');
        const uListLeft = document.createElement('ul');
        const uListRight = document.createElement('ul');

        container.classList.add('container');
        navLeft.classList.add('nav-left');
        navRight.classList.add('nav-right');
        headerTitle.classList.add('header-title');
        textTitle.classList.add('title-text');
        uListLeft.classList.add('nav-list');
        uListRight.classList.add('nav-list');

        textTitle.textContent = HEADER_TITLE;
        // textTitle.href = './home';

        headerTitle.appendChild(textTitle);

        LEFT_LINKS.forEach(linkText => {
            navLeft.appendChild(uListLeft);
            const a = document.createElement('a');
            a.href = `./${linkText}`;
            a.textContent = linkText;
            uListLeft.appendChild(a);
        });

        RIGHT_LINKS.forEach(linkText => {
            navRight.appendChild(uListRight);
            const a = document.createElement('a');
            a.href = `./${linkText}`;
            a.textContent = linkText;
            uListRight.appendChild(a);
        });

        container.appendChild(navLeft);
        container.appendChild(headerTitle);
        container.appendChild(navRight);

        return container;
    }
}

export default Header;
