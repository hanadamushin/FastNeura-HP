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
})();