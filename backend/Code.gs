const SHEET_ID='COLE_AQUI_O_ID_DA_PLANILHA';
const ABA_ATIVIDADES='ATIVIDADES';
const ABA_MATERIAIS='MATERIAIS';

function doGet(e){
  const action=(e.parameter.action||'listar').trim();
  try{
    if(action==='listar') return json_(listar_(e.parameter.turma,e.parameter.componente));
    if(action==='atividade') return json_({atividade:atividade_(e.parameter.id)});
    return json_({ok:false,erro:'Ação inválida'});
  }catch(err){return json_({ok:false,erro:String(err.message||err)})}
}

function doPost(e){
  try{
    const d=JSON.parse(e.postData.contents||'{}');
    if(d.action==='salvarAtividade') return json_(salvarAtividade_(d));
    return json_({ok:false,erro:'Ação inválida'});
  }catch(err){return json_({ok:false,erro:String(err.message||err)})}
}

function ss_(){return SpreadsheetApp.openById(SHEET_ID)}
function sh_(nome){const s=ss_();let sh=s.getSheetByName(nome);if(!sh) sh=s.insertSheet(nome);return sh}
function json_(obj){return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)}

function setup(){
  const a=sh_(ABA_ATIVIDADES);
  if(a.getLastRow()===0)a.appendRow(['ID','TURMA','COMPONENTE','TITULO','DESCRICAO','ORIENTACOES','TIPO_ENVIO','MAX_ARQUIVOS','PRAZO','MATERIAL_URL','CORRECAO_IA','STATUS','CRIADO_EM','ATUALIZADO_EM']);
  const m=sh_(ABA_MATERIAIS);
  if(m.getLastRow()===0)m.appendRow(['ID','TURMA','COMPONENTE','TITULO','DESCRICAO','URL','STATUS','CRIADO_EM']);
}

function listar_(turma,componente){
  setup();
  const atividades=rows_(ABA_ATIVIDADES).filter(x=>(!turma||x.TURMA===turma)&&(!componente||x.COMPONENTE===componente)).map(a=>({id:a.ID,titulo:a.TITULO,descricao:a.DESCRICAO,orientacoes:a.ORIENTACOES,tipoEnvio:a.TIPO_ENVIO,maxArquivos:a.MAX_ARQUIVOS,prazo:date_(a.PRAZO),materialUrl:a.MATERIAL_URL,correcaoIA:a.CORRECAO_IA,status:a.STATUS}));
  const materiais=rows_(ABA_MATERIAIS).filter(x=>(!turma||x.TURMA===turma)&&(!componente||x.COMPONENTE===componente)).map(m=>({id:m.ID,titulo:m.TITULO,descricao:m.DESCRICAO,url:m.URL,status:m.STATUS}));
  return {ok:true,atividades,materiais};
}

function atividade_(id){
  if(!id)return null;
  const a=rows_(ABA_ATIVIDADES).find(x=>String(x.ID)===String(id));
  if(!a)return null;
  return {id:a.ID,titulo:a.TITULO,descricao:a.DESCRICAO,orientacoes:a.ORIENTACOES,tipoEnvio:a.TIPO_ENVIO,maxArquivos:a.MAX_ARQUIVOS,prazo:date_(a.PRAZO),materialUrl:a.MATERIAL_URL,correcaoIA:a.CORRECAO_IA,status:a.STATUS};
}

function salvarAtividade_(d){
  setup();
  if(!d.id||!d.titulo)throw new Error('ID e título são obrigatórios');
  const sh=sh_(ABA_ATIVIDADES),values=sh.getDataRange().getValues(),headers=values[0],idx=headers.indexOf('ID');
  const now=new Date();
  const row=[d.id,d.turma||'',d.componente||'',d.titulo,d.descricao||'',d.orientacoes||'',d.tipoEnvio||'SEM_ENVIO',Number(d.maxArquivos||0),d.prazo||'',d.materialUrl||'',d.correcaoIA||'NAO',d.status||'RASCUNHO',now,now];
  let found=0;
  for(let i=1;i<values.length;i++){if(String(values[i][idx])===String(d.id)){found=i+1;break}}
  if(found){row[12]=values[found-1][12]||now;sh.getRange(found,1,1,row.length).setValues([row])}else sh.appendRow(row);
  return {ok:true,id:d.id};
}

function rows_(nome){
  const sh=sh_(nome),v=sh.getDataRange().getValues();if(v.length<2)return[];const h=v.shift();return v.filter(r=>r.some(c=>c!==''&&c!==null)).map(r=>Object.fromEntries(h.map((k,i)=>[String(k),r[i]])));
}
function date_(v){if(!v)return'';if(Object.prototype.toString.call(v)==='[object Date]')return Utilities.formatDate(v,Session.getScriptTimeZone(),'yyyy-MM-dd');return String(v).slice(0,10)}
