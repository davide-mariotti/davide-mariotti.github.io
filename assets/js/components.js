/**
 * Web Components for Header and Footer
 * This allows sharing the same menu and footer logic across all pages without duplicating fetch scripts.
 */

class AppHeader extends HTMLElement {
    async connectedCallback() {
        // We fetch the menu.html content
        // In a real production environment, you might inline the HTML here to avoid a fetch
        try {
            const response = await fetch('/menu.html');
            const html = await response.text();
            this.innerHTML = html;
            this.highlightActive();
            this.initMobileToggle();
        } catch (error) {
            console.error('Failed to load menu:', error);
        }
    }

    highlightActive() {
        const currentUrl = window.location.pathname;
        const menuItems = this.querySelectorAll(".navbar-nav .nav-item");

        menuItems.forEach(item => {
            const link = item.querySelector("a");
            if (link) {
                const menuItemUrl = link.getAttribute("href");
                // Match exact or check if it ends with it (handling / vs index.html)
                if (currentUrl === menuItemUrl ||
                    (currentUrl === '/' && menuItemUrl === '/') ||
                    (currentUrl === '/' && menuItemUrl === 'index.html') ||
                    (currentUrl.endsWith(menuItemUrl) && menuItemUrl !== '/')) {
                    item.classList.add("active");
                    link.classList.add("active");
                }
            }
        });
    }

    initMobileToggle() {
        const navbarToggler = this.querySelector(".navbar-toggler");
        const animatedIcon = this.querySelector(".animated-icon2");
        if (navbarToggler && animatedIcon) {
            navbarToggler.addEventListener("click", () => {
                animatedIcon.classList.toggle("open");
            });
        }
    }
}

class AppFooter extends HTMLElement {
    async connectedCallback() {
        try {
            const response = await fetch('/footer.html');
            const html = await response.text();
            this.innerHTML = html;
            this.updateCopyright();
            this.updateTime();
        } catch (error) {
            console.error('Failed to load footer:', error);
        }
    }

    updateCopyright() {
        const yearSpan = this.querySelector("#CopyrightYear");
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    updateTime() {
        const todayDataElement = this.querySelector("#todayData");
        if (!todayDataElement) return;

        const update = () => {
            const currentDate = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = currentDate.toLocaleDateString('en-US', options);
            const formattedTime = currentDate.getHours().toString().padStart(2, '0') + ":" +
                currentDate.getMinutes().toString().padStart(2, '0') + ":" +
                currentDate.getSeconds().toString().padStart(2, '0');
            todayDataElement.textContent = formattedDate + " " + formattedTime;
        };

        update();
        setInterval(update, 1000);
    }
}

// Define the custom elements
customElements.define('app-header', AppHeader);
customElements.define('app-footer', AppFooter);
