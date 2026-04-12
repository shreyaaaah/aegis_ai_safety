# AURA-X Sentinel - Full System Architecture Plan

This plan details the implementation of the COMPLETE AURA-X Sentinel system. Instead of step-by-step phased MVPs, we are building the full real-time continuous intelligence pipeline. All technologies proposed here rely strictly on **free** or **local open-source** components.

## User Review Required

> [!WARNING]
> Since we must use **100% Free** AI services, we have two primary options:
> 1. **Free Cloud APIs:** Using **Groq** (insanely fast Llama 3) or **Google Gemini API** (Free Tier). These only require you to sign up online and generate a free key.
> 2. **Fully Local (Ollama):** We can run a model like Llama 3 directly on your laptop. This is totally private and offline, but your computer needs 16GB+ of RAM or a good GPU.
> *Question: Which of these two paths would you prefer? Let's use Groq or Gemini Free as the default if your PC isn't a powerhouse!*

## Proposed Changes

### Core Infrastructure & Data Ingestion
#### [MODIFY] [backend/main.py](file:///c:/Users/LENOVO/OneDrive/Desktop/AURA_X/backend/main.py)
- Convert HTTP polling (`POST /location`) to **WebSockets** for true real-time streaming of location and risk data without lag.
- Set up endpoints for Voice/Text logging to extract sentiment and emotional context.

### Risk & Intelligence Modules
#### [MODIFY] [backend/risk_engine.py](file:///c:/Users/LENOVO/OneDrive/Desktop/AURA_X/backend/risk_engine.py)
This will be completely rewritten to orchestrate the intelligence layers:
- **Dynamic Risk Layer:** Replaces rule-based logic with an LLM prompt that receives location, time, and Behavioral Twin output.
- **Future Scenario Simulation Engine:** Uses the LLM to forecast the next 15-30 minutes of the user's journey based on context.
- **What-If Decision Engine:** When requested by the user interface, it evaluates potential routes.

#### [NEW] [backend/digital_twin.py](file:///c:/Users/LENOVO/OneDrive/Desktop/AURA_X/backend/digital_twin.py)
- Implements the **Behavioral Digital Twin** using `scikit-learn` (Isolation Forest) to detect anomalies in user movement speed, route timings, etc. This builds the user's Context Memory.

#### [NEW] [backend/multi_agent_sim.py](file:///c:/Users/LENOVO/OneDrive/Desktop/AURA_X/backend/multi_agent_sim.py)
- Implements the **Multi-Agent Simulation** by creating LLM agent roles ("User Agent" vs "Environment Agent") to predict threat outcomes interactively.

### Mobile Frontend
#### [MODIFY] [mobile/App.js](file:///c:/Users/LENOVO/OneDrive/Desktop/AURA_X/mobile/App.js)
- Upgrade from simple tracking to a **Real-Time Websocket Connection**.
- Build an advanced **Dynamic Feedback Dashboard** pushing live continuous risk context, emotions, and simulations to the user.
- Build the **Autonomous Decision Trigger**: allow the app to securely notify trusted contacts if risk spikes past the threshold and the user does not respond within X seconds.

## Verification Plan

### Manual Verification
- We will start up the WebSocket server on the Backend and verify bi-directional flow.
- We will insert historical location waypoints systematically to test the "Digital Twin" and verify when an anomaly is triggered.
- We will trigger the LLM simulation pipeline via the mobile UI and ensure it finishes within a reasonable latency limit (especially critical using free-tier Cloud APIs).
