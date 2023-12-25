#config.py
categorical_to_fill_NO = ['exterior_summary', 'vidrios_dobles_summary',
                          'adaptado_a_personas_con_movilidad_reducida_summary',
                          'puerta_blindada_summary', 'ascensor_summary', 'balcon_summary', 'portero_automatico_summary',
                          'garaje_summary', 'comedor_summary', 'terraza_summary',
                          'jardin_summary', 'armarios_empotrados_summary', 'aire_acondicionado_summary',
                          'trastero_summary', 'piscina_summary', 'chimenea_summary',
                          'lavadero_summary', 'soleado_summary', 'gas_summary',
                          'amueblado_summary', 'cocina_equipada_summary', 'calefaccion_summary',
                          ]

categorical_to_fill_DESCONOCIDO = ['city', 'location', 'conservacion', 'antiguedad', 'tipo_de_casa',
                                   'urbanizado_summary',
                                   'calle_alumbrada_summary', 'calle_asfaltada_summary', 'interior_summary',
                                   'mascotas_summary', 'carpinteria_exterior_cleaned', 'tipo_suelo_summary',
                                   'cocina_summary', 'orientacion_summary',
                                   'type']

categorical = categorical_to_fill_NO + categorical_to_fill_DESCONOCIDO

# model_types = ["RandomForest", "GradientBoosting", "AdaBoost", "ExtraTrees", "DecisionTree","LinearRegression","Ridge","Lasso","ElasticNet","SVR","KNN"]
model_types = ["RandomForest"]

model_saving_path = './models'