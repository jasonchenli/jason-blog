import assert from 'node:assert/strict';
import {randomUUID,randomBytes} from 'node:crypto';
import {put,list,del} from '@vercel/blob';
import {writeEvents,dayNow} from '../lib/iff-analytics.js';
const visitor=randomBytes(16).toString('hex'),prefix=`iff/v1/events/${dayNow()}/${visitor}/`;
const events=[{id:randomUUID(),type:'page_view',photo:'page'},{id:randomUUID(),type:'photo_view',photo:'DSC_0645'},{id:randomUUID(),type:'download',photo:'DSC_0645'}];
try{
 await writeEvents(events,visitor);
 await writeEvents(events,visitor);
 const page=await list({prefix,limit:100});
 assert.equal(page.blobs.length,3,'idempotent immutable writes');
 const r=await fetch(page.blobs[0].url);assert.ok(r.status===403||r.status===401||r.status===404,'unauthenticated private storage');
 console.log(JSON.stringify({durableWrites:true,retryDeduplicated:true,eventCount:3,anonymousBlobStatus:r.status}));
}finally{
 const page=await list({prefix,limit:100});if(page.blobs.length)await del(page.blobs.map(b=>b.url));
 console.log('Synthetic storage events removed.');
}
