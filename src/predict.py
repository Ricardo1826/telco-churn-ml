import joblib
import pandas as pd
import numpy as np

model = joblib.load('model_logistic.pkl')
model_columns = joblib.load('model_columns.pkl')
scaler = joblib.load('scaler.pkl')

THRESHOLD = 0.4


def predict_churn(tenure, monthly_charges, contract, internet_service, payment_method,
                   senior_citizen=0, partner=0, dependents=0, phone_service=1,
                   multiple_lines=0, online_security=0, online_backup=0,
                   device_protection=0, tech_support=0, streaming_tv=0,
                   streaming_movies=0, paperless_billing=0, gender=0):
    """
    Predit le risque de churn d'un client a partir de ses caracteristiques.
    tenure et monthly_charges sont fournis en valeurs reelles (mois, dollars).
    """

    tenure_scaled, monthly_charges_scaled = scaler.transform( pd.DataFrame([[tenure, monthly_charges]], columns=['tenure', 'MonthlyCharges']))[0]

    input_data = {col: 0 for col in model_columns}

    input_data['tenure'] = tenure_scaled
    input_data['MonthlyCharges'] = monthly_charges_scaled
    input_data['gender'] = gender
    input_data['SeniorCitizen'] = senior_citizen
    input_data['Partner'] = partner
    input_data['Dependents'] = dependents
    input_data['PhoneService'] = phone_service
    input_data['MultipleLines'] = multiple_lines
    input_data['OnlineSecurity'] = online_security
    input_data['OnlineBackup'] = online_backup
    input_data['DeviceProtection'] = device_protection
    input_data['TechSupport'] = tech_support
    input_data['StreamingTV'] = streaming_tv
    input_data['StreamingMovies'] = streaming_movies
    input_data['PaperlessBilling'] = paperless_billing

    contract_col = f'Contract_{contract}'
    if contract_col in input_data:
        input_data[contract_col] = 1

    internet_col = f'InternetService_{internet_service}'
    if internet_col in input_data:
        input_data[internet_col] = 1

    payment_col = f'PaymentMethod_{payment_method}'
    if payment_col in input_data:
        input_data[payment_col] = 1

    X_input = pd.DataFrame([input_data])[model_columns]

    proba = model.predict_proba(X_input)[0][1]
    prediction = int(proba >= THRESHOLD)

    return round(proba, 4), prediction