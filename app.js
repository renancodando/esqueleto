'use strict';

// Add the official business number here, with country and area codes.
const CONFIG = { whatsapp: '', location: 'Piúma – ES' };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const services = [{"id": "tela", "title": "Troca de Tela", "description": "Avaliação do display e touch, substituição e testes de imagem e sensibilidade."}, {"id": "bateria", "title": "Troca de Bateria", "description": "Análise de autonomia e substituição da bateria conforme a necessidade do aparelho."}, {"id": "limpeza", "title": "Limpeza Técnica", "description": "Remoção de resíduos, avaliação de oxidação e limpeza técnica, conforme a necessidade do aparelho."}, {"id": "camera", "title": "Câmera", "description": "Diagnóstico de foco, imagem e funcionamento das câmeras frontal e traseira."}, {"id": "conector", "title": "Conector", "description": "Inspeção do conector, circuito de carga e acessórios utilizados no carregamento."}, {"id": "sistema", "title": "Sistema", "description": "Avaliação de travamentos, desempenho e falhas de software, preservando os cuidados com seus dados."}, {"id": "outros", "title": "Outros Reparos", "description": "Botões, áudio, sensores e reparos de placa. Conte para a equipe o que aconteceu."}];
const steps = [
  ['Diagnóstico','Entendemos os sinais do seu aparelho e identificamos os componentes que precisam de atenção.','Avaliação completa e sem custo.','M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0m-2 5 7 7'],
  ['Orçamento','Você recebe as informações sobre o serviço, as peças e o prazo antes de decidir.','Transparente e sem surpresa.','M3 3h18v14H9l-6 4ZM7 8h10M7 12h7'],
  ['Reparo','Com sua aprovação, o aparelho segue para os procedimentos técnicos necessários.','Técnicos especializados e peças de qualidade.','m9 2-1 4-4 1-2 4 3 3-1 4 4 3 4-2 4 2 4-3-1-4 3-3-2-4-4-1-1-4ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0'],
  ['Entrega','Conferimos as funções do aparelho e orientamos sobre o serviço e os cuidados após o reparo.','Seu celular pronto, testado e garantido.','m12 1 10 6v11l-10 5-10-5V7Zm0 0v11m0 11V12M2 7l10 5 10-5']
];
const pages = [
  ['garantia.html','Garantia','Segurança condições do serviço suporte'],['index.html','Início','Tecnologia que revive seu celular'],['servicos.html','Serviços','Tela bateria câmera conector sistema reparos'],
  ['diferenciais.html','Diferenciais','Precisão tecnologia segurança confiança'],['processo.html','Processo de reparo','Diagnóstico orçamento reparo entrega'],
  ['sobre.html','Sobre a CellFix','Assistência técnica em Piúma'],['avaliacoes.html','Avaliações','Experiências e opiniões'],
  ['faq.html','Dúvidas frequentes','Prazos dados pagamento peças'],['contato.html','Contato','Atendimento orçamento localização WhatsApp']
];
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
let toastTimer;
function toast(message) {
  const box = $('#toast'); box.textContent=message; box.hidden=false;
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>box.hidden=true,6000);
}

// Shared navigation, dialogs and keyboard focus.
const nav=$('#nav'), menu=$('.menu-button');
function closeMenu(){ nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Abrir menu'); }
menu.addEventListener('click',()=>{
  const open=menu.getAttribute('aria-expanded')!=='true';
  nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
window.matchMedia('(min-width: 961px)').addEventListener('change',closeMenu);
let dialogTrigger;
function openDialog(dialog,trigger){
  dialogTrigger=trigger||document.activeElement;closeMenu();document.body.classList.add('modal-open');dialog.showModal();
}
$$('dialog').forEach(dialog=>{
  $('.close-modal',dialog).addEventListener('click',()=>dialog.close());
  let startedOutside=false;
  const outside=e=>{const r=dialog.getBoundingClientRect();return e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom};
  dialog.addEventListener('pointerdown',e=>{startedOutside=outside(e)});
  dialog.addEventListener('click',e=>{if(startedOutside&&outside(e))dialog.close();startedOutside=false});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');dialogTrigger?.focus({preventScroll:true})});
});
$('[data-notifications]')?.addEventListener('click',()=>toast('Atendimento: 08h às 19h. Consulte os dias de funcionamento e o atendimento em feriados com a equipe.'));

// Actual local pages, search results and service deep links.
function renderSearch(){
  const query=normalize($('#global-search').value);
  const results=$('#search-results');results.replaceChildren();
  const items=[...pages,...services.map(s=>['servicos.html?servico='+s.id,s.title,s.description])];
  const matches=items.filter(item=>!query||normalize(item[1]+' '+item[2]).includes(query)).slice(0,9);
  if(!matches.length){const p=document.createElement('p');p.textContent='Nenhum resultado. Tente “bateria”, “prazo” ou “contato”.';results.append(p);return;}
  matches.forEach(item=>{const a=document.createElement('a');a.href=item[0];const title=document.createElement('span');title.textContent=item[1];const arrow=document.createElement('span');arrow.textContent='↗';a.append(arrow,title);results.append(a)});
}
$('[data-search-open]').addEventListener('click',e=>{renderSearch();openDialog($('#search-dialog'),e.currentTarget);$('#global-search').focus()});
$('#global-search').addEventListener('input',renderSearch);
function showService(id,trigger){
  const service=services.find(s=>s.id===id);if(!service)return;
  $('#service-title').textContent=service.title;$('#service-description').textContent=service.description;
  const source=trigger?.querySelector('.service-symbol svg')||trigger?.closest('article')?.querySelector('.large-holo svg')||trigger?.querySelector('svg')||$('.service-tile svg');
  $('#service-icon').replaceChildren();if(source)$('#service-icon').append(source.cloneNode(true));
  $('#service-contact').href='contato.html?servico='+encodeURIComponent(id);
  openDialog($('#service-dialog'),trigger);
}
$$('[data-service]').forEach(button=>button.addEventListener('click',()=>showService(button.dataset.service,button)));
const queryService=new URLSearchParams(location.search).get('servico');
if(queryService&&document.body.dataset.page==='servicos'){
  const trigger=$(`[data-service="${services.find(s=>s.id===queryService)?.id||'tela'}"]`);
  if(services.some(s=>s.id===queryService))showService(queryService,trigger);
}
const serviceTrack=$('.service-track');
if(serviceTrack){
  const cards=$$('.service-tile',serviceTrack),dots=$$('[data-service-slide]');
  const section=$('.services-orbit');let active=0,userPauseUntil=0,autoPaused=false,inView=true,drag=null,dragged=false;
  function highlight(index){
    active=(index+cards.length)%cards.length;
    cards.forEach((card,i)=>card.classList.toggle('is-current',i===active));
    dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===active)));
  }
  function slide(index,manual=false){
    highlight(index);if(manual)userPauseUntil=performance.now()+9000;
    const offset=cards[active].offsetLeft-cards[0].offsetLeft;
    serviceTrack.scrollTo({left:offset,behavior:reducedMotion.matches?'auto':'smooth'});
  }
  $$('[data-carousel]').forEach(button=>button.addEventListener('click',()=>slide(active+Number(button.dataset.carousel),true)));
  dots.forEach(button=>button.addEventListener('click',()=>slide(Number(button.dataset.serviceSlide),true)));
  $('.carousel-pause').addEventListener('click',e=>{
    autoPaused=!autoPaused;e.currentTarget.setAttribute('aria-pressed',String(autoPaused));
    e.currentTarget.setAttribute('aria-label',autoPaused?'Retomar rolagem automática':'Pausar rolagem automática');
    e.currentTarget.textContent=autoPaused?'▷':'Ⅱ';
  });
  serviceTrack.addEventListener('keydown',e=>{
    if(e.target!==serviceTrack)return;
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();slide(active+(e.key==='ArrowRight'?1:-1),true)}
  });
  serviceTrack.addEventListener('pointerdown',e=>{
    userPauseUntil=performance.now()+9000;dragged=false;
    if(e.pointerType==='mouse'&&e.button===0)drag={x:e.clientX,left:serviceTrack.scrollLeft,id:e.pointerId};
  });
  serviceTrack.addEventListener('pointermove',e=>{
    if(!drag)return;
    const delta=e.clientX-drag.x;
    if(Math.abs(delta)>7){dragged=true;serviceTrack.classList.add('is-dragging');serviceTrack.setPointerCapture(e.pointerId);serviceTrack.scrollLeft=drag.left-delta;e.preventDefault()}
  });
  const finishDrag=()=>{drag=null;serviceTrack.classList.remove('is-dragging')};
  serviceTrack.addEventListener('pointerup',finishDrag);serviceTrack.addEventListener('pointercancel',finishDrag);
  serviceTrack.addEventListener('lostpointercapture',finishDrag);
  addEventListener('pointerup',finishDrag);
  serviceTrack.addEventListener('click',e=>{if(dragged){e.preventDefault();e.stopImmediatePropagation();dragged=false}},true);
  let scrollTimer;
  serviceTrack.addEventListener('scroll',()=>{
    if(!dragged&&performance.now()>=userPauseUntil)return;
    clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{
      if(drag)return;const width=cards[0].getBoundingClientRect().width+parseFloat(getComputedStyle(serviceTrack).gap);
      if(dragged||'ontouchstart' in window)highlight(Math.min(cards.length-1,Math.round(serviceTrack.scrollLeft/width)));
    },160);
  },{passive:true});
  new IntersectionObserver(entries=>{inView=entries[0].isIntersecting},{threshold:.1}).observe(section);
  setInterval(()=>{
    if(!inView||autoPaused||document.hidden||reducedMotion.matches||document.documentElement.classList.contains('motion-paused')||performance.now()<userPauseUntil||section.matches(':hover')||section.contains(document.activeElement))return;
    slide(active+1);
  },3300);
  highlight(0);
}
$('.telemetry-toggle')?.addEventListener('click',e=>{
  const expanded=e.currentTarget.getAttribute('aria-expanded')!=='true';
  e.currentTarget.setAttribute('aria-expanded',String(expanded));$('.lab-telemetry').classList.toggle('expanded',expanded);
  e.currentTarget.firstChild.textContent=expanded?'Ocultar análise de componentes ':'Ver análise de componentes ';
});

function bindFilter(type,inputSelector,itemsSelector,emptySelector){
  let category='all';const input=$(inputSelector);if(!input)return;
  const items=$$(itemsSelector);
  function apply(){
    const query=normalize(input.value);let visible=0;
    items.forEach(item=>{const show=(category==='all'||item.dataset.category===category)&&normalize(item.dataset.search).includes(query);item.hidden=!show;if(show)visible++});
    $(emptySelector).hidden=visible>0;
  }
  $$(`[data-filter-group="${type}"] button`).forEach(button=>button.addEventListener('click',()=>{
    category=button.dataset.filter;$$(`[data-filter-group="${type}"] button`).forEach(b=>b.classList.toggle('active',b===button));apply();
  }));input.addEventListener('input',apply);
}
bindFilter('services','#service-search','.detail-service-grid article','#services-empty');
bindFilter('faq','#faq-search','.faq-list details','#faq-empty');

// Repair stages are a presentation, never an actual customer repair tracker.
let currentStep=0;
function setStep(index,focus=false){
  currentStep=Number.isFinite(index)?Math.max(0,Math.min(3,Math.trunc(index))):0;const step=steps[currentStep];
  $$('[data-step]').forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===currentStep));tab.tabIndex=i===currentStep?0:-1});
  $('#process-detail').setAttribute('aria-labelledby','step-tab-'+currentStep);
  $('#step-title').textContent=step[0];$('#step-description').textContent=step[1];$('#step-subtitle').textContent=step[2];
  $('#step-number').textContent=`ETAPA 0${currentStep+1} / 04`;
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','icon');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
  const path=document.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d',step[3]);svg.append(path);$('#step-icon').replaceChildren(svg);
  $('#previous-step').disabled=currentStep===0;$('#next-step').textContent=currentStep===3?'Solicitar atendimento ↗':'Próxima etapa →';
  $('#process-detail').classList.remove('animated-in');requestAnimationFrame(()=>$('#process-detail').classList.add('animated-in'));
  if(focus)$(`[data-step="${currentStep}"]`).focus();
}
if($('#process-detail')){
  setStep(Math.max(0,Number(new URLSearchParams(location.search).get('etapa')||1)-1));
  $$('[data-step]').forEach(tab=>{
    tab.addEventListener('click',()=>setStep(Number(tab.dataset.step)));
    tab.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();setStep(e.key==='Home'?0:e.key==='End'?3:(currentStep+(e.key==='ArrowRight'?1:3))%4,true)}});
  });
  $('#previous-step').addEventListener('click',()=>setStep(currentStep-1));
  $('#next-step').addEventListener('click',()=>{if(currentStep===3)location.href='contato.html';else setStep(currentStep+1)});
}
let diagnosticRunning=false;
$$('[data-run-diagnostic]').forEach(button=>button.addEventListener('click',()=>{
  if(diagnosticRunning)return;diagnosticRunning=true;
  const panel=$('.repair-panel'),ring=$('.progress-ring'),value=$('[data-progress]');
  panel.classList.add('running');toast('Demonstração visual da análise. Este painel não acompanha um reparo real.');
  const start=performance.now(),duration=reducedMotion.matches?0:4200;
  function update(now){
    const p=duration?Math.min(1,(now-start)/duration):1;const progress=Math.round(12+88*p);
    ring.style.setProperty('--progress',progress);value.textContent=progress+'%';
    $$('.component-check').forEach((check,i)=>{check.style.opacity=p>i/5?'1':'.15'});
    if(p<1)requestAnimationFrame(update);else{panel.classList.remove('running');diagnosticRunning=false;toast('Demonstração concluída. Para avaliar seu celular, solicite um diagnóstico.');}
  }requestAnimationFrame(update);
}));
const reviewSlides=[
  '“Atendimento rápido, serviço impecável e meu celular voltou como novo!”',
  'Cada aparelho tem uma história. Conte a sua e receba uma orientação para o seu caso.',
  'Conheça os indicadores da referência e compartilhe sua experiência na página de avaliações.'
];
let reviewIndex=0;
function changeReview(index){
  reviewIndex=(index+reviewSlides.length)%reviewSlides.length;
  $('.review-carousel blockquote').textContent=reviewSlides[reviewIndex];
  $$('.review-dots button').forEach((dot,i)=>{dot.classList.toggle('active',i===reviewIndex);dot.setAttribute('aria-pressed',String(i===reviewIndex))});
}
$$('[data-review]').forEach(button=>button.addEventListener('click',()=>changeReview(reviewIndex+Number(button.dataset.review))));
$$('[data-review-slide]').forEach(button=>button.addEventListener('click',()=>changeReview(Number(button.dataset.reviewSlide))));

// Front-end contact only. Data stays in the current page until the visitor copies it.
async function copy(text){
  try{await navigator.clipboard.writeText(text);toast('Mensagem copiada.');return true}
  catch{toast('Não foi possível copiar automaticamente. Selecione o texto da mensagem e copie.');return false}
}
function validTrimmed(form){
  $$('input[required],textarea[required]',form).forEach(field=>field.setCustomValidity(field.value.trim()?'':'Preencha este campo.'));
  return form.reportValidity();
}
$$('form').forEach(form=>form.addEventListener('input',e=>e.target.setCustomValidity?.('')));
const contactForm=$('#contact-form');let preparedMessage='';
if(contactForm){
  if(services.some(s=>s.id===queryService))$('#service').value=queryService;
  contactForm.addEventListener('submit',e=>{
    e.preventDefault();if(!validTrimmed(contactForm))return;
    const data=Object.fromEntries([...new FormData(contactForm)].map(([k,v])=>[k,v.trim()]));
    const service=services.find(s=>s.id===data.service)?.title||data.service;
    preparedMessage=`Olá, CellFix! Gostaria de solicitar um diagnóstico.\n\nNome: ${data.name}\nMarca: ${data.brand}\nModelo: ${data.model}\nServiço: ${service}\n\nProblema: ${data.problem}\n\nPodem me informar sobre o orçamento e o prazo?`;
    const feedback=$('#contact-feedback');feedback.hidden=false;$('textarea',feedback).value=preparedMessage;
    $('p',feedback).textContent='Mensagem preparada. Confira os dados antes de compartilhar com a equipe.';
    if(/^\d{10,15}$/.test(CONFIG.whatsapp)){
      $('#send-contact').href=`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(preparedMessage)}`;$('#send-contact').hidden=false;
    }
    feedback.scrollIntoView({block:'nearest',behavior:reducedMotion.matches?'auto':'smooth'});
    contactForm.dispatchEvent(new CustomEvent('cellfix:contact',{bubbles:true,detail:data}));
  });
  contactForm.addEventListener('input',()=>$('#contact-feedback').hidden=true);
  contactForm.addEventListener('change',()=>$('#contact-feedback').hidden=true);
  $('#copy-contact').addEventListener('click',async()=>{if(!await copy(preparedMessage)){$('textarea',$('#contact-feedback')).focus();$('textarea',$('#contact-feedback')).select()}});
}
const reviewForm=$('#review-form');
if(reviewForm)reviewForm.addEventListener('submit',e=>{
  e.preventDefault();if(!validTrimmed(reviewForm))return;
  const data=new FormData(reviewForm),feedback=$('#review-feedback');feedback.hidden=false;
  feedback.textContent=`Sua avaliação: ${data.get('rating')} de 5 estrelas. “${String(data.get('review')||$('#review-text').value).trim()}” — Comentário preparado. Nenhuma avaliação foi publicada.`;
});

// Pointer lighting stays subtle and is disabled for touch and reduced motion.
const finePointer=matchMedia('(pointer:fine)');
$$('.hover-light').forEach(card=>card.addEventListener('pointermove',e=>{
  if(reducedMotion.matches||!finePointer.matches)return;
  const r=card.getBoundingClientRect();card.style.setProperty('--light-x',e.clientX-r.left+'px');card.style.setProperty('--light-y',e.clientY-r.top+'px');
}));

// A real-time water surface: texture refraction, falling current, fountain jets,
// ripples and ballistic spray. No network or backend is needed.
const world=$('.visual-world'),stage=$('.mobile-fountain'),canvas=$('#lab-effects');
const ctx=canvas.getContext('2d',{alpha:true}),surface=$('#water-surface');
let paused=false,frameId=0,lastPaint=0,previousTime=0,time=0,width=0,height=0,dpr=1,embedded=false,visible=true;
let transform={scale:1,x:0,y:0},pointer={x:-10000,y:-10000,strength:0},lastPointer=0;
let ripples=[],spray=[],lastImpact=-100,impact={x:.55,y:.73};
const random=i=>{const v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v)};
const gl=surface.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'low-power',preserveDrawingBuffer:false});
let program=null,uniforms={},textureReady=false;
if(gl){
 try{
  const vertex=`attribute vec2 position;varying vec2 v_uv;void main(){v_uv=(position+1.0)*0.5;gl_Position=vec4(position,0.0,1.0);}`;
  const fragment=`precision mediump float;varying vec2 v_uv;uniform sampler2D image;uniform vec4 crop;uniform float t;uniform vec3 mouse;uniform vec3 impact;
  float noise(vec2 p){return sin(p.x*143.7+p.y*96.4)*sin(p.x*39.7-p.y*157.1);}
  void main(){
   vec2 uv=vec2(v_uv.x,1.0-v_uv.y)*crop.zw+crop.xy;
   float fall=smoothstep(.65,.69,uv.x)*(1.0-smoothstep(.775,.805,uv.x))*(1.0-smoothstep(.59,.64,uv.y));
   float pool=(1.0-smoothstep(.8,1.15,length((uv-vec2(.60,.738))/vec2(.34,.115))));
   float ring=exp(-abs(length((uv-vec2(.53,.565))/vec2(.18,.145))-1.0)*13.0);
   float wet=max(max(fall,pool),ring*.75);
   float phone=(1.0-smoothstep(.05,.085,abs(uv.x-(.72-.36*uv.y))))*smoothstep(.18,.22,uv.y)*(1.0-smoothstep(.72,.78,uv.y));
   wet*=1.0-phone*.95;
   if(wet<.015){gl_FragColor=vec4(0.0);return;}
   vec2 d=vec2(0.0);
   d.x=fall*(sin(uv.y*110.0-t*10.0+uv.x*230.0)*.0007+sin(uv.y*290.0-t*23.0)*.0004);
   d.y=fall*(sin(uv.y*150.0-t*15.0+uv.x*170.0)*.0015+sin(uv.y*310.0-t*27.0)*.0005);
   float dist=length((uv-vec2(.59,.735))*vec2(1.0,2.5));
   d+=pool*vec2(sin(dist*150.0-t*5.0),cos(dist*140.0-t*4.5))*.0009;
   d+=ring*vec2(sin(uv.y*130.0+t*3.0),cos(uv.x*150.0-t*6.0))*.0006;
   vec2 m=uv-mouse.xy;float md=length(m);float wake=sin(md*185.0-t*7.0)*exp(-md*14.0)*mouse.z;
   d+=normalize(m+vec2(.0001))*wake*.0045*wet;
   float age=max(0.0,t-impact.z);float radius=age*.12;vec2 hit=uv-impact.xy;
   float wave=exp(-pow((length(hit)-radius)*65.0,2.0))*exp(-age*1.0)*sin(length(hit)*160.0-age*12.0);
   d+=normalize(hit+vec2(.0001))*wave*.012*wet;
   vec3 color=texture2D(image,clamp(uv+d,vec2(0.0),vec2(1.0))).rgb;
   float highlight=max(0.0,sin(uv.y*185.0-t*13.0+uv.x*230.0));
   color+=vec3(.015,.05,.06)*highlight*fall;
   color+=vec3(.005,.025,.03)*max(0.0,wake)*wet;
   gl_FragColor=vec4(color,clamp(wet,0.0,1.0));
  }`;
  function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error('Water shader unavailable');return s;}
  program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Water surface unavailable');
  gl.useProgram(program);const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const attribute=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
  ['crop','t','mouse','impact'].forEach(name=>uniforms[name]=gl.getUniformLocation(program,name));
  const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
  const image=new Image();image.onload=()=>{try{gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);textureReady=true;surface.style.opacity='1';draw(time)}catch{surface.style.opacity='0'}};image.src='assets/cellfix-fonte.png';
 }catch{program=null;surface.style.opacity='0'}
}else surface.style.display='none';
if(!textureReady)surface.style.opacity='0';
surface.addEventListener('webglcontextlost',event=>{event.preventDefault();textureReady=false;surface.style.opacity='0'});
function mountWorld(){
 const next=Boolean(stage&&innerWidth<=960);
 if(next!==embedded){if(next)stage.append(world);else document.body.prepend(world);embedded=next;}
}
function resizeWorld(){
 mountWorld();const r=world.getBoundingClientRect();width=r.width;height=r.height;dpr=Math.min(devicePixelRatio||1,1.25);
 canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);surface.width=Math.round(width);surface.height=Math.round(height);
 const scale=embedded?height/720:Math.max(width/1280,height/720);
 transform={scale,x:embedded?(width-1280*scale)*.6:(width-1280*scale)/2,y:embedded?0:(height-720*scale)/2};
 if(gl&&program)gl.viewport(0,0,surface.width,surface.height);
 draw(time);sync();
}
function shaderWater(t){
 if(!gl||!program||!textureReady)return;
 gl.useProgram(program);const {scale:s,x,y}=transform;
 gl.uniform4f(uniforms.crop,-x/(1280*s),-y/(720*s),width/(1280*s),height/(720*s));
 gl.uniform1f(uniforms.t,t);gl.uniform3f(uniforms.mouse,pointer.x/1280,pointer.y/720,pointer.strength);
 gl.uniform3f(uniforms.impact,impact.x,impact.y,lastImpact);gl.drawArrays(gl.TRIANGLES,0,6);
}
function respond(x,y,strength=.25){
 const dx=x-pointer.x,dy=y-pointer.y,d=Math.hypot(dx,dy);
 if(pointer.strength&&d<85&&d>1){const force=(1-d/85)*pointer.strength;return{x:x+dx/(d||1)*force*12*strength,y:y+dy/(d||1)*force*12*strength};}
 return{x,y};
}
function fallingWater(t){
 for(let i=0;i<78;i++){
  const r=random(i+100),x=858+r*135,p=(t*(.55+r*.65)+random(i+44))%1;
  const y0=-45+random(i+11)*45,y=y0+p*477,tail=18+r*54;
  let a=respond(x+Math.sin(t*4+i)*1.5,y,.7),b=respond(x+Math.sin(t*4+i-1)*1.5,y-tail,.7);
  ctx.globalAlpha=(.1+r*.3)*Math.sin(Math.min(1,p+.1)*Math.PI*.9);ctx.strokeStyle=i%5===0?'#d8ffff':'#51dce9';ctx.lineWidth=.7+r*1.4;ctx.shadowColor='#2dd2e9';ctx.shadowBlur=2;
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  if(p>.83){ctx.globalAlpha=(1-p)*.8;ctx.beginPath();ctx.ellipse(x,442+random(i+3)*8,5+p*5,1.4,0,0,Math.PI*2);ctx.stroke();}
 }
}
function waterArc(t){
 for(let i=0;i<45;i++){
  const p=(t*.38+i/45)%1,a=p*Math.PI*2,r=1+Math.sin(t*2+i)*.01;
  const x=675+Math.cos(a)*191*r,y=404+Math.sin(a)*58+Math.cos(a)*40;
  const previous=a-.1;
  const b=respond(x,y,.6),c=respond(675+Math.cos(previous)*191,404+Math.sin(previous)*58+Math.cos(previous)*40,.6);
  ctx.globalAlpha=.13+Math.max(0,Math.sin(a))*.38;ctx.lineWidth=.7+random(i)*1.5;ctx.strokeStyle=i%4?'#6ce1eb':'#e6ffff';ctx.shadowColor='#67eaff';ctx.shadowBlur=2;
  ctx.beginPath();ctx.moveTo(c.x,c.y);ctx.quadraticCurveTo((c.x+b.x)/2,b.y+2,b.x,b.y);ctx.stroke();
 }
 // The arching fountain jet flows along a continuous quadratic path.
 for(let i=0;i<27;i++){
  const p=(t*.5+i/27)%1,tail=Math.max(0,p-.045);
  const curve=q=>({x:(1-q)*(1-q)*829+2*(1-q)*q*754+q*q*744,y:(1-q)*(1-q)*72+2*(1-q)*q*25+q*q*212});
  const a=curve(tail),b=respond(...Object.values(curve(p)),.3);
  ctx.globalAlpha=.2+random(i)*.35;ctx.strokeStyle=i%4?'#80d8e4':'#dbfbff';ctx.lineWidth=.7+random(i+2);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
 }
}
function draw(t){
 shaderWater(t);if(!ctx)return;
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);ctx.translate(transform.x,transform.y);ctx.scale(transform.scale,transform.scale);ctx.globalCompositeOperation='lighter';
 fallingWater(t);waterArc(t);ctx.shadowBlur=0;
 // Expanding pond rings and bright little splashes keep the basin alive.
 for(let i=0;i<6;i++){
  const p=(t*.24+i/6)%1;ctx.globalAlpha=(1-p)*.17;ctx.strokeStyle='#8ceaf2';ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(750,526,40+p*267,9+p*33,0,0,Math.PI*2);ctx.stroke();
 }
 for(let i=0;i<26;i++){
  const p=(t*.9+random(i+22))%1;ctx.globalAlpha=(1-p)*.25;ctx.fillStyle='#b4faff';ctx.beginPath();ctx.arc(868+random(i+7)*105+Math.sin(i+t)*5,449-p*12,random(i+8)*1.3+.5,0,Math.PI*2);ctx.fill();
 }
 ripples=ripples.filter(r=>t-r.born<2.5);ripples.forEach(r=>{const age=t-r.born;ctx.globalAlpha=Math.max(0,1-age/2.5)*.65;ctx.strokeStyle='#b8faff';ctx.lineWidth=1.1;ctx.beginPath();ctx.ellipse(r.x,r.y,9+age*95,3+age*28,0,0,Math.PI*2);ctx.stroke();});
 spray=spray.filter(p=>t-p.born<1.8);spray.forEach(p=>{const age=t-p.born,x=p.x+p.vx*age,y=p.y+p.vy*age+120*age*age;ctx.globalAlpha=Math.max(0,1-age/1.8)*.7;ctx.fillStyle='#c6fbff';ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fill();});
 ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;
}
function impactAt(x,y){
 if(paused||reducedMotion.matches)return;
 lastImpact=time;impact={x:x/1280,y:y/720};ripples.push({x,y,born:time});
 for(let i=0;i<24;i++){const angle=-Math.PI+Math.random()*Math.PI,speed=30+Math.random()*95;spray.push({x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed-25,r:.6+Math.random()*1.4,born:time});}
 if(spray.length>160)spray.splice(0,spray.length-160);
}
function worldPoint(e){const r=world.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return null;return{x:(e.clientX-r.left-transform.x)/transform.scale,y:(e.clientY-r.top-transform.y)/transform.scale};}
addEventListener('pointermove',e=>{
 if(paused||reducedMotion.matches)return;
 const p=worldPoint(e);if(!p||e.target.closest('a,button,input,select,textarea,dialog')){pointer.strength=0;return;}
 pointer={...p,strength:1};lastPointer=performance.now();
},{passive:true});
document.addEventListener('pointerdown',e=>{
 if(e.target.closest('a,button,input,select,textarea,dialog'))return;
 const p=worldPoint(e);if(p)impactAt(p.x,p.y);
},{passive:true});
$('.fountain-control')?.addEventListener('click',()=>{impactAt(730,529);if(embedded)stage.scrollIntoView({block:'center',behavior:reducedMotion.matches?'auto':'smooth'})});
stage?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();impactAt(740,535)}});
function animate(now){
 if(paused||reducedMotion.matches||document.hidden||(embedded&&!visible)){frameId=0;return;}
 frameId=requestAnimationFrame(animate);if(now-lastPaint<33)return;
 if(previousTime)time+=Math.min(.08,(now-previousTime)/1000);previousTime=now;lastPaint=now;
 if(now-lastPointer>180)pointer.strength*=.92;
 draw(time);
}
function sync(){
 cancelAnimationFrame(frameId);frameId=0;previousTime=0;
 if(!paused&&!reducedMotion.matches&&!document.hidden&&(!embedded||visible))frameId=requestAnimationFrame(animate);else draw(time);
}
const motionButton=$('.motion-toggle');motionButton.addEventListener('click',()=>{
 paused=!paused;document.documentElement.classList.toggle('motion-paused',paused);motionButton.setAttribute('aria-pressed',String(paused));motionButton.textContent=paused?'Retomar animações':'Pausar animações';motionButton.setAttribute('aria-label',motionButton.textContent);sync();
});
let resizeFrame;addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(resizeWorld)});
document.addEventListener('visibilitychange',sync);reducedMotion.addEventListener('change',sync);
if(stage)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync()},{rootMargin:'80px'}).observe(stage);
resizeWorld();
