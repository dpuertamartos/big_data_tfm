#model_generation.py
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, AdaBoostRegressor, \
    ExtraTreesRegressor
from sklearn.tree import DecisionTreeRegressor
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
from sklearn.svm import SVR
from sklearn.neighbors import KNeighborsRegressor
from sklearn.metrics import mean_squared_error
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from config import categorical
import joblib
import os


def preprocess_data(df):

    # Assume df is your DataFrame
    df = df.drop(columns=['price_euro', 'old_price_euro'])
    # One-hot encode the categorical columns
    df_encoded = pd.get_dummies(df, columns=categorical + ['habitaciones', 'banos', 'gastos_de_comunidad_cleaned'])
    # Handle numerical columns (scaling, filling missing values, etc.)

    return df_encoded



def create_model(df, city, model_type):

    X_encoded = preprocess_data(df)

    # Define the target
    y = df['price_euro']

    # Split the data into train and test sets
    X_train, X_test, y_train, y_test = train_test_split(X_encoded, y, test_size=0.2, random_state=42)

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

    base_model = model
    base_model.fit(X_train, y_train)

    # Predict using the best model
    y_pred = base_model.predict(X_test)

    def plot_true_to_predicted(y_test, y_pred):
        true_values = y_test.tolist()
        predicted_values = y_pred.tolist()
        plt.figure(figsize=(10, 6))
        plt.scatter(true_values, predicted_values, alpha=0.5)
        plt.xlabel("True Values")
        plt.ylabel("Predicted Values")
        plt.title(f"True vs. Predicted Values for {city}")
        plt.plot([min(true_values), max(true_values)],
                 [min(true_values), max(true_values)], 'r')
        plt.show()

    # Check if the model has the feature_importances_ attribute
    if hasattr(base_model, 'feature_importances_'):
        feature_importances = base_model.feature_importances_
        importance_df = pd.DataFrame({
            'feature': X_encoded.columns,
            'importance': feature_importances
        }).sort_values(by='importance', ascending=False)

        print(importance_df)
    else:
        print(f"{model_type} does not have feature_importances_ attribute.")

    # Calculate the mean squared error
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    # Statistics of price_euro
    mean_price = df['price_euro'].mean()
    std_price = df['price_euro'].std()

    return base_model, rmse, mean_price


def generate_models(unique_cities, df_cheap, df_expensive, model_type="RandomForest"):
    models = {}  # To store trained models for each city
    rmse_scores = {}  # To store RMSE scores for each city
    mean_prices = {}

    for city in unique_cities:
        city_df_cheap = df_cheap[df_cheap['city'] == city].copy()

        cheap_model, cheap_rmse, cheap_mean_price = create_model(city_df_cheap, city, model_type)
        # Store the trained model and RMSE

        print("Cheap model -----------")
        print(f"City: {city}, RMSE: {cheap_rmse:.2f}, mean_price: {cheap_mean_price}")

        city_df_expensive = df_expensive[df_expensive['city'] == city].copy()

        expensive_model, expensive_rmse, expensive_mean_price = create_model(city_df_expensive, city, model_type)

        print("Expensive model ----------")
        print(f"City: {city}, RMSE: {expensive_rmse:.2f}, mean_price: {expensive_mean_price}")

        models[city] = {'cheap': cheap_model, 'expensive': expensive_model}
        rmse_scores[city] = {'cheap': cheap_rmse, 'expensive': expensive_rmse}
        mean_prices[city] = {'cheap': cheap_mean_price, 'expensive': expensive_mean_price}

    rmse_scores_relative = {k: {'cheap': rmse_scores[k]['cheap'] / mean_prices[k]['cheap'],
                                'expensive': rmse_scores[k]['expensive'] / mean_prices[k]['expensive']
                                } for k in rmse_scores.keys()}

    return rmse_scores_relative, models


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


def save_best_models(model_saving_path, best_models_for_each_city, all_models):
    # Save only the best models

    for city, models in best_models_for_each_city.items():
        cheap_model_name, _ = models['cheap']
        expensive_model_name, _ = models['expensive']

        # Save the best cheap model
        cheap_model = all_models[cheap_model_name][city]['cheap']
        joblib.dump(cheap_model, os.path.join(model_saving_path, f"{city}_cheap_{cheap_model_name}.joblib"))

        # Save the best expensive model
        expensive_model = all_models[expensive_model_name][city]['expensive']
        joblib.dump(expensive_model, os.path.join(model_saving_path, f"{city}_expensive_{expensive_model_name}.joblib"))



