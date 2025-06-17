export const gameModes = [
  {
    name: "Classic Mode",
    route: "/gamemodeone",
    icon: "🎯",
    color: "var(--green-color)",
    info: "Given political system find every country within a certain period of time"
  },
  {
    name: "Figure Mode",
    route: "/gamemodethree",
    icon: "🧑",
    color: "var(--orange-color)",
    info: "Given political system find every country within a certain period of time"
  },
  {
    name: "Drag n Drop",
    route: "/dragthecountry",
    icon: "🔶",
    color: "var(--orange-color)",
    info: "Drag the country shape to its correct political system"
  },
];

export function createGameModeModal() {
  const existingModal = document.getElementById('gameModeModal');
  if (existingModal) {
    existingModal.remove();
  }

  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'gameModeModal';
  modalOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  `;

  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: var(--glass-bg);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border-color);
    border-radius: 20px;
    padding: 2.5rem;
    max-width: 600px;
    width: 90%;
    transform: translateY(30px) scale(0.9);
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  `;

  const header = document.createElement('div');
  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
      <h2 style="
        font-family: 'Graduate', cursive;
        font-size: var(--heading-size);
        color: var(--font-color);
        margin: 0;
        background: linear-gradient(135deg, var(--green-color), var(--orange-color));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      ">Choose Game Mode</h2>
      <button id="closeModal" style="
        background: none;
        border: none;
        color: var(--font-color);
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
      " onmouseover="this.style.background='rgba(255, 255, 255, 0.1)'; this.style.transform='rotate(90deg)'" onmouseout="this.style.background='none'; this.style.transform='rotate(0deg)'">✕</button>
    </div>
  `;

  const gameModeGrid = document.createElement('div');
  gameModeGrid.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  `;

  gameModes.forEach((mode, index) => {
    const modeCard = document.createElement('div');
    modeCard.style.cssText = `
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 15px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      transform: translateY(20px);
      opacity: 0;
      animation: slideInUp 0.6s ease forwards;
      animation-delay: ${index * 0.1}s;
    `;

    modeCard.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.5rem;">${mode.icon}</span>
          <h3 style="
            margin: 0;
            color: var(--font-color);
            font-size: var(--main-size);
            font-weight: 600;
          ">${mode.name}</h3>
        </div>
        <div class="info-icon" style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${mode.color};
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: white;
          cursor: help;
          position: relative;
        ">?</div>
      </div>
      <div class="mode-info" style="
        position: absolute;
        bottom: -100px;
        left: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.9);
        color: var(--font-color);
        padding: 0.75rem;
        border-radius: 8px;
        font-size: var(--caption-size);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
        z-index: 10;
      ">${mode.info}</div>
      <div class="glow-effect" style="
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, ${mode.color}20 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      "></div>
    `;

    modeCard.addEventListener('mouseenter', () => {
      modeCard.style.transform = 'translateY(-5px) scale(1.02)';
      modeCard.style.boxShadow = `0 15px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${mode.color}40`;
      modeCard.style.borderColor = mode.color;
      modeCard.querySelector('.glow-effect').style.opacity = '1';
      
      const infoIcon = modeCard.querySelector('.info-icon');
      const modeInfo = modeCard.querySelector('.mode-info');
      
      infoIcon.addEventListener('mouseenter', () => {
        modeInfo.style.opacity = '1';
        modeInfo.style.bottom = '1rem';
        modeInfo.style.pointerEvents = 'auto';
      });
      
      infoIcon.addEventListener('mouseleave', () => {
        modeInfo.style.opacity = '0';
        modeInfo.style.bottom = '-100px';
        modeInfo.style.pointerEvents = 'none';
      });
    });

    modeCard.addEventListener('mouseleave', () => {
      modeCard.style.transform = 'translateY(0) scale(1)';
      modeCard.style.boxShadow = 'none';
      modeCard.style.borderColor = 'var(--border-color)';
      modeCard.querySelector('.glow-effect').style.opacity = '0';
    });

    modeCard.addEventListener('click', () => {
      modeCard.style.transform = 'scale(0.95)';
      setTimeout(() => {
        // console.log(`Navigating to ${mode.route}`);
        
        window.location.href = `/democracy-game/src/pages${mode.route}`;
        closeModal();
      }, 150);
    });

    gameModeGrid.appendChild(modeCard);
  });

  modalContent.appendChild(header);
  modalContent.appendChild(gameModeGrid);
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInUp {
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    
    @keyframes modalFadeIn {
      to {
        opacity: 1;
      }
    }
    
    @keyframes modalContentIn {
      to {
        transform: translateY(0) scale(1);
      }
    }
  `;
  document.head.appendChild(style);

  const closeModal = () => {
    modalOverlay.style.opacity = '0';
    modalContent.style.transform = 'translateY(30px) scale(0.9)';
    setTimeout(() => {
      modalOverlay.remove();
      style.remove();
    }, 300);
  };

  document.getElementById('closeModal').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);

  setTimeout(() => {
    modalOverlay.style.opacity = '1';
    modalContent.style.transform = 'translateY(0) scale(1)';
  }, 10);
}