/* ==========================================================================
   Aashna Gupta — Portfolio Interactive Logic & Financial Visualizations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Mobile Navigation Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on clicking any navigation link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Toast Notification Utility
  window.showToast = function(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (!toast || !toastMessage) return;

    toastMessage.textContent = message;
    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.add('translate-y-24', 'opacity-0');
      toast.classList.remove('translate-y-0', 'opacity-100');
    }, 3200);
  };

  // Copy to Clipboard Utility
  window.copyToClipboard = function(text, label = 'Copied') {
    navigator.clipboard.writeText(text).then(() => {
      window.showToast(`${label} copied to clipboard!`);
    }).catch(() => {
      // Fallback
      window.showToast(`Value: ${text}`);
    });
  };

  // ==========================================================================
  // Financial Valuation Scenarios Data & Engine (ITC Limited DCF Model)
  // Based on Aashna's Academic Capstone Valuation
  // ==========================================================================
  const valuationScenarios = {
    base: {
      label: 'Base Case (Target)',
      wacc: '11.20%',
      terminalGrowth: '5.50%',
      targetPrice: '₹485.50',
      currentPrice: '₹412.00',
      upside: '+17.8%',
      impliedEV: '₹5,96,400 Cr',
      peMultiple: '27.4x',
      evEbitda: '20.8x',
      chartData: [412, 452, 485.5, 520]
    },
    optimistic: {
      label: 'Bull Case (FMCG Margin Expansion)',
      wacc: '10.80%',
      terminalGrowth: '6.00%',
      targetPrice: '₹545.00',
      currentPrice: '₹412.00',
      upside: '+32.3%',
      impliedEV: '₹6,68,200 Cr',
      peMultiple: '30.2x',
      evEbitda: '23.1x',
      chartData: [412, 480, 545.0, 590]
    },
    conservative: {
      label: 'Bear Case (Tax Headwinds / Higher WACC)',
      wacc: '11.80%',
      terminalGrowth: '5.00%',
      targetPrice: '₹435.00',
      currentPrice: '₹412.00',
      upside: '+5.6%',
      impliedEV: '₹5,38,000 Cr',
      peMultiple: '24.1x',
      evEbitda: '18.4x',
      chartData: [412, 425, 435.0, 460]
    }
  };

  let itcChartInstance = null;
  let segmentChartInstance = null;

  // Initialize ITC Valuation Chart
  const initITCChart = () => {
    const ctx = document.getElementById('itcValuationChart');
    if (!ctx) return;

    const data = valuationScenarios.base;

    itcChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Current Market Price', 'CCA (Trading Comps)', 'DCF Implied Value', 'Consensus Analyst High'],
        datasets: [{
          label: 'Price per Share (₹)',
          data: data.chartData,
          backgroundColor: [
            'rgba(148, 163, 184, 0.4)', // Slate
            'rgba(6, 182, 212, 0.65)',   // Cyan
            'rgba(16, 185, 129, 0.85)',  // Emerald
            'rgba(245, 158, 11, 0.5)'    // Gold
          ],
          borderColor: [
            '#94A3B8',
            '#06B6D4',
            '#10B981',
            '#F59E0B'
          ],
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#0F172A',
            borderColor: '#1E293B',
            borderWidth: 1,
            titleColor: '#F8FAFC',
            bodyColor: '#10B981',
            padding: 12,
            callbacks: {
              label: (context) => ` Value: ₹${context.raw.toFixed(2)} per share`
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#94A3B8', font: { size: 11, family: 'Inter' } }
          },
          y: {
            min: 350,
            max: 620,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#94A3B8',
              font: { size: 11, family: 'JetBrains Mono' },
              callback: (value) => '₹' + value
            }
          }
        }
      }
    });
  };

  // Initialize Segment Breakdown Chart
  const initSegmentChart = () => {
    const ctx = document.getElementById('itcSegmentChart');
    if (!ctx) return;

    segmentChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Cigarettes', 'FMCG - Others', 'Agri-Business', 'Paperboards & Packaging', 'Hotels & Other'],
        datasets: [{
          data: [42, 27, 18, 9, 4],
          backgroundColor: [
            '#10B981', // Emerald
            '#06B6D4', // Cyan
            '#F59E0B', // Gold
            '#818CF8', // Indigo
            '#EC4899'  // Pink
          ],
          borderWidth: 2,
          borderColor: '#0F172A'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#94A3B8',
              boxWidth: 12,
              padding: 12,
              font: { size: 11, family: 'Inter' }
            }
          },
          tooltip: {
            backgroundColor: '#0F172A',
            borderColor: '#1E293B',
            borderWidth: 1,
            callbacks: {
              label: (context) => ` ${context.label}: ${context.raw}% Revenue Contribution`
            }
          }
        },
        cutout: '70%'
      }
    });
  };

  // Switch Scenario Handler
  window.setValuationScenario = function(scenarioKey) {
    const scenario = valuationScenarios[scenarioKey];
    if (!scenario) return;

    // Update active tab buttons
    document.querySelectorAll('.scenario-btn').forEach(btn => {
      btn.classList.remove('bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/40');
      btn.classList.add('bg-slate-800/40', 'text-slate-400', 'border-white/5');
    });

    const activeBtn = document.getElementById(`scenario-${scenarioKey}`);
    if (activeBtn) {
      activeBtn.classList.remove('bg-slate-800/40', 'text-slate-400', 'border-white/5');
      activeBtn.classList.add('bg-emerald-500/20', 'text-emerald-300', 'border-emerald-500/40');
    }

    // Update Text Elements
    document.getElementById('scen-wacc').textContent = scenario.wacc;
    document.getElementById('scen-tg').textContent = scenario.terminalGrowth;
    document.getElementById('scen-target').textContent = scenario.targetPrice;
    document.getElementById('scen-upside').textContent = scenario.upside;
    document.getElementById('scen-ev').textContent = scenario.impliedEV;
    document.getElementById('scen-pe').textContent = scenario.peMultiple;

    // Update Chart
    if (itcChartInstance) {
      itcChartInstance.data.datasets[0].data = scenario.chartData;
      itcChartInstance.update();
    }
  };

  // Initial chart load
  if (typeof Chart !== 'undefined') {
    initITCChart();
    initSegmentChart();
  }

  // ==========================================================================
  // Project Modals Controller
  // ==========================================================================
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  // Close modal when clicking outside content
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
      }
    });
  });

  // ==========================================================================
  // Excel Spreadsheet Multi-Tab Controller
  // ==========================================================================
  const excelFormulas = {
    dcf: 'Cell E26: =E24/(1+$B$14)^E25 (Present Value of Explicit FCFF)',
    cca: 'Cell E4: =AVERAGE(E5:E9) (Peer Median EV/EBITDA Multiple Benchmark)',
    statements: 'Cell B28: =B24-B25-B26 (Operating Free Cash Flow Integration)',
    altman: 'Cell E15: =1.2*B10+1.4*B11+3.3*B12+0.6*B13+0.999*B14 (Composite Z-Score: 4.82 Safe)'
  };

  window.switchExcelTab = function(tabKey) {
    // Hide all panels
    document.querySelectorAll('.excel-tab-panel').forEach(panel => {
      panel.classList.add('hidden');
    });

    // Reset all tab button styles
    document.querySelectorAll('.excel-tab-btn').forEach(btn => {
      btn.classList.remove('border-emerald-500/40', 'bg-[#0F172A]', 'text-emerald-300');
      btn.classList.add('border-transparent', 'text-slate-400');
    });

    // Show selected panel
    const selectedPanel = document.getElementById(`excel-panel-${tabKey}`);
    if (selectedPanel) {
      selectedPanel.classList.remove('hidden');
    }

    // Activate selected button
    const selectedBtn = document.getElementById(`excel-tab-${tabKey}`);
    if (selectedBtn) {
      selectedBtn.classList.remove('border-transparent', 'text-slate-400');
      selectedBtn.classList.add('border-emerald-500/40', 'bg-[#0F172A]', 'text-emerald-300');
    }

    // Update formula bar text
    const formulaDisplay = document.getElementById('excel-formula-display');
    if (formulaDisplay && excelFormulas[tabKey]) {
      formulaDisplay.textContent = excelFormulas[tabKey];
    }
  };

  // Contact Form Auto-Mailto Trigger
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value || 'Opportunity / Discussion';
      const message = document.getElementById('form-message').value;

      const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
      const mailtoUrl = `mailto:aashna1414@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

      window.location.href = mailtoUrl;
      window.showToast('Launching email client with your message...');
    });
  }
});
