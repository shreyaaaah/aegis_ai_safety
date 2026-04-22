/**
 * Aegis AI Global Configuration
 * Toggle between local development and cloud production.
 */

// REPLACE with your Render.com URL after deployment (e.g., https://aegis-brain.onrender.com)
const CLOUD_URL = "https://aegis-ai-safety-1.onrender.com"; 

// YOUR CURRENT LOCAL IP
const LOCAL_IP = "10.35.135.183"; 

export const CONFIG = {
  // Set to 'true' once you deploy to Render.com
  USE_CLOUD: true, 
  
  get BACKEND_URL() {
    return this.USE_CLOUD ? CLOUD_URL : `http://${LOCAL_IP}:8001`;
  },
  
  get WS_URL() {
    const wsBase = this.USE_CLOUD 
      ? CLOUD_URL.replace("https://", "wss://") 
      : `ws://${LOCAL_IP}:8001`;
    return `${wsBase}/ws`;
  }
};
