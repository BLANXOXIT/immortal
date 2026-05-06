// Particle Animation Engine
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let pts = [];

function resize() { 
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
}

class Pt {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
    }
    
    update() {
        this.x += this.vx; 
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        ctx.fillStyle = '#00f2ff';
        ctx.beginPath(); 
        ctx.arc(this.x, this.y, 1.2, 0, Math.PI * 2); 
        ctx.fill();
    }
}

function init() {
    resize();
    for (let i = 0; i < 95; i++) pts.push(new Pt());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach((p, i) => {
        p.update();
        for (let j = i + 1; j < pts.length; j++) {
            const dx = p.x - pts[j].x;
            const dy = p.y - pts[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 140) {
                ctx.strokeStyle = `rgba(0, 242, 255, ${0.8 * (1 - d / 140)})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath(); 
                ctx.moveTo(p.x, p.y); 
                ctx.lineTo(pts[j].x, pts[j].y); 
                ctx.stroke();
            }
        }
    });
    requestAnimationFrame(animate);
}

window.onresize = resize;
init(); 
animate();
