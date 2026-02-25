<template>
  <div class="app-container">
    
    <div class="falling-notes-container">
      <span 
        v-for="note in notes" 
        :key="note.id" 
        class="music-note"
        :style="{ 
          left: note.left, 
          animationDuration: note.duration, 
          animationDelay: note.delay, 
          fontSize: note.fontSize 
        }"
      >
        {{ note.symbol }}
      </span>
    </div>

    <nav class="navbar glass-panel">
      <div class="logo">XR.</div>
      <div class="nav-links">
        <a href="#">Home</a>
        <a href="#about">About</a>
        <a href="#portfolio">Portfolio</a>
        <a href="#gallery">Gallery</a>
        <a href="#guestbook">Guestbook</a>
      </div>
    </nav>

    <header class="hero-section reveal">
      <div class="hero-content">
        <h3 class="greeting">Hello, I'm</h3>
        <h1>Xander Revelar</h1>
        
        <div class="typing-wrapper">
          <h2>I am a</h2>
          <h2 class="typing-text accent-text">Cyber Security Student</h2>
        </div>
        
        <p class="bio-text">
          Specializing in Cyber Security & Forensics, passionate about network analysis and full-stack web development.
        </p>

        <div class="social-icons">
          <a href="https://www.linkedin.com/in/xander-revelar-40141a326/" target="_blank" class="icon-circle" title="LinkedIn">
            <i class="fa-brands fa-linkedin-in"></i>
          </a>
          <a href="https://github.com/justhrio" target="_blank" class="icon-circle" title="GitHub">
            <i class="fa-brands fa-github"></i>
          </a>
          <a href="https://www.facebook.com/xander.revelar.8" target="_blank" class="icon-circle" title="Facebook">
            <i class="fa-brands fa-facebook-f"></i>
          </a>
          <a href="https://www.instagram.com/xndrrrrrr/" target="_blank" class="icon-circle" title="Instagram">
            <i class="fa-brands fa-instagram"></i>
          </a>
        </div>

        <button class="primary-btn">Hire me</button>
      </div>

      <div class="hero-image-container">
        <img 
          src="https://drive.google.com/thumbnail?id=13bP4qbyknXaE4l_BaAWOZo0b9DxR4D9I&sz=w1000" 
          alt="Xander Revelar" 
          class="hero-img" 
        />
      </div>
    </header>

    <main>
      <section id="about" class="glass-panel reveal">
        <h2>About Me</h2>
        <p>
          I am a Computer Science student specializing in Cyber Security and Forensics. 
          When I'm not studying or coding, my hobbies include playing the guitar, 
          recording song covers, and preaching.
        </p>
      </section>

      <section id="portfolio" class="glass-panel reveal">
        <h2>My Focus Areas</h2>
        
        <div class="filter-buttons">
          <button 
            v-for="btn in ['All', 'Security', 'Development', 'IoT']" 
            :key="btn"
            :class="{ active: currentFilter === btn }"
            @click="currentFilter = btn"
            class="filter-btn"
          >
            {{ btn }}
          </button>
        </div>

        <div class="portfolio-grid">
          <div 
            v-for="project in filteredProjects" 
            :key="project.id" 
            class="glass-card project-card"
          >
            <h2>{{ project.title }}</h2>
            <p>{{ project.desc }}</p>
          </div>
        </div>
      </section>

      <section id="gallery" class="glass-panel reveal">
        <h2>Guitar Gallery</h2>
        <p class="bio-text">
          Some shots of my gear. Always working on dialing in those presets on the DigiTech RP360XP and chasing that perfect Kurt Cobain tone.
        </p>
        
        <div class="guitar-names-callout">
          <p>
            🎸 Meet <strong>Margaret</strong> (my blue Cort)! But honestly... I still need help naming my purple Stratocaster. Got any ideas? Drop a suggestion in the guestbook below!
          </p>
        </div>
        
        <div class="gallery-grid">
          <img src="https://drive.google.com/thumbnail?id=1FVpYQ_bQ0y3603nB4Bf4lBerm7V5MB2A&sz=w1000" alt="Guitar 1" class="gallery-img" />
          <img src="https://drive.google.com/thumbnail?id=1tPJnejmQGbiYxyMo4-pwCz5f52FhIF5f&sz=w1000" alt="Guitar 2" class="gallery-img" />
          <img src="https://drive.google.com/thumbnail?id=1B4nvuOuGE-xEf4jq7oFLu_wKpj0T15hg&sz=w1000" alt="Guitar 3" class="gallery-img" />
          <img src="https://drive.google.com/thumbnail?id=17vpgipzd6iZaT4Mk-zkxICqlkX2c01if&sz=w1000" alt="Guitar 4" class="gallery-img" />
        </div>
      </section>

      <section id="guestbook" class="guestbook-section glass-panel reveal">
        <h2>Guestbook</h2>
        
        <form @submit.prevent="submitComment" class="comment-form">
          <input v-model="newName" type="text" placeholder="Your Name" required />
          <textarea v-model="newMessage" placeholder="Leave a message..." required></textarea>
          <button type="submit" :disabled="isSubmitting" class="submit-btn">
            {{ isSubmitting ? 'Sending...' : 'Sign Guestbook' }}
          </button>
        </form>

        <div class="comments-list">
          <div v-for="comment in comments" :key="comment.id" class="comment-item">
            <strong>{{ comment.name }}</strong>
            <p>{{ comment.message }}</p>
            <small>{{ new Date(comment.created_at).toLocaleDateString() }}</small>
          </div>
          <p v-if="comments.length === 0" class="empty-state">No comments yet. Be the first!</p>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>© 2026 Designer &bull; Contact: bpananayo@student.apc.edu.ph</p>
      <p>Debug and Structure &bull; Reference: AI</p>
      <p>Inspiration &bull; M Akkira</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// --- API & GUESTBOOK LOGIC ---
const API_URL = 'https://YOUR-CODESPACE-URL-3000.app.github.dev/api/guestbook'; // REMEMBER TO UPDATE THIS TO YOUR PORT 3000 URL!

const comments = ref([]);
const newName = ref('');
const newMessage = ref('');
const isSubmitting = ref(false);

const fetchComments = async () => {
  try {
    const response = await fetch(API_URL);
    comments.value = await response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

const submitComment = async () => {
  if (!newName.value || !newMessage.value) return;
  isSubmitting.value = true;
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.value, message: newMessage.value })
    });
    newName.value = '';
    newMessage.value = '';
    await fetchComments();
  } catch (error) {
    console.error('Error submitting comment:', error);
  } finally {
    isSubmitting.value = false;
  }
};

// --- PORTFOLIO FILTERING LOGIC ---
const currentFilter = ref('All');
const projects = ref([
  { id: 1, category: 'Security', title: 'Cyber Security', desc: 'Passionate about forensics, network analysis, vulnerability scanning, and web application testing.' },
  { id: 2, category: 'Development', title: 'Web Development', desc: 'Building responsive, full-stack web applications using Vue.js, modern CSS, and RESTful APIs.' },
  { id: 3, category: 'IoT', title: 'Hardware & IoT', desc: 'Working with Arduino, designing circuits, and programming microcontrollers.' }
]);

const filteredProjects = computed(() => {
  if (currentFilter.value === 'All') return projects.value;
  return projects.value.filter(p => p.category === currentFilter.value);
});

// --- FALLING MUSIC NOTES LOGIC ---
const notes = ref([]);
const generateNotes = () => {
  const noteSymbols = ['♪', '♫', '♬', '♩'];
  const newNotes = [];
  for (let i = 0; i < 25; i++) { // Generates 25 notes at a time
    newNotes.push({
      id: i,
      symbol: noteSymbols[Math.floor(Math.random() * noteSymbols.length)],
      left: `${Math.random() * 100}vw`,
      duration: `${Math.random() * 10 + 8}s`, // Falls for 8 to 18 seconds
      delay: `${Math.random() * 5}s`,         // Staggers the start times
      fontSize: `${Math.random() * 1.5 + 1}rem` // Randomizes the size
    });
  }
  notes.value = newNotes;
};

// --- ON MOUNTED (SCROLL REVEAL + NOTES + API) ---
onMounted(() => {
  fetchComments();
  generateNotes(); // Start the rain!
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
  });
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap');

/* --- BASE VARIABLES --- */
:root {
  --bg-color: #0f172a;
  --glass-bg: rgba(30, 41, 59, 0.4); 
  --glass-border: rgba(255, 255, 255, 0.08);
  --text-primary: #f8fafc;
  --text-muted: #94a3b8;
  --accent: #38bdf8;
  --accent-glow: rgba(56, 189, 248, 0.5);
}

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background-color: var(--bg-color);
  background-image: 
    radial-gradient(circle at 15% 20%, rgba(56, 189, 248, 0.12) 0%, transparent 40%),
    radial-gradient(circle at 85% 60%, rgba(168, 85, 247, 0.12) 0%, transparent 40%);
  background-attachment: fixed;
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
}

h1, h2, h3, .logo {
  font-family: 'Poppins', sans-serif;
  font-weight: 800; 
  letter-spacing: -0.5px; 
}

/* Ensure container sits above the falling notes */
.app-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 1; 
}

/* --- FALLING MUSIC NOTES CSS --- */
.falling-notes-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* Allows you to click right through them */
  z-index: -1; /* Puts them behind your glass cards */
  overflow: hidden;
}

.music-note {
  position: absolute;
  top: -10vh;
  color: rgba(56, 189, 248, 0.15); /* Faint accent color so it isn't distracting */
  animation: fall linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(360deg);
    opacity: 0;
  }
}

/* --- NAVBAR --- */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  margin-bottom: 3rem;
  border-radius: 50px; 
}
.logo {
  font-size: 1.5rem;
  color: var(--accent);
}
.nav-links {
  display: flex;
  gap: 1.5rem;
}
.nav-links a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: color 0.3s;
}
.nav-links a:hover {
  color: var(--accent);
}

/* --- TWO-COLUMN HERO SECTION --- */
.hero-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4rem;
  gap: 2rem;
}
.hero-content {
  flex: 1;
  text-align: left;
}
.hero-image-container {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.greeting {
  color: var(--accent);
  margin-bottom: 0;
  font-size: 1.5rem;
}
.hero-content h1 {
  font-size: 4rem;
  margin: 0.2rem 0;
  line-height: 1.1;
  color: white;
}

/* --- TYPING WRAPPER FIX --- */
.typing-wrapper {
  display: flex;
  align-items: baseline;
  flex-wrap: nowrap; 
  white-space: nowrap;
  gap: 0.5rem; 
  margin-bottom: 1rem;
}
.hero-content h2 {
  font-size: 1.8rem;
  margin-bottom: 0; 
  font-weight: 600; 
}

.bio-text {
  color: var(--text-muted);
  max-width: 450px;
  margin-bottom: 2rem;
  font-weight: 300; 
}

/* Typing Effect */
.typing-text {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid var(--accent);
  color: var(--accent);
  animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
  padding-right: 4px;
}
@keyframes typing { from { width: 0; } to { width: 100%; } }
@keyframes blink-caret { from, to { border-color: transparent; } 50% { border-color: var(--accent); } }

/* Profile Image */
.hero-img {
  width: 350px;
  height: 350px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--glass-border);
  box-shadow: 0 0 40px var(--accent-glow);
  transition: transform 0.4s ease;
}
.hero-img:hover { transform: scale(1.03); }

/* Social Icons & Buttons */
.social-icons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}
.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1.1rem;
}
.icon-circle:hover {
  background: var(--accent);
  color: #0f172a;
  box-shadow: 0 0 15px var(--accent-glow);
}

.primary-btn {
  background: var(--accent);
  color: #0f172a;
  border: none;
  padding: 0.8rem 2.5rem;
  border-radius: 25px; 
  cursor: pointer;
  font-weight: 800;
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}
.primary-btn:hover {
  transform: translateY(-2px); 
  box-shadow: 0 4px 15px var(--accent-glow);
}

/* --- GLASSMORPHISM & LAYOUT --- */
.glass-panel, .glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2rem;
}

/* --- GALLERY SECTION & CALLOUT --- */
.guitar-names-callout {
  background: rgba(56, 189, 248, 0.1);
  border-left: 4px solid var(--accent);
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  border-radius: 0 8px 8px 0;
}
.guitar-names-callout p {
  margin: 0;
  color: var(--text-primary);
  font-weight: 300;
  font-size: 0.95rem;
}
.guitar-names-callout strong {
  color: var(--accent);
  font-weight: 600;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}
.gallery-img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid var(--glass-border);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.gallery-img:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 20px rgba(0,0,0,0.3), 0 0 15px var(--accent-glow);
}

/* --- PORTFOLIO GRID --- */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
.project-card h2 { font-size: 1.25rem; color: var(--accent); }

/* Buttons & Inputs */
.filter-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}
.filter-btn {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  border: 1px solid var(--glass-border);
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}
.filter-btn.active, .filter-btn:hover {
  background: var(--accent);
  color: #0f172a;
}

input, textarea {
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  color: white;
  font-family: 'Poppins', sans-serif;
}
input:focus, textarea:focus { outline: none; border-color: var(--accent); }

.submit-btn {
  background: var(--accent);
  color: #0f172a;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  width: 100%;
  font-weight: 800;
  font-family: 'Poppins', sans-serif;
  font-size: 1.1rem;
  cursor: pointer;
}
.submit-btn:hover:not(:disabled) { box-shadow: 0 0 15px var(--accent-glow); }

/* --- COMMENTS --- */
.comment-item {
  border-bottom: 1px solid var(--glass-border);
  padding: 1.5rem 0;
}
.comment-item:last-child { border-bottom: none; }
.comment-item strong { color: var(--accent); font-size: 1.1rem; }

/* --- SCROLL REVEAL ANIMATION --- */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease-out;
}
.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* --- FOOTER --- */
.site-footer {
  text-align: center;
  padding: 2rem 0;
  margin-top: 2rem;
  color: var(--text-muted);
  font-size: 0.9rem;
  font-weight: 400;
}
.site-footer p {
  margin: 0.2rem 0; 
}

/* --- MOBILE RESPONSIVENESS --- */
@media (max-width: 900px) {
  .hero-section {
    flex-direction: column-reverse; 
    text-align: center;
  }
  .hero-content { text-align: center; }
  .hero-image-container { justify-content: center; margin-bottom: 2rem; }
  .social-icons { justify-content: center; }
  .bio-text { margin: 0 auto 2rem auto; }
  .navbar { flex-direction: column; gap: 1rem; }
  .nav-links { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
  .nav-links a { margin: 0.5rem; }
}
</style>