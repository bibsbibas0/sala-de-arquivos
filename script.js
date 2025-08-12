/* ======= script.js (versão corrigida e completa) ======= */

/* ---------------- senha / entrada ---------------- */
function verificarSenha() {
  const senhaEl = document.getElementById("senha");
  const erro = document.getElementById("erro");
  const senha = senhaEl ? senhaEl.value : "";

  // senha atual (mantive a que você tinha)
  if (senha === "040739") {
    const porta = document.getElementById("porta");
    const sala = document.getElementById("sala");
    if (porta) porta.style.display = "none";
    if (sala) sala.style.display = "block";
    if (erro) erro.textContent = "";
  } else {
    if (erro) {
      erro.textContent = "Acesso negado. Sua identidade não foi reconhecida.";
      erro.style.color = "#ff6b6b";
    }
  }
}

/* ---------------- utilitários / estado global ---------------- */
window.currentOpenRel = null;     // id do relatório atualmente aberto
window._mobileEdgeHandler = null; // handler para remover depois

/* ---------------- cria overlay (se não existir) ---------------- */
function ensureOverlay() {
  if (!document.getElementById('overlay')) {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.className = 'overlay';
    overlay.setAttribute('aria-hidden','true');
    // role para acessibilidade
    overlay.setAttribute('role','dialog');
    overlay.style.display = ''; // respeitar CSS (classe .active controla visibilidade)
    document.body.appendChild(overlay);

    // fechar ao clicar fora do documento (overlay)
    overlay.addEventListener('click', function(e){
      if (e.target === overlay) {
        if (window.currentOpenRel) {
          fecharRelatorio(window.currentOpenRel);
        } else {
          // fallback: esconder modais visíveis
          document.querySelectorAll('.pagina-relatorio, .documento').forEach(function(el){
            el.style.display = 'none';
          });
          overlay.classList.remove('active');
          const sala = document.getElementById('sala');
          if (sala) sala.style.display = 'block';
          document.body.style.overflow = '';
        }
      }
    });
  }
}

/* ---------------- abrir relatório (move para overlay e controla scroll) ---------------- */
function abrirRelatorio(id) {
  // esconder quaisquer relatórios abertos visualmente
  document.querySelectorAll('.pagina-relatorio, .documento').forEach(function(el){
    el.style.display = 'none';
  });

  // esconder a sala (visual)
  const sala = document.getElementById('sala');
  if (sala) sala.style.display = 'none';

  // garantir overlay
  ensureOverlay();
  const overlay = document.getElementById('overlay');
  if (!overlay) {
    console.error('Overlay não encontrado. Abortar abertura de relatório.');
    if (sala) sala.style.display = 'block';
    return;
  }

  // localizar relatório no DOM
  const rel = document.getElementById(id);
  if (!rel) {
    console.warn('Relatório não encontrado:', id);
    overlay.classList.remove('active');
    if (sala) sala.style.display = 'block';
    return;
  }

  // salvar referência do local original para restaurar depois
  if (!rel._originalPlace) {
    rel._originalPlace = {
      parent: rel.parentNode,
      nextSibling: rel.nextSibling
    };
  }

  // mover elemento para dentro do overlay (controla scroll e posicionamento)
  overlay.appendChild(rel);

  // aplicar classes/estilos para modal funcionar
  if (!rel.classList.contains('documento')) rel.classList.add('documento');
  rel.style.display = 'block';
  rel.style.position = 'relative';
  rel.style.margin = '0 auto';
  rel.style.zIndex = '10000';

  // bloquear scroll do body e ativar overlay
  document.body.style.overflow = 'hidden';
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden','false');

  // guardar estado e ativar fechar por borda no mobile
  window.currentOpenRel = id;
  addMobileEdgeClose();
  // forçar scroll to top do documento (visual)
  rel.scrollTop = 0;
}

/* ---------------- fechar relatório (restaura elemento e limpa estado) ---------------- */
function fecharRelatorio(id) {
  const rel = document.getElementById(id);
  const overlay = document.getElementById('overlay');

  if (rel) {
    // esconder e limpar estilos temporários
    rel.style.display = 'none';
    rel.style.zIndex = '';
    rel.style.position = '';
    rel.style.margin = '';
    // restaurar para o local original no DOM (se existia)
    if (rel._originalPlace && rel._originalPlace.parent) {
      const parent = rel._originalPlace.parent;
      const next = rel._originalPlace.nextSibling;
      if (next && next.parentNode === parent) {
        parent.insertBefore(rel, next);
      } else {
        parent.appendChild(rel);
      }
      // mantemos _originalPlace para próximas aberturas
    }
  }

  // remover handler mobile
  removeMobileEdgeClose();

  // esconder overlay
  if (overlay) {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden','true');
  }

  // voltar pra sala e liberar scroll do body
  const sala = document.getElementById('sala');
  if (sala) sala.style.display = 'block';
  document.body.style.overflow = '';
  window.currentOpenRel = null;
  // rolar pra topo do documento principal para evitar posição estranha
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------------- mobile: fechar ao tocar nas bordas (só em telas pequenas) ---------------- */
function addMobileEdgeClose() {
  removeMobileEdgeClose();
  // ativa só em telas pequenas
  if (window.innerWidth > 700) return;

  const handler = function(e) {
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
    const margin = 60; // px da borda para considerar "fechar"

    if (x < margin || x > (w - margin) || y < margin || y > (h - margin)) {
      if (window.currentOpenRel) {
        fecharRelatorio(window.currentOpenRel);
      }
    }
  };

  window._mobileEdgeHandler = handler;
  document.addEventListener('touchend', handler, { passive: true });
  document.addEventListener('click', handler);
}

/* ---------------- remove handler mobile ---------------- */
function removeMobileEdgeClose() {
  if (window._mobileEdgeHandler) {
    documen
