import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {randomUUID} from 'node:crypto';import {list,del} from '@vercel/blob';import {unseal,sign,dayNow} from '../lib/iff-analytics.js';
const base=process.env.IFF_TEST_URL||'http://127.0.0.1:8771',origin=new URL(base).origin;
const credentials=JSON.parse(readFileSync('/Users/lichen/.iday/credentials/iff-analytics-admin.json','utf8'));
const post=(path,data,cookie,extra={})=>fetch(base+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json','User-Agent':'IFF-Verification',...(cookie?{Cookie:cookie}:{}),...extra},body:JSON.stringify(data)});
const anon=await fetch(base+'/api/iff-stats');assert.equal(anon.status,401);
const forbidden=await post('/api/iff-admin',{password:'wrong'},null,{Origin:'https://attacker.example'});assert.equal(forbidden.status,403);
const wrong=await post('/api/iff-admin',{password:'wrong'});assert.equal(wrong.status,401);
const login=await post('/api/iff-admin',{password:credentials.password});assert.equal(login.status,200);
const raw=login.headers.get('set-cookie');for(const s of ['HttpOnly','Secure','SameSite=Strict'])assert.ok(raw.includes(s));const ownerCookie=raw.split(';')[0];
const auth=await fetch(base+'/api/iff-stats?day='+dayNow(),{headers:{Cookie:ownerCookie}});assert.equal(auth.status,200);assert.equal(auth.headers.get('cache-control'),'private, no-store');
const before=await auth.json(),idsBefore=new Set(before.visitors);
const events=[{id:randomUUID(),type:'page_view'},{id:randomUUID(),type:'photo_view',photo:'DSC_0708'},{id:randomUUID(),type:'download',photo:'DSC_0708'},{id:randomUUID(),type:'share',photo:'DSC_0708'}];
let visitorPrefix;
try{
 const r=await post('/api/iff-events',{events});assert.equal(r.status,204);const vc=r.headers.get('set-cookie').split(';')[0];const value=unseal(vc.split('=')[1]);visitorPrefix=`iff/v1/events/${dayNow()}/${sign('visitor:'+value.visitor).slice(0,32)}/`;
 assert.equal((await post('/api/iff-events',{events},vc)).status,204);
 const collected=await fetch(base+'/api/iff-stats?day='+dayNow(),{headers:{Cookie:ownerCookie}});const stats=await collected.json();
 for(const [key,delta] of [['pageViews',1],['photoViews',1],['downloads',1],['shares',1]])assert.equal(stats.totals[key]-before.totals[key],delta,key);
 assert.equal(stats.visitors.filter(v=>!idsBefore.has(v)).length,1);
 assert.equal((await post('/api/iff-events',{events:[{id:randomUUID(),type:'page_view'}]},ownerCookie)).status,204);
 const final=await(await fetch(base+'/api/iff-stats?day='+dayNow(),{headers:{Cookie:ownerCookie}})).json();assert.deepEqual(final.totals,stats.totals,'owner excluded');
 console.log(JSON.stringify({base,unauthorized:401,crossOrigin:403,wrongPassword:401,login:200,cookieSecure:true,statsPrivateNoStore:true,PV:1,UV:1,views:1,downloads:1,shares:1,retryDeduplicated:true,ownerExcluded:true}));
 // Browser QA receives the real login session through stdin to a local helper, not log output.
 if(process.env.IFF_COOKIE_FILE){await import('node:fs/promises').then(fs=>fs.writeFile(process.env.IFF_COOKIE_FILE,ownerCookie,{mode:0o600}));}
}finally{if(visitorPrefix){const blobs=await list({prefix:visitorPrefix,limit:100});if(blobs.blobs.length)await del(blobs.blobs.map(b=>b.url));console.log('Synthetic analytics events removed.');}}
