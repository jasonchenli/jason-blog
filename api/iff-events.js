import {headers,error,originOK,body,isAdmin,visitor,validateEvents,writeEvents,rateLimit,sign} from '../lib/iff-analytics.js';
export default async function handler(req,res) {
  headers(res);
  if(req.method!=='POST'){res.setHeader('Allow','POST');return error(res,405,'Method not allowed');}
  if(!originOK(req))return error(res,403,'Origin not allowed');
  if(isAdmin(req))return res.status(204).end();
  if(/bot|crawler|spider|headless|preview|lighthouse/i.test(req.headers['user-agent']||''))return res.status(204).end();
  try{
    const events=validateEvents(body(req).events);
    const ip=String(req.headers['x-forwarded-for']||'').split(',')[0];
    if(!rateLimit(sign('events:'+ip),240)){res.setHeader('Retry-After','60');return error(res,429,'Too many requests');}
    await writeEvents(events,visitor(req,res));return res.status(204).end();
  }catch(e){if(e instanceof SyntaxError||/Invalid|Expected/.test(e.message))return error(res,400,'Invalid events');console.error('iff_events_storage_failed',{name:e.name});return error(res,503,'Statistics temporarily unavailable');}
}
