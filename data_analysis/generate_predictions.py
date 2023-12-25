# generate_predictions.py
import pandas as pd
import joblib
from data_cleaning import clean_data  # Assuming this is your data cleaning module
import sqlite3
import argparse
import time


def load_model(model_path):
    # Loads both the model and its preprocessing pipeline
    model, preprocessor = joblib.load(model_path)
    return model, preprocessor


def make_predictions(df, models):
    # Initialize an empty Series to store predictions
    predictions = pd.Series(index=df.index)

    # Group by city and price category
    for (city, price_category), group_df in df.groupby(['city', df['price_euro'] <= 350000]):
        price_category = 'cheap' if price_category else 'expensive'

        # Select the appropriate model and its pipeline
        model, preprocessor = models[city][price_category]

        # Preprocess the group
        processed_group = preprocessor.transform(group_df)

        # Generate predictions for the group
        group_predictions = model.predict(processed_group)

        # Assign predictions back to the corresponding indices in the original DataFrame
        predictions[group_df.index] = group_predictions

    return predictions


# def store_predictions_in_db(database, df):
#     with sqlite3.connect(database) as conn:
#         df.to_sql('predicted', conn, if_exists='replace', index=False)
#     print("Predictions stored in 'predicted' table.")
#
#
# def predict_and_store_all(database, models):
#     with sqlite3.connect(database) as conn:
#         df = pd.read_sql_query("SELECT * FROM pisos WHERE active = 1", conn)
#
#     df_cleaned = clean_data(df)
#     df_cleaned['predictions'] = make_predictions(df_cleaned, models)
#     store_predictions_in_db(database, df_cleaned[['id', 'predictions']])
#
#
# def predict_and_store_new_entries(database, models, days=1):
#
#     days_ago_unix_time = time.time() - (days * 24 * 60 * 60)
#     with sqlite3.connect(database) as conn:
#         query = f"SELECT * FROM pisos WHERE updatedat > {days_ago_unix_time}"
#         new_entries = pd.read_sql_query(query, conn)
#
#     new_cleaned = clean_data(new_entries)
#     new_cleaned['predictions'] = make_predictions(new_cleaned, models)
#     store_predictions_in_db(database, new_cleaned[['id', 'predictions']])


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
