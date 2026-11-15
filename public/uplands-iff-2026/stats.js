'use strict';
const $=id=>document.getElementById(id);
let allPhotos=[],summary=null,page=0,loading=false;
const number=n=>Number(n).toLocaleString('zh-CN');
const today=()=>new Date(Date.now()+8*3600000).toISOString().slice(0,10);
function showDashboard(){ $('login').hidden=true;$('dashboard').hidden=false; }
function showLogin(){ $('dashboard').hidden=true;$('login').hidden=false;summary=null; }
$('login-form').addEventListener('submit',async e=>{
 e.preventDefault();$('login-button').disabled=true;$('login-error').textContent='';
 try{const r=await fetch('/api/iff-admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:$('password').value})});if(!r.ok)throw Error(r.status===401?'密码不正确。':r.status===429?'尝试次数过多，请稍后再试。':'登录暂时不可用，请稍后再试。');$('password').value='';showDashboard();await load();}catch(e){$('login-error').textContent=e.message;}finally{$('login-button').disabled=false;}
});
$('logout').onclick=async()=>{try{const r=await fetch('/api/iff-admin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'logout'})});if(!r.ok)throw Error();location.reload();}catch{$('status').textContent='退出失败，请重试。';}};
function rows(){
 const key=$('sort').value,search=$('search').value.trim().toUpperCase();
 const data=allPhotos.filter(p=>p.id.includes(search)).map(p=>({...p,...summary.photos.get(p.id)}));
 data.sort((a,b)=>key==='id'?a.id.localeCompare(b.id):b[key]-a[key]||a.id.localeCompare(b.id));
 const pages=Math.max(1,Math.ceil(data.length/25));page=Math.min(page,pages-1);
 $('photo-rows').replaceChildren();
 for(const p of data.slice(page*25,(page+1)*25)){
  const tr=document.createElement('tr'),td=document.createElement('td'),a=document.createElement('a');a.textContent=p.id;a.href='/uplands-iff-2026/#photo='+p.id;a.target='_blank';a.rel='noopener';td.append(a);tr.append(td);
  for(const key of ['views','downloads','shares']){const c=document.createElement('td');c.textContent=number(p[key]);tr.append(c);}$('photo-rows').append(tr);
 }
 if(!data.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=4;td.textContent='没有匹配的照片。';tr.append(td);$('photo-rows').append(tr);}
 $('page-label').textContent=`${page+1} / ${pages} · ${data.length} 张`;$('prev-page').disabled=page===0;$('next-page').disabled=page>=pages-1;
}
function render(){
 $('pv').textContent=number(summary.pageViews);$('uv').textContent=number(summary.visitors.size);$('views').textContent=number(summary.photoViews);$('downloads').textContent=number(summary.downloads);
 $('trend').replaceChildren();const max=Math.max(1,...summary.days.map(d=>d.pv));
 for(const d of summary.days){const row=document.createElement('div');row.className='day';const label=document.createElement('span');label.textContent=d.day;const track=document.createElement('div');track.className='track';const bar=document.createElement('div');bar.className='bar';bar.style.width=(d.pv/max*100)+'%';track.append(bar);const total=document.createElement('strong');total.textContent=number(d.pv);row.append(label,track,total);$('trend').append(row);}rows();
}
async function load(){
 if(loading)return;
 const from=$('from').value,to=$('to').value;
 if(!from||!to||from>to||to>today()||from<'2026-11-15'||(Date.parse(to)-Date.parse(from))/86400000>30){$('status').textContent='请选择启用日期之后、最多 31 天的有效日期范围。';return;}
 loading=true;$('refresh').disabled=true;$('export').disabled=true;$('status').textContent='正在读取私有统计…';
 const next={pageViews:0,photoViews:0,downloads:0,shares:0,visitors:new Set(),photos:new Map(),days:[]};
 try{
  if(!allPhotos.length){const r=await fetch('/uplands-iff-2026/photos.json?v=20261115-7');if(!r.ok)throw Error('无法加载照片清单');allPhotos=(await r.json()).photos.map(p=>({id:p.id,views:0,downloads:0,shares:0}));}
  for(let day=from;day<=to;day=new Date(Date.parse(day)+86400000).toISOString().slice(0,10)){
   let cursor=null,dailyPV=0;
   do{const url='/api/iff-stats?day='+day+(cursor?'&cursor='+encodeURIComponent(cursor):'');const r=await fetch(url,{cache:'no-store'});if(r.status===401){showLogin();throw Error('登录已过期，请重新登录。');}if(!r.ok)throw Error('读取统计失败，请稍后重试。');const d=await r.json();for(const k of ['pageViews','photoViews','downloads','shares'])next[k]+=d.totals[k];dailyPV+=d.totals.pageViews;d.visitors.forEach(v=>next.visitors.add(v));for(const p of d.photos){const old=next.photos.get(p.id)||{views:0,downloads:0,shares:0};next.photos.set(p.id,{id:p.id,views:old.views+p.views,downloads:old.downloads+p.downloads,shares:old.shares+p.shares});}cursor=d.nextCursor;}while(cursor);
   next.days.push({day,pv:dailyPV});$('status').textContent='正在读取 '+day+'…';
  }
  summary=next;page=0;render();$('export').disabled=false;$('status').textContent=`已更新 · ${new Date().toLocaleString('zh-CN',{timeZone:'Asia/Kuala_Lumpur'})}（马来西亚时间）`;
 }catch(e){$('status').textContent=e.message;}finally{loading=false;$('refresh').disabled=false;}
}
$('refresh').onclick=load;$('sort').onchange=()=>{page=0;if(summary)rows();};$('search').oninput=()=>{page=0;if(summary)rows();};$('prev-page').onclick=()=>{page--;rows();};$('next-page').onclick=()=>{page++;rows();};
$('export').onclick=()=>{if(!summary)return;const data=allPhotos.map(p=>({...p,...summary.photos.get(p.id)}));const csv='\ufeffPhoto ID,Views,Download actions,Share actions\r\n'+data.map(p=>[p.id,p.views,p.downloads,p.shares].join(',')).join('\r\n');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=`iff-photo-stats-${$('from').value}-${$('to').value}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('from').value=today();$('to').value=today();$('from').max=today();$('to').max=today();
if(document.body.dataset.authorized==='true'){showDashboard();load();}
