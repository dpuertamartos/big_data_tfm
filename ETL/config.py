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

categorical_to_fill_DESCONOCIDO = ['province', 'capital', 'location', 'conservacion', 'antiguedad', 'tipo_de_casa',
                                   'urbanizado_summary',
                                   'calle_alumbrada_summary', 'calle_asfaltada_summary', 'interior_summary',
                                   'mascotas_summary', 'carpinteria_exterior_cleaned', 'tipo_suelo_summary',
                                   'cocina_summary', 'orientacion_summary',
                                   'type']

categorical = categorical_to_fill_NO + categorical_to_fill_DESCONOCIDO

province_to_capital = {
    'andorra':'Andorra La Vella',
    'islas_baleares_illes_balears': 'Palma de Mallorca',
    'asturias': 'Oviedo', 
    'las_palmas': 'Las Palmas de Gran Canaria',
    'cantabria': 'Santander', 
    'alava_araba': 'Vitoria - Gasteiz',  
    'alicante': 'Alicante - Alacant', 
    'castellon_castello': 'Castello de la Plana',
    'guipuzcoa_gipuzkoa': 'San Sebastian - Donostia', 
    'la_rioja': 'Logrono', 
    'navarra_nafarroa': 'Pamplona - Iruña', 
    'ceuta': 'Ceuta',
    'pontevedra': 'Vigo', 
    'vizcaya_bizkaia': 'Bilbao',
    'melilla': 'Melilla'
}


mongo_uri = 'mongodb://mongodb-container:27017/'
