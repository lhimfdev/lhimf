import type {Metadata} from "next";
import Reveal from "@/components/Reveal";
import {STEPS} from "@/lib/content";
export const metadata:Metadata={title:"How It Works"};
export default function How(){
 return <section className="alt"><div className="wrap"><div className="eyebrow">Process</div><h1 style={{fontSize:"clamp(2rem,5vw,3.4rem)"}}>FROM CARD TO CONNECTION.</h1>
  <Reveal className="steps">{STEPS.map(([t,d],i)=><div className="step" key={t}><div className="dot">{String(i+1).padStart(2,"0")}</div><h3>{t}</h3><p>{d}</p></div>)}</Reveal></div></section>;
}
