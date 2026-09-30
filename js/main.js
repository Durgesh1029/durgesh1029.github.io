/* ===================================================================
   DURGESH DONGRE — Hardware & Electrical Engineering Portfolio
   3D Book Page Turn Engine & Moving Digital Circuit Signals Background
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Current Year
    const yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ===================================================================
       1. MOVING DIGITAL SIGNALS & CIRCUITS BACKGROUND CANVAS
       =================================================================== */
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);

        const numSignals = 14;
        const signals = [];
        const bits = [];
        const numBits = 28;

        const gateSymbols = ['D-FF', 'CLK', 'AND', 'OR', 'XOR', 'Q', "Q'", 'VCC', 'GND', '1', '0'];
        const brightColors = ['#0284c7', '#7c3aed', '#db2777', '#059669', '#d97706'];

        // Signal Bus Wire Tracks
        class DigitalSignalWire {
            constructor(yPos) {
                this.y = yPos;
                this.speed = Math.random() * 1.5 + 0.8;
                this.x = Math.random() * width;
                this.color = brightColors[Math.floor(Math.random() * brightColors.length)];
            }
            update() {
                this.x += this.speed;
                if (this.x > width + 250) {
                    this.x = -250;
                    this.y = Math.random() * height;
                }
            }
            draw() {
                ctx.beginPath();
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 2.2;
                ctx.globalAlpha = 0.4;

                let startX = this.x;
                const highY = this.y - 12;
                const lowY = this.y + 12;

                ctx.moveTo(startX, lowY);
                for (let i = 0; i < 7; i++) {
                    ctx.lineTo(startX + 15, lowY);
                    ctx.lineTo(startX + 15, highY);
                    ctx.lineTo(startX + 35, highY);
                    ctx.lineTo(startX + 35, lowY);
                    startX += 35;
                }
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }
        }

        // Logic Bits (0 and 1) & Gate Symbols Moving along Circuit Lines
        class MovingBit {
            constructor() {
                this.reset();
            }
            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 1.4;
                this.vy = (Math.random() - 0.5) * 1.4;
                this.val = Math.random() > 0.5 ? '1' : '0';
                this.symbol = Math.random() > 0.7 ? gateSymbols[Math.floor(Math.random() * gateSymbols.length)] : this.val;
                this.color = brightColors[Math.floor(Math.random() * brightColors.length)];
                this.alpha = Math.random() * 0.4 + 0.35;
                this.size = this.symbol.length > 1 ? 12 : 15;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
                    this.reset();
                }
            }
            draw() {
                ctx.font = `700 ${this.size}px "JetBrains Mono", monospace`;
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fillText(this.symbol, this.x, this.y);
                ctx.globalAlpha = 1.0;
            }
        }

        for (let i = 0; i < numSignals; i++) {
            signals.push(new DigitalSignalWire((i + 1) * (height / (numSignals + 1))));
        }
        for (let i = 0; i < numBits; i++) {
            bits.push(new MovingBit());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            signals.forEach(sig => {
                sig.update();
                sig.draw();
            });

            bits.forEach(b => {
                b.update();
                b.draw();
            });

            requestAnimationFrame(animateCanvas);
        }

        animateCanvas();

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
    }

    /* ===================================================================
       2. 3D BOOK PAGE TURN ENGINE
       =================================================================== */
    let currentPage = 1;
    const totalPages = 7;
    let isFlipping = false;

    const pages = document.querySelectorAll('.book-page');
    const pageNumDisplay = document.getElementById('page-num-display');
    const pageTitleDisplay = document.getElementById('page-title-display');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-link');

    const pageTitles = {
        1: 'HOME LOG',
        2: 'SYSTEM PROFILE',
        3: 'TECHNICAL ARSENAL',
        4: 'PROJECT ARCHIVE',
        5: 'MISSION LOG',
        6: 'CERTIFICATIONS',
        7: 'CONTACT LOG'
    };

    function turnToPage(targetPage) {
        if (targetPage === currentPage || targetPage < 1 || targetPage > totalPages || isFlipping) return;

        isFlipping = true;
        const currentPageEl = document.querySelector(`.book-page.page-${currentPage}`);
        const targetPageEl = document.querySelector(`.book-page.page-${targetPage}`);

        if (!currentPageEl || !targetPageEl) return;

        const isNext = targetPage > currentPage;

        if (isNext) {
            currentPageEl.classList.add('page-turn-out-left');
            targetPageEl.classList.add('page-turn-in-right', 'active-page');
        } else {
            currentPageEl.classList.add('page-turn-out-right');
            targetPageEl.classList.add('page-turn-in-left', 'active-page');
        }

        if (pageNumDisplay) pageNumDisplay.textContent = `${targetPage} / ${totalPages}`;
        if (pageTitleDisplay) pageTitleDisplay.textContent = pageTitles[targetPage] || '';

        navLinks.forEach(link => {
            const linkPage = parseInt(link.getAttribute('data-page'), 10);
            if (linkPage === targetPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        setTimeout(() => {
            pages.forEach(p => {
                p.classList.remove('active-page', 'page-turn-out-left', 'page-turn-in-right', 'page-turn-out-right', 'page-turn-in-left');
            });
            targetPageEl.classList.add('active-page');
            currentPage = targetPage;
            isFlipping = false;

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 600);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => turnToPage(currentPage - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => turnToPage(currentPage + 1));

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageNum = parseInt(link.getAttribute('data-page'), 10);
            if (pageNum) turnToPage(pageNum);
        });
    });

    const heroTurnBtn = document.getElementById('hero-turn-page-btn');
    if (heroTurnBtn) {
        heroTurnBtn.addEventListener('click', () => turnToPage(4));
    }

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
            turnToPage(currentPage + 1);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
            turnToPage(currentPage - 1);
        }
    });

    /* Mouse Wheel / Touchpad Scroll 3D Page Turning Engine */
    let wheelCooldown = false;
    window.addEventListener('wheel', (e) => {
        const diagramModal = document.getElementById('diagram-modal');
        if (diagramModal && diagramModal.classList.contains('open')) return;
        if (e.target.closest('input, textarea, select')) return;
        if (wheelCooldown || isFlipping) return;

        if (e.deltaY > 20) {
            // Scroll down -> turn to next page
            if (currentPage < totalPages) {
                wheelCooldown = true;
                turnToPage(currentPage + 1);
                setTimeout(() => { wheelCooldown = false; }, 750);
            }
        } else if (e.deltaY < -20) {
            // Scroll up -> turn to previous page
            if (currentPage > 1) {
                wheelCooldown = true;
                turnToPage(currentPage - 1);
                setTimeout(() => { wheelCooldown = false; }, 750);
            }
        }
    }, { passive: true });

    /* Stat Counters Initialization (14+ Projects, 20+ EDA Tools, 8+ Certifications) */
    function initStatCounters() {
        const statElements = document.querySelectorAll('.stat-number');
        statElements.forEach(el => {
            const countTarget = parseInt(el.getAttribute('data-count'), 10);
            if (!countTarget) return;

            let currentVal = 0;
            const step = Math.max(1, Math.ceil(countTarget / 20));
            const interval = setInterval(() => {
                currentVal += step;
                if (currentVal >= countTarget) {
                    currentVal = countTarget;
                    clearInterval(interval);
                }
                el.textContent = `${currentVal}+`;
            }, 45);
        });
    }
    initStatCounters();

    /* ===================================================================
       3. TYPEWRITER EFFECT IN HERO
       =================================================================== */
    const heroSubtitle = document.getElementById('hero-subtitle');
    if (heroSubtitle) {
        const phrases = [
            'ELECTRICAL ENGINEERING @ IIT KANPUR',
            'VLSI DESIGN & ASIC FLOW (RTL ➔ GDSII)',
            'COMPUTER ARCHITECTURE & SYSTEMVERILOG',
            'AI / ML & FEDERATED CONTINUAL LEARNING'
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];
            if (isDeleting) {
                heroSubtitle.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
            } else {
                heroSubtitle.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
            }

            let typeSpeed = isDeleting ? 35 : 75;

            if (!isDeleting && charIdx === currentPhrase.length) {
                typeSpeed = 2200;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typeSpeed = 400;
            }

            setTimeout(typeLoop, typeSpeed);
        }
        typeLoop();
    }

    /* ===================================================================
       4. INTERACTIVE DIAGRAM LIGHTBOX MODAL
       =================================================================== */
    const diagramModal = document.getElementById('diagram-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalClose = document.getElementById('modal-close');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');

    function openModal(imgSrc, titleText, descText) {
        if (!diagramModal) return;
        modalImg.src = imgSrc;
        modalTitle.textContent = titleText || 'Architecture Schematic';
        modalDesc.textContent = descText || 'Detailed hardware implementation schematic and timing layout.';
        diagramModal.classList.add('open');
        diagramModal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        if (!diagramModal) return;
        diagramModal.classList.remove('open');
        diagramModal.setAttribute('aria-hidden', 'true');
    }

    document.querySelectorAll('.diagram-preview-box').forEach(box => {
        box.addEventListener('click', () => {
            const imgSrc = box.getAttribute('data-diagram');
            const titleText = box.getAttribute('data-title');
            const descText = box.getAttribute('data-desc');
            if (imgSrc) openModal(imgSrc, titleText, descText);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    /* ===================================================================
       5. PROJECT FILTER SYSTEM
       =================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ===================================================================
       6. LIVE INTERACTIVE WIDGET SIMULATORS
       =================================================================== */
    let counterVal = 5;
    const bit2 = document.getElementById('c-bit2');
    const bit1 = document.getElementById('c-bit1');
    const bit0 = document.getElementById('c-bit0');
    const decVal = document.getElementById('c-dec');

    if (bit2 && bit1 && bit0 && decVal) {
        setInterval(() => {
            counterVal = (counterVal + 1) % 8;
            bit2.textContent = (counterVal >> 2) & 1;
            bit1.textContent = (counterVal >> 1) & 1;
            bit0.textContent = counterVal & 1;
            decVal.textContent = counterVal;
        }, 1500);
    }

    const vinVal = document.getElementById('vin-val');
    const voutVal = document.getElementById('vout-val');
    let vtcState = true;

    if (vinVal && voutVal) {
        setInterval(() => {
            vtcState = !vtcState;
            vinVal.textContent = vtcState ? '0.0V (LOW)' : '1.2V (HIGH)';
            voutVal.textContent = vtcState ? '1.2V (HIGH)' : '0.0V (LOW)';
        }, 2500);
    }



    /* ===================================================================
       8. MOBILE NAV TOGGLE
       =================================================================== */
    const navHamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (navHamburger && mobileMenu) {
        navHamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
        });

        document.querySelectorAll('.mobile-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
            });
        });
    }
});
