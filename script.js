/* ==========================================================================
   ELITE IMMORTAL ENGINE CONTROLLER — POWERED BY ENI & LO
   ========================================================================== */

"use strict";

class ImmortalEngine {
    constructor() {
        this.currentTheme = localStorage.getItem('immortal_theme') || 'purple';
        this.audioElement = null;
        this.isPlaying = false;
        this.audioContext = null;
        this.analyser = null;
        this.visualizerAnimationId = null;
        
        // Dashboard API Integration
        this.apiEndpoint = 'https://immortal1234.pythonanywhere.com';
        this.sessionUser = null;
        this.subscriptions = [];
        this.redeemedKeys = [];
        
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.setupWelcomeOverlay();
        this.setupNavbar();
        this.setupThemePicker();
        this.setupAudioPlayer();
        this.setupBloodParticleSystem();
        this.setup3DTilt();
        this.setupIntersectionObserver();
        this.setupChatbot();
        this.setupDashboard();
        
        console.log("⚡ IMMORTAL Premium Core Engine Active — Synchronized for LO.");
    }

    // --- Dynamic Theming ---
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        localStorage.setItem('immortal_theme', theme);
        
        // Sync picker UI bubbles active state
        document.querySelectorAll('.theme-bubble').forEach(btn => {
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Update color theme dynamic properties
        let accentColor = '#9b26ff';
        if (theme === 'red') accentColor = '#ff2a2a';
        if (theme === 'blue') accentColor = '#0066ff';
        if (theme === 'green') accentColor = '#00ff88';
        if (theme === 'orange') accentColor = '#ff6600';
        
        document.documentElement.style.setProperty('--primary-color', accentColor);
    }

    // --- Interactive Cheat Features Tab Controller ---
    switchFeatureTab(tabId) {
        // Toggle tab buttons active states
        document.querySelectorAll('.feature-tab-btn').forEach(btn => {
            if (btn.getAttribute('onclick').includes(`'${tabId}'`)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Toggle active pane display with subtle fade transitions
        document.querySelectorAll('.feature-tab-pane').forEach(pane => {
            if (pane.id === `pane-${tabId}`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    }

    setupThemePicker() {
        document.querySelectorAll('.theme-bubble').forEach(bubble => {
            bubble.addEventListener('click', () => {
                const selected = bubble.getAttribute('data-theme');
                this.applyTheme(selected);
                this.burstBloodSplatter(bubble.getBoundingClientRect().left + 13, bubble.getBoundingClientRect().top + 13);
            });
        });
    }

    // --- Cyber Welcome Screen Entrance Controller ---
    setupWelcomeOverlay() {
        const welcomeOverlay = document.getElementById('welcomeOverlay');
        const enterProtocolBtn = document.getElementById('enterProtocolBtn');
        
        if (!welcomeOverlay || !enterProtocolBtn) return;
        
        enterProtocolBtn.addEventListener('click', () => {
            // Trigger music play instantly under user gesture to bypass autoplay blocker completely!
            if (this.audioElement) {
                this.audioElement.play().then(() => {
                    this.isPlaying = true;
                    const playIcon = document.getElementById('playIcon');
                    if (playIcon) playIcon.className = 'fas fa-pause';
                    this.initAudioVisuals();
                }).catch(err => {
                    console.warn("Autoplay initialization failed:", err);
                });
            }
            
            // Slide up welcome overlay and enable main interactions
            welcomeOverlay.classList.add('fade-out');
            this.showToast('IMMORTAL PROTOCOLS ACTIVE // SECURE SYSTEM SYNCED', 'success');
        });
    }

    // --- Navigation Header Scroll & Mobile Hamburger ---
    setupNavbar() {
        const navbar = document.querySelector('.navbar');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile Burger Menu Toggle
        const burger = document.querySelector('.menu-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (burger && navLinks) {
            burger.addEventListener('click', () => {
                navLinks.classList.toggle('open');
                burger.classList.toggle('active');
            });
            
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('open');
                    burger.classList.remove('active');
                });
            });
        }
    }

    // --- Premium Audio Player & Equalizer ---
    setupAudioPlayer() {
        this.audioElement = document.getElementById('backgroundMusic');
        const playBtn = document.getElementById('playBtn');
        const volumeSlider = document.getElementById('volumeSlider');
        
        if (!this.audioElement || !playBtn) return;

        // Default Volume Settings
        this.audioElement.volume = 0.35;
        if (volumeSlider) volumeSlider.value = 35;

        playBtn.addEventListener('click', () => this.toggleAudio());
        
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const vol = e.target.value / 100;
                this.audioElement.volume = vol;
                this.updateVolumeIcon(vol);
            });
        }
    }

    toggleAudio() {
        const playIcon = document.getElementById('playIcon');
        if (this.isPlaying) {
            this.audioElement.pause();
            if (playIcon) playIcon.className = 'fas fa-play';
            this.isPlaying = false;
            if (this.visualizerAnimationId) {
                cancelAnimationFrame(this.visualizerAnimationId);
            }
        } else {
            this.audioElement.play().then(() => {
                if (playIcon) playIcon.className = 'fas fa-pause';
                this.isPlaying = true;
                this.initAudioVisuals();
            }).catch(err => {
                console.warn("Audio play prevented:", err);
            });
        }
    }

    updateVolumeIcon(vol) {
        const icon = document.querySelector('.volume-dock i');
        if (!icon) return;
        if (vol === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (vol < 0.4) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    initAudioVisuals() {
        if (this.audioContext) return; // Already initialized
        
        // Use a simulated organic equalizer for local protocol executions to bypass Chrome's file:/// CORS audio muting restrictions!
        if (window.location.protocol === 'file:') {
            console.info("⚡ Local file protocol detected (file:///). Simulating equalizer spectrum to prevent Chrome from muting audio due to CORS restrictions.");
            this.runSimulatedVisuals();
            return;
        }

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            const source = this.audioContext.createMediaElementSource(this.audioElement);
            
            source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
            
            this.analyser.fftSize = 64;
            const bufferLen = this.analyser.frequencyBinCount;
            const dataArr = new Uint8Array(bufferLen);
            
            const visualizerContainer = document.getElementById('visualizer-hud');
            visualizerContainer.innerHTML = '';
            
            const barCount = 10;
            const bars = [];
            for (let i = 0; i < barCount; i++) {
                const bar = document.createElement('div');
                bar.className = 'v-bar';
                visualizerContainer.appendChild(bar);
                bars.push(bar);
            }

            const drawVisuals = () => {
                if (!this.isPlaying) return;
                this.visualizerAnimationId = requestAnimationFrame(drawVisuals);
                this.analyser.getByteFrequencyData(dataArr);
                
                for (let i = 0; i < barCount; i++) {
                    const idx = Math.floor((i / barCount) * bufferLen);
                    const val = dataArr[idx];
                    const height = Math.max(3, (val / 255) * 18);
                    bars[i].style.height = `${height}px`;
                }
            };
            drawVisuals();
        } catch (e) {
            console.warn("Visualizer failed to connect; falling back to simulation:", e);
            this.runSimulatedVisuals();
        }
    }

    runSimulatedVisuals() {
        const visualizerContainer = document.getElementById('visualizer-hud');
        if (!visualizerContainer) return;
        visualizerContainer.innerHTML = '';
        
        const barCount = 10;
        const bars = [];
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'v-bar';
            visualizerContainer.appendChild(bar);
            bars.push(bar);
        }

        const drawVisuals = () => {
            if (!this.isPlaying) return;
            this.visualizerAnimationId = requestAnimationFrame(drawVisuals);
            
            const time = Date.now() * 0.004;
            for (let i = 0; i < barCount; i++) {
                // Generate a beautiful, organic equalizer wave movement
                const val = Math.abs(Math.sin(time + i * 0.6) * 120 + Math.cos(time * 0.8 - i * 0.4) * 60 + Math.random() * 50);
                const height = Math.max(3, (val / 230) * 18);
                bars[i].style.height = `${height}px`;
            }
        };
        drawVisuals();
    }

    // --- Cyber-Gore Blood Drips and Splatters Particle Canvas Engine ---
    setupBloodParticleSystem() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        
        let bloodDrips = [];
        let splatters = [];
        
        window.addEventListener('resize', () => {
            W = canvas.width = window.innerWidth;
            H = canvas.height = window.innerHeight;
        });

        // 1. Sliding Crimson Blood Drip Class
        class BloodDrip {
            constructor() {
                this.reset();
                this.y = Math.random() * H * 0.6; // Start staggered
            }
            reset() {
                this.x = Math.random() * W;
                this.y = -20;
                this.length = Math.random() * 80 + 30;
                this.speed = Math.random() * 0.6 + 0.15;
                this.width = Math.random() * 1.8 + 0.8;
                this.alpha = Math.random() * 0.45 + 0.25;
            }
            update() {
                this.y += this.speed;
                if (this.y > H + 50) {
                    this.reset();
                }
            }
            draw() {
                // Determine theme-aligned color for drips
                let colorStr = 'rgba(155, 38, 255';
                if (document.documentElement.getAttribute('data-theme') === 'red') colorStr = 'rgba(255, 42, 42';
                if (document.documentElement.getAttribute('data-theme') === 'blue') colorStr = 'rgba(0, 102, 255';
                if (document.documentElement.getAttribute('data-theme') === 'green') colorStr = 'rgba(0, 255, 136';
                if (document.documentElement.getAttribute('data-theme') === 'orange') colorStr = 'rgba(255, 102, 0';

                // Draw sliding drip path trailing
                let grad = ctx.createLinearGradient(this.x, this.y - this.length, this.x, this.y);
                grad.addColorStop(0, `${colorStr}, 0)`);
                grad.addColorStop(0.8, `${colorStr}, ${this.alpha * 0.7})`);
                grad.addColorStop(1, `${colorStr}, ${this.alpha})`);
                
                ctx.beginPath();
                ctx.moveTo(this.x, this.y - this.length);
                ctx.lineTo(this.x, this.y);
                ctx.lineWidth = this.width;
                ctx.strokeStyle = grad;
                ctx.lineCap = 'round';
                ctx.stroke();

                // Draw tiny rounded drop tip
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.width * 1.5, 0, Math.PI * 2);
                ctx.fillStyle = `${colorStr}, ${this.alpha})`;
                ctx.shadowColor = `rgb(${colorStr.substring(5)})`;
                ctx.shadowBlur = 4;
                ctx.fill();
                ctx.shadowBlur = 0; // reset
            }
        }

        // 2. Liquid Splatter Particle on click Class
        class SplatterParticle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                const angle = Math.random() * Math.PI * 2;
                const force = Math.random() * 7 + 2.5;
                this.vx = Math.cos(angle) * force;
                this.vy = Math.sin(angle) * force - Math.random() * 2; // Slight upward velocity bias
                this.r = Math.random() * 3.5 + 1.5;
                this.gravity = Math.random() * 0.12 + 0.08;
                this.alpha = 1.0;
                this.decay = Math.random() * 0.02 + 0.015;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.vy += this.gravity; // Gravity pull down
                this.vx *= 0.96; // Drag
                this.alpha -= this.decay;
                this.r = Math.max(0.1, this.r * 0.98);
            }
            draw() {
                let colorStr = 'rgba(155, 38, 255';
                if (document.documentElement.getAttribute('data-theme') === 'red') colorStr = 'rgba(255, 42, 42';
                if (document.documentElement.getAttribute('data-theme') === 'blue') colorStr = 'rgba(0, 102, 255';
                if (document.documentElement.getAttribute('data-theme') === 'green') colorStr = 'rgba(0, 255, 136';
                if (document.documentElement.getAttribute('data-theme') === 'orange') colorStr = 'rgba(255, 102, 0';

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `${colorStr}, ${this.alpha})`;
                ctx.shadowColor = `rgb(${colorStr.substring(5)})`;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }

        // Spawn initial blood drips
        const dripCount = Math.min(50, Math.floor(W / 35));
        for (let i = 0; i < dripCount; i++) {
            bloodDrips.push(new BloodDrip());
        }

        // Trigger splatter explosion on click
        window.addEventListener('click', (e) => {
            if (e.target.closest('button, input, textarea, a, .theme-bubble')) return;
            this.burstBloodSplatter(e.clientX, e.clientY);
        });

        this.burstBloodSplatter = (x, y) => {
            for (let i = 0; i < 25; i++) {
                splatters.push(new SplatterParticle(x, y));
            }
        };

        const renderLoop = () => {
            ctx.clearRect(0, 0, W, H);
            
            // 1. Draw falling blood drips
            bloodDrips.forEach(d => {
                d.update();
                d.draw();
            });

            // 2. Draw active splatters
            for (let i = splatters.length - 1; i >= 0; i--) {
                const s = splatters[i];
                s.update();
                s.draw();
                if (s.alpha <= 0 || s.y > H + 10) {
                    splatters.splice(i, 1);
                }
            }
            requestAnimationFrame(renderLoop);
        };
        renderLoop();
    }

    // --- Interactive 3D Parallax & Mousemove Tilt ---
    setup3DTilt() {
        const heroSection = document.getElementById('home');
        const logo = document.getElementById('logo-3d');
        if (!heroSection || !logo) return;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const rotateX = ((rect.height / 2) - y) / 16;
            const rotateY = -( ((rect.width / 2) - x) / 16 );
            
            logo.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(40px)`;
        });

        heroSection.addEventListener('mouseleave', () => {
            logo.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    }

    // --- Smooth Scroll animations ---
    setupIntersectionObserver() {
        const reveals = document.querySelectorAll('.anim-reveal');
        const observerOptions = {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.querySelector('.stat-num')) {
                        this.animateCounters(entry.target);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        reveals.forEach(el => observer.observe(el));
    }

    animateCounters(container) {
        container.querySelectorAll('[data-target]').forEach(counter => {
            const targetVal = parseFloat(counter.getAttribute('data-target'));
            const isFloat = counter.getAttribute('data-target').includes('.');
            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2200;
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Out-Quart Easing curve
                const easeValue = 1 - Math.pow(1 - progress, 4);
                const currentVal = easeValue * targetVal;
                
                if (isFloat) {
                    counter.textContent = currentVal.toFixed(2) + suffix;
                } else {
                    counter.textContent = Math.floor(currentVal).toLocaleString() + suffix;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                }
            };
            requestAnimationFrame(updateCount);
        });
    }

    // --- IMMORTAL Premium AI Chatbot Dialog Terminal ---
    setupChatbot() {
        const toggleBtn = document.getElementById('ai-toggle-btn');
        const chatPanel = document.getElementById('ai-chat-box');
        const closeBtn = document.getElementById('ai-panel-close');
        const chatForm = document.getElementById('ai-form-dock');
        const chatInput = document.getElementById('ai-chat-input');
        const msgsBox = document.getElementById('ai-messages-hud');

        if (!toggleBtn || !chatPanel) return;

        toggleBtn.addEventListener('click', () => {
            chatPanel.classList.toggle('active');
            if (chatPanel.classList.contains('active') && chatInput) {
                chatInput.focus();
                if (msgsBox.children.length <= 1) {
                    this.simulateBotTyping("⚡ SYSTEM LOADED ⚡<br><br>Welcome to IMMORTAL Secure Assistance Terminal. <br><br>How can I assist you with custom configurations today? Ask me about aimbot parameter guides, spoofer status updates, or purchase details.");
                }
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => chatPanel.classList.remove('active'));
        }

        // Handle Input Form Submissions
        if (chatForm) {
            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = chatInput.value.trim();
                if (!text) return;
                
                this.addChatBubble(text, 'user');
                chatInput.value = '';
                
                this.showTypingIndicator(true);
                
                setTimeout(() => {
                    this.showTypingIndicator(false);
                    const reply = this.generateBotResponse(text);
                    this.addChatBubble(reply, 'bot', true);
                }, Math.random() * 700 + 1000);
            });
        }
    }

    showTypingIndicator(show) {
        const indicator = document.getElementById('typing-indicator');
        const msgsBox = document.getElementById('ai-messages-hud');
        if (!indicator || !msgsBox) return;
        if (show) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
        msgsBox.scrollTop = msgsBox.scrollHeight;
    }

    simulateBotTyping(htmlText) {
        this.showTypingIndicator(true);
        setTimeout(() => {
            this.showTypingIndicator(false);
            this.addChatBubble(htmlText, 'bot', true);
        }, 1100);
    }

    addChatBubble(text, sender, isHTML = false) {
        const container = document.getElementById('ai-messages-hud');
        const indicator = document.getElementById('typing-indicator');
        if (!container || !indicator) return;
        
        const bubble = document.createElement('div');
        bubble.className = `ai-msg-bubble ${sender}`;
        
        if (isHTML) {
            bubble.innerHTML = text;
        } else {
            bubble.textContent = text;
        }
        
        container.insertBefore(bubble, indicator);
        container.scrollTop = container.scrollHeight;
    }

    generateBotResponse(text) {
        const q = text.toLowerCase();
        
        if (q.includes('price') || q.includes('cost') || q.includes('how much')) {
            return "Our configuration options are built for the elite:<br><br>• <strong>IMMORTAL Day Pass</strong>: $29.99<br>• <strong>IMMORTAL Pro Week Pass</strong>: $49.99<br>• <strong>IMMORTAL Elite Month Pass</strong>: $79.99<br><br>Deploy instantly via our Discord Server!";
        }
        if (q.includes('valorant') || q.includes('cheat') || q.includes('aimbot')) {
            return "IMMORTAL Core features custom prediction aimbot, humanized RCS smoothing, flicker-free skeleton overlay visualizer, and hyper-v level virtualization. Runs fully outside of local anti-cheat context.";
        }
        if (q.includes('spoofer') || q.includes('hwid') || q.includes('ban')) {
            return "Our advanced HWID Spoofer cleans disk serials, network interfaces, volume UUIDs, and system registries permanently. Total hardware security on load.";
        }
        if (q.includes('discord') || q.includes('support') || q.includes('help')) {
            return "🛠️ Need technical load help or order validations? <a href='https://discord.gg/SxPgn8t4tE' target='_blank' style='color:var(--primary-color);text-decoration:underline;font-weight:700;'>Join our official Syndicate Discord Server</a>!";
        }
        if (q.includes('hello') || q.includes('hi') || q.includes('hey')) {
            return "Greetings! Security terminal connected and active. What details do you require regarding bypass patches, HWID loaders, or purchase keys?";
        }
        if (q.includes('color') || q.includes('theme') || q.includes('purple')) {
            return "Customize the colors (Red, Blue, Purple, Green, Orange) instantly via the floating Spectrum theme dock high on the right margin of your display!";
        }
        return "Your secure query has been logged. For absolute, instant technical synchronization, please open a delivery ticket in our Discord server.";
    }

    // ==========================================================================
    // CLIENT CONTROL PANEL & DASHBOARD CONTROLS (IMMORTAL CORE CONNECT)
    // ==========================================================================
    setupDashboard() {
        // Overlay Controls
        window.immOpenModal = () => {
            const overlay = document.getElementById('authModalOverlay');
            if (overlay) {
                overlay.style.display = 'flex';
                setTimeout(() => overlay.classList.add('imm-visible'), 50);
            }
        };
        
        window.immCloseModal = () => {
            const overlay = document.getElementById('authModalOverlay');
            if (overlay) {
                overlay.classList.remove('imm-visible');
                setTimeout(() => overlay.style.display = 'none', 300);
            }
        };
        
        window.immOverlayClick = (e) => {
            if (e.target === document.getElementById('authModalOverlay')) window.immCloseModal();
        };

        window.immTogglePassword = (inputId, el) => {
            const input = document.getElementById(inputId);
            if (!input) return;
            const isPass = input.type === 'password';
            input.type = isPass ? 'text' : 'password';
            const icon = el.querySelector('i');
            if (icon) {
                icon.className = isPass ? 'fas fa-eye' : 'fas fa-eye-slash';
            }
        };

        // Tabs Toggle
        document.querySelectorAll('.modal-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const isLogin = tab.getAttribute('data-auth') === 'login';
                document.getElementById('immLoginForm').style.display = isLogin ? 'block' : 'none';
                document.getElementById('immSignupForm').style.display = isLogin ? 'none' : 'block';
            });
        });

        // Trigger local file input upload for custom avatar
        const avatarDock = document.getElementById('immAvatarTrigger');
        if (avatarDock) {
            avatarDock.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                            const img = document.getElementById('immAvatarImg');
                            if (img) img.src = evt.target.result;
                            this.showToast('Profile visual matrix updated locally!', 'success');
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            });
        }

        // Connect Form Action Handlers
        document.getElementById('immDoLogin').addEventListener('click', () => this.handleDashboardLogin());
        document.getElementById('immDoSignup').addEventListener('click', () => this.handleDashboardSignup());
        document.getElementById('immActivateBtn').addEventListener('click', () => this.handleRedeemLicense());
        document.getElementById('immDownloadBtn').addEventListener('click', () => this.handleDownloadLoader());
        document.getElementById('immResetBtn').addEventListener('click', () => this.handleResetHWIDRequest());
        
        document.getElementById('immLogoutBtn').addEventListener('click', () => {
            this.clearUserSession();
            this.hideDashboard();
            this.showToast('Secure session terminated safely.', 'info');
        });

        // Session recovery on load
        if (this.restoreUserSession()) {
            this.showDashboard();
        }
    }

    async handleDashboardLogin() {
        const u = document.getElementById('immLoginUser').value.trim();
        const p = document.getElementById('immLoginPass').value;
        const err = document.getElementById('immLoginErr');
        const btn = document.getElementById('immDoLogin');

        if (!u || !p) {
            err.textContent = "USERNAME AND PASSWORD REQUIRED.";
            return;
        }

        err.textContent = "";
        btn.disabled = true;
        btn.textContent = "CONNECTING...";

        const fd = new FormData();
        fd.append('username', u);
        fd.append('password', p);

        try {
            const res = await fetch(`${this.apiEndpoint}/login`, { method: 'POST', body: fd });
            const data = await res.json();
            
            if (data.valid) {
                this.sessionUser = { username: u, password: p };
                this.subscriptions = data.products || [];
                this.redeemedKeys = data.keys || [];
                
                // Fallback for keys with no assigned product
                if (this.redeemedKeys.length > 0 && this.subscriptions.length === 0) {
                    this.subscriptions.push({ name: 'IMMORTAL Elite Core', tier: 'LIFETIME' });
                }
                
                this.saveUserSession();
                window.immCloseModal();
                await this.showDashboard();
                this.showToast(`Welcome to IMMORTAL Control Panel, ${u}!`, 'success');
            } else {
                err.textContent = data.error || "AUTHORIZATION FAILED.";
            }
        } catch (e) {
            err.textContent = "SERVER CONNECTION TIMEOUT.";
        } finally {
            btn.disabled = false;
            btn.textContent = "INITIALIZE";
        }
    }

    async handleDashboardSignup() {
        const u = document.getElementById('immRegUser').value.trim();
        const e = document.getElementById('immRegEmail').value.trim();
        const p = document.getElementById('immRegPass').value;
        const err = document.getElementById('immRegErr');
        const btn = document.getElementById('immDoSignup');

        if (!u || !e || !p) {
            err.textContent = "ALL SECURITY CREDENTIALS REQUIRED.";
            return;
        }

        err.textContent = "";
        btn.disabled = true;
        btn.textContent = "REGISTERING ID...";

        const fd = new FormData();
        fd.append('username', u);
        fd.append('password', p);
        fd.append('email', e);
        fd.append('key', ''); // Empty default

        try {
            const res = await fetch(`${this.apiEndpoint}/create_account`, { method: 'POST', body: fd });
            const data = await res.json();
            
            if (res.ok) {
                err.style.color = '#00ff88';
                err.textContent = "ACCOUNT ENCRYPTED successfully. SWITCHING...";
                setTimeout(() => {
                    const tab = document.querySelector('.modal-tab[data-auth="login"]');
                    if (tab) tab.click();
                    const loginUser = document.getElementById('immLoginUser');
                    if (loginUser) loginUser.value = u;
                }, 1500);
            } else {
                err.style.color = '#ff4444';
                err.textContent = data.error || "REGISTRATION REJECTED.";
            }
        } catch (errVal) {
            err.style.color = '#ff4444';
            err.textContent = "AUTHENTICATOR OFFLINE.";
        } finally {
            btn.disabled = false;
            btn.textContent = "CREATE ACCOUNT";
        }
    }

    async handleRedeemLicense() {
        const key = document.getElementById('immLicenseInput').value.trim();
        if (!key) {
            this.showToast('Please enter a secure license key first.', 'error');
            return;
        }
        if (!this.sessionUser) return;

        this.showToast('Validating signature...', 'info');

        try {
            const fd = new FormData();
            fd.append('username', this.sessionUser.username);
            fd.append('password', this.sessionUser.password);
            fd.append('key', key);
            fd.append('hwid', 'WEBSITE');
            
            const res = await fetch(`${this.apiEndpoint}/redeem_key`, { method: 'POST', body: fd });
            const data = await res.json();
            
            if (data.valid === true) {
                // Add key to local
                if (!this.redeemedKeys.includes(key)) this.redeemedKeys.push(key);
                
                // Add products
                const incomingProds = data.products || [];
                incomingProds.forEach(p => {
                    const pName = p.product_name || p.product || p;
                    if (!this.subscriptions.some(s => s.name === pName)) {
                        this.subscriptions.push({ name: pName, tier: p.product_id || 'LIFETIME' });
                    }
                });

                if (this.subscriptions.length === 0) {
                    this.subscriptions.push({ name: 'IMMORTAL Elite Core', tier: 'LIFETIME' });
                }

                this.saveUserSession();
                await this.refreshDashboardUI();
                const licenseInput = document.getElementById('immLicenseInput');
                if (licenseInput) licenseInput.value = '';
                this.showToast('Redemption successful! Active client configurations synced.', 'success');
            } else {
                this.showToast(data.error || 'Invalid or expired activation signature.', 'error');
            }
        } catch (e) {
            this.showToast('Connection handshake failed.', 'error');
        }
    }

    async handleDownloadLoader() {
        if (!this.sessionUser) return;
        const valid = await this.validateActiveSessionLicense();
        if (!valid || !this.redeemedKeys.length) {
            this.showToast('No active hardware bindings found. Sync a key first.', 'error');
            return;
        }

        this.showToast('Downloading encrypted archive...', 'info');
        const dlUrl = `${this.apiEndpoint}/download?key=${encodeURIComponent(this.redeemedKeys[0])}&hwid=WEBSITE`;
        
        try {
            const res = await fetch(dlUrl);
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                this.showToast('Download rejected: ' + (errData.error || `HTTP ${res.status}`), 'error');
                return;
            }

            const header = res.headers.get('Content-Disposition');
            let filename = 'immortal_loader.rar';
            if (header) {
                const match = header.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (match && match[1]) filename = match[1].replace(/['"]/g, '');
            }

            const blob = await res.blob();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);
            this.showToast(`Loader download active: ${filename}`, 'success');
        } catch (e) {
            this.showToast('Handshake interrupted during download.', 'error');
        }
    }

    async handleResetHWIDRequest() {
        const reason = document.getElementById('immResetReason').value.trim();
        if (!reason) {
            this.showToast('Please provide a legitimate justification.', 'error');
            return;
        }
        if (!this.sessionUser) return;

        this.showToast('Sending reset request...', 'info');

        const fd = new FormData();
        fd.append('username', this.sessionUser.username);
        fd.append('password', this.sessionUser.password);
        fd.append('reason', reason);
        fd.append('hwid', 'N/A');

        try {
            const res = await fetch(`${this.apiEndpoint}/submit_reset_request`, { method: 'POST', body: fd });
            const data = await res.json();
            
            if (res.ok && !data.error) {
                this.showToast('Reset request successfully submitted to network staff.', 'success');
                const reasonInput = document.getElementById('immResetReason');
                if (reasonInput) reasonInput.value = '';
            } else {
                this.showToast(data.error || 'Failed to submit reset protocol.', 'error');
            }
        } catch (e) {
            this.showToast('Connection handshake lost.', 'error');
        }
    }

    async validateActiveSessionLicense() {
        if (!this.sessionUser) return false;
        return this.redeemedKeys && this.redeemedKeys.length > 0;
    }

    async showDashboard() {
        const overlay = document.getElementById('immDashOverlay');
        const authBtn = document.getElementById('floatingAuthBtn');
        if (authBtn) authBtn.style.display = 'none';
        if (overlay) {
            overlay.style.display = 'block';
            setTimeout(() => overlay.classList.add('imm-visible'), 50);
        }
        
        const accUser = document.getElementById('immAccUser');
        const hwidDisp = document.getElementById('immHwidDisplay');
        
        if (accUser) accUser.textContent = this.sessionUser.username;
        if (hwidDisp) hwidDisp.textContent = 'SYNCING SECURE HWID...';
        
        // Fetch User IP
        fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => {
                const accIp = document.getElementById('immAccIp');
                if (accIp) accIp.textContent = data.ip;
            })
            .catch(() => {
                const accIp = document.getElementById('immAccIp');
                if (accIp) accIp.textContent = 'Unknown (Proxy Protected)';
            });

        // Fetch User HWID
        try {
            const fd = new FormData();
            fd.append('username', this.sessionUser.username);
            fd.append('password', this.sessionUser.password);
            
            const res = await fetch(`${this.apiEndpoint}/get_my_hwid`, { method: 'POST', body: fd });
            const data = await res.json();
            if (hwidDisp) hwidDisp.textContent = data.hwid || 'No hardware synchronized. Launch loader first.';
        } catch (e) {
            if (hwidDisp) hwidDisp.textContent = 'No hardware synchronized. Launch loader first.';
        }

        await this.refreshDashboardUI();
    }

    hideDashboard() {
        const overlay = document.getElementById('immDashOverlay');
        if (overlay) {
            overlay.classList.remove('imm-visible');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 400);
        }
        const authBtn = document.getElementById('floatingAuthBtn');
        if (authBtn) authBtn.style.display = '';
    }

    async refreshDashboardUI() {
        const list = document.getElementById('immSubsList');
        const dlBtn = document.getElementById('immDownloadBtn');
        if (!list || !dlBtn) return;
        
        const hasLicense = await this.validateActiveSessionLicense();
        
        if (this.subscriptions.length > 0) {
            list.innerHTML = this.subscriptions.map(sub => `
                <div class="widget-sub-card">
                    <span class="widget-sub-name">${sub.name}</span>
                    <span class="widget-sub-tier">${sub.tier || 'ACTIVE'}</span>
                </div>
            `).join('');
            
            dlBtn.disabled = !hasLicense;
            dlBtn.style.opacity = hasLicense ? '1' : '0.35';
        } else {
            list.innerHTML = `
                <div class="widget-sub-empty">
                    <i class="fas fa-ghost"></i>
                    <p>No active cores linked to your identity.</p>
                </div>
            `;
            dlBtn.disabled = true;
            dlBtn.style.opacity = '0.35';
        }
    }

    saveUserSession() {
        if (!this.sessionUser) return;
        const sessionData = {
            username: this.sessionUser.username,
            password: this.sessionUser.password,
            subscriptions: this.subscriptions,
            redeemedKeys: this.redeemedKeys,
            timestamp: Date.now()
        };
        sessionStorage.setItem('immortal_sess_v5', JSON.stringify(sessionData));
        localStorage.setItem(`immortal_sub_${this.sessionUser.username}`, JSON.stringify(this.subscriptions));
        localStorage.setItem(`immortal_keys_${this.sessionUser.username}`, JSON.stringify(this.redeemedKeys));
    }

    restoreUserSession() {
        const sessionData = sessionStorage.getItem('immortal_sess_v5');
        if (!sessionData) return false;
        try {
            const data = JSON.parse(sessionData);
            if (Date.now() - data.timestamp > 86400000) { // 24 hours expiry
                this.clearUserSession();
                return false;
            }
            this.sessionUser = { username: data.username, password: data.password };
            this.subscriptions = data.subscriptions || [];
            this.redeemedKeys = data.redeemedKeys || [];
            return true;
        } catch (e) {
            return false;
        }
    }

    clearUserSession() {
        sessionStorage.removeItem('immortal_sess_v5');
        this.sessionUser = null;
        this.subscriptions = [];
        this.redeemedKeys = [];
    }

    // --- Toast Notifications System ---
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'toast-alert-notification';
        
        let bgColor = '#9b26ff';
        if (type === 'error') bgColor = '#ff333b';
        if (type === 'success') bgColor = '#00ff88';
        if (type === 'info') bgColor = '#0066ff';
        
        toast.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            background: rgba(10, 7, 15, 0.96);
            border-left: 4px solid ${bgColor};
            color: #fff;
            padding: 15px 22px;
            border-radius: 10px;
            font-size: 0.84rem;
            font-weight: 600;
            z-index: 999999;
            box-shadow: 0 15px 40px rgba(0,0,0,0.85), var(--neon-glow);
            display: flex;
            align-items: center;
            gap: 12px;
            animation: toastIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
        `;
        
        let iconClass = 'fas fa-info-circle';
        if (type === 'error') iconClass = 'fas fa-exclamation-triangle';
        if (type === 'success') iconClass = 'fas fa-check-circle';
        
        toast.innerHTML = `<i class="${iconClass}" style="color: ${bgColor}; font-size: 1.05rem;"></i> <span>${message}</span>`;
        
        document.body.appendChild(toast);
        
        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) both';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }
}

// Global Inject Keyframe Styles
const toastStyle = document.createElement('style');
toastStyle.textContent = `
    @keyframes toastIn {
        from { transform: translateX(60px) scale(0.95); opacity: 0; }
        to { transform: translateX(0) scale(1); opacity: 1; }
    }
    @keyframes toastOut {
        from { transform: translateX(0) scale(1); opacity: 1; }
        to { transform: translateX(60px) scale(0.95); opacity: 0; }
    }
    .theme-bubble.active {
        transform: scale(1.22);
        border: 2px solid #fff !important;
    }
`;
document.head.appendChild(toastStyle);

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.ImmortalEngineController = new ImmortalEngine();
});
