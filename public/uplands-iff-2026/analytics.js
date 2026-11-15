'use strict';
(() => {
  if(navigator.doNotTrack==='1'||navigator.globalPrivacyControl||typeof crypto?.randomUUID!=='function')return;
  let pending=[],sending=false,retryTimer,started=false;
  const uuid=()=>crypto.randomUUID();
  async function flush(){
    if(sending||!pending.length)return;
    sending=true;const batch=pending.splice(0,20);
    try{
      const response=await fetch('/api/iff-events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({events:batch}),credentials:'same-origin',keepalive:true});
      if(!response.ok){if(response.status===429||response.status>=500)pending.unshift(...batch);}
    }catch{pending.unshift(...batch);}
    finally{pending=pending.slice(0,300);sending=false;if(pending.length){clearTimeout(retryTimer);retryTimer=setTimeout(flush,15000);}}
  }
  window.iffTrack=(type,photo)=>{
    if(!['page_view','photo_view','download','share'].includes(type))return;
    pending.push({id:uuid(),type,...(photo?{photo}:{})});
    clearTimeout(retryTimer);retryTimer=setTimeout(flush,1000);
  };
  function start(){if(!started&&document.visibilityState==='visible'){started=true;window.iffTrack('page_view');}}
  document.addEventListener('visibilitychange',()=>{start();if(document.visibilityState==='hidden')flush();});
  addEventListener('pagehide',flush);start();
})();
