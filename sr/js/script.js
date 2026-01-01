// 全局变量
const BIRTHDAY_MONTH = 1; // JavaScript中月份从0开始，所以5月是4
const BIRTHDAY_DAY = 3;
const CELEBRATION_DAYS = 3; // 生日庆祝持续30天

// DOM元素
const countdownContainer = document.getElementById('countdown-container');
const birthdayContainer = document.getElementById('birthday-container');
const birthdayContent = document.getElementById('birthday-content');
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
const loveTreeCtx = loveTree ? loveTree.getContext('2d') : null;
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
        // 闪烁效果
        this.alpha += this.alphaChange;
        if (this.alpha <= 0 || this.alpha >= 1) {
            this.alphaChange = -this.alphaChange;
        }
        // 微小移动
        this.x += (Math.random() - 0.5) * 0.3;
        this.y += (Math.random() - 0.5) * 0.3;
        // 边界检查
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        this.draw();
    }
}

// 流星类
class ShootingStar {
    constructor() {
        this.reset();
    }

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
        if (!this.active) {
            if (Math.random() < 0.005) { // 控制流星出现的频率
                this.reset();
            }
            return;
        }
        
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        
        // 淡出效果
        this.alpha -= 0.01;
        
        if (this.y > canvas.height || this.x < 0 || this.x > canvas.width || this.alpha <= 0) {
            this.active = false;
        }
        
        this.draw();
    }
}

// 爱心类
class Heart {
    constructor() {
        this.reset();
    }
    
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
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.bezierCurveTo(0, -this.size / 2, this.size, -this.size, 0, this.size);
        ctx.bezierCurveTo(-this.size, -this.size, 0, -this.size / 2, 0, this.size / 2);
        ctx.fill();
        ctx.restore();
    }
    
    update() {
        this.y -= this.speed;
        this.rotation += this.rotationSpeed;
        
        if (this.y < -this.size) {
            this.reset();
        }
        
        this.draw();
    }
}

// 烟花粒子类
class FireworkParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color || `hsl(${Math.random() * 360}, 100%, 70%)`;
        this.velocity = {
            x: (Math.random() - 0.5) * 6,
            y: (Math.random() - 0.5) * 6
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.gravity = 0.1;
        this.size = Math.random() * 3 + 1;
    }
    
    draw() {
        fireworksCtx.beginPath();
        fireworksCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        fireworksCtx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        fireworksCtx.fill();
    }
    
    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
        this.draw();
    }
}

// 烟花类
class Firework {
    constructor() {
        this.reset();
    }
    
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
        // 创建爆炸粒子
        for (let i = 0; i < 100; i++) {
            this.particles.push(new FireworkParticle(this.x, this.y, this.color));
        }
        // 播放爆炸声音效果（可选）
        if (Math.random() > 0.7) { // 不是每个烟花都播放声音，以避免声音重叠
            const popSound = new Audio();
            popSound.volume = 0.3;
            popSound.play().catch(e => console.log('播放爆炸声受限：', e));
        }
    }
    
    draw() {
        if (!this.exploded) {
            fireworksCtx.beginPath();
            fireworksCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            fireworksCtx.fillStyle = `rgb(${this.color})`;
            fireworksCtx.fill();
        }
    }
    
    update() {
        if (!this.exploded) {
            this.y -= this.speed;
            
            // 到达目标位置，爆炸
            if (this.y <= this.targetY) {
                this.explode();
            }
            this.draw();
        } else {
            // 更新粒子
            for (let i = this.particles.length - 1; i >= 0; i--) {
                this.particles[i].update();
                if (this.particles[i].alpha <= 0) {
                    this.particles.splice(i, 1);
                }
            }
            
            // 当所有粒子消失，重新生成烟花
            if (this.particles.length === 0) {
                this.reset();
            }
        }
    }
}

// 爱心树类
class LoveTree {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.branches = [];
        this.hearts = [];
        
        // 创建初始树干
        this.addBranch(canvas.width / 2, canvas.height, canvas.width / 2, canvas.height - 100, 10);
        
        // 添加树枝
        this.growTree(canvas.width / 2, canvas.height - 100, 270, 8, 3);
        
        // 设置点击事件
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.addHeart(x, y);
        });
    }
    
    addBranch(startX, startY, endX, endY, width) {
        this.branches.push({
            startX,
            startY,
            endX,
            endY,
            width
        });
    }
    
    growTree(x, y, angle, width, depth) {
        if (depth === 0) return;
        
        const length = 30 + Math.random() * 20;
        const endX = x + Math.cos(angle * Math.PI / 180) * length;
        const endY = y + Math.sin(angle * Math.PI / 180) * length;
        
        this.addBranch(x, y, endX, endY, width);
        
        const branchCount = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < branchCount; i++) {
            const newAngle = angle + (-20 + Math.random() * 40);
            this.growTree(endX, endY, newAngle, width * 0.7, depth - 1);
        }
    }
    
    addHeart(x, y) {
        this.hearts.push({
            x,
            y,
            size: 5 + Math.random() * 10,
            color: `hsl(${340 + Math.random() * 40}, 100%, 60%)`,
            alpha: 1,
            rotation: Math.random() * Math.PI * 2
        });
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制树枝
        for (const branch of this.branches) {
            this.ctx.beginPath();
            this.ctx.moveTo(branch.startX, branch.startY);
            this.ctx.lineTo(branch.endX, branch.endY);
            this.ctx.strokeStyle = '#573b1f';
            this.ctx.lineWidth = branch.width;
            this.ctx.stroke();
        }
        
        // 绘制爱心
        for (const heart of this.hearts) {
            this.ctx.save();
            this.ctx.translate(heart.x, heart.y);
            this.ctx.rotate(heart.rotation);
            this.ctx.fillStyle = heart.color;
            this.ctx.globalAlpha = heart.alpha;
            
            this.ctx.beginPath();
            this.ctx.bezierCurveTo(0, -heart.size / 2, heart.size, -heart.size, 0, heart.size);
            this.ctx.bezierCurveTo(-heart.size, -heart.size, 0, -heart.size / 2, 0, heart.size / 2);
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    update() {
        // 更新爱心状态
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const heart = this.hearts[i];
            heart.alpha -= 0.003;
            heart.rotation += 0.01;
            
            if (heart.alpha <= 0) {
                this.hearts.splice(i, 1);
            }
        }
        
        this.draw();
    }
}

// 创建星星
let stars = [];
let shootingStars = [];
let hearts = [];
let fireworks = [];
let loveTreeObj = null;
let isBirthday = false;

function initStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push(new Star());
    }
}

function initShootingStars() {
    shootingStars = [];
    for (let i = 0; i < 3; i++) {
        const shootingStar = new ShootingStar();
        shootingStar.active = false; // 初始设置为不活跃
        shootingStars.push(shootingStar);
    }
}

function initHearts() {
    hearts = [];
    if (isBirthday) {
        for (let i = 0; i < 20; i++) {
            hearts.push(new Heart());
        }
    }
}

function initFireworks() {
    if (!fireworksCtx) return;
    
    fireworks = [];
    for (let i = 0; i < 5; i++) {
        fireworks.push(new Firework());
    }
}

function initLoveTree() {
    if (loveTree) {
        loveTreeObj = new LoveTree(loveTree);
    }
}

// 渲染星空
function renderStarrySky() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制星空背景
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0e2c');
    gradient.addColorStop(1, '#1a1b3a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 更新星星
    stars.forEach(star => star.update());
    
    // 更新流星
    shootingStars.forEach(shootingStar => shootingStar.update());
    
    // 更新爱心
    if (isBirthday) {
        hearts.forEach(heart => heart.update());
    }
    
    requestAnimationFrame(renderStarrySky);
}

// 渲染烟花
function renderFireworks() {
    if (!fireworksCtx) return;
    
    fireworksCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    fireworksCtx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    fireworks.forEach(firework => firework.update());
    
    if (isBirthday) {
        requestAnimationFrame(renderFireworks);
    }
}

// 更新爱心树
function updateLoveTree() {
    if (loveTreeObj) {
        loveTreeObj.update();
    }
    
    if (isBirthday) {
        requestAnimationFrame(updateLoveTree);
    }
}

// 检查是否是生日
function checkBirthday() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const birthdayDate = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);
    const nextDay = new Date(birthdayDate);
    nextDay.setDate(nextDay.getDate() + CELEBRATION_DAYS);
    
    // 检查当前日期是否在生日范围内（包括额外庆祝天数）
    if (now >= birthdayDate && now < nextDay) {
        // 是生日期间，显示祝福
        isBirthday = true;
        countdownContainer.classList.add('hidden');
        birthdayContainer.classList.remove('hidden');
        
        // 只显示第一个部分greeting-section，其他部分完全隐藏
        document.getElementById('greeting-section').classList.remove('hidden');
        
        // 隐藏其他所有部分
        document.querySelectorAll('.fullscreen-section:not(#greeting-section)').forEach(section => {
            section.style.display = "none"; // 使用display:none完全隐藏，而不仅是添加hidden类
        });
        
        initHearts(); // 初始化爱心
        
        // 初始化生日特效
        if (fireworksCtx) {
            initFireworks();
            renderFireworks();
        }
        
        // 初始化礼物盒点击事件
        if (giftBox) {
            setupGiftBox();
        }
    } else {
        // 不是生日，显示倒计时
        isBirthday = false;
        countdownContainer.classList.remove('hidden');
        birthdayContainer.classList.add('hidden');
        updateCountdown();
    }
}

// 设置礼物盒开启效果
function setupGiftBox() {
    giftBox.addEventListener('click', () => {
        giftBox.classList.add('opened');
        
        // 礼物盒动画后显示内容
        setTimeout(() => {
            giftSection.classList.add('opened');
            
            // 显示祝福信息和滚动指示器
            const birthdayMessage = document.querySelector('#greeting-section .birthday-message');
            const scrollIndicator = document.querySelector('#greeting-section .scroll-indicator');
            
            if (birthdayMessage) birthdayMessage.classList.remove('hidden');
            if (scrollIndicator) {
                scrollIndicator.classList.remove('hidden');
                scrollIndicator.classList.add('scroll-indicator-visible'); // 添加可见类
            }
            
            // 显示所有全屏部分
            setTimeout(() => {
                // 先恢复其他部分的display属性，再移除hidden类
                document.querySelectorAll('.fullscreen-section:not(#greeting-section)').forEach(section => {
                    section.style.display = ""; // 恢复默认显示
                    section.classList.remove('hidden');
                    
                    // 同时显示其他部分的滚动指示器（除了最后一个部分）
                    const sectionIndicator = section.querySelector('.scroll-indicator');
                    if (sectionIndicator && section.id !== 'love-letter-section') {
                        sectionIndicator.classList.add('scroll-indicator-visible');
                    }
                });
                
                // 初始化爱心树
                if (loveTree) {
                    initLoveTree();
                    updateLoveTree();
                }
                
                // 额外的祝贺效果
                showSpecialWishes();
            }, 500);
        }, 1000);
    });
}

// 许愿功能
function setupWishMaking() {
    if (!makeWishBtn) return;
    
    makeWishBtn.addEventListener('click', () => {
        const flame = document.querySelector('.flame');
        const wishResult = document.getElementById('wish-result');
        
        if (flame) {
            // 蜡烛熄灭效果
            flame.style.animation = 'none';
            flame.style.opacity = '0';
            flame.style.transform = 'translateY(10px) scale(0.5)';
            flame.style.filter = 'blur(8px)';
            
            // 播放风吹声音效果（可选）
            const blowSound = new Audio();
            blowSound.volume = 0.3;
            blowSound.play().catch(e => console.log('播放声音受限：', e));
            
            // 许愿成功动画
            setTimeout(() => {
                // 创建并显示漂亮的成功提示
                if (wishResult) {
                    const wishMessageEl = document.createElement('div');
                    wishMessageEl.className = 'wish-success';
                    wishMessageEl.innerHTML = '✨ 生日愿望已送出 ✨<br>愿你心想事成!';
                    wishResult.appendChild(wishMessageEl);
                    wishResult.style.opacity = '1';
                    
                    // 添加烟花庆祝效果
                    if (fireworks && fireworks.length) {
                        for (let i = 0; i < 5; i++) {
                            setTimeout(() => {
                                fireworks.push(new Firework());
                            }, i * 300);
                        }
                    }
                }
                
                // 禁用按钮，防止重复点击
                makeWishBtn.disabled = true;
                makeWishBtn.textContent = '愿望已送出';
                makeWishBtn.style.background = '#ccc';
                
                // 添加特殊效果：散落的金色粒子
                createGoldParticles();
            }, 500);
        }
    });
}

// 创建金色粒子效果
function createGoldParticles() {
    const cakeContainer = document.querySelector('.cake-container');
    if (!cakeContainer) return;
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'gold-particle';
        
        // 随机位置和大小
        const size = 3 + Math.random() * 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.position = 'absolute';
        particle.style.backgroundColor = `hsl(${40 + Math.random() * 20}, 100%, ${70 + Math.random() * 20}%)`;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 10px rgba(255, 215, 0, 0.8)';
        
        // 初始位置（从蜡烛处发散）
        particle.style.left = '50%';
        particle.style.top = '0';
        particle.style.transform = 'translate(-50%, -50%)';
        
        // 随机动画
        const duration = 1 + Math.random() * 2;
        const delay = Math.random() * 0.5;
        
        // 设置运动方向（随机角度）
        const angle = Math.random() * Math.PI * 2;
        const distance = 50 + Math.random() * 100;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance + 50; // 让粒子大致向下落
        
        // 应用动画
        particle.style.animation = `moveParticle ${duration}s ease-out ${delay}s forwards`;
        
        // 添加关键帧动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes moveParticle {
                0% {
                    transform: translate(-50%, -50%);
                    opacity: 1;
                }
                100% {
                    transform: translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px));
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // 添加到容器
        cakeContainer.appendChild(particle);
        
        // 动画结束后移除
        setTimeout(() => {
            particle.remove();
            style.remove();
        }, (duration + delay) * 1000 + 100);
    }
}

// 显示特别的祝福效果
function showSpecialWishes() {
    // 自动生成一些爱心在爱心树上
    if (loveTreeObj) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * loveTree.width;
                const y = Math.random() * (loveTree.height * 0.7);
                loveTreeObj.addHeart(x, y);
            }, i * 300);
        }
    }
    
    // 设置许愿功能
    setupWishMaking();
}

// 更新倒计时
function updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let birthdayDate = new Date(currentYear, BIRTHDAY_MONTH, BIRTHDAY_DAY);
    
    // 如果今年的生日已经过了，使用明年的生日日期
    if (now > birthdayDate) {
        birthdayDate = new Date(currentYear + 1, BIRTHDAY_MONTH, BIRTHDAY_DAY);
    }
    
    const diffTime = birthdayDate - now;
    
    // 计算剩余时间
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffTime % (1000 * 60)) / 1000);
    
    // 更新DOM
    daysElement.textContent = days.toString().padStart(2, '0');
    hoursElement.textContent = hours.toString().padStart(2, '0');
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
    
    // 在生日即将到来时(小于7天)添加特殊效果
    const birthdayReminder = document.querySelector('.birthday-reminder');
    if (birthdayReminder) {
        if (days < 7) {
            birthdayReminder.classList.add('coming-soon');
            
            // 当天数小于1时更新提示文字
            if (days < 1) {
                const reminderText = birthdayReminder.querySelector('.reminder-text');
                if (reminderText) {
                    reminderText.innerHTML = "今天是特别的日子！<strong>点击刷新</strong>查看为你准备的惊喜！";
                    
                    // 添加点击事件，刷新页面
                    if (!reminderText.hasClickHandler) {
                        reminderText.addEventListener('click', () => {
                            window.location.reload();
                        });
                        reminderText.style.cursor = 'pointer';
                        reminderText.hasClickHandler = true;
                    }
                }
            }
        } else {
            birthdayReminder.classList.remove('coming-soon');
        }
    }
}

// 音乐控制
function setupMusicControl() {
    musicToggle.addEventListener('click', () => {
        if (bgm.paused) {
            bgm.play();
            musicToggle.classList.add('playing');
        } else {
            bgm.pause();
            musicToggle.classList.remove('playing');
        }
    });
    
    // 当用户与页面交互时，尝试播放音乐
    document.addEventListener('click', () => {
        if (bgm.paused) {
            bgm.play().catch(error => {
                console.log('Auto-play prevented:', error);
            });
            musicToggle.classList.add('playing');
        }
    }, { once: true });
}

// 窗口调整大小处理
window.addEventListener('resize', () => {
    setCanvasSize();
    initStars();
    initShootingStars();
    initHearts();
    
    if (isBirthday && fireworksCtx) {
        fireworksCanvas.width = window.innerWidth;
        fireworksCanvas.height = window.innerHeight;
        initFireworks();
    }
});

// 处理滚动指示器显示逻辑
function setupScrollIndicators() {
    const sections = document.querySelectorAll('.fullscreen-section');
    const lastSectionIndicator = document.querySelector('#love-letter-section .scroll-indicator');
    
    // 最后一个部分不需要滚动指示器
    if (lastSectionIndicator) {
        lastSectionIndicator.style.display = 'none';
    }
    
    // 点击滚动指示器时，滚动到下一部分
    document.querySelectorAll('.scroll-indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index < sections.length - 1) {
                sections[index + 1].scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// 初始化函数
function init() {
    // 设置Canvas大小
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // 初始化星空
    initStars();
    initShootingStars();
    
    // 检查是否是生日
    checkBirthday();
    
    // 设置音乐控制
    setupMusicControl();
    
    // 设置滚动指示器
    setupScrollIndicators();
    
    // 渲染星空动画
    renderStarrySky();
    
    // 每秒更新倒计时
    if (!isBirthday) {
        setInterval(updateCountdown, 1000);
    }
    
    // 每小时检查一次是否是生日（以防用户长时间不刷新页面）
    setInterval(checkBirthday, 60 * 60 * 1000);
}

// 加载完成后启动
window.addEventListener('load', init); 