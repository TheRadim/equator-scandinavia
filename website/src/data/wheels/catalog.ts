import {isVisible} from '../../lib/publication.ts';
// Prototype reference only. Production publication requires a fresh variant/current-range check.
export const allWheels=[{id:'wavy-35',slug:'wavy-35c',name:'Wavy 35C',category:'Road',image:'images/wavy-35-0.jpg',description:'Carbon wheels with a distinctive wave profile.',price:null,referenceFrom:141100,verified:'2026-10-16',publication:'prototype',inventoryStatus:'Availability unconfirmed',availability:'Manufacturer listed in stock on 16 October 2026; freehub availability requires confirmation',source:'https://www.equator-cycling.com/en/set-karbonovych-kol-equator-wavy-35c-disk/',specs:{'Rim depth':'35 mm','Rim width':'21 mm internal / 28 mm external','Listed set weight':'1,380 g','Brake type':'Disc','Freehub':'Confirm with representative before ordering'}}];
export const wheelHolds=[{name:'Gravel Ultimate 40C',category:'Gravel',reason:'Custom-order status; confirm current range, availability and tyre compatibility.'},{name:'TT 88C',category:'TT',reason:'Future stock date; not confirmed available.'}];

export const wheels=allWheels.filter(isVisible);
