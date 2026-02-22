import random
import time

# --- SIMULATION MODE ---
# TensorFlow is disabled because Python 3.14 is too new.
# This mimics the AI behavior for the demo.

def predict_image(image_bytes):
    # 1. Simulate "Thinking" time
    time.sleep(1.5) 
    
    # 2. Randomly pick a result for the demo
    # In a real demo, you can rename your image file to "plastic.jpg" 
    # and we could read that, but random is fine for now.
    options = [
        {"label": "water_bottle", "waste_type": "Plastic (Recycle)", "confidence": 98.5},
        {"label": "soda_can", "waste_type": "Metal (Recycle)", "confidence": 99.2},
        {"label": "apple_core", "waste_type": "Organic (Compost)", "confidence": 95.1},
        {"label": "newspaper", "waste_type": "Paper (Recycle)", "confidence": 92.4}
    ]
    
    result = random.choice(options)
        
    return result