import scrapy
import pymongo
import datetime
from ..config import mongodb_uri
import re

OLD_DATE = "Anuncio 15/10/1991"


class PisosSpider(scrapy.Spider):
    name = 'general'

    cities = ['a_coruna', 'alava_araba', 'albacete', 'alicante', 'almeria', 'andorra', 'asturias', 'avila', 'badajoz',
              'barcelona', 'burgos', 'caceres', 'cadiz', 'cantabria', 'castellon_castello', 'ceuta', 'ciudad_real',
              'cordoba', 'cuenca', 'girona', 'granada', 'guadalajara', 'guipuzcoa_gipuzkoa', 'huelva', 'huesca',
              'islas_baleares_illes_balears', 'jaen', 'la_rioja', 'las_palmas', 'leon', 'lleida', 'lugo', 'madrid',
              'malaga', 'melilla', 'murcia', 'navarra_nafarroa', 'ourense', 'palencia', 'pontevedra', 'salamanca',
              'santa_cruz_de_tenerife', 'segovia', 'sevilla', 'soria', 'tarragona', 'teruel', 'toledo', 'valencia',
              'valladolid', 'vizcaya_bizkaia', 'zamora', 'zaragoza']


    #Ciudades a crawlear
    start_urls = ['https://www.pisos.com/venta/pisos-{}/fecharecientedesde-desc/1/'.format(province) for province in cities]

    should_continue_scraping = {}
    latest_dates_per_province_db = {}
    latest_dates_per_province_current_execution = {}

    def __init__(self, update_mode=False, *args, **kwargs):
        self.update_mode = update_mode
        self.max_page_to_search = 100
        self.client = pymongo.MongoClient(mongodb_uri)  # Adjust the connection string if needed
        self.db = self.client["pisos"]  # Change to your database name
        self.last_updated_dates_collection = self.client['pisos']['last_updated_dates']
        for province in self.cities:
            self.should_continue_scraping[province] = True
            self.latest_dates_per_province_db[province] = self.get_last_known_date(province)
            self.latest_dates_per_province_current_execution[province] = OLD_DATE

        self.flats_stored_counter = 0
        super(PisosSpider, self).__init__(*args, **kwargs)

    def get_last_known_date(self, province):
        record = self.last_updated_dates_collection.find_one({"province": province})
        if record:
            return record.get("last_updated_date", OLD_DATE)
        return OLD_DATE  # Return an OLD_DATE

    def parse(self, response):
        if response.status in range(300, 310):
            return

        province = response.url.split('-')[1].split('/')[0]
        collection = self.db[province]  # Use the province's name as the collection name

        for ad in response.css('div.ad-preview'):
            id = ad.xpath('@id').get()
            data = {
                'id': id,
                'title': ad.css('a.ad-preview__title::text').get(),
                'location': ad.css('p.p-sm::text').get(),
                'province': province,
                'price': ad.css('span.ad-preview__price::text').get().strip(),
                'description': ad.css('p.ad-preview__description::text').get(),
                'link': response.urljoin(ad.css('a.ad-preview__title::attr(href)').get()),
            }
            # Make a request to the detailed page using the link and pass the current data as meta
            yield scrapy.Request(data['link'], callback=self.parse_detail, meta={'data': data, 'province': province})

        next_page_number = int(response.url.split('/')[-2]) + 1
        next_page_url = '/'.join(response.url.split('/')[:-2]) + '/' + str(next_page_number) + '/'

        current_province_homepage = '/'.join(response.url.split('/')[:-2]) + '/'

        if self.should_continue_scraping[province] and response.url != current_province_homepage and next_page_number <= self.max_page_to_search:
            yield scrapy.Request(next_page_url, callback=self.parse)

    def parse_detail(self, response):
        data = response.meta['data']  # Get the previously extracted data passed as meta
        province = response.meta['province']  # Get the province name passed as meta
        collection = self.db[province]  # Use the province as the collection name

        updated_date_element = response.css('p.last-update__date::text').get()
        if updated_date_element:
            updated_date = updated_date_element.strip()
        else:
            print(f'CAREFUL!!--------------------------------------------------------------------------- Updated date not found for URL: {response.url}')
            if self.update_mode:
                return
            updated_date = OLD_DATE


        current_last_known_date = self.latest_dates_per_province_db.get(province, OLD_DATE)

        print("update_date ->", updated_date, current_last_known_date)
        is_more_recent_than_db, is_equal_than_db = self.more_recent(updated_date, current_last_known_date)
        print("is more_recent -> ", is_more_recent_than_db, "is equal -> ", is_equal_than_db)

        if self.update_mode:
            if not (is_equal_than_db or is_more_recent_than_db):
                self.should_continue_scraping[province] = False
                return
            elif is_equal_than_db and collection.find_one({"id": data['id']}):
                #when we are in the same day that last update, this will prevent to add ads that were already added
                #this is because update_mode search until 1 day before last update
                #for example last update was 07/08/2023 but we do not know what time so we will scrap until the first 06/08/2023 flat,
                #therefore for 07/08/2023 (is_equal) we have to check if the id is in the colection already
                return

            current_execution_last_date = self.latest_dates_per_province_current_execution.get(province, OLD_DATE)
            is_more_recent_than_current, _ = self.more_recent(updated_date, current_execution_last_date)
            if is_more_recent_than_current:
                self.latest_dates_per_province_current_execution[province] = updated_date
                if is_more_recent_than_db:
                    self.update_date_in_db(self.last_updated_dates_collection, province, updated_date)
                    #do not update the dictionary since we want to retain the original date of the database to not surpass it
        else:
            # when not in update mode
            # if the updated_date is more_recent_than_db update the db and the dictionary
            if is_more_recent_than_db:
                self.update_date_in_db(self.last_updated_dates_collection, province, updated_date)
                self.latest_dates_per_province_db[province] = updated_date

        data['updated_date'] = updated_date

        # Extract characteristics from the provided HTML structure
        try:
            features = response.css('div.details__block .features-container .features__feature')
            for feature in features:
                characteristic_name = feature.css('.features__label::text').get()
                characteristic_value = feature.css('.features__value::text').get()

                if characteristic_name:
                    characteristic_name = characteristic_name.strip().replace(":", "").replace(" ", "_").lower()
                    characteristic_value = characteristic_value.strip() if characteristic_value else "Si"  # Default value for features without specific value

                    data[characteristic_name] = characteristic_value
        except Exception as e:
            print(f'could not ingest characteristics, error {e}')

        # Extract full description
        try:
            description = response.css('div.description__content::text').get()
            if description:
                    data['description'] = description.strip()
        except Exception as e:
            print(f'could not ingest full description, error {e}')

        #Extract old price in legacy mode (updated web does not show old price, only the difference).
        #We extract in legacy mode to not affect transformation later
        try:
            old_price_difference = response.css('div.price__drop::text').get()
            if old_price_difference:
                    data['old_price'] = old_price_difference.strip()
                    price_to_int = int(re.sub('[^0-9]', '', data.get("price")))
                    old_price_difference_to_int = int(re.sub('[^0-9]', '', data.get("old_price").split("€")[0]))
                    data['old_price'] = str(price_to_int+old_price_difference_to_int)+" €"
        except Exception as e:
            print(f'could not ingest old_price, error {e}')

        # Extracting photo links
        try:
            photo_urls = []
            thumbnail_elements = response.css('div.masonry__content.media-thumbnail')
            for thumbnail in thumbnail_elements:
                photo_url = thumbnail.css('picture img::attr(src)').get()
                if not photo_url:
                    photo_url = thumbnail.css('picture img::attr(data-src)').get()
                if photo_url:
                    photo_urls.append(photo_url.strip())

            if photo_urls:
                data['photos'] = photo_urls
        except Exception as e:
            print(f'Could not ingest photo links, error: {e}')

        data['active'] = True
        data['createdAt'] = datetime.datetime.now()

        # Check for an existing entry with the same ID
        existing_entry = collection.find_one({"id": data['id']})

        if existing_entry:
            data['updatedAt'] = datetime.datetime.now()  # Establecer la fecha de actualización
            version = existing_entry.get('version', 0)  # Obtener la versión actual o 0 si no está definida
            data['version'] = version + 1
            collection.update_one({"_id": existing_entry['_id']}, {"$set": data})
            print("Actualizada la entrada existente con ID:", data['id'])
        else:
            data['createdAt'] = data['updatedAt'] = datetime.datetime.now()  # Establecer las fechas de creación y actualización
            data['version'] = 0
            collection.insert_one(data)
            print("Insertada nueva entrada con ID:", data['id'])

        self.flats_stored_counter += 1
        print("saved data...", data)


    def update_date_in_db(self, collection, province, updated_date):
        collection.update_one(
            {"province": province},
            {"$set": {"last_updated_date": updated_date}},
            upsert=True  # If the province doesn't exist, it will create a new entry
        )

    def more_recent(self, date_str1, date_str2):
        # Assuming the format is "Actualizado el DD/MM/YYYY"
        date_format = "%d/%m/%Y"
        date1 = datetime.datetime.strptime(date_str1.split()[-1], date_format)
        date2 = datetime.datetime.strptime(date_str2.split()[-1], date_format)
        return date1 > date2, date1 == date2

    def closed(self, reason):
        # This method is called once when the spider closes
        print(f"Spider closed with reason: {reason}. Total flats stored: {self.flats_stored_counter}")

        # Update the amount_parsed collection with the count and date
        self.db['amount_parsed'].insert_one({
            'date': datetime.datetime.now(),
            'count': self.flats_stored_counter
        })

        # Close the MongoDB connection
        self.client.close()



