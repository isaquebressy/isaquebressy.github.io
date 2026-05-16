# 🏴‍☠️ Festa Pirata - Convite de Aniversário

Bem-vindo ao convite PWA temático One Piece do Isaque!

## 🎯 O que é isso?

Um subsite interativo e temático para convite de aniversário com:

- ✅ **Responsivo:** Mobile-first, funciona perfeitamente em smartphones e desktops
- ✅ **PWA:** Aplicativo instalável que funciona offline
- ✅ **Personalizado:** Cada convidado tem URL única com seu nome
- ✅ **Interativo:** Confirmação de presença via Google Forms
- ✅ **Social:** Mensagens para o aniversariante via Google Sheets
- ✅ **Temático:** Design One Piece com Jolly Roger, cores de piratas, etc.

## 🚀 Acesso Rápido

**URL Base:**
```
https://isaque.bressy.com.br/birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/
```

**URLs Personalizadas:**
Cada convidado recebe uma URL com seu nome encriptado na query string:
```
https://isaque.bressy.com.br/birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/?guest=V1RJZnJ8V1FGSg==
```

Veja a lista completa em `data/guests.json`

## 📋 Antes de Usar

### Configuração Necessária

1. **Google Forms** - Para confirmação de presença
2. **Google Apps Script** - Para receber mensagens
3. **Preencher script.js** - Com IDs do Forms e URL do Apps Script

**LEIA: `docs/setup.md`** para instruções passo a passo completas!

## 🔧 Arquivos Principais

```
birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/
├── index.html           # Página principal (sem front matter Jekyll)
├── style.css            # Estilos responsivos (mobile-first)
├── script.js            # Lógica principal (PWA, Forms, Apps Script)
├── crypto-utils.js      # Criptografia de nomes na URL
├── manifest.json        # PWA Manifest (installable app)
├── sw.js                # Service Worker (offline + caching)
├── data/
│   └── guests.json      # Lista de 64 convidados com URLs encriptadas
├── docs/
│   └── setup.md         # Instruções de setup completas
├── img/
│   └── pwa/
│       ├── icon-192.png     # Ícone PWA (192x192)
│       ├── icon-512.png     # Ícone PWA (512x512)
│       ├── icon.svg         # Original SVG
│       └── screenshot-540x720.png
└── README.md            # Este arquivo
```

## 🎨 Design

- **Colors:** Laranja (Luffy #FF6B35), Azul (Oceano #004E89), Vermelho (Energia #DC143C), Verde (Zoro #2D9C5E)
- **Fonts:** Playfair Display (headings), Fredoka (primária), Poppins (body)
- **Layout:** Mobile-first com breakpoints em 768px e 1024px
- **Acessibilidade:** WCAG 2.1 AA compliant (contraste, touch targets, keyboard navigation)

## 📱 Funcionalidades

### 1. Personalização por Guest
- URL com nome encriptado: `?guest=[encrypted-name]`
- Nome carregado automaticamente
- Armazenado em localStorage

### 2. Confirmação de Presença
- Botão "Vou Estar Presente"
- Abre Google Form em nova aba
- Respostas salvas automaticamente em Google Sheets

### 3. Enviar Mensagem
- Formulário inline (nome + mensagem)
- Enviado para Google Apps Script
- Salvo em outra aba da mesma Sheets
- Máximo 500 caracteres

### 4. PWA Install
- Prompt customizado ao usuário
- "Instale o Mapa Pirata!"
- Funciona offline com Service Worker
- Cache-first para assets locais

## 🔐 Segurança & Privacidade

- URLs encriptadas (Base64 + XOR) para privacidade
- HTTPS obrigatório (GitHub Pages)
- Sem cookies de rastreamento
- Google Forms/Sheets para armazenamento (privacidade Google)
- Guest URLs distribuídas apenas aos convidados

## 📚 Desenvolvimento Local

### Servir Localmente

```bash
cd /Users/isaque.bressy/projects/isaquebressy.github.io
make run
```

Acesse: `http://localhost:4000/birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/`

### Testes

- [ ] Página carrega corretamente
- [ ] Nome aparece na saudação
- [ ] Layout responsivo (320px, 768px, 1024px+)
- [ ] Botão confirmar abre Google Form
- [ ] Mensagens são enviadas (quando Forms/Apps Script configurados)
- [ ] PWA install prompt aparece (Android/Chrome)
- [ ] Service Worker funciona (DevTools > Application > Service Workers)
- [ ] Offline funciona (desative internet, acesse página novamente)

### Build & Deploy

Tudo é estático HTML/CSS/JS. Apenas fazer:

```bash
git add birthday-K7mP2xNq9Vw5Zc3Hj8Yb1Fd4Ra6Ts0Gu/
git commit -m "Update birthday invitation"
git push origin master
```

GitHub Pages faz deploy automaticamente em ~1-2 minutos.

## 🎯 Próximos Passos

1. **Ler `docs/setup.md`** - Setup completo de Google Forms e Apps Script
2. **Criar Google Form** - Para confirmações
3. **Criar Google Apps Script** - Para mensagens
4. **Preencher `script.js`** com:
   - `GOOGLE_FORM_ID`
   - `APPS_SCRIPT_URL`
5. **Testar localmente** - `make run`
6. **Distribuir URLs** - Cada convidado recebe sua URL personalizada
7. **Monitor Sheets** - Confirmações e mensagens chegam em tempo real

## 📞 Suporte

Dúvidas? Veja `docs/setup.md` que tem troubleshooting completo!

## 📄 Licença

Feito com ❤️ para celebrar! 🎉🏴‍☠️

---

**Que a aventura nunca termine!** ⚓️
