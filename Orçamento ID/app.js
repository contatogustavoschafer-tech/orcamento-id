// Configuração padrão do profissional / estúdio
const DEFAULT_CONFIG = {
  designerName: "Samuel",
  designerHandle: "@seustudio",
  whatsappPhone: "5511999999999", // Altere nas configurações
  maxInstallments: 10,
  pixDiscountPercent: 10,
  currencySymbol: "R$",
  
  // Pacotes principais
  packages: {
    essential: {
      id: "essential",
      name: "Identidade Essencial",
      tagline: "Para quem está começando e precisa de uma presença visual profissional e marcante.",
      price: 1800,
      features: [
        "Logotipo principal + variações de aplicação",
        "Paleta de cores estratégica com códigos HEX/CMYK",
        "Seleção tipográfica primária e secundária",
        "Guia de uso da marca em PDF",
        "Arquivos finais em vetor (.AI, .EPS, .SVG, .PNG)"
      ]
    },
    pro: {
      id: "pro",
      name: "Identidade Completa (Pro)",
      tagline: "O projeto definitivo para posicionar seu negócio com autoridade máxima no mercado.",
      price: 2900,
      popular: true,
      features: [
        "Tudo do pacote Essencial",
        "Submarcas e selos de assinatura",
        "Padrão gráfico exclusivo (Patterns / Grafismos)",
        "Manual de Identidade Visual detalhado",
        "Kit avatar e capas para todas as redes sociais",
        "Mockups 3D hiper-realistas para validação"
      ]
    },
    strategic: {
      id: "strategic",
      name: "Branding 360° Estratégico",
      tagline: "Diagnóstico profundo, arquétipo, tom de voz e posicionamento competitivo completo.",
      price: 4600,
      features: [
        "Tudo do pacote Completo (Pro)",
        "Diagnóstico de marca e pesquisa de concorrentes",
        "Definição de arquétipo de marca e tom de voz",
        "Manifesto da marca e guia de comunicação",
        "Diretrizes para fotografia e tom visual",
        "Suporte prioritário via WhatsApp direto"
      ]
    }
  },

  // Adicionais de Papelaria / Impressos
  printAddons: [
    { id: "cartao", name: "Cartão de Visita Premium", desc: "Design para verniz localizado / hot stamping e versão digital interativa", price: 190 },
    { id: "timbrado", name: "Papelaria Corporativa", desc: "Papel timbrado, pasta para documentos, envelope e bloco", price: 320 },
    { id: "embalagem", name: "Embalagem / Sacola / Rótulo", desc: "Design técnico com faca especial para impressão e tags", price: 480 },
    { id: "uniforme", name: "Uniformes e Crachás", desc: "Camisetas, aventais, moletons ou identificação corporativa", price: 220 },
    { id: "catalogo", name: "Cardápio ou Catálogo de Produtos", desc: "Diagramação editorial profissional de até 8 páginas", price: 540 }
  ],

  // Adicionais Digitais & Redes Sociais
  digitalAddons: [
    { id: "feed_templates", name: "Pack 10 Templates Editáveis (Canva/Figma)", desc: "Posts e stories prontos e alinhados à nova identidade", price: 390 },
    { id: "destaques", name: "Capas de Destaques + Selos Reels", desc: "Kit com até 8 ícones personalizados para o Instagram", price: 180 },
    { id: "pitchdeck", name: "Apresentação Comercial (Pitch Deck)", desc: "Apresentação institucional em slides (até 12 páginas em PDF)", price: 520 },
    { id: "assinatura", name: "Assinatura de E-mail HTML", desc: "Design clicável com links para WhatsApp e redes sociais", price: 140 }
  ],

  // Prazos
  timelines: {
    standard: { id: "standard", name: "Padrão (15 a 25 dias úteis)", price: 0, desc: "Processo imersivo com tempo ideal de pesquisa e criação." },
    express: { id: "express", name: "Prioritário / Expresso (7 a 10 dias úteis)", price: 650, desc: "Fila exclusiva de desenvolvimento acelerado." }
  }
};

// Estado da Aplicação
class BudgetApp {
  constructor() {
    this.config = this.loadConfig();
    this.currentStep = 1;
    this.totalSteps = 6;
    
    this.state = {
      client: {
        name: "",
        company: "",
        niche: "",
        whatsapp: ""
      },
      selectedPackage: "pro", // Default recomendado
      selectedPrints: new Set(),
      selectedDigitals: new Set(),
      selectedTimeline: "standard"
    };

    this.init();
  }

  loadConfig() {
    try {
      const saved = localStorage.getItem("orcamento_id_config");
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Could not read config from localStorage:", e);
    }
    return DEFAULT_CONFIG;
  }

  saveConfig(newConfig) {
    this.config = newConfig;
    try {
      localStorage.setItem("orcamento_id_config", JSON.stringify(newConfig));
    } catch (e) {
      console.warn("Could not write to localStorage:", e);
    }
    this.render();
    this.updateCalculation();
  }

  init() {
    this.initVantaBackground();
    this.render();
    this.bindEvents();
    this.updateCalculation();
  }

  initVantaBackground() {
    // Tenta inicializar Vanta.NET se disponível
    try {
      if (window.VANTA && window.VANTA.NET) {
        window.VANTA.NET({
          el: "#vanta-background",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x52525b,
          backgroundColor: 0x070709,
          points: 9.0,
          maxDistance: 20.0,
          spacing: 17.0
        });
      }
    } catch (e) {
      console.log("Vanta background background running fallback glow effect:", e);
    }
  }

  bindEvents() {
    // Navegação Inferior
    const btnNext = document.getElementById("btn-next");
    const btnBack = document.getElementById("btn-back");

    if (btnNext) {
      btnNext.addEventListener("click", () => this.handleNextStep());
    }
    if (btnBack) {
      btnBack.addEventListener("click", () => this.handlePrevStep());
    }

    // Modal de Configurações
    const openSettingsBtn = document.getElementById("open-settings-btn");
    const closeSettingsBtn = document.getElementById("close-settings-btn");
    const settingsModal = document.getElementById("settings-modal");
    const saveSettingsBtn = document.getElementById("save-settings-btn");

    if (openSettingsBtn && settingsModal) {
      openSettingsBtn.addEventListener("click", () => {
        this.populateSettingsForm();
        settingsModal.classList.add("active");
      });
    }

    if (closeSettingsBtn && settingsModal) {
      closeSettingsBtn.addEventListener("click", () => {
        settingsModal.classList.remove("active");
      });
    }

    if (saveSettingsBtn && settingsModal) {
      saveSettingsBtn.addEventListener("click", () => {
        this.saveSettingsFromForm();
        settingsModal.classList.remove("active");
        this.showToast("Configurações atualizadas!");
      });
    }

    // Inputs do Passo 1
    const clientNameInput = document.getElementById("client-name");
    const clientCompanyInput = document.getElementById("client-company");
    const clientNicheInput = document.getElementById("client-niche");
    const clientPhoneInput = document.getElementById("client-phone");

    const updateClientBadge = () => {
      const handleEl = document.getElementById("client-handle-display");
      const avatarEl = document.getElementById("client-avatar-initial");
      const source = this.state.client.company || this.state.client.name;

      if (handleEl && avatarEl) {
        if (source) {
          const cleanHandle = source
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9_]/g, "");
          handleEl.textContent = `@${cleanHandle || "sua_marca"}`;
          avatarEl.textContent = source.charAt(0).toUpperCase();
        } else {
          handleEl.textContent = "@sua_marca";
          avatarEl.textContent = "✦";
        }
      }
    };

    if (clientNameInput) {
      clientNameInput.addEventListener("input", (e) => {
        this.state.client.name = e.target.value.trim();
        updateClientBadge();
        this.updateCalculation();
      });
    }
    if (clientCompanyInput) {
      clientCompanyInput.addEventListener("input", (e) => {
        this.state.client.company = e.target.value.trim();
        updateClientBadge();
        this.updateCalculation();
      });
    }
    if (clientNicheInput) {
      clientNicheInput.addEventListener("input", (e) => {
        this.state.client.niche = e.target.value.trim();
        this.updateCalculation();
      });
    }
    if (clientPhoneInput) {
      clientPhoneInput.addEventListener("input", (e) => {
        this.state.client.whatsapp = e.target.value.trim();
        this.updateCalculation();
      });
    }
  }

  handleNextStep() {
    if (this.currentStep === 1) {
      if (!this.state.client.name) {
        this.showToast("Por favor, digite seu nome para continuarmos.");
        const input = document.getElementById("client-name");
        if (input) input.focus();
        return;
      }
    }

    if (this.currentStep < this.totalSteps) {
      this.goToStep(this.currentStep + 1);
    }
  }

  handlePrevStep() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  }

  goToStep(stepNumber) {
    this.currentStep = stepNumber;

    // Atualiza panes
    document.querySelectorAll(".step-pane").forEach((pane) => {
      pane.classList.remove("active");
    });
    const targetPane = document.getElementById(`step-${stepNumber}`);
    if (targetPane) {
      targetPane.classList.add("active");
    }

    // Atualiza barra de progresso
    const progressFill = document.getElementById("progress-fill");
    const stepLabel = document.getElementById("step-label");
    const percent = (this.currentStep / this.totalSteps) * 100;
    
    if (progressFill) {
      progressFill.style.width = `${percent}%`;
    }
    if (stepLabel) {
      stepLabel.textContent = `ETAPA ${this.currentStep} DE ${this.totalSteps}`;
    }

    // Atualiza botões
    const btnBack = document.getElementById("btn-back");
    const btnNext = document.getElementById("btn-next");
    const bottomNav = document.getElementById("bottom-nav");

    if (btnBack) {
      btnBack.style.visibility = this.currentStep === 1 ? "hidden" : "visible";
    }

    if (btnNext) {
      if (this.currentStep === this.totalSteps) {
        btnNext.style.display = "none";
      } else {
        btnNext.style.display = "inline-flex";
        btnNext.innerHTML = `Continuar <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      }
    }

    // Scroll suave para o topo do conteúdo
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Se chegou no resumo final, renderiza
    if (this.currentStep === this.totalSteps) {
      this.renderSummary();
    }
  }

  render() {
    // Renderiza dados do estúdio no cabeçalho
    const brandNameEls = document.querySelectorAll(".brand-name-text");
    brandNameEls.forEach(el => el.textContent = this.config.designerName);

    const brandHandleEls = document.querySelectorAll(".brand-handle-text");
    brandHandleEls.forEach(el => el.textContent = this.config.designerHandle);

    // Renderiza Cards do Pacote Principal (Passo 2)
    this.renderPackages();

    // Renderiza Checklists de Adicionais (Passo 3 e 4)
    this.renderPrintAddons();
    this.renderDigitalAddons();

    // Renderiza Prazos (Passo 5)
    this.renderTimelines();
  }

  renderPackages() {
    const container = document.getElementById("packages-container");
    if (!container) return;

    container.innerHTML = "";
    Object.values(this.config.packages).forEach((pkg) => {
      const isSelected = this.state.selectedPackage === pkg.id;
      const card = document.createElement("div");
      card.className = `option-card ${isSelected ? "selected" : ""} ${pkg.popular ? "popular-tag" : ""}`;
      card.onclick = () => {
        this.state.selectedPackage = pkg.id;
        this.renderPackages();
        this.updateCalculation();
      };

      const featuresHtml = pkg.features
        .map(
          (feat) => `
        <li class="card-feature-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>${feat}</span>
        </li>`
        )
        .join("");

      card.innerHTML = `
        <div class="card-top">
          <div>
            <h3 class="card-title">${pkg.name}</h3>
            <p class="card-desc">${pkg.tagline}</p>
          </div>
          <div class="card-selector-icon">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        </div>
        <ul class="card-features">${featuresHtml}</ul>
        <div class="card-price-row">
          <div>
            <div class="card-price-note">Investimento</div>
            <div class="card-price-value">${this.formatCurrency(pkg.price)}</div>
          </div>
          <div class="card-price-note">ou em até ${this.config.maxInstallments}x no cartão</div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  renderPrintAddons() {
    const container = document.getElementById("print-addons-container");
    if (!container) return;

    container.innerHTML = "";
    this.config.printAddons.forEach((item) => {
      const isChecked = this.state.selectedPrints.has(item.id);
      const row = document.createElement("div");
      row.className = `checklist-item ${isChecked ? "selected" : ""}`;
      row.onclick = () => {
        if (this.state.selectedPrints.has(item.id)) {
          this.state.selectedPrints.delete(item.id);
        } else {
          this.state.selectedPrints.add(item.id);
        }
        this.renderPrintAddons();
        this.updateCalculation();
      };

      row.innerHTML = `
        <div class="checklist-left">
          <div class="custom-checkbox">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="checklist-info">
            <h4>${item.name}</h4>
            <p>${item.desc}</p>
          </div>
        </div>
        <div class="checklist-price">+ ${this.formatCurrency(item.price)}</div>
      `;
      container.appendChild(row);
    });
  }

  renderDigitalAddons() {
    const container = document.getElementById("digital-addons-container");
    if (!container) return;

    container.innerHTML = "";
    this.config.digitalAddons.forEach((item) => {
      const isChecked = this.state.selectedDigitals.has(item.id);
      const row = document.createElement("div");
      row.className = `checklist-item ${isChecked ? "selected" : ""}`;
      row.onclick = () => {
        if (this.state.selectedDigitals.has(item.id)) {
          this.state.selectedDigitals.delete(item.id);
        } else {
          this.state.selectedDigitals.add(item.id);
        }
        this.renderDigitalAddons();
        this.updateCalculation();
      };

      row.innerHTML = `
        <div class="checklist-left">
          <div class="custom-checkbox">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <div class="checklist-info">
            <h4>${item.name}</h4>
            <p>${item.desc}</p>
          </div>
        </div>
        <div class="checklist-price">+ ${this.formatCurrency(item.price)}</div>
      `;
      container.appendChild(row);
    });
  }

  renderTimelines() {
    const container = document.getElementById("timelines-container");
    if (!container) return;

    container.innerHTML = "";
    Object.values(this.config.timelines).forEach((timeline) => {
      const isSelected = this.state.selectedTimeline === timeline.id;
      const card = document.createElement("div");
      card.className = `option-card ${isSelected ? "selected" : ""}`;
      card.onclick = () => {
        this.state.selectedTimeline = timeline.id;
        this.renderTimelines();
        this.updateCalculation();
      };

      card.innerHTML = `
        <div class="card-top">
          <div>
            <h3 class="card-title">${timeline.name}</h3>
            <p class="card-desc">${timeline.desc}</p>
          </div>
          <div class="card-selector-icon">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
        </div>
        <div class="card-price-row">
          <div class="card-price-value">${timeline.price === 0 ? "Incluso" : "+ " + this.formatCurrency(timeline.price)}</div>
          <div class="card-price-note">${timeline.price === 0 ? "Prazo Padrão" : "Taxa Prioritária"}</div>
        </div>
      `;
      container.appendChild(card);
    });
  }

  calculateTotals() {
    // Pacote principal
    const pkg = this.config.packages[this.state.selectedPackage] || this.config.packages.pro;
    let total = pkg.price;

    // Impressos
    this.state.selectedPrints.forEach((id) => {
      const item = this.config.printAddons.find((p) => p.id === id);
      if (item) total += item.price;
    });

    // Digitais
    this.state.selectedDigitals.forEach((id) => {
      const item = this.config.digitalAddons.find((d) => d.id === id);
      if (item) total += item.price;
    });

    // Prazo
    const timeline = this.config.timelines[this.state.selectedTimeline];
    if (timeline) {
      total += timeline.price;
    }

    // PIX com desconto
    const pixDiscountAmount = total * (this.config.pixDiscountPercent / 100);
    const totalPix = total - pixDiscountAmount;

    // Parcelamento sem juros
    const installmentValue = total / this.config.maxInstallments;

    // 50% entrada + 50% entrega
    const splitPayment = total / 2;

    return {
      total,
      totalPix,
      pixDiscountAmount,
      installmentValue,
      splitPayment,
      packageItem: pkg,
      timelineItem: timeline
    };
  }

  updateCalculation() {
    const totals = this.calculateTotals();
    const liveTallyEl = document.getElementById("live-tally-value");
    if (liveTallyEl) {
      liveTallyEl.textContent = this.formatCurrency(totals.total);
    }
  }

  renderSummary() {
    const container = document.getElementById("summary-render-target");
    if (!container) return;

    const totals = this.calculateTotals();
    const client = this.state.client;

    // Itens impressos selecionados
    const printsList = Array.from(this.state.selectedPrints)
      .map((id) => this.config.printAddons.find((p) => p.id === id))
      .filter(Boolean);

    // Itens digitais selecionados
    const digitalsList = Array.from(this.state.selectedDigitals)
      .map((id) => this.config.digitalAddons.find((d) => d.id === id))
      .filter(Boolean);

    // Mensagem WhatsApp formatada
    const whatsappMessage = this.generateWhatsAppMessage(totals, printsList, digitalsList);
    const whatsappUrl = `https://wa.me/${this.config.whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    let breakdownItemsHtml = `
      <div class="breakdown-row main-item">
        <span>📦 ${totals.packageItem.name}</span>
        <span class="val">${this.formatCurrency(totals.packageItem.price)}</span>
      </div>
    `;

    printsList.forEach((item) => {
      breakdownItemsHtml += `
        <div class="breakdown-row">
          <span>• Impresso: ${item.name}</span>
          <span class="val">+ ${this.formatCurrency(item.price)}</span>
        </div>
      `;
    });

    digitalsList.forEach((item) => {
      breakdownItemsHtml += `
        <div class="breakdown-row">
          <span>• Digital: ${item.name}</span>
          <span class="val">+ ${this.formatCurrency(item.price)}</span>
        </div>
      `;
    });

    if (totals.timelineItem && totals.timelineItem.price > 0) {
      breakdownItemsHtml += `
        <div class="breakdown-row">
          <span>⚡ ${totals.timelineItem.name}</span>
          <span class="val">+ ${this.formatCurrency(totals.timelineItem.price)}</span>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="summary-container">
        <div class="summary-header-badge">
          ✨ PROPOSTA PERSONALIZADA
        </div>
        <h2 class="summary-proposal-title">Orçamento de Identidade Visual</h2>
        <div class="summary-client-meta">
          Preparado para <strong>${client.name || "Cliente"}</strong> ${client.company ? `• <strong>${client.company}</strong>` : ""} ${client.niche ? `(${client.niche})` : ""}
        </div>

        <div class="summary-divider"></div>

        <div class="summary-breakdown-list">
          ${breakdownItemsHtml}
        </div>

        <div class="pricing-banner">
          <div class="section-label">INVESTIMENTO TOTAL</div>
          <div class="pricing-main-price">
            <span class="pricing-amount">${this.formatCurrency(totals.total)}</span>
          </div>
          <div class="pricing-condition">
            ou até <strong>${this.config.maxInstallments}x de ${this.formatCurrency(totals.installmentValue)} sem juros</strong> no cartão
          </div>
        </div>

        <div class="payment-methods-grid">
          <div class="pay-card">
            <div class="pay-card-label">À Vista via PIX (-${this.config.pixDiscountPercent}%)</div>
            <div class="pay-card-val" style="color: #4ade80;">${this.formatCurrency(totals.totalPix)}</div>
            <div class="pay-card-sub">Economia de ${this.formatCurrency(totals.pixDiscountAmount)}</div>
          </div>

          <div class="pay-card">
            <div class="pay-card-label">Parcelado no Cartão</div>
            <div class="pay-card-val">${this.config.maxInstallments}x de ${this.formatCurrency(totals.installmentValue)}</div>
            <div class="pay-card-sub">Sem acréscimo / Sem juros</div>
          </div>

          <div class="pay-card">
            <div class="pay-card-label">Entrada + Aprovação</div>
            <div class="pay-card-val">2x de ${this.formatCurrency(totals.splitPayment)}</div>
            <div class="pay-card-sub">50% no início e 50% na entrega</div>
          </div>

          <div class="pay-card">
            <div class="pay-card-label">Prazo Estimado</div>
            <div class="pay-card-val">${totals.timelineItem.name.split("(")[0]}</div>
            <div class="pay-card-sub">${totals.timelineItem.name.includes("(") ? totals.timelineItem.name.split("(")[1].replace(")", "") : "Sob consulta"}</div>
          </div>
        </div>

        <div class="installment-slider-wrapper">
          <div class="installment-slider-header">
            <span>Simulador de Parcelas no Cartão:</span>
            <span class="installment-calc-highlight" id="installment-calc-display">${this.config.maxInstallments}x de ${this.formatCurrency(totals.installmentValue)} sem juros</span>
          </div>
          <input type="range" class="installment-range-input" id="installment-slider" min="1" max="${this.config.maxInstallments}" value="${this.config.maxInstallments}">
        </div>

        <div class="summary-actions">
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary-action btn-whatsapp">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-12.416c-5.514 0-10 4.486-10 10 0 1.956.57 3.78 1.558 5.323l-1.597 5.845 6.002-1.574c1.484.887 3.226 1.406 5.037 1.406 5.514 0 10-4.486 10-10s-4.486-10-10-10z"/></svg>
            Enviar Orçamento no WhatsApp
          </a>

          <button id="copy-summary-btn" class="btn-secondary-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copiar Resumo
          </button>

          <button id="print-proposal-btn" class="btn-secondary-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Salvar PDF
          </button>
        </div>

        <div style="text-align: center; margin-top: 18px;">
          <button id="restart-btn" style="background: none; border: none; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; text-decoration: underline;">
            ↺ Refazer simulação ou alterar itens
          </button>
        </div>
      </div>
    `;

    // Bind botões do resumo
    const copyBtn = document.getElementById("copy-summary-btn");
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(whatsappMessage).then(() => {
          this.showToast("Resumo copiado para a área de transferência!");
        });
      };
    }

    const printProposalBtn = document.getElementById("print-proposal-btn");
    if (printProposalBtn) {
      printProposalBtn.onclick = () => {
        window.print();
      };
    }

    const installmentSlider = document.getElementById("installment-slider");
    const installmentDisplay = document.getElementById("installment-calc-display");
    if (installmentSlider && installmentDisplay) {
      installmentSlider.addEventListener("input", (e) => {
        const count = parseInt(e.target.value, 10);
        const parcelVal = totals.total / count;
        installmentDisplay.textContent = `${count}x de ${this.formatCurrency(parcelVal)} sem juros`;
      });
    }

    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
      restartBtn.onclick = () => {
        this.goToStep(1);
      };
    }
  }

  generateWhatsAppMessage(totals, printsList, digitalsList) {
    const c = this.state.client;
    let text = `*SOLICITAÇÃO DE ORÇAMENTO - IDENTIDADE VISUAL*\n\n`;
    text += `👤 *Cliente:* ${c.name || "Não informado"}\n`;
    if (c.company) text += `🏢 *Projeto/Empresa:* ${c.company}\n`;
    if (c.niche) text += `🎯 *Segmento:* ${c.niche}\n`;
    if (c.whatsapp) text += `📱 *WhatsApp do Cliente:* ${c.whatsapp}\n`;

    text += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📦 *ESCOPO DO PROJETO*\n`;
    text += `• *${totals.packageItem.name}* (${this.formatCurrency(totals.packageItem.price)})\n`;

    if (printsList.length > 0) {
      text += `\n📄 *Materiais Gráficos / Impressos:*\n`;
      printsList.forEach((p) => {
        text += `  + ${p.name} (${this.formatCurrency(p.price)})\n`;
      });
    }

    if (digitalsList.length > 0) {
      text += `\n📱 *Materiais Digitais / Redes:*\n`;
      digitalsList.forEach((d) => {
        text += `  + ${d.name} (${this.formatCurrency(d.price)})\n`;
      });
    }

    text += `\n⏱ *Prazo Escolhido:* ${totals.timelineItem.name}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 *VALOR TOTAL:* ${this.formatCurrency(totals.total)}\n\n`;
    text += `💳 *Condições de Pagamento:*\n`;
    text += `1️⃣ À vista via PIX (-${this.config.pixDiscountPercent}%): *${this.formatCurrency(totals.totalPix)}*\n`;
    text += `2️⃣ Cartão de Crédito: *em até ${this.config.maxInstallments}x de ${this.formatCurrency(totals.installmentValue)} sem juros*\n`;
    text += `3️⃣ Entrada + Entrega: *50% no início (${this.formatCurrency(totals.splitPayment)}) e 50% na aprovação final*\n\n`;
    text += `Olá ${this.config.designerName}! Gostaria de tirar dúvidas e dar o próximo passo com essa proposta.`;

    return text;
  }

  populateSettingsForm() {
    const designerInput = document.getElementById("set-designer-name");
    const handleInput = document.getElementById("set-designer-handle");
    const phoneInput = document.getElementById("set-whatsapp-phone");
    const installmentsInput = document.getElementById("set-max-installments");
    const pixDiscountInput = document.getElementById("set-pix-discount");
    const priceEssentialInput = document.getElementById("set-price-essential");
    const priceProInput = document.getElementById("set-price-pro");
    const priceStrategicInput = document.getElementById("set-price-strategic");

    if (designerInput) designerInput.value = this.config.designerName;
    if (handleInput) handleInput.value = this.config.designerHandle;
    if (phoneInput) phoneInput.value = this.config.whatsappPhone;
    if (installmentsInput) installmentsInput.value = this.config.maxInstallments;
    if (pixDiscountInput) pixDiscountInput.value = this.config.pixDiscountPercent;
    if (priceEssentialInput) priceEssentialInput.value = this.config.packages.essential.price;
    if (priceProInput) priceProInput.value = this.config.packages.pro.price;
    if (priceStrategicInput) priceStrategicInput.value = this.config.packages.strategic.price;
  }

  saveSettingsFromForm() {
    const designerName = document.getElementById("set-designer-name")?.value.trim() || this.config.designerName;
    const designerHandle = document.getElementById("set-designer-handle")?.value.trim() || this.config.designerHandle;
    let whatsappPhone = document.getElementById("set-whatsapp-phone")?.value.replace(/\D/g, "") || this.config.whatsappPhone;
    const maxInstallments = parseInt(document.getElementById("set-max-installments")?.value, 10) || this.config.maxInstallments;
    const pixDiscountPercent = parseInt(document.getElementById("set-pix-discount")?.value, 10) || this.config.pixDiscountPercent;
    
    const priceEssential = parseInt(document.getElementById("set-price-essential")?.value, 10) || this.config.packages.essential.price;
    const pricePro = parseInt(document.getElementById("set-price-pro")?.value, 10) || this.config.packages.pro.price;
    const priceStrategic = parseInt(document.getElementById("set-price-strategic")?.value, 10) || this.config.packages.strategic.price;

    const updatedPackages = { ...this.config.packages };
    updatedPackages.essential = { ...updatedPackages.essential, price: priceEssential };
    updatedPackages.pro = { ...updatedPackages.pro, price: pricePro };
    updatedPackages.strategic = { ...updatedPackages.strategic, price: priceStrategic };

    this.saveConfig({
      ...this.config,
      designerName,
      designerHandle,
      whatsappPhone,
      maxInstallments,
      pixDiscountPercent,
      packages: updatedPackages
    });
  }

  formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  showToast(msg) {
    let toast = document.getElementById("app-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast";
      toast.className = "toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }
}

// Inicializa a aplicação quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  window.budgetApp = new BudgetApp();
});

