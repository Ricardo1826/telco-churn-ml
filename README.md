# Telco Churn Prediction

Prédiction du risque de résiliation (churn) d'un client télécom, avec un modèle de régression logistique, entraîné sur le dataset Telco Customer Churn (7043 clients). Interface web (React) avec tableau de bord analytique et simulateur interactif, connectée à une API (FastAPI).

## Aperçu

Interface web permettant d'explorer les facteurs de churn identifiés par l'analyse, et de tester le risque de résiliation pour un profil client donné.

## Résultats du modèle

| Métrique | Valeur |
|---|---|
| AUC | 0.8388 |
| Rappel (classe churn, seuil 0.4) | 0.86 |
| Précision (classe churn, seuil 0.4) | 0.47 |

Modèle retenu : régression logistique avec `class_weight='balanced'`, seuil de décision ajusté à 0.4 pour prioriser la détection des clients à risque plutôt que l'exactitude globale.

## Méthodologie

1. **Nettoyage des données** (`preprocessing.ipynb`) : correction de `TotalCharges` (valeurs vides liées à une ancienneté nulle), normalisation de `SeniorCitizen`
2. **Analyse exploratoire** (`eda.ipynb`) : taux de churn global (26.5%), tests statistiques (Mann-Whitney, Chi²), segments à risque (contrat mensuel + fibre optique : 54.6% de churn)
3. **Feature engineering** (`feature_engineering.ipynb`) : encodage binaire et one-hot, standardisation de `tenure`/`MonthlyCharges`
4. **Modélisation** (`modeling.ipynb`) : régression logistique, gestion du déséquilibre des classes, ajustement du seuil de décision, interprétation des coefficients

## Facteurs de churn identifiés

- Facteur de risque principal : connexion internet en fibre optique
- Facteurs protecteurs principaux : engagement de 2 ans, ancienneté élevée, absence d'internet

## Structure du dépôt

- `notebooks/` : les 4 notebooks du pipeline (nettoyage, EDA, feature engineering, modélisation)
- `data/` : données brutes et transformées
- `src/` : modèle entraîné, scaler, script de prédiction (`predict.py`), API (`api.py`)
- `frontend/` : application React (tableau de bord et simulateur)

## Lancer le projet en local

**API (dans `src/`) :**
```bash
uvicorn api:app --reload
```

**Frontend (dans `frontend/`) :**
```bash
npm install
npm run dev
```

## Outils utilisés

Python (pandas, scikit-learn, matplotlib, seaborn, scipy), FastAPI, React, Tailwind CSS

## Auteur

Richard GNALOU