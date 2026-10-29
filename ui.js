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
// Use the HTML navigation on both pages as the single source of destinations.
const navigationLinks=[...(oldNav?.querySelectorAll('a')||[])];
const renderNavigation=className=>navigationLinks.map(source=>{
  const link=source.cloneNode(true);
  link.className=className;
  return link.outerHTML;
}).join('');

if(!document.querySelector('.desktop-orbit-nav')){
  const orbit=document.createElement('nav');
  orbit.className='desktop-orbit-nav';
  orbit.setAttribute('aria-label','Desktop navigation');
  orbit.innerHTML='<button class="orbit-toggle" type="button" aria-label="メニュー" aria-expanded="false"><span></span></button>'+renderNavigation('orbit-link');
  document.body.appendChild(orbit);
}

const desktopOrbit=document.querySelector('.desktop-orbit-nav');
if(desktopOrbit){
  const proximityStyle=document.createElement('style');
  proximityStyle.textContent='.desktop-orbit-nav.is-open .orbit-link{opacity:1;pointer-events:auto}.desktop-orbit-nav.is-open .orbit-toggle{background:rgba(9,23,18,.88);border-color:#ffffff52}.desktop-orbit-nav.is-open .orbit-toggle::before{transform:rotate(45deg)}.desktop-orbit-nav.is-open .orbit-toggle::after{transform:rotate(-45deg)}.desktop-orbit-nav.is-open .orbit-toggle span{opacity:0}';
  const orbitPositions=navigationLinks.length===1?[[114,0]]:[[72,-210],[130,-126],[158,-42],[158,42],[130,126],[72,210]];
  orbitPositions.forEach(([x,y],index)=>{
    const selectors=['.is-open',':hover',':focus-within'].map(state=>`.desktop-orbit-nav${state} .orbit-link:nth-of-type(${index+1})`).join(',');
    proximityStyle.textContent+=`${selectors}{transform:translate(${x}px,${y}px) scale(1)}`;
  });
  document.head.appendChild(proximityStyle);

  const finePointer=matchMedia('(min-width:901px) and (hover:hover) and (pointer:fine)');
  let closeTimer=0;
  const setOrbitOpen=open=>{
    clearTimeout(closeTimer);
    desktopOrbit.classList.toggle('is-open',open);
    desktopOrbit.querySelector('.orbit-toggle')?.setAttribute('aria-expanded',String(open));
  };
  const scheduleClose=()=>{
    clearTimeout(closeTimer);
    closeTimer=setTimeout(()=>{if(!desktopOrbit.contains(document.activeElement))setOrbitOpen(false)},180);
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
    if(distance<=245||onMenuItem){
      if(desktopOrbit.classList.contains('is-open')||distance<=52||desktopOrbit.matches(':hover'))setOrbitOpen(true);
    }else if(desktopOrbit.classList.contains('is-open')){
      scheduleClose();
    }
  },{passive:true});

  desktopOrbit.addEventListener('focusin',()=>setOrbitOpen(true));
  desktopOrbit.addEventListener('focusout',()=>setTimeout(()=>{if(!desktopOrbit.contains(document.activeElement))setOrbitOpen(false)},0));
  desktopOrbit.querySelector('.orbit-toggle')?.addEventListener('click',()=>setOrbitOpen(true));
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
  panel.innerHTML=renderNavigation('');
  panel.inert=true;
  document.body.appendChild(panel);

  const setOpen=open=>{toggle.classList.toggle('is-open',open);panel.classList.toggle('open',open);panel.inert=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く')};
  toggle.addEventListener('click',()=>setOpen(!panel.classList.contains('open')));
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))setOpen(false)});
}

const syncSection=document.getElementById('sync');
const principlesSection=document.querySelector('main > .principles');
if(syncSection&&principlesSection){
  const syncWrap=syncSection.querySelector(':scope > .wrap');
  const syncTitle=syncWrap?.querySelector('.sync-title');
  const syncCopy=syncWrap?.querySelector('.sync-copy');
  const syncHeading=syncCopy?.querySelector('h2');
  const syncDescription=syncCopy?.querySelector('p');
  const principleItems=[...principlesSection.querySelectorAll('.principle')];
  if(syncWrap&&syncTitle&&syncHeading&&syncDescription&&principleItems.length){
    const left=document.createElement('div');
    left.className='sync-left';
    const right=document.createElement('div');
    right.className='sync-principles';
    left.append(syncTitle,syncHeading,syncDescription);
    syncDescription.classList.add('sync-description');
    principleItems.forEach(item=>right.appendChild(item));
    syncWrap.replaceChildren(left,right);
    syncWrap.classList.add('sync-layout');
    principlesSection.remove();
  }
}

const pageSections=[...document.querySelectorAll('main > section')];
// Reveal each member screen on entry, including when scrolling back up.
if(document.body.dataset.page==='members'&&'IntersectionObserver' in window){
  const revealGroups=[
    ['#members','.members-eyebrow, h1, .members-lead, .members-intro'],
    ['#ceo','.member-photo, .member-role, h2, .member-name-en'],
    ['#cso','.member-photo, .member-role, h2, .member-name-en'],
    ['#members-contact','.members-eyebrow, h2, .members-contact, .site-footer']
  ];
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      // Keep the background visible after its first reveal; only replay the content.
      if(entry.intersectionRatio>=.22)entry.target.classList.add('is-revealed','has-revealed-background');
      else if(entry.intersectionRatio<=.02)entry.target.classList.remove('is-revealed');
    });
  },{threshold:[0,.02,.22]});
  revealGroups.forEach(([selector,targets])=>{
    const section=document.querySelector(selector);
    if(!section)return;
    section.querySelectorAll(targets).forEach((element,index)=>{
      element.classList.add('reveal-item');
      element.style.setProperty('--reveal-delay',`${index*85}ms`);
    });
    section.classList.add('reveal-ready');
    section.addEventListener('focusin',()=>section.classList.add('is-revealed','has-revealed-background'));
    revealObserver.observe(section);
  });
}
if(pageSections.length){
  let navigating=false;
  let unlockTimer=0;
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sectionTop=section=>Math.round(section.getBoundingClientRect().top+window.scrollY);
  const nearestSectionIndex=()=>{
    const y=window.scrollY;
    let bestIndex=0,bestDistance=Infinity;
    pageSections.forEach((section,index)=>{
      const d=Math.abs(sectionTop(section)-y);
      if(d<bestDistance){bestDistance=d;bestIndex=index}
    });
    return bestIndex;
  };
  const goToSection=index=>{
    const clamped=Math.max(0,Math.min(pageSections.length-1,index));
    navigating=true;
    clearTimeout(unlockTimer);
    window.scrollTo({top:sectionTop(pageSections[clamped]),behavior:reducedMotion?'auto':'smooth'});
    unlockTimer=setTimeout(()=>{navigating=false},reducedMotion?80:780);
  };

  window.addEventListener('wheel',e=>{
    if(innerWidth<=900||modal?.classList.contains('open'))return;
    if(Math.abs(e.deltaY)<12)return;
    e.preventDefault();
    if(navigating)return;
    const current=nearestSectionIndex();
    goToSection(current+(e.deltaY>0?1:-1));
  },{passive:false});

  document.addEventListener('keydown',e=>{
    if(innerWidth<=900||modal?.classList.contains('open'))return;
    if(['INPUT','TEXTAREA','SELECT','BUTTON'].includes(document.activeElement?.tagName))return;
    if(e.key==='ArrowDown'||e.key==='PageDown'){
      e.preventDefault();if(!navigating)goToSection(nearestSectionIndex()+1);
    }else if(e.key==='ArrowUp'||e.key==='PageUp'){
      e.preventDefault();if(!navigating)goToSection(nearestSectionIndex()-1);
    }else if(e.key==='Home'){
      e.preventDefault();if(!navigating)goToSection(0);
    }else if(e.key==='End'){
      e.preventDefault();if(!navigating)goToSection(pageSections.length-1);
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    const id=link.getAttribute('href')?.slice(1);
    if(!id)return;
    const target=document.getElementById(id);
    const index=pageSections.indexOf(target);
    if(index<0)return;
    link.addEventListener('click',e=>{
      if(innerWidth<=900)return;
      e.preventDefault();
      history.replaceState(null,'','#'+id);
      goToSection(index);
    });
  });
}
})();
