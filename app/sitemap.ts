import type {MetadataRoute} from "next";
import {config} from "@/lib/config";
export default function sitemap():MetadataRoute.Sitemap{return ["","/cards","/about","/contact","/order","/privacy","/terms"].map(p=>({url:config.siteUrl+p,lastModified:new Date()}))}
