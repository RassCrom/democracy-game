class Footer {
    constructor() {
        this.gameLinks = ['paly now', 'game modes', 'leaderboard', 'how to play'];
        this.aboutLinks = ['our team', 'project info', 'TU Vienna', 'Contact']
    }

    render() {
        const container = document.createElement('div');
        container.classList.add('container');

        const footerContent = document.createElement('div');
        footerContent.classList.add('footer-content');
        this.createContent().forEach((section) => {
            footerContent.appendChild(section)
        })

        const footerBottom = this.createFooterBottom();

        const footerElement = document.createElement('footer');
        footerElement.classList.add('footer');
        container.appendChild(footerContent);
        container.appendChild(footerBottom);
        footerElement.appendChild(container);
        // footerElement.textContent = 'test'

        return footerElement;
    }

    createContent() {
        const footerSections = [];
        const gameSection = this.createGameSection();
        const aboutSection = this.createAboutSection();
        const { brandHeading, brandText } = this.createBrandContent();

        for (let i = 1; i < 4; i++) {
            const section = document.createElement('section');
            section.classList.add('footer-section')
            if (i === 1) section.classList.add('footer-brand');

            switch(i) {
                case 1:
                    section.append(brandHeading, brandText);
                    break;
                case 2:
                    section.append(gameSection, this.createFooterLinks(this.gameLinks))
                    break;
                case 3:
                    section.append(aboutSection, this.createFooterLinks(this.aboutLinks))
                    break;
            }
            footerSections.push(section);
        }

        return footerSections
    }

    createBrandContent() {
        const brandHeading = document.createElement('h3');
        brandHeading.textContent = 'State of Mind';

        const brandText = document.createElement('p');
        brandText.textContent = 'An interactive educational game exploring democracy and political regimes worldwide. Developed for the Web Mapping course at TU Vienna.';
        
        return { brandHeading, brandText }
    }

    createFooterLinks(linksList) {
        const footerLinks = document.createElement('div');
        footerLinks.classList.add('footer-links');
        linksList.forEach((link) => {
            const aLink = document.createElement('a');
            aLink.classList.add('footer-link');
            aLink.textContent = link;
            aLink.href = '#'
            footerLinks.appendChild(aLink);
        })

        return footerLinks
    }

    createGameSection() {
        const gameHeading = document.createElement('h3');
        gameHeading.textContent = 'Game';

        return gameHeading;

    }

    createAboutSection() {
        const aboutHeading = document.createElement('h3');
        aboutHeading.textContent = 'About';

        return aboutHeading;
    }

    createFooterBottom() {
        const footerBottom = document.createElement('div');
        footerBottom.classList.add('footer-bottom');

        const footerBottomText = document.createElement('p');
        const text1 = document.createTextNode('Made with ');
        const heart = document.createElement('span');
        heart.classList.add('heart');
        heart.textContent = '♥';
        const text2 = document.createTextNode(' by Cartography Students');
        footerBottomText.append(text1, heart, text2)

        const footerLogo = document.createElement('div');
        footerLogo.classList.add('footer-logo');
        footerLogo.textContent = '© 2025 State of Mind';

        footerBottom.append(footerBottomText);
        footerBottom.append(footerLogo);

        return footerBottom
    }
}

export default Footer;