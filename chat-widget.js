/**
 * LUNA ORGANICS CHAT WIDGET v1.0
 * Chat estilo WhatsApp com RAG para captura e qualificacao de leads
 *
 * INSTALACAO: Adicione antes do </body> da sua landing page:
 * <script src="chat-widget.js"></script>
 *
 * CONFIGURACAO OBRIGATORIA:
 * Substitua 'NUMERO_WHATSAPP' pelo numero real (ex: 5511999999999)
 */

(function () {

  // =============================================
  // CONFIGURACAO - EDITE AQUI
  // =============================================
  var WHATSAPP_NUMBER = 'NUMERO_WHATSAPP'; // Ex: 5511999999999
  var LUNA_GREEN = '#349588';
  // =============================================

  // Base de Conhecimento (RAG)
  var FAQS = [
    { p: ['legal','legalizado','proibido','permitido','anvisa','cfm','regulamentado'], a: '✅ Sim! O CBD e 100% legal no Brasil. O CFM autorizou a prescricao em 2019 e a ANVISA regulamentou a importacao em 2020.' },
    { p: ['dependencia','vicio','dependente','tolerancia'], a: '🧠 Nao! A OMS concluiu que o CBD nao apresenta potencial de dependencia ou abuso. Seguro para uso continuo sob supervisao medica.' },
    { p: ['plano de saude','convenio','cobertura','reembolso'], a: '💼 Ainda nao ha cobertura por planos de saude. Porem, o custo com CBD frequentemente e menor que medicamentos convencionais.' },
    { p: ['resultado','tempo','prazo','quando','demora','funciona','efeito'], a: '⏱️ Sono e ansiedade: 2 a 4 semanas. Dor cronica: 4 a 8 semanas. Acompanhamento medico para ajustes.' },
    { p: ['online','processo','como funciona','etapa','passo'], a: '📱 100% online: 1) Consulta por videochamada 2) Prescricao + autorizacao ANVISA 3) Importacao direta 4) Entrega em ~15 dias!' },
    { p: ['preco','custo','valor','quanto custa','investimento'], a: '💰 O custo varia conforme a condicao. Nossos especialistas detalham durante a avaliacao gratuita!' },
    { p: ['cbd','canabidiol','cannabis','o que e','cannabidiol'], a: '🌿 O CBD (canabidiol) e um composto natural da Cannabis sativa. Sem efeito psicoativo. Sem risco de dependencia. +30.000 estudos cientificos!' },
    { p: ['entrega','importacao','envio','frete','endereco'], a: '📦 Importacao direta com isencao de impostos! Entrega em ~15 dias, rastreada, embalagem discreta. Todo o Brasil!' },
    { p: ['medico','doutor','especialista','consulta','receita'], a: '👨‍⚕️ Medicos especialistas autorizados pelo CFM. Consulta por videochamada + prescricao + autorizacao ANVISA, tudo online.' },
    { p: ['dor','fibromialgia','artrite','reumatismo','inflamacao','neuropatica'], a: '💊 Excelentes resultados para dor cronica, fibromialgia, artrite e dores neuropaticas. Quer uma avaliacao gratuita?' },
    { p: ['ansiedade','estresse','panico','transtorno'], a: '🧘 Amplamente estudado para ansiedade. Melhora nas primeiras 2 a 4 semanas. Posso te ajudar a agendar uma avaliacao?' },
    { p: ['insonia','sono','dormir','despertar'], a: '😴 Otimos resultados para disturbios do sono. Quer saber se e indicado para voce?' },
    { p: ['depressao','depressivo','tristeza','antidepressivo'], a: '💙 Estudado como complemento no tratamento da depressao. Deve ser acompanhado por medico. Posso te conectar?' }
  ];

  var lead = { name: '', whatsapp: '', condition: '', qualified: false };
  var state = 'greeting';

  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  function rag(m) {
    m = norm(m);
    for (var i = 0; i < FAQS.length; i++)
      for (var j = 0; j < FAQS[i].p.length; j++)
        if (m.includes(FAQS[i].p[j])) return FAQS[i].a;
    return null;
  }

  // Estilos
  var css = document.createElement('style');
  css.textContent = '@keyframes lp{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}} @keyframes lsu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes ld1{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}} @keyframes ld2{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}} @keyframes ld3{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}} #lbtn:hover{transform:scale(1.08)!important} #lmsgs::-webkit-scrollbar{width:4px} #lmsgs::-webkit-scrollbar-thumb{background:rgba(0,0,0,.2);border-radius:2px}';
  document.head.appendChild(css);

  // HTML
  var wrap = document.createElement('div');
  wrap.id = 'luna-widget';
  wrap.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:99999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;';
  wrap.innerHTML =
    '<div id="lbtn" style="width:60px;height:60px;background:' + LUNA_GREEN + ';border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 20px rgba(52,149,136,.5);transition:transform .2s;position:relative;" title="Fale com a Luna Organics">' +
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.12-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/></svg>' +
      '<div id="lbadge" style="position:absolute;top:-2px;right:-2px;width:18px;height:18px;background:#f44;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;animation:lp 1.5s infinite;">1</div>' +
    '</div>' +
    '<div id="lwin" style="display:none;position:absolute;bottom:74px;right:0;width:360px;background:#fff;border-radius:16px;box-shadow:0 8px 40px rgba(0,0,0,.18);overflow:hidden;flex-direction:column;animation:lsu .3s ease;">' +
      '<div style="background:' + LUNA_GREEN + ';padding:14px 16px;display:flex;align-items:center;gap:12px;">' +
        '<div style="width:42px;height:42px;background:rgba(255,255,255,.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;">🌿</div>' +
        '<div style="flex:1"><div style="color:#fff;font-weight:700;font-size:15px;">Luna Organics</div><div style="color:rgba(255,255,255,.85);font-size:12px;display:flex;align-items:center;gap:4px;"><span style="width:8px;height:8px;background:#4ade80;border-radius:50%;display:inline-block;"></span>Online agora</div></div>' +
        '<button id="lclose" style="background:none;border:none;cursor:pointer;color:#fff;font-size:20px;padding:4px;opacity:.8;line-height:1;">✕</button>' +
      '</div>' +
      '<div id="lmsgs" style="overflow-y:auto;padding:16px 12px;background:#f0f4f2;display:flex;flex-direction:column;gap:8px;height:360px;"></div>' +
      '<div id="lqr" style="padding:8px 12px;background:#f0f4f2;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid rgba(0,0,0,.06);min-height:10px;"></div>' +
      '<div style="padding:10px 12px;background:#fff;display:flex;align-items:center;gap:8px;border-top:1px solid #eee;">' +
        '<input id="linp" type="text" placeholder="Digite sua mensagem..." style="flex:1;border:none;outline:none;background:#f4f4f4;border-radius:24px;padding:10px 16px;font-size:14px;color:#333;"/>' +
        '<button id="lsend" style="width:40px;height:40px;background:' + LUNA_GREEN + ';border:none;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;"><svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg></button>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  // Funcoes de mensagem
  function addm(t, tp, d) {
    d = d || 0;
    setTimeout(function () {
      var e = document.getElementById('lmsgs'), v = document.createElement('div');
      v.style.cssText = 'display:flex;justify-content:' + (tp === 'u' ? 'flex-end' : 'flex-start') + ';margin:2px 0;';
      v.innerHTML = '<div style="max-width:82%;background:' + (tp === 'u' ? LUNA_GREEN : '#fff') + ';color:' + (tp === 'u' ? '#fff' : '#1a1a1a') + ';padding:10px 14px;border-radius:' + (tp === 'u' ? '16px 4px 16px 16px' : '4px 16px 16px 16px') + ';font-size:13.5px;line-height:1.5;box-shadow:0 1px 4px rgba(0,0,0,.1);word-wrap:break-word;">' + t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') + '</div>';
      e.appendChild(v); e.scrollTop = e.scrollHeight;
    }, d);
  }

  function typ() {
    var e = document.getElementById('lmsgs'), d = document.createElement('div');
    d.id = 'ltyp'; d.style.cssText = 'display:flex;justify-content:flex-start;margin:2px 0;';
    d.innerHTML = '<div style="background:#fff;padding:12px 16px;border-radius:4px 16px 16px 16px;box-shadow:0 1px 4px rgba(0,0,0,.1);"><div style="display:flex;gap:4px;align-items:center;"><span style="width:7px;height:7px;background:#aaa;border-radius:50%;animation:ld1 1.2s infinite;"></span><span style="width:7px;height:7px;background:#aaa;border-radius:50%;animation:ld2 1.2s infinite .2s;"></span><span style="width:7px;height:7px;background:#aaa;border-radius:50%;animation:ld3 1.2s infinite .4s;"></span></div></div>';
    e.appendChild(d); e.scrollTop = e.scrollHeight;
  }

  function bot(t, d) {
    d = d || 800; typ();
    setTimeout(function () { var x = document.getElementById('ltyp'); if (x) x.remove(); addm(t, 'b'); }, d);
  }

  function setqr(opts) {
    var e = document.getElementById('lqr'); e.innerHTML = '';
    opts.forEach(function (o) {
      var b = document.createElement('button');
      b.textContent = o;
      b.style.cssText = 'background:#fff;border:1.5px solid ' + LUNA_GREEN + ';color:' + LUNA_GREEN + ';border-radius:20px;padding:6px 14px;font-size:12.5px;cursor:pointer;font-weight:500;transition:all .15s;';
      b.onmouseover = function () { b.style.background = LUNA_GREEN; b.style.color = '#fff'; };
      b.onmouseout = function () { b.style.background = '#fff'; b.style.color = LUNA_GREEN; };
      b.onclick = function () { go(o); };
      e.appendChild(b);
    });
  }

  function showCTA() {
    var e = document.getElementById('lmsgs'), qe = document.getElementById('lqr');
    qe.innerHTML = '';
    var wm = encodeURIComponent('Ola! Me chamo ' + lead.name + ' e tenho interesse em tratamento CBD para ' + lead.condition + '. WhatsApp: ' + lead.whatsapp);
    var d = document.createElement('div'); d.style.padding = '8px 0';
    d.innerHTML = '<a href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + wm + '" target="_blank" style="display:flex;align-items:center;justify-content:center;gap:10px;background:#25D366;color:#fff;text-decoration:none;padding:12px 20px;border-radius:12px;font-size:14px;font-weight:700;box-shadow:0 3px 12px rgba(37,211,102,.4);">📲 Falar com especialista agora</a>';
    e.appendChild(d); e.scrollTop = e.scrollHeight;
    var cb = document.createElement('button');
    cb.textContent = '💬 Tenho mais duvidas';
    cb.style.cssText = 'background:#fff;border:1.5px solid ' + LUNA_GREEN + ';color:' + LUNA_GREEN + ';border-radius:20px;padding:6px 14px;font-size:12.5px;cursor:pointer;font-weight:500;';
    cb.onclick = function () { qe.innerHTML = ''; state = 'chatting'; bot('Claro! Como posso te ajudar? 😊', 400); setqr(['O que e CBD?', 'Como funciona?', 'Entrega', 'Precos']); };
    qe.appendChild(cb);
  }

  // Fluxo de qualificacao
  function flow(t) {
    if (state === 'collecting_name') {
      if (t.trim().length < 2) { bot('Pode me informar seu nome completo? 😊'); return; }
      lead.name = t.trim(); state = 'collecting_condition';
      bot('Prazer, ' + lead.name + '! 🌿 Qual condicao voce busca tratar com CBD?', 800);
      setTimeout(function () { setqr(['Ansiedade', 'Insonia', 'Dor cronica', 'Depressao', 'Fibromialgia', 'Outra']); }, 1200);
      return;
    }
    if (state === 'collecting_condition') {
      lead.condition = t.trim(); state = 'collecting_whatsapp';
      bot('Entendido! Trabalhamos com ' + t + ' e temos otimos resultados. 💪 Qual seu WhatsApp?', 900);
      return;
    }
    if (state === 'collecting_whatsapp') {
      if (t.replace(/\D/g, '').length < 10) { bot('Por favor, informe um WhatsApp valido com DDD. Ex: (11) 99999-9999'); return; }
      lead.whatsapp = t.trim(); lead.qualified = true; state = 'qualified';
      document.dispatchEvent(new CustomEvent('luna:lead_qualified', { detail: lead }));
      console.log('LUNA_LEAD:', JSON.stringify(lead));
      bot('Perfeito, ' + lead.name + '! 🎉 Suas informacoes foram registradas. Um especialista vai entrar em contato pelo WhatsApp *' + lead.whatsapp + '* em ate 2 horas. Se preferir falar agora:', 1000);
      setTimeout(showCTA, 2200);
      return;
    }
  }

  // Handler principal
  function go(text) {
    if (!text.trim()) return;
    document.getElementById('linp').value = '';
    document.getElementById('lqr').innerHTML = '';
    addm(text, 'u');
    if (['collecting_name', 'collecting_condition', 'collecting_whatsapp'].indexOf(state) >= 0) { flow(text); return; }
    var r = rag(text);
    if (r) {
      bot(r, 900);
      if (!lead.qualified) {
        setTimeout(function () {
          bot('Posso te conectar com um especialista para avaliacao gratuita! 👨‍⚕️', 2200);
          setTimeout(function () { setqr(['Sim, quero falar com especialista!', 'Tenho mais duvidas']); }, 3000);
        }, 1500);
      } else {
        setTimeout(function () { setqr(['O que e CBD?', 'Como funciona?', 'Entrega', 'Duvidas']); }, 2000);
      }
    } else {
      var tl = text.toLowerCase();
      if (!lead.qualified && (tl.includes('sim') || tl.includes('quero') || tl.includes('especialista') || tl.includes('falar'))) {
        state = 'collecting_name'; bot('Otimo! Qual o seu nome? 😊', 800); return;
      }
      bot('Para te ajudar melhor, posso conectar com um especialista Luna Organics. 🌿', 900);
      setTimeout(function () {
        if (!lead.qualified) { state = 'collecting_name'; bot('Qual o seu nome?', 700); }
        else { setqr(['O que e CBD?', 'Como funciona?', 'Entrega']); }
      }, 2000);
    }
  }

  // Abrir chat
  function open() {
    var win = document.getElementById('lwin');
    win.style.display = 'flex'; win.style.flexDirection = 'column';
    document.getElementById('lbadge').style.display = 'none';
    if (state === 'greeting') {
      state = 'collecting_name';
      setTimeout(function () { addm('Ola! 👋 Seja bem-vindo(a) a Luna Organics!', 'b'); }, 400);
      setTimeout(function () { addm('Somos especialistas em tratamentos com CBD, 100% regulamentados pela ANVISA e CFM. 🌿', 'b'); }, 1400);
      setTimeout(function () { addm('Antes de continuar, qual o seu nome?', 'b'); }, 2400);
    }
  }

  // Eventos
  document.getElementById('lbtn').addEventListener('click', open);
  document.getElementById('lclose').addEventListener('click', function () { document.getElementById('lwin').style.display = 'none'; });
  document.getElementById('lsend').addEventListener('click', function () { go(document.getElementById('linp').value); });
  document.getElementById('linp').addEventListener('keypress', function (e) { if (e.key === 'Enter') go(document.getElementById('linp').value); });

})();
