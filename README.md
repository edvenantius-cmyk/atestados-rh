# 📋 Sistema de Envio de Atestados - RH

## 🎯 Sobre o Sistema

Sistema completo para gerenciamento de atestados médicos, CEREST e acidentes de trabalho. Permite que colaboradores enviem documentos de forma simples e o RH gerencie tudo em um painel centralizado.

---

## 📱 PARA COLABORADORES

### Como Enviar um Atestado:

1. **Acesse** `index.html` (página de envio)
2. **Preencha** os dados:
   - ✅ Nome completo (obrigatório)
   - ✅ Tipo de documento (obrigatório)
   - ✅ CID (opcional - busca automática do significado)
   - ✅ Anexar arquivo PDF ou imagem (obrigatório)
3. **Clique** em "Enviar Documento"
4. **Pronto!** RH recebe automaticamente

### Formatos Aceitos:
- 📄 PDF
- 🖼️ JPG, JPEG, PNG
- 📸 HEIC
- **Tamanho máximo:** 10MB

---

## 🔐 PARA RH (PAINEL ADMINISTRATIVO)

### Acesso ao Painel:

**URL:** `admin.html`  
**Senha:** `guitar182`

### Funcionalidades:

✅ **Visualizar** todos os documentos enviados  
✅ **Filtrar** por tipo, status ou nome do colaborador  
✅ **Baixar** PDFs e imagens  
✅ **Excluir** documentos  
✅ **Ver CID** com significado automático  
✅ **Marcar como visto** automaticamente ao abrir  
✅ **Estatísticas** em tempo real  

### Estatísticas Disponíveis:
- Total de documentos
- Novos (não vistos)
- Vistos
- CEREST/Acidentes

### Filtros:
- Por tipo de documento
- Por status (novo/visto)
- Por nome do colaborador

---

## 🔄 COMO FUNCIONA (Cross-Device)

O sistema usa **localStorage** do navegador, então:

### ✅ FUNCIONA:
- Colaborador envia do celular → RH vê no PC (MESMO navegador e site)
- Múltiplos colaboradores podem enviar
- Dados ficam salvos mesmo fechando o navegador

### ⚠️ IMPORTANTE:
- Dados são salvos **localmente** no navegador
- Para funcionar cross-device, o site precisa estar **hospedado**
- Se limpar dados do navegador, perde os atestados
- Recomendado: **backup regular** baixando os arquivos

---

## 🗂️ TIPOS DE DOCUMENTOS

1. **Atestado Médico** - Atestado comum de consultas/doenças
2. **CEREST** - Acidentes de trabalho (Centro de Referência)
3. **Comunicação de Acidente** - CAT e similares
4. **Outro** - Outros documentos relacionados

---

## 🩺 SISTEMA DE CID

### Base de Dados Incluída:
O sistema possui mais de **70 CIDs** cadastrados, incluindo:

**Doenças Respiratórias:**
- J00 - Resfriado comum
- J11 - Gripe
- J18 - Pneumonia
- J45 - Asma

**Doenças Osteomusculares:**
- M54 - Dor nas costas
- M75 - Lesões do ombro
- M77 - Outras entesopatias

**Acidentes e Lesões:**
- S52 - Fratura do antebraço
- S82 - Fratura da perna
- T14 - Traumatismo não especificado

**E muito mais!**

### Busca Automática:
- Digite o CID (ex: J00)
- Sistema mostra o significado automaticamente
- Se não encontrar, permite enviar mesmo assim

---

## 🚀 COMO HOSPEDAR

### Opção 1: Vercel (Recomendado)
1. Acesse https://vercel.com
2. Faça upload da pasta
3. Pronto! Link gerado

### Opção 2: GitHub Pages
1. Crie repositório no GitHub
2. Faça upload dos arquivos
3. Ative Pages nas configurações

### Opção 3: Netlify
1. Acesse https://netlify.com
2. Arraste a pasta
3. Deploy instantâneo

---

## 📊 ESTRUTURA DOS ARQUIVOS

```
atestados-rh/
├── index.html      → Página de envio (colaboradores)
├── envio.js        → Lógica de envio + busca CID
├── admin.html      → Painel RH (com senha)
├── admin.js        → Lógica administrativa
└── README.md       → Esta documentação
```

---

## 🔒 SEGURANÇA

### Senha do Painel:
- **Senha padrão:** `guitar182`
- **Como trocar:** Edite `admin.js`, linha 1:
  ```javascript
  const SENHA_CORRETA = 'SUA_NOVA_SENHA';
  ```

### Proteções:
- ✅ Login com senha
- ✅ Sessão expira ao fechar navegador
- ✅ Confirmação dupla para excluir todos
- ✅ Arquivos armazenados em base64 (seguros)

---

## 💾 BACKUP E DADOS

### Como Fazer Backup:
1. Painel Admin → Selecione cada documento
2. Clique em "Baixar"
3. Salve em pasta segura

### Restaurar Dados:
- **Não tem restore automático**
- Colaboradores precisam reenviar
- Recomendado: Backup semanal

### Limpar Todos os Dados:
1. Painel Admin
2. Botão "Limpar Todos"
3. Confirma 2x
4. ⚠️ Ação irreversível!

---

## 📱 COMPATIBILIDADE

### Navegadores Suportados:
- ✅ Chrome/Edge (recomendado)
- ✅ Firefox
- ✅ Safari
- ✅ Opera

### Dispositivos:
- ✅ PC/Desktop
- ✅ Celular (Android/iPhone)
- ✅ Tablet

---

## 🎨 PERSONALIZAÇÃO

### Trocar Cores:
Edite o CSS nos arquivos HTML:
- `index.html` → Cores do formulário
- `admin.html` → Cores do painel

### Adicionar CIDs:
Edite `envio.js`, objeto `cidDatabase`:
```javascript
'A00': 'Nome da doença',
```

### Mudar Limite de Arquivo:
Edite `envio.js`, linha do tamanho:
```javascript
if (file.size > 10 * 1024 * 1024) // 10MB
```

---

## ❓ PERGUNTAS FREQUENTES

**P: Os dados são compartilhados entre dispositivos?**  
R: Sim, desde que acessem o mesmo link hospedado.

**P: Posso adicionar mais tipos de documentos?**  
R: Sim! Edite o `<select>` no `index.html`.

**P: E se esquecer a senha do admin?**  
R: Edite `admin.js` e mude a senha.

**P: Tem limite de documentos?**  
R: Depende do espaço do localStorage (~5-10MB).

**P: Como sei que o colaborador enviou?**  
R: Badge "Novo" no painel + atualização automática.

**P: Posso ver documentos antigos?**  
R: Sim, todos ficam salvos até serem excluídos.

---

## 🆘 SUPORTE

### Problemas Comuns:

**Arquivo não aparece no painel:**
- Verifique se está no mesmo site/link
- Atualize a página (F5)
- Confira se não filtrou por tipo/status

**Não consigo fazer login:**
- Senha correta: `guitar182`
- Verifique caps lock
- Limpe cache do navegador

**Upload falha:**
- Arquivo muito grande? (máx 10MB)
- Formato aceito? (PDF, JPG, PNG, HEIC)
- Conexão estável?

---

## ✅ CHECKLIST DE IMPLANTAÇÃO

- [ ] Hospedar os arquivos (Vercel/GitHub/Netlify)
- [ ] Testar envio de documento
- [ ] Testar login no admin (senha: guitar182)
- [ ] Verificar se documentos aparecem
- [ ] Testar download de arquivos
- [ ] Testar filtros
- [ ] Informar link aos colaboradores
- [ ] Salvar link do admin nos favoritos

---

## 🎉 PRONTO PARA USO!

O sistema está completo e funcional. Basta hospedar e compartilhar o link com os colaboradores!

**Link para colaboradores:** `seu-site.com/index.html`  
**Link para RH:** `seu-site.com/admin.html`

---

**Desenvolvido com ❤️ para facilitar a gestão de RH**
