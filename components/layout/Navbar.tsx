"use client";
import Link from "next/link";
import Image from "next/image";
import {usePathname} from "next/navigation";
import {useEffect,useState} from "react";
import {nav} from "@/lib/config";
export default function Navbar(){
 const path=usePathname(),[open,setOpen]=useState(false),[sc,setSc]=useState(false);
 useEffect(()=>{const f=()=>setSc(scrollY>30);f();addEventListener("scroll",f,{passive:true});return()=>removeEventListener("scroll",f)},[]);
 useEffect(()=>setOpen(false),[path]);
 useEffect(()=>{const k=(e:KeyboardEvent)=>e.key==="Escape"&&setOpen(false);addEventListener("keydown",k);return()=>removeEventListener("keydown",k)},[]);
 return <header className={"nav"+(sc?" scrolled":"")}><div className="wrap">
  <Link className="logo" href="/" aria-label="LHIMF home"><Image src="/icons/lhimf-logo.png" width={34} height={34} alt=""/><span>LHIMF</span></Link>
  <button className="burger" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} aria-controls="links" onClick={()=>setOpen(!open)}>{open?"✕":"☰"}</button>
  <nav className={"links"+(open?" open":"")} id="links" aria-label="Main">
   {nav.map(([l,h])=><Link key={h} href={h} className={path===h?"active":""} aria-current={path===h?"page":undefined}>{l}</Link>)}
   <Link className="btn" href="/order">Get Your Card</Link>
  </nav></div></header>;
}
