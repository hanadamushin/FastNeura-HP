(()=>{'use strict';
const c=document.getElementById('waves'),ctx=c.getContext('2d',{alpha:false});
const hero=document.querySelector('.hero');let w=0,h=0,dpr=1,t=0,last=0,visible=true;const TAU=Math.PI*2,G=1;
function resize(){dpr=Math.min(devicePixelRatio||1,2);w=hero.clientWidth;h=hero.clientHeight;c.width=Math.round(w*dpr);c.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}
addEventListener('resize',resize,{passive:true});resize();
const wave=(x,time,i)=>{const u=x/Math.max(w,1),phase=time*.33;return Math.sin(u*TAU*1.22-phase+i*.67)*(.034*h)+Math.sin(u*TAU*2.42-phase*.69+i*1.71)*(.014*h)+Math.sin(u*TAU*.49+phase*.36+i*2.4)*(.027*h)};
function ribbon(i,time){
const lp=[{min:.16,max:.34,period:34,phase:.20},{min:1.10,max:1.58,period:47,phase:2.10},{min:.42,max:.80,period:39,phase:4.35},{min:.82,max:1.30,period:56,phase:1.15},{min:.22,max:.52,period:43,phase:5.40}][i];
const breathe=.5+.5*Math.sin((time/lp.period)*TAU+lp.phase),eased=breathe*breathe*(3-2*breathe),waveGain=lp.min+(lp.max-lp.min)*eased,blue=i<2;
const x0=-w*.22,x1=w*1.22,step=Math.max(6,w/175),yBase=h*(.40+(i-2)*.026),amplitude=h*(.052+(i%3)*.019),thickness=h*(.050+(i%4)*.019),phase=i*1.09,points=[];
for(let x=x0;x<=x1+step;x+=step){const u=x/w,center=yBase+wave(x,time,i)*.83+Math.sin(u*TAU*.83-time*.17+phase)*amplitude*.42,width=thickness*(.60+.40*Math.sin(u*TAU*.79-time*.23+phase+1.4)**2);points.push([x,center-width*.5,center+width*.5])}
function contour(mix){ctx.beginPath();for(let j=0;j<points.length;j++){const p=points[j],y=p[1]*(1-mix)+p[2]*mix;j?ctx.lineTo(p[0],y):ctx.moveTo(p[0],y)}}
function color(alpha){alpha*=waveGain;const g=ctx.createLinearGradient(0,0,w,0);if(blue){g.addColorStop(0,`rgba(39,157,215,${alpha*.88*G})`);g.addColorStop(.38,`rgba(95,222,241,${alpha*G})`);g.addColorStop(.67,`rgba(104,239,215,${alpha*.98*G})`);g.addColorStop(1,`rgba(89,218,133,${alpha*.88*G})`)}else{g.addColorStop(0,`rgba(43,167,175,${alpha*.82*G})`);g.addColorStop(.40,`rgba(80,219,190,${alpha*.92*G})`);g.addColorStop(.70,`rgba(123,239,145,${alpha*G})`);g.addColorStop(1,`rgba(92,216,124,${alpha*.86*G})`)}return g}
const layers=22;
for(let side=0;side<2;side++)for(let k=0;k<layers;k++){const f=k/(layers-1),inward=.5*Math.pow(f,1.06),mix=side===0?inward:1-inward,alpha=.108*Math.pow(1-f,1.72);ctx.save();contour(mix);ctx.strokeStyle=color(alpha);ctx.lineWidth=Math.max(2.2,h*.0031);ctx.stroke();ctx.restore()}
ctx.save();ctx.globalAlpha=.52;for(const mix of [.34,.42,.50,.58,.66]){contour(mix);ctx.strokeStyle=color(.012);ctx.lineWidth=Math.max(3,h*.0046);ctx.stroke()}ctx.restore();
for(let side=0;side<2;side++){const edge=side===0?0:1;ctx.save();contour(edge);ctx.filter=`blur(${Math.max(1.8,h*.00225)}px)`;ctx.strokeStyle=color(.095);ctx.lineWidth=Math.max(3.4,h*.0042);ctx.stroke();ctx.restore()}
for(let side=0;side<2;side++){const edge=side===0?0:1;ctx.save();contour(edge);ctx.filter=`blur(${Math.max(.7,h*.0009)}px)`;ctx.strokeStyle=color(.205);ctx.lineWidth=Math.max(1.7,h*.0022);ctx.stroke();ctx.restore()}
}
function draw(){ctx.fillStyle='#030909';ctx.fillRect(0,0,w,h);const ambient=ctx.createRadialGradient(w*.5,h*.40,0,w*.5,h*.40,w*.75);ambient.addColorStop(0,'rgba(5,31,29,.54)');ambient.addColorStop(.55,'rgba(3,14,15,.34)');ambient.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=ambient;ctx.fillRect(0,0,w,h);ctx.save();ctx.globalCompositeOperation='screen';for(let i=0;i<5;i++)ribbon(i,t);const cy=h*.40,beam=ctx.createLinearGradient(0,cy-h*.057,0,cy+h*.057);beam.addColorStop(0,'rgba(37,170,204,0)');beam.addColorStop(.48,'rgba(50,181,190,.027)');beam.addColorStop(.5,'rgba(139,239,229,.080)');beam.addColorStop(.52,'rgba(55,191,171,.027)');beam.addColorStop(1,'rgba(38,181,155,0)');ctx.save();ctx.filter=`blur(${Math.max(3.3,h*.0045)}px)`;ctx.fillStyle=beam;ctx.fillRect(0,cy-h*.057,w,h*.114);ctx.restore();ctx.restore()}
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function frame(now){if(!last)last=now;const dt=Math.min((now-last)/1000,.05);last=now;if(!reduced&&visible)t+=dt;draw();requestAnimationFrame(frame)}requestAnimationFrame(frame);
document.addEventListener('visibilitychange',()=>{visible=!document.hidden;last=0});
})();