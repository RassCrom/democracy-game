import{H as x}from"./header-CHALseqc.js";class E{constructor(){this.gameLinks=["paly now","game modes","leaderboard","how to play"],this.aboutLinks=["our team","project info","TU Vienna","Contact"]}render(){const e=document.createElement("div");e.classList.add("container");const t=document.createElement("div");t.classList.add("footer-content"),this.createContent().forEach(i=>{t.appendChild(i)});const s=this.createFooterBottom(),o=document.createElement("footer");return o.classList.add("footer"),e.appendChild(t),e.appendChild(s),o.appendChild(e),o}createContent(){const e=[],t=this.createGameSection(),s=this.createAboutSection(),{brandHeading:o,brandText:i}=this.createBrandContent();for(let a=1;a<4;a++){const c=document.createElement("section");switch(c.classList.add("footer-section"),a===1&&c.classList.add("footer-brand"),a){case 1:c.append(o,i);break;case 2:c.append(t,this.createFooterLinks(this.gameLinks));break;case 3:c.append(s,this.createFooterLinks(this.aboutLinks));break}e.push(c)}return e}createBrandContent(){const e=document.createElement("h3");e.textContent="State of Mind";const t=document.createElement("p");return t.textContent="An interactive educational game exploring democracy and political regimes worldwide. Developed for the Web Mapping course at TU Vienna.",{brandHeading:e,brandText:t}}createFooterLinks(e){const t=document.createElement("div");return t.classList.add("footer-links"),e.forEach(s=>{const o=document.createElement("a");o.classList.add("footer-link"),o.textContent=s,o.href="#",t.appendChild(o)}),t}createGameSection(){const e=document.createElement("h3");return e.textContent="Game",e}createAboutSection(){const e=document.createElement("h3");return e.textContent="About",e}createFooterBottom(){const e=document.createElement("div");e.classList.add("footer-bottom");const t=document.createElement("p"),s=document.createTextNode("Made with "),o=document.createElement("span");o.classList.add("heart"),o.textContent="♥";const i=document.createTextNode(" by Cartography Students");t.append(s,o,i);const a=document.createElement("div");return a.classList.add("footer-logo"),a.textContent="© 2025 State of Mind",e.append(t),e.append(a),e}}const L=[{name:"Classic Mode",route:"/gamemodeone",icon:"🎯",color:"var(--green-color)",info:"Given political system find every country within a certain period of time"},{name:"Figure Mode",route:"/gamemodethree",icon:"🧑",color:"var(--orange-color)",info:"Given political system find every country within a certain period of time"},{name:"Drag n Drop",route:"/dragthecountry",icon:"🔶",color:"var(--orange-color)",info:"Drag the country shape to its correct political system"}];function k(){const l=document.getElementById("gameModeModal");l&&l.remove();const e=document.createElement("div");e.id="gameModeModal",e.style.cssText=`
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
  `;const t=document.createElement("div");t.style.cssText=`
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
  `;const s=document.createElement("div");s.innerHTML=`
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
  `;const o=document.createElement("div");o.style.cssText=`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  `,L.forEach((r,b)=>{const n=document.createElement("div");n.style.cssText=`
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
      animation-delay: ${b*.1}s;
    `,n.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.5rem;">${r.icon}</span>
          <h3 style="
            margin: 0;
            color: var(--font-color);
            font-size: var(--main-size);
            font-weight: 600;
          ">${r.name}</h3>
        </div>
        <div class="info-icon" style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${r.color};
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
      ">${r.info}</div>
      <div class="glow-effect" style="
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, ${r.color}20 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      "></div>
    `,n.addEventListener("mouseenter",()=>{n.style.transform="translateY(-5px) scale(1.02)",n.style.boxShadow=`0 15px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${r.color}40`,n.style.borderColor=r.color,n.querySelector(".glow-effect").style.opacity="1";const f=n.querySelector(".info-icon"),m=n.querySelector(".mode-info");f.addEventListener("mouseenter",()=>{m.style.opacity="1",m.style.bottom="1rem",m.style.pointerEvents="auto"}),f.addEventListener("mouseleave",()=>{m.style.opacity="0",m.style.bottom="-100px",m.style.pointerEvents="none"})}),n.addEventListener("mouseleave",()=>{n.style.transform="translateY(0) scale(1)",n.style.boxShadow="none",n.style.borderColor="var(--border-color)",n.querySelector(".glow-effect").style.opacity="0"}),n.addEventListener("click",()=>{n.style.transform="scale(0.95)",setTimeout(()=>{window.location.href=`/democracy-game/src/pages${r.route}`,a()},150)}),o.appendChild(n)}),t.appendChild(s),t.appendChild(o),e.appendChild(t),document.body.appendChild(e);const i=document.createElement("style");i.textContent=`
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
  `,document.head.appendChild(i);const a=()=>{e.style.opacity="0",t.style.transform="translateY(30px) scale(0.9)",setTimeout(()=>{e.remove(),i.remove()},300)};document.getElementById("closeModal").addEventListener("click",a),e.addEventListener("click",r=>{r.target===e&&a()});const c=r=>{r.key==="Escape"&&(a(),document.removeEventListener("keydown",c))};document.addEventListener("keydown",c),setTimeout(()=>{e.style.opacity="1",t.style.transform="translateY(0) scale(1)"},10)}const w=["countrybase","statistics","about"],C=["settings","educational","tutorial"],h=[...w,...C],v=["gamemodeone","gamemodethree"],u=document.createElement("div");u.classList.add("wrapper");document.body.prepend(u);const y=document.getElementsByTagName("main")[0],M=document.querySelector(".main-content"),S=window.location.pathname;let d=S.split("/").slice(-1);d[0]=d[0].replace(/\.html$/,"");d=d[0];console.log(d);const T=new x,I=new E;u.append(T.render());d===v[0]&&u.append(M);(h.includes(d)||v.includes(d))&&(y&&u.append(y),u.append(I.render()));h.forEach(l=>{const e=document.querySelector(`a[data-nav=${l}]`);d===l?e.classList.add("active-nav"):e.classList.remove("active-nav")});const p=document.getElementById("gamemode");p==null||p.addEventListener("click",()=>{window.location.href="/democracy-game/src/pages/settings"});p==null||p.setAttribute("role","link");var g;(g=document.getElementById("gameChoose"))==null||g.addEventListener("click",k);
