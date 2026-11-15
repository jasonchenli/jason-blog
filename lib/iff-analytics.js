import { createHmac, randomUUID, timingSafeEqual, scryptSync } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { put, list } from '@vercel/blob';
const photos = JSON.parse(readFileSync(new URL('../public/uplands-iff-2026/photos.json', import.meta.url)));
export const photoIds = new Set(photos.photos.map(p => p.id));
export const TYPES = new Set(['page_view','photo_view','download','share']);
export const START = '2026-11-15';
export const dayNow = () => new Date(Date.now()+8*3600000).toISOString().slice(0,10);
export function sign(text) {
  if (!process.env.IFF_ANALYTICS_SECRET) throw Error('Analytics not configured');
  return createHmac('sha256',process.env.IFF_ANALYTICS_SECRET).update(text).digest('hex');
}
export function equal(a,b) { const x=Buffer.from(String(a)),y=Buffer.from(String(b));return x.length===y.length&&timingSafeEqual(x,y); }
export function seal(value) { const p=Buffer.from(JSON.stringify(value)).toString('base64url');return p+'.'+sign(p); }
export function unseal(token) {
  try { const [p,s,...extra]=String(token).split('.');if(extra.length||!s||!equal(s,sign(p)))return null;const value=JSON.parse(Buffer.from(p,'base64url'));return value.exp>Date.now()?value:null; } catch { return null; }
}
export function cookies(req) { return Object.fromEntries((req.headers.cookie||'').split(';').map(x=>x.trim().split('=' )).filter(x=>x.length===2)); }
export function isAdmin(req) { return unseal(cookies(req)['__Host-iff-admin'])?.role==='owner'; }
export function cookie(name,value,age) { return `${name}=${value}; Path=/; Max-Age=${age}; HttpOnly; Secure; SameSite=Strict`; }
export function headers(res) { res.setHeader('Cache-Control','private, no-store');res.setHeader('Vercel-CDN-Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('X-Robots-Tag','noindex, nofollow'); }
export function error(res,status,message) { return res.status(status).json({error:message}); }
export function originOK(req) { return ['https://www.jasonchen.ai','https://jasonchen.ai'].includes(req.headers.origin) || (process.env.VERCEL_ENV!=='production'&&/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(req.headers.origin||'')); }
export function body(req) { const text=typeof req.body==='string'?req.body:JSON.stringify(req.body);if(!text||Buffer.byteLength(text)>16384)throw Error('Invalid body');const value=typeof req.body==='string'?JSON.parse(req.body):req.body;if(!value||typeof value!=='object'||Array.isArray(value))throw Error('Invalid body');return value; }
export function verifyPassword(password) {
  const value=process.env.IFF_ADMIN_PASSWORD_HASH||'';const [salt,expected]=value.split(':');
  if(!salt||!expected||typeof password!=='string'||password.length>200)return false;
  return equal(scryptSync(password,salt,32).toString('hex'),expected);
}
const windows=new Map();
export function rateLimit(key,limit,now=Date.now()) {
  const minute=Math.floor(now/60000);if(windows.size>2000)for(const [k,v]of windows)if(v.minute!==minute)windows.delete(k);
  const previous=windows.get(key);const value=previous?.minute===minute?previous:{minute,count:0};value.count++;windows.set(key,value);return value.count<=limit;
}
export function visitor(req,res) {
  let value=unseal(cookies(req)['__Host-iff-visitor']);
  if(!value?.visitor){value={visitor:randomUUID(),exp:Date.now()+365*86400000};res.setHeader('Set-Cookie',cookie('__Host-iff-visitor',seal(value),365*86400));}
  return sign('visitor:'+value.visitor).slice(0,32);
}
export function validateEvents(events) {
  if(!Array.isArray(events)||!events.length||events.length>20)throw Error('Expected 1–20 events');
  return events.map(e=>{if(!e||!TYPES.has(e.type)||!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(e.id)|| (e.type==='page_view'?e.photo!=null:!photoIds.has(e.photo)))throw Error('Invalid event');return {id:e.id,type:e.type,photo:e.photo||'page'};});
}
export const existsError = e => /already exists/i.test(e?.message||'');
export async function writeEvents(events,visitorId,store={put}) {
  const day=dayNow();
  await Promise.all(events.map(async e=>{
    const name=`iff/v1/events/${day}/${visitorId}/${e.id}.${e.type}.${e.photo}.json`;
    try {await store.put(name,'{}',{access:'private',addRandomSuffix:false,allowOverwrite:false,contentType:'application/json',ttlDays:365});}
    catch(e){if(!existsError(e))throw e;}
  }));
}
// A persistent hourly failure budget survives function restarts; paths contain only HMACs.
export async function reserveLogin(req,store={put}) {
  const ip=String(req.headers['x-forwarded-for']||'unknown').split(',')[0].trim();
  const key=sign('login:'+ip).slice(0,32),hour=Math.floor(Date.now()/3600000);
  for(let slot=0;slot<12;slot++){
    try{await store.put(`iff/v1/login/${hour}/${key}/${slot}.json`,'{}',{access:'private',addRandomSuffix:false,allowOverwrite:false,ttlDays:1});return true;}
    catch(e){if(!existsError(e))throw e;}
  }
  return false;
}
export async function statsPage(day,cursor,store={list}) {
  const prefix=`iff/v1/events/${day}/`;
  const page=await store.list({prefix,limit:1000,...(cursor?{cursor}:{})});
  const visitors=new Set(),byPhoto=new Map();const totals={pageViews:0,photoViews:0,downloads:0,shares:0};
  for(const b of page.blobs){
    const match=b.pathname.slice(prefix.length).match(/^([a-f0-9]{32})\/([-a-f0-9]{36})\.(page_view|photo_view|download|share)\.(page|DSC_\d{4})\.json$/);
    if(!match)continue;
    const [,v,,type,id]=match;
    if(type==='page_view'){totals.pageViews++;visitors.add(v);continue;}
    if(!photoIds.has(id))continue;
    visitors.add(v);const p=byPhoto.get(id)||{id,views:0,downloads:0,shares:0};
    if(type==='photo_view'){totals.photoViews++;p.views++;}
    if(type==='download'){totals.downloads++;p.downloads++;}
    if(type==='share'){totals.shares++;p.shares++;}
    byPhoto.set(id,p);
  }
  return {day,totals,visitors:[...visitors],photos:[...byPhoto.values()],nextCursor:page.hasMore?page.cursor:null,startedOn:START,timezone:'Asia/Kuala_Lumpur'};
}
