import joblib
import pandas as pd
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

model = joblib.load("fraud_model.pkl")

class TransactionRequest(BaseModel):
    amount: float
    location: str
    device: str
    type: str

@app.post("/predict")
def predict_fraud(transaction: TransactionRequest):
    input_data = pd.DataFrame([{
        "amount": transaction.amount,
        "location": transaction.location,
        "device": transaction.device,
        "type": transaction.type
    }])

    prediction = model.predict(input_data)[0]
    probability = model.predict_proba(input_data)[0][1]

    return {
        "fraud": bool(prediction),
        "riskScore": round(probability * 100, 2)
    }
