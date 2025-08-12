/* script.js (VERSÃO ESTÁVEL - substituir TODO o arquivo) */

/* ======== Configurações ======== */
/* Senhas válidas (adicione/remova strings conforme quiser) */
const SENHAS_VALIDAS = ["040739", "0407", "leandro09", "1891"];

/* ======== Função de verificação de senha (global) ======== */
window.verificarSenha = function() {
  const senhaEl = document.getElementById("senha");
  const erro = document.getElementById("erro");
  const porta = document.getElementById("porta");
  const sala = document.getElementById("sala");
  const senha = senhaEl ? senhaEl.value.trim() : "";

  if (SENHAS_VALIDAS.includes(senha)) {
    if (porta) porta.style.display = "none";
    if (sala) sala.style.display = "block";
    if (erro) erro.textContent = "";
  } else {
    if (erro) {
      erro.textContent = "Acesso negado. Sua identidade não foi reconhecida.";
      erro.style.color = "#ff6b6b";
    }
  }
};

/* ======== Estado global ======== */
window.currentOpenRel = null;
window._mobileEdgeHandler = null;

/* ======== Overlay (cria se não existir) ======== */
function ensureOverlay() {
  if (!document.getElementById("overlay")) {
    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.className = "overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.setAttribute("role", "presentation");
    document.body.appendChild(overlay);

    // clicar fora do documento fecha
    overlay.addEventListener("click", function(e) {
      if (e.target === overlay) {
        if (window.currentOpenRel) {
          fecharRelatorio(window.currentOpenRel);
        } else {
          overlay.classList.remove("active");
          overlay.setAttribute("aria-hidden", "true");
          document.body.style.overflow = "";
        }
      }
    });
  }
}

/* ======== Abrir relatório (move para overlay e permite scroll interno) ======== */
window.abrirRelatorio = function(id) {
  // esconder quaisquer relatórios visíveis
  document.querySelectorAll(".pagina-relatorio, .documento").forEach(el => {
    el.style.display = "none";
  });

  const sala = document.getElementById("sala");
  if (sala) sala.style.display = "none";

  ensureOverlay();
  const overlay = document.getElementById("overlay");
  if (!overlay) {
    console.error("Overlay não encontrado.");
    if (sala) sala.style.display = "block";
    return;
  }

  const rel = document.getElementById(id);
  if (!rel) {
    console.warn("Relatório não encontrado:", id);
    if (overlay) {
      overlay.classList.remove("active");
      overlay.setAttribute("aria-hidden", "true");
    }
    if (sala) sala.style.display = "block";
    return;
  }

  // salvar local original para restaurar depois
  if (!rel._originalPlace) {
    rel._originalPlace = {
      parent: rel.parentNode,
      nextSibling: rel.nextSibling
    };
  }

  // mover para overlay
  overlay.appendChild(rel);

  // garantir estilo modal
  rel.classList.add("documento");
  rel.style.display = "block";
  rel.style.position = "relative";
  rel.style.margin = "0 auto";
  rel.style.zIndex = "10000";

  // bloquear scroll do body (fundo) e ativar overlay
  document.body.style.overflow = "hidden";
  overlay.classList.add("active");
  overlay.setAttribute("aria-hidden", "false");

  // salvar estado e ativar fechar por borda no mobile
  window.currentOpenRel = id;
  addMobileEdgeClose();

  // forçar scroll pro topo do próprio documento
  rel.scrollTop = 0;
};

/* ======== Fechar relatório (restaura elemento) ======== */
window.fecharRelatorio = function(id) {
  const rel = document.getElementById(id);
  const overlay = document.getElementById("overlay");

  if (rel) {
    rel.style.display = "none";
    rel.style.zIndex = "";
    rel.style.position = "";
    rel.style.margin = "";
    // restaurar no DOM original
    if (rel._originalPlace && rel._originalPlace.parent) {
      const parent = rel._originalPlace.parent;
      const next = rel._originalPlace.nextSibling;
      if (next && next.parentNode === parent) parent.insertBefore(rel, next);
      else parent.appendChild(rel);
    }
  }

  removeMobileEdgeClose();

  if (overlay) {
    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");
  }

  const sala = document.getElementById("sala");
  if (sala) sala.style.display = "block";

  document.body.style.overflow = "";
  window.currentOpenRel = null;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/* ======== Mobile: fechar ao tocar borda ======== */
function addMobileEdgeClose() {
  removeMobileEdgeClose();
  if (window.innerWidth > 700) return; // só mobile

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
    const margin = 60;

    if (x < margin || x > (w - margin) || y < margin || y > (h - margin)) {
      if (window.currentOpenRel) fecharRelatorio(window.currentOpenRel);
    }
  };

  window._mobileEdgeHandler = handler;
  document.addEventListener("touchend", handler, { passive: true });
  document.addEventListener("click", handler);
}

function removeMobileEdgeClose() {
  if (window._mobileEdgeHandler) {
    document.removeEventListener("touchend", window._mobileEdgeHandler);
    document.removeEventListener("click", window._mobileEdgeHandler);
    window._mobileEdgeHandler = null;
  }
}

/* ======== Teclas globais: ESC fecha ======== */
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    if (window.currentOpenRel) {
      fecharRelatorio(window.currentOpenRel);
    } else {
      // fallback
      document.querySelectorAll(".pagina-relatorio, .documento").forEach(el => el.style.display = "none");
      const overlay = document.getElementById("overlay");
      if (overlay) overlay.classList.remove("active");
      const sala = document.getElementById("sala");
      if (sala) sala.style.display = "block";
      document.body.style.overflow = "";
    }
  }
});

/* ======== Guardião (frases) ======== */
const guardiaoFrases = [
  "Nada escapa do meu olhar.",
  "Estou à sua disposição.",
  "Organizar é meu nome do meio. E, de nada.",
  "Nada sumiu. Nada que você precise saber.",
  "Toque com cuidado. O segredo não gosta de ruído."
];

window.guardiaoFala = function() {
  const el = document.getElementById("guardiao-frase");
  if (!el) return;
  const idx = Math.floor(Math.random() * guardiaoFrases.length);
  el.style.transform = "translateY(-4px)";
  el.style.opacity = "0";
  setTimeout(() => {
    el.textContent = guardiaoFrases[idx];
    el.style.transform = "translateY(0)";
    el.style.opacity = "1";
  }, 160);
};

/* ======== Inicialização (após DOM) ======== */
document.addEventListener("DOMContentLoaded", function() {
  ensureOverlay();

  const senhaEl = document.getElementById("senha");
  if (senhaEl) {
    senhaEl.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        window.verificarSenha();
      }
    });
  }
});
