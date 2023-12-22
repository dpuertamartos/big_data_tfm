import scrapy
from pymongo import MongoClient
from scrapy.http import Request
from datetime import datetime, timedelta
import time

class AdUpCheckingSpider(scrapy.Spider):
    name = 'ad_up_checking'

    def __init__(self, request_limit=0, pause_time=120):
        # Establish MongoDB connection
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client['pisos']
        self.number_of_flat_checked = 0
        self.number_of_flat_retired = 0
        self.request_limit = int(request_limit)
        self.pause_time = int(pause_time)

    def start_requests(self):
        excluded_collections = ['last_updated_dates', 'amount parsed']
        collections = [col for col in self.db.list_collection_names() if col not in excluded_collections]
        today = datetime.now()
        check_days = [(today + timedelta(days=1)).day, (today - timedelta(days=14)).day]

        for collection in collections:
            for day in check_days:
                print(f"checking collection {collection}, for day {day}")
                pipeline = [
                    {"$match": {"active": True}},
                    {"$project": {"dayOfMonth": {"$dayOfMonth": "$updatedAt"}, "doc": "$$ROOT"}},
                    {"$match": {"dayOfMonth": day}}
                ]
                cursor = self.db[collection].aggregate(pipeline)
                for doc in cursor:
                    link = doc['doc'].get('link')
                    if link:
                        yield Request(link, self.check_url, meta={'original_link': link, 'doc_id': doc['doc']['_id'], 'collection': collection})
                        self.number_of_flat_checked += 1
                        if self.request_limit > 0 and self.number_of_flat_checked % self.request_limit == 0:
                            time.sleep(self.pause_time)

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



    def closed(self, reason):
        # Close MongoDB connection when spider is closed
        self.client.close()
        print(f"Spider closed with reason: {reason}. Total flats checked: {self.number_of_flat_checked}. Total flats retired: {self.number_of_flat_retired}")


