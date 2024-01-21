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
    'islas_baleares_illes_balears': 'Palma de Mallorca',
    'asturias': 'Oviedo', 'a_coruna': 'A Coruna',
    'girona': 'Girona', 'las_palmas': 'Las Palmas de Gran Canaria',
    'santa_cruz_de_tenerife': 'Santa Cruz de Tenerife', 'cantabria': 'Santander', 'malaga': 'Malaga',
    'almeria': 'Almeria', 'murcia': 'Murcia', 'albacete': 'Albacete', 'avila': 'Avila',
    'alava_araba': 'Vitoria - Gasteiz', 'badajoz': 'Badajoz', 'alicante': 'Alicante', 'ourense': 'Ourense',
    'barcelona': 'Barcelona', 'burgos': 'Burgos', 'caceres': 'Caceres', 'cadiz': 'Cadiz',
    'castellon_castello': 'Castello de la Plana',
    'ciudad_real': 'Ciudad Real', 'jaen': 'Jaen', 'cordoba': 'Cordoba', 'cuenca': 'Cuenca', 'granada': 'Granada',
    'guadalajara': 'Guadalajara',
    'guipuzcoa_gipuzkoa': 'San Sebastian', 'huelva': 'Huelva', 'huesca': 'Huesca', 'leon': 'Leon', 'lleida': 'Lleida',
    'la_rioja': 'Logrono', 'soria': 'Soria', 'navarra_nafarroa': 'Pamplona', 'ceuta': 'Ceuta', 'lugo': 'Lugo',
    'madrid': 'Madrid', 'palencia': 'Palencia', 'pontevedra': 'Vigo', 'salamanca': 'Salamanca', 'segovia': 'Segovia',
    'sevilla': 'Sevilla', 'toledo': 'Toledo', 'tarragona': 'Tarragona', 'teruel': 'Teruel',
    'valencia': 'Valencia', 'valladolid': 'Valladolid',
    'vizcaya_bizkaia': 'Bilbao', 'zamora': 'Zamora',
    'zaragoza': 'Zaragoza', 'melilla': 'Melilla'
}


#db_path = '/home/ubuntu/Desktop/pisos.db'


#mongo_uri = 'mongodb://mongodb-container:27017/'
mongo_uri = 'mongodb://localhost:27017/'