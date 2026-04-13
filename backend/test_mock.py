import asyncio
import websockets
import json
import time

async def test_aegis_ai():
    uri = "ws://127.0.0.1:8000/ws"
    print(f"Connecting to Aegis AI Backend at {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Successfully Connected! Executing Mock Threat Simulation...")
            
            # Simulate a safe baseline first
            payload_safe = {
                "user_id": "TEST_AGENT_007",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
            }
            print("\n[>>] Sending Baseline Safe Location...")
            await websocket.send(json.dumps(payload_safe))
            response = await websocket.recv()
            print(f"[<<] Aegis Response: {json.dumps(json.loads(response), indent=2)}")
            
            time.sleep(3)
            
            # Simulate a highly erratic, anomalous threat movement to trigger Groq LLM
            payload_threat = {
                "user_id": "TEST_AGENT_007",
                "latitude": 40.7128, # Sudden teleportation indicates extreme anomaly/threat
                "longitude": -74.0060,
                "timestamp": time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
            }
            print("\n[>>] Sending Anomalous Threat Movement (Teleportation Hack)...")
            await websocket.send(json.dumps(payload_threat))
            response = await websocket.recv()
            print(f"[<<] Aegis Response: {json.dumps(json.loads(response), indent=2)}")
            
    except ConnectionRefusedError:
        print("\nERROR: Connection refused. Is the backend running on port 8000?")
    except Exception as e:
        print(f"\nERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_aegis_ai())
