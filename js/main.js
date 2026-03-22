// Cherry Digital Pros — AI Dark Theme JS v2.1 (animation fix)

document.addEventListener('DOMContentLoaded', function () {

  // ---- MOBILE NAV ----
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('main-nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => nav.classList.toggle('open'));
  }

  // Active nav link
  const links = document.querySelectorAll('nav ul li a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  // ---- COUNTDOWN TIMER (persists across reloads via localStorage) ----
  function startCountdown() {
    const hoursEl = document.getElementById('cd-hours');
    const minsEl  = document.getElementById('cd-mins');
    const secsEl  = document.getElementById('cd-secs');
    if (!hoursEl) return;

    const KEY      = 'cdp_countdown_end';
    const DURATION = 24 * 3600 * 1000; // 24 hours in ms
    let endTime    = parseInt(localStorage.getItem(KEY) || '0');

    if (!endTime || endTime < Date.now()) {
      endTime = Date.now() + DURATION;
      localStorage.setItem(KEY, endTime);
    }

    function tick() {
      const remaining = Math.max(0, endTime - Date.now());
      if (remaining === 0) {
        endTime = Date.now() + DURATION;
        localStorage.setItem(KEY, endTime);
      }
      const totalSecs = Math.floor(remaining / 1000);
      const h = Math.floor(totalSecs / 3600);
      const m = Math.floor((totalSecs % 3600) / 60);
      const s = totalSecs % 60;
      hoursEl.textContent = String(h).padStart(2, '0');
      minsEl.textContent  = String(m).padStart(2, '0');
      secsEl.textContent  = String(s).padStart(2, '0');
    }
    tick();
    setInterval(tick, 1000);
  }
  startCountdown();

  // ---- ANIMATED STATS COUNTER (triggers when scrolled into view) ----
  function animateCounter(el) {
    if (el.dataset.animated) return; // prevent double-fire
    el.dataset.animated = '1';
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    let current  = 0;
    const step   = Math.max(1, Math.ceil(target / 80));
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + suffix;
      if (current >= target) clearInterval(timer);
    }, 18);
  }

  const statEls = document.querySelectorAll('.stat-num[data-target]');
  if (statEls.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    statEls.forEach(el => statObserver.observe(el));
  }

  // ---- ANIMATED TERMINAL (triggers when scrolled into view, loops) ----
  const termBody = document.getElementById('terminal-body');
  if (termBody) {
    const lines = [
      { text: '$ Initializing Cherry Digital Pros diagnostics...', type: 'prompt', delay: 0 },
      { text: '> Scanning hardware components...', type: 'info', delay: 500 },
      { text: '✓ CPU: Intel Core i7 — Optimal performance', type: 'success', delay: 1100 },
      { text: '✓ RAM: 16GB DDR4 — Healthy', type: 'success', delay: 1600 },
      { text: '✓ Storage: 512GB SSD — 78% Free', type: 'success', delay: 2100 },
      { text: '> Running malware & virus scan...', type: 'info', delay: 2700 },
      { text: '✓ System clean — No threats detected', type: 'success', delay: 3500 },
      { text: '> Optimizing startup programs...', type: 'info', delay: 4100 },
      { text: '✓ Boot time reduced by 45%', type: 'success', delay: 4800 },
      { text: '> Cleaning temporary files...', type: 'info', delay: 5400 },
      { text: '✓ Recovered 12.4GB disk space', type: 'success', delay: 6100 },
      { text: '> Checking network connectivity...', type: 'info', delay: 6700 },
      { text: '✓ Network: Stable — 250 Mbps', type: 'success', delay: 7400 },
      { text: '> Generating optimization report...', type: 'info', delay: 8000 },
      { text: '✓ System score: 94/100 — Excellent after tuneup', type: 'success', delay: 8800 },
      { text: '$ Diagnostics complete. Ready for service.', type: 'prompt', delay: 9600 },
    ];

    let termTimers = [];

    function runTerminal() {
      termTimers.forEach(t => clearTimeout(t));
      termTimers = [];
      termBody.innerHTML = '';
      lines.forEach(line => {
        const t = setTimeout(() => {
          const span = document.createElement('span');
          span.className = 't-line t-' + line.type;
          span.textContent = line.text;
          termBody.appendChild(span);
          termBody.scrollTop = termBody.scrollHeight;
        }, line.delay);
        termTimers.push(t);
      });
    }

    let termStarted = false;
    const termObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !termStarted) {
          termStarted = true;
          runTerminal();
          // Loop every 12 seconds after first run
          setInterval(runTerminal, 12000);
        }
      });
    }, { threshold: 0.2 });
    termObserver.observe(termBody);
  }

  // ---- AI DIAGNOSTIC SYMPTOM CHECKER ----
  const symptomBtns = document.querySelectorAll('.symptom-btn');
  const analyzeBtn  = document.getElementById('analyze-btn');
  const aiResult    = document.getElementById('ai-result');
  let selectedSymptoms = [];

  const recommendations = {
    'slow-boot':   { service: 'Emergency Tuneup — $147',         detail: 'Slow boot is typically caused by too many startup programs, fragmented drives, or malware. Our tuneup clears this up fast.' },
    'blue-screen': { service: 'Emergency Tuneup + Diagnostics — $147', detail: 'Blue screens indicate driver conflicts, RAM issues, or failing hardware. We diagnose and fix the root cause.' },
    'clicking':    { service: 'Urgent Data Recovery — $350',     detail: 'Clicking sounds from your drive are a critical warning sign of imminent failure. Back up your data immediately — we can help.' },
    'overheating': { service: 'Emergency Tuneup — $147',         detail: 'Overheating is usually caused by dust buildup or failing fans. Our tuneup includes thermal cleaning and cooling fixes.' },
    'wifi':        { service: 'Emergency Tuneup — $147',         detail: 'WiFi issues are often driver or software related. We diagnose and resolve connectivity problems quickly.' },
    'freezing':    { service: 'Emergency Tuneup — $147',         detail: 'Freezing is commonly caused by low RAM, malware, or overheating. Our deep system cleanup resolves most freeze issues.' },
    'storage':     { service: 'System Upgrade & Cloning — $650', detail: 'Running out of storage? We can upgrade your drive to a larger SSD and clone all your data — no data loss.' },
  };

  symptomBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('selected');
      const sym = btn.dataset.symptom;
      if (btn.classList.contains('selected')) {
        if (!selectedSymptoms.includes(sym)) selectedSymptoms.push(sym);
      } else {
        selectedSymptoms = selectedSymptoms.filter(s => s !== sym);
      }
      if (analyzeBtn) {
        const n = selectedSymptoms.length;
        analyzeBtn.textContent = `Analyze My System (${n} symptom${n !== 1 ? 's' : ''} selected)`;
      }
    });
  });

  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      if (selectedSymptoms.length === 0) {
        alert('Please select at least one symptom to analyze.');
        return;
      }
      let rec;
      if (selectedSymptoms.includes('clicking'))         rec = recommendations['clicking'];
      else if (selectedSymptoms.includes('blue-screen')) rec = recommendations['blue-screen'];
      else if (selectedSymptoms.includes('storage') && selectedSymptoms.length === 1) rec = recommendations['storage'];
      else rec = recommendations['slow-boot'];

      if (aiResult) {
        aiResult.querySelector('h4').textContent = '🤖 AI Recommendation: ' + rec.service;
        aiResult.querySelector('p').textContent  = rec.detail;
        aiResult.classList.add('show');
        aiResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // ---- FAQ ACCORDION ----
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      document.querySelectorAll('.faq-q').forEach(b => {
        b.classList.remove('open');
        if (b.nextElementSibling) b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) { btn.classList.add('open'); answer.classList.add('open'); }
    });
  });

  // ---- SMOOTH SCROLL ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (nav) nav.classList.remove('open');
      }
    });
  });

  // ---- CARD HOVER GLOW (subtle red glow on pricing cards) ----
  document.querySelectorAll('.pricing-card, .why-card, .stat-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 0 28px rgba(229,57,53,0.35), 0 4px 24px rgba(0,0,0,0.5)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

});
