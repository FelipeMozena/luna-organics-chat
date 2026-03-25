# 🌿 Luna Organics Chat Widget

Chat estilo WhatsApp com RAG (base de conhecimento) para captura e qualificação de leads na landing page da Luna Organics.

![Chat Preview](https://img.shields.io/badge/status-pronto%20para%20uso-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Funcionalidades

- 💬 **Chat estilo WhatsApp** com botão flutuante animado
- 🧠 **RAG integrado** com base de conhecimento da Luna Organics
- 👤 **Fluxo de qualificação de lead**: coleta nome, condição e WhatsApp
- 📲 **Redirecionamento para WhatsApp** com mensagem pré-preenchida
- ⚡ **Quick replies** para respostas rápidas
- 📱 **Responsivo** e compatível com qualquer site
- 🎨 **Cores da marca** Luna Organics (verde teal #349588)
- 📊 **Evento customizado** `luna:lead_qualified` para integração com CRM

## 🚀 Instalação

### Opção 1: Script direto (recomendado)

Adicione antes do `</body>` da sua landing page:

```html
<script src="chat-widget.js"></script>
```

### Opção 2: CDN via jsDelivr

```html
<script src="https://cdn.jsdelivr.net/gh/FelipeMozena/luna-organics-chat@main/chat-widget.js"></script>
```

## ⚙️ Configuração

Abra o arquivo `chat-widget.js` e edite as variáveis no início:

```javascript
var WHATSAPP_NUMBER = '5511999999999'; // Número real da Luna Organics
var LUNA_GREEN = '#349588';             // Cor principal (opcional)
```

## 💬 Base de Conhecimento (RAG)

O chat responde automaticamente sobre:

| Tópico | Palavras-chave |
|--------|----------------|
| Legalidade | anvisa, cfm, legal, regulamentado |
| Dependência | dependencia, vicio, tolerancia |
| Resultados | resultado, tempo, funciona, efeito |
| Processo | online, como funciona, etapa |
| Preços | preco, custo, valor |
| O que é CBD | cbd, canabidiol, cannabis |
| Entrega | entrega, importacao, envio |
| Médicos | medico, especialista, consulta |
| Condições | dor, ansiedade, insonia, depressao... |

## 🎯 Fluxo de Qualificação de Lead

1. Usuário abre o chat
2. Bot coleta **nome**
3. Bot coleta **condição de saúde** (com quick replies)
4. Bot coleta **WhatsApp**
5. Lead qualificado → botão verde "Falar com especialista agora"
6. Clique abre WhatsApp com mensagem pré-preenchida

## 📊 Integração com CRM/Analytics

O widget dispara um evento customizado quando o lead é qualificado:

```javascript
document.addEventListener('luna:lead_qualified', function(e) {
  console.log(e.detail); 
  // { name: 'Carlos', whatsapp: '(11) 98765-4321', condition: 'Ansiedade', qualified: true }
  
  // Exemplo: enviar para seu CRM
  fetch('/api/leads', {
    method: 'POST',
    body: JSON.stringify(e.detail)
  });
});
```

## 📁 Estrutura do Repositório

```
luna-organics-chat/
├── chat-widget.js   # Widget completo (instalar na landing page)
├── index.html       # Página de demonstração
└── README.md        # Este arquivo
```

## 🌐 Demo

Acesse a demo em: [https://felipemozena.github.io/luna-organics-chat](https://felipemozena.github.io/luna-organics-chat)

## 📋 Próximos Passos

- [ ] Substituir `NUMERO_WHATSAPP` pelo número real
- [ ] Adicionar script na landing page antes do `</body>`
- [ ] Configurar webhook para receber leads no CRM
- [ ] Ativar GitHub Pages para demo pública

## 📝 Licença

MIT © Luna Organics
