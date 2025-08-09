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
function abrirRelatorio(id) {
  // esconder todos os relatórios por segurança
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

/* --- fecha relatório e volta pra sala --- */
function fecharRelatorio(id) {
  const rel = document.getElementById(id);
  if (rel) rel.style.display = 'none';

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
