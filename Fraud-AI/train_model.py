import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

df = pd.read_csv("transactions.csv")

X = df[["amount", "location", "device", "type"]]
y = df["is_fraud"]

preprocessor = ColumnTransformer(
    transformers=[
        ("cat", OneHotEncoder(handle_unknown="ignore"), ["location", "device", "type"]),
        ("num", "passthrough", ["amount"])
    ]
)

model = Pipeline([
    ("preprocessor", preprocessor),
    ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))
])

model.fit(X, y)

joblib.dump(model, "fraud_model.pkl")
print("Model trained and saved as fraud_model.pkl")
