"use client";
import {useEffect,useRef,type ReactNode} from "react";
export default function Reveal({children,className=""}:{children:ReactNode;className?:string}){
 const r=useRef<HTMLDivElement>(null);
 useEffect(()=>{const el=r.current;if(!el)return;const o=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("in");o.disconnect()}},{threshold:.12});o.observe(el);return()=>o.disconnect()},[]);
 return <div ref={r} className={"rv "+className}>{children}</div>;
}
