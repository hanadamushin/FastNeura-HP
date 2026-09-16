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