const avatar_mood = {
    calm: "calm",
    angry: "angry",
    sad: "sad",
    thinking: "thinking",
};

const actual_mood = avatar_mood.calm;


function changeSubtitle() {
    const subtitle = document.querySelector(".main-subtitle");
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

function getAnimationByMood(animations, probabilitiesForMood) {
    const rand = Math.random(); // 0 → 1
    let cumulative = 0;

    for (const anim of animations) {
        cumulative += probabilitiesForMood[anim.animation] || 0;

        if (rand < cumulative) {
            return anim;
        }
    }

    // fallback (in case probabilities don't sum to 1)
    return animations[0];
}

function changeAvatarOnMouseOver() {
    const avatarContainer = document.querySelector(".avatar-container");
    if (!avatarContainer) return;

    const avatar = document.querySelector(".avatar-img");
    if (!avatar) return;

    const base_image = "tools/images/logo.webp";

    const animations = [
        {"animation": "blink","src": "tools/images/logo-blink.webp", "duration": 1250},
        {"animation": "angry","src": "tools/images/logo-angry.webp", "duration": 5000},
        {"animation": "intrigued","src": "tools/images/logo-intrigued.webp", "duration": 5000}
    ];

    const probabilities = {
        [avatar_mood.calm]: {
           "blink": 0.6,
            "angry": 0.2,
            "intrigued": 0.2
        },
        [avatar_mood.angry]: {
            "blink": 0.2,
            "angry": 0.8,
        },
        [avatar_mood.sad]: {
            "blink": 0.8,
            "angry": 0.2
        },
        [avatar_mood.thinking]: {
            "blink": 0.4,
            "intrigued": 0.4,
            "angry": 0.2
        }
    };
        
    
    let hasPlayed = false;

    avatarContainer.addEventListener("mouseenter", () => {
        if (hasPlayed) return; // ⛔ prevent replay

        const moodProba = probabilities[actual_mood];
        const animation = getAnimationByMood(animations, moodProba);

        avatar.src = animation.src;
        hasPlayed = true;

        // Optional: return to normal after animation duration
        setTimeout(() => {
            avatar.src = base_image;
        }, animation.duration); // match your animation duration
    });

    avatarContainer.addEventListener("mouseleave", () => {
        hasPlayed = false; // reset when leaving
    });
}

function makeAnimationByTimeInterval() {
    const avatar = document.querySelector(".avatar-img");
    if (!avatar) return;

    const base_image = "tools/images/logo.webp";
    let isAnimating = false;

    function playAnimation(src, duration) {
        if (isAnimating) return; // 🚫 block if another animation is running

        isAnimating = true;
        avatar.src = src;

        setTimeout(() => {
            avatar.src = base_image;
            isAnimating = false;
        }, duration);
    }

    // make the most rare animation first for allowing it to play
    // If it's possible try to make a interval for each animation that is not a multiple of the previous one

    setInterval(() => {
        playAnimation("tools/images/logo-angry.webp", 5000);
    }, 580000);

    setInterval(() => {
        playAnimation("tools/images/logo-intrigued.webp", 5000);
    }, 150000);

    setInterval(() => {
        playAnimation("tools/images/logo-blink.webp", 1250);
    }, 60000);
}



makeAnimationByTimeInterval();

changeAvatarOnMouseOver();

changeSubtitle();