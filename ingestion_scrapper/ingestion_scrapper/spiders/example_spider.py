import scrapy
import pymongo
import datetime


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

    #Ciudades a crawlear
    start_urls = ['https://www.pisos.com/venta/pisos-{}/fecharecientedesde-desc/1/'.format(city) for city in cities]

    should_continue_scraping = {}
    latest_dates_per_city = {}

    def __init__(self, update_mode=False, *args, **kwargs):
        self.update_mode = update_mode
        self.max_page_to_search = 100
        self.client = pymongo.MongoClient("mongodb://localhost:27017/")  # Adjust the connection string if needed
        self.db = self.client["pisos"]  # Change to your database name
        self.last_updated_dates_collection = self.client['pisos']['last_updated_dates']
        for city in self.cities:
            self.should_continue_scraping[city] = True
            self.latest_dates_per_city[city] = self.get_last_known_date(city)


        super(PisosSpider, self).__init__(*args, **kwargs)

    def get_last_known_date(self, city):
        record = self.last_updated_dates_collection.find_one({"city": city})
        if record:
            return record.get("last_updated_date", "Fecha 15/10/1991")
        return "Fecha 15/10/1991"  # Return an empty string if no record is found

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
                    'description': ad.css('p.ad-preview__description::text').get(),
                    'link': response.urljoin(ad.css('a.ad-preview__title::attr(href)').get()),
                }
                # Make a request to the detailed page using the link and pass the current data as meta
                yield scrapy.Request(data['link'], callback=self.parse_detail, meta={'data': data, 'city': city})

        next_page_number = int(response.url.split('/')[-2]) + 1
        next_page_url = '/'.join(response.url.split('/')[:-2]) + '/' + str(next_page_number) + '/'

        current_city_homepage = '/'.join(response.url.split('/')[:-2]) + '/'

        if self.should_continue_scraping[city] and response.url != current_city_homepage and next_page_number <= self.max_page_to_search:
            yield scrapy.Request(next_page_url, callback=self.parse)



    def parse_detail(self, response):

        data = response.meta['data']  # Get the previously extracted data passed as meta
        city = response.meta['city']  # Get the city name passed as meta
        collection = self.db[city]  # Use the city as the collection name

        # Extracting the updated date
        updated_date = response.css('div.updated-date::text').get().strip() or "Fecha 15/10/1991"
        current_last_known_date = self.latest_dates_per_city.get(city, "Fecha 15/10/1991")

        print(updated_date, current_last_known_date)
        is_more_recent, is_equal_or_more_recent = self.more_recent(updated_date, current_last_known_date)
        print("is more_recent", is_more_recent, is_equal_or_more_recent)

        if is_more_recent:
            # Update the dictionary value
            self.latest_dates_per_city[city] = updated_date
            self.last_updated_dates_collection.update_one(
                {"city": city},
                {"$set": {"last_updated_date": self.latest_dates_per_city[city]}},
                upsert=True  # If the city doesn't exist, it will create a new entry
            )

        if self.update_mode and not is_equal_or_more_recent:
            self.should_continue_scraping[city] = False
            return


        data['updated_date'] = updated_date  # Removing any extra whitespace

        # Loop through each characteristic item
        for charblock in response.css('ul.charblock-list.charblock-basics > li.charblock-element'):
            # Extract the name of the characteristic
            characteristic_name = charblock.css('.icon-inline::text').get()

            # Extract the value of the characteristic
            characteristic_value = charblock.css('span:last-child::text').get()

            if characteristic_name and characteristic_value:
                characteristic_name = characteristic_name.strip().replace(" ",
                                                                          "_").lower()  # Convert to a safe key format for dictionary
                characteristic_value = characteristic_value.strip().lstrip(":").strip()  # Clean the value

                data[characteristic_name] = characteristic_value

        # Extract "other " details
        for charblock in response.css(
                'div.charblock > div.charblock-right > ul.charblock-list > li.charblock-element'):
            characteristic_name = charblock.css('span:first-child::text').get()
            characteristic_value = charblock.css('span:last-child::text').get()

            if characteristic_name and characteristic_value:
                characteristic_name = characteristic_name.strip().replace(" ", "_").lower()
                characteristic_value = characteristic_value.strip().lstrip(":").strip()
                data[characteristic_name] = characteristic_value
            elif characteristic_name:  # Some elements might not have a specific value (e.g., Amueblado)
                characteristic_name = characteristic_name.strip().replace(" ", "_").lower()
                data[characteristic_name] = "Si"  # default value

        # Extract description
        description = response.css('div.description-container.description-body::text').get()
        if description:
            data['description'] = description.strip()

        # Extract oldPrice if it exists
            old_price = response.css('div.oldPrice::text').get()
            if old_price:
                data['old_price'] = old_price.strip()

        # Extracting the photo links
            photo_links = response.css('input#PhotosPath::attr(value)').get()
            if photo_links:
                data['photos'] = photo_links.split('#,!')

        # Now you can insert the data into the MongoDB collection
        collection.insert_one(data)

        print("saved data...", data)

    def more_recent(self, date_str1, date_str2):
        # Assuming the format is "Actualizado el DD/MM/YYYY"
        date_format = "%d/%m/%Y"
        date1 = datetime.datetime.strptime(date_str1.split()[-1], date_format)
        date2 = datetime.datetime.strptime(date_str2.split()[-1], date_format)
        return date1 > date2, date1 >= date2

    def close_spider(self, spider):
        self.client.close()

