# generate_predictions.py
import pandas as pd
import joblib
import sqlite3
import argparse
import time

def load_model(model_path):
    # Loads both the model and its preprocessing pipeline
    model, preprocessor = joblib.load(model_path)
    return model, preprocessor


def load_required_models(df):
    # Identify unique cities and price categories in the DataFrame
    unique_cities = df['city'].unique()
    unique_categories = ['cheap', 'expensive']  # Assuming only these two categories

    models = {city: {} for city in unique_cities}
    for city in unique_cities:
        for category in unique_categories:
            model_path = f"./models/{city}_{category}_RandomForest.joblib"
            models[city][category] = load_model(model_path)

    return models


def make_predictions(df, models):
    predictions = pd.Series(index=df.index)

    for city, group_df in df.groupby('city'):
        price_category = 'cheap' if group_df['price_euro'].iloc[0] <= 350000 else 'expensive'
        model, preprocessor = models[city][price_category]

        # Preprocess the group
        processed_group = preprocessor.transform(group_df)

        # Generate predictions for the group
        group_predictions = model.predict(processed_group)

        # Assign predictions back to the corresponding indices in the original DataFrame
        predictions[group_df.index] = group_predictions

    return predictions


def store_predictions_in_db(database, df):
    print("Storing predictions in db")
    df['rating'] = (df['predictions'] - df['price_euro']) / df['price_euro']
    current_unix_time = int(time.time())
    count = 0
    with sqlite3.connect(database) as conn:
        # Update the 'pisos' table with the predictions
        for index, row in df.iterrows():
            conn.execute("UPDATE pisos SET prediction = ?, rating = ?, predictionupdatedat = ? WHERE id = ?",
                         (row['predictions'], row['rating'], current_unix_time, row['id']))
            count += 1
        conn.commit()
    print(f"{count} predictions stored in 'pisos' table.")


def predict_and_store_all(database, data_cleaner_cheap, data_cleaner_expensive):
    with sqlite3.connect(database) as conn:
        df_all = pd.read_sql_query("SELECT * FROM pisos WHERE price_euro is NOT NULL", conn)

    print(f'loaded {len(df_all)} (all entries) to predict using the models')
    models = load_required_models(df_all)
    df_cheap = df_all[df_all['price_euro'] <= 350000]
    df_expensive = df_all[df_all['price_euro'] > 350000]

    df_cheap_cleaned = data_cleaner_cheap.transform(df_cheap)
    df_expensive_cleaned = data_cleaner_expensive.transform(df_expensive)

    df_cheap_cleaned['predictions'] = make_predictions(df_cheap_cleaned, models)
    df_expensive_cleaned['predictions'] = make_predictions(df_expensive_cleaned, models)

    df_cleaned_with_predictions = pd.concat([df_cheap_cleaned, df_expensive_cleaned])
    store_predictions_in_db(database, df_cleaned_with_predictions[['id', 'predictions', 'price_euro']])


def predict_and_store_new_entries(database, data_cleaner_cheap, data_cleaner_expensive):
    with sqlite3.connect(database) as conn:
        new_entries = pd.read_sql_query("SELECT * FROM pisos WHERE prediction IS NULL AND price_euro is NOT NULL", conn)

    print(f'loaded {len(new_entries)} to predict using the models')
    models = load_required_models(new_entries)
    # Apply the appropriate cleaner based on the price category
    new_cheap = new_entries[new_entries['price_euro'] <= 350000]
    new_expensive = new_entries[new_entries['price_euro'] > 350000]
    new_cheap_cleaned = data_cleaner_cheap.transform(new_cheap)
    new_expensive_cleaned = data_cleaner_expensive.transform(new_expensive)

    # Make predictions
    new_cheap_cleaned['predictions'] = make_predictions(new_cheap_cleaned, models)
    new_expensive_cleaned['predictions'] = make_predictions(new_expensive_cleaned, models)

    # Combine the datasets after making predictions
    new_cleaned_with_predictions = pd.concat([new_cheap_cleaned, new_expensive_cleaned])

    # Store predictions in the database
    store_predictions_in_db(database, new_cleaned_with_predictions[['id', 'predictions', 'price_euro']])



def main():
    parser = argparse.ArgumentParser(description="Predict prices for real estate listings.")
    parser.add_argument('--mode', choices=['all', 'new'], default='all',
                        help='Choose "all" to predict for all entries or "new" for only new entries.')

    args = parser.parse_args()

    database_path = "pisos_backup.db"

    # Load data cleaners
    data_cleaner_cheap = joblib.load("./models/data_cleaner_cheap.joblib")
    data_cleaner_expensive = joblib.load("./models/data_cleaner_expensive.joblib")

    if args.mode == 'all':
        predict_and_store_all(database_path, data_cleaner_cheap, data_cleaner_expensive)
    else:
        predict_and_store_new_entries(database_path, data_cleaner_cheap, data_cleaner_expensive)

if __name__ == "__main__":
    main()
