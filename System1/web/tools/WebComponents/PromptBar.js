class PromptBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // The input is in the light DOM, so we find it there
        const input = this.querySelector('input');
        const sendBtn = this.querySelector('.send-btn');
        
        if (input) {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const value = input.value.trim();
                    if (value) {
                        this.dispatchSubmit(value);
                        input.value = ''; // Clear input after submit
                    }
                }
            });
        }

        if (sendBtn && input) {
            sendBtn.addEventListener('click', () => {
                const value = input.value.trim();
                if (value) {
                    this.dispatchSubmit(value);
                    input.value = ''; // Clear input after submit
                }
            });
        }
    }

    dispatchSubmit(prompt) {
        // Dispatching on window to allow any component to listen easily
        const event = new CustomEvent('polytheus-prompt-submit', {
            detail: { prompt },
            bubbles: true,
            composed: true
        });
        window.dispatchEvent(event);
        console.log('Prompt submitted:', prompt);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                }
            </style>
            <slot></slot>
        `;
    }
}

customElements.define("prompt-bar", PromptBar);
