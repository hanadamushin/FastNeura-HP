(()=>{'use strict';
const modal=document.getElementById('environmentIntelligenceModal');
const openButton=document.getElementById('environmentIntelligenceButton');
const closeButton=modal?.querySelector('.modal-close');
let previousFocus=null;
function openModal(){if(!modal)return;previousFocus=document.activeElement;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';closeButton?.focus()}
function closeModal(){if(!modal)return;modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';previousFocus?.focus?.()}
openButton?.addEventListener('click',openModal);
closeButton?.addEventListener('click',closeModal);
modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('open'))closeModal()});

const header=document.querySelector('.site-header');
const oldNav=header?.querySelector('.nav');
if(oldNav)oldNav.style.display='none';

if(!document.querySelector('.desktop-orbit-nav')){
  const orbit=document.createElement('nav');
  orbit.className='desktop-orbit-nav';
  orbit.setAttribute('aria-label','Desktop navigation');
  orbit.innerHTML='<div class="orbit-toggle" aria-hidden="true"><span></span></div><a class="orbit-link" href="#sync">Sync<br>OS</a><a class="orbit-link" href="#about">About<br>us</a><a class="orbit-link" href="#service">Service</a><a class="orbit-link" href="#partners">Partners</a><a class="orbit-link" href="#contact">Contact</a>';
  document.body.appendChild(orbit);
}

const desktopOrbit=document.querySelector('.desktop-orbit-nav');
if(desktopOrbit){
  const proximityStyle=document.createElement('style');
  proximityStyle.textContent='.desktop-orbit-nav.is-open .orbit-link{opacity:1;pointer-events:auto}.desktop-orbit-nav.is-open .orbit-toggle{background:rgba(9,23,18,.88);border-color:#ffffff52}.desktop-orbit-nav.is-open .orbit-toggle::before{transform:rotate(45deg)}.desktop-orbit-nav.is-open .orbit-toggle::after{transform:rotate(-45deg)}.desktop-orbit-nav.is-open .orbit-toggle span{opacity:0}.desktop-orbit-nav.is-open .orbit-link:nth-of-type(1){transform:translate(72px,-126px) scale(1)}.desktop-orbit-nav.is-open .orbit-link:nth-of-type(2){transform:translate(112px,-66px) scale(1)}.desktop-orbit-nav.is-open .orbit-link:nth-of-type(3){transform:translate(128px,0) scale(1)}.desktop-orbit-nav.is-open .orbit-link:nth-of-type(4){transform:translate(112px,66px) scale(1)}.desktop-orbit-nav.is-open .orbit-link:nth-of-type(5){transform:translate(72px,126px) scale(1)}';
  document.head.appendChild(proximityStyle);

  const finePointer=matchMedia('(min-width:901px) and (hover:hover) and (pointer:fine)');
  let closeTimer=0;
  const setOrbitOpen=open=>{
    clearTimeout(closeTimer);
    desktopOrbit.classList.toggle('is-open',open);
  };
  const scheduleClose=()=>{
    clearTimeout(closeTimer);
    closeTimer=setTimeout(()=>desktopOrbit.classList.remove('is-open'),180);
  };
  const pointerDistanceFromToggle=e=>{
    const toggle=desktopOrbit.querySelector('.orbit-toggle');
    if(!toggle)return Infinity;
    const r=toggle.getBoundingClientRect();
    const cx=r.left+r.width/2,cy=r.top+r.height/2;
    return Math.hypot(e.clientX-cx,e.clientY-cy);
  };

  desktopOrbit.querySelector('.orbit-toggle')?.addEventListener('pointerenter',()=>{if(finePointer.matches)setOrbitOpen(true)});
  desktopOrbit.querySelectorAll('.orbit-link').forEach(link=>link.addEventListener('pointerenter',()=>{if(finePointer.matches)setOrbitOpen(true)}));

  document.addEventListener('pointermove',e=>{
    if(!finePointer.matches)return;
    const distance=pointerDistanceFromToggle(e);
    const onMenuItem=Boolean(e.target.closest?.('.desktop-orbit-nav .orbit-link'));
    if(distance<=205||onMenuItem){
      if(desktopOrbit.classList.contains('is-open')||distance<=42||desktopOrbit.matches(':hover'))setOrbitOpen(true);
    }else if(desktopOrbit.classList.contains('is-open')){
      scheduleClose();
    }
  },{passive:true});

  desktopOrbit.addEventListener('focusin',()=>setOrbitOpen(true));
  desktopOrbit.addEventListener('focusout',()=>setTimeout(()=>{if(!desktopOrbit.contains(document.activeElement))desktopOrbit.classList.remove('is-open')},0));
}

if(header&&!document.getElementById('mobileMenuToggle')){
  const toggle=document.createElement('button');
  toggle.className='mobile-menu-toggle';
  toggle.id='mobileMenuToggle';
  toggle.type='button';
  toggle.setAttribute('aria-label','メニューを開く');
  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-controls','mobileMenuPanel');
  toggle.innerHTML='<span></span>';
  header.appendChild(toggle);

  const panel=document.createElement('nav');
  panel.className='mobile-menu-panel';
  panel.id='mobileMenuPanel';
  panel.setAttribute('aria-label','Mobile navigation');
  panel.innerHTML='<a href="#sync">Sync OS</a><a href="#about">About us</a><a href="#service">Service</a><a href="#partners">Partners</a><a href="#contact">Contact</a>';
  document.body.appendChild(panel);

  const setOpen=open=>{toggle.classList.toggle('is-open',open);panel.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く')};
  toggle.addEventListener('click',()=>setOpen(!panel.classList.contains('open')));
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))setOpen(false)});
}
})();