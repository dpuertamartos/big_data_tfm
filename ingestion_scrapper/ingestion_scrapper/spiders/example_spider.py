import scrapy
from .. import database


class PisosSpider(scrapy.Spider):
    name = 'general'
    cities = ['jaen']  # Ciudades a crawlear
    start_urls = ['https://www.pisos.com/venta/pisos-{}/fecharecientedesde-desc/1/'.format(city) for city in cities]

    def __init__(self):
        self.max_page_to_search = 100
        self.db_conn = database.connect_db('pisos.db')
        database.create_table(self.db_conn)

    def parse(self, response):
        if response.status in range(300, 310):
            return

        city = response.url.split('-')[1].split('/')[0]
        for ad in response.css('div.ad-preview'):
            id = ad.xpath('@id').get()
            if not database.check_id_exists(self.db_conn, id):
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

                database.insert_data(self.db_conn, data)
                print("saved data=", data)

        next_page_number = int(response.url.split('/')[-2]) + 1
        next_page_url = '/'.join(response.url.split('/')[:-2]) + '/' + str(next_page_number) + '/'

        current_city_homepage = '/'.join(response.url.split('/')[:-2]) + '/'

        if response.url != current_city_homepage and next_page_number <= self.max_page_to_search:
            yield scrapy.Request(next_page_url, callback=self.parse)

    def close_spider(self, spider):
        self.db_conn.close()

