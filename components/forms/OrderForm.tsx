"use client";
import {useState,type FormEvent} from "react";
import {orderSchema,contactSchema} from "@/lib/validation";
import {PACKAGES,getPackage,peso} from "@/lib/products";
export default function OrderForm({kind,pkg}:{kind:"order"|"contact";pkg?:string}){
 const [sel,setSel]=useState(getPackage(pkg)?.id??"basic"),[errs,setErrs]=useState<Record<string,string>>({}),[status,setStatus]=useState(""),[busy,setBusy]=useState(false);
 const p=getPackage(sel)!;
 const F=({n,l,t="text",area=false}:{n:string;l:string;t?:string;area?:boolean})=><div><label htmlFor={n}>{l}</label>
  {area?<textarea id={n} name={n} aria-invalid={!!errs[n]} aria-describedby={"e_"+n}/>:<input id={n} name={n} type={t} aria-invalid={!!errs[n]} aria-describedby={"e_"+n}/>}<div className="err" id={"e_"+n}>{errs[n]}</div></div>;
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();const f=e.currentTarget;
  const d:Record<string,unknown>={kind,...Object.fromEntries(new FormData(f))};
  d.consent=(f.elements.namedItem("consent") as HTMLInputElement|null)?.checked??true;
  const r=(kind==="order"?orderSchema:contactSchema).safeParse(d);
  if(!r.success){const m:Record<string,string>={};r.error.issues.forEach(i=>{m[String(i.path[0])]??=i.message});setErrs(m);setStatus("");return}
  setErrs({});setBusy(true);setStatus("Sending…");
  try{
   const res=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({...r.data,website:d.website})});
   if(res.ok){setStatus("Thank you — your submission was received.");f.reset()}
   else if(res.status===503)setStatus("Demo mode: no order service is configured, so nothing was sent. Set ORDER_WEBHOOK_URL to enable submissions.");
   else setStatus((await res.json().catch(()=>null))?.error||"Something went wrong. Your submission may not have been sent.");
  }catch{setStatus("Network error. Your submission may not have been sent.")}
  setBusy(false);
 }
 return <form onSubmit={submit} noValidate>
  <div className="hp"><label>Leave blank<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
  {kind==="order"?<>
   <div><label htmlFor="package">Selected package</label><select id="package" name="package" value={sel} onChange={e=>setSel(e.target.value as typeof sel)}>{PACKAGES.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></div>
   <div className="summary" aria-live="polite"><b>{p.name}</b> — <span className="old">{peso(p.original)}</span> <b>{peso(p.sale)}</b> (save {peso(p.original-p.sale)})</div>
   <div className="row2"><F n="name" l="Full name"/><F n="email" l="Email" t="email"/></div>
   <div className="row2"><F n="mobile" l="Mobile number" t="tel"/><div><label htmlFor="profileType">Profile type</label><select id="profileType" name="profileType"><option>Personal</option><option>Business</option></select></div></div>
   <F n="displayName" l="Name to display on the card"/><F n="design" l="Preferred card design" area/><F n="details" l="Contact & social media details" area/>
   <div className="summary">{p.req}</div><F n="notes" l="Additional notes (optional)" area/>
   <label className="chk"><input type="checkbox" name="consent"/> I consent to LHIMF collecting and processing the information I submit to handle this order inquiry.</label><div className="err">{errs.consent}</div>
  </>:<><F n="name" l="Full name"/><F n="email" l="Email" t="email"/><F n="message" l="Message" area/></>}
  <button className="btn" type="submit" disabled={busy}>{busy?"Sending…":kind==="order"?"Send order inquiry":"Send message"}</button>
  {status&&<div className="status show" role="status" aria-live="polite">{status}</div>}
 </form>;
}
