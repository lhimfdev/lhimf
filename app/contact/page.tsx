import type {Metadata} from "next";
import Link from "next/link";
import OrderForm from "@/components/forms/OrderForm";
import {config} from "@/lib/config";
export const metadata:Metadata={title:"Contact"};
export default function Contact(){
 return <section className="alt"><div className="wrap cgrid"><div className="cinfo"><div className="eyebrow">Contact</div><h1 style={{fontSize:"clamp(2rem,5vw,3.4rem)",marginBottom:16}}>LET&apos;S MAKE YOUR NEXT CONNECTION COUNT.</h1>
  <p>Email: {config.email}</p><p>Mobile: {config.mobile}</p>
  <p>{config.social.length?config.social.map(s=><a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">{s.label} </a>):<small style={{color:"var(--mid)"}}>Social links not yet configured.</small>}</p>
  <p><Link className="btn ghost" href="/order">Order inquiry</Link></p></div>
  <OrderForm kind="contact"/></div></section>;
}
