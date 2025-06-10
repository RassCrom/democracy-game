import"./header-CHALseqc.js";import"./main-CV5O20o0.js";const r=document.querySelector(".input-form input"),u=document.querySelector(".clear-btn"),i=document.querySelector(".input-form");let n=[],a=[];r.addEventListener("input",t=>{const e=t.target.value;e.length>0?i.classList.add("has-content"):i.classList.remove("has-content"),d(e)});u.addEventListener("click",()=>{r.value="",i.classList.remove("has-content"),d(""),r.focus()});async function p(){try{n=(await(await fetch("/democracy-game/assets/data/wm2.geojson")).json()).features.map(s=>s.properties),a=[...n],l(a)}catch(t){console.error("Error loading countries:",t)}}function l(t){const e=document.getElementById("countries-container");e.innerHTML="",t.forEach(s=>{const o=f(s);e.appendChild(o)})}function f(t){const e=document.createElement("div");e.className="country-card";const s=c(t.POP_EST),o=c(t.GDP_MD);return e.innerHTML=`
       <div class="country-type">${t.TYPE||"Country"}</div>
       <h4>${t.NAME}</h4>
       <div class="country-info">
           <div class="country-stat">
               <span class="stat-label">Political Status:</span>
               <span class="stat-value">${t.Political_||"N/A"}</span>
           </div>
           <div class="country-stat">
               <span class="stat-label">Population:</span>
               <span class="stat-value">${s}</span>
           </div>
           <div class="country-stat">
               <span class="stat-label">GDP (Million):</span>
               <span class="stat-value">$${o}</span>
           </div>
       </div>
   `,e}function c(t){return!t||t===-1?"N/A":t>=1e9?(t/1e9).toFixed(1)+"B":t>=1e6?(t/1e6).toFixed(1)+"M":t>=1e3?(t/1e3).toFixed(1)+"K":t.toString()}function d(t){if(!t.trim())a=[...n];else{const e=t.toLowerCase();a=n.filter(s=>s.NAME.toLowerCase().includes(e)||s.Political_&&s.Political_.toLowerCase().includes(e)||s.TYPE&&s.TYPE.toLowerCase().includes(e))}l(a)}document.addEventListener("DOMContentLoaded",p);
