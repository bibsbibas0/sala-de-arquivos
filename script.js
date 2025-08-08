function verificarSenha() {
    let senha = document.getElementById("senha").value;
    let erro = document.getElementById("erro");

    if(senha === "1891") { // senha secreta
        document.getElementById("porta").style.display = "none";
        document.getElementById("sala").style.display = "block";
    } else {
        erro.textContent = "Senha incorreta!";
        erro.style.color = "red";
    }
}
