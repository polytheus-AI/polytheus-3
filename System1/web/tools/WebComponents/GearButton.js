
class GearButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.isOpen = false;
    }

    connectedCallback() {
        this.render();

        const deferSetup = () => {
            this.setupEventListeners();
        };

        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(deferSetup);
        } else {
            setTimeout(deferSetup, 100);
        }
    }

    setupEventListeners() {
        const gearBtn = this.querySelector(".gear-btn");
        if (gearBtn) {
            gearBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                this.toggleMenu();
            });
        }

        document.addEventListener("click", (e) => {
            if (this.isOpen && !this.shadowRoot.contains(e.target)) {
                this.closeMenu();
            }
        });

        this.shadowRoot.addEventListener("click", (e) => {
            e.stopPropagation();
        });
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.isOpen = true;
        const panel = this.shadowRoot.querySelector(".dropdown-panel");
        const gearImg = this.querySelector(".gear-img");
        if (panel) panel.classList.add("show");
        if (gearImg) gearImg.classList.add("rotated");
    }

    closeMenu() {
        this.isOpen = false;
        const panel = this.shadowRoot.querySelector(".dropdown-panel");
        const gearImg = this.querySelector(".gear-img");
        if (panel) panel.classList.remove("show");
        if (gearImg) gearImg.classList.remove("rotated");
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: relative;
                    display: inline-block;
                }

            
                .dropdown-panel {
                    position: absolute;
                    top: calc(100% + 12px);
                    left: 0;
                    background: rgba(26, 26, 26, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid #333;
                    border-radius: var(--border-radius-md, 12px);
                    padding: 8px;
                    min-width: 180px;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1000;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                }

                .dropdown-panel.show {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .menu-item {
                    background: transparent;
                    border: none;
                    color: #ccc;
                    padding: 10px 16px;
                    text-align: left;
                    font-size: 0.9rem;
                    font-weight: 500;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-family: inherit;
                    width: 100%;
                }

                .menu-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    padding-left: 20px;
                }

                .menu-item.connexion {
                    margin-top: 4px;
                    border-top: 1px solid #333;
                    padding-top: 12px;
                    color: var(--accent-yellow, #FFFF00);
                    font-weight: 700;
                }

                .menu-item.connexion:hover {
                    background: rgba(255, 255, 0, 0.1);
                    color: var(--accent-yellow, #FFFF00);
                }

                /* Arrow pointer */
                .dropdown-panel::before {
                    content: "";
                    position: absolute;
                    top: -6px;
                    left: 20px;
                    width: 12px;
                    height: 12px;
                    background: rgba(26, 26, 26, 0.95);
                    border-left: 1px solid #333;
                    border-top: 1px solid #333;
                    transform: rotate(45deg);
                }
            </style>
            <slot></slot>
            <div class="dropdown-panel">
                <button class="menu-item">Personnality</button>
                <button class="menu-item">Parameter</button>
                <button class="menu-item">Security</button>
                <button class="menu-item">Account</button>
                <button class="menu-item connexion">Connexion</button>
            </div>
        `;
    }
}

customElements.define("gear-button", GearButton);
