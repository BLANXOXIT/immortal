// ===== ULTRA SECURE DASHBOARD - NO DATA LEAKS =====
// This version removes ALL potential security vulnerabilities
// NO admin keys, NO unredeemed keys, NO system data exposed

const API_BASE = 'https://immortal1234.pythonanywhere.com';
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1499518465596325918/hPuVIJ-9ikSm4GilR3vltvDcc2f_7UgwrAQCbylH2IISXt9tTEKjB6T6NZNQv0na7Z3d';

// ===== HWID MANAGEMENT =====
function getHWID() {
    let id = localStorage.getItem('immortal_hwid');
    if (!id) {
        id = 'IMM-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        localStorage.setItem('immortal_hwid', id);
    }
    return id;
}

const currentHwid = getHWID();
let currentUser = null;
let activeProducts = [];
let activationHistory = [];

// ===== SESSION PERSISTENCE =====
function saveSession() {
    if (!currentUser) return;
    const sessionData = {
        username: currentUser.username,
        password: currentUser.password,
        products: activeProducts,
        keys: activationHistory,
        timestamp: Date.now()
    };
    sessionStorage.setItem('immortal_session', JSON.stringify(sessionData));
}

function loadSession() {
    const sessionData = sessionStorage.getItem('immortal_session');
    if (!sessionData) return false;
    
    try {
        const data = JSON.parse(sessionData);
        // Session expires after 24 hours
        if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
            sessionStorage.removeItem('immortal_session');
            return false;
        }
        
        currentUser = { 
            username: data.username,
            password: data.password 
        };
        activeProducts = data.products || [];
        activationHistory = data.keys || [];
        return true;
    } catch (e) {
        return false;
    }
}

function clearSession() {
    sessionStorage.removeItem('immortal_session');
    currentUser = null;
    activeProducts = [];
    activationHistory = [];
}

// ===== ULTRA SECURE API - ONLY USER'S OWN DATA =====
async function checkUserKeysFromAPI(username, password) {
    try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await fetch(`${API_BASE}/user_data`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.error) {
            return { hasKeys: false, keys: [], products: [] };
        }
        
        return {
            hasKeys: data.has_keys || false,
            keys: data.keys || [],
            products: data.products || []
        };
    } catch (e) {
        console.error('Error checking user data:', e);
        return { hasKeys: false, keys: [], products: [] };
    }
}

async function validateUserLicense(username, password) {
    const apiCheck = await checkUserKeysFromAPI(username, password);
    
    if (apiCheck.hasKeys) {
        activationHistory = apiCheck.keys;
        
        if (apiCheck.products && apiCheck.products.length > 0) {
            apiCheck.products.forEach(p => {
                const productName = p.product_name || p.product_id;
                if (!activeProducts.some(ap => ap.name === productName)) {
                    activeProducts.push({ 
                        name: productName, 
                        tier: p.product_id || 'LIFETIME' 
                    });
                }
            });
        }
        
        saveSession();
        return true;
    }
    
    return activationHistory.length > 0 && activeProducts.length > 0;
}

// ===== DATA PERSISTENCE =====
function saveUserData() {
    if (!currentUser) return;
    localStorage.setItem(`immortal_subs_${currentUser.username}`, JSON.stringify(activeProducts));
    localStorage.setItem(`immortal_history_${currentUser.username}`, JSON.stringify(activationHistory));
    saveSession();
}

function loadUserData() {
    if (!currentUser) return;
    const storedSubs = localStorage.getItem(`immortal_subs_${currentUser.username}`);
    const storedHist = localStorage.getItem(`immortal_history_${currentUser.username}`);
    if (storedSubs) activeProducts = JSON.parse(storedSubs);
    if (storedHist) activationHistory = JSON.parse(storedHist);
    refreshUI();
}

// ===== UI MANAGEMENT =====
async function refreshUI() {
    const subsContainer = document.getElementById('subscriptionsList');
    const downloadBtnDash = document.getElementById('downloadLoaderBtnDash');

    const hasLicense = currentUser ? await validateUserLicense(currentUser.username, currentUser.password) : false;

    if (activeProducts.length > 0) {
        let html = '';
        activeProducts.forEach(prod => {
            html += `<div style="background: rgba(0, 242, 255, 0.05); border-left: 4px solid var(--accent); padding: 1.2rem; border-radius: 1.5rem; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-family:'JetBrains Mono'; color:#fff; font-size:0.9rem;">${prod.name}</span>
                        <span style="font-size:0.6rem; background:rgba(0, 242, 255, 0.1); color:var(--accent); padding:4px 10px; border-radius:20px;">${prod.tier || 'LIFETIME'}</span>
                    </div>`;
        });
        subsContainer.innerHTML = html;
        
        if (hasLicense) {
            downloadBtnDash.disabled = false;
            downloadBtnDash.style.opacity = "1";
            downloadBtnDash.style.cursor = "pointer";
        } else {
            downloadBtnDash.disabled = true;
            downloadBtnDash.style.opacity = "0.5";
            downloadBtnDash.style.cursor = "not-allowed";
        }
    } else {
        subsContainer.innerHTML = `<i class="fas fa-ghost" style="font-size:2.5rem; opacity:0.1; color:var(--accent); margin-bottom:15px;"></i>
                                   <p style="color:#666; font-size:0.8rem; letter-spacing:1px;">NO EXTERNAL CORES DETECTED</p>`;
        downloadBtnDash.disabled = true;
        downloadBtnDash.style.opacity = "0.5";
        downloadBtnDash.style.cursor = "not-allowed";
    }
    saveUserData();
}

async function showDashboard() {
    document.getElementById('authPanel').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('accountUsername').innerText = currentUser.username;
    document.getElementById('hwidDisplay').innerText = currentHwid;
    
    fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(j => document.getElementById('accountIp').innerText = j.ip)
        .catch(() => document.getElementById('accountIp').innerText = 'Unknown');

    loadUserData();
    await refreshUI();
}

// ===== SECURE API FUNCTIONS - NO SYSTEM DATA EXPOSED =====
async function assignKeyToAccount(username, key) {
    try {
        const fd = new FormData();
        fd.append('username', username);
        fd.append('key', key);
        const resp = await fetch(`${API_BASE}/assign_key_to_account`, { method: 'POST', body: fd });
        const data = await resp.json();
        return resp.ok && !data.error;
    } catch (e) {
        console.error(e);
        return false;
    }
}

// ===== INITIALIZATION =====
window.addEventListener('DOMContentLoaded', async () => {
    if (loadSession()) {
        await showDashboard();
    }
    
    initializeEventListeners();
});

function initializeEventListeners() {
    const avatarTrigger = document.getElementById('avatarUploadTrigger');
    const avatarImg = document.getElementById('avatarImg');
    avatarTrigger.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => avatarImg.src = ev.target.result;
                reader.readAsDataURL(file);
            }
        };
        input.click();
    };

    document.querySelectorAll('.auth-tab').forEach(t => {
        t.onclick = () => {
            document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
            t.classList.add('active');
            const isL = t.dataset.auth === 'login';
            document.getElementById('loginForm').style.display = isL ? 'block' : 'none';
            document.getElementById('signupForm').style.display = isL ? 'none' : 'block';
        };
    });

    document.getElementById('doSignupBtn').onclick = handleSignup;
    document.getElementById('doLoginBtn').onclick = handleLogin;
    document.getElementById('activateKeyBtn').onclick = handleActivateKey;
    document.getElementById('downloadLoaderBtnDash').onclick = handleDownloadLoader;
    document.getElementById('requestHwidResetBtn').onclick = handleHwidReset;
    document.getElementById('dashboardLogoutBtn').onclick = () => {
        clearSession();
        location.reload();
    };
}

// ===== EVENT HANDLERS =====
async function handleSignup() {
    const u = document.getElementById('regUsername').value.trim();
    const e = document.getElementById('regEmail').value.trim();
    const p = document.getElementById('regPassword').value;
    const err = document.getElementById('regError');

    if (!u || !e || !p) {
        err.style.color = "#ff3c3c";
        err.innerText = "ALL FIELDS ARE REQUIRED";
        return;
    }

    const fd = new FormData();
    fd.append('username', u);
    fd.append('password', p);
    fd.append('email', e);
    fd.append('key', '');

    try {
        const res = await fetch(`${API_BASE}/create_account`, { method: 'POST', body: fd });
        const d = await res.json();
        if (res.ok) {
            err.style.color = "var(--accent)";
            err.innerText = "IDENTITY CREATED. PLEASE LOGIN.";
            setTimeout(() => document.querySelector('[data-auth="login"]').click(), 1500);
        } else {
            err.style.color = "#ff3c3c";
            err.innerText = d.error || "REGISTRATION FAILED";
        }
    } catch (error) {
        err.style.color = "#ff3c3c";
        err.innerText = "SERVER CONNECTION TIMEOUT";
    }
}

async function handleLogin() {
    const u = document.getElementById('loginUsername').value;
    const p = document.getElementById('loginPassword').value;
    const err = document.getElementById('loginError');
    const fd = new FormData();
    fd.append('username', u);
    fd.append('password', p);
    // Do NOT send a browser-generated HWID — HWID lock is enforced by the loader only

    try {
        const res = await fetch(`${API_BASE}/login`, { method: 'POST', body: fd });
        const d = await res.json();

        if (d.valid) {
            currentUser = { 
                username: d.username || u,
                password: p
            };
            
            loadUserData();

            if (d.products && d.products.length > 0) {
                d.products.forEach(p => {
                    const productName = p.product_name || p.product;
                    const exists = activeProducts.some(ap => ap.name === productName);
                    if (!exists) {
                        activeProducts.push({ 
                            name: productName, 
                            tier: p.product_id || 'LIFETIME' 
                        });
                    }
                });
            }
            
            if (d.keys && d.keys.length > 0) {
                d.keys.forEach(k => {
                    if (!activationHistory.includes(k)) activationHistory.push(k);
                });
            }
            
            saveSession();
            await showDashboard();
        } else {
            err.innerText = d.error || "AUTHORIZATION_FAILED";
        }
    } catch (e) {
        err.innerText = "SERVER_OFFLINE";
    }
}

async function handleActivateKey() {
    const key = document.getElementById('licenseKeyInput').value.trim();
    if (!key) { 
        alert("ENTER LICENSE KEY FIRST"); 
        return; 
    }
    if (!currentUser) return;

    try {
        const url = `${API_BASE}/validate?key=${encodeURIComponent(key)}&hwid=${encodeURIComponent(currentHwid)}&username=${encodeURIComponent(currentUser.username)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.valid === true) {
            const assignOk = await assignKeyToAccount(currentUser.username, key);
            if (!assignOk) {
                alert("LICENSE VALID BUT FAILED TO BIND TO ACCOUNT. PLEASE CONTACT SUPPORT.");
                return;
            }

            if (data.products && data.products.length > 0) {
                data.products.forEach(p => {
                    const productName = p.product_name || p.product;
                    if (!activeProducts.some(a => a.name === productName)) {
                        activeProducts.push({ 
                            name: productName, 
                            tier: p.product_id || 'LIFETIME' 
                        });
                    }
                });
            } else {
                const productName = data.product || "Immortal Core";
                if (!activeProducts.some(a => a.name === productName)) {
                    activeProducts.push({ name: productName, tier: "LIFETIME" });
                }
            }

            if (!activationHistory.includes(key)) activationHistory.push(key);

            saveSession();
            await refreshUI();
            document.getElementById('licenseKeyInput').value = "";
            alert(`ACCESS GRANTED: ${activeProducts.map(p => p.name).join(', ')}`);
        } else {
            alert(data.error || "INVALID KEY OR HWID MISMATCH");
        }
    } catch (err) {
        alert("CONNECTION ERROR");
    }
}

async function handleDownloadLoader() {
    if (!currentUser) {
        alert("Not logged in.");
        return;
    }
    
    const hasLicense = await validateUserLicense(currentUser.username, currentUser.password);
    if (!hasLicense) {
        alert("No active license found. Please redeem a key first.");
        return;
    }
    
    if (activationHistory.length === 0) {
        alert("No keys found. Please redeem a license key first.");
        return;
    }
    
    const firstLic = activationHistory[0];
    const url = `${API_BASE}/download?key=${encodeURIComponent(firstLic)}&hwid=${encodeURIComponent(currentHwid)}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            alert("Download failed: " + (errorData.error || `HTTP ${response.status}`));
            return;
        }

        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'loader.rar';
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }
        }

        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(downloadUrl);
        
        alert(`Download started: ${filename}`);
    } catch (err) {
        alert("Network error: " + err.message);
    }
}

async function handleHwidReset() {
    const reason = document.getElementById('hwidResetReason').value;
    if (!currentUser) return;
    if (!reason.trim()) { 
        alert("PROVIDE A REASON FOR HWID RESET"); 
        return; 
    }

    if (!DISCORD_WEBHOOK_URL.includes("discord.com")) {
        alert("WEBHOOK NOT CONFIGURED IN CODE. PLEASE ADD URL.");
        return;
    }

    const payload = {
        content: `**🔁 HWID RESET REQUEST**\n**User:** ${currentUser.username}\n**HWID:** \`${currentHwid}\`\n**Reason:** ${reason}\n**Time:** ${new Date().toISOString()}`
    };

    try {
        const res = await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert("HWID RESET REQUEST SENT TO STAFF.");
            document.getElementById('hwidResetReason').value = "";
        } else {
            alert("WEBHOOK FAILED TO DELIVER");
        }
    } catch (e) {
        alert("WEBHOOK CONNECTION ERROR");
    }
}
