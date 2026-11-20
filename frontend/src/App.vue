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
      <div class="logo">XSR</div>
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
        <p>
          Breneth is the most loveble person I've meant
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
        <div class="guestbook-header">
          <h2>Guestbook</h2>
          <div class="guestbook-mode-controls">
            <span v-if="useLocalTestMode" class="mode-badge test-mode">
              Local Test Mode (Browser Storage)
            </span>
            <button
              type="button"
              class="mode-toggle-btn"
              @click="toggleTestMode"
            >
              {{ useLocalTestMode ? 'Switch to Live API' : 'Enable Test Mode' }}
            </button>
          </div>
        </div>
        
        <form @submit.prevent="submitComment" class="comment-form">
          <input
            v-model="newName"
            type="text"
            maxlength="80"
            placeholder="Your Name"
            required
          />
          <textarea
            v-model="newMessage"
            maxlength="1000"
            rows="3"
            placeholder="Leave a message..."
            required
          ></textarea>
          <button type="submit" :disabled="isSubmitting" class="submit-btn">
            {{ isSubmitting ? 'Sending...' : 'Sign Guestbook' }}
          </button>
        </form>

        <div v-if="guestbookError" class="status-banner error-banner">
          <span>{{ guestbookError }}</span>
          <button
            v-if="!useLocalTestMode"
            type="button"
            class="inline-action-btn"
            @click="enableTestMode"
          >
            Test Locally Instead
          </button>
        </div>

        <div v-if="submitSuccess" class="status-banner success-banner">
          {{ submitSuccess }}
        </div>

        <div class="comments-list">
          <p v-if="isLoadingComments" class="empty-state">Loading comments...</p>
          <template v-else>
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <strong>{{ comment.name }}</strong>
              <p>{{ comment.message }}</p>
              <small>{{ formatDate(comment.created_at) }}</small>
            </div>
            <p v-if="comments.length === 0" class="empty-state">
              No comments yet. Be the first!
            </p>
          </template>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>© 2026 Designer &bull; Contact: xsrevelar@student.apc.edu.ph</p>
      <p>Debug and Structure &bull; Reference: AI</p>
    </footer>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// --- API & GUESTBOOK LOGIC ---
const API_URL =
  import.meta.env.VITE_API_URL ||
  'https://xander-portfolio-backend.onrender.com/api/guestbook';
const TEST_MODE_STORAGE_KEY = 'guestbook_test_mode';
const TEST_COMMENTS_STORAGE_KEY = 'guestbook_test_comments';

const comments = ref([]);
const newName = ref('');
const newMessage = ref('');
const isSubmitting = ref(false);
const isLoadingComments = ref(false);
const guestbookError = ref('');
const submitSuccess = ref('');
const useLocalTestMode = ref(
  localStorage.getItem(TEST_MODE_STORAGE_KEY) === 'true',
);

const formatDate = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString();
};

const readLocalComments = () => {
  try {
    const raw = localStorage.getItem(TEST_COMMENTS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeLocalComments = (entries) => {
  localStorage.setItem(TEST_COMMENTS_STORAGE_KEY, JSON.stringify(entries));
};

const fetchComments = async () => {
  guestbookError.value = '';
  if (useLocalTestMode.value) {
    comments.value = readLocalComments();
    return;
  }

  isLoadingComments.value = true;
  try {
    const response = await fetch(API_URL);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const msg =
        (data && data.message) ||
        `Backend returned HTTP ${response.status}. Check Supabase connection.`;
      throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
    }

    if (Array.isArray(data)) {
      comments.value = data;
    } else {
      throw new Error('Unexpected response format from guestbook API.');
    }
  } catch (error) {
    console.error('Error fetching comments:', error);
    guestbookError.value =
      error instanceof Error
        ? error.message
        : 'Unable to load guestbook comments.';
  } finally {
    isLoadingComments.value = false;
  }
};

const submitComment = async () => {
  const name = newName.value.trim();
  const message = newMessage.value.trim();

  guestbookError.value = '';
  submitSuccess.value = '';

  if (!name || !message) {
    guestbookError.value = 'Please enter both your name and a message.';
    return;
  }

  isSubmitting.value = true;
  try {
    if (useLocalTestMode.value) {
      const entry = {
        id: `local-${Date.now()}`,
        name,
        message,
        created_at: new Date().toISOString(),
      };
      const updated = [entry, ...readLocalComments()];
      writeLocalComments(updated);
      comments.value = updated;
      newName.value = '';
      newMessage.value = '';
      submitSuccess.value = 'Saved to local browser storage (Test Mode).';
      return;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message }),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const msg =
        (data && data.message) ||
        `Failed to save comment (HTTP ${response.status}).`;
      throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
    }

    const created = Array.isArray(data) ? data[0] : data;
    if (created && created.id !== undefined) {
      comments.value = [created, ...comments.value];
    } else {
      await fetchComments();
    }

    newName.value = '';
    newMessage.value = '';
    submitSuccess.value = 'Thanks! Your comment has been saved.';
  } catch (error) {
    console.error('Error submitting comment:', error);
    guestbookError.value =
      error instanceof Error
        ? error.message
        : 'Unable to save your comment. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
};

const enableTestMode = () => {
  useLocalTestMode.value = true;
  localStorage.setItem(TEST_MODE_STORAGE_KEY, 'true');
  submitSuccess.value = '';
  void fetchComments();
};

const toggleTestMode = () => {
  useLocalTestMode.value = !useLocalTestMode.value;
  localStorage.setItem(TEST_MODE_STORAGE_KEY, String(useLocalTestMode.value));
  submitSuccess.value = '';
  void fetchComments();
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
  --bg-color: #1b102d;
  --glass-bg: rgba(44, 24, 72, 0.45); 
  --glass-border: rgba(255, 255, 255, 0.1);
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
    radial-gradient(circle at 15% 20%, rgba(168, 85, 247, 0.28) 0%, transparent 45%),
    radial-gradient(circle at 85% 60%, rgba(236, 72, 153, 0.2) 0%, transparent 45%);
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
  box-sizing: border-box;
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
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.guestbook-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.guestbook-header h2 {
  margin: 0;
}
.guestbook-mode-controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.mode-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  background: rgba(56, 189, 248, 0.15);
  color: var(--accent);
  border: 1px solid rgba(56, 189, 248, 0.35);
}
.mode-toggle-btn, .inline-action-btn {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border: 1px solid var(--glass-border);
  padding: 0.35rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  transition: background 0.2s, border-color 0.2s;
}
.mode-toggle-btn:hover, .inline-action-btn:hover {
  background: rgba(56, 189, 248, 0.2);
  border-color: var(--accent);
}

.status-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}
.error-banner {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.4);
  color: #fecaca;
}
.success-banner {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.4);
  color: #bbf7d0;
}

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