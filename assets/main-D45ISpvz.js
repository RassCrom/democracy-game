(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function o(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(t){if(t.ep)return;t.ep=!0;const n=o(t);fetch(t.href,n)}})();const y=["countrybase","statistics","about"],h=["settings","educational","tutorial"],x="State of Mind";class C{constructor(){this._mobileMenuOpen=!1}render(){const e=document.createElement("div");e.classList.add("container");const o=this.createNavigation(y,"nav-left"),a=this.createNavigation(h,"nav-right"),t=this.createHeaderTitle(),n=this.createMobileMenu(),r=this.createMobileMenuButton(n);e.appendChild(o),e.appendChild(t),e.appendChild(a),e.appendChild(r),e.appendChild(n);const s=document.createElement("header");return s.classList.add("header"),s.appendChild(e),n.addEventListener("click",i=>{i.target.tagName==="a"&&(n.classList.remove("active"),burger.classList.remove("active"),document.body.style.overflow="",n.style.display="none")}),document.addEventListener("keydown",i=>{i.key==="Escape"&&this._mobileMenuOpen&&(n.classList.remove("active"),burger.classList.remove("active"),document.body.style.overflow="",n.style.display="none")}),window.addEventListener("resize",()=>{window.innerWidth>1100&&this._mobileMenuOpen&&(n.classList.remove("active"),burger.classList.remove("active"),document.body.style.overflow="",n.style.display="none")}),s}createNavigation(e,o){const a=document.createElement("nav");a.classList.add(o);const t=document.createElement("ul");return t.classList.add("nav-list"),e.forEach(n=>{const r=document.createElement("li"),s=document.createElement("a");s.setAttribute("data-nav",n),s.href=`/democracy-game/src/pages/${n}`,s.textContent=n,n==="tutorial"&&(s.addEventListener("click",function(i){i.preventDefault()}),s.style.opacity="0.5",s.style.cursor="not-allowed"),r.appendChild(s),t.appendChild(r)}),a.appendChild(t),a}createHeaderTitle(){const e=document.createElement("div");e.classList.add("header-title");const o=document.createElement("h1");o.classList.add("title-text");const a=document.createElement("a");return a.href="/democracy-game/src/pages/home",a.textContent=x,o.appendChild(a),e.appendChild(o),e}createMobileMenuButton(e){const o=document.createElement("button"),a=document.createElement("div");o.classList.add("mobile-menu-btn"),o.setAttribute("id","mobileMenuBtn"),o.setAttribute("aria-label","Toggle mobile menu"),a.classList.add("burger"),a.setAttribute("id","burger");for(let t=0;t<3;t++){const n=document.createElement("span");a.appendChild(n)}return o.appendChild(a),o.addEventListener("click",t=>{t.preventDefault(),a.classList.contains("active")?(a.classList.remove("active"),e.style.display="none",this._mobileMenuOpen=!1):(a.classList.add("active"),e.style.display="flex",this._mobileMenuOpen=!0)}),o}createMobileMenu(){const e=document.createElement("div");return e.classList.add("mobile-menu"),e.setAttribute("id","mobileMenu"),[...y,...h].forEach(a=>{const t=document.createElement("a");t.href=`/democracy-game/src/pages/${a}.html`,t.textContent=a,e.appendChild(t)}),e}}class w{constructor(){this.gameLinks=["paly now","game modes","leaderboard","how to play"],this.aboutLinks=["our team","project info","TU Vienna","Contact"]}render(){const e=document.createElement("div");e.classList.add("container");const o=document.createElement("div");o.classList.add("footer-content"),this.createContent().forEach(n=>{o.appendChild(n)});const a=this.createFooterBottom(),t=document.createElement("footer");return t.classList.add("footer"),e.appendChild(o),e.appendChild(a),t.appendChild(e),t}createContent(){const e=[],o=this.createGameSection(),a=this.createAboutSection(),{brandHeading:t,brandText:n}=this.createBrandContent();for(let r=1;r<4;r++){const s=document.createElement("section");switch(s.classList.add("footer-section"),r===1&&s.classList.add("footer-brand"),r){case 1:s.append(t,n);break;case 2:s.append(o,this.createFooterLinks(this.gameLinks));break;case 3:s.append(a,this.createFooterLinks(this.aboutLinks));break}e.push(s)}return e}createBrandContent(){const e=document.createElement("h3");e.textContent="State of Mind";const o=document.createElement("p");return o.textContent="An interactive educational game exploring democracy and political regimes worldwide. Developed for the Web Mapping course at TU Vienna.",{brandHeading:e,brandText:o}}createFooterLinks(e){const o=document.createElement("div");return o.classList.add("footer-links"),e.forEach(a=>{const t=document.createElement("a");t.classList.add("footer-link"),t.textContent=a,t.href="#",o.appendChild(t)}),o}createGameSection(){const e=document.createElement("h3");return e.textContent="Game",e}createAboutSection(){const e=document.createElement("h3");return e.textContent="About",e}createFooterBottom(){const e=document.createElement("div");e.classList.add("footer-bottom");const o=document.createElement("p"),a=document.createTextNode("Made with "),t=document.createElement("span");t.classList.add("heart"),t.textContent="♥";const n=document.createTextNode(" by Cartography Students");o.append(a,t,n);const r=document.createElement("div");return r.classList.add("footer-logo"),r.textContent="© 2025 State of Mind",e.append(o),e.append(r),e}}const M=[{name:"Classic Mode",route:"/gamemodeone",icon:"🎯",color:"var(--green-color)",info:"Given political system find every country within a certain period of time"},{name:"Figure Mode",route:"/gamemodethree",icon:"🎯",color:"var(--orange-color)",info:"Given political system find every country within a certain period of time"}];function k(){const l=document.getElementById("gameModeModal");l&&l.remove();const e=document.createElement("div");e.id="gameModeModal",e.style.cssText=`
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
  `;const o=document.createElement("div");o.style.cssText=`
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
  `,M.forEach((i,E)=>{const c=document.createElement("div");c.style.cssText=`
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
      animation-delay: ${E*.1}s;
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
    `,c.addEventListener("mouseenter",()=>{c.style.transform="translateY(-5px) scale(1.02)",c.style.boxShadow=`0 15px 40px rgba(0, 0, 0, 0.3), 0 0 30px ${i.color}40`,c.style.borderColor=i.color,c.querySelector(".glow-effect").style.opacity="1";const f=c.querySelector(".info-icon"),m=c.querySelector(".mode-info");f.addEventListener("mouseenter",()=>{m.style.opacity="1",m.style.bottom="1rem",m.style.pointerEvents="auto"}),f.addEventListener("mouseleave",()=>{m.style.opacity="0",m.style.bottom="-100px",m.style.pointerEvents="none"})}),c.addEventListener("mouseleave",()=>{c.style.transform="translateY(0) scale(1)",c.style.boxShadow="none",c.style.borderColor="var(--border-color)",c.querySelector(".glow-effect").style.opacity="0"}),c.addEventListener("click",()=>{c.style.transform="scale(0.95)",setTimeout(()=>{window.location.href=`/democracy-game/src/pages${i.route}`,r()},150)}),t.appendChild(c)}),o.appendChild(a),o.appendChild(t),e.appendChild(o),document.body.appendChild(e);const n=document.createElement("style");n.textContent=`
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
  `,document.head.appendChild(n);const r=()=>{e.style.opacity="0",o.style.transform="translateY(30px) scale(0.9)",setTimeout(()=>{e.remove(),n.remove()},300)};document.getElementById("closeModal").addEventListener("click",r),e.addEventListener("click",i=>{i.target===e&&r()});const s=i=>{i.key==="Escape"&&(r(),document.removeEventListener("keydown",s))};document.addEventListener("keydown",s),setTimeout(()=>{e.style.opacity="1",o.style.transform="translateY(0) scale(1)"},10)}const S=["countrybase","statistics","about"],T=["settings","educational","tutorial"],b=[...S,...T],L=["gamemodeone","gamemodethree"],p=document.createElement("div");p.classList.add("wrapper");document.body.prepend(p);const v=document.getElementsByTagName("main")[0],I=document.querySelector(".main-content"),N=window.location.pathname;let d=N.split("/").slice(-1);d[0]=d[0].replace(/\.html$/,"");d=d[0];console.log(d);const A=new C,B=new w;p.append(A.render());d===L[0]&&p.append(I);(b.includes(d)||L.includes(d))&&(v&&p.append(v),p.append(B.render()));b.forEach(l=>{const e=document.querySelector(`a[data-nav=${l}]`);d===l?e.classList.add("active-nav"):e.classList.remove("active-nav")});const u=document.getElementById("gamemode");u==null||u.addEventListener("click",()=>{window.location.href="/democracy-game/src/pages/settings"});u==null||u.setAttribute("role","link");var g;(g=document.getElementById("gameChoose"))==null||g.addEventListener("click",k);
