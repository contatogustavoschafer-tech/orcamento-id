// ========================================================
// CONFIGURAÇÃO DO PROFISSIONAL (Altere seu WhatsApp aqui)
// ========================================================
const STUDIO_CONFIG = {
  designerName: "Gustavo",
  whatsappPhone: "5588921693022", // Coloque seu DDD + Número aqui (Ex: 5581999999999)
  maxInstallments: 6,             // Até 6x sem juros no cartão
  pixDiscountPercent: 10,         // 10% de desconto no PIX

  // 2 Planos Principais (Preços baixos e acessíveis)
  packages: {
    essential: {
      id: "essential",
      name: "Identidade Essencial",
      tagline: "O ponto de partida ideal para ter um visual profissional e confiável.",
      price: 500, // R$ 500 no cartão ou R$ 450 no PIX
      features: [
        "Logotipo principal + variações de aplicação",
        "Paleta de cores estratégica com códigos HEX/RGB",
        "Seleção de fontes institucionais da marca",
        "Arquivos finais em alta resolução (.PNG sem fundo e .PDF vetor)"
      ]
    },
    pro: {
      id: "pro",
      name: "Identidade Completa (Pro)",
      tagline: "Pacote completo para quem deseja se destacar com autoridade e presença visual marcante.",
      popular: true,
      price: 700, // R$ 700 no cartão ou R$ 630 no PIX
      features: [
        "Tudo do plano Essencial",
        "Submarcas e selos circulares de assinatura",
        "Padrão gráfico exclusivo (Pattern / Estampa da marca)",
        "Manual de Identidade Visual simplificado (guia prático de aplicação)"
      ]
    }
  },

  // Adicionais enxutos (SEM exibição de preço durante a seleção)
  addons: [
    {
      id: "papelaria",
      name: "Papelaria Essencial",
      desc: "Design de cartão de visita executivo e modelo de papel timbrado digital.",
      percentRate: 0.15, // +15% no cálculo final
      fixedPrice: 75
    },
    {
      id: "pack_posts",
      name: "Pack 3 Posts / Templates Editáveis",
      desc: "3 artes profissionais alinhadas à sua nova identidade com modelo editável.",
      percentRate: 0.15, // +15% no cálculo final
      fixedPrice: 75
    },
    {
      id: "destaques",
      name: "Capas de Destaques para Instagram",
      desc: "Kit com 6 ícones personalizados para organizar e padronizar os destaques do seu perfil.",
      percentRate: 0,
      fixedPrice: 50
    }
  ],

  // Prazos de Entrega
  timelines: {
    standard: {
      id: "standard",
      name: "Prazo Padrão (10 a 15 dias úteis)",
      desc: "Tempo ideal e calmo para pesquisa, conceito e refinamento da sua marca.",
      price: 0
    },
    express: {
      id: "express",
      name: "Prazo Expresso (5 a 7 dias úteis)",
      desc: "Desenvolvimento prioritário acelerado com foco total na sua entrega.",
      price: 70
    }
  }
};

class BudgetApp {
  constructor() {
    this.config = STUDIO_CONFIG;
    this.currentStep = 1;
    this.totalSteps = 5;

    this.state = {
      client: {
        name: "",
        company: "",
        niche: "",
        whatsapp: ""
      },
      selectedPackage: "pro", // Default Pro
      selectedAddons: new Set(),
      selectedTimeline: "standard"
    };

    this.init();
  }

  init() {
    this.initVantaBackground();
    this.render();
    this.bindEvents();
    this.updateStepIndicator();
  }

  initVantaBackground() {
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
          points: 8.0,
          maxDistance: 19.0,
          spacing: 18.0
        });
      }
    } catch (e) {
      console.log("Fallback glowing ambient orbs ativo");
    }
  }

  bindEvents() {
    const btnNext = document.getElementById("btn-next");
    const btnBack = document.getElementById("btn-back");

    if (btnNext) {
      btnNext.addEventListener("click", () => this.handleNextStep());
    }
    if (btnBack) {
      btnBack.addEventListener("click", () => this.handlePrevStep());
    }

    // Inputs da Etapa 1
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
          const clean = source
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9_]/g, "");
          handleEl.textContent = `@${clean || "sua_marca"}`;
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
      });
    }
    if (clientCompanyInput) {
      clientCompanyInput.addEventListener("input", (e) => {
        this.state.client.company = e.target.value.trim();
        updateClientBadge();
      });
    }
    if (clientNicheInput) {
      clientNicheInput.addEventListener("input", (e) => {
        this.state.client.niche = e.target.value.trim();
      });
    }
    if (clientPhoneInput) {
      clientPhoneInput.addEventListener("input", (e) => {
        this.state.client.whatsapp = e.target.value.trim();
      });
    }
  }

  handleNextStep() {
    if (this.currentStep === 1) {
      if (!this.state.client.name) {
        this.showToast("Por favor, digite seu nome para continuar.");
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

    document.querySelectorAll(".step-pane").forEach((pane) => {
      pane.classList.remove("active");
    });
    const targetPane = document.getElementById(`step-${stepNumber}`);
    if (targetPane) {
      targetPane.classList.add("active");
    }

    this.updateStepIndicator();

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Se chegou na proposta final, renderiza os totais e botões
    if (this.currentStep === this.totalSteps) {
      this.renderSummary();
    }
  }

  updateStepIndicator() {
    const progressFill = document.getElementById("progress-fill");
    const stepLabel = document.getElementById("step-label");
    const bottomStepText = document.getElementById("bottom-step-text");
    const percent = (this.currentStep / this.totalSteps) * 100;

    if (progressFill) progressFill.style.width = `${percent}%`;
    if (stepLabel) stepLabel.textContent = `ETAPA ${this.currentStep} DE ${this.totalSteps}`;
    if (bottomStepText) bottomStepText.textContent = `Etapa ${this.currentStep} de ${this.totalSteps}`;

    const btnBack = document.getElementById("btn-back");
    const btnNext = document.getElementById("btn-next");

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
  }

  render() {
    this.renderPackages();
    this.renderAddons();
    this.renderTimelines();
  }

  // Renderiza os 2 Planos SEM MOSTRAR PREÇOS
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
        <div style="margin-top: auto; padding-top: 14px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 0.78rem; color: #a1a1aa;">
          ✦ Clique para selecionar este plano
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Renderiza Adicionais SEM MOSTRAR PREÇOS
  renderAddons() {
    const container = document.getElementById("addons-container");
    if (!container) return;

    container.innerHTML = "";
    this.config.addons.forEach((item) => {
      const isChecked = this.state.selectedAddons.has(item.id);
      const row = document.createElement("div");
      row.className = `checklist-item ${isChecked ? "selected" : ""}`;
      row.onclick = () => {
        if (this.state.selectedAddons.has(item.id)) {
          this.state.selectedAddons.delete(item.id);
        } else {
          this.state.selectedAddons.add(item.id);
        }
        this.renderAddons();
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
        <div style="font-size: 0.75rem; color: var(--accent-amber); font-weight: 600;">
          ${isChecked ? "Selecionado" : "Adicionar"}
        </div>
      `;
      container.appendChild(row);
    });
  }

  // Renderiza Prazos SEM MOSTRAR PREÇOS
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
        <div style="margin-top: auto; padding-top: 12px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 0.78rem; color: #a1a1aa;">
          ${timeline.price === 0 ? "Entrega Regular" : "Fila Prioritária"}
        </div>
      `;
      container.appendChild(card);
    });
  }

  // Cálculo Dinâmico no Final
  calculateTotals() {
    const pkg = this.config.packages[this.state.selectedPackage] || this.config.packages.pro;
    let basePrice = pkg.price;
    let total = basePrice;

    // Soma adicionais (com base fixa ou % sobre o plano)
    const selectedAddonsList = [];
    this.state.selectedAddons.forEach((id) => {
      const addon = this.config.addons.find((a) => a.id === id);
      if (addon) {
        const itemVal = addon.percentRate > 0 ? Math.round(basePrice * addon.percentRate) : addon.fixedPrice;
        total += itemVal;
        selectedAddonsList.push({ ...addon, calculatedPrice: itemVal });
      }
    });

    // Prazo
    const timeline = this.config.timelines[this.state.selectedTimeline] || this.config.timelines.standard;
    total += timeline.price;

    // Desconto no PIX (10%)
    const pixDiscountAmount = Math.round(total * (this.config.pixDiscountPercent / 100));
    const totalPix = total - pixDiscountAmount;

    // Parcelamento em até X vezes sem juros
    const maxParcels = this.config.maxInstallments;
    const installmentValue = Math.round(total / maxParcels);

    // Entrada 50% + 50%
    const splitPayment = Math.round(total / 2);

    return {
      total,
      totalPix,
      pixDiscountAmount,
      maxParcels,
      installmentValue,
      splitPayment,
      packageItem: pkg,
      addonsList: selectedAddonsList,
      timelineItem: timeline
    };
  }

  // Renderiza Proposta Final (Etapa 5)
  renderSummary() {
    const container = document.getElementById("summary-render-target");
    if (!container) return;

    const totals = this.calculateTotals();
    const client = this.state.client;

    const whatsappMessage = this.generateWhatsAppMessage(totals);
    const whatsappUrl = `https://wa.me/${this.config.whatsappPhone}?text=${encodeURIComponent(whatsappMessage)}`;

    let breakdownHtml = `
      <div class="breakdown-row main-item">
        <span>📦 ${totals.packageItem.name}</span>
        <span class="val">${this.formatCurrency(totals.packageItem.price)}</span>
      </div>
    `;

    totals.addonsList.forEach((item) => {
      breakdownHtml += `
        <div class="breakdown-row">
          <span>+ ${item.name}</span>
          <span class="val">+ ${this.formatCurrency(item.calculatedPrice)}</span>
        </div>
      `;
    });

    if (totals.timelineItem.price > 0) {
      breakdownHtml += `
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
          ${breakdownHtml}
        </div>

        <div class="pricing-banner">
          <div class="section-label">VALOR DO PROJETO</div>
          <div class="pricing-main-price">
            <span class="pricing-amount">${this.formatCurrency(totals.total)}</span>
          </div>
          <div class="pricing-condition">
            ou em até <strong>${totals.maxParcels}x de ${this.formatCurrency(totals.installmentValue)} sem juros</strong> no cartão
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
            <div class="pay-card-val">${totals.maxParcels}x de ${this.formatCurrency(totals.installmentValue)}</div>
            <div class="pay-card-sub">Sem juros</div>
          </div>

          <div class="pay-card">
            <div class="pay-card-label">Entrada + Aprovação</div>
            <div class="pay-card-val">2x de ${this.formatCurrency(totals.splitPayment)}</div>
            <div class="pay-card-sub">50% no início e 50% na aprovação</div>
          </div>

          <div class="pay-card">
            <div class="pay-card-label">Prazo Estimado</div>
            <div class="pay-card-val">${totals.timelineItem.name.split("(")[0]}</div>
            <div class="pay-card-sub">${totals.timelineItem.name.includes("(") ? totals.timelineItem.name.split("(")[1].replace(")", "") : "Entrega regular"}</div>
          </div>
        </div>

        <div class="installment-slider-wrapper">
          <div class="installment-slider-header">
            <span>Simular parcelas no cartão:</span>
            <span class="installment-calc-highlight" id="installment-calc-display">${totals.maxParcels}x de ${this.formatCurrency(totals.installmentValue)} sem juros</span>
          </div>
          <input type="range" class="installment-range-input" id="installment-slider" min="1" max="${totals.maxParcels}" value="${totals.maxParcels}">
        </div>

        <div class="summary-actions">
          <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn-primary-action btn-whatsapp">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824zm-3.392-12.416c-5.514 0-10 4.486-10 10 0 1.956.57 3.78 1.558 5.323l-1.597 5.845 6.002-1.574c1.484.887 3.226 1.406 5.037 1.406 5.514 0 10-4.486 10-10s-4.486-10-10-10z"/></svg>
            Enviar Orçamento no WhatsApp
          </a>

          <button id="print-proposal-btn" class="btn-secondary-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
            Baixar Proposta (PDF)
          </button>

          <button id="copy-summary-btn" class="btn-secondary-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            Copiar Resumo
          </button>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <button id="restart-btn" style="background: none; border: none; color: var(--text-muted); font-size: 0.8rem; cursor: pointer; text-decoration: underline;">
            ↺ Refazer simulação ou alterar itens
          </button>
        </div>
      </div>
    `;

    // Slider de parcelas
    const slider = document.getElementById("installment-slider");
    const display = document.getElementById("installment-calc-display");
    if (slider && display) {
      slider.addEventListener("input", (e) => {
        const count = parseInt(e.target.value, 10);
        const parcelVal = Math.round(totals.total / count);
        display.textContent = `${count}x de ${this.formatCurrency(parcelVal)} sem juros`;
      });
    }

    // Botão de PDF
    const printBtn = document.getElementById("print-proposal-btn");
    if (printBtn) {
      printBtn.onclick = () => {
        window.print();
      };
    }

    // Copiar
    const copyBtn = document.getElementById("copy-summary-btn");
    if (copyBtn) {
      copyBtn.onclick = () => {
        navigator.clipboard.writeText(whatsappMessage).then(() => {
          this.showToast("Resumo copiado com sucesso!");
        });
      };
    }

    // Reiniciar
    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
      restartBtn.onclick = () => {
        this.goToStep(1);
      };
    }
  }

  generateWhatsAppMessage(totals) {
    const c = this.state.client;
    let text = `*SOLICITAÇÃO DE ORÇAMENTO - IDENTIDADE VISUAL*\n\n`;
    text += `👤 *Cliente:* ${c.name || "Não informado"}\n`;
    if (c.company) text += `🏢 *Projeto/Empresa:* ${c.company}\n`;
    if (c.niche) text += `🎯 *Segmento:* ${c.niche}\n`;
    if (c.whatsapp) text += `📱 *WhatsApp do Cliente:* ${c.whatsapp}\n`;

    text += `\n━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📦 *ESCOPO ESCOLHIDO*\n`;
    text += `• *${totals.packageItem.name}* (${this.formatCurrency(totals.packageItem.price)})\n`;

    if (totals.addonsList.length > 0) {
      text += `\n✨ *Materiais Extras Adicionados:*\n`;
      totals.addonsList.forEach((a) => {
        text += `  + ${a.name} (${this.formatCurrency(a.calculatedPrice)})\n`;
      });
    }

    text += `\n⏱ *Prazo:* ${totals.timelineItem.name}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `💰 *VALOR TOTAL:* ${this.formatCurrency(totals.total)}\n\n`;
    text += `💳 *Formas de Pagamento:*\n`;
    text += `1️⃣ À vista via PIX (-${this.config.pixDiscountPercent}%): *${this.formatCurrency(totals.totalPix)}*\n`;
    text += `2️⃣ Cartão de Crédito: *em até ${totals.maxParcels}x de ${this.formatCurrency(totals.installmentValue)} sem juros*\n`;
    text += `3️⃣ Entrada + Aprovação: *50% no início (${this.formatCurrency(totals.splitPayment)}) e 50% na aprovação final*\n\n`;
    text += `Olá ${this.config.designerName}! Gostaria de tirar dúvidas e dar o próximo passo com essa proposta.`;

    return text;
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

document.addEventListener("DOMContentLoaded", () => {
  window.budgetApp = new BudgetApp();
});
