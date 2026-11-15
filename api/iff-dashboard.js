import {readFileSync} from 'node:fs';
import {headers,isAdmin} from '../lib/iff-analytics.js';
const page=readFileSync(new URL('../lib/iff-dashboard.html',import.meta.url),'utf8');
export default function handler(req,res){
 headers(res);
 if(req.method!=='GET'){res.setHeader('Allow','GET');return res.status(405).end();}
 res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('X-Frame-Options','DENY');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('Content-Security-Policy',"default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
 return res.status(200).send(page.replace('data-authorized="false"',`data-authorized="${isAdmin(req)}"`));
}
