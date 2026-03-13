/* ========= STARS ========= */
(function initStars() {
    const canvas = document.getElementById('stars');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let W, H;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        stars = Array.from({ length: 280 }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.4 + 0.3,
            a: Math.random(),
            speed: Math.random() * 0.003 + 0.001,
            phase: Math.random() * Math.PI * 2,
        }));
    }

    function draw(t) {
        ctx.clearRect(0, 0, W, H);
        stars.forEach(s => {
            const alpha = 0.3 + 0.7 * ((Math.sin(t * s.speed * 60 + s.phase) + 1) / 2);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(180, 220, 255, ${alpha * s.a})`;
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
})();


/* ========= THEME TOGGLE ========= */
(function initTheme() {
    const toggle = document.getElementById('themeToggle');
    const body = document.body;
    const saved = localStorage.getItem('theme') || 'dark';
    if (saved === 'light') body.classList.add('light');

    toggle.addEventListener('click', () => {
        body.classList.toggle('light');
        localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
    });
})();


/* ========= ACTIVE NAV ON SCROLL ========= */
(function initActiveNav() {
    const links = document.querySelectorAll('.nav-links a');

    function setActive() {
        const scrollY = window.scrollY;
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;
            const section = document.querySelector(href);
            if (!section) return;
            const top = section.offsetTop - 80;
            const bottom = top + section.offsetHeight;
            link.classList.toggle('active', scrollY >= top && scrollY < bottom);
        });
    }

    window.addEventListener('scroll', setActive, { passive: true });
    setActive();
})();


/* ========= MOUSE PARALLAX ON CARD ========= */
(function initParallax() {
    const card = document.querySelector('.profile-card');
    if (!card) return;

    document.addEventListener('mousemove', e => {
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const dx = (e.clientX - cx) / cx;
        const dy = (e.clientY - cy) / cy;
        card.style.transform = `perspective(800px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`;
    });

    document.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
    });
})();


/* ========= CURSOR GLOW ========= */
(function initCursorGlow() {
    const glow = document.createElement('div');
    glow.style.cssText = `
    position: fixed;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,255,195,0.06) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
})();


/* ========= TYPEWRITER FOR HERO SUBTITLE (optional flavor) ========= */
(function initTypewriter() {
    const phrases = ['& propósitos', '& criatividade', '& intenção', '& impacto'];
    const purposeEl = document.querySelector('.purpose');
    if (!purposeEl) return;

    let pi = 0;
    let ci = 0;
    let deleting = false;
    let waiting = false;

    function tick() {
        const phrase = phrases[pi];

        if (!deleting) {
            purposeEl.textContent = phrase.slice(0, ci + 1);
            ci++;
            if (ci === phrase.length) {
                deleting = true;
                setTimeout(tick, 1800);
                return;
            }
        } else {
            const sliced = phrase.slice(0, ci - 1);
            purposeEl.textContent = sliced || "\u00A0";
            ci--;
            if (ci === 0) {
                deleting = false;
                pi = (pi + 1) % phrases.length;
                setTimeout(tick, 300);
                return;
            }
        }
        setTimeout(tick, deleting ? 45 : 80);
    }

    // Delay before starting typewriter
    setTimeout(tick, 1200);
})();


/* ========= BEHANCE AUTO PORTFOLIO ========= */
(function loadBehance() {
    const grid = document.getElementById('behance-grid');
    if (!grid) return;

    // --- 4. API BEHANCE (AUTOMATIZAÇÃO) ---
    // Chamamos a sua API da Vercel que criamos
    fetch('/api/behance')
        .then(response => response.text())
        .then(str => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(str, "text/xml");
            const items = xmlDoc.querySelectorAll("item");
            const grid = document.getElementById('behance-grid'); // Use o ID que definimos

            if (!grid) return;
            grid.innerHTML = '';

            items.forEach(item => {
                const title = item.querySelector("title").textContent;
                const link = item.querySelector("link").textContent;

                // O Behance coloca a imagem dentro de um campo <description> com HTML
                const description = item.querySelector("description").textContent;

                // Criamos um elemento temporário para usar o navegador como "parser" de HTML
                // Isso é MUITO mais seguro que Regex para pegar o src da imagem
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = description;
                const imgTag = tempDiv.querySelector('img');

                // Se encontrar a tag <img>, pega o link. Se não, usa um placeholder.
                let imgUrl = imgTag ? imgTag.getAttribute('src') : "";

                // Ajuste para garantir que o link da imagem esteja limpo
                if (imgUrl) {
                    imgUrl = imgUrl.replace(/&amp;/g, '&');
                } else {
                    imgUrl = "https://via.placeholder.com/600x600?text=Projeto+Sem+Capa";
                }

                grid.innerHTML += `
                <a href="${link}" target="_blank" class="behance-card">
                    <img src="${imgUrl}" alt="${title}" loading="lazy">
                    <div class="behance-overlay">
                        <h3>${title}</h3>
                        <p>UX/UI Design • Portfólio</p>
                        <span class="ver-projeto-texto">Ver Projeto</span>
                    </div>
                </a>`;
            });
        })
        .catch(err => {
            console.error("Erro ao carregar:", err);
            if (grid) grid.innerHTML = "<p>Erro ao conectar com o Behance.</p>";
        });
});