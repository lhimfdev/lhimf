import type {Metadata} from "next";
import Link from "next/link";
import FAQ from "@/components/sections/FAQ";
import {FAQ as faq} from "@/lib/content";
import Reveal from "@/components/Reveal";
export const metadata:Metadata={title:"What is an NFC Calling Card?",description:"Learn what an NFC calling card is and how it links to your digital profile."};
const I=[["A chip inside","The card holds a tiny chip that stores a link. It needs no battery and no charging."],["Tap to share","Hold the card near a compatible phone and the linked page can open, ready to save or follow."],["A profile page","With LHIMF, the link leads to your one-page website with your contact details, social media and more, depending on your package."],["Good to know","NFC support and settings vary by phone. Whether an app is needed depends on the card configuration and the receiving device."]];
export default function About(){
 return <section><div className="wrap"><div className="eyebrow">About</div><h1 style={{fontSize:"clamp(2rem,5vw,3.4rem)",marginBottom:16}}>WHAT IS AN NFC CALLING CARD?</h1>
  <p className="lead">An NFC calling card is a business card with a small NFC (Near Field Communication) chip built in. When tapped on a compatible smartphone, it can open a link, such as your digital profile, so people can get your details without typing anything.</p>
  <Reveal className="grid4">{I.map(([t,d])=><div className="ben" key={t}><h3>{t}</h3><p>{d}</p></div>)}</Reveal>
  <div style={{marginTop:64}}><div className="eyebrow">FAQ</div><h2>QUESTIONS, ANSWERED.</h2><FAQ items={faq}/></div>
  <p style={{marginTop:40}}><Link className="btn" href="/cards">See packages</Link></p></div></section>;
}
