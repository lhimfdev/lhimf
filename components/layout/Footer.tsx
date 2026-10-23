import Link from "next/link";
import Image from "next/image";
import {config,nav} from "@/lib/config";
import {PACKAGES,peso} from "@/lib/products";
export default function Footer(){
 return <footer><div className="wrap"><div className="fg">
  <div><Link className="logo" href="/"><Image src="/icons/lhimf-logo.png" width={34} height={34} alt=""/><span>LHIMF</span></Link><p style={{color:"var(--mid)",fontSize:".9rem",marginTop:14}}>{config.description}</p></div>
  <div><h4>Navigate</h4><ul>{nav.map(([l,h])=><li key={h}><Link href={h}>{l}</Link></li>)}</ul></div>
  <div><h4>Packages</h4><ul>{PACKAGES.map(p=><li key={p.id}><Link href={`/order?package=${p.id}`}>{p.name} — {peso(p.sale)}</Link></li>)}</ul></div>
  <div><h4>Contact</h4><ul><li>{config.email}</li><li>{config.mobile}</li>{config.social.map(s=><li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a></li>)}</ul></div>
 </div><div className="copy">© {new Date().getFullYear()} {config.brand}. All rights reserved. · <Link href="/privacy">Privacy Policy</Link> · <Link href="/terms">Terms &amp; Conditions</Link></div></div></footer>;
}
