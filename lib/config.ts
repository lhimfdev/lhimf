export const config={
 brand:"LHIMF",
 siteUrl:process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000",
 announcement:"HALLOWEEN SPECIAL — YOUR CONNECTION, REIMAGINED.",
 email:process.env.NEXT_PUBLIC_CONTACT_EMAIL||"your-email@example.com",
 mobile:process.env.NEXT_PUBLIC_CONTACT_MOBILE||"+63 000 000 0000",
 social:[] as {label:string;url:string}[], // e.g. {label:"Facebook",url:"https://..."}
 description:"LHIMF sells High Quality NFC Calling Cards linked to your own one-page digital profile website.",
};
export const nav=[["Home","/"],["NFC Cards","/cards"],["About","/about"],["Contact","/contact"]] as const;
