

class MainSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        this.render();

        const slot = this.shadowRoot.querySelector("slot");

        slot.addEventListener("slotchange", () => {
            this.changeSubtitle();
        });
    }

    changeSubtitle() {
        const subtitle = this.querySelector(".main-subtitle");
        if (!subtitle) return;

        const subtitles = [
            "Generate a 3D model from an image",
            "Optimize a complex database query",
            "Create a new UI component for my app",
            "Solve a quantum physics problem"
        ];
        let index = 1;

        setInterval(() => {
            // Step 1: Fade out (slides up)
            subtitle.classList.add("fade-out");

            setTimeout(() => {
                // Step 2: Prepare for fade in (move to bottom while invisible)
                subtitle.textContent = subtitles[index];
            
                subtitle.classList.remove("fade-out");

                // Force reflow
                void subtitle.offsetWidth;

                // Step 3: Fade in (slides up from bottom to center)
                index = (index + 1) % subtitles.length;
            }, 600); // Wait for fade-out to complete (0.6s)
        }, 4000);
    }

    render() {
        this.shadowRoot.innerHTML = `
            <slot></slot>
        `;
    }
}

customElements.define("main-section", MainSection);