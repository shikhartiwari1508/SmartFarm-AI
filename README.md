# 🌱 SmartFarm-AI

> **AI-Powered Smart Agriculture Platform for Smarter Farming Decisions**

SmartFarm-AI is a modern AI-powered agriculture platform designed to help farmers make better decisions using intelligent crop recommendations, disease detection, smart irrigation insights, weather information, and an AI farming assistant.

The project combines a **FastAPI backend** with a **React + Vite frontend** to provide an interactive and user-friendly smart farming experience.

---

## 🚀 Features

### 🌾 Crop Recommendation

Get crop recommendations based on important agricultural parameters such as:

* Soil conditions
* Nutrient levels
* Season
* Environmental factors

### 🦠 Plant Disease Detection

Upload a plant image and use the disease detection module to identify possible crop diseases and receive useful information.

### 💧 Smart Irrigation

Get irrigation recommendations based on crop and environmental conditions to support efficient water management.

### 🌦️ Weather Dashboard

View weather-related information useful for agricultural planning.

### 🤖 AI Farm Assistant

Ask agriculture-related questions about:

* Crop selection
* Plant diseases
* Irrigation
* Fertilizers
* Weather
* Farming practices

The assistant provides AI-powered agricultural guidance through a conversational interface.

### 📊 AI Insights

Get useful farming insights and recommendations through the AI Insights module.

### 🚜 Farm Management

Manage farm-related information and view farm summaries through the dashboard.

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Markdown
* Lucide React

### Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* SQLAlchemy
* SQLite

### Machine Learning

* NumPy
* Scikit-learn
* Pillow

### Development Tools

* Git
* GitHub
* VS Code
* Google Antigravity

---

## 📂 Project Structure

```text
SmartFarm-AI/
│
├── backend/
│   ├── ml/
│   ├── models/
│   ├── routers/
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
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── data/
├── models/
├── uploads/
├── .env.example
├── .gitignore
├── start.bat
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/shikhartiwari1508/SmartFarm-AI.git
cd SmartFarm-AI
```

### 2. Create Python virtual environment

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.\.venv\Scripts\Activate.ps1
```

### 3. Install backend dependencies

```bash
python -m pip install -r backend\requirements.txt
```

### 4. Start the FastAPI backend

```bash
python -m uvicorn backend.main:app --reload
```

Backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 💻 Frontend Setup

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Frontend will be available at:

```text
http://localhost:5173
```

---

## 🔗 API Modules

SmartFarm-AI provides APIs for:

```text
/api/crops/recommend
/api/crops/crops-list
/api/disease/predict
/api/irrigation/recommend
/api/irrigation/crops
/api/weather/
/api/chat/
/api/farm/profile
/api/farm/summary
/api/insights/
/api/health
```

FastAPI Swagger documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

## 🖥️ Application Modules

| Module                 | Purpose                              |
| ---------------------- | ------------------------------------ |
| 🌾 Crop Recommendation | Recommend suitable crops             |
| 🦠 Disease Detection   | Detect possible plant diseases       |
| 💧 Smart Irrigation    | Provide irrigation recommendations   |
| 🌦️ Weather            | Agricultural weather information     |
| 🤖 Farm Assistant      | Agriculture-focused AI chatbot       |
| 📊 AI Insights         | Farming insights and recommendations |
| 🚜 Farm Management     | Manage farm information              |
| 📈 Dashboard           | Centralized farming dashboard        |

---

## 🔐 Environment Variables

Create a `.env` file when required and add your environment-specific configuration.

Example:

```env
# Add your API configuration here
```

> Never upload your real `.env` file or API keys to GitHub.

The repository includes `.env.example` as a safe configuration template.

---

## 📸 Screenshots

### Landing Page

*Add project screenshot here.*

### Dashboard

*Add dashboard screenshot here.*

### Crop Recommendation

*Add crop recommendation screenshot here.*

### AI Farm Assistant

*Add chatbot screenshot here.*

### Smart Irrigation

*Add irrigation screenshot here.*

---

## 🎯 Project Goals

SmartFarm-AI aims to:

* Make agricultural technology easier to access
* Support data-driven farming decisions
* Improve crop planning
* Assist with irrigation management
* Help identify plant diseases
* Provide an accessible AI farming assistant
* Demonstrate practical applications of AI and machine learning in agriculture

---

## 🔮 Future Improvements

* Real-time weather API integration
* Advanced ML models for disease detection
* More regional crop datasets
* Multilingual AI farming assistant
* Voice-based farming assistant
* Satellite/remote-sensing integration
* Farmer-specific recommendation history
* Production cloud deployment
* Mobile application

---

## 👨‍💻 Developer

**Shikhar Tiwari**

BCA-MCA Data Science
CMP Degree College

### Connect

* GitHub: [@shikhartiwari1508](https://github.com/shikhartiwari1508)
* Portfolio: [Shikhar Tiwari Portfolio](https://shikhartiwari1508.github.io/Shikhar_Tiwari-Portfolio/)

---

## 📄 License

This project is currently available for educational and demonstration purposes.

---

⭐ **If you find SmartFarm-AI interesting, consider giving the repository a star!**
