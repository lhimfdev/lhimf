import type {Metadata} from "next";
import OrderForm from "@/components/forms/OrderForm";
export const metadata:Metadata={title:"Order Inquiry"};
export default async function Order({searchParams}:{searchParams:Promise<{package?:string}>}){
 const {package:pkg}=await searchParams;
 return <section><div className="wrap" style={{maxWidth:720}}><div className="eyebrow">Order</div><h1 style={{fontSize:"clamp(2rem,5vw,3.4rem)"}}>ORDER INQUIRY</h1>
  <p className="lead">Tell us about your card. No payment is collected on this form.</p><OrderForm kind="order" pkg={pkg}/></div></section>;
}
