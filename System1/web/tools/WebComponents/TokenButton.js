

class TokenButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.swapImageToWebp();

        // Defer non-critical setup
        const deferSetup = () => {
            this.setupEventListeners();
        };

        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(deferSetup);
        } else {
            setTimeout(deferSetup, 100);
        }
    }

    swapImageToWebp() {
        const img = this.querySelector(".icon");
        if (img) {
            const webpImage = new Image();
            webpImage.src = "../Images/diamond.webp";
            webpImage.onload = () => {
                img.src = "../Images/diamond.webp";
            };
        }
    }

    setupEventListeners() {
        const tokenBtn = this.querySelector(".token-btn");
        if (tokenBtn) {
            tokenBtn.addEventListener("click", () => {
                // TODO: add thing here
            });
        }
    }

    render() {
        this.shadowRoot.innerHTML = `      
            <slot></slot>
        `;
    }
}

customElements.define("token-button", TokenButton);