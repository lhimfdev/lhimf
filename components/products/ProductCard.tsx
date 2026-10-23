import Link from "next/link";
import {Web} from "@/components/halloween/Deco";
import {peso,type Pkg} from "@/lib/products";
export default function ProductCard({p}:{p:Pkg}){
 return <article className={"pc"+(p.highlight?" hl":"")}>
  {p.highlight&&<div className="tag">Popular</div>}<Web/>
  <div className="num">PACKAGE {p.n}</div><h3>{p.name}</h3>
  <div className="old"><span className="sr">Original price </span>{peso(p.original)}</div>
  <div className="price">{peso(p.sale)}</div><div className="save">YOU SAVE {peso(p.original-p.sale)}</div>
  <ul>{p.features.map(f=><li key={f}>{f}</li>)}</ul>
  <Link className={"btn"+(p.highlight?"":" ghost")} href={`/order?package=${p.id}`}>Choose {p.name}</Link>
  <a className="sample" href={p.sample} target="_blank" rel="noopener noreferrer">View Live Sample ↗<span className="sr"> (opens in new tab)</span></a>
 </article>;
}
