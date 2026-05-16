# Setup do Convite de Aniversário 🏴‍☠️

## Configuração Inicial

### Chave de Segurança
```
BIRTHDAY_KEY: K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu
URL Base: https://isaque.bressy.com.br/birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/
```

**⚠️ IMPORTANTE:** Guarde esta chave com segurança. Ela é usada como privacidade (não segurança) para a URL.

---

## Passo 1: Google Forms (Confirmação de Presença)

### 1.1 Criar Novo Formulário

1. Acesse [https://forms.google.com](https://forms.google.com)
2. Clique em "➕ Criar" (novo formulário em branco)
3. Título do formulário: `Confirmação de Presença - Festa Pirata do Isaque`
4. Descrição: `Por favor, confirme sua presença na festa de aniversário!`

### 1.2 Adicionar Campos

Crie os seguintes campos no formulário:

**Campo 1: Nome (obrigatório)**
- Tipo: Resposta curta
- Título: `Seu nome`
- Marcar como "Obrigatório"

**Campo 2: Email**
- Tipo: Resposta curta
- Título: `Seu email (opcional)`
- Validação: Email válido (opcional)

**Campo 3: Confirmação (obrigatório)**
- Tipo: Múltipla escolha
- Título: `Você confirmaria sua presença?`
- Opções:
  - Sim, vou estar presente ✓
  - Não, não vou conseguir ✗
  - Talvez, ainda não tenho certeza 🤔
- Marcar como "Obrigatório"

### 1.3 Conectar a Google Sheets

1. Vá até a aba **"Respostas"** no seu formulário
2. Clique no ícone **Google Sheets** (criar planilha vinculada)
3. Escolha: "Criar nova planilha"
4. Nomeie a planilha: `Festa Pirata - Confirmações`
5. Clique em "Criar"

**Resultado:** As respostas do formulário agora aparecem automaticamente em uma Planilha Google.

### 1.4 Obter Form ID

1. Abra o seu formulário em **modo de edição** (não visualização)
2. Copie a URL do navegador
3. Extraia o ID entre `/forms/d/` e `/edit`

**Exemplo de URL:**
```
https://docs.google.com/forms/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p/edit
                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                    FORM_ID
```

### 1.5 Identificar Field IDs (Entry IDs)

Os Field IDs são necessários para pré-preenchimento de nomes. Existem duas formas de obter:

#### Método 1: Inspetor HTML (mais fácil)

1. Abra o formulário em **modo de visualização** (não edição)
2. Pressione **F12** ou **Cmd+Option+I** (DevTools)
3. Vá para aba **"Elements"** ou **"Inspector"**
4. Procure por `name="entry.XXXXXX"` para cada campo
5. Copie os números

**Exemplo do que procurar:**
```html
<input name="entry.123456789" type="text" ... />  <!-- Nome -->
<input name="entry.987654321" type="email" ... />  <!-- Email -->
<input name="entry.555666777" type="radio" ... />  <!-- Confirmação -->
```

#### Método 2: Via Google Forms API (avançado)

Se o Método 1 não funcionar, use a API.

### 1.6 Configuração no Script

Edite o arquivo `script.js` e preencha:

```javascript
const CONFIG = {
  GOOGLE_FORM_ID: '[PREENCHIDO: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p]',
  // ... resto da configuração
};
```

**Observação:** Atualmente o script.js está simplificado. Para pré-preenchimento automático, você pode compartilhar a URL do form com query parameters:

```
https://docs.google.com/forms/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p/viewform?usp=pp_url&entry.123456789=Daiana
```

---

## Passo 2: Google Apps Script (Receber Mensagens)

### 2.1 Criar Script Novo

1. Acesse [https://script.google.com](https://script.google.com)
2. Clique em "➕ Novo Projeto"
3. Nomeie o projeto: `Birthday-Messages-Receiver`

### 2.2 Criar Planilha para Mensagens

1. Abra [Google Sheets](https://sheets.google.com)
2. Crie uma nova planilha: `Festa Pirata - Mensagens`
3. Crie uma aba (sheet) chamada `Messages`
4. Adicione os headers (primeira linha):
   - A1: `Timestamp`
   - B1: `Nome`
   - C1: `Email`
   - D1: `Mensagem`

**ID da Planilha:** Você encontra na URL
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p/edit
                                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                                           SHEET_ID
```

### 2.3 Copiar Código do Apps Script

No Apps Script, copie e cole este código:

```javascript
// =======================
// CONFIGURAÇÃO
// =======================
const SHEET_ID = "YOUR_SHEET_ID_HERE";  // Substitua pelo ID da planilha
const SHEET_NAME = "Messages";           // Nome da aba

// =======================
// FUNÇÃO PRINCIPAL
// =======================
function doPost(e) {
  try {
    // Receber dados do POST
    const postData = e.postData.contents;
    const data = JSON.parse(postData);
    
    // Validar dados
    if (!data.name || !data.message) {
      return ContentService.createTextOutput(
        JSON.stringify({ 
          success: false, 
          error: "Nome e mensagem são obrigatórios" 
        })
      ).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Abrir planilha
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // Preparar linha
    const timestamp = new Date().toISOString();
    const row = [
      timestamp, 
      data.name, 
      data.email || "não informado", 
      data.message
    ];
    
    // Adicionar linha
    sheet.appendRow(row);
    
    // Sucesso
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: true, 
        message: "Mensagem salva com sucesso!" 
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Erro: " + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ 
        success: false, 
        error: error.toString() 
      })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// Função de teste (opcional - execute para testar)
function testDoPost() {
  const testData = {
    name: "Teste",
    email: "teste@example.com",
    message: "Esta é uma mensagem de teste"
  };
  
  const e = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(e);
  Logger.log(result.getContent());
}
```

### 2.4 Editar Configuração

1. Edite a linha: `const SHEET_ID = "YOUR_SHEET_ID_HERE";`
2. Substitua pelo ID da sua planilha (obtido em 2.2)

### 2.5 Deploy como Web App

1. Clique em **"Deploy"** (botão no canto superior direito)
2. Selecione **"New deployment"**
3. Tipo: Escolha **"Web app"**
4. Configurações:
   - "Execute as": Sua conta de email
   - "Who has access": **"Anyone"**
5. Clique em **"Deploy"**
6. Uma janela aparecerá com sua URL de execução

**Exemplo de URL:**
```
https://script.google.com/macros/s/AKfycbzXxxxxxYouridxxxxxx/usercontent
```

### 2.6 Copiar URL de Execução

Copie toda a URL gerada (a que começa com `https://script.google.com/macros/s/`).

---

## Passo 3: Atualizar script.js com as Chaves

### 3.1 Editar script.js

Abra o arquivo `/birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/script.js`

Procure pela seção "CONFIGURATION" e preencha:

```javascript
const CONFIG = {
  BIRTHDAY_KEY: 'K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu',
  GOOGLE_FORM_ID: '[PREENCHIDO COM SEU FORM ID]',
  APPS_SCRIPT_URL: '[PREENCHIDO COM SUA URL DE EXECUÇÃO]',
  PWA_DISMISS_DAYS: 14,
  STORAGE_KEYS: {
    guestName: 'birthday_guest_name',
    firstVisit: 'birthday_first_visit',
    pwaDismissed: 'birthday_pwa_dismissed'
  }
};
```

**Exemplo completo:**
```javascript
const CONFIG = {
  BIRTHDAY_KEY: 'K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu',
  GOOGLE_FORM_ID: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbzXxxxxxYouridxxxxxx/usercontent',
  PWA_DISMISS_DAYS: 14,
  STORAGE_KEYS: {
    guestName: 'birthday_guest_name',
    firstVisit: 'birthday_first_visit',
    pwaDismissed: 'birthday_pwa_dismissed'
  }
};
```

Salve o arquivo.

---

## Passo 4: Distribuir URLs para Convidados

### URLs Personalizadas

Cada convidado recebe uma URL única com seu nome criptografado. Veja a lista em `data/guests.json`.

**Exemplo:**
- Daiana: `https://isaque.bressy.com.br/birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/?guest=V1RJZnJ8V1FGSg==`
- Amanda: `https://isaque.bressy.com.br/birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/?guest=W1BEZnJ8UVlESg==`

### Como Distribuir

1. Copie as URLs da lista em `data/guests.json`
2. Envie por WhatsApp, Email, SMS, etc.
3. Cada pessoa acessa sua URL personalizada
4. Nome é carregado automaticamente
5. Pode confirmar presença ou enviar mensagem

---

## Passo 5: Testar Localmente

### 5.1 Servir o Site Localmente

```bash
cd /Users/isaque.bressy/projects/isaquebressy.github.io
make run
```

Acesse: `http://localhost:4000/birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/`

### 5.2 Testes de Funcionalidade

- [ ] Página carrega e responde
- [ ] Nome aparece na saudação
- [ ] Botão "Confirmar" abre Google Form
- [ ] Formulário de mensagem funciona
- [ ] Mensagens aparecem na Sheets
- [ ] PWA install prompt aparece (em Android/Chrome)
- [ ] Layout responsivo (mobile + desktop)
- [ ] Offline funciona (com Service Worker)

### 5.3 Testar com Parâmetro de Guest

Acesse com um guest encriptado:
```
http://localhost:4000/birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/?guest=V1RJZnJ8V1FGSg==
```

Deve mostrar: "Olá, daiana!"

---

## Passo 6: Deploy para Production

Quando tudo estiver funcionando:

```bash
cd /Users/isaque.bressy/projects/isaquebressy.github.io
git add birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/
git commit -m "Add birthday invitation PWA"
git push origin master
```

GitHub Pages fará deploy automaticamente. Aguarde 1-2 minutos.

Acesse: `https://isaque.bressy.com.br/birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/`

---

## Troubleshooting

### Formulário não abre
- Confirme que `GOOGLE_FORM_ID` está preenchido em `script.js`
- Teste a URL do form manualmente no navegador

### Mensagens não chegam na Sheets
- Verifique que `APPS_SCRIPT_URL` está correta em `script.js`
- Confirme que a aba "Messages" existe na planilha
- Cheque que o Apps Script foi deployado corretamente

### PWA não instala
- Apenas funciona em HTTPS (ou localhost em dev)
- Verifique que `manifest.json` está válido
- Em Android: use Chrome. Em iOS: use Safari

### Nome não aparece personalizado
- Verifique a URL tem `?guest=...`
- Teste que `crypto-utils.js` descriptografa corretamente
- Use DevTools console para debugar: `console.log(window.CryptoUtils.getGuestNameFromUrl())`

---

## Segurança e Privacidade

⚠️ **Importante:**
- A criptografia de nomes na URL é **privacidade**, não segurança
- URLs são passadas via HTTPS (seguro em trânsito)
- Dados de mensagens são armazenados em Google Sheets (privacidade Google)
- Não use para dados sensíveis
- Guest URLs devem ser distribuídas apenas aos convidados

---

## Backup

Faça backup regular das suas Sheets:
1. Confirmações: `Festa Pirata - Confirmações`
2. Mensagens: `Festa Pirata - Mensagens`

Baixe como CSV periodicamente para guardar localmente.

---

**Divirta-se! 🎉🏴‍☠️**
