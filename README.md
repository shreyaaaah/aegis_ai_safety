# 🛡️ Aegis AI: Neural Safety Protocol

**Live API Deployment:** [https://aegis-ai-safety-1.onrender.com](https://aegis-ai-safety-1.onrender.com)

Aegis AI is a production-grade, real-time safety intelligence system designed to provide proactive threat detection and autonomous emergency response. By fusing behavioral modeling, emotional context awareness, and multi-agent scenario simulations, Aegis AI transforms traditional reactive safety into proactive digital defense.

## 🧠 AI Core Architecture

Aegis AI operates on a multi-layered "Neural Aegis Protocol" consisting of four primary intelligence engines:

1.  **Behavioral Digital Twin**: A real-time anomaly detection engine that models user movement patterns (speed, route, time of day) to identify deviations from a safe baseline.
2.  **Emotion Intelligence Engine**: Utilizes Whisper-v3 and Llama 3 to transcribe and analyze voice distress signals, identifying panic or high-stress markers in speech.
3.  **Multi-Agent Scenario Simulator**: An adversarial engine that runs "what-if" simulations in the background, predicting potential threat outcomes and generating "Ghost Paths" (predicted adversarial vectors).
4.  **Dynamic Risk Aggregator**: Fuses all signals into a weighted risk score (0-100), triggering autonomous tactical responses when critical thresholds are breached.

## 📱 Mobile HUD Features

The mobile application provides a high-fidelity tactical interface:
- **Tactical HUD**: A dark-neon map interface showing live location and safety heatmaps.
- **Ghost Path Visualization**: Real-time rendering of predicted threat routes on the map.
- **Neural SOS**: One-touch or autonomous emergency triggering that logs incidents and alerts mock authorities.
- **Real-Time Synergy**: Low-latency WebSocket connectivity for instantaneous risk updates.

## 🚀 Installation & Setup

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```
Copy `.env.example` to `.env` and add your `GROQ_API_KEY`.

### Mobile (Expo/React Native)
```bash
cd mobile
npm install
npx expo start
```

## 🌐 Deployment Guide (Render.com)

1.  **GitHub**: Push your code to a private or public GitHub repository.
2.  **Render Service**: Create a new **Web Service** on Render.
3.  **Config**:
    - **Root Directory**: `backend`
    - **Environment Variables**: Add `GROQ_API_KEY`.
    - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
4.  **Mobile Link**: Update `mobile/constants/Config.ts` with your new Render URL and set `USE_CLOUD: true`.

---
*Developed with Advanced Agentic AI for the future of personal security.*
