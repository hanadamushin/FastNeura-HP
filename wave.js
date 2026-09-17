(()=>{'use strict';
const c=document.getElementById('waves');
if(!c)return;
document.body.prepend(c);
const ctx=c.getContext('2d',{alpha:false});
let w=0,h=0,dpr=1,t=0,last=0,visible=true;const TAU=Math.PI*2,G=1;
const themes={
  home:{a:[[39,157,215],[95,222,241],[104,239,215],[89,218,133]],b:[[43,167,175],[80,219,190],[123,239,145],[92,216,124]],ambient:[5,31,29],beam:[139,239,229]},
  blue:{a:[[28,112,255],[64,167,255],[78,216,255],[91,235,255]],b:[[32,101,226],[58,145,255],[78,194,255],[98,223,255]],ambient:[4,22,48],beam:[110,195,255]},
  white:{a:[[190,208,216],[226,236,240],[255,255,255],[207,226,234]],b:[[180,198,208],[219,232,238],[248,252,255],[196,216,226]],ambient:[26,30,32],beam:[245,250,255]},
  yellow:{a:[[255,170,26],[255,205,61],[255,235,118],[255,194,54]],b:[[232,147,18],[255,190,36],[255,222,83],[245,173,34]],ambient:[43,27,4],beam:[255,224,112]},
  red:{a:[[239,55,72],[255,91,83],[255,133,103],[228,49,78]],b:[[206,39,58],[244,68,73],[255,107,87],[219,46,68]],ambient:[46,7,10],beam:[255,122,120]},
  purple:{a:[[124,74,255],[169,92,255],[213,123,255],[141,74,235]],b:[[100,59,224],[147,74,242],[191,102,250],[126,63,219]],ambient:[25,9,43],beam:[205,132,255]}
};
const cloneTheme=x=>({a:x.a.map(v=>v.slice()),b:x.b.map(v=>v.slice()),ambient:x.ambient.slice(),beam:x.beam.slice()});
let current=cloneTheme(themes.home),target=themes.home;
function resize(){dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener('resize',resize,{passive:true});resize();
const mix=(a,b,k)=>a+(b-a)*k;
function approachTheme(dt){const k=1-Math.exp(-dt*5.5);['a','b'].forEach(key=>{for(let i=0;i<4;i++)for(let j=0;j<3;j++)current[key][i][j]=mix(current[key][i][j],target[key][i][j],k)});for(let j=0;j<3;j++){current.ambient[j]=mix(current.ambient[j],target.ambient[j],k);current.beam[j]=mix(current.beam[j],target.beam[j],k)}}
function setThemeFromScroll(){const sections=[...document.querySelectorAll('main > section')];if(!sections.length){target=themes.home;return}const center=scrollY+innerHeight*.5;let active=sections[0],best=Infinity;for(const s of sections){const r=s.getBoundingClientRect(),mid=scrollY+r.top+r.height*.5,d=Math.abs(mid-center);if(d<best){best=d;active=s}}if(active.id==='top')target=themes.home;else if(active.id==='sync'||active.classList.contains('principles'))target=themes.blue;else if(active.id==='about')target=themes.white;else if(active.id==='service')target=themes.yellow;else if(active.id==='partners')target=themes.red;else if(active.id==='contact')target=themes.purple;else target=themes.home}
addEventListener('scroll',setThemeFromScroll,{passive:true});setThemeFromScroll();
const wave=(x,time,i)=>{const u=x/Math.max(w,1),phase=time*.33;return Math.sin(u*TAU*1.22-phase+i*.67)*(.034*h)+Math.sin(u*TAU*2.42-phase*.69+i*1.71)*(.014*h)+Math.sin(u*TAU*.49+phase*.36+i*2.4)*(.027*h)};
function ribbon(i,time){
const lp=[{min:.16,max:.34,period:34,phase:.20},{min:1.10,max:1.58,period:47,phase:2.10},{min:.42,max:.80,period:39,phase:4.35},{min:.82,max:1.30,period:56,phase:1.15},{min:.22,max:.52,period:43,phase:5.40}][i];
const breathe=.5+.5*Math.sin((time/lp.period)*TAU+lp.phase),eased=breathe*breathe*(3-2*breathe),waveGain=lp.min+(lp.max-lp.min)*eased,blue=i<2;
const x0=-w*.22,x1=w*1.22,step=Math.max(6,w/175),yBase=h*(.45+(i-2)*.026),amplitude=h*(.052+(i%3)*.019),thickness=h*(.050+(i%4)*.019),phase=i*1.09,points=[];
for(let x=x0;x<=x1+step;x+=step){const u=x/w,center=yBase+wave(x,time,i)*.83+Math.sin(u*TAU*.83-time*.17+phase)*amplitude*.42,width=thickness*(.60+.40*Math.sin(u*TAU*.79-time*.23+phase+1.4)**2);points.push([x,center-width*.5,center+width*.5])}
function contour(mixv){ctx.beginPath();for(let j=0;j<points.length;j++){const p=points[j],y=p[1]*(1-mixv)+p[2]*mixv;j?ctx.lineTo(p[0],y):ctx.moveTo(p[0],y)}}
function rgba(rgb,alpha){return `rgba(${rgb.map(Math.round).join(',')},${alpha})`}
function color(alpha){alpha*=waveGain;const p=blue?current.a:current.b,g=ctx.createLinearGradient(0,0,w,0);if(blue){g.addColorStop(0,rgba(p[0],alpha*.88*G));g.addColorStop(.38,rgba(p[1],alpha*G));g.addColorStop(.67,rgba(p[2],alpha*.98*G));g.addColorStop(1,rgba(p[3],alpha*.88*G))}else{g.addColorStop(0,rgba(p[0],alpha*.82*G));g.addColorStop(.40,rgba(p[1],alpha*.92*G));g.addColorStop(.70,rgba(p[2],alpha*G));g.addColorStop(1,rgba(p[3],alpha*.86*G))}return g}
const layers=22;
for(let side=0;side<2;side++)for(let k=0;k<layers;k++){const f=k/(layers-1),inward=.5*Math.pow(f,1.06),mixv=side===0?inward:1-inward,alpha=.108*Math.pow(1-f,1.72);ctx.save();contour(mixv);ctx.strokeStyle=color(alpha);ctx.lineWidth=Math.max(2.2,h*.0031);ctx.stroke();ctx.restore()}
ctx.save();ctx.globalAlpha=.52;for(const mixv of [.34,.42,.50,.58,.66]){contour(mixv);ctx.strokeStyle=color(.012);ctx.lineWidth=Math.max(3,h*.0046);ctx.stroke()}ctx.restore();
for(let side=0;side<2;side++){const edge=side===0?0:1;ctx.save();contour(edge);ctx.filter=`blur(${Math.max(1.8,h*.00225)}px)`;ctx.strokeStyle=color(.095);ctx.lineWidth=Math.max(3.4,h*.0042);ctx.stroke();ctx.restore()}
for(let side=0;side<2;side++){const edge=side===0?0:1;ctx.save();contour(edge);ctx.filter=`blur(${Math.max(.7,h*.0009)}px)`;ctx.strokeStyle=color(.205);ctx.lineWidth=Math.max(1.7,h*.0022);ctx.stroke();ctx.restore()}
}
function draw(){ctx.fillStyle='#030909';ctx.fillRect(0,0,w,h);const a=current.ambient.map(Math.round),ambient=ctx.createRadialGradient(w*.5,h*.45,0,w*.5,h*.45,w*.75);ambient.addColorStop(0,`rgba(${a.join(',')},.54)`);ambient.addColorStop(.55,`rgba(${a.join(',')},.34)`);ambient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=ambient;ctx.fillRect(0,0,w,h);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<5;i++)ribbon(i,t);const cy=h*.45,b=current.beam.map(Math.round),beam=ctx.createLinearGradient(0,cy-h*.057,0,cy+h*.057);beam.addColorStop(0,`rgba(${b.join(',')},0)`);beam.addColorStop(.48,`rgba(${b.join(',')},.027)`);beam.addColorStop(.5,`rgba(${b.join(',')},.080)`);beam.addColorStop(.52,`rgba(${b.join(',')},.027)`);beam.addColorStop(1,`rgba(${b.join(',')},0)`);ctx.save();ctx.filter=`blur(${Math.max(3.3,h*.0045)}px)`;ctx.fillStyle=beam;ctx.fillRect(0,cy-h*.057,w,h*.114);ctx.restore();ctx.restore()}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function frame(now){if(!last)last=now;const dt=Math.min((now-last)/1000,.05);last=now;if(!reduced&&visible)t+=dt;approachTheme(dt);draw();requestAnimationFrame(frame)}requestAnimationFrame(frame);
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;last=0});
})();