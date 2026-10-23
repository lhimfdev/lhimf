export type Pkg={id:"basic"|"personalized"|"advertising";name:string;n:string;original:number;sale:number;sample:string;highlight?:boolean;features:string[];req:string};
const base=["High Quality NFC Calling Card","Name, Contact & Social Media","One-Page Website","Personal or Business Profile"];
export const PACKAGES:Pkg[]=[
 {id:"basic",name:"Basic",n:"01",original:549,sale:349,sample:"https://basic.lhimf.online",features:[...base,"2–4 Links"],req:"Provide 2–4 links."},
 {id:"personalized",name:"Personalized",n:"02",original:899,sale:699,sample:"https://personalized.lhimf.online",features:[...base,"2–4 Images","4–7 Links","Contact Information"],req:"Provide 2–4 images and 4–7 links."},
 {id:"advertising",name:"Advertising",n:"03",original:1299,sale:999,highlight:true,sample:"https://elvicentefilms.lhimf.online",features:[...base,"4–8 Images","Optional 30-Second Video","8–10 Links","Contact Information"],req:"Provide 4–8 images, 8–10 links, and optionally a 30-second video."},
];
export const getPackage=(id?:string)=>PACKAGES.find(p=>p.id===id);
export const peso=(n:number)=>"₱"+n.toLocaleString("en-PH");
