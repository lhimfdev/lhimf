import type {Metadata} from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/products/ProductCard";
import {PACKAGES} from "@/lib/products";
import {STEPS} from "@/lib/content";
export const metadata:Metadata={title:"NFC Cards",description:"Compare LHIMF Basic, Personalized and Advertising NFC calling card packages."};
export default function Cards(){
 return <>
 <section className="alt"><div className="wrap"><div className="eyebrow">Packages</div><h1 style={{fontSize:"clamp(2rem,5vw,3.4rem)",marginBottom:16}}>CHOOSE YOUR CONNECTION.</h1><p className="lead">One card. A better way to introduce yourself.</p>
  <Reveal className="grid3">{PACKAGES.map(p=><ProductCard key={p.id} p={p}/>)}</Reveal></div></section>
 <section><div className="wrap"><div className="eyebrow">Process</div><h2>FROM CARD TO CONNECTION.</h2>
  <Reveal className="steps">{STEPS.map(([t,d],i)=><div className="step" key={t}><div className="dot">{String(i+1).padStart(2,"0")}</div><h3>{t}</h3><p>{d}</p></div>)}</Reveal></div></section>
 <section className="alt grain"><div className="wrap"><div className="eyebrow">Customization</div><h2>MAKE IT YOURS.</h2>
  <p className="lead">Create a card design aligned with your personal identity or business brand. Tell us your design preferences, name and business details, contact information, social media links, and profile content suited to your package.</p>
  <p style={{marginTop:28}}><Link className="btn" href="/order">START YOUR CUSTOM DESIGN</Link></p></div></section></>;
}
