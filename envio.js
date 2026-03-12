// Base de dados de CIDs mais comuns
const cidDatabase = {
    // Capítulo I - Algumas doenças infecciosas e parasitárias
    'A00': 'Cólera',
    'A09': 'Diarreia e gastroenterite de origem infecciosa presumível',
    'A15': 'Tuberculose respiratória',
    'A90': 'Dengue',
    'B34': 'Infecção viral de localização não especificada',
    
    // Capítulo II - Neoplasias
    'C50': 'Neoplasia maligna da mama',
    'C61': 'Neoplasia maligna da próstata',
    
    // Capítulo VI - Doenças do sistema nervoso
    'G43': 'Enxaqueca',
    'G44': 'Outras síndromes de algias cefálicas',
    
    // Capítulo X - Doenças do aparelho respiratório
    'J00': 'Nasofaringite aguda (resfriado comum)',
    'J01': 'Sinusite aguda',
    'J02': 'Faringite aguda',
    'J03': 'Amigdalite aguda',
    'J06': 'Infecção aguda das vias aéreas superiores',
    'J11': 'Influenza (gripe) devida a vírus não identificado',
    'J18': 'Pneumonia por microorganismo não especificado',
    'J20': 'Bronquite aguda',
    'J30': 'Rinite alérgica e vasomotora',
    'J40': 'Bronquite não especificada como aguda ou crônica',
    'J45': 'Asma',
    
    // Capítulo XI - Doenças do aparelho digestivo
    'K21': 'Doença de refluxo gastroesofágico',
    'K29': 'Gastrite e duodenite',
    'K30': 'Dispepsia',
    'K35': 'Apendicite aguda',
    'K52': 'Outras gastroenterites e colites não infecciosas',
    'K59': 'Outros transtornos funcionais do intestino',
    'K80': 'Colelitíase (cálculo biliar)',
    
    // Capítulo XIII - Doenças do sistema osteomuscular
    'M10': 'Gota',
    'M17': 'Gonartrose (artrose do joelho)',
    'M19': 'Outras artroses',
    'M25': 'Outros transtornos articulares',
    'M47': 'Espondilose',
    'M51': 'Outros transtornos de discos intervertebrais',
    'M53': 'Outras dorsopatias',
    'M54': 'Dorsalgia (dor nas costas)',
    'M62': 'Outros transtornos musculares',
    'M65': 'Sinovite e tenossinovite',
    'M75': 'Lesões do ombro',
    'M77': 'Outras entesopatias',
    'M79': 'Outros transtornos dos tecidos moles',
    
    // Capítulo XIV - Doenças do aparelho geniturinário
    'N30': 'Cistite',
    'N39': 'Outros transtornos do trato urinário',
    
    // Capítulo XVIII - Sintomas e sinais
    'R05': 'Tosse',
    'R10': 'Dor abdominal e pélvica',
    'R11': 'Náusea e vômitos',
    'R50': 'Febre de origem desconhecida',
    'R51': 'Cefaleia (dor de cabeça)',
    'R52': 'Dor não classificada',
    
    // Capítulo XIX - Lesões e envenenamentos
    'S06': 'Traumatismo intracraniano',
    'S13': 'Luxação, entorse ou distensão de articulações do pescoço',
    'S43': 'Luxação, entorse ou distensão de articulações do ombro',
    'S52': 'Fratura do antebraço',
    'S53': 'Luxação, entorse ou distensão do cotovelo',
    'S60': 'Traumatismo superficial do punho e da mão',
    'S61': 'Ferimento do punho e da mão',
    'S62': 'Fratura ao nível do punho e da mão',
    'S63': 'Luxação, entorse ou distensão do punho e da mão',
    'S82': 'Fratura da perna, incluindo tornozelo',
    'S83': 'Luxação, entorse ou distensão do joelho',
    'S93': 'Luxação, entorse ou distensão do tornozelo e pé',
    'T14': 'Traumatismo de região não especificada do corpo',
    
    // Capítulo XXI - Fatores que influenciam o estado de saúde
    'Z00': 'Exame geral e investigação de pessoas sem queixas',
    'Z01': 'Outros exames e investigações especiais',
    'Z03': 'Observação e avaliação médica por doenças e afecções suspeitas',
    'Z09': 'Exame de seguimento após tratamento',
    'Z23': 'Necessidade de imunização contra doença bacteriana isolada',
    'Z25': 'Necessidade de imunização contra doença viral isolada',
    'Z76': 'Pessoas em contato com serviços de saúde em outras circunstâncias'
};

let arquivoSelecionado = null;

// Buscar CID
function buscarCID(codigo) {
    const cidInfo = document.getElementById('cidInfo');
    
    if (!codigo || codigo.length < 2) {
        cidInfo.classList.remove('show');
        return;
    }
    
    // Normalizar código (maiúsculo, sem espaços)
    codigo = codigo.toUpperCase().trim();
    
    // Buscar na base
    const descricao = cidDatabase[codigo];
    
    if (descricao) {
        cidInfo.innerHTML = `
            <div class="cid-info-title">CID ${codigo}</div>
            <div class="cid-info-desc">${descricao}</div>
        `;
        cidInfo.classList.add('show');
    } else {
        cidInfo.innerHTML = `
            <div class="cid-info-title">CID ${codigo}</div>
            <div class="cid-info-desc">CID não encontrado na base de dados. Você pode enviá-lo mesmo assim.</div>
        `;
        cidInfo.classList.add('show');
    }
}

// Drag and drop
const uploadArea = document.getElementById('fileUploadArea');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('arquivo').files = files;
        handleFileSelect({ target: { files: files } });
    }
});

// Manipular seleção de arquivo
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tamanho (10MB)
    if (file.size > 10 * 1024 * 1024) {
        showAlert('Arquivo muito grande! Tamanho máximo: 10MB', 'error');
        document.getElementById('arquivo').value = '';
        return;
    }
    
    // Salvar arquivo
    arquivoSelecionado = file;
    
    // Mostrar preview
    const preview = document.getElementById('filePreview');
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    const icon = file.type.includes('pdf') ? '📄' : '🖼️';
    
    preview.innerHTML = `
        <div class="file-preview-icon">${icon}</div>
        <div class="file-preview-info">
            <div class="file-preview-name">${file.name}</div>
            <div class="file-preview-size">${sizeInMB} MB</div>
        </div>
        <button type="button" class="file-preview-remove" onclick="removerArquivo()">
            ✕ Remover
        </button>
    `;
    preview.classList.add('show');
}

// Remover arquivo
function removerArquivo() {
    arquivoSelecionado = null;
    document.getElementById('arquivo').value = '';
    document.getElementById('filePreview').classList.remove('show');
}

// Mostrar alerta
function showAlert(message, type) {
    const alert = document.getElementById('alert');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;
    
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

// Enviar formulário
document.getElementById('atestadoForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nomeColaborador').value.trim();
    const tipo = document.getElementById('tipoDocumento').value;
    const cid = document.getElementById('cid').value.trim().toUpperCase();
    const arquivo = document.getElementById('arquivo').files[0];
    
    if (!nome || !tipo || !arquivo) {
        showAlert('Por favor, preencha todos os campos obrigatórios.', 'error');
        return;
    }
    
    // Desabilitar botão
    const btnEnviar = document.getElementById('btnEnviar');
    btnEnviar.disabled = true;
    btnEnviar.textContent = '⏳ Enviando...';
    
    try {
        // Converter arquivo para base64
        const base64File = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(arquivo);
        });
        
        // Criar objeto do atestado
        const atestado = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            nome: nome,
            tipo: tipo,
            cid: cid || 'Não informado',
            cidDescricao: cid ? (cidDatabase[cid] || 'Não encontrado') : 'Não informado',
            arquivo: base64File,
            arquivoNome: arquivo.name,
            arquivoTipo: arquivo.type,
            arquivoTamanho: arquivo.size,
            dataEnvio: new Date().toISOString(),
            status: 'novo'
        };
        
        // Salvar no localStorage
        let atestados = JSON.parse(localStorage.getItem('atestados_rh') || '[]');
        atestados.push(atestado);
        localStorage.setItem('atestados_rh', JSON.stringify(atestados));
        
        // Mostrar sucesso
        document.getElementById('atestadoForm').style.display = 'none';
        document.getElementById('successMessage').style.display = 'block';
        
    } catch (error) {
        console.error('Erro ao enviar:', error);
        showAlert('Erro ao enviar documento. Tente novamente.', 'error');
        btnEnviar.disabled = false;
        btnEnviar.textContent = '📤 Enviar Documento';
    }
});
