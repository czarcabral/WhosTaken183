import scrapy
from scrapy.loader import ItemLoader
from scrapy.loader.processors import TakeFirst, MapCompose, Join
from scrapy.crawler import Crawler, CrawlerProcess
from scrapy.exceptions import DropItem
from scrapy import signals, Spider, Item, Field


# define an item class
class ClassItem(Item):
    desc = Field()
    times = Field()
    room = Field()
    prof = Field()


# define an item loader with input and output processors
class ClassItemLoader(ItemLoader):
    default_input_processor = MapCompose(unicode.strip)
    default_output_processor = TakeFirst()
    desc_out = Join()


class ClassPipeline(object):
    def process_item(self, item, spider):
        if item['desc'] and item['times'] and item['room'] and item['prof']:
            return item
        else:
            raise DropItem("Missing field in %s" % item)


class ClassSpider(scrapy.Spider):
    name = "class_search"

    start_urls = [
        'https://pisa.ucsc.edu/class_search/'
    ]

    def __init__(self, term='2188', subject='CMPS', catalog_nbr='183', *args, **kwargs):
        super(ClassSpider, self).__init__(*args, **kwargs)
        self.term = term
        self.subject = subject
        self.catalog_nbr = catalog_nbr

    def parse(self, response):
        print 'self.term = ' + self.term
        return scrapy.FormRequest.from_response(
            response,
            formdata={'binds[:term]': self.term,
                      # 218=yr,2018, 8=fall, 4=summer, 2=spring, 0=winter
                      'binds[:reg_status]': 'all',
                      'binds[:subject]': self.subject,
                      'binds[:catalog_nbr]': self.catalog_nbr},
            callback=self.next_page
        )

    def next_page(self, response):
        open_details = response.xpath('//a[contains(@id,"class_id_")]/@href').extract_first()
        # response.xpath('//a[@id = "class_id_21461"]/@href').extract_first()
        if open_details is not None:
            return response.follow(open_details, callback=self.get_info)

    # extract relevant info from result page
    def get_info(self, response):
        desc_index = None
        meeting_index = None
        headings = response.xpath('//div[@class = "panel-heading panel-heading-custom"]')
        for index, header in enumerate(headings):
            header_text = header.xpath('h2/text()').extract_first().encode('ascii')
            if header_text == 'Description':
                desc_index = index + 1
            if header_text == 'Meeting Information':
                meeting_index = index + 1
        # contents
        desc = response.xpath('//div[@class = "panel-body"]')[desc_index].extract()

        meeting_info = response.xpath('//div[@class = "panel-body"]')[meeting_index]
        days_and_times = meeting_info.xpath('table/tr[2]/td[1]/text()').extract_first()
        room = meeting_info.xpath('table/tr[2]/td[2]/text()').extract_first()
        prof = meeting_info.xpath('table/tr[2]/td[3]/text()').extract_first()

        l = ItemLoader(item=ClassItem(), response=response)
        l.add_value('desc', desc)
        l.add_value('times', days_and_times)
        l.add_value('room', room)
        l.add_value('prof', prof)
        return l.load_item()


def scrape(term='2182', subj='CMPS', nbr='183'):
    items = []

    def collect_items(item, response, spider):
        items.append(item)

    crawler = Crawler(ClassSpider)
    crawler.signals.connect(collect_items, signals.item_scraped)
    process = CrawlerProcess()

    process.crawl(crawler, term=term, subject=subj, catalog_nbr=nbr)
    process.start()  # the script will block here until the crawling is finished
    return items[0]
