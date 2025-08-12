/* ======= script.js ======= */

/* senha / entrada */
function verificarSenha() {
  const senha = document.getElementById("senha").value;
  const erro = document.getElementById("erro");

  if (senha === "040739") {
    document.getElementById("porta").style.display = "none";
    document.getElementById("sala").style.display = "block";
    // remover mensagem de erro caso houvesse
    if (erro) { erro.textContent = ""; }
  } else {
    if (erro) {
      erro.textContent = "Acesso negado. Sua identidade não foi reconhecida.";
      erro.style.color = "#ff6b6b";
    }
  }
}

/* atalho: pressionar Enter também chama verificarSenha() */
document.getElementById("senha").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // evita recarregar
    verificarSenha();
  }
});

/* --- cria (se não existir) o overlay que vamos usar para mostrar documentos em modal --- */
(function ensureOverlay(){
  if (!document.getElementById('overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.className = 'overlay';
    overlay.setAttribute('aria-hidden','true');
    document.body.appendChild(overlay);

    // fecha ao clicar fora do documento
    overlay.addEventListener('click', function(e){
      if (e.target === overlay) {
        // fecha qualquer documento aberto
        document.querySelectorAll('.pagina-relatorio, .documento').forEach(function(el){
          el.style.display = 'none';
        });
        overlay.classList.remove('active');
        // volta pra sala
        const sala = document.getElementById('sala');
        if (sala) sala.style.display = 'block';
        document.body.style.overflow = '';
      }
    });
  }
})();

/* --- abre relatório: mostra overlay + documento (modal) --- */
/* --- abre relatório: mostra overlay + documento (modal) --- */
window.currentOpenRel = null;     // id do relatório atualmente aberto
window._mobileEdgeHandler = null; // handle pra remover depois

function abrirRelatorio(id) {
  // fechar qualquer relatório aberto
  document.querySelectorAll('.pagina-relatorio, .documento').forEach(function(el){
    el.style.display = 'none';
  });

  // esconder a sala (visual)
  const sala = document.getElementById('sala');
  if (sala) sala.style.display = 'none';

  // mostra overlay
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden','false');
  }

  // mostrar o relatório escolhido
  const rel = document.getElementById(id);
  if (rel) {
    if (!rel.classList.contains('documento')) rel.classList.add('documento');
    rel.style.display = 'block';

    // garantir que o relatório esteja "acima" (z-index)
    rel.style.zIndex = '10000';

    // travar scroll do body (fundo)
    document.body.style.overflow = 'hidden';
    window.currentOpenRel = id;

    // adicionar comportamento de fechar ao clicar nas bordas APENAS em telas pequenas
    addMobileEdgeClose();
    // rolar ao topo pra evitar posições estranhas
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    console.warn('Relatório não encontrado: ' + id);
    if (overlay) overlay.classList.remove('active');
    if (sala) sala.style.display = 'block';
    document.body.style.overflow = '';
  }
}

/* --- fecha relatório e volta pra sala --- */
function fecharRelatorio(id) {
  // esconder relatório
  const rel = document.getElementById(id);
  if (rel) rel.style.display = 'none';

  // remove comportamento mobile
  removeMobileEdgeClose();

  // fecha overlay
  const overlay = document.getElementById('overlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden','true');
  }

  // volta pra sala
  const sala = document.getElementById('sala');
  if (sala) sala.style.display = 'block';

  // liberar scroll
  document.body.style.overflow = '';
  window.currentOpenRel = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --- função que adiciona listener para fechar ao tocar nas bordas do ecrã (mobile) --- */
function addMobileEdgeClose() {
  // remove caso já exista
  removeMobileEdgeClose();

  // só ativa em telas pequenas (ajuste o valor se quiser)
  if (window.innerWidth > 700) return;

  const handler = function(e) {
    // pega coords do clique/toque (suporta touch e click)
    let x = 0, y = 0;
    if (e.changedTouches && e.changedTouches.length) {
      x = e.changedTouches[0].clientX;
      y = e.changedTouches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 60; // distância da borda para considerar "clique na borda"

    // se o toque/click ocorreu próximo das bordas -> fechar
    if (x < margin || x > (w - margin) || y < margin || y > (h - margin)) {
      if (window.currentOpenRel) {
        fecharRelatorio(window.currentOpenRel);
      }
    }
  };

  // salva handler global pra remover depois
  window._mobileEdgeHandler = handler;
  // usar touchend e click pra compatibilidade
  document.addEventListener('touchend', handler, { passive: true });
  document.addEventListener('click', handler);
}

/* --- remove handler mobile se existir --- */
function removeMobileEdgeClose() {
  if (window._mobileEdgeHandler) {
    document.removeEventListener('touchend', window._mobileEdgeHandler);
    document.removeEventListener('click', window._mobileEdgeHandler);
    window._mobileEdgeHandler = null;
  }
}

/* --- mantém o clique no overlay (fora do documento) fechando a modal também --- */
(function ensureOverlayClickClose(){
  const overlay = document.getElementById('overlay');
  if (!overlay) return;
  overlay.addEventListener('click', function(e){
    if (e.target === overlay) {
      // fechar qualquer relatório aberto
      document.querySelectorAll('.pagina-relatorio, .documento').forEach(function(el){
        el.style.display = 'none';
      });
      overlay.classList.remove('active');
      const sala = document.getElementById('sala');
      if (sala) sala.style.display = 'block';
      document.body.style.overflow = '';
      removeMobileEdgeClose();
      window.currentOpenRel = null;
    }
  });
})();


  // mostra o relatório escolhido
  const rel = document.getElementById(id);
  if (rel) {
    // se o bloco não tiver a classe .documento, aplica para estilizar como modal
    if (!rel.classList.contains('documento')) rel.classList.add('documento');
    rel.style.display = 'block';
    // garantir que o documento esteja filho do overlay visualmente (apenas para garantir posicionamento)
    // (não remove do DOM, apenas empilha visualmente por z-index)
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // travar scroll de fundo
    document.body.style.overflow = 'hidden';
  } else {
    console.warn('Relatório não encontrado:', id);
    // fecha overlay se nada encontrado
    if (overlay) overlay.classList.remove('active');
    if (sala) sala.style.display = 'block';
    document.body.style.overflow = '';
  }
}

  // volta pra sala
  const sala = document.getElementById('sala');
  if (sala) sala.style.display = 'block';

  // liberar scroll
  document.body.style.overflow = '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --- atalhos: ESC fecha modal --- */
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') {
    // fecha todos os relatórios abertos (se houver)
    document.querySelectorAll('.pagina-relatorio, .documento').forEach(function(el){
      el.style.display = 'none';
    });
    const overlay = document.getElementById('overlay');
    if (overlay) overlay.classList.remove('active');
    const sala = document.getElementById('sala');
    if (sala) sala.style.display = 'block';
    document.body.style.overflow = '';
  }
});
// frases do Guardião — clique pra ele "falar"
const guardiaoFrases = [
  "Nada escapa do meu olhar.",
  "Estou à sua disposição.",
  "Organizar é meu nome do meio. E, de nada.",
  "Nada sumiu. Nada que você precise saber.",
  "Toque com cuidado. O segredo não gosta de ruído."
];

function guardiaoFala() {
  const el = document.getElementById('guardiao-frase');
  if (!el) return;
  const idx = Math.floor(Math.random() * guardiaoFrases.length);
  el.style.transform = 'translateY(-4px)';
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = guardiaoFrases[idx];
    el.style.transform = 'translateY(0)';
    el.style.opacity = '1';
  }, 160);
}
