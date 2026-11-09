'use strict';

// Add the official business number here, with country and area codes.
const CONFIG = { brandInitial: 'E', whatsapp: '', location: 'Piúma – ES' };
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const services = [
  { id:'tela', title:'Troca de Tela', description:'Display trincado, manchas ou falhas no toque. Avaliação do display e touch, substituição e testes de imagem e sensibilidade.' },
  { id:'bateria', title:'Troca de Bateria', description:'Energia para acompanhar o seu dia. Análise de autonomia e substituição da bateria conforme a necessidade do aparelho.' },
  { id:'camera', title:'Câmera', description:'Volte a registrar cada detalhe. Diagnóstico de foco, imagem e funcionamento das câmeras frontal e traseira.' },
  { id:'conector', title:'Conector', description:'Conexão estável e carregamento eficiente. Inspeção do conector, circuito de carga e acessórios utilizados no carregamento.' },
  { id:'sistema', title:'Sistema', description:'Seu celular funcionando em sintonia. Avaliação de travamentos, desempenho e falhas de software, preservando os cuidados com seus dados.' },
  { id:'outros', title:'Outros Reparos', description:'Soluções para cada componente. Botões, áudio, sensores e reparos de placa. Conte para a equipe o que aconteceu.' }
];
const steps = [
  ['Diagnóstico','Entendemos os sinais do seu aparelho e identificamos os componentes que precisam de atenção.','Avaliação completa e sem custo.','M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0m-2 5 7 7'],
  ['Orçamento','Você recebe as informações sobre o serviço, as peças e o prazo antes de decidir.','Transparente e sem surpresa.','M3 3h18v14H9l-6 4ZM7 8h10M7 12h7'],
  ['Reparo','Com sua aprovação, o aparelho segue para os procedimentos técnicos necessários.','Técnicos especializados e peças de qualidade.','m9 2-1 4-4 1-2 4 3 3-1 4 4 3 4-2 4 2 4-3-1-4 3-3-2-4-4-1-1-4ZM16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0'],
  ['Entrega','Conferimos as funções do aparelho e orientamos sobre o serviço e os cuidados após o reparo.','Seu celular pronto, testado e garantido.','m12 1 10 6v11l-10 5-10-5V7Zm0 0v11m0 11V12M2 7l10 5 10-5']
];
const pages = [
  ['index.html','Início','Tecnologia que revive seu celular'],['servicos.html','Serviços','Tela bateria câmera conector sistema reparos'],
  ['diferenciais.html','Diferenciais','Precisão tecnologia segurança confiança'],['processo.html','Processo de reparo','Diagnóstico orçamento reparo entrega'],
  ['sobre.html','Sobre a TechCell','Assistência técnica em Piúma'],['avaliacoes.html','Avaliações','Experiências e opiniões'],
  ['faq.html','Dúvidas frequentes','Prazos dados pagamento peças'],['contato.html','Contato','Atendimento orçamento localização WhatsApp']
];
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
$$('[data-brand-initial]').forEach(node=>{node.textContent=Array.from(CONFIG.brandInitial.trim().toUpperCase())[0]||'E'});
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
$('[data-notifications]').addEventListener('click',()=>toast('Atendimento: 08h às 19h. Consulte os dias de funcionamento e o atendimento em feriados com a equipe.'));

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
    preparedMessage=`Olá, TechCell! Gostaria de solicitar um diagnóstico.\n\nNome: ${data.name}\nMarca: ${data.brand}\nModelo: ${data.model}\nServiço: ${service}\n\nProblema: ${data.problem}\n\nPodem me informar sobre o orçamento e o prazo?`;
    const feedback=$('#contact-feedback');feedback.hidden=false;$('textarea',feedback).value=preparedMessage;
    $('p',feedback).textContent='Mensagem preparada. Confira os dados antes de compartilhar com a equipe.';
    if(/^\d{10,15}$/.test(CONFIG.whatsapp)){
      $('#send-contact').href=`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(preparedMessage)}`;$('#send-contact').hidden=false;
    }
    feedback.scrollIntoView({block:'nearest',behavior:reducedMotion.matches?'auto':'smooth'});
    contactForm.dispatchEvent(new CustomEvent('techcell:contact',{bubbles:true,detail:data}));
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

// Flowing water, moving reflections, hologram particles and reactor energy.
// Positions use the artwork's native 1672 × 941 coordinate system, so overlays
// follow CSS background-size:cover rather than drifting away from the scene.
const canvas=$('#lab-effects'),ctx=canvas.getContext('2d',{alpha:true});
const labWorld=$('.lab-world'),labStage=$('.lab-stage'),reactor=$('.tube-reactor');
let stageMounted=false,stageVisible=true;
let paused=false,animationFrame=0,lastFrame=0,visualTime=0,previousTime=0,viewW=0,viewH=0,pixelRatio=1;
function mountScene(){
  const shouldMount=Boolean(labStage&&innerWidth<=960);
  if(shouldMount!==stageMounted){
    if(shouldMount)labStage.append(labWorld);else document.body.prepend(labWorld);
    stageMounted=shouldMount;
  }
}
function resizeEffects(){
  mountScene();
  const bounds=labWorld.getBoundingClientRect();
  viewW=bounds.width;viewH=bounds.height;pixelRatio=Math.min(devicePixelRatio||1,1.5);
  canvas.width=Math.round(viewW*pixelRatio);canvas.height=Math.round(viewH*pixelRatio);
  if(stageMounted){['left','top','width','height'].forEach(property=>reactor.style.removeProperty(property))}
  else{
    const scale=Math.max(viewW/1672,viewH/941),ox=(viewW-1672*scale)/2,oy=(viewH-941*scale)/2;
    reactor.style.left=ox+1434*scale+'px';reactor.style.top=oy+159*scale+'px';reactor.style.width=126*scale+'px';reactor.style.height=237*scale+'px';
  }
  if(paused||reducedMotion.matches)drawEffects(0);
  syncEffects();
}
const hash=i=>{const v=Math.sin(i*127.1+311.7)*43758.5453;return v-Math.floor(v)};
function stream(t,x,y,length,width,count,seed){
  for(let i=0;i<count;i++){
    const r=hash(i+seed),u=i/(count-1),speed=.55+r*.65;
    const head=(t*speed+r)%1,tail=Math.max(0,head-.25-r*.14);
    const ox=x+u*width,oy=y+Math.sin(u*Math.PI)*-9;
    ctx.beginPath();
    for(let j=0;j<=9;j++){
      const p=tail+(head-tail)*j/9;
      const px=ox-13*Math.sin(p*Math.PI*.6)+Math.sin(t*4.5+p*12+i)*(1+p*3);
      const py=oy+length*p;
      if(j===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.globalAlpha=(.35+r*.55)*(1-head*.45);ctx.strokeStyle=i%4===0?'#e4ffff':'#38e9ff';ctx.lineWidth=1+r*2.2;
    ctx.shadowColor='#16eaff';ctx.shadowBlur=6;ctx.stroke();
    if(head>.8){ctx.globalAlpha=(1-head)*1.2;ctx.beginPath();ctx.ellipse(ox-10,oy+length,3+head*3,1,0,0,Math.PI*2);ctx.stroke()}
  }
}
function drawEffects(t){
  if(!ctx)return;
  ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);ctx.clearRect(0,0,viewW,viewH);
  const scale=stageMounted?viewH/941:Math.max(viewW/1672,viewH/941);
  const ox=stageMounted?viewW-1672*scale:(viewW-1672*scale)/2,oy=stageMounted?0:(viewH-941*scale)/2;
  ctx.translate(ox,oy);ctx.scale(scale,scale);ctx.globalCompositeOperation='lighter';
  stream(t,270,548,144,64,46,18);stream(t+.9,1365,550,147,63,46,113);stream(t+.4,764,670,67,185,42,284);
  // Turbulent water sheets and rising spray make the continuous current visible.
  ctx.shadowColor='#4cf1ff';ctx.shadowBlur=6;
  for(let i=0;i<36;i++){
    const p=(t*.8+hash(i+91))%1,x=764+hash(i+38)*190;
    ctx.globalAlpha=(1-p)*.38;ctx.fillStyle='#b1ffff';ctx.beginPath();
    ctx.arc(x+Math.sin(t*3+i)*9,730-p*23,1+hash(i+24)*1.7,0,Math.PI*2);ctx.fill();
  }
  for(let i=0;i<12;i++){
    ctx.globalAlpha=.1+Math.sin(t*3+i)*.045;ctx.strokeStyle='#49e9ff';ctx.lineWidth=3;
    const x=770+i*15;ctx.beginPath();ctx.moveTo(x,677);ctx.bezierCurveTo(x+Math.sin(t*4+i)*5,695,x-9,714,x-3,734);ctx.stroke();
  }
  // Orange light travels around the phone; each point follows the same orbit.
  ctx.shadowBlur=8;ctx.shadowColor='#ff8b00';
  for(let i=0;i<18;i++){
    const a=t*.6+i*Math.PI*2/18,c=Math.cos(a),s=Math.sin(a);
    const x=885+c*260,y=370+s*95-c*90;
    ctx.globalAlpha=.2+Math.max(0,s)*.5;ctx.fillStyle=i%4?'#ff9c32':'#fff0cc';ctx.beginPath();ctx.arc(x,y,i%5===0?2.1:1.1,0,Math.PI*2);ctx.fill();
  }
  // Transparent scan lines and falling cyan hologram particles.
  ctx.shadowColor='#54fbff';ctx.shadowBlur=4;
  for(let i=0;i<45;i++){
    const r=hash(i+480),x=650+r*455,y=110+((t*(25+hash(i+21)*55)+hash(i+13)*450)%450);
    ctx.globalAlpha=.08+hash(i+7)*.32;ctx.strokeStyle='#94fbff';ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+5+hash(i+38)*15);ctx.stroke();
  }
  // Upward energy stream in the glass tube, aligned with the actual chamber.
  ctx.shadowColor='#ff9c19';ctx.shadowBlur=6;
  for(let i=0;i<27;i++){
    const r=hash(i+18),p=(t*(.5+r*.3)+hash(i+27))%1,x=1486+Math.sin(p*9+i)*30+r*28,y=379-p*204;
    ctx.globalAlpha=.25+Math.sin(p*Math.PI)*.5;ctx.fillStyle='#ffbf61';ctx.fillRect(x,y,1,4+r*9);
  }
  // Ripples, thin flowing rings and a moving reflection on the front rim.
  ctx.shadowBlur=3;ctx.shadowColor='#28edff';ctx.strokeStyle='#75fbff';
  for(let i=0;i<5;i++){
    const p=(t*.33+i/5)%1;ctx.globalAlpha=(1-p)*.34;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(838,562,110+p*235,12+p*27,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.globalCompositeOperation='source-over';ctx.globalAlpha=1;ctx.shadowBlur=0;
}
function effectFrame(now){
  if(paused||reducedMotion.matches||document.hidden||(stageMounted&&!stageVisible)){animationFrame=0;return;}
  animationFrame=requestAnimationFrame(effectFrame);
  if(now-lastFrame<(viewW<700?33:24))return;
  if(previousTime)visualTime+=Math.min((now-previousTime)/1000,.08);previousTime=now;lastFrame=now;drawEffects(visualTime);
}
function syncEffects(){
  cancelAnimationFrame(animationFrame);animationFrame=0;previousTime=0;
  if(!paused&&!reducedMotion.matches&&!document.hidden&&(!stageMounted||stageVisible))animationFrame=requestAnimationFrame(effectFrame);
  else drawEffects(visualTime);
}
const motionButton=$('.motion-toggle');
function updateMotion(){
  document.documentElement.classList.toggle('motion-paused',paused);
  motionButton.setAttribute('aria-pressed',String(paused));motionButton.textContent=paused?'Retomar animações':'Pausar animações';
  motionButton.setAttribute('aria-label',motionButton.textContent);syncEffects();
}
motionButton.addEventListener('click',()=>{paused=!paused;updateMotion()});
document.addEventListener('visibilitychange',syncEffects);
reducedMotion.addEventListener('change',syncEffects);
let resizeFrame=0;addEventListener('resize',()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(resizeEffects)});
if(labStage)new IntersectionObserver(entries=>{stageVisible=entries[0].isIntersecting;syncEffects()},{rootMargin:'60px'}).observe(labStage);
resizeEffects();syncEffects();
