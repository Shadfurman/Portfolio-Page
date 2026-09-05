const blogList = document.getElementById('blog-list');
const blogStatus = document.getElementById('blog-status');
const dateFormat = new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

fetch('blog_summaries.json?v=2')
  .then(response => {
    if (!response.ok) throw new Error('Unable to load posts');
    return response.json();
  })
  .then(blogs => {
    const entries = document.createDocumentFragment();
    blogs.forEach(blog => {
      const article = document.createElement('article');
      article.className = 'blog-entry';
      const date = document.createElement('time');
      date.dateTime = blog.createdDate;
      date.textContent = dateFormat.format(new Date(blog.createdDate));
      const heading = document.createElement('h3');
      const link = document.createElement('a');
      link.textContent = blog.title;
      link.href = blog.link.replaceAll('\\', '/');
      heading.append(link);
      const summary = document.createElement('p');
      summary.textContent = (blog.excerpt || blog.summary).trim().replace(/\s+/g, ' ');
      article.append(date, heading, summary);
      entries.append(article);
    });
    blogList.append(entries);
    blogStatus.remove();
  })
  .catch(() => {
    blogStatus.textContent = 'The posts couldn’t load. Please refresh to try again.';
  });

// Load the PDF only when someone opens the preview.
document.querySelector('.resume-preview').addEventListener('toggle', event => {
  const frame = document.getElementById('resume-iframe');
  if (event.currentTarget.open && !frame.hasAttribute('src')) frame.src = frame.dataset.src;
});

// Three grid-based trails. Only this narrow canvas redraws, at 10 fps.
const matrix = document.getElementById('matrix-container');
const context = matrix.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionToggle = document.getElementById('motion-toggle');
let motionEnabled = !reducedMotion.matches;
let motionChosen = false;
let rainTimer = 0;
let rainHeight = 0;
let rainWidth = 0;
const cell = 18;
// This font maps its Matrix symbols to lowercase; uppercase is ordinary Latin.
const glyphs = 'abcdefghijklmnopqrstuvwxyz0123456789';
const randomGlyph = () => glyphs[Math.floor(Math.random() * glyphs.length)];
const trails = Array.from({ length: 3 }, (_, i) => ({ head: 3 + i * 11, length: 10 + i * 3, ticks: 0, pace: i + 1, glyphs: [] }));

function drawRain() {
  context.clearRect(0, 0, rainWidth, rainHeight);
  context.font = '14px "Matrix Code", monospace';
  context.textAlign = 'center';
  trails.forEach((trail, column) => {
    for (let age = 0; age < trail.length; age++) {
      const row = trail.head - age;
      if (row < 0 || row * cell > rainHeight) continue;
      context.fillStyle = age === 0 ? 'rgba(165, 165, 165, .55)' : `rgba(180, 180, 180, ${.36 * (1 - age / trail.length)})`;
      context.fillText(trail.glyphs[row] || 'a', rainWidth * (column + .5) / 3, row * cell);
    }
  });
}
function sizeRain() {
  const rect = matrix.getBoundingClientRect();
  rainWidth = rect.width;
  rainHeight = rect.height;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  matrix.width = Math.round(rainWidth * ratio);
  matrix.height = Math.round(rainHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  trails.forEach(trail => { trail.glyphs = Array.from({ length: Math.ceil(rainHeight / cell) + 20 }, randomGlyph); });
  drawRain();
}
function stepRain() {
  trails.forEach(trail => {
    if (++trail.ticks % trail.pace !== 0) return;
    trail.head++;
    trail.glyphs[trail.head] = randomGlyph();
    if (trail.head > rainHeight / cell + trail.length) trail.head = 0;
  });
  drawRain();
}
sizeRain();
document.fonts.load('14px "Matrix Code"').then(drawRain);
addEventListener('resize', sizeRain, { passive: true });

// Parallax only updates on scroll while the portrait is visible.
const portrait = document.querySelector('.portrait');
const photo = document.getElementById('profile-picture');
let portraitVisible = false;
let frameRequest = 0;
function updatePortrait() {
  frameRequest = 0;
  const distance = Math.max(-18, Math.min(18, -portrait.getBoundingClientRect().top * .065));
  photo.style.setProperty('--portrait-offset', `${distance.toFixed(1)}px`);
}
function schedulePortrait() {
  if (portraitVisible && !document.hidden && motionEnabled && !frameRequest) frameRequest = requestAnimationFrame(updatePortrait);
}
new IntersectionObserver(([entry]) => {
  portraitVisible = entry.isIntersecting;
  schedulePortrait();
}).observe(portrait);
addEventListener('scroll', schedulePortrait, { passive: true });
addEventListener('resize', schedulePortrait, { passive: true });
function syncMotion() {
  clearInterval(rainTimer);
  rainTimer = 0;
  if (motionEnabled && !document.hidden) rainTimer = setInterval(stepRain, 100);
  motionToggle.textContent = motionEnabled ? 'Pause ambient motion' : 'Play ambient motion';
  motionToggle.setAttribute('aria-pressed', String(motionEnabled));
  if (frameRequest) cancelAnimationFrame(frameRequest);
  frameRequest = 0;
  if (!motionEnabled) photo.style.removeProperty('--portrait-offset');
  schedulePortrait();
}
motionToggle.addEventListener('click', () => {
  motionChosen = true;
  motionEnabled = !motionEnabled;
  syncMotion();
});
document.addEventListener('visibilitychange', syncMotion);
reducedMotion.addEventListener('change', () => {
  if (!motionChosen) motionEnabled = !reducedMotion.matches;
  syncMotion();
});
syncMotion();
