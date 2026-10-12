// Run with the Codex bundled Node runtime and @oai/artifact-tool.
import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const schema=JSON.parse(await fs.readFile('data/schemas/workspace.json','utf8'));
const tasks=JSON.parse(await fs.readFile('data/samples/roadmap.json','utf8'));
const statuses=['Backlog','To do','In progress','Blocked','Completed','Skipped'];
const yn=['Yes','No','Unknown'];
const priorities=['High','Medium','Low'];
const options={
 'LEADS & PARTNERS':{'Country':['Denmark','Sweden','Norway','Other'],'Business category':['Independent bike shop','Custom builder','Road specialist','Gravel specialist','Wheel specialist','Distributor','Other','Unknown'],'Custom bike builds (Yes/No/Unknown)':yn,'Titanium experience (Yes/No/Unknown)':yn,'Equator fit (High/Medium/Low)':priorities,'Contact status':['Not contacted','Contacted','Responded','Active conversation','Interested','Not interested','On hold','Closed'],'Response received (Yes/No/Unknown)':yn},
 'MARKET RESEARCH':{'VAT included?':yn,'Currency':['DKK','EUR','SEK','NOK','GBP','USD','Other'],'Evidence status':['Verified','Assumption','Hypothesis','Recommendation']},
 'TASKS & ROADMAP':{'Priority':priorities,'Status':statuses},
 'SALES & OPPORTUNITIES':{'VAT included?':yn,'Currency':['DKK','EUR','SEK','NOK','GBP','USD','Other'],'Sales stage':['Identified','Qualified','Quotation requested','Quotation sent','Negotiation','Won','Lost','On hold'],'Opportunity type':['Dealer order','Made-to-order frame','Referral','Custom build','Other']},
 'CONTENT & MARKETING':{'Priority':priorities,'Status':statuses}
};
const wb=Workbook.create();
const dash=wb.worksheets.add('DASHBOARD');
for(const name of Object.keys(schema)) wb.worksheets.add(name);
const dateValue=s=>Math.round((Date.parse(s+'T00:00:00Z')-Date.UTC(1899,11,30))/86400000);
const content=['English website terminology review','International brand positioning','Dealer catalog','Product photography','Dealer introduction presentation','Scandinavian landing page','Product storytelling','Brand video','Technical product specifications'].map((s,i)=>[`CONTENT-${String(i+1).padStart(3,'0')}`,'Equator Scandinavia',s,'Create only when validated demand justifies it','Potential Danish partners','','Medium','Backlog','','','','User brief; optional, demand-led asset.']);
const counts={};
for(const [name,headers] of Object.entries(schema)){
 const sh=wb.worksheets.getItem(name);
 const rows=name==='TASKS & ROADMAP'?tasks.map(r=>r.map((v,i)=>[7,13].includes(i)?dateValue(v):v)):name==='CONTENT & MARKETING'?content:[];
 counts[name]=rows.length;
 const range=sh.getRangeByIndexes(0,0,Math.max(rows.length+1,12),headers.length);
 range.format.font={name:'Arial',size:10,color:'#202124'};
 range.format.columnWidth=23;
 range.format.rowHeight=32;
 range.format.wrapText=true;
 range.format.verticalAlignment='center';
 sh.getRangeByIndexes(0,0,1,headers.length).values=[headers];
 if(rows.length) sh.getRangeByIndexes(1,0,rows.length,headers.length).values=rows;
 sh.getRangeByIndexes(0,0,1,headers.length).format={fill:'#EEEEEE',font:{bold:true,color:'#202124'},rowHeight:46,wrapText:true};
 sh.getRange('A:A').format.columnWidth=19;
 headers.forEach((h,i)=>{
  const col=sh.getRangeByIndexes(1,i,1000,1);
  if(/date|Last updated|Last verified|Date researched/i.test(h)) col.setNumberFormat('dd mmm yyyy');
  if(/notes|Description|Task$|Key findings/.test(h))sh.getRangeByIndexes(0,i,Math.max(rows.length+1,12),1).format.columnWidth=50;
  if(options[name]?.[h])col.dataValidation={rule:{type:'list',values:options[name][h]}};
  if(/value|commission$|Price$|hours/i.test(h))col.setNumberFormat('#,##0.00');
 });
 if(name==='TASKS & ROADMAP'){
  sh.getRange(`A2:N${rows.length+1}`).format.rowHeight=64;
  sh.getRange('C:C').format.columnWidth=35;
 }
 sh.getRange('A2:A1001').conditionalFormats.addCustom('AND(A2<>"",COUNTIF($A$2:$A$1001,A2)>1)',{fill:'#FCE8E6',font:{color:'#B3261E'}});
 if(name==='LEADS & PARTNERS')sh.getRange('E2:E1001').conditionalFormats.addCustom('AND(E2<>"",COUNTIFS($E$2:$E$1001,E2,$D$2:$D$1001,D2)>1)',{fill:'#FCE8E6'});
 sh.freezePanes.freezeRows(1);sh.freezePanes.freezeColumns(2);sh.showGridLines=false;
}
dash.showGridLines=false;
dash.getRange('A1:C28').format={font:{name:'Arial',size:11,color:'#202124'},rowHeight:30,verticalAlignment:'center'};
dash.getRange('A:A').format.columnWidth=39;dash.getRange('B:B').format.columnWidth=58;dash.getRange('C:C').format.columnWidth=65;
dash.getRange('A2').values=[['Equator Scandinavia']];dash.getRange('A2').format.font={size:16,bold:true};
dash.getRange('A4:C8').values=[['Current project phase','Research and preparation','Editable'],['Week commencing',dateValue('2026-10-12'),'Update weekly'],['Priority 1','Document the initial Equator meeting',''],['Priority 2','Research products and titanium competitors',''],['Priority 3','Build and qualify the Copenhagen shortlist','']];
dash.getRange('B5').setNumberFormat('dd mmm yyyy');
dash.getRange('B4:B8').format.fill='#FFF8E1';
dash.getRange('A10:C10').values=[['Project activity','Count','Definition']];dash.getRange('A10:C10').format.fill='#EEEEEE';
const metrics=[
 ['Total businesses discovered',"=COUNTA('LEADS & PARTNERS'!A2:A1001)",'Records with a stable Lead ID'],
 ['Qualified potential partners',"=COUNTIFS('LEADS & PARTNERS'!M2:M1001,\"High\",'LEADS & PARTNERS'!N2:N1001,\"<>\")+COUNTIFS('LEADS & PARTNERS'!M2:M1001,\"Medium\",'LEADS & PARTNERS'!N2:N1001,\"<>\")",'High/Medium fit with qualification notes'],
 ['Businesses contacted',"=COUNTIFS('LEADS & PARTNERS'!Q2:Q1001,\">0\")",'A recorded last-contact date'],
 ['Responses received',"=COUNTIFS('LEADS & PARTNERS'!X2:X1001,\"Yes\")",'Includes negative responses'],
 ['Active conversations',"=COUNTIFS('LEADS & PARTNERS'!P2:P1001,\"Active conversation\")",'Current contact status'],
 ['Interested partners',"=COUNTIFS('LEADS & PARTNERS'!P2:P1001,\"Interested\")",'Current contact status'],
 ['Potential sales opportunities',"=COUNTIFS('SALES & OPPORTUNITIES'!A2:A1001,\"<>\",'SALES & OPPORTUNITIES'!F2:F1001,\"<>Won\",'SALES & OPPORTUNITIES'!F2:F1001,\"<>Lost\")",'Open records, excluding Won and Lost'],
 ['Completed tasks',"=COUNTIFS('TASKS & ROADMAP'!G2:G1001,\"Completed\")",'Task status = Completed'],
 ['Deadlines in next 7 days',"=COUNTIFS('TASKS & ROADMAP'!H2:H1001,\">=\"&TODAY(),'TASKS & ROADMAP'!H2:H1001,\"<=\"&TODAY()+7,'TASKS & ROADMAP'!G2:G1001,\"<>Completed\",'TASKS & ROADMAP'!G2:G1001,\"<>Skipped\")",'Filter Tasks by due date to see the actions']
];
metrics.forEach(([label,formula,note],i)=>{dash.getRange(`A${11+i}:C${11+i}`).values=[[label,null,note]];dash.getRange(`B${11+i}`).formulas=[[formula]];});
dash.getRange('A21:C24').values=[['Next Equator meeting','Not scheduled','Enter agreed date and time'],['Planning horizon','October 2026–January 2027','Targets are exploratory, not commitments'],['Capacity','1,000 records per working tab','Extend formulas and validation before exceeding this'],['Source','User project brief, 12 October 2026','Later deadlines are provisional period-end dates']];
dash.getRange('B21').format.fill='#FFF8E1';
wb.recalculate();
console.log((await wb.inspect({kind:'table',range:'DASHBOARD!A10:C19',include:'values,formulas',tableMaxRows:10,tableMaxCols:3,maxChars:4500})).ndjson);
console.log((await wb.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#SPILL!',options:{useRegex:true,maxResults:20},maxChars:2000})).ndjson);
await fs.mkdir('outputs',{recursive:true});
for(const [i,name] of ['DASHBOARD',...Object.keys(schema)].entries()){
 const preview=await wb.render({sheetName:name,range:name==='DASHBOARD'?'A1:C24':name==='TASKS & ROADMAP'?'A1:H5':'A1:F5',scale:1,format:'png'});
 await fs.writeFile(`outputs/preview-${i}.png`,new Uint8Array(await preview.arrayBuffer()));
}
await (await SpreadsheetFile.exportXlsx(wb)).save('outputs/equator-scandinavia.xlsx');
await fs.writeFile('outputs/table-plan.json',JSON.stringify({schema,options,counts},null,2));
