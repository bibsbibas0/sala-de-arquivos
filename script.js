function verificarSenha() {
    let senha = document.getElementById("senha").value;
    let erro = document.getElementById("erro");

    if(senha === "0407") { // senha secreta
        document.getElementById("porta").style.display = "none";
        document.getElementById("sala").style.display = "block";
    } else {
        erro.textContent = "Senha incorreta!";
        erro.style.color = "red";
    }
}
function abrirRelatorio(id) {
    document.getElementById("sala").style.display = "none";
    document.getElementById(id).style.display = "block";
}

function fecharRelatorio(id) {
    document.getElementById(id).style.display = "none";
    document.getElementById("sala").style.display = "block";
}
