import scrapy

class ExampleSpider(scrapy.Spider):
    name = 'example'
    start_urls = ['https://www.pisos.com']

    def parse(self, response):
        self.log('Visited %s' % response.url)
