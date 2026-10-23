"use client";
import Image from "next/image";
import {useRef} from "react";
export default function ProductMockup({tilt=false,className=""}:{tilt?:boolean;className?:string}){
 const stage=useRef<HTMLDivElement>(null),card=useRef<HTMLDivElement>(null);
 const fine=()=>typeof window!=="undefined"&&matchMedia("(pointer:fine)").matches&&!matchMedia("(prefers-reduced-motion:reduce)").matches;
 return <div className="stage" ref={stage}
  onPointerMove={e=>{if(!tilt||!fine()||!stage.current||!card.current)return;const r=stage.current.getBoundingClientRect();card.current.style.animation="none";card.current.style.transform=`rotateY(${((e.clientX-r.left)/r.width-.5)*24}deg) rotateX(${-((e.clientY-r.top)/r.height-.5)*24}deg)`}}
  onPointerLeave={()=>{if(card.current){card.current.style.transform="";card.current.style.animation=""}}}>
  <div className={"card3d "+className} ref={card}><Image src="/images/lhimf-card-front.jpg" width={900} height={514} alt="LHIMF NFC calling card, front" priority/></div></div>;
}
