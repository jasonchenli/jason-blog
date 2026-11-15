import {headers,error,isAdmin,statsPage,dayNow,START} from '../lib/iff-analytics.js';
export default async function handler(req,res){
  headers(res);
  if(req.method!=='GET'){res.setHeader('Allow','GET');return error(res,405,'Method not allowed');}
  if(!isAdmin(req))return error(res,401,'Login required');
  const {day=dayNow(),cursor=''}=req.query;
  if(typeof day!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(day)||(!Number.isFinite(Date.parse(day+'T00:00:00Z'))||new Date(day+'T00:00:00Z').toISOString().slice(0,10)!==day)||day<START||day>dayNow()||typeof cursor!=='string'||cursor.length>4096)return error(res,400,'Invalid date or cursor');
  try{return res.status(200).json(await statsPage(day,cursor));}
  catch(e){console.error('iff_stats_failed',{name:e.name});return error(res,503,'Statistics temporarily unavailable');}
}
