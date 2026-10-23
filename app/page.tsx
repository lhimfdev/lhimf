import Link from "next/link";
import {Smartphone,Palette,ListChecks,Users} from "lucide-react";
import Reveal from "@/components/Reveal";
import ProductMockup from "@/components/products/ProductMockup";
import {Web,Bat,Pump} from "@/components/halloween/Deco";
const B=[[Smartphone,"Tap to Connect","Share your digital profile through a compatible NFC-enabled device."],[Palette,"Your Identity, Your Design","Personalize your card to reflect your personal brand or business."],[ListChecks,"Everything in One Place","Organize supported contact information, social profiles, and other useful links."],[Users,"Built for Real Connections","Make networking, introductions, and customer engagement simpler."]] as const;
export default function Home(){
 return <>
 <section className="hero grain"><div className="moon" aria-hidden="true"/><div className="dust" aria-hidden="true"/>
  <Web/><Web r/><Bat/><Bat c="b2"/><Bat c="b3"/><Pump left="6%"/><Pump left="14%" w={36}/>
  <div className="wrap hero-grid"><div>
   <div className="eyebrow">LHIMF · Physical NFC calling cards + digital profile websites</div>
   <h1><span>ONE TAP.</span><span>INFINITE CONNECTIONS.</span></h1>
   <p className="lead">Make every introduction unforgettable. Discover premium NFC cards that connect your physical identity to your digital world.</p>
   <div className="cta-row"><Link className="btn" href="/cards">Explore NFC Cards</Link><Link className="btn ghost" href="/about">What is an NFC Card?</Link></div>
   <p className="note">Each LHIMF card is a physical NFC calling card linked to your own one-page profile website. NFC compatibility may depend on the receiving device.</p>
  </div><ProductMockup tilt/></div></section>
 <section><div className="wrap"><div className="eyebrow">Why LHIMF</div><h2>YOUR DIGITAL IDENTITY. ONE TAP AWAY.</h2>
  <Reveal className="grid4">{B.map(([I,t,d])=><div className="ben" key={t}><I size={34} strokeWidth={1.4} aria-hidden="true"/><h3>{t}</h3><p>{d}</p></div>)}</Reveal>
  <p className="small">NFC compatibility may vary by device and configuration.</p></div></section>
 <section className="final grain"><div className="dust" aria-hidden="true"/><Web/><Web r/><Bat c="b3"/><Pump left="8%"/><Pump right="8%"/>
  <div className="wrap" style={{position:"relative",zIndex:2}}><ProductMockup className="" />
   <h2>YOUR NEXT INTRODUCTION STARTS HERE.</h2><p className="lead" style={{margin:"0 auto 32px"}}>Choose your LHIMF card and bring your digital identity closer to the people you meet.</p>
   <Link className="btn" href="/cards">GET YOUR NFC CARD</Link></div></section></>;
}
