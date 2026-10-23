import type {Metadata} from "next";
import FAQ from "@/components/sections/FAQ";
import {FAQ as items} from "@/lib/content";
export const metadata:Metadata={title:"FAQ"};
export default function Page(){
 return <section><div className="wrap"><div className="eyebrow">FAQ</div><h1 style={{fontSize:"clamp(2rem,5vw,3.4rem)"}}>QUESTIONS, ANSWERED.</h1><FAQ items={items}/></div></section>;
}
