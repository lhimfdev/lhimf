import {z} from "zod";
const t=(m:string,max=1000)=>z.string().trim().min(1,m).max(max);
export const orderSchema=z.object({
 kind:z.literal("order"),
 package:z.enum(["basic","personalized","advertising"]),
 name:t("Enter your full name.",120),
 email:z.string().trim().email("Enter a valid email.").max(200),
 mobile:z.string().trim().regex(/^[+\d][\d\s\-()]{6,24}$/,"Enter a valid mobile number."),
 profileType:z.enum(["Personal","Business"]),
 displayName:t("Enter the name for the card.",120),
 design:t("Describe your preferred design.",2000),
 details:t("Enter your contact and social details.",3000),
 notes:z.string().trim().max(2000).optional(),
 consent:z.literal(true,{errorMap:()=>({message:"Consent is required to submit."})}),
});
export const contactSchema=z.object({kind:z.literal("contact"),name:t("Enter your name.",120),email:z.string().trim().email("Enter a valid email.").max(200),message:t("Enter a message.",3000)});
