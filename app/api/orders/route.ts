import {NextResponse} from "next/server";
import {orderSchema,contactSchema} from "@/lib/validation";
import {getPackage} from "@/lib/products";
const hits=new Map<string,number[]>(); // in-memory limiter; use Redis/Upstash for multi-instance production
export async function POST(req:Request){
 const ip=req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"anon",now=Date.now();
 const recent=(hits.get(ip)||[]).filter(t=>now-t<600000);
 if(recent.length>=5)return NextResponse.json({error:"Too many requests. Try again later."},{status:429});
 hits.set(ip,[...recent,now]);
 let body:Record<string,unknown>;
 try{body=await req.json()}catch{return NextResponse.json({error:"Invalid request."},{status:400})}
 if(body.website)return NextResponse.json({ok:true}); // honeypot
 const r=(body.kind==="contact"?contactSchema:orderSchema).safeParse(body);
 if(!r.success)return NextResponse.json({error:"Invalid input.",issues:r.error.flatten().fieldErrors},{status:422});
 const url=process.env.ORDER_WEBHOOK_URL;
 if(!url)return NextResponse.json({error:"Order service not configured."},{status:503});
 const data:Record<string,unknown>={...r.data,receivedAt:new Date().toISOString()};
 if(r.data.kind==="order"){const p=getPackage(r.data.package)!;data.price=p.sale;data.originalPrice=p.original;data.currency="PHP"}
 try{
  const res=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json",...(process.env.ORDER_WEBHOOK_SECRET?{Authorization:"Bearer "+process.env.ORDER_WEBHOOK_SECRET}:{})},body:JSON.stringify(data)});
  if(!res.ok)throw new Error("upstream");
  return NextResponse.json({ok:true});
 }catch{return NextResponse.json({error:"Could not deliver your submission."},{status:502})}
}
