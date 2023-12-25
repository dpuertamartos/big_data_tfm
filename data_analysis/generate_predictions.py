# generate_predictions.py
import pandas as pd
import joblib
from data_cleaning import clean_data  # Assuming this is your data cleaning module

def load_model(model_path):
    # Loads both the model and its preprocessing pipeline
    model, preprocessor = joblib.load(model_path)
    return model, preprocessor

def make_predictions(df, models):
    predictions = []

    for index, row in df.iterrows():
        row_df = row.to_frame().T

        city = row['city']
        price_category = 'cheap' if row['price_euro'] <= 350000 else 'expensive'

        # Select the appropriate model and its pipeline
        model, preprocessor = models[city][price_category]

        # Preprocess the row
        processed_row = preprocessor.transform(row_df)

        # Generate prediction
        prediction = model.predict(processed_row)
        predictions.append(prediction[0])

    return predictions

def main():
    df = pd.read_csv("pisos.csv")
    df_cleaned = clean_data(df)

    # Get the list of unique cities from the DataFrame
    cities = df_cleaned['city'].unique()

    models = {city: {} for city in cities}

    for city in cities:
        for category in ['cheap', 'expensive']:
            model_path = f"./models/{city}_{category}_RandomForest.joblib"  # Adjust model path as necessary
            models[city][category] = load_model(model_path)

    df_cleaned['predictions'] = make_predictions(df_cleaned, models)

    # Save the DataFrame with predictions
    df_cleaned.to_csv("predictions.csv", index=False)

if __name__ == "__main__":
    main()
