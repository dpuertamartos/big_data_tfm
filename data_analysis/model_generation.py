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
    cleaned_df = cleaned_df.drop(columns=['price_euro', 'old_price_euro', 'id'])
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
        try:
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
        except Exception as e:
            print(f'model {model_type} for city {city} failed to generate. Error: {str(e)}')

    rmse_scores_relative = {k: {'cheap': rmse_scores[k]['cheap'] / mean_prices[k]['cheap'],
                                'expensive': rmse_scores[k]['expensive'] / mean_prices[k]['expensive']
                                } for k in rmse_scores.keys()}

    return models, rmse_scores_relative


# Function to save the best models
def save_best_models(model_saving_path, best_models, data_cleaner_cheap, data_cleaner_expensive):
    joblib.dump(data_cleaner_cheap, os.path.join(model_saving_path, "data_cleaner_cheap.joblib"))
    joblib.dump(data_cleaner_expensive, os.path.join(model_saving_path, "data_cleaner_expensive.joblib"))
    for (city, category), models in best_models.items():
        model, preprocessor = best_models[(city, category)]['model']
        print(city, category, best_models[(city, category)]['rmse'], best_models[(city, category)]['model_type'])
        joblib.dump((model, preprocessor), os.path.join(model_saving_path, f"{city}_{category}.joblib"))





