// ================= 全局变量配置区 =================
const BIRTHDAY_MONTH = 0;    // 月份从0开始（0代表1月，1代表2月...）
const BIRTHDAY_DAY = 2;      // 生日的日期
const BIRTHDAY_HOUR = 12;    // 生的具体小时 (24小时制)
const BIRTHDAY_MINUTE = 30;   // 新增：具体的分钟
const BIRTHDAY_SECOND = 0;   // 新增：具体的秒数
const CELEBRATION_DAYS = 3;  // 生日庆祝持续3天
// =================================================

// DOM元素
const countdownContainer = document.getElementById('countdown-container');
const birthdayContainer = document.getElementById('birthday-container');
const giftSection = document.getElementById('gift-section');
const giftBox = document.querySelector('.gift-box');
const daysElement = document.getElementById('days');
const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const musicToggle = document.getElementById('music-toggle');
const bgm = document.getElementById('bgm');
const canvas = document.getElementById('starry-sky');
const ctx = canvas.getContext('2d');
const fireworksCanvas = document.getElementById('fireworks-canvas');
const fireworksCtx = fireworksCanvas ? fireworksCanvas.getContext('2d') : null;
const loveTree = document.getElementById('love-tree');
const makeWishBtn = document.getElementById('make-wish-btn');

// 设置Canvas大小
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (fireworksCanvas) {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
    }
}

// 星星类
class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.blinkSpeed = Math.random() * 0.05;
        this.alpha = Math.random();
        this.alphaChange = this.blinkSpeed;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();
    }
    update() {
        this.alpha += this.alphaChange;
        if (this.alpha <= 0 || this.alpha >= 1) this.alphaChange = -this.alphaChange;
        this.x += (Math.random() - 0.5) * 0.3;
        this.y += (Math.random() - 0.5) * 0.3;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        this.draw();
    }
}

// 流星类
class ShootingStar {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.length = Math.random() * 80 + 50;
        this.speed = Math.random() * 10 + 10;
        this.angle = Math.PI / 4 + (Math.random() * Math.PI / 4);
        this.alpha = 1;
        this.active = true;
    }
    draw() {
        if (!this.active) return;
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const endX = this.x + Math.cos(this.angle) * this.length;
        const endY = this.y + Math.sin(this.angle) * this.length;
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }
    update() {
        if (!this.active) { if (Math.random() < 0.005) this.reset(); return; }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.alpha -= 0.01;
        if (this.y > canvas.height || this.x < 0 || this.x > canvas.width || this.alpha <= 0) this.active = false;
        this.draw();
    }
}

// 爱心类
class Heart {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.size = Math.random() * 15 + 15;
        this.speed = Math.random() * 3 + 1;
        this.color = `hsl(${340 + Math.random() * 40}, 100%, ${60 + Math.random() * 20}%)`;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.05;
    }
    draw() {
        ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.bezierCurveTo(0, -this.size / 2, this.size, -this.size, 0, this.size);
        ctx.bezierCurveTo(-this.size, -this.size, 0, -this.size / 2, 0, this.size / 2);
        ctx.fill(); ctx.restore();
    }
    update() {
        this.y -= this.speed; this.rotation += this.rotationSpeed;
        if (this.y < -this.size) this.reset();
        this.draw();
    }
}

// 烟花类
class FireworkParticle {
    constructor(x, y, color) {
        this.x = x; this.y = y;
        this.color = color || `hsl(${Math.random() * 360}, 100%, 70%)`;
        this.velocity = { x: (Math.random() - 0.5) * 6, y: (Math.random() - 0.5) * 6 };
        this.alpha = 1; this.decay = Math.random() * 0.02 + 0.01;
        this.gravity = 0.1; this.size = Math.random() * 3 + 1;
    }
    draw() {
        fireworksCtx.beginPath();
        fireworksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        fireworksCtx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        fireworksCtx.fill();
    }
    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x; this.y += this.velocity.y;
        this.alpha -= this.decay; this.draw();
    }
}

class Firework {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * fireworksCanvas.width;
        this.y = fireworksCanvas.height;
        this.targetY = Math.random() * (fireworksCanvas.height * 0.6);
        this.speed = Math.random() * 2 + 2;
        this.particles = [];
        this.color = `${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}`;
        this.exploded = false;
    }
    explode() {
        this.exploded = true;
        for (let i = 0; i < 100; i++) this.particles.push(new FireworkParticle(this.x, this.y, this.color));
    }
    draw() {
        if (!this.exploded) {
            fireworksCtx.beginPath(); fireworksCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            fireworksCtx.fillStyle = `rgb(${this.color})`; fireworksCtx.fill();
        }
    }
    update() {
        if (!this.exploded) {
            this.y -= this.speed; if (this.y <= this.targetY) this.explode();
            this.draw();
        } else {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].update();
                if (this.particles[i].alpha <= 0) this.particles.splice(i, 1);
            }
            if (this.particles.length === 0) this.reset();
        }
    }
}

// 爱心树类
class LoveTree {
    constructor(canvas) {
        this.canvas = canvas; this.ctx = canvas.getContext('2d');
        this.branches = []; this.hearts = [];
        this.addBranch(canvas.width / 2, canvas.height, canvas.width / 2, canvas.height - 100, 10);
        this.growTree(canvas.width / 2, canvas.height - 100, 270, 8, 3);
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.addHeart(e.clientX - rect.left, e.clientY - rect.top);
        });
    }
    addBranch(startX, startY, endX, endY, width) { this.branches.push({ startX, startY, endX, endY, width }); }
    growTree(x, y, angle, width, depth) {
        if (depth === 0) return;
        const length = 30 + Math.random() * 20;
        const endX = x + Math.cos(angle * Math.PI / 180) * length;
        const endY = y + Math.sin(angle * Math.PI / 180) * length;
        this.addBranch(x, y, endX, endY, width);
        for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
            this.growTree(endX, endY, angle + (-20 + Math.random() * 40), width * 0.7, depth - 1);
        }
    }
    addHeart(x, y) {
        this.hearts.push({ x, y, size: 5 + Math.random() * 10, color: `hsl(${340 + Math.random() * 40}, 100%, 60%)`, alpha: 1, rotation: Math.random() * Math.PI * 2 });
    }
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const branch of this.branches) {
            this.ctx.beginPath(); this.ctx.moveTo(branch.startX, branch.startY); this.ctx.lineTo(branch.endX, branch.endY);
            this.ctx.strokeStyle = '#573b1f'; this.ctx.lineWidth = branch.width; this.ctx.stroke();
        }
        for (const heart of this.hearts) {
            this.ctx.save(); this.ctx.translate(heart.x, heart.y); this.ctx.rotate(heart.rotation);
            this.ctx.fillStyle = heart.color; this.ctx.globalAlpha = heart.alpha;
            this.ctx.beginPath(); this.ctx.bezierCurveTo(0, -heart.size / 2, heart.size, -heart.size, 0, heart.size);
            this.ctx.bezierCurveTo(-heart.size, -heart.size, 0, -heart.size / 2, 0, heart.size / 2);
            this.ctx.fill(); this.ctx.restore();
        }
    }
    update() {
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            this.hearts[i].alpha -= 0.003; this.hearts[i].rotation += 0.01;
            if (this.hearts[i].alpha <= 0) this.hearts.splice(i, 1);
        }
        this.draw();
    }
}

// 动画资源管理
let stars = []; let shootingStars = []; let heartsArr = []; let fireworksArr = []; let loveTreeObj = null; let isBirthday = false;

// 初始化函数
function initStars() { stars = []; for (let i = 0; i < 200; i++) stars.push(new Star()); }
function initShootingStars() { shootingStars = []; for (let i = 0; i < 3; i++) { const ss = new ShootingStar(); ss.active = false; shootingStars.push(ss); } }
function initHearts() { heartsArr = []; if (isBirthday) for (let i = 0; i < 20; i++) heartsArr.push(new Heart()); }
function initFireworks() { if (!fireworksCtx) return; fireworksArr = []; for (let i = 0; i < 5; i++) fireworksArr.push(new Firework()); }

function renderStarrySky() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const g = ctx.createLinearGradient(0, 0, 0, canvas.height); g.addColorStop(0, '#0a0e2c'); g.addColorStop(1, '#1a1b3a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => s.update()); shootingStars.forEach(ss => ss.update());
    if (isBirthday) heartsArr.forEach(h => h.update());
    requestAnimationFrame(renderStarrySky);
}
function renderFireworks() {
    if (!fireworksCtx) return;
    fireworksCtx.fillStyle = 'rgba(0, 0, 0, 0.2)'; fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    fireworksArr.forEach(f => f.update());
    if (isBirthday) requestAnimationFrame(renderFireworks);
}

function getTargetDate(year) {
    return new Date(year, BIRTHDAY_MONTH, BIRTHDAY_DAY, BIRTHDAY_HOUR, BIRTHDAY_MINUTE, BIRTHDAY_SECOND);
}

// 核心判断逻辑
function checkBirthday() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const birthdayDate = getTargetDate(currentYear);
    const endCelebration = new Date(birthdayDate);
    endCelebration.setDate(endCelebration.getDate() + CELEBRATION_DAYS);
    
    // 如果在生日范围内
    if (now >= birthdayDate && now < endCelebration) {
        isBirthday = true;
        countdownContainer.classList.add('hidden');
        birthdayContainer.classList.remove('hidden');
        document.getElementById('greeting-section').classList.remove('hidden');
        document.querySelectorAll('.fullscreen-section:not(#greeting-section)').forEach(s => s.style.display = "none");
        initHearts();
        if (fireworksCtx) { initFireworks(); renderFireworks(); }
        if (giftBox) setupGiftBox();
    } else {
        isBirthday = false;
        countdownContainer.classList.remove('hidden');
        birthdayContainer.classList.add('hidden');
        updateCountdown();
    }
}

// ================= 重点：倒计时及自动刷新逻辑 =================
function updateCountdown() {
    // 如果已经是生日模式，不再执行刷新逻辑
    if (isBirthday) return;

    const now = new Date();
    let target = getTargetDate(now.getFullYear());
    
    // 如果今天的时间已经过了，倒计时指向明年
    if (now > target) target = getTargetDate(now.getFullYear() + 1);
    
    const diff = target - now;

    // 关键：只要倒计时结束，立即刷新页面
    // 使用 <= 0 确保不会因为 1ms 的误差跳过判断
    if (diff <= 0) {
        console.log("倒计时结束，正在跳转...");
        window.location.reload(); 
        return; 
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);
    
    if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
    if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
    if (minutesElement) minutesElement.textContent = mins.toString().padStart(2, '0');
    if (secondsElement) secondsElement.textContent = secs.toString().padStart(2, '0');

    const reminder = document.querySelector('.birthday-reminder');
    if (reminder && days < 7) {
        reminder.classList.add('coming-soon');
    }
}

function setupGiftBox() {
    giftBox.addEventListener('click', () => {
        giftBox.classList.add('opened');
        setTimeout(() => {
            giftSection.classList.add('opened');
            const msg = document.querySelector('#greeting-section .birthday-message');
            const ind = document.querySelector('#greeting-section .scroll-indicator');
            if (msg) msg.classList.remove('hidden');
            if (ind) { ind.classList.remove('hidden'); ind.classList.add('scroll-indicator-visible'); }
            setTimeout(() => {
                document.querySelectorAll('.fullscreen-section:not(#greeting-section)').forEach(s => {
                    s.style.display = ""; s.classList.remove('hidden');
                    const si = s.querySelector('.scroll-indicator');
                    if (si && s.id !== 'love-letter-section') si.classList.add('scroll-indicator-visible');
                });
                if (loveTree) { 
                    if (!loveTreeObj) loveTreeObj = new LoveTree(loveTree); 
                    (function updateTree(){ 
                        loveTreeObj.update(); 
                        if(isBirthday) requestAnimationFrame(updateTree); 
                    })(); 
                }
                showSpecialWishes();
            }, 500);
        }, 1000);
    });
}

function setupWishMaking() {
    if (!makeWishBtn) return;
    makeWishBtn.onclick = () => {
        const f = document.querySelector('.flame');
        const res = document.getElementById('wish-result');
        if (f) {
            f.style.opacity = '0'; f.style.filter = 'blur(8px)';
            setTimeout(() => {
                if (res) { res.innerHTML = '<div class="wish-success">✨ 愿望已送出 ✨<br>愿你心想事成!</div>'; res.style.opacity = '1'; }
                makeWishBtn.disabled = true; makeWishBtn.textContent = '愿望已送出';
                createGoldParticles();
            }, 500);
        }
    };
}

function createGoldParticles() {
    const container = document.querySelector('.cake-container'); if (!container) return;
    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        const size = 3 + Math.random() * 5;
        Object.assign(p.style, { width: `${size}px`, height: `${size}px`, position: 'absolute', backgroundColor: 'gold', borderRadius: '50%', left: '50%', top: '0' });
        const angle = Math.random() * Math.PI * 2, dist = 50 + Math.random() * 100;
        const ex = Math.cos(angle) * dist, ey = Math.sin(angle) * dist + 50;
        p.animate([{ transform: 'translate(-50%, -50%)', opacity: 1 }, { transform: `translate(calc(-50% + ${ex}px), calc(-50% + ${ey}px))`, opacity: 0 }], { duration: 1000 + Math.random() * 1000, easing: 'ease-out' }).onfinish = () => p.remove();
        container.appendChild(p);
    }
}

function showSpecialWishes() { if (loveTreeObj) for (let i = 0; i < 5; i++) setTimeout(() => loveTreeObj.addHeart(Math.random() * loveTree.width, Math.random() * loveTree.height * 0.7), i * 300); setupWishMaking(); }

function setupMusicControl() {
    if (!musicToggle) return;
    musicToggle.onclick = () => { if (bgm.paused) { bgm.play(); musicToggle.classList.add('playing'); } else { bgm.pause(); musicToggle.classList.remove('playing'); } };
    document.onclick = () => { if (bgm && bgm.paused) { bgm.play().catch(() => {}); musicToggle.classList.add('playing'); } };
}

function setupScrollIndicators() {
    const sections = document.querySelectorAll('.fullscreen-section');
    document.querySelectorAll('.scroll-indicator').forEach((ind, i) => {
        ind.onclick = () => { if (i < sections.length - 1) sections[i+1].scrollIntoView({ behavior: 'smooth' }); };
    });
}

function init() {
    setCanvasSize(); 
    initStars(); 
    initShootingStars(); 
    checkBirthday(); 
    setupMusicControl(); 
    setupScrollIndicators(); 
    renderStarrySky();
    
    // 如果还没到生日，每秒更新倒计时（包含自动刷新逻辑）
    if (!isBirthday) {
        setInterval(updateCountdown, 1000);
    }
    
    // 每分钟检查一次日期状态（兜底逻辑）
    setInterval(checkBirthday, 60000);
}

window.onload = init;
window.onresize = () => { setCanvasSize(); initStars(); initShootingStars(); initHearts(); };