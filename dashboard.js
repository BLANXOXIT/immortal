// ===== CONFIGURATION =====
const API_BASE = 'https://immortal1234.pythonanywhere.com';

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

// ===== SECURE API - NO ADMIN KEY EXPOSED =====
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
            keys: Array.isArray(data.keys) ? data.keys : [],
            products: Array.isArray(data.products) ? data.products : []
        };
    } catch (e) {
        console.error('Error checking user keys:', e);
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
                        <span style="font-family:'JetBrains Mono'; color:#fff; font-size:0.9rem;">${escapeHtml(prod.name)}</span>
                        <span style="font-size:0.6rem; background:rgba(0, 242, 255, 0.1); color:var(--accent); padding:4px 10px; border-radius:20px;">${escapeHtml(prod.tier || 'LIFETIME')}</span>
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

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

async function showDashboard() {
    document.getElementById('authPanel').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('accountUsername').innerText = currentUser.username;
    document.getElementById('hwidDisplay').innerHTML = '<span style="color: #888;">HWID is handled by the loader, not stored on server</span>';

    fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(j => document.getElementById('accountIp').innerText = j.ip)
        .catch(() => document.getElementById('accountIp').innerText = 'Unknown');

    loadUserData();
    await refreshUI();
}

// ===== API FUNCTIONS =====
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
    // Avatar Upload
    const avatarTrigger = document.getElementById('avatarUploadTrigger');
    const avatarImg = document.getElementById('avatarImg');
    if (avatarTrigger) {
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
    }

    // Auth Tabs
    document.querySelectorAll('.auth-tab').forEach(t => {
        t.onclick = () => {
            document.querySelectorAll('.auth-tab').forEach(b => b.classList.remove('active'));
            t.classList.add('active');
            const isL = t.dataset.auth === 'login';
            document.getElementById('loginForm').style.display = isL ? 'block' : 'none';
            document.getElementById('signupForm').style.display = isL ? 'none' : 'block';
            document.getElementById('verifyPanel').style.display = 'none';
            document.getElementById('avatarHint').style.display = '';
            document.querySelectorAll('.auth-tab').forEach(b => b.style.display = '');
        };
    });

    // Registration
    const signupBtn = document.getElementById('doSignupBtn');
    if (signupBtn) signupBtn.onclick = handleSignup;
    
    // Login
    const loginBtn = document.getElementById('doLoginBtn');
    if (loginBtn) loginBtn.onclick = handleLogin;
    
    // Activate Key
    const activateBtn = document.getElementById('activateKeyBtn');
    if (activateBtn) activateBtn.onclick = handleActivateKey;
    
    // Download Loader
    const downloadBtn = document.getElementById('downloadLoaderBtnDash');
    if (downloadBtn) downloadBtn.onclick = handleDownloadLoader;
    
    // HWID Reset
    const resetBtn = document.getElementById('requestHwidResetBtn');
    if (resetBtn) resetBtn.onclick = handleHwidReset;
    
    // Logout
    const logoutBtn = document.getElementById('dashboardLogoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            clearSession();
            location.reload();
        };
    }
}

// ===== EVENT HANDLERS =====
async function handleSignup() {
    // Signup is handled by the verification flow in index.html
    const signupBtn = document.getElementById('doSignupBtn');
    if (signupBtn) signupBtn.click();
}

async function handleLogin() {
    const u = document.getElementById('loginUsername').value;
    const p = document.getElementById('loginPassword').value;
    const err = document.getElementById('loginError');
    const fd = new FormData();
    fd.append('username', u);
    fd.append('password', p);

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
    const key = document.getElementById('licenseKeyInput').value.trim().toUpperCase();
    if (!key) { alert("ENTER LICENSE KEY FIRST"); return; }
    if (!currentUser) return;

    try {
        // First validate the key
        const url = `${API_BASE}/validate?key=${encodeURIComponent(key)}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.valid === true) {
            // Redeem/consume the key
            const fd = new FormData();
            fd.append('username', currentUser.username);
            fd.append('password', currentUser.password);
            fd.append('key', key);
            
            const redeemRes = await fetch(`${API_BASE}/redeem_key`, { method: 'POST', body: fd });
            const redeemData = await redeemRes.json();
            
            if (!redeemData.valid) {
                alert(redeemData.error || "FAILED TO REDEEM KEY");
                return;
            }
            
            // Also assign to account for display
            await assignKeyToAccount(currentUser.username, key);

            if (redeemData.products && redeemData.products.length > 0) {
                redeemData.products.forEach(p => {
                    const productName = p.product_name || p.product;
                    if (!activeProducts.some(a => a.name === productName))
                        activeProducts.push({ name: productName, tier: p.product_id || 'LIFETIME' });
                });
            } else if (data.products && data.products.length > 0) {
                data.products.forEach(p => {
                    const productName = p.product_name || p.product;
                    if (!activeProducts.some(a => a.name === productName))
                        activeProducts.push({ name: productName, tier: p.product_id || 'LIFETIME' });
                });
            } else {
                const productName = "Immortal Core";
                if (!activeProducts.some(a => a.name === productName))
                    activeProducts.push({ name: productName, tier: "LIFETIME" });
            }

            if (!activationHistory.includes(key)) activationHistory.push(key);

            saveSession();
            await refreshUI();
            document.getElementById('licenseKeyInput').value = "";
            alert(`ACCESS GRANTED: ${activeProducts.map(p => p.name).join(', ')}`);
        } else {
            alert(data.error || "INVALID KEY");
        }
    } catch (err) {
        console.error(err);
        alert("CONNECTION ERROR");
    }
}

async function handleDownloadLoader() {
    if (!currentUser) {
        alert("Not logged in.");
        return;
    }
    
    if (activationHistory.length === 0) {
        alert("No active license found. Please redeem a key first.");
        return;
    }
    
    const firstLic = activationHistory[0];
    const url = `${API_BASE}/download_web?key=${encodeURIComponent(firstLic)}`;

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
    const reason = document.getElementById('hwidResetReason').value.trim();
    if (!currentUser) return;
    if (!reason) { alert("PROVIDE A REASON FOR YOUR REQUEST"); return; }

    const fd = new FormData();
    fd.append('username', currentUser.username);
    fd.append('password', currentUser.password);
    fd.append('reason', reason);

    try {
        const res = await fetch(`${API_BASE}/submit_reset_request`, { method: 'POST', body: fd });
        const data = await res.json();
        if (res.ok && !data.error) {
            alert("REQUEST SENT TO STAFF.");
            document.getElementById('hwidResetReason').value = "";
        } else {
            alert(data.error || "FAILED TO SUBMIT REQUEST");
        }
    } catch (e) {
        alert("CONNECTION ERROR");
    }
}
