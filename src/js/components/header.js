// HEADER usable component for all pages
const LEFT_LINKS = ['countrybase', 'statistics', 'about'];
const RIGHT_LINKS = ['setting', 'educational', 'tutorial'];
const HEADER_TITLE = 'State of Mind';

class Header {
    constructor() {
        this._mobileMenuOpen = false;
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('container');

        const navLeft = this.createNavigation(LEFT_LINKS, 'nav-left');
        const navRight = this.createNavigation(RIGHT_LINKS, 'nav-right');
        const headerTitle = this.createHeaderTitle();
        const mobileMenu = this.createMobileMenu();
        const mobileMenuButton = this.createMobileMenuButton(mobileMenu);

        container.appendChild(navLeft);
        container.appendChild(headerTitle);
        container.appendChild(navRight);
        container.appendChild(mobileMenuButton);
        container.appendChild(mobileMenu);

        const headerElement = document.createElement('header');
        headerElement.classList.add('header');
        headerElement.appendChild(container);

        // Close menu when clicking on links
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'a') {
                mobileMenu.classList.remove('active');
                burger.classList.remove('active');
                document.body.style.overflow = '';
                mobileMenu.style.display = 'none';
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this._mobileMenuOpen) {
                mobileMenu.classList.remove('active');
                burger.classList.remove('active');
                document.body.style.overflow = '';
                mobileMenu.style.display = 'none';
            }
        });

        // Close menu on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1100 && this._mobileMenuOpen) {
                mobileMenu.classList.remove('active');
                burger.classList.remove('active');
                document.body.style.overflow = '';
                mobileMenu.style.display = 'none';
            }
        });

        return headerElement;
    }

    createNavigation(links, className) {
        const nav = document.createElement('nav');
        nav.classList.add(className);

        const ul = document.createElement('ul');
        ul.classList.add('nav-list');

        links.forEach(linkText => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.setAttribute('data-nav', linkText)
            a.href = `/src/pages/${linkText}.html`;
            a.textContent = linkText;
            li.appendChild(a);
            ul.appendChild(li);
        });

        nav.appendChild(ul);
        return nav;
    }

    createHeaderTitle() {
        const headerTitle = document.createElement('div');
        headerTitle.classList.add('header-title');

        const titleText = document.createElement('h1');
        titleText.classList.add('title-text');

        const titleLink = document.createElement('a');
        titleLink.href = '/index.html';
        titleLink.textContent = HEADER_TITLE;

        titleText.appendChild(titleLink);
        headerTitle.appendChild(titleText);

        return headerTitle;
    }

    createMobileMenuButton(mobileMenu) {
        const button = document.createElement('button');
        const burger = document.createElement('div');
        
        button.classList.add('mobile-menu-btn');
        button.setAttribute('id', 'mobileMenuBtn');
        button.setAttribute('aria-label', 'Toggle mobile menu');
        burger.classList.add('burger');
        burger.setAttribute('id', 'burger');

        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            burger.appendChild(span);
        }

        button.appendChild(burger)
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const isActive = burger.classList.contains('active');
            if (!isActive) {
                burger.classList.add('active');
                mobileMenu.style.display = 'flex';
                this._mobileMenuOpen = true;
            } else {
                burger.classList.remove('active');
                mobileMenu.style.display = 'none';
                this._mobileMenuOpen = false;
            }

            
        })

        return button
    }

    createMobileMenu() {
        const mobileMenu = document.createElement('div');
        mobileMenu.classList.add('mobile-menu');
        mobileMenu.setAttribute('id', 'mobileMenu');

        // Combine all links for mobile menu
        const allLinks = [...LEFT_LINKS, ...RIGHT_LINKS];
        
        allLinks.forEach(linkText => {
            const a = document.createElement('a');
            a.href = `/src/pages/${linkText}.html`;
            a.textContent = linkText;
            mobileMenu.appendChild(a);
        });

        return mobileMenu;
    }
}

export default Header;
