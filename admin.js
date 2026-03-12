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
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        if (unsubscribe) unsubscribe();
        sessionStorage.removeItem('rh_autenticado');
        location.reload();
    }
}

// Iniciar sincronização em tempo real
function iniciarSincronizacao() {
    // Desestruturamos 'db' e as funções do Firestore de 'window.firebaseImports'
    const { db, collection, query, orderBy, onSnapshot } = window.firebaseImports;
    
    // Adicionar uma verificação para garantir que 'db' e as funções existem antes de usar
    if (!db || !collection || !query || !orderBy || !onSnapshot) {
        console.error("Firebase Firestore não está totalmente carregado ou as funções necessárias não foram expostas.");
        alert("Erro ao iniciar sincronização: Falta configuração do Firebase.");
        return;
    }

    const q = query(collection(db, 'atestados'), orderBy('dataEnvio', 'desc'));
    
    unsubscribe = onSnapshot(q, 
        (snapshot) => { // Callback de sucesso
            todosAtestados = [];
            snapshot.forEach((doc) => {
                todosAtestados.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            atualizarEstatisticas();
            renderizarTabela(todosAtestados);
        },
        (error) => { // Callback de erro
            console.error("Erro ao sincronizar atestados do Firestore:", error);
            alert("Erro ao carregar documentos: " + error.message);
        }
    );
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    const total = todosAtestados.length;
    const novos = todosAtestados.filter(a => a.status === 'novo').length;
    const vistos = todosAtestados.filter(a => a.status === 'visto').length;
    const cerests = todosAtestados.filter(a => a.tipo === 'cerest').length;
    const acidentes = todosAtestados.filter(a => a.tipo === 'acidente').length;
    
    document.getElementById('statsContainer').innerHTML = `
        <div class="stat-card blue">
            <div class="number">${total}</div>
            <div class="label">Total de Documentos</div>
        </div>
        <div class="stat-card orange">
            <div class="number">${novos}</div>
            <div class="label">Novos (não vistos)</div>
        </div>
        <div class="stat-card green">
            <div class="number">${vistos}</div>
            <div class="label">Vistos</div>
        </div>
        <div class="stat-card red">
            <div class="number">${cerests + acidentes}</div>
            <div class="label">CEREST/Acidentes</div>
        </div>
    `;
}

// Renderizar tabela
function renderizarTabela(atestados) {
    const tbody = document.getElementById('tabelaAtestados');
    
    if (atestados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <p style="font-size: 18px; margin-bottom: 10px;">📭 Nenhum documento encontrado</p>
                        <p style="font-size: 14px;">Os documentos enviados pelos colaboradores aparecerão aqui automaticamente.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = atestados.map(atestado => {
        const data = atestado.dataEnvio && atestado.dataEnvio.toDate ? 
            new Date(atestado.dataEnvio.toDate()).toLocaleString('pt-BR') : 
            'Aguardando...';
        
        const tipoClass = atestado.tipo;
        const tipoLabel = {
            'atestado': 'Atestado Médico',
            'cerest': 'CEREST',
            'acidente': 'Acidente',
            'outro': 'Outro'
        }[atestado.tipo] || atestado.tipo;
        
        const statusClass = atestado.status || 'novo';
        const statusLabel = statusClass === 'novo' ? 'Novo' : 'Visto';
        
        return `
            <tr>
                <td><strong>${atestado.nome}</strong></td>
                <td><span class="badge ${tipoClass}">${tipoLabel}</span></td>
                <td>
                    ${atestado.cid !== 'Não informado' ? 
                        `<strong>${atestado.cid}</strong><br><small style="color: #6B7280;">${atestado.cidDescricao}</small>` 
                        : '<span style="color: #9CA3AF;">Não informado</span>'}
                </td>
                <td>${data}</td>
                <td><span class="badge ${statusClass}">${statusLabel}</span></td>
                <td style="white-space: nowrap;">
                    <button class="btn-action btn-view" onclick='verDetalhes("${atestado.id}")' title="Ver detalhes">
                        👁️ Ver
                    </button>
                    <button class="btn-action btn-download" onclick='baixarArquivo("${atestado.id}")' title="Baixar arquivo">
                        ⬇️ Baixar
                    </button>
                    <button class="btn-action btn-delete" onclick='excluirAtestado("${atestado.id}")' title="Excluir">
                        🗑️ Excluir
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Filtrar atestados
function filtrarAtestados() {
    const tipo = document.getElementById('filtroTipo').value;
    const status = document.getElementById('filtroStatus').value;
    const busca = document.getElementById('buscaNome').value.toLowerCase();
    
    let filtrados = todosAtestados;
    
    if (tipo) filtrados = filtrados.filter(a => a.tipo === tipo);
    if (status) filtrados = filtrados.filter(a => (a.status || 'novo') === status);
    if (busca) filtrados = filtrados.filter(a => a.nome.toLowerCase().includes(busca));
    
    renderizarTabela(filtrados);
}

// Ver detalhes
async function verDetalhes(id) {
    const atestado = todosAtestados.find(a => a.id === id);
    if (!atestado) return;
    
    // Marcar como visto
    const { db, doc, updateDoc } = window.firebaseImports;
    
    try {
        await updateDoc(doc(db, 'atestados', id), {
            status: 'visto'
        });
    } catch (error) {
        console.error('Erro ao marcar como visto:', error);
    }
    
    const data = atestado.dataEnvio && atestado.dataEnvio.toDate ? 
        new Date(atestado.dataEnvio.toDate()).toLocaleString('pt-BR') : 
        'Aguardando...';
    
    const tipoLabel = {
        'atestado': 'Atestado Médico',
        'cerest': 'CEREST (Acidente de Trabalho)',
        'acidente': 'Comunicação de Acidente',
        'outro': 'Outro'
    }[atestado.tipo] || atestado.tipo;
    
    const tamanhoMB = (atestado.arquivoTamanho / (1024 * 1024)).toFixed(2);
    
    let visualizador = '';
    
    if (atestado.arquivoTipo === 'application/pdf') {
        visualizador = `
            <div class="file-viewer">
                <iframe src="${atestado.arquivoURL}"></iframe>
            </div>
        `;
    } else if (atestado.arquivoTipo.startsWith('image/')) {
        visualizador = `
            <div class="file-viewer">
                <img src="${atestado.arquivoURL}" alt="Documento">
            </div>
        `;
    }
    
    document.getElementById('modalBody').innerHTML = `
        <div class="info-grid">
            <div class="info-item">
                <div class="label">Colaborador</div>
                <div class="value">${atestado.nome}</div>
            </div>
            <div class="info-item">
                <div class="label">Tipo de Documento</div>
                <div class="value">${tipoLabel}</div>
            </div>
            <div class="info-item">
                <div class="label">CID</div>
                <div class="value">${atestado.cid}</div>
            </div>
            <div class="info-item">
                <div class="label">Descrição do CID</div>
                <div class="value">${atestado.cidDescricao}</div>
            </div>
            <div class="info-item">
                <div class="label">Data de Envio</div>
                <div class="value">${data}</div>
            </div>
            <div class="info-item">
                <div class="label">Arquivo</div>
                <div class="value">${atestado.arquivoNome} (${tamanhoMB} MB)</div>
            </div>
        </div>
        
        <h3 style="margin-top: 20px; margin-bottom: 10px;">📄 Visualização do Documento</h3>
        ${visualizador}
        
        <div style="margin-top: 20px; display: flex; gap: 10px;">
            <button class="btn-action btn-download" onclick='baixarArquivo("${atestado.id}")' 
                    style="flex: 1; padding: 12px;">
                ⬇️ Baixar Arquivo
            </button>
            <button class="btn-action btn-delete" onclick='excluirAtestado("${atestado.id}")' 
                    style="flex: 1; padding: 12px;">
                🗑️ Excluir
            </button>
        </div>
    `;
    
    document.getElementById('modalDetalhes').classList.add('show');
}

// Fechar modal
function fecharModal() {
    Sem resposta
