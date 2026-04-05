const AVATAR_MOOD = {
    calm: "calm",
    angry: "angry",
    sad: "sad",
    thinking: "thinking",
};

class AvatarButton extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.actualMood = AVATAR_MOOD.calm;
        this.baseImage = "../Images/logo.webp";
        this.isAnimating = false;
        this.intervals = [];

        this.animations = [
            { "animation": "blink", "src": "../Images/logo-blink.webp", "duration": 1250 },
            { "animation": "angry", "src": "../Images/logo-angry.webp", "duration": 5000 },
            { "animation": "intrigued", "src": "../Images/logo-intrigued.webp", "duration": 5000 }
        ];

        this.probabilities = {
            [AVATAR_MOOD.calm]: {
                "blink": 0.6,
                "angry": 0.2,
                "intrigued": 0.2
            },
            [AVATAR_MOOD.angry]: {
                "blink": 0.2,
                "angry": 0.8,
            },
            [AVATAR_MOOD.sad]: {
                "blink": 0.8,
                "angry": 0.2
            },
            [AVATAR_MOOD.thinking]: {
                "blink": 0.4,
                "intrigued": 0.4,
                "angry": 0.2
            }
        };
    }

    connectedCallback() {
        this.render();
        this.swapImageToWebp();

        // Defer non-critical setup to avoid blocking the main thread (reduces TBT)
        const deferSetup = () => {
            this.setupEventListeners();
            this.startPeriodicAnimations();
        };

        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(deferSetup);
        } else {
            setTimeout(deferSetup, 100);
        }
    }

    disconnectedCallback() {
        // Clean up intervals when component is removed
        this.intervals.forEach(clearInterval);
    }

    swapImageToWebp() {
        const img = this.querySelector(".avatar-img");
        if (img) {
            // Load in background to avoid flickering (blank image)
            const webpImage = new Image();
            webpImage.src = this.baseImage;
            webpImage.onload = () => {
                img.src = this.baseImage;
            };
        }
    }

    getAnimationByMood(moodProba) {
        const rand = Math.random();
        let cumulative = 0;

        for (const anim of this.animations) {
            cumulative += moodProba[anim.animation] || 0;
            if (rand < cumulative) {
                return anim;
            }
        }
        return this.animations[0];
    }

    playAnimation(src, duration) {
        if (this.isAnimating) return;

        const img = this.querySelector(".avatar-img");
        if (!img) return;

        this.isAnimating = true;
        img.src = src;

        setTimeout(() => {
            img.src = this.baseImage;
            this.isAnimating = false;
        }, duration);
    }

    startPeriodicAnimations() {
        // Angry: every 580s
        this.intervals.push(setInterval(() => {
            this.playAnimation("../Images/logo-angry.webp", 5000);
        }, 580000));

        // Intrigued: every 150s
        this.intervals.push(setInterval(() => {
            this.playAnimation("../Images/logo-intrigued.webp", 5000);
        }, 150000));

        // Blink: every 60s
        this.intervals.push(setInterval(() => {
            this.playAnimation("../Images/logo-blink.webp", 1250);
        }, 60000));
    }

    setupEventListeners() {
        const avatarBtn = this.querySelector(".avatar-btn");
        if (!avatarBtn) return;

        let hasPlayedOnHover = false;

        avatarBtn.addEventListener("mouseenter", () => {
            if (hasPlayedOnHover) return;

            const moodProba = this.probabilities[this.actualMood];
            const animation = this.getAnimationByMood(moodProba);
            
            this.playAnimation(animation.src, animation.duration);
            hasPlayedOnHover = true;
        });

        avatarBtn.addEventListener("mouseleave", () => {
            hasPlayedOnHover = false;
        });

        avatarBtn.addEventListener("click", () => {
            // Placeholder for click logic
        });
    }

    render() {
        this.shadowRoot.innerHTML = `      
            <slot></slot>
        `;
    }
}

customElements.define("avatar-button", AvatarButton);
