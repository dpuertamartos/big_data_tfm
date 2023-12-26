#data_cleaning.py
from sklearn.base import BaseEstimator, TransformerMixin
from config import categorical, categorical_to_fill_NO, categorical_to_fill_DESCONOCIDO
import pandas as pd


class DataCleaningTransformer(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.average_percentage = None
        self.median_superficie_construida_m2 = None

    def fit(self, X, y=None):
        df = X.copy()

        mask = df['superficie_util_m2'].notna() & df['superficie_construida_m2'].notna()
        percentage_diffs = (df.loc[mask, 'superficie_construida_m2'] - df.loc[mask, 'superficie_util_m2']) / df.loc[
            mask, 'superficie_construida_m2']
        self.average_percentage = percentage_diffs.mean()

        self.median_superficie_construida_m2 = df['superficie_construida_m2'].median()

        return self

    def transform(self, X):
        df = X.copy()
        numerical = ['price_euro', 'old_price_euro', 'superficie_construida_m2',
                     'superficie_util_m2', 'habitaciones', 'banos',
                     'superficie_solar_m2', 'gastos_de_comunidad_cleaned']

        # Fill NaN values with predefined categories
        for col in categorical_to_fill_NO:
            df[col].fillna('NO', inplace=True)
        for col in categorical_to_fill_DESCONOCIDO:
            df[col].fillna('DESCONOCIDO', inplace=True)

        df = df[categorical + numerical + ['id']]

        # Apply the average percentage and median value
        mask = df['superficie_construida_m2'].isna() & df['superficie_util_m2'].notna()
        df.loc[mask, 'superficie_construida_m2'] = df.loc[mask, 'superficie_util_m2'] * (1 + self.average_percentage)
        df['superficie_construida_m2'].fillna(self.median_superficie_construida_m2, inplace=True)

        mask = df['superficie_util_m2'].isna()
        df.loc[mask, 'superficie_util_m2'] = df.loc[mask, 'superficie_construida_m2'] * (1 - self.average_percentage)

        df['superficie_solar_m2'].fillna(0, inplace=True)
        df['old_price_euro'].fillna(df['price_euro'], inplace=True)

        # Apply custom conversions
        df['gastos_de_comunidad_cleaned'] = df['gastos_de_comunidad_cleaned'].apply(self.convert_gastos)
        df['habitaciones'] = df['habitaciones'].apply(self.convert_to_cat)
        df['banos'] = df['banos'].apply(self.convert_to_cat)

        df.dropna(subset=['price_euro'], inplace=True)

        assert not df.isna().sum().any()
        return df

    def convert_to_cat(self, val):
        if pd.isna(val):
            return "DESCONOCIDO"
        elif val <= 6:
            return str(int(val))
        else:
            return "7 or more"

    def convert_gastos(self, val):
        if pd.isna(val):
            return "DESCONOCIDO"
        elif val == 0:
            return "0"
        elif 0 < val <= 20:
            return "0-20"
        elif 20 < val <= 40:
            return "20-40"
        elif 40 < val <= 60:
            return "40-60"
        elif 60 < val <= 80:
            return "60-80"
        elif 80 < val <= 100:
            return "80-100"
        elif 100 < val <= 120:
            return "100-120"
        elif 120 < val <= 140:
            return "120-140"
        elif 140 < val <= 160:
            return "140-160"
        elif 160 < val <= 180:
            return "160-180"
        elif 180 < val <= 200:
            return "180-200"
        elif val > 200:
            return "200+"