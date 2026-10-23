export const Web=({r}:{r?:boolean})=><svg className={"deco web"+(r?" r":"")} aria-hidden="true"><use href="#web"/></svg>;
export const Bat=({c=""}:{c?:string})=><svg className={"deco bat "+c} viewBox="0 0 100 50" aria-hidden="true"><use href="#bat"/></svg>;
export const Pump=({left,right,w}:{left?:string;right?:string;w?:number})=><svg className="deco pump" style={{left,right,width:w}} viewBox="0 0 100 90" aria-hidden="true"><use href="#pump"/></svg>;
