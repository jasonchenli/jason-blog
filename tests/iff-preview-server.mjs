import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import events from '../api/iff-events.js';import admin from '../api/iff-admin.js';import stats from '../api/iff-stats.js';import dashboard from '../api/iff-dashboard.js';
const routes={'/api/iff-events':events,'/api/iff-admin':admin,'/api/iff-stats':stats,'/uplands-iff-2026/stats':dashboard};
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1:8771');req.query=Object.fromEntries(url.searchParams);res.status=n=>{res.statusCode=n;return res;};res.json=v=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(v));return res;};res.send=v=>{res.end(v);return res;};
 try{
  if(routes[url.pathname]){let body='';for await(const chunk of req){body+=chunk;if(body.length>16384){res.statusCode=413;res.end();return;}}req.body=body;req.headers['x-forwarded-for']='127.0.0.1';await routes[url.pathname](req,res);return;}
  let path=decodeURIComponent(url.pathname);if(path.endsWith('/'))path+='index.html';
  const source=/^\/uplands-iff-2026\/(images|thumbs|downloads)\//.test(path)?'/Users/lichen/Projects/uplands-iff-demo/dist':'public';
  if(source!=='public')path=path.replace('/uplands-iff-2026','');const file=resolve(source,'.'+path);if(!file.startsWith(resolve(source)+'/')){res.statusCode=403;res.end();return;}
  const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.webp':'image/webp','.jpg':'image/jpeg'};res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.end(await readFile(file));
 }catch(e){console.error('preview_request_failed',{name:e.name});if(!res.headersSent)res.statusCode=500;res.end('Preview error');}
}).listen(8771,'127.0.0.1',()=>console.log('Analytics preview http://127.0.0.1:8771/uplands-iff-2026/stats'));
