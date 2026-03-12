const SENHA_CORRETA = 'guitar182';
let todosAtestados = [];

// Login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const senha = document.getElementById('senha').value;
    const erro = document.getElementById('loginError');
    
    if (senha === SENHA_CORRETA) {
        // Login bem-sucedido
        sessionStorage.setItem('rh_autenticado', 'true');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').classList.add('show');
        carregarAtestados();
    } else {
        // Senha incorreta
        erro.textContent = '❌ Senha incorreta. Tente novamente.';
        erro.classList.add('show');
        document.getElementById('senha').value = '';
        document.getElementById('senha').focus();
        
        setTimeout(() => {
            erro.classList.remove('show');
        }, 3000);
    }
});

// Verificar se já está autenticado
window.addEventListener('load', () => {
    if (sessionStorage.getItem('rh_autenticado') === 'true') {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminPanel').classList.add('show');
        carregarAtestados();
    }
});

// Logout
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        sessionStorage.removeItem('rh_autenticado');
        location.reload();
    }
}

// Carregar atestados
function carregarAtestados() {
    todosAtestados = JSON.parse(localStorage.getItem('atestados_rh') || '[]');
    atualizarEstatisticas();
    renderizarTabela(todosAtestados);
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    const total = todosAtestados.length;
    const novos = todosAtestados.filter(a => a.status === 'novo').length;
    const vistos = todosAtestados.filter(a => a.status === 'visto').length;
    const atestados = todosAtestados.filter(a => a.tipo === 'atestado').length;
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
                        <p style="font-size: 14px;">Os documentos enviados pelos colaboradores aparecerão aqui.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = atestados
        .sort((a, b) => new Date(b.dataEnvio) - new Date(a.dataEnvio))
        .map(atestado => {
            const data = new Date(atestado.dataEnvio).toLocaleString('pt-BR');
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
                        <button class="btn-action btn-view" onclick='verDetalhes(${JSON.stringify(atestado.id)})' title="Ver detalhes">
                            👁️ Ver
                        </button>
                        <button class="btn-action btn-download" onclick='baixarArquivo(${JSON.stringify(atestado.id)})' title="Baixar arquivo">
                            ⬇️ Baixar
                        </button>
                        <button class="btn-action btn-delete" onclick='excluirAtestado(${JSON.stringify(atestado.id)})' title="Excluir">
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
    
    if (tipo) {
        filtrados = filtrados.filter(a => a.tipo === tipo);
    }
    
    if (status) {
        filtrados = filtrados.filter(a => (a.status || 'novo') === status);
    }
    
    if (busca) {
        filtrados = filtrados.filter(a => a.nome.toLowerCase().includes(busca));
    }
    
    renderizarTabela(filtrados);
}

// Ver detalhes
function verDetalhes(id) {
    const atestado = todosAtestados.find(a => a.id === id);
    if (!atestado) return;
    
    // Marcar como visto
    atestado.status = 'visto';
    localStorage.setItem('atestados_rh', JSON.stringify(todosAtestados));
    atualizarEstatisticas();
    renderizarTabela(todosAtestados);
    
    const data = new Date(atestado.dataEnvio).toLocaleString('pt-BR');
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
                <iframe src="data:application/pdf;base64,${atestado.arquivo}"></iframe>
            </div>
        `;
    } else if (atestado.arquivoTipo.startsWith('image/')) {
        visualizador = `
            <div class="file-viewer">
                <img src="data:${atestado.arquivoTipo};base64,${atestado.arquivo}" alt="Arquivo">
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
            <button class="btn-action btn-download" onclick='baixarArquivo(${JSON.stringify(atestado.id)})' 
                    style="flex: 1; padding: 12px;">
                ⬇️ Baixar Arquivo
            </button>
            <button class="btn-action btn-delete" onclick='excluirAtestado(${JSON.stringify(atestado.id)})' 
                    style="flex: 1; padding: 12px;">
                🗑️ Excluir
            </button>
        </div>
    `;
    
    document.getElementById('modalDetalhes').classList.add('show');
}

// Fechar modal
function fecharModal() {
    document.getElementById('modalDetalhes').classList.remove('show');
}

// Fechar modal ao clicar fora
document.getElementById('modalDetalhes').addEventListener('click', function(e) {
    if (e.target === this) {
        fecharModal();
    }
});

// Baixar arquivo
function baixarArquivo(id) {
    const atestado = todosAtestados.find(a => a.id === id);
    if (!atestado) return;
    
    const link = document.createElement('a');
    link.href = `data:${atestado.arquivoTipo};base64,${atestado.arquivo}`;
    link.download = atestado.arquivoNome;
    link.click();
}

// Excluir atestado
function excluirAtestado(id) {
    const atestado = todosAtestados.find(a => a.id === id);
    if (!atestado) return;
    
    if (confirm(`⚠️ ATENÇÃO\n\nTem certeza que deseja EXCLUIR o documento de:\n\n${atestado.nome}\n\nEsta ação não pode ser desfeita!`)) {
        todosAtestados = todosAtestados.filter(a => a.id !== id);
        localStorage.setItem('atestados_rh', JSON.stringify(todosAtestados));
        
        fecharModal();
        carregarAtestados();
        
        alert('✅ Documento excluído com sucesso!');
    }
}

// Limpar todos
function limparTodos() {
    if (todosAtestados.length === 0) {
        alert('Não há documentos para limpar.');
        return;
    }
    
    if (confirm(`⚠️ ATENÇÃO CRÍTICA\n\nVocê está prestes a EXCLUIR TODOS OS ${todosAtestados.length} DOCUMENTOS!\n\nEsta ação NÃO PODE ser desfeita!\n\nTem certeza?`)) {
        if (confirm('Confirma NOVAMENTE? Todos os documentos serão perdidos!')) {
            localStorage.removeItem('atestados_rh');
            todosAtestados = [];
            carregarAtestados();
            alert('✅ Todos os documentos foram excluídos!');
        }
    }
}

// Atualizar automaticamente a cada 30 segundos
setInterval(() => {
    if (sessionStorage.getItem('rh_autenticado') === 'true') {
        carregarAtestados();
    }
}, 30000);
