# AI Recruitment System & Career Vault

A premium, AI-powered full-stack recruitment platform designed to bridge the gap between top talent and recruiters. Built with **Next.js**, **Django**, and **Google Gemini AI**.

---

## ✨ Key Features

### 👨‍💻 For Job Seekers
- **AI Resume Parsing**: Instant extraction of skills, experience, and education from PDF resumes.
- **Smart Profile**: High-end editable profile with an interactive "Skills Cloud".
- **AI Summary Polisher**: One-click professional narrative rewrite using Gemini AI.
- **Job Matching**: Real-time compatibility scores with detailed "Skill Gap" analysis.
- **Interview Coach**: Generate personalized technical interview questions based on your unique profile and the job description.

### 💼 For Recruiters
- **Talent Pool Management**: Track and search all candidates across active postings.
- **Insight Dashboard**: Visual analytics (Charts.js) for application flow and skill distributions.
- **Candidate Deep-Dive**: Detailed analysis pages with **Skill Radar Charts** and AI-driven strength summaries.
- **Job Lifecycle**: Full CRUD operations for job postings with automated "must-have" skill extraction.
- **Automated Notifications**: Instant status updates via the system.

---

## 🚀 One-Click Demo (Windows)

For a seamless demonstration, we have included a Python launcher that boots both the backend and frontend simultaneously in separate consoles.

1. Ensure Python and Node.js are installed.
2. Run the following command from the root directory:
   ```bash
   python run_app.py
   ```

---

## 🛠️ Step-by-Step Installation

### 1. Clone the Repository
```bash
git clone https://github.com/forloopused-sys/ECCV.git
cd ECCV
```

### 2. Backend Setup (Django)
```bash
# Navigate to server
cd server

# Create and activate virtual environment
python -m venv .venv
.\.venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (Optional if db matches)
python manage.py migrate

# Create .env file in server/ directory
# GEMINI_API_KEY=your_gemini_key_here
```

### 3. Frontend Setup (Next.js)
```bash
# Navigate to client from root
cd client

# Install packages
npm install

# Start development server
npm run dev
```

---

## 🌍 Access Ports
- **Frontend Dashboard**: [http://localhost:3000](http://localhost:3000)
- **Backend API Root**: [http://localhost:8000/api](http://localhost:8000/api)
- **Django Admin**: [http://localhost:8000/admin](http://localhost:8000/admin)

---

## 🧪 Demo Credentials (Demo Environment)
Users can register or use existing accounts:
- **Recruiter Demo**: Log in using the "RECRUITER" toggle on the sign-in page.
- **Candidate Demo**: Log in using the "JOB SEEKER" toggle.

---

## 🧠 Tech Stack
- **Frontend**: Next.js 14, TypeScript, Framer Motion, Lucide Icons, Chart.js
- **Backend**: Django 5.0, Django REST Framework, SQLite
- **AI Engine**: Google Gemini API (Generative AI)
- **Styling**: Vanilla CSS with Modern Glassmorphism Design System
