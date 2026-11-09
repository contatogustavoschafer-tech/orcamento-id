# ✦ Orçamento de Identidade Visual & Branding

Um simulador de orçamento e briefing interativo, minimalista e de alta conversão, desenvolvido especialmente para designers de identidade visual e estúdios de branding. 

Inspirado no visual matte black clean e tipografia editorial de alto impacto (com Three.js / Vanta.NET e orbs com blur fluido).

---

## 🚀 Como testar localmente

Você pode abrir diretamente o arquivo `index.html` em qualquer navegador ou rodar um servidor local com Python:

```bash
# No terminal, dentro desta pasta:
python3 -m http.server 3000
```
Depois acesse `http://localhost:3000` no seu navegador.

---

## ⚡ Como publicar no Vercel (Grátis em 1 minuto)

### Opção 1: Pelo GitHub (Recomendado)
1. Crie um repositório no seu GitHub (ex: `orcamento-id`).
2. Faça o push dos arquivos desta pasta para o repositório:
   ```bash
   git init
   git add .
   git commit -m "feat: site de orçamento de identidade visual"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git push -u origin main
   ```
3. Acesse [vercel.com](https://vercel.com) e clique em **Add New Project**.
4. Importe o repositório e clique em **Deploy**. O Vercel detectará automaticamente o arquivo estático e o `vercel.json`!

### Opção 2: Pelo Vercel CLI
```bash
npx vercel
```

---

## ⚙️ Como Personalizar Dados e Preços

### Pelo próprio site (Sem mexer em código):
- Clique no selo com seu `@` no canto superior direito (`@seustudio` ou `@samuelreis_`).
- Abrirá uma janela onde você pode alterar:
  - Seu nome / Estúdio
  - Seu arroba `@` do Instagram
  - Seu WhatsApp para onde os orçamentos são enviados
  - Número de parcelas sem juros (ex: 10x, 12x)
  - % de desconto à vista no PIX

### Pelo código (`app.js`):
No início do arquivo `app.js`, você encontra o objeto `DEFAULT_CONFIG` com todos os pacotes, valores e itens adicionais:
- **Pacotes**: Essencial, Pro (Completo) e Branding 360° Estratégico.
- **Materiais Impressos**: Cartão de visita, papelaria corporativa, embalagens, rótulos, uniformes, catálogos.
- **Presença Digital**: Templates editáveis no Canva/Figma, capas de reels/destaques, pitch deck, assinatura de e-mail.
- **Prazos**: Padrão vs Expresso.

---

## 📱 Fluxo do Cliente
1. O cliente preenche o nome e a marca.
2. Escolhe a profundidade do projeto (Essencial, Pro ou 360°).
3. Adiciona materiais impressos ou digitais extras (com total calculado em tempo real).
4. Escolhe o prazo de entrega.
5. Vê a discriminação detalhada com valor à vista no PIX com desconto, parcelamento em até 10x sem juros no cartão ou 50/50.
6. Clica em **Enviar Orçamento no WhatsApp**, abrindo uma mensagem pronta e formatada diretamente no seu WhatsApp!

