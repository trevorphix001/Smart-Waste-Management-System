from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
import random
from .waste_classifier import predict_image
# from .router_solver import solve_tsp  <-- (Disabled for simplicity)

app = FastAPI()

class RouteRequest(BaseModel):
    depot: dict
    bins: list

@app.get("/")
def read_root():
    return {"status": "AI Service Online (Simulation Mode)"}

@app.post("/api/v1/optimize")
async def optimize_route(payload: RouteRequest):
    # Simulate Optimization
    optimized_bins = payload.bins[:]
    random.shuffle(optimized_bins) # Fake the sorting
    
    return {
        "status": "optimized",
        "route": optimized_bins,
        "savings": f"{random.randint(12, 35)}% Fuel Saved"
    }

@app.post("/api/v1/classify")
async def classify_upload(file: UploadFile = File(...)):
    # Read file just to simulate processing
    image_bytes = await file.read()
    result = predict_image(image_bytes)
    return result