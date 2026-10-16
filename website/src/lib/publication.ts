export const inventoryStatuses=['In stock','Available to order','Out of stock','Availability unconfirmed','Discontinued'] as const;
export type InventoryStatus=typeof inventoryStatuses[number];
export function isVisible(product:{publication:string;inventoryStatus:string}){return product.publication==='prototype'&&product.inventoryStatus!=='Discontinued';}
export function validateMetadata(product:{id:string;slug:string;verified:string;publication:string;inventoryStatus:string}){
 if(!/^[a-z0-9-]+$/.test(product.id)||!/^[a-z0-9-]+$/.test(product.slug))throw new Error('Product IDs and slugs must be stable lowercase identifiers.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(product.verified)||new Date(product.verified).toISOString().slice(0,10)!==product.verified)throw new Error(`${product.id}: invalid verification date.`);
 if(!['prototype','review','archived'].includes(product.publication))throw new Error(`${product.id}: invalid publication status.`);
 if(!inventoryStatuses.includes(product.inventoryStatus as InventoryStatus))throw new Error(`${product.id}: invalid inventory status.`);
}
