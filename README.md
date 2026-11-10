# 🌱 SmartFarm-AI

### AI-Powered Smart Agriculture Platform for Intelligent Farming Decisions

<p align="center">
  <strong>Empowering Farmers with Artificial Intelligence, Machine Learning & Smart Agricultural Technology.</strong>
</p>

<p align="center">
  <a href="https://smartfarmai-amber.vercel.app/">
    <img src="https://img.shields.io/badge/🌱_Live_Demo-Visit_SmartFarm_AI-16A34A?style=for-the-badge" />
  </a>
  <a href="https://github.com/shikhartiwari1508/SmartFarm-AI">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" />
  </a>
  <a href="https://smartfarm-ai-p3md.onrender.com/docs">
    <img src="https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi" />
  </a>
</p>

---

## 🌾 About The Project

**SmartFarm-AI** is an intelligent, AI-powered agriculture platform designed to make modern farming smarter, more accessible, and data-driven.

The platform brings together Artificial Intelligence, Machine Learning, agricultural insights, weather information, and interactive farming tools to help farmers make informed decisions throughout their farming journey.

From selecting suitable crops and identifying potential plant diseases to managing irrigation, exploring mandi prices, and interacting with an AI-powered virtual farming assistant, SmartFarm-AI aims to bring multiple agricultural solutions together in one unified platform.

Built with a modern **React + Vite frontend** and a **Python FastAPI backend**, the application provides an interactive and multilingual smart farming experience.

<p align="center">
  <a href="https://smartfarmai-amber.vercel.app/">
    <strong>🚀 Explore SmartFarm-AI Live →</strong>
  </a>
</p>

---

## ✨ Key Features

### 🌾 1. AI Crop Recommendation

Make smarter crop selection decisions using agricultural parameters.

- Soil-related parameters
- Nitrogen, Phosphorus and Potassium (NPK) levels
- Soil pH
- Environmental conditions
- Seasonal considerations
- Intelligent crop recommendations

### 🦠 2. Plant Disease Detection

An AI-powered module designed to help identify possible plant diseases through image-based analysis.

- Upload plant images
- Analyze visible disease symptoms
- Identify potential plant health issues
- Access relevant disease information
- Get useful guidance for crop care

### 💧 3. Smart Irrigation

Support efficient water management with intelligent irrigation insights.

- Crop-based irrigation recommendations
- Environmental condition analysis
- Weather-related considerations
- Water management guidance
- Smart irrigation insights

### 🌦️ 4. Weather Dashboard

Access weather-related information to support agricultural planning.

- Weather information
- Temperature insights
- Rainfall-related information
- Humidity and environmental conditions
- Weather-based farming considerations

### 🤖 5. AI Farm Assistant

An agriculture-focused conversational AI assistant that helps users explore farming-related questions.

Ask questions about:

- Crop selection
- Plant diseases
- Fertilizers and soil health
- Irrigation management
- Weather conditions
- Agricultural practices

Get conversational AI-powered farming guidance through an interactive interface.

### 🧑‍🌾 6. AI Kisan Avatar

Meet the next generation of agricultural assistance through an interactive virtual farmer experience.

AI Kisan Avatar is designed to make AI-powered agricultural guidance more natural and accessible.

**Supported Languages:**
- 🇮🇳 Hindi
- 🇬🇧 English
- 🗣️ Bhojpuri

Key capabilities:

- Interactive virtual farmer interface
- AI-powered agricultural conversations
- Voice input using browser speech recognition
- Text-to-speech responses
- Multilingual farming assistance
- Natural conversational interaction

The goal is to make modern AI technology accessible to farmers through a familiar and easy-to-use experience.

### 📈 7. Mandi Market Prices

Explore agricultural market-price information through the mandi module.

- Commodity-based filtering
- State and district filters
- Market-wise price information
- Minimum and maximum price details
- Modal and market data exploration
- Cached market-data support

Designed to help users explore agricultural market trends and make more informed selling decisions.

### 📊 8. AI Insights

Explore useful farming insights and recommendations through a dedicated AI Insights module.

- Agricultural insights
- Farming recommendations
- Data-driven information
- Decision-support features

### 🚜 9. Farm Management

A centralized module for managing farm-related information.

- Farm profile management
- Farm summaries
- Agricultural information
- Centralized dashboard experience

### 🌐 10. Multilingual User Experience

SmartFarm-AI is designed with multilingual accessibility in mind.

- Hindi interface
- English interface
- Language switching
- Agriculture-focused user experience

---

## 🖥️ Application Modules

| Module | Description |
|---|---|
| 🌾 Crop Recommendation | Intelligent crop selection |
| 🦠 Disease Detection | Image-based plant disease analysis |
| 💧 Smart Irrigation | Irrigation recommendations |
| 🌦️ Weather Dashboard | Agricultural weather information |
| 🤖 AI Farm Assistant | Conversational farming assistance |
| 🧑‍🌾 AI Kisan Avatar | Multilingual voice-enabled virtual farmer |
| 📈 Mandi Prices | Agricultural market-price exploration |
| 📊 AI Insights | Farming insights and recommendations |
| 🚜 Farm Management | Farm profile and summaries |
| 📱 Dashboard | Centralized application overview |

---

## 🛠️ Technology Stack

### Frontend

- React.js
- Vite
- Tailwind CSS
- JavaScript
- Axios
- React Markdown
- Lucide React
- Web Speech API

### Backend

- Python
- FastAPI
- Uvicorn
- Pydantic
- SQLAlchemy
- SQLite

### Artificial Intelligence & Machine Learning

- Google Gemini API
- NumPy
- Scikit-learn
- Pillow
- Machine Learning-based agricultural modules
- AI-powered conversational assistance

### Data & Agricultural Services

- AGMARKNET / data.gov.in market data
- Cached mandi data snapshots
- Agricultural datasets
- Weather information services

### Development & Deployment

- Git
- GitHub
- Visual Studio Code
- Google Antigravity
- Vercel
- Render

---

## 🏗️ Project Architecture

SmartFarm-AI follows a modular full-stack architecture.

```text
SmartFarm-AI/
│
├── backend/
│   ├── ml/
│   ├── models/
│   ├── routers/
│   │   ├── crops.py
│   │   ├── disease.py
│   │   ├── irrigation.py
│   │   ├── weather.py
│   │   ├── chat.py
│   │   ├── farm.py
│   │   ├── insights.py
│   │   ├── market_prices.py
│   │   └── kisan_avatar.py
│   │
│   ├── schemas/
│   ├── config.py
│   ├── database.py
│   ├── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── data/
├── models/
├── scripts/
├── uploads/
│
├── .env.example
├── .gitignore
├── start.bat
└── README.md
```

---

## ⚙️ Installation & Setup

Follow these steps to run SmartFarm-AI locally.

### Prerequisites

Make sure you have installed:

- Python 3.12
- Node.js and npm
- Git
- VS Code (recommended)

### 1. Clone the Repository

```bash
git clone https://github.com/shikhartiwari1508/SmartFarm-AI.git

cd SmartFarm-AI
```

### 2. Create a Python Virtual Environment

```powershell
python -m venv .venv
```

Activate the environment:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install Backend Dependencies

```powershell
python -m pip install -r backend\requirements.txt
```

### 4. Configure Environment Variables

Create the required environment configuration using `.env.example` as a reference.

Add your own API credentials and application settings where required.

**Important:** Never upload real API keys, passwords, or private environment files to GitHub.

### 5. Start the Backend Server

From the project root directory:

```powershell
python -m uvicorn backend.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

FastAPI Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

### 6. Start the Frontend

Open another terminal:

```powershell
cd frontend
```

Install frontend dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## 🔗 Backend API Modules

SmartFarm-AI provides REST API endpoints for its different agricultural modules.

| API Endpoint | Purpose |
|---|---|
| `/api/health` | Backend health check |
| `/api/crops/recommend` | Crop recommendations |
| `/api/crops/crops-list` | Available crops |
| `/api/disease/predict` | Plant disease analysis |
| `/api/irrigation/recommend` | Irrigation recommendations |
| `/api/irrigation/crops` | Irrigation crop information |
| `/api/weather/` | Weather information |
| `/api/chat/` | AI Farm Assistant |
| `/api/farm/profile` | Farm profile |
| `/api/farm/summary` | Farm summary |
| `/api/insights/` | Agricultural insights |
| `/api/kisan/health` | AI Kisan Avatar health |
| `/api/kisan/chat` | AI Kisan Avatar conversation |

Additional market-price APIs are available through the market-prices router.

Explore the available endpoints through FastAPI Swagger:

**https://smartfarm-ai-p3md.onrender.com/docs**

---

## 📸 Application Screenshots

Explore the SmartFarm-AI interface and its major modules.

### 🌱 Landing Page

![SmartFarm AI Landing Page](https://github.com/user-attachments/assets/c26d8c88-cb40-4a81-b3fe-767c3a7f7f55)

### 📊 Dashboard

![SmartFarm AI Dashboard](https://github.com/user-attachments/assets/33f52d51-620c-4e3d-a89b-25194252bea4)

### 🌾 Crop Recommendation

![Crop Recommendation](https://github.com/user-attachments/assets/e30ee182-74ff-4dc2-bf00-33be833243af)

### 🤖 AI Farm Assistant

![AI Farm Assistant](https://github.com/user-attachments/assets/ad4ef7a2-515a-4466-8c29-8a409a9abb4d)

### 💧 Smart Irrigation

![Smart Irrigation](https://github.com/user-attachments/assets/1c9be299-d684-4116-8aa3-6a6fa1c621a8)


### 📈 Mandi Prices

![Mandi Prices](https://github.com/user-attachments/assets/def1b874-3d6d-4f05-b050-ed3d6e98e63f)


### 🧑‍🌾 AI Kishan Avatar

![AI Kishan Avatar](https://github.com/user-attachments/assets/bfd0d638-aab5-4501-abe8-87e8426b481c)


---

## 🎯 Project Objectives

SmartFarm-AI aims to:

- Make agricultural technology more accessible.
- Support smarter and data-driven farming decisions.
- Improve crop planning and selection.
- Encourage efficient water management.
- Assist in identifying potential plant diseases.
- Make agricultural information easier to understand.
- Provide multilingual AI-powered farming assistance.
- Explore practical applications of AI and Machine Learning in agriculture.

---

## 🔮 Future Roadmap

The project will continue evolving with improvements such as:

- More advanced crop recommendation models.
- Improved plant disease detection accuracy.
- Expanded regional agricultural datasets.
- Enhanced AI Kisan Avatar interactions.
- More regional language and dialect support.
- Improved voice-based agricultural assistance.
- Advanced satellite and remote-sensing integration.
- Personalized farmer recommendation history.
- Expanded real-time agricultural data integrations.
- Mobile application development.

---

## 🔐 Security & Configuration

- Keep API keys and credentials private.
- Use environment variables for sensitive configuration.
- Never commit `.env` files containing real credentials.
- Follow secure configuration practices when deploying the application.
- Validate user inputs before processing requests.

---

## 👨‍💻 Developer

<p align="center">
  <strong>Mr. Shikhar Tiwari</strong><br/>
  Integrated BCA-MCA | Data Science<br/>
  University of Allahabad
</p>

<p align="center">
  <a href="https://github.com/shikhartiwari1508">
    <img src="https://img.shields.io/badge/GitHub-shikhartiwari1508-181717?style=for-the-badge&logo=github" />
  </a>
  <a href="https://shikhartiwari1508.github.io/Shikhar_Tiwari-Portfolio/">
    <img src="https://img.shields.io/badge/Portfolio-Visit_My_Portfolio-2563EB?style=for-the-badge&logo=googlechrome&logoColor=white" />
  </a>
</p>

---

## 📄 License

This project is currently intended for educational, research, and demonstration purposes.

---

## ⭐ Support The Project

If you find **SmartFarm-AI** interesting or useful:

- ⭐ Give this repository a star.
- 🍴 Fork the repository.
- 🐛 Report bugs and suggest improvements.
- 💡 Contribute ideas for smarter agriculture.

<p align="center">
  <strong>🌱 Smart Farming. Smarter Decisions. Better Agriculture.</strong>
  <br/><br/>
  <a href="https://smartfarmai-amber.vercel.app/">
    <strong>🚀 Explore SmartFarm-AI</strong>
  </a>
</p>
