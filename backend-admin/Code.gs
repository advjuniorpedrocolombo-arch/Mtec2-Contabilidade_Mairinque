const SHEET_ID='1nQUnqLeDb3QfI_klo_WM2mEx6Yq4K-nQyp1wjU89Ox8';
const TURMA='2º MTEC - Contabilidade - Mairinque';
const COMPONENTE='LTP';

function doGet(){
  return HtmlService.createHtmlOutputFromFile('Admin')
    .setTitle('Painel do Professor - LTP')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
}

function ss_(){return SpreadsheetApp.openById(SHEET_ID)}
function sh_(nome){const sh=ss_().getSheetByName(nome);if(!sh)throw new Error('Aba não encontrada: '+nome);return sh}
function rows_(nome){const v=sh_(nome).getDataRange().getValues();if(v.length<2)return[];const h=v.shift();return v.filter(r=>r.some(c=>c!==''&&c!==null)).map(r=>Object.fromEntries(h.map((k,i)=>[String(k),r[i]])))}
function date_(v){if(!v)return'';if(Object.prototype.toString.call(v)==='[object Date]')return Utilities.formatDate(v,Session.getScriptTimeZone(),'yyyy-MM-dd');return String(v).slice(0,10)}

function listarAtividades(){
  return rows_('ATIVIDADES').filter(x=>x.TURMA===TURMA&&x.COMPONENTE===COMPONENTE).map(a=>({
    id:a.ID_ATIVIDADE,titulo:a.TITULO,descricao:a.DESCRICAO,tipoEnvio:a.TIPO_ENVIO,
    extensoes:a.EXTENSOES,maxArquivos:a.MAX_ARQUIVOS,prazo:date_(a.PRAZO),
    materialUrl:a.MATERIAL_APOIO_URL,correcaoIA:a.CORRECAO_IA,criterios:a.GABARITO_CRITERIOS,
    status:a.STATUS,ordem:a.ORDEM
  })).sort((a,b)=>(Number(a.ordem)||999)-(Number(b.ordem)||999));
}

function salvarAtividade(d){
  if(!d||!d.id||!d.titulo)throw new Error('ID e título são obrigatórios');
  const sh=sh_('ATIVIDADES'),v=sh.getDataRange().getValues(),h=v[0],idx=h.indexOf('ID_ATIVIDADE');
  const now=new Date();
  const map={
    ID_ATIVIDADE:d.id,TURMA:TURMA,COMPONENTE:COMPONENTE,TITULO:d.titulo,DESCRICAO:d.descricao||'',
    TIPO_ENVIO:d.tipoEnvio||'SEM_ENVIO',EXTENSOES:d.extensoes||'',MAX_ARQUIVOS:Number(d.maxArquivos||0),
    PRAZO:d.prazo||'',MATERIAL_APOIO_URL:d.materialUrl||'',CORRECAO_IA:d.correcaoIA||'NAO',
    GABARITO_CRITERIOS:d.criterios||'',STATUS:d.status||'RASCUNHO',ORDEM:Number(d.ordem||999),
    CRIADO_EM:now,ATUALIZADO_EM:now
  };
  let found=0;
  for(let i=1;i<v.length;i++)if(String(v[i][idx])===String(d.id)){found=i+1;break}
  if(found){
    const old=Object.fromEntries(h.map((k,i)=>[k,v[found-1][i]]));
    map.CRIADO_EM=old.CRIADO_EM||now;
    const row=h.map(k=>map[k]!==undefined?map[k]:'');
    sh.getRange(found,1,1,row.length).setValues([row]);
  }else{
    const row=h.map(k=>map[k]!==undefined?map[k]:'');
    sh.appendRow(row);
  }
  return {ok:true,id:d.id};
}

function listarEntregas(idAtividade){
  return rows_('ENTREGAS').filter(x=>!idAtividade||String(x.ID_ATIVIDADE)===String(idAtividade)).map(e=>({
    id:e.ID_ENTREGA,idAtividade:e.ID_ATIVIDADE,aluno:e.ALUNO,email:e.EMAIL,
    arquivos:e.ARQUIVOS_URL,resposta:e.RESPOSTA_TEXTO,dataEnvio:e.DATA_ENVIO,status:e.STATUS,
    tentativa:e.TENTATIVA,observacao:e.OBSERVACAO
  }));
}

function listarCorrecoes(idAtividade){
  return rows_('CORRECOES').filter(x=>!idAtividade||String(x.ID_ATIVIDADE)===String(idAtividade));
}
