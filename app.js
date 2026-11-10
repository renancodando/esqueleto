/* CellFix — testes do aparelho no navegador. Sem dependências. */
(() => {
  'use strict';

  // Preencha com o WhatsApp da loja: país + DDD + número, só dígitos (ex.: '5528999990000').
  // Enquanto estiver vazio, o WhatsApp abre com a mensagem pronta e pede para escolher o contato.
  const CONFIG = { whatsapp: '' };

  const GREEN = '#00c566';
  const LINE = '#dde1e6';
  const $ = (sel, root = document) => root.querySelector(sel);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Grade de toque: cada célula fica verde quando o dedo passa por ela
     ------------------------------------------------------------------ */
  class Grid {
    constructor(canvas, { target = 48, onChange = () => {} } = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.target = target;
      this.onChange = onChange;
      this.last = null;
      this.layout();
    }

    layout() {
      const r = this.canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.w = r.width;
      this.h = r.height;
      this.cols = Math.max(4, Math.round(this.w / this.target));
      this.cw = this.w / this.cols;
      this.rows = Math.max(4, Math.round(this.h / this.cw));
      this.ch = this.h / this.rows;
      this.cells = new Uint8Array(this.cols * this.rows);
      this.count = 0;
      this.canvas.width = Math.round(this.w * dpr);
      this.canvas.height = Math.round(this.h * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.draw();
      this.onChange(this);
    }

    draw() {
      const { ctx, w, h, cols, rows, cw, ch } = this;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = LINE;
      for (let c = 1; c < cols; c++) ctx.fillRect(Math.round(c * cw), 0, 1, h);
      for (let r = 1; r < rows; r++) ctx.fillRect(0, Math.round(r * ch), w, 1);
    }

    get total() {
      return this.cells.length;
    }
    get pct() {
      return Math.floor((this.count / this.total) * 100);
    }

    paint(x, y) {
      const c = Math.floor(x / this.cw), r = Math.floor(y / this.ch);
      if (c < 0 || r < 0 || c >= this.cols || r >= this.rows) return;
      const i = r * this.cols + c;
      if (this.cells[i]) return;
      this.cells[i] = 1;
      this.count++;
      const x0 = Math.round(c * this.cw) + 1, y0 = Math.round(r * this.ch) + 1;
      this.ctx.fillStyle = GREEN;
      this.ctx.fillRect(x0, y0, Math.round((c + 1) * this.cw) - x0, Math.round((r + 1) * this.ch) - y0);
      this.onChange(this);
    }

    // liga o ponto anterior ao atual para não pular células em deslizes rápidos
    move(x, y) {
      if (this.last) {
        const dx = x - this.last.x, dy = y - this.last.y;
        const steps = Math.ceil(Math.hypot(dx, dy) / (this.cw / 3));
        for (let s = 1; s < steps; s++) this.paint(this.last.x + (dx * s) / steps, this.last.y + (dy * s) / steps);
      }
      this.paint(x, y);
      this.last = { x, y };
    }

    lift() {
      this.last = null;
    }
  }

  function bindPointer(el, grid, { capture = false, enabled = () => true } = {}) {
    const pos = (e) => {
      const r = grid.canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };
    el.addEventListener('pointerdown', (e) => {
      if (!enabled() || e.target.closest('button, a, input')) return;
      if (capture) el.setPointerCapture?.(e.pointerId);
      grid.lift();
      grid.move(...pos(e));
    });
    el.addEventListener('pointermove', (e) => {
      if (!enabled()) return;
      const list = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (const ev of list.length ? list : [e]) grid.move(...pos(ev));
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach((t) => el.addEventListener(t, () => grid.lift()));
  }

  /* ------------------------------------------------------------------
     Abertura: a grade ocupa a tela e já funciona como demonstração
     ------------------------------------------------------------------ */
  const hero = $('#inicio');
  const heroPct = $('#hero-pct');
  const heroGrid = new Grid($('#hero-grid'), {
    onChange: (g) => {
      heroPct.textContent = g.pct + '%';
    },
  });
  bindPointer(hero, heroGrid);

  // um traço de exemplo, para mostrar o que a grade faz
  function demoStroke() {
    const g = heroGrid;
    if (!g.w) return;
    const path = (t) => [g.w * (0.52 + 0.4 * t), g.h * (0.3 - 0.13 * Math.sin(t * Math.PI * 1.5))];
    if (reduced) {
      for (let i = 0; i <= 40; i++) g.move(...path(i / 40));
      g.lift();
      return;
    }
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / 900);
      g.move(...path(t));
      if (t < 1) requestAnimationFrame(tick);
      else g.lift();
    };
    requestAnimationFrame(tick);
  }

  let resizeTimer;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      heroGrid.layout();
      if (!stage.hidden && current === 'toque') stageGrid.layout();
    }, 150);
  });

  /* ------------------------------------------------------------------
     Resultados dos testes (opcionais)
     ------------------------------------------------------------------ */
  // defeito: a opção do orçamento que um teste reprovado marca sozinho
  const TESTS = {
    toque: { name: 'Toque', defeito: 'toque' },
    pixels: { name: 'Pixels', defeito: 'imagem' },
    som: { name: 'Som', defeito: 'som' },
    vibracao: { name: 'Vibração', defeito: 'vibra' },
    bateria: { name: 'Bateria', defeito: 'bateria' },
  };
  const ORDER = Object.keys(TESTS);
  let results = {};
  try {
    results = JSON.parse(sessionStorage.getItem('cellfix-testes') || '{}') || {};
  } catch (e) {
    results = {};
  }

  const testsSummary = $('#tests-summary');

  function setResult(id, value) {
    results[id] = value;
    try {
      sessionStorage.setItem('cellfix-testes', JSON.stringify(results));
    } catch (e) {
      /* navegação privada: o resultado vale só enquanto a página estiver aberta */
    }
    if (value === 'falha') {
      const box = $(`#quote-form input[name="defeito"][value="${TESTS[id].defeito}"]`);
      if (box) box.checked = true;
    }
    render();
  }

  function render() {
    ORDER.forEach((id) => {
      const li = $(`.tests li[data-test="${id}"]`);
      const r = results[id];
      if (r) li.dataset.result = r;
      else delete li.dataset.result;
      $('[data-status]', li).textContent = r === 'ok' ? 'Passou' : r === 'falha' ? 'Falhou' : 'Não testado';
      $('[data-run]', li).textContent = r ? 'Repetir teste' : `Testar ${TESTS[id].name.toLowerCase()}`;
    });
    const done = ORDER.filter((id) => results[id]);
    const failed = done.filter((id) => results[id] === 'falha');
    testsSummary.textContent = !done.length
      ? 'Nenhum teste feito ainda.'
      : `${done.length} de ${ORDER.length} testes feitos, ${failed.length ? failed.length + (failed.length === 1 ? ' falhou' : ' falharam') : 'todos passaram'}. O resultado já está na sua mensagem.`;
    updateMessage();
  }

  /* ------------------------------------------------------------------
     Orçamento: o site escreve a mensagem do WhatsApp
     ------------------------------------------------------------------ */
  const form = $('#quote-form');
  const preview = $('#quote-preview');
  const errorEl = $('#quote-error');
  const copyBtn = $('#quote-copy');

  function formData() {
    const marca = (form.querySelector('input[name="marca"]:checked') || {}).value || '';
    const modelo = form.modelo.value.trim();
    return {
      aparelho: [marca, modelo].filter(Boolean).join(' '),
      marcaEscolhida: !!form.querySelector('input[name="marca"]:checked'),
      modelo,
      defeitos: [...form.querySelectorAll('input[name="defeito"]:checked')].map((i) => i.nextElementSibling.textContent),
      detalhes: form.detalhes.value.trim(),
      nome: form.nome.value.trim(),
    };
  }

  function buildMessage() {
    const d = formData();
    const names = (v) => ORDER.filter((id) => results[id] === v).map((id) => TESTS[id].name.toLowerCase());
    const failed = names('falha'), passed = names('ok');
    if (!d.aparelho && !d.defeitos.length && !d.detalhes && !d.nome && !failed.length && !passed.length) return '';

    const lines = [`Olá, CellFix!${d.nome ? ` Meu nome é ${d.nome}.` : ''}`];
    lines.push(d.aparelho ? `Quero um orçamento para o meu ${d.aparelho}.` : 'Quero um orçamento para o meu celular.');
    if (d.defeitos.length) {
      lines.push('', 'O que está acontecendo:');
      d.defeitos.forEach((t) => lines.push(`• ${t}`));
    }
    if (d.detalhes) lines.push('', `Detalhes: ${d.detalhes}`);
    if (failed.length || passed.length) {
      lines.push('', 'Teste que fiz no site da CellFix:');
      if (failed.length) lines.push(`• Falhou: ${failed.join(', ')}`);
      if (passed.length) lines.push(`• Passou: ${passed.join(', ')}`);
    }
    lines.push('', 'Podem me passar o valor e o prazo?');
    return lines.join('\n');
  }

  function updateMessage() {
    const text = buildMessage();
    preview.textContent = text || 'Escolha a marca e marque o defeito. A mensagem aparece aqui, pronta para enviar.';
    preview.classList.toggle('empty', !text);
    if (text) errorEl.textContent = '';
  }

  // devolve a mensagem ou explica o que falta
  function validMessage() {
    const d = formData();
    if (!d.modelo && !d.marcaEscolhida) {
      errorEl.textContent = 'Falta o aparelho. Escolha a marca ou escreva o modelo.';
      form.modelo.focus();
      return null;
    }
    if (!d.defeitos.length && !d.detalhes) {
      errorEl.textContent = 'Falta o defeito. Marque uma opção ou conte o que aconteceu.';
      form.querySelector('input[name="defeito"]').focus();
      return null;
    }
    errorEl.textContent = '';
    return buildMessage();
  }

  async function copy(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.append(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch (err) {
        ok = false;
      }
      ta.remove();
      return ok;
    }
  }

  form.addEventListener('input', updateMessage);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = validMessage();
    if (!text) return;
    // sem número configurado, o WhatsApp abre e pede para escolher o contato
    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });
  copyBtn.addEventListener('click', async () => {
    const text = validMessage();
    if (!text) return;
    if (await copy(text)) {
      copyBtn.textContent = 'Mensagem copiada';
      setTimeout(() => (copyBtn.textContent = 'Copiar mensagem'), 2500);
    } else {
      errorEl.textContent = 'O navegador bloqueou a cópia. Selecione o texto da mensagem e copie à mão.';
    }
  });

  // "Orçar troca de tela" na lista de serviços já deixa o defeito marcado
  document.querySelectorAll('a[data-defeito]').forEach((a) =>
    a.addEventListener('click', () => {
      const box = form.querySelector(`input[name="defeito"][value="${a.dataset.defeito}"]`);
      if (box) box.checked = true;
      updateMessage();
    })
  );

  // botão fixo: aparece fora da abertura e some quando o orçamento está na tela
  const fab = $('#fab');
  if ('IntersectionObserver' in window) {
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => seen.set(en.target.id, en.isIntersecting));
      fab.hidden = !!(seen.get('inicio') || seen.get('orcamento') || seen.get('contato'));
    });
    ['inicio', 'orcamento', 'contato'].forEach((id) => io.observe(document.getElementById(id)));
  }

  /* ------------------------------------------------------------------
     Palco: os testes em tela cheia
     ------------------------------------------------------------------ */
  const stage = $('#stage');
  const ui = $('#stage-ui');
  const stageCanvas = $('#stage-grid');
  const background = [...document.querySelectorAll('body > header, body > main, body > footer')];
  let current = null;
  let opener = null;
  let onStageTap = null;
  let touchDone = false;

  const stageGrid = new Grid(stageCanvas, {
    onChange: (g) => {
      const el = $('#touch-pct');
      if (el) el.textContent = g.pct + '%';
      if (current === 'toque' && !touchDone && g.count === g.total && g.total > 0) {
        touchDone = true;
        finish('toque', 'ok');
      }
    },
  });
  // só pinta enquanto o teste de toque está valendo (a barrinha com a porcentagem na tela)
  bindPointer(stage, stageGrid, { capture: true, enabled: () => current === 'toque' && !!$('#touch-pct') });

  // monta a interface do teste: [tag, texto, {atributos}, onClick]
  function show(nodes) {
    ui.innerHTML = '';
    const build = ([tag, text, attrs = {}, onClick, children]) => {
      const el = document.createElement(tag);
      if (text) el.textContent = text;
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      if (onClick) el.addEventListener('click', onClick);
      (children || []).forEach((c) => el.append(build(c)));
      return el;
    };
    nodes.forEach((n) => ui.append(build(n)));
    const first = $('button', ui);
    if (first) first.focus({ preventScroll: true });
  }
  const btn = (text, cls, fn) => ['button', text, { type: 'button', class: `btn ${cls}` }, fn];
  const card = (...children) => ['div', '', { class: 'card', role: 'dialog', 'aria-modal': 'true' }, null, children];
  const actions = (...children) => ['div', '', { class: 'card-actions' }, null, children];

  function open(id, trigger) {
    opener = trigger || opener;
    stage.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    background.forEach((el) => (el.inert = true)); // a página por trás sai do alcance do teclado e do leitor de tela
    if (!document.fullscreenElement && stage.requestFullscreen) stage.requestFullscreen().catch(() => {});
    run(id);
  }

  function close() {
    stage.hidden = true;
    current = null;
    onStageTap = null;
    stage.style.background = '';
    stage.classList.remove('dim');
    document.documentElement.style.overflow = '';
    background.forEach((el) => (el.inert = false));
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    if (opener) opener.focus({ preventScroll: true });
  }

  function seeReport() {
    close();
    $('#orcamento').scrollIntoView();
  }

  function finish(id, value) {
    setResult(id, value);
    onStageTap = null;
    stage.style.background = '#fff';
    stageCanvas.hidden = true;
    const next = ORDER.find((t) => !results[t]);
    show([
      card(
        ['h2', `${TESTS[id].name}: ${value === 'ok' ? 'passou' : 'falhou'}.`],
        ['p', value === 'ok' ? 'Resultado anotado na sua mensagem de orçamento.' : 'Anotado na sua mensagem de orçamento, com o defeito já marcado.'],
        actions(
          next ? btn(`Testar ${TESTS[next].name.toLowerCase()}`, 'btn-green full', () => run(next)) : btn('Ir para o orçamento', 'btn-green full', seeReport),
          next ? btn('Ir para o orçamento', 'btn-ghost full', seeReport) : btn('Fechar', 'btn-ghost full', close)
        )
      ),
    ]);
  }

  const skip = (id) => btn('Pular este teste', 'btn-ghost full', () => {
    const next = ORDER.slice(ORDER.indexOf(id) + 1).find((t) => !results[t]);
    if (next) run(next);
    else seeReport();
  });

  function run(id) {
    current = id;
    onStageTap = null;
    stage.style.background = '#fff';
    stage.classList.remove('dim');
    stageCanvas.hidden = id !== 'toque';
    RUN[id]();
  }

  const RUN = {
    toque() {
      touchDone = false;
      stageGrid.layout();
      show([
        [
          'div',
          '',
          { class: 'pill' },
          null,
          [
            ['span', '0%', { id: 'touch-pct', 'aria-live': 'off' }],
            ['span', 'Pinte a tela inteira'],
            [
              'button',
              'Terminar',
              { type: 'button', class: 'btn' },
              () => {
                const left = stageGrid.total - stageGrid.count;
                show([
                  card(
                    ['h2', `${left} ${left === 1 ? 'quadrado ficou' : 'quadrados ficaram'} sem pintar.`],
                    ['p', 'Você passou o dedo neles e mesmo assim não pintaram?'],
                    actions(
                      btn('Sim, não pintaram', 'btn-red', () => finish('toque', 'falha')),
                      btn('Não passei ali', 'btn-ghost', () => {
                        const keep = stageGrid.cells.slice();
                        RUN.toque();
                        // devolve o que já estava pintado
                        keep.forEach((v, i) => v && stageGrid.paint(((i % stageGrid.cols) + 0.5) * stageGrid.cw, (Math.floor(i / stageGrid.cols) + 0.5) * stageGrid.ch));
                      }),
                      skip('toque')
                    )
                  ),
                ]);
              },
            ],
          ],
        ],
      ]);
    },

    pixels() {
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'];
      const names = ['Vermelho', 'Verde', 'Azul', 'Branco', 'Preto'];
      let i = 0, timer;
      const paint = () => {
        stage.style.background = colors[i];
        stage.classList.remove('dim');
        show([['div', '', { class: 'pill hint' }, null, [['span', `${names[i]}, ${i + 1} de 5. Toque na tela para trocar.`]]]]);
        clearTimeout(timer);
        timer = setTimeout(() => current === 'pixels' && stage.classList.add('dim'), 1800); // some para a cor ficar pura
      };
      onStageTap = () => {
        i++;
        if (i < colors.length) return paint();
        clearTimeout(timer);
        onStageTap = null;
        stage.style.background = '#fff';
        stage.classList.remove('dim');
        show([
          card(
            ['h2', 'Alguma coisa ficou parada?'],
            ['p', 'Ponto que não muda de cor, mancha, faixa ou linha em qualquer uma das cinco telas.'],
            actions(
              btn('Não, tela limpa', 'btn-green', () => finish('pixels', 'ok')),
              btn('Sim, apareceu', 'btn-red', () => finish('pixels', 'falha')),
              btn('Ver as cores de novo', 'btn-ghost full', () => run('pixels')),
              skip('pixels')
            )
          ),
        ]);
      };
      paint();
    },

    som() {
      show([
        card(
          ['h2', 'O som sai limpo?'],
          ['p', 'Aumente o volume e toque cada lado. Em celular com um alto-falante só, os dois lados soam iguais.'],
          actions(
            btn('Tocar à esquerda', 'btn-line', () => tone(-1)),
            btn('Tocar à direita', 'btn-line', () => tone(1)),
            btn('Sim, saiu limpo', 'btn-green', () => finish('som', 'ok')),
            btn('Não, falhou', 'btn-red', () => finish('som', 'falha')),
            skip('som')
          )
        ),
      ]);
    },

    vibracao() {
      const android = typeof navigator.vibrate === 'function';
      show([
        card(
          ['h2', 'O aparelho vibrou?'],
          [
            'p',
            android
              ? 'Segure o celular na mão e toque em vibrar. São três pulsos longos.'
              : 'O iPhone não deixa um site ligar a vibração. Dá para pedir só um toque leve, parecido com o do teclado.',
            { id: 'vib-info', 'aria-live': 'polite' },
          ],
          actions(
            btn(android ? 'Vibrar agora' : 'Tentar toque leve', 'btn-line full', () => {
              const info = $('#vib-info');
              const how = buzz();
              if (how === 'recusado')
                info.textContent = 'O navegador recusou a vibração. Abra o site no Chrome, fora do Instagram ou do WhatsApp, e tente de novo.';
              else if (how === 'vibrar')
                info.textContent = 'Pedido enviado ao aparelho. Não sentiu nada? Confira se o modo silencioso, o Não Perturbe ou a economia de bateria estão ligados e se a vibração ao toque está ativada nas configurações. Com tudo certo e sem vibrar, o motor está com defeito.';
              else
                info.textContent = 'Toque leve enviado. Se não sentiu, confira em Ajustes, Sons e Tátil se a vibração está ligada, e teste por lá.';
            }),
            btn('Sim, vibrou', 'btn-green', () => finish('vibracao', 'ok')),
            btn('Não vibrou', 'btn-red', () => finish('vibracao', 'falha')),
            skip('vibracao')
          )
        ),
      ]);
    },

    bateria() {
      const render = (big, info) =>
        show([
          card(
            ['h2', 'A carga chega até a noite?'],
            ...(big ? [['p', big, { class: 'big' }]] : []),
            ['p', info + ' Com uso normal, saindo de casa com 100%, a bateria aguenta o dia?'],
            actions(
              btn('Sim, aguenta', 'btn-green', () => finish('bateria', 'ok')),
              btn('Não, acaba antes', 'btn-red', () => finish('bateria', 'falha')),
              skip('bateria')
            )
          ),
        ]);
      render('', 'Lendo a carga do aparelho.');
      const fallback = () => current === 'bateria' && render('', 'Este aparelho não informa a carga para sites.');
      if (!navigator.getBattery) return fallback();
      navigator
        .getBattery()
        .then((b) => {
          if (current !== 'bateria') return;
          render(Math.round(b.level * 100) + '%', b.charging ? 'Carga agora, com o carregador ligado.' : 'Carga agora, fora da tomada.');
        })
        .catch(fallback);
    },
  };

  // Android: Vibration API. iPhone: não existe; alternar um interruptor nativo gera um toque háptico leve.
  function buzz() {
    if (typeof navigator.vibrate === 'function') {
      return navigator.vibrate([500, 200, 500, 200, 900]) ? 'vibrar' : 'recusado';
    }
    try {
      const label = document.createElement('label');
      label.style.cssText = 'position:fixed;left:-99px;top:0;opacity:0;pointer-events:none';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('switch', '');
      label.append(input);
      document.body.append(label);
      label.click();
      [120, 240].forEach((ms) => setTimeout(() => label.click(), ms));
      setTimeout(() => label.remove(), 600);
    } catch (e) {
      /* sem suporte: fica só a pergunta */
    }
    return 'haptico';
  }

  let audio;
  function tone(pan) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    audio = audio || new AC();
    audio.resume();
    const out = audio.createStereoPanner ? audio.createStereoPanner() : null;
    if (out) {
      out.pan.value = pan;
      out.connect(audio.destination);
    }
    [440, 554.37, 659.25].forEach((freq, i) => {
      const t = audio.currentTime + i * 0.3;
      const osc = audio.createOscillator(), gain = audio.createGain();
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.5, t + 0.02);
      gain.gain.linearRampToValueAtTime(0, t + 0.26);
      osc.connect(gain).connect(out || audio.destination);
      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  stage.addEventListener('click', (e) => {
    if (onStageTap && !e.target.closest('button')) onStageTap();
  });
  document.addEventListener('keydown', (e) => {
    if (stage.hidden) return;
    if (e.key === 'Escape') close();
    else if (onStageTap && (e.key === ' ' || e.key === 'Enter') && !e.target.closest('button')) {
      e.preventDefault();
      onStageTap();
    }
  });
  document.addEventListener('fullscreenchange', () => {
    if (!stage.hidden && current === 'toque') stageGrid.layout();
  });

  document.querySelectorAll('[data-run]').forEach((b) => b.addEventListener('click', () => open(b.dataset.run, b)));

  render();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
    heroGrid.layout();
    demoStroke();
  });
})();
