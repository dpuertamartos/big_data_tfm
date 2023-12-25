#train.py
import pandas as pd
from data_cleaning import clean_data
import convert_db_to_csv
import model_generation
import os
from config import model_types, model_saving_path


if __name__ == "__main__":
    convert_db_to_csv.generate_csv_from_db("pisos_backup.db")

    df_all = pd.read_csv("pisos.csv")

    df_expensive = df_all[df_all['price_euro'] > 350000]
    df_cheap = df_all[df_all['price_euro'] <= 350000]

    print(len(df_expensive), len(df_cheap))
    df_cheap = clean_data(df_cheap)
    df_expensive = clean_data(df_expensive)

    rmse_results_all_models = {}
    all_models = {}

    for model_type in model_types:
        models, rmse_scores_relative = model_generation.generate_models(unique_cities=df_all['city'].unique(),
                                                       df_cheap=df_cheap,
                                                       df_expensive=df_expensive,
                                                       model_type=model_type)
        rmse_results_all_models[model_type] = rmse_scores_relative
        all_models[model_type] = models


    # Get the best models for each city
    best_models_for_each_city = model_generation.get_best_models(rmse_results_all_models)

    if not os.path.exists(model_saving_path):
        os.makedirs(model_saving_path)

    model_generation.save_best_models(model_saving_path=model_saving_path,
                                      best_models_for_each_city=best_models_for_each_city,
                                      all_models=all_models)







