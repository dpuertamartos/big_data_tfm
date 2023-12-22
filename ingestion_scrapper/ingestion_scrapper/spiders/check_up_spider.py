import scrapy
from pymongo import MongoClient
from scrapy.http import Request
from datetime import datetime

class AdUpCheckingSpider(scrapy.Spider):
    name = 'ad_up_checking'

    def __init__(self):
        # Establish MongoDB connection
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client['pisos']
        self.number_of_flat_checked = 0
        self.number_of_flat_retired = 0

    def start_requests(self):
        excluded_collections = ['last_updated_dates', 'amount parsed']
        collections = [col for col in self.db.list_collection_names() if col not in excluded_collections]

        for collection in collections:
            print(f"checking collection {collection}")
            for doc in self.db[collection].find():
                link = doc.get('link')
                if link:
                    yield Request(link, self.check_url, meta={'original_link': link, 'doc_id': doc['_id'], 'collection': collection})

    def check_url(self, response):
        original_link = response.meta['original_link']
        doc_id = response.meta['doc_id']
        collection = response.meta['collection']

        if response.url != original_link:
            print(f'Ad retired for URL: {original_link}')
            # Update the document in MongoDB
            self.db[collection].update_one(
                {'_id': doc_id},
                {
                    '$set': {'active': False, 'updatedAt': datetime.now()},
                    '$inc': {'version': 1}
                }
            )
            self.number_of_flat_retired += 1

        self.number_of_flat_checked += 1

    def closed(self, reason):
        # Close MongoDB connection when spider is closed
        self.client.close()
        print(f"Spider closed with reason: {reason}. Total flats checked: {self.number_of_flat_checked}. Total flats retired: {self.number_of_flat_retired}")

# Additional methods or error handling as needed
