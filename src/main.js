import * as THREE from 'three';
import './style.css';

// Chỉnh thông tin buổi lễ tại đây trước khi xuất bản.
const EVENT = {
  graduateName: 'Ngô Hải Minh Nguyên',
  shortName: 'Minh Nguyên',
  year: '2026',
  date: 'Thứ Bảy, 07/11/2026',
  time: '10:00 - 12:00 sáng',
  dateTime: '2026-11-07T10:00:00+07:00',
  endDateTime: '2026-11-07T12:00:00+07:00',
  venue: 'Hội trường lớn',
  address: 'Đại học FPT TP.HCM · Khu Công nghệ cao, Thủ Đức',
  mapsUrl: 'https://maps.google.com/?q=FPT+University+HCMC',
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const params = new URLSearchParams(window.location.search);
const guestName = (params.get('to') || params.get('name') || '').trim().slice(0, 80);
const safeGuestName = guestName.replace(/[<>]/g, '');

const toast = (message) => {
  const el = document.querySelector('#toast');
  el.textContent = message;
  el.classList.add('show');
  window.setTimeout(() => el.classList.remove('show'), 2800);
};

// ── Content binding ────────────────────────────────────
document.querySelector('#personalGreeting').textContent = safeGuestName
  ? `Thân mời ${safeGuestName},`
  : 'Thân mời gia đình và bạn bè,';
document.querySelector('#sealTo').textContent = safeGuestName
  ? `Thân gửi ${safeGuestName}`
  : 'Thân gửi gia đình và bạn bè';
document.querySelector('#sealGraduate').textContent = EVENT.graduateName;
document.querySelector('#memoryCopy').textContent = safeGuestName
  ? `${EVENT.shortName} rất vui nếu ${safeGuestName} có mặt trong ngày đặc biệt này.`
  : 'Hành trình này đẹp hơn vì có bạn trong đó.';
document.title = `${safeGuestName ? `Thân mời ${safeGuestName} · ` : ''}Lễ tốt nghiệp của ${EVENT.graduateName}`;

document.querySelector('#classYear').textContent = EVENT.year;
document.querySelector('#footerYear').textContent = EVENT.year;
document.querySelector('#eventDate').textContent = EVENT.date;
document.querySelector('#eventTime').textContent = EVENT.time;
document.querySelector('#eventVenue').textContent = EVENT.venue;
document.querySelector('#eventAddress').textContent = EVENT.address;
document.querySelector('#mapLink').href = EVENT.mapsUrl;

// ── Calendar (mở thẳng Google Calendar) ────────────────
const toGoogleStamp = (iso) =>
  new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

document.querySelector('#calendarLink').href = `https://calendar.google.com/calendar/render?${new URLSearchParams({
  action: 'TEMPLATE',
  text: `Lễ tốt nghiệp của ${EVENT.graduateName}`,
  dates: `${toGoogleStamp(EVENT.dateTime)}/${toGoogleStamp(EVENT.endDateTime)}`,
  details: `${EVENT.date} · ${EVENT.time}`,
  location: `${EVENT.venue}, ${EVENT.address}`,
}).toString()}`;

// ── Share ──────────────────────────────────────────────
document.querySelector('#shareInvite').addEventListener('click', async () => {
  const url = new URL(window.location.href);
  if (safeGuestName) url.searchParams.set('to', safeGuestName);
  else url.searchParams.delete('to');
  url.searchParams.delete('name');
  const link = url.toString();
  try {
    await navigator.clipboard.writeText(link);
    toast(safeGuestName
      ? `Đã sao chép thiệp mời dành cho ${safeGuestName}`
      : 'Đã sao chép liên kết thiệp mời');
  } catch {
    window.prompt('Hãy sao chép liên kết thiệp mời này:', link);
  }
});

document.querySelector('#openInvite').addEventListener('click', () => {
  document.querySelector('#invitation').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  document.querySelector('#invitation').classList.add('revealed');
  burstConfetti();
  swingTassel(1.4);
});

// ── Countdown ──────────────────────────────────────────
const graduationTime = new Date(EVENT.dateTime).getTime();
const countdownIds = ['days', 'hours', 'minutes', 'seconds'];
const countdownContainer = document.createElement('section');
countdownContainer.className = 'countdown';
countdownContainer.setAttribute('aria-label', 'Đếm ngược đến ngày tốt nghiệp');
countdownContainer.innerHTML = `
  <p class="countdown-title">ĐẾM NGƯỢC ĐẾN NGÀY VUI</p>
  <div class="countdown-grid">
    <div class="countdown-unit"><strong id="days">00</strong><span>Ngày</span></div>
    <div class="countdown-unit"><strong id="hours">00</strong><span>Giờ</span></div>
    <div class="countdown-unit"><strong id="minutes">00</strong><span>Phút</span></div>
    <div class="countdown-unit"><strong id="seconds">00</strong><span>Giây</span></div>
  </div>`;
document.querySelector('#invitation .paper-card').insertBefore(
  countdownContainer,
  document.querySelector('#invitation .paper-card .card-footer'),
);

function updateCountdown() {
  let distance = graduationTime - Date.now();
  if (distance < 0) distance = 0;
  const values = [
    Math.floor(distance / 86400000),
    Math.floor((distance % 86400000) / 3600000),
    Math.floor((distance % 3600000) / 60000),
    Math.floor((distance % 60000) / 1000),
  ];
  countdownIds.forEach((id, index) => {
    document.getElementById(id).textContent = String(values[index]).padStart(2, '0');
  });
}
updateCountdown();
window.setInterval(updateCountdown, 1000);

// ── Soft paper rustle (Web Audio) ──────────────────────
function playRustle() {
  if (reduceMotion) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 0.45;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const envelope = Math.exp(-t * 7) * (1 - t / duration);
      data[i] = (Math.random() * 2 - 1) * envelope * 0.045;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 0.7;
    source.connect(filter);
    filter.connect(ctx.destination);
    source.start();
    window.setTimeout(() => ctx.close(), 800);
  } catch {
    /* audio optional */
  }
}

// ── Gold foil confetti ─────────────────────────────────
function burstConfetti() {
  if (reduceMotion) return;
  const layer = document.querySelector('#confetti');
  layer.innerHTML = '';
  const count = 36;
  for (let i = 0; i < count; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    const left = 10 + Math.random() * 80;
    const dx = `${(Math.random() - 0.5) * 180}px`;
    const rot = `${(Math.random() - 0.5) * 720}deg`;
    piece.style.left = `${left}%`;
    piece.style.setProperty('--dx', dx);
    piece.style.setProperty('--rot', rot);
    piece.style.animationDelay = `${Math.random() * 0.35}s`;
    layer.appendChild(piece);
  }
  window.setTimeout(() => { layer.innerHTML = ''; }, 2400);
}

// ── Seal open ritual ───────────────────────────────────
const sealCover = document.querySelector('#sealCover');
const openSeal = document.querySelector('#openSeal');

function revealInvite() {
  document.body.classList.remove('is-sealed');
  document.body.classList.add('is-open');
  sealCover.classList.add('is-opening');
  playRustle();
  burstConfetti();
  swingTassel(1.8);
  window.setTimeout(() => {
    sealCover.classList.add('is-gone');
    sealCover.setAttribute('aria-hidden', 'true');
  }, reduceMotion ? 50 : 750);
  // Reveal invite card when it enters view later
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.disconnect();
      }
    });
  }, { threshold: 0.25 });
  observer.observe(document.querySelector('#invitation'));
}

openSeal.addEventListener('click', revealInvite);
openSeal.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    revealInvite();
  }
});

// ── Three.js scene ─────────────────────────────────────
const PAPER = '#e6e2d6';
const canvas = document.querySelector('#scene');
const scene = new THREE.Scene();
scene.background = new THREE.Color(PAPER);
scene.fog = new THREE.Fog(PAPER, 9, 23);

const camera = new THREE.PerspectiveCamera(36, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0.15, 12);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

scene.add(new THREE.HemisphereLight('#f5f0e4', '#6e7a68', 2.0));
const keyLight = new THREE.DirectionalLight('#fff4dc', 2.8);
keyLight.position.set(-4, 6, 7);
scene.add(keyLight);
const rimLight = new THREE.PointLight('#c4a86a', 16, 30);
rimLight.position.set(4, 2, 4);
scene.add(rimLight);

const capGroup = new THREE.Group();
scene.add(capGroup);
const capMaterial = new THREE.MeshStandardMaterial({ color: '#24382e', roughness: 0.48, metalness: 0.12 });
const goldMaterial = new THREE.MeshStandardMaterial({ color: '#b8924c', roughness: 0.35, metalness: 0.62 });
const board = new THREE.Mesh(new THREE.BoxGeometry(2.25, 0.12, 2.25), capMaterial);
board.position.y = 0.25;
board.rotation.y = -0.18;
capGroup.add(board);
const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.82, 0.72, 4, 1), capMaterial);
crown.position.y = -0.2;
crown.rotation.y = Math.PI / 4 - 0.18;
capGroup.add(crown);
const button = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 16), goldMaterial);
button.position.set(0, 0.34, 0);
capGroup.add(button);

const tasselGroup = new THREE.Group();
tasselGroup.position.set(0.78, 0.28, 0.12);
capGroup.add(tasselGroup);
const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.92, 8), goldMaterial);
cord.position.set(0.08, -0.25, 0);
cord.rotation.z = -0.2;
tasselGroup.add(cord);
const tassel = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 12), goldMaterial);
tassel.position.set(0.22, -0.67, 0);
tasselGroup.add(tassel);

capGroup.position.set(3.1, 0.35, 0);
capGroup.rotation.set(-0.08, -0.32, -0.12);
capGroup.scale.setScalar(0.92);

const particleCount = 160;
const positions = new Float32Array(particleCount * 3);
const sizes = [];
for (let i = 0; i < particleCount; i++) {
  positions[i * 3] = (Math.random() - 0.5) * 19;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 13;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 9 - 1;
  sizes.push(Math.random());
}
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particleMaterial = new THREE.PointsMaterial({
  color: '#b8924c',
  size: 0.045,
  transparent: true,
  opacity: 0.68,
  depthWrite: false,
  sizeAttenuation: true,
});
const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

const ringGroup = new THREE.Group();
scene.add(ringGroup);
const ringMaterial = new THREE.MeshBasicMaterial({ color: '#8a9480', transparent: true, opacity: 0.3 });
for (let i = 0; i < 3; i++) {
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.8 + i * 0.34, 0.008, 5, 100), ringMaterial);
  ring.rotation.set(0.4 + i * 0.25, 0.3 + i * 0.5, i * 0.65);
  ring.position.set(3.1, 0.35, -1.4);
  ringGroup.add(ring);
}

let pointerX = 0;
let pointerY = 0;
let dragX = 0;
let dragY = 0;
let targetDragX = 0;
let targetDragY = 0;
let isDragging = false;
let tasselBoost = 0;
let scrollOffset = 0;

function swingTassel(amount = 1) {
  tasselBoost = Math.max(tasselBoost, amount);
}

window.addEventListener('pointermove', (event) => {
  pointerX = (event.clientX / window.innerWidth - 0.5) * 2;
  pointerY = (event.clientY / window.innerHeight - 0.5) * 2;
  if (isDragging) {
    targetDragX = pointerX;
    targetDragY = pointerY;
  }
}, { passive: true });

window.addEventListener('pointerdown', (event) => {
  if (!document.body.classList.contains('is-open')) return;
  // Allow tilt when interacting on empty areas / canvas region (right half on desktop)
  const narrow = window.innerWidth < 760;
  const inCapZone = narrow ? event.clientY > window.innerHeight * 0.55 : event.clientX > window.innerWidth * 0.52;
  if (inCapZone) {
    isDragging = true;
    targetDragX = pointerX;
    targetDragY = pointerY;
  }
}, { passive: true });

window.addEventListener('pointerup', () => {
  if (isDragging) {
    isDragging = false;
    swingTassel(0.9 + Math.abs(targetDragX) * 0.6);
  }
}, { passive: true });

window.addEventListener('scroll', () => {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  scrollOffset = window.scrollY / max;
}, { passive: true });

function layoutCap() {
  const narrow = window.innerWidth < 760;
  capGroup.position.x = narrow ? 0.1 : 3.1;
  capGroup.position.y = (narrow ? -2.45 : 0.35) - scrollOffset * (narrow ? 0.4 : 1.2);
  capGroup.scale.setScalar(narrow ? 0.54 : 0.92);
  ringGroup.position.x = narrow ? 0.1 : 0;
  ringGroup.position.y = narrow ? -2.45 : 0;
  ringGroup.position.y -= scrollOffset * (narrow ? 0.3 : 0.9);
}

function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  layoutCap();
}
window.addEventListener('resize', resize);
resize();

const clock = new THREE.Clock();
const baseCapY = { desktop: 0.35, mobile: -2.45 };

function animate() {
  const t = clock.getElapsedTime();
  const narrow = window.innerWidth < 760;
  dragX += (targetDragX - dragX) * 0.08;
  dragY += (targetDragY - dragY) * 0.08;
  if (!isDragging) {
    targetDragX *= 0.94;
    targetDragY *= 0.94;
  }

  const motionScale = reduceMotion ? 0 : 1;
  capGroup.rotation.y = -0.32 + Math.sin(t * 0.35) * 0.16 * motionScale + pointerX * 0.05 * motionScale + dragX * 0.35;
  capGroup.rotation.x = -0.08 + Math.sin(t * 0.5) * 0.035 * motionScale + pointerY * 0.03 * motionScale + dragY * 0.28;
  const baseY = (narrow ? baseCapY.mobile : baseCapY.desktop) - scrollOffset * (narrow ? 0.4 : 1.2);
  capGroup.position.y = baseY + Math.sin(t * 0.8) * 0.05 * motionScale;

  tasselBoost *= 0.965;
  tasselGroup.rotation.z = -0.12 + Math.sin(t * 2.4) * 0.08 * motionScale + Math.sin(t * 5.5) * tasselBoost * 0.22;
  tasselGroup.rotation.x = Math.sin(t * 1.8) * 0.04 * motionScale + dragX * 0.08;

  ringGroup.rotation.y = t * 0.035 * motionScale;
  particles.rotation.y = t * 0.012 * motionScale;

  if (!reduceMotion) {
    const p = particleGeometry.attributes.position;
    for (let i = 0; i < particleCount; i++) {
      p.array[i * 3 + 1] += 0.0015 + sizes[i] * 0.0015;
      if (p.array[i * 3 + 1] > 7) p.array[i * 3 + 1] = -7;
    }
    p.needsUpdate = true;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

if (reduceMotion) {
  capGroup.rotation.set(-0.08, -0.32, -0.12);
}
