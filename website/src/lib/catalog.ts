import {bikes} from '../data/bikes/catalog.ts';
import {wheels} from '../data/wheels/catalog.ts';
export type Selection={productId:string;buildId:string;size:string};
export type Line=Selection & {quantity:number};
export const displayCurrency='EUR';
export function money(amount:number|null){return amount===null?'Price on request':new Intl.NumberFormat('en-IE',{style:'currency',currency:displayCurrency,maximumFractionDigits:0}).format(amount/100);}
export function resolve(selection:Selection){
 const bike=bikes.find(p=>p.id===selection.productId&&p.publication==='prototype');
 if(bike){
  const build=bike.builds.find(b=>b.id===selection.buildId);
  if(!build||!bike.sizes.includes(selection.size))throw new Error('This build or size is no longer listed. Please configure it again.');
  return {name:bike.name,image:bike.image,price:build.price,description:[build.label,`Size ${selection.size}`,build.groupset,build.wheels,build.components].filter(Boolean).join(' · '),availability:bike.availability};
 }
 const wheel=wheels.find(w=>w.id===selection.productId&&w.publication==='prototype');
 if(wheel&&selection.buildId==='inquiry'&&selection.size==='')return {name:wheel.name,image:wheel.image,price:wheel.price,description:'Wheelset inquiry · freehub and specification to confirm',availability:wheel.availability};
 throw new Error('This product is not in the current prototype catalog.');
}
export function identity(s:Selection){return JSON.stringify([s.productId,s.buildId,s.size]);}
export function validateLine(value:unknown):Line{
 if(!value||typeof value!=='object')throw new Error('Invalid cart item.');
 const v=value as Record<string,unknown>;
 if(typeof v.productId!=='string'||typeof v.buildId!=='string'||typeof v.size!=='string'||!Number.isInteger(v.quantity)||(v.quantity as number)<1||(v.quantity as number)>10)throw new Error('Cart quantity must be between 1 and 10.');
 const line={productId:v.productId,buildId:v.buildId,size:v.size,quantity:v.quantity as number};resolve(line);return line;
}
export function decodeCart(raw:string|null):Line[]{
 if(!raw)return [];
 const data=JSON.parse(raw);
 if(data.version!==1||!Array.isArray(data.items)||data.items.length>30)throw new Error('Saved cart cannot be read. Reset it to continue.');
 const lines:Line[]=data.items.map(validateLine);
 if(new Set(lines.map(identity)).size!==lines.length)throw new Error('Saved cart contains duplicate configurations. Reset it to continue.');
 return lines;
}
export function addLine(lines:Line[],selection:Selection):Line[]{
 resolve(selection);
 const result=lines.map(validateLine);const old=result.find(l=>identity(l)===identity(selection));
 if(old){if(old.quantity===10)throw new Error('Maximum quantity is 10 per configuration.');old.quantity++;}
 else{if(result.length>=30)throw new Error('Maximum of 30 configurations.');result.push({...selection,quantity:1});}
 return result;
}
export function totals(lines:Line[]){let subtotal=0;let unknown=false;for(const line of lines){validateLine(line);const price=resolve(line).price;if(price===null)unknown=true;else subtotal+=price*line.quantity;}return {subtotal,unknown};}
