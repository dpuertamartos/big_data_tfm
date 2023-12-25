# model_generation.py
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, AdaBoostRegressor, ExtraTreesRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import mean_squared_error
from sklearn.pipeline import Pipeline
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from config import categorical
import joblib
import os
from data_cleaning import DataCleaningTransformer



class DataFrameDummiesTransformer(BaseEstimator, TransformerMixin):
    def __init__(self, columns_to_dummify):
        self.columns_to_dummify = columns_to_dummify
        self.column_names = None

    def fit(self, X, y=None):
        X_dummies = pd.get_dummies(X, columns=self.columns_to_dummify)
        self.column_names = X_dummies.columns
        return self

    def transform(self, X):
        # Apply one-hot encoding
        X_transformed = pd.get_dummies(X, columns=self.columns_to_dummify)

        # Add missing columns with zeros
        for col in self.column_names:
            if col not in X_transformed.columns:
                X_transformed[col] = 0

        # Reorder columns to match those during training
        X_transformed = X_transformed.reindex(columns=self.column_names, fill_value=0)

        return X_transformed



# Model creation function
def create_model(df, city, model_type, data_cleaner):

    cleaned_df = data_cleaner.transform(df)

    preprocessor = Pipeline([
        ('dummies', DataFrameDummiesTransformer(categorical + ['habitaciones', 'banos', 'gastos_de_comunidad_cleaned']))
    ])

    y = cleaned_df['price_euro']
    cleaned_df = cleaned_df.drop(columns=['price_euro', 'old_price_euro'])
    X_transformed = preprocessor.fit_transform(cleaned_df)


    # Split the data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X_transformed, y, test_size=0.2, random_state=42)

    # Define and train the model
    model = get_model_by_type(model_type)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    #plot_true_to_predicted(y_test, y_pred)

    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mean_price = df['price_euro'].mean()

    return model, rmse, preprocessor, mean_price


def plot_true_to_predicted(y_test, y_pred):
    true_values = y_test.tolist()
    predicted_values = y_pred.tolist()
    plt.figure(figsize=(10, 6))
    plt.scatter(true_values, predicted_values, alpha=0.5)
    plt.xlabel("True Values")
    plt.ylabel("Predicted Values")
    plt.plot([min(true_values), max(true_values)], [min(true_values), max(true_values)], 'r')
    plt.show()


def get_model_by_type(model_type):
    if model_type == "RandomForest":
        model = RandomForestRegressor(n_estimators=100, random_state=42)
    elif model_type == "GradientBoosting":
        model = GradientBoostingRegressor(n_estimators=100, random_state=42)
    elif model_type == "AdaBoost":
        model = AdaBoostRegressor(n_estimators=100, random_state=42)
    elif model_type == "ExtraTrees":
        model = ExtraTreesRegressor(n_estimators=100, random_state=42)
    elif model_type == "DecisionTree":
        model = DecisionTreeRegressor(random_state=42)
    elif model_type == "LinearRegression":
        model = LinearRegression()
    elif model_type == "Ridge":
        model = Ridge()
    elif model_type == "Lasso":
        model = Lasso()
    elif model_type == "ElasticNet":
        model = ElasticNet()
    elif model_type == "SVR":
        model = SVR()
    elif model_type == "KNN":
        model = KNeighborsRegressor()

    return model


def generate_models(unique_cities, df_cheap, df_expensive, data_cleaner_expensive, data_cleaner_cheap, model_type="RandomForest"):
    models = {}  # To store trained models and their preprocessors for each city
    rmse_scores = {}  # To store RMSE scores for each city
    mean_prices = {}

    for city in unique_cities:
        # Process the 'cheap' category
        city_df_cheap = df_cheap[df_cheap['city'] == city].copy()
        cheap_model, cheap_rmse, cheap_preprocessor, cheap_mean_price = create_model(city_df_cheap, city, model_type, data_cleaner_cheap)
        print("Cheap model -----------")
        print(f"City: {city}, RMSE: {cheap_rmse:.2f}, mean_price: {cheap_mean_price}")

        # Process the 'expensive' category
        city_df_expensive = df_expensive[df_expensive['city'] == city].copy()
        expensive_model, expensive_rmse, expensive_preprocessor, expensive_mean_price = create_model(city_df_expensive, city, model_type, data_cleaner_expensive)
        print("Expensive model ----------")
        print(f"City: {city}, RMSE: {expensive_rmse:.2f}, mean_price: {expensive_mean_price}")

        # Store both model and preprocessor
        models[city] = {
            'cheap': (cheap_model, cheap_preprocessor),
            'expensive': (expensive_model, expensive_preprocessor)
        }
        rmse_scores[city] = {'cheap': cheap_rmse, 'expensive': expensive_rmse}
        mean_prices[city] = {'cheap': cheap_mean_price, 'expensive': expensive_mean_price}

    rmse_scores_relative = {k: {'cheap': rmse_scores[k]['cheap'] / mean_prices[k]['cheap'],
                                'expensive': rmse_scores[k]['expensive'] / mean_prices[k]['expensive']
                                } for k in rmse_scores.keys()}

    return models, rmse_scores_relative


def get_best_models(rmse_results):
    """
    Determine the best model for each city and category based on RMSE.

    rmse_results: Nested dictionary where the first key is model type,
                  the second key is city name, and the value is a dictionary
                  with 'cheap' and 'expensive' RMSEs.
    """
    best_models = {}

    for city in rmse_results[next(iter(rmse_results))].keys():  # use next(iter()) to get the first model type
        best_models[city] = {
            "cheap": min([(model, data[city]['cheap']) for model, data in rmse_results.items()], key=lambda x: x[1]),
            "expensive": min([(model, data[city]['expensive']) for model, data in rmse_results.items()],
                             key=lambda x: x[1])
        }

    return best_models


# Function to save the best models
def save_best_models(model_saving_path, best_models_for_each_city, all_models, data_cleaner_cheap, data_cleaner_expensive):
    joblib.dump(data_cleaner_cheap, os.path.join(model_saving_path, "data_cleaner_cheap.joblib"))
    joblib.dump(data_cleaner_expensive, os.path.join(model_saving_path, "data_cleaner_expensive.joblib"))
    for city, models in best_models_for_each_city.items():
        cheap_model_name, _ = models['cheap']
        expensive_model_name, _ = models['expensive']

        cheap_model, cheap_preprocessor = all_models[cheap_model_name][city]['cheap']
        expensive_model, expensive_preprocessor = all_models[expensive_model_name][city]['expensive']

        joblib.dump((cheap_model, cheap_preprocessor), os.path.join(model_saving_path, f"{city}_cheap_{cheap_model_name}.joblib"))
        joblib.dump((expensive_model, expensive_preprocessor), os.path.join(model_saving_path, f"{city}_expensive_{expensive_model_name}.joblib"))




