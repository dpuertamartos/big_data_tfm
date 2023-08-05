import scrapy
import pymongo


class PisosSpider(scrapy.Spider):
    name = 'general'
    cities = ['a_coruna', 'alava_araba', 'albacete', 'alicante', 'almeria', 'andorra', 'asturias', 'avila',
              'badajoz', 'islas_baleares_illes_balears', 'barcelona', 'bilbao', 'burgos', 'caceres',
              'cadiz', 'cantabria', 'castellon_castello', 'pisos-cerdanya_francesa', 'ceuta', 'ciudad_real', 'cordoba',
              'cuenca', 'el_hierro', 'formentera', 'fuerteventura', 'gijon_concejo_xixon_conceyu_gijon',
              'guipuzcoa_gipuzkoa', 'girona', 'gran_canaria', 'granada', 'guadalajara', 'huelva', 'huesca', 'isla_de_ibiza_eivissa'
              'jaen', 'la_palma', 'la_rioja', 'lanzarote', 'las_palmas', 'las_palmas_de_gran_canaria', 'leon',
              'lleida', 'logrono', 'lugo', 'madrid', 'malaga', 'isla_de_mallorca', 'melilla', 'isla_de_menorca', 'murcia',
              'navarra_nafarroa', 'oviedo', 'pais_vasco_frances_iparralde', 'palencia', 'isla_de_mallorca_palma_de_mallorca',
              'pamplona_iruna', 'pontevedra', 'salamanca', 'san_sebastian_donostia',
              'santander', 'segovia', 'sevilla', 'soria', 'tarragona', 'tenerife',
              'teruel', 'toledo', 'valencia', 'valladolid', 'vigo', 'vitoria_gasteiz_zona_urbana', 'vizcaya_bizkaia', 'zamora', 'zaragoza']
    # Ciudades a crawlear
    start_urls = ['https://www.pisos.com/venta/pisos-{}/fecharecientedesde-desc/1/'.format(city) for city in cities]

    def __init__(self):
        self.max_page_to_search = 100
        self.client = pymongo.MongoClient("mongodb://localhost:27017/")  # Adjust the connection string if needed
        self.db = self.client["pisos"]  # Change to your database name
        self.collection = self.db["pisos_ingestion"]  # Change to your collection name

    def parse(self, response):
        if response.status in range(300, 310):
            return

        city = response.url.split('-')[1].split('/')[0]
        collection = self.db[city]  # Use the city's name as the collection name

        for ad in response.css('div.ad-preview'):
            id = ad.xpath('@id').get()
            if not collection.find_one({"id": id}):  # Use the city's specific collection
                data = {
                    'id': id,
                    'title': ad.css('a.ad-preview__title::text').get(),
                    'location': ad.css('p.p-sm::text').get(),
                    'city': city,
                    'price': ad.css('span.ad-preview__price::text').get().strip(),
                    'characteristics': [char.get() for char in
                                        ad.css('div.ad-preview__inline p.ad-preview__char::text')],
                    'description': ad.css('p.ad-preview__description::text').get(),
                    'image_url': ad.css('div.carousel__main-photo--mosaic::attr(style)').re('url\((.*?)\)')[
                        0] if ad.css(
                        'div.carousel__main-photo--mosaic::attr(style)').re('url\((.*?)\)') else None,
                    'link': response.urljoin(ad.css('a.ad-preview__title::attr(href)').get()),
                }

                collection.insert_one(data)  # Insert data into the city's specific collection
                print("saved data=", data)

        next_page_number = int(response.url.split('/')[-2]) + 1
        next_page_url = '/'.join(response.url.split('/')[:-2]) + '/' + str(next_page_number) + '/'

        current_city_homepage = '/'.join(response.url.split('/')[:-2]) + '/'

        if response.url != current_city_homepage and next_page_number <= self.max_page_to_search:
            yield scrapy.Request(next_page_url, callback=self.parse)

    def close_spider(self, spider):
        self.client.close()

