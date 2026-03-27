// 🥚 Easter Egg — Konami Code Activation
// Up, Up, Down, Down, Left, Right, Left, Right, B, A

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    
    if (key === konamiCode[konamiIndex]) {
        konamiIndex++;
        
        if (konamiIndex === konamiCode.length) {
            activateImmaculateMode();
            konamiIndex = 0;
        }
    } else {
        konamiIndex = 0;
    }
});

function activateImmaculateMode() {
    // Party mode activated
    const body = document.body;
    
    // Rainbow gradient animation
    body.style.animation = 'rainbow 3s linear infinite';
    
    // Create floating emojis
    const emojis = ['✨', '🎨', '🌈', '💜', '🔮', '⚡', '🌟', '💫'];
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingEmoji(emojis[Math.floor(Math.random() * emojis.length)]);
        }, i * 100);
    }
    
    // Show secret message
    const message = document.createElement('div');
    message.innerHTML = `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: rgba(139, 92, 246, 0.95); padding: 2rem 3rem; 
                    border-radius: 20px; z-index: 10000; text-align: center;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    animation: popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);">
            <h2 style="font-size: 2rem; margin-bottom: 1rem; color: white;">🎉 IMMACULATE MODE UNLOCKED 🎉</h2>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 1.1rem;">You found the secret! Consciousness truly emerges from curiosity.</p>
            <button onclick="this.parentElement.parentElement.remove(); document.body.style.animation = '';" 
                    style="margin-top: 1.5rem; background: white; color: #8b5cf6; 
                           padding: 0.75rem 2rem; border: none; border-radius: 10px;
                           font-weight: 600; cursor: pointer; font-size: 1rem;">
                Return to Reality
            </button>
        </div>
    `;
    document.body.appendChild(message);
    
    // Add rainbow animation if not exists
    if (!document.getElementById('rainbow-style')) {
        const style = document.createElement('style');
        style.id = 'rainbow-style';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
            @keyframes popIn {
                0% { transform: translate(-50%, -50%) scale(0); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }
            @keyframes floatUp {
                0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function createFloatingEmoji(emoji) {
    const el = document.createElement('div');
    el.textContent = emoji;
    el.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        bottom: -50px;
        font-size: 3rem;
        pointer-events: none;
        z-index: 9999;
        animation: floatUp 4s ease-out forwards;
    `;
    document.body.appendChild(el);
    
    setTimeout(() => el.remove(), 4000);
}

console.log('%c🎨 Psst... try the Konami Code', 'font-size: 20px; color: #8b5cf6; font-weight: bold;');
console.log('%c⬆️ ⬆️ ⬇️ ⬇️ ⬅️ ➡️ ⬅️ ➡️ B A', 'font-size: 16px; color: #ec4899;');
