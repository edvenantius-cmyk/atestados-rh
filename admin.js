const SENHA_CORRETA = 'guitar182';
let todosAtestados = [];
let unsubscribe = null;

// Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const senha = document.getElementById('senha').value;
    const erro = document.getElementById('loginError');
    
    if (senha === SENHA_CORRETA) {
        sessionStorage.setItem('rh_autenticado', 'true');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').classList.add('show');
        iniciarSincronizacao();
    } else {
        erro.textContent = '❌ Senha incorreta. Tente novamente.';
        erro.classList.add('show');
        document.getElementById('senha').value = '';
        document.getElementById('senha').focus();
        
        setTimeout(() => {
            erro.classList.remove('show');
        }, 3000);
    }
});

// Verificar autenticação
window.addEventListener('load', () => {
    // Adicionar um pequeno delay para garantir que window.firebaseImports esteja totalmente pronto
    setTimeout(() => { 
        if (sessionStorage.getItem('rh_autenticado') === 'true') {
            document.getElementById('loginScreen').style.display = 'none';
            document.getElementById('adminPanel').classList.add('show');
            iniciarSincronizacao();
        }
    }, 100); // 100ms de delay
});

// Logout
function logout() {Sem resposta
