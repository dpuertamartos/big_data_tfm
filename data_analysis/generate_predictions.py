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
    df_all = pd.read_csv("pisos.csv")

    # Load data cleaners
    data_cleaner_cheap = joblib.load("./models/data_cleaner_cheap.joblib")
    data_cleaner_expensive = joblib.load("./models/data_cleaner_expensive.joblib")

    # Separate data into 'cheap' and 'expensive' categories
    df_cheap = df_all[df_all['price_euro'] <= 350000]
    df_expensive = df_all[df_all['price_euro'] > 350000]

    # Clean data for each category
    df_cheap_cleaned = data_cleaner_cheap.transform(df_cheap)
    df_expensive_cleaned = data_cleaner_expensive.transform(df_expensive)

    # Load models
    models = {city: {} for city in df_all['city'].unique()}
    for city in models:
        for category in ['cheap', 'expensive']:
            model_path = f"./models/{city}_{category}_RandomForest.joblib"  # Adjust model path as necessary
            models[city][category] = load_model(model_path)

    # Make predictions for each category
    df_cheap_cleaned['predictions'] = make_predictions(df_cheap_cleaned, models)
    df_expensive_cleaned['predictions'] = make_predictions(df_expensive_cleaned, models)

    # Combine the datasets after making predictions
    df_cleaned_with_predictions = pd.concat([df_cheap_cleaned, df_expensive_cleaned])

    # Save the DataFrame with predictions
    df_cleaned_with_predictions.to_csv("predictions.csv", index=False)

if __name__ == "__main__":
    main()
