import pandas as pd
import json
import re
from transformation_utils import convert_to_snake_case, summarize_to_yes, clean_gastos, clean_to_commons, get_mascotas, \
    extract_tipo_from_title, convert_to_unixtime
import logging


def transform_data(documents, city):
    df = pd.DataFrame(documents)
    if '_id' in df.columns:
        df = df.drop('_id', axis=1)
    for col in df.columns:
        if df[col].apply(isinstance, args=(list,)).any():
            df[col] = df[col].apply(json.dumps)
    df['city'] = city

    # Convert relevant timestamp columns to Unix time
    for timestamp_col in ['updatedAt', 'createdAt']:  # Add more timestamp columns if needed
        if timestamp_col in df.columns:
            df[timestamp_col] = df[timestamp_col].apply(convert_to_unixtime)

    df.columns = [convert_to_snake_case(col) for col in df.columns]
    # Transform the "price" and "old price" columns
    for col in ['price', 'old_price', 'superficie_construida', 'superficie_util', 'superficie_solar']:
        if col in df.columns:
            df[col] = df[col].apply(
                lambda x: int(re.sub('[^0-9]', '', x)) if isinstance(x, str) and re.sub('[^0-9]', '',
                                                                                        x) != '' else None)
            # Rename the columns
            new_col_name = f"{col.replace(' ', '_')}_euro" if 'price' in col else f"{col.replace(' ', '_')}_m2"
            df.rename(columns={col: new_col_name}, inplace=True)

    # Convert "habitaciones" and "banos" to numeric types
    for col in ["habitaciones", "banos"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')

    COLUMNS_TO_SUMMARIZE_YES_NO = ['exterior', 'vidrios_dobles', 'adaptado_a_personas_con_movilidad_reducida', 'puerta_blindada', 'ascensor',
                'balcon', 'portero_automatico', 'garaje', 'comedor', 'terraza', 'jardin', 'armarios_empotrados', 'aire_acondicionado',
                'trastero', 'piscina', 'chimenea', 'lavadero', 'urbanizado', 'calle_alumbrada', 'calle_asfaltada', 'soleado',
                'gas', 'sistema_de_seguridad', 'interior', 'esquina', 'alcantarillado']

    # summarize to "yes", "no", "null"
    for col in COLUMNS_TO_SUMMARIZE_YES_NO:
        if col in df.columns:
            df[col+"_summary"] = df[col].apply(summarize_to_yes)

    if 'amueblado' in df.columns:
        df["amueblado_summary"] = df["amueblado"].apply(lambda e: summarize_to_yes(e, consider_as_no = ["SIN AMUEBLAR", "VACÍO"]))

    if 'cocina_equipada' in df.columns:
        df["cocina_equipada_summary"] = df["cocina_equipada"].apply(lambda e: summarize_to_yes(e, consider_as_no = ["SIN AMUEBLAR", "VACÍO"]))

    # Create the new "mascotas" column
    df['mascotas_summary'] = df.apply(get_mascotas, axis=1)

    # Clean the gastos_de_comunidad column
    if 'gastos_de_comunidad' in df.columns:
        df['gastos_de_comunidad_cleaned'] = df['gastos_de_comunidad'].apply(clean_gastos)

    #Clean to commons
    if 'carpinteria_exterior' in df.columns:
        df['carpinteria_exterior_cleaned'] = df['carpinteria_exterior'].apply(lambda e: clean_to_commons(e, to_group=["CLIMALIT"], most_commons = ["ALUMINIO", "PVC", "MADERA"]))

    if 'tipo_suelo' in df.columns:
        df['tipo_suelo_summary'] = df['tipo_suelo'].apply(lambda e: clean_to_commons(e, to_group=["CERAMICA"], most_commons = ["GRES", "PARQUET", "TERRAZO", "TARIMA FLOTANTE", "MARMOL"]))

    if 'calefaccion' in df.columns:
        df['calefaccion_summary'] = df['calefaccion'].apply(lambda e: clean_to_commons(e, to_group=[], most_commons=["GAS NATURAL", "CENTRAL", "ELECTRICA", "GASOIL", "GAS", "NO"]))

    if 'cocina' in df.columns:
        df['cocina_summary'] = df['cocina'].apply(lambda e: clean_to_commons(e, to_group=['AMERICANA', 'INDIVIDUAL', 'INDEPENDIENTE', 'AMUEBLADA'], most_commons=[]))

    if 'orientacion' in df.columns:
        df['orientacion_summary'] = df['orientacion'].apply(lambda e: clean_to_commons(e, to_group=[], most_commons=['SUR', 'SURESTE', 'SUROESTE' 'ESTE', 'OESTE', 'NORTE', 'NORESTE', 'NOROESTE']))

    if 'agua' in df.columns:
        df['agua_summary'] = df['agua'].apply(lambda e: clean_to_commons(e, to_group=['ELECTRIC', 'GAS NATURAL', 'GASOL', 'GAS', 'CENTRAL'], most_commons=[], extra_element='INDEFINIDO/OTROS'))

    if 'title' in df.columns:
        df["type"] = df['title'].apply(extract_tipo_from_title)

    #carpinteria_interior, luz y telefono not interesting
    return df


def transform_all_data(all_documents):
    '''
    :param all_documents:
    :return all_data_transformed (pandas dataframe), collections_transformed (array of strings, names of collections correctly extracted and transformed)
    '''

    list_of_dfs = []
    all_data_transformed = None
    collections_transformed = []

    for collection_name in all_documents.keys():
        try:
            logging.info(f"Transforming data... collection {collection_name}")
            df = transform_data(all_documents[collection_name], collection_name)
            list_of_dfs.append(df)
            collections_transformed.append(collection_name)
        except Exception as e:
            logging.error(f"Failed to transform {collection_name}: {e}")

    if len(list_of_dfs) > 0:
        all_data_transformed = pd.concat(list_of_dfs, ignore_index=True)

        # Check for duplicates by 'id' and keep the ones with the largest 'updatedAt'
        all_data_transformed = all_data_transformed.sort_values('updatedat', ascending=False).drop_duplicates('id', keep='first')

    else:
        logging.info(f"No data was transformed from MongoDB collections")

    return all_data_transformed, collections_transformed
