(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(t){const o={};return t.integrity&&(o.integrity=t.integrity),t.referrerPolicy&&(o.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?o.credentials="include":t.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(t){if(t.ep)return;t.ep=!0;const o=n(t);fetch(t.href,o)}})();const g=["countrybase","statistics","about"],b=["settings","educational","tutorial"],C="State of Mind";class k{constructor(){this._mobileMenuOpen=!1}render(){const e=document.createElement("div");e.classList.add("container");const n=this.createNavigation(g,"nav-left"),a=this.createNavigation(b,"nav-right"),t=this.createHeaderTitle(),o=this.createMobileMenu(),r=this.createMobileMenuButton(o);e.appendChild(n),e.appendChild(t),e.appendChild(a),e.appendChild(r),e.appendChild(o);const s=document.createElement("header");return s.classList.add("header"),s.appendChild(e),o.addEventListener("click",i=>{i.target.tagName==="a"&&(o.classList.remove("active"),burger.classList.remove("active"),document.body.style.overflow="",o.style.display="none")}),document.addEventListener("keydown",i=>{i.key==="Escape"&&this._mobileMenuOpen&&(o.classList.remove("active"),burger.classList.remove("active"),document.body.style.overflow="",o.style.display="none")}),window.addEventListener("resize",()=>{window.innerWidth>1100&&this._mobileMenuOpen&&(o.classList.remove("active"),burger.classList.remove("active"),document.body.style.overflow="",o.style.display="none")}),s}createNavigation(e,n){const a=document.createElement("nav");a.classList.add(n);const t=document.createElement("ul");return t.classList.add("nav-list"),e.forEach(o=>{const r=document.createElement("li"),s=document.createElement("a");s.setAttribute("data-nav",o),s.href=`/democracy-game/src/pages/${o}`,s.textContent=o,(o==="tutorial"||o==="educational")&&(s.addEventListener("click",function(i){i.preventDefault()}),s.style.opacity="0.5",s.style.cursor="not-allowed"),r.appendChild(s),t.appendChild(r)}),a.appendChild(t),a}createHeaderTitle(){const e=document.createElement("div");e.classList.add("header-title");const n=document.createElement("h1");n.classList.add("title-text");const a=document.createElement("a");return a.href="/democracy-game/src/pages/home",a.textContent=C,n.appendChild(a),e.appendChild(n),e}createMobileMenuButton(e){const n=document.createElement("button"),a=document.createElement("div");n.classList.add("mobile-menu-btn"),n.setAttribute("id","mobileMenuBtn"),n.setAttribute("aria-label","Toggle mobile menu"),a.classList.add("burger"),a.setAttribute("id","burger");for(let t=0;t<3;t++){const o=document.createElement("span");a.appendChild(o)}return n.appendChild(a),n.addEventListener("click",t=>{t.preventDefault(),a.classList.contains("active")?(a.classList.remove("active"),e.style.display="none",this._mobileMenuOpen=!1):(a.classList.add("active"),e.style.display="flex",this._mobileMenuOpen=!0)}),n}createMobileMenu(){const e=document.createElement("div");return e.classList.add("mobile-menu"),e.setAttribute("id","mobileMenu"),[...g,...b].forEach(a=>{const t=document.createElement("a");t.href=`/democracy-game/src/pages/${a}.html`,t.textContent=a,e.appendChild(t)}),e}}const M=[{name:"Classic Mode",route:"/gamemodeone",icon:"🎯",color:"var(--green-color)",info:"Given political system find every country within a certain period of time"},{name:"Figure Mode",route:"/gamemodethree",icon:"🧑",color:"var(--orange-color)",info:"Given political system find every country within a certain period of time"},{name:"Drag n Drop",route:"/dragthecountry",icon:"🔶",color:"var(--orange-color)",info:"Drag the country shape to its correct political system"}];function L(){const l=document.getElementById("gameModeModal");l&&l.remove();const e=document.createElement("div");e.id="gameModeModal",e.style.cssText=`
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
  `;const n=document.createElement("div");n.style.cssText=`
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
  `;const a=document.createElement("div");a.innerHTML=`
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
  `;const t=document.createElement("div");t.style.cssText=`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
  `,M.forEach((i,w)=>{const c=document.createElement("div");c.style.cssText=`
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
      animation-delay: ${w*.1}s;
    `,c.innerHTML=`
      <div style="display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <span style="font-size: 1.5rem;">${i.icon}</span>
          <h3 style="
            margin: 0;
            color: var(--font-color);
            font-size: var(--main-size);
            font-weight: 600;
          ">${i.name}</h3>
        </div>
        <div class="info-icon" style="
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${i.color};
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
      ">${i.info}</div>
      <div class="glow-effect" style="
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, ${i.color}20 0%, transparent 70%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      "></div>
    `,c.addEventListener("mouseenter",()=>{c.style.transform="translateY(-5px) scale(1.02)",c.style.boxShadow=`0 15px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${i.color}40`,c.style.borderColor=i.color,c.querySelector(".glow-effect").style.opacity="1";const h=c.querySelector(".info-icon"),m=c.querySelector(".mode-info");h.addEventListener("mouseenter",()=>{m.style.opacity="1",m.style.bottom="1rem",m.style.pointerEvents="auto"}),h.addEventListener("mouseleave",()=>{m.style.opacity="0",m.style.bottom="-100px",m.style.pointerEvents="none"})}),c.addEventListener("mouseleave",()=>{c.style.transform="translateY(0) scale(1)",c.style.boxShadow="none",c.style.borderColor="var(--border-color)",c.querySelector(".glow-effect").style.opacity="0"}),c.addEventListener("click",()=>{c.style.transform="scale(0.95)",setTimeout(()=>{window.location.href=`/democracy-game/src/pages${i.route}`,r()},150)}),t.appendChild(c)}),n.appendChild(a),n.appendChild(t),e.appendChild(n),document.body.appendChild(e);const o=document.createElement("style");o.textContent=`
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
  `,document.head.appendChild(o);const r=()=>{e.style.opacity="0",n.style.transform="translateY(30px) scale(0.9)",setTimeout(()=>{e.remove(),o.remove()},300)};document.getElementById("closeModal").addEventListener("click",r),e.addEventListener("click",i=>{i.target===e&&r()});const s=i=>{i.key==="Escape"&&(r(),document.removeEventListener("keydown",s))};document.addEventListener("keydown",s),setTimeout(()=>{e.style.opacity="1",n.style.transform="translateY(0) scale(1)"},10)}class S{constructor(){this.gameLinks=["play now","settings","statistics","countrybase"],this.aboutLinks=["project info","TU Vienna","MS Cartography"]}render(){const e=document.createElement("div");e.classList.add("container");const n=document.createElement("div");n.classList.add("footer-content"),this.createContent().forEach(o=>{n.appendChild(o)});const a=this.createFooterBottom(),t=document.createElement("footer");return t.classList.add("footer"),e.appendChild(n),e.appendChild(a),t.appendChild(e),t}createContent(){const e=[],n=this.createGameSection(),a=this.createAboutSection(),{brandHeading:t,brandText:o}=this.createBrandContent();for(let r=1;r<4;r++){const s=document.createElement("section");switch(s.classList.add("footer-section"),r===1&&s.classList.add("footer-brand"),r){case 1:s.append(t,o);break;case 2:s.append(n,this.createFooterLinks(this.gameLinks));break;case 3:s.append(a,this.createFooterLinks(this.aboutLinks));break}e.push(s)}return e}createBrandContent(){const e=document.createElement("h3");e.textContent="State of Mind";const n=document.createElement("p");return n.textContent="An interactive educational game exploring democracy and political regimes worldwide. Developed for the Web Mapping course at TU Vienna.",{brandHeading:e,brandText:n}}createFooterLinks(e){const n=document.createElement("div");return n.classList.add("footer-links"),e.forEach(a=>{const t=document.createElement("a");switch(t.classList.add("footer-link"),t.textContent=a,a.toLowerCase()){case"play now":t.href="#",t.addEventListener("click",o=>{o.preventDefault(),L()});break;case"settings":t.href="/democracy-game/src/pages/settings";break;case"statistics":t.href="/democracy-game/src/pages/statistics";break;case"countrybase":t.href="/democracy-game/src/pages/countrybase";break;case"project info":t.href="/democracy-game/src/pages/about";break;case"tu vienna":t.href="https://www.tuwien.at/",t.target="_blank";break;case"MS Cartography":t.href="https://cartographymaster.eu/",t.target="_blank";break;default:t.href="#"}n.appendChild(t)}),n}createGameSection(){const e=document.createElement("h3");return e.textContent="Game",e}createAboutSection(){const e=document.createElement("h3");return e.textContent="About",e}createFooterBottom(){const e=document.createElement("div");e.classList.add("footer-bottom");const n=document.createElement("p"),a=document.createTextNode("Made with "),t=document.createElement("span");t.classList.add("heart"),t.textContent="♥";const o=document.createTextNode(" by Cartography Students");n.append(a,t,o);const r=document.createElement("div");return r.classList.add("footer-logo"),r.textContent="© 2025 State of Mind",e.append(n),e.append(r),e}}const T=["countrybase","statistics","about"],I=["settings","educational","tutorial"],y=[...T,...I,"home"],E=["gamemodeone","gamemodethree"],A=window.location.pathname,d=A.split("/").pop().replace(/\.html$/,""),u=document.createElement("div");u.classList.add("wrapper");const v=document.querySelector("main"),B=document.querySelector(".main-content"),N=new k,x=new S;d!=="dragthecountry"&&document.body.prepend(u);y.includes(d)&&u.append(N.render());d===E[0]&&u.append(B);(y.includes(d)||E.includes(d))&&d!=="home"&&(v&&u.append(v),u.append(x.render()));d==="dragthecountry"&&(console.log(d),document.body.append(x.render()));y.forEach(l=>{const e=document.querySelector(`a[data-nav="${l}"]`);e&&(d===l&&d!=="home"?(e.classList.add("active-nav"),console.log(l)):e.classList.remove("active-nav"))});const p=document.getElementById("gamemode");p&&(p.setAttribute("role","link"),p.addEventListener("click",()=>{window.location.href="/democracy-game/src/pages/settings"}));const f=document.getElementById("gameChoose");f==null||f.addEventListener("click",L);export{k as H};
