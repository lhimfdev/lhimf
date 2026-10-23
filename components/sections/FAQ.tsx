"use client";
import {useState} from "react";
export default function FAQ({items}:{items:[string,string][]}){
 const [o,setO]=useState<number|null>(null);
 return <div className="faq">{items.map(([q,a],i)=><div key={q}><h3><button id={"fb"+i} aria-expanded={o===i} aria-controls={"fp"+i} onClick={()=>setO(o===i?null:i)}>{q}</button></h3>
  <div className={"pn"+(o===i?" open":"")} id={"fp"+i} role="region" aria-labelledby={"fb"+i}><div><p>{a}</p></div></div></div>)}</div>;
}
