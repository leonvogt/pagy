window.Pagy=(()=>{const j=new ResizeObserver((B)=>B.forEach((D)=>D.target.querySelectorAll(".pagy-rjs").forEach((E)=>E.pagyRender()))),x=(B,[D,E,z,G])=>{const F=B.parentElement??B,K=Object.keys(E).map((H)=>parseInt(H)).sort((H,M)=>M-H);let L=-1;const T=(H,M,R)=>H.replace(/__pagy_page__/g,M).replace(/__pagy_label__/g,R);if((B.pagyRender=function(){const H=K.find((Q)=>Q<F.clientWidth)||0;if(H===L)return;let M=D.before;const R=E[H.toString()],X=z?.[H.toString()]??R.map((Q)=>Q.toString());R.forEach((Q,J)=>{const $=X[J];let U;if(typeof Q==="number")U=T(D.a,Q.toString(),$);else if(Q==="gap")U=D.gap;else U=T(D.current,Q,$);M+=typeof G==="string"&&Q==1?Z(U,G):U}),M+=D.after,B.innerHTML="",B.insertAdjacentHTML("afterbegin",M),L=H})(),B.classList.contains("pagy-rjs"))j.observe(F)},A=(B,[D,E])=>Y(B,(z)=>[z,D.replace(/__pagy_page__/,z)],E),C=(B,[D,E,z])=>{Y(B,(G)=>{const F=Math.max(Math.ceil(D/parseInt(G)),1).toString(),K=E.replace(/__pagy_page__/,F).replace(/__pagy_items__/,G);return[F,K]},z)},Y=(B,D,E)=>{const z=B.querySelector("input"),G=B.querySelector("a"),F=z.value,K=function(){if(z.value===F)return;const[L,T,H]=[z.min,z.value,z.max].map((X)=>parseInt(X)||0);if(T<L||T>H){z.value=F,z.select();return}let[M,R]=D(z.value);if(typeof E==="string"&&M==="1")R=Z(R,E);G.href=R,G.click()};["change","focus"].forEach((L)=>z.addEventListener(L,()=>z.select())),z.addEventListener("focusout",K),z.addEventListener("keypress",(L)=>{if(L.key==="Enter")K()})},Z=(B,D)=>B.replace(new RegExp(`[?&]${D}=1\\b(?!&)|\\b${D}=1&`),"");return{version:"8.5.0",init(B){const E=(B instanceof Element?B:document).querySelectorAll("[data-pagy]");for(let z of E)try{const G=Uint8Array.from(atob(z.getAttribute("data-pagy")),(L)=>L.charCodeAt(0)),[F,...K]=JSON.parse((new TextDecoder()).decode(G));if(F==="nav")x(z,K);else if(F==="combo")A(z,K);else if(F==="selector")C(z,K);else console.warn("Skipped Pagy.init() for: %o\nUnknown keyword '%s'",z,F)}catch(G){console.warn("Skipped Pagy.init() for: %o\n%s",z,G)}}}})();

//# debugId=20862703AA72E11D64756e2164756e21
//# sourceMappingURL=pagy.min.js.map
