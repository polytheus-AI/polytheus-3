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

    OwlThinking(){
        
    }

    showLoginBubble() {
        const bubble = this.shadowRoot.querySelector('.login-bubble');
        if (bubble) {
            bubble.classList.add('show');
            // Automatically hide after 8 seconds if not interacted with
            setTimeout(() => {
                bubble.classList.remove('show');
            }, 8000);
        }
    }

    setupEventListeners() {
        const avatarBtn = this.querySelector(".avatar-btn");
        if (!avatarBtn) return;

        let hasPlayedOnHover = false;

        // Listen for prompt submission
        window.addEventListener('polytheus-prompt-submit', () => {
            this.showLoginBubble();
        });

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
            this.OwlThinking();
        });
    }

    render() {
        this.shadowRoot.innerHTML = `      
            <style>
                :host {
                    position: relative;
                    display: inline-block;
                }

                .login-bubble {
                    position: absolute;
                    right: 120%;
                    top: 50%;
                    transform: translateY(-50%) translateX(20px);
                    background: rgba(20, 20, 20, 0.7);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1.5px solid var(--accent-yellow, #FFFF00);
                    border-radius: 16px;
                    padding: 12px 20px;
                    color: white;
                    font-family: 'Noto Sans', sans-serif;
                    font-size: 0.95rem;
                    font-weight: 500;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 255, 0, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 1000;
                }

                .login-bubble::after {
                    content: '';
                    position: absolute;
                    left: 100%;
                    top: 50%;
                    transform: translateY(-50%);
                    border-width: 10px;
                    border-style: solid;
                    border-color: transparent transparent transparent var(--accent-yellow, #FFFF00);
                }

                .login-bubble.show {
                    opacity: 1;
                    transform: translateY(-50%) translateX(0);
                    pointer-events: auto;
                }

                .login-link {
                    color: var(--accent-yellow, #FFFF00);
                    text-decoration: none;
                    font-weight: 700;
                    border-bottom: 2px solid transparent;
                    transition: border-color 0.2s;
                }

                .login-link:hover {
                    border-color: var(--accent-yellow, #FFFF00);
                }

                @media (max-width: 600px) {
                    .login-bubble {
                        right: -5px;
                        top: 110%;
                        transform: translateY(-10px);
                        white-space: normal;
                        width: 220px;
                        text-align: center;
                    }
                    .login-bubble::after {
                        left: auto;
                        right: 25px;
                        top: -19px;
                        transform: none;
                        border-color: transparent transparent var(--accent-yellow, #FFFF00) transparent;
                    }
                    .login-bubble.show {
                        transform: translateY(0);
                    }
                }
            </style>
            <div class="login-bubble">
                <span>Please <a href="/login" class="login-link">log in</a> for speaking with Polytheus</span>
            </div>
            <slot></slot>
        `;
    }
}

customElements.define("avatar-button", AvatarButton);
