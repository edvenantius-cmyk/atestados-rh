// Base de dados de CIDs
const cidDatabase = {
    'A00': 'Cólera', 'A09': 'Diarreia e gastroenterite', 'A15': 'Tuberculose respiratória',
    'A90': 'Dengue', 'B34': 'Infecção viral não especificada', 'C50': 'Neoplasia maligna da mama',
    'C61': 'Neoplasia maligna da próstata', 'G43': 'Enxaqueca', 'G44': 'Outras síndromes de algias cefálicas',
    'J00': 'Nasofaringite aguda (resfriado comum)', 'J01': 'Sinusite aguda', 'J02': 'Faringite aguda',
    'J03': 'Amigdalite aguda', 'J06': 'Infecção aguda das vias aéreas superiores',
    'J11': 'Influenza (gripe)', 'J18': 'Pneumonia', 'J20': 'Bronquite aguda',
    'J30': 'Rinite alérgica', 'J40': 'Bronquite não especificada', 'J45': 'Asma',
    'K21': 'Doença de refluxo gastroesofágico', 'K29': 'Gastrite e duodenite', 'K30': 'Dispepsia',
    'K35': 'Apendicite aguda', 'K52': 'Outras gastroenterites e colites',
    'K59': 'Outros transtornos funcionais do intestino', 'K80': 'Colelitíase',
    'M10': 'Gota', 'M17': 'Gonartrose (artrose do joelho)', 'M19': 'Outras artroses',
    'M25': 'Outros transtornos articulares', 'M47': 'Espondilose',
    'M51': 'Outros transtornos de discos intervertebrais', 'M53': 'Outras dorsopatias',
    'M54': 'Dorsalgia (dor nas costas)', 'M62': 'Outros transtornos musculares',
    'M65': 'Sinovite e tenossinovite', 'M75': 'Lesões do ombro', 'M77': 'Outras entesopatias',
    'M79': 'Outros transtornos dos tecidos moles', 'N30': 'Cistite',
    'N39': 'Outros transtornos do trato urinário', 'R05': 'Tosse', 'R10': 'Dor abdominal e pélvica',
    'R11': 'Náusea e vômitos', 'R50': 'Febre de origem desconhecida', 'R51': 'Cefaleia (dor de cabeça)',
    'R52': 'Dor não classificada', 'S06': 'Traumatismo intracraniano',
    'S13': 'Luxação, entorse do pescoço', 'S43': 'Luxação, entorse do ombro',
    'S52': 'Fratura do antebraço', 'S53': 'Luxação, entorse do cotovelo',
    'S60': 'Traumatismo superficial do punho', 'S61': 'Ferimento do punho e mão',
    'S62': 'Fratura do punho e mão', 'S63': 'Luxação, entorse do punho',
    'S82': 'Fratura da perna', 'S83': 'Luxação, entorse do joelho',
    'S93': 'Luxação, entorse do tornozelo', 'T14': 'Traumatismo não especificado',
    'Z00': 'Exame geral', 'Z01': 'Outros exames especiais', 'Z03': 'Observação médica',
    'Z09': 'Exame de seguimento', 'Z23': 'Imunização bacteriana', 'Z25': 'Imunização viral',
    'Z76': 'Pessoas em contato com serviços de saúde'
};

let arquivoSelecionado = null;

// Buscar CID
function buscarCID(codigo) {
    const cidInfo = document.getElementById('cidInfo');
    
    if (!codigo || codigo.length < 2) {
        cidInfo.classList.remove('show');
        return;
    }
    
    codigo = codigo.toUpperCase().trim();
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
    
    arquivoSelecionado = file;
    
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
    
    // Mostrar loading
    document.getElementById('atestadoForm').style.display = 'none';
    document.getElementById('loading').classList.add('show');
    
    try {
        // 1. Upload do arquivo para Firebase Storage
        const { ref, uploadBytes, getDownloadURL } = window.firebaseImports;
        const storage = window.storage;
        
        const timestamp = Date.now();
        const fileName = `${timestamp}_${arquivo.name}`;
        const storageRef = ref(storage, `atestados/${fileName}`);
        
        // Upload
        const snapshot = await uploadBytes(storageRef, arquivo);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        // 2. Salvar dados no Firestore
        const { collection, addDoc, serverTimestamp } = window.firebaseImports;
        const db = window.db;
        
        await addDoc(collection(db, 'atestados'), {
            nome: nome,
            tipo: tipo,
            cid: cid || 'Não informado',
            cidDescricao: cid ? (cidDatabase[cid] || 'Não encontrado') : 'Não informado',
            arquivoNome: arquivo.name,
            arquivoURL: downloadURL,
            arquivoTipo: arquivo.type,
            arquivoTamanho: arquivo.size,
            dataEnvio: serverTimestamp(),
            status: 'novo'
        });
        
        // Mostrar sucesso
        document.getElementById('loading').classList.remove('show');
        document.getElementById('successMessage').style.display = 'block';
        
    } catch (error) {
        console.error('Erro ao enviar:', error);
        document.getElementById('loading').classList.remove('show');
        document.getElementById('atestadoForm').style.display = 'block';
        showAlert('Erro ao enviar documento: ' + error.message, 'error');
    }
});
