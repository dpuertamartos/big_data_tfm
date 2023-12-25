#train.py
import pandas as pd
import convert_db_to_csv
import model_generation
import os
from config import model_types, model_saving_path
from data_cleaning import DataCleaningTransformer

if __name__ == "__main__":
    convert_db_to_csv.generate_csv_from_db("pisos_backup.db", age_in_months=6)

    df_all = pd.read_csv("pisos.csv")

    df_expensive = df_all[df_all['price_euro'] > 350000]
    df_cheap = df_all[df_all['price_euro'] <= 350000]

    data_cleaner_expensive = DataCleaningTransformer()
    data_cleaner_expensive.fit(df_expensive)

    data_cleaner_cheap = DataCleaningTransformer()
    data_cleaner_cheap.fit(df_cheap)

    print(len(df_expensive), len(df_cheap))

    print("Average Percentage:", data_cleaner_cheap.average_percentage)
    print("Median Superficie Construida m2:", data_cleaner_cheap.median_superficie_construida_m2)

    rmse_results_all_models = {}
    all_models = {}

    for model_type in model_types:
        models, rmse_scores_relative = model_generation.generate_models(unique_cities=df_all['city'].unique(),
                                                       df_cheap=df_cheap,
                                                       df_expensive=df_expensive,
                                                       model_type=model_type,
                                                       data_cleaner_cheap=data_cleaner_cheap,
                                                       data_cleaner_expensive=data_cleaner_expensive)
        rmse_results_all_models[model_type] = rmse_scores_relative
        all_models[model_type] = models


    # Get the best models for each city
    best_models_for_each_city = model_generation.get_best_models(rmse_results_all_models)

    if not os.path.exists(model_saving_path):
        os.makedirs(model_saving_path)

    model_generation.save_best_models(model_saving_path=model_saving_path,
                                      best_models_for_each_city=best_models_for_each_city,
                                      all_models=all_models,
                                      data_cleaner_cheap=data_cleaner_cheap,
                                      data_cleaner_expensive=data_cleaner_expensive)

    # # After saving the models, delete the 'pisos.csv' file
    # if os.path.exists("pisos.csv"):
    #     os.remove("pisos.csv")
    #     print("pisos.csv has been cleared.")





