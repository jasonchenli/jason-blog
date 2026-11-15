import {headers,error,originOK,body,verifyPassword,seal,cookie,rateLimit,reserveLogin} from '../lib/iff-analytics.js';
export default async function handler(req,res){
  headers(res);
  if(req.method!=='POST'){res.setHeader('Allow','POST');return error(res,405,'Method not allowed');}
  if(!originOK(req))return error(res,403,'Origin not allowed');
  try{
    const input=body(req);
    if(input.action==='logout'){res.setHeader('Set-Cookie',cookie('__Host-iff-admin','',0));return res.status(200).json({ok:true});}
    if(!process.env.IFF_ADMIN_PASSWORD_HASH||!process.env.IFF_ANALYTICS_SECRET)return error(res,503,'Admin login is not configured');
    if(!rateLimit('login:'+String(req.headers['x-forwarded-for']||''),12)||!await reserveLogin(req)){res.setHeader('Retry-After','3600');return error(res,429,'Too many attempts. Try again later.');}
    if(!verifyPassword(input.password))return error(res,401,'Incorrect password');
    const age=7*86400;res.setHeader('Set-Cookie',cookie('__Host-iff-admin',seal({role:'owner',exp:Date.now()+age*1000}),age));return res.status(200).json({ok:true});
  }catch(e){if(e instanceof SyntaxError||e.message==='Invalid body')return error(res,400,'Invalid request');console.error('iff_admin_failed',{name:e.name});return error(res,503,'Login temporarily unavailable');}
}
