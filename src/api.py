from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from predict import predict_churn

app = FastAPI(title="Telco Churn Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class ClientFeatures(BaseModel):
    tenure: float = Field(..., ge=0, le=72, description="Anciennete en mois")
    monthly_charges: float = Field(..., ge=18, le=119, description="Charges mensuelles en dollars")
    contract: str = Field(..., description="Month-to-month, One year ou Two year")
    internet_service: str = Field(..., description="DSL, Fiber optic ou No")
    payment_method: str = Field(..., description="Electronic check, Mailed check, Bank transfer (automatic) ou Credit card (automatic)")
    senior_citizen: int = Field(0, ge=0, le=1)
    partner: int = Field(0, ge=0, le=1)
    dependents: int = Field(0, ge=0, le=1)
    phone_service: int = Field(1, ge=0, le=1)
    multiple_lines: int = Field(0, ge=0, le=1)
    online_security: int = Field(0, ge=0, le=1)
    online_backup: int = Field(0, ge=0, le=1)
    device_protection: int = Field(0, ge=0, le=1)
    tech_support: int = Field(0, ge=0, le=1)
    streaming_tv: int = Field(0, ge=0, le=1)
    streaming_movies: int = Field(0, ge=0, le=1)
    paperless_billing: int = Field(0, ge=0, le=1)
    gender: int = Field(0, ge=0, le=1)


@app.post("/predict")
def predict(features: ClientFeatures):
    proba, prediction = predict_churn(
        tenure=features.tenure,
        monthly_charges=features.monthly_charges,
        contract=features.contract,
        internet_service=features.internet_service,
        payment_method=features.payment_method,
        senior_citizen=features.senior_citizen,
        partner=features.partner,
        dependents=features.dependents,
        phone_service=features.phone_service,
        multiple_lines=features.multiple_lines,
        online_security=features.online_security,
        online_backup=features.online_backup,
        device_protection=features.device_protection,
        tech_support=features.tech_support,
        streaming_tv=features.streaming_tv,
        streaming_movies=features.streaming_movies,
        paperless_billing=features.paperless_billing,
        gender=features.gender
    )
    return {
        "churn_probability": proba,
        "churn_prediction": "Yes" if prediction == 1 else "No"
    }