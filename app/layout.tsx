import type {Metadata} from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Symbols from "@/components/halloween/Symbols";
import {config} from "@/lib/config";
export const metadata:Metadata={
 metadataBase:new URL(config.siteUrl),
 title:{default:"LHIMF — NFC Calling Cards & Digital Profiles",template:"%s · LHIMF"},
 description:config.description,alternates:{canonical:"/"},
 openGraph:{title:"LHIMF — NFC Calling Cards",description:config.description,type:"website",siteName:"LHIMF",images:["/images/lhimf-card-front.jpg"]},
 icons:{icon:"/icons/lhimf-logo.png"},
};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body><Symbols/><div className="ann">🦇 {config.announcement}</div><Navbar/><main>{children}</main><Footer/></body></html>;
}
