import re
import time
from pymysql import *
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import csv
import os
import json
from utils.query import querys

class spider(object):
    def __init__(self,spiderUrl):
        self.spiderUrl = spiderUrl

    def startBrowser(self):
        service = Service('./chromedriver.exe')
        option = webdriver.ChromeOptions()
        option.add_experimental_option('debuggerAddress', 'localhost:9222')
        browser = webdriver.Chrome(service=service, options=option)
        return browser

    def main(self,id):
        browser = self.startBrowser()
        print('详情页面URL'+self.spiderUrl)
        browser.get(self.spiderUrl)
        time.sleep(5)
        types = []
        for type in browser.find_elements(by=By.XPATH,value='//div[@class="glance_tags popular_tags"]/a'):
            if type.text:
                types.append(type.text)
        try:
            summary = browser.find_element(by=By.XPATH, value='//div[@class="game_description_snippet"]').text
        except:
            summary = '无'
        recentlyComment = ''
        allComment = ''
        if re.search('mixed',browser.find_element(by=By.XPATH,value='//*[@id="userReviews"]/div[1]/div[2]/span[1]').get_attribute("class")):
            recentlyComment = '一般'
        else:
            recentlyComment = '好评'
        if re.search('mixed',browser.find_element(by=By.XPATH,value='//*[@id="userReviews"]/div[2]/div[2]/span[1]').get_attribute("class")):
            allComment = '一般'
        else:
            allComment = '好评'

        firm = browser.find_elements(by=By.XPATH,value='//div[@class="summary column"]/a')[0].text
        publisher = browser.find_elements(by=By.XPATH, value='//div[@class="summary column"]/a')[1].text
        imgList = [x.get_attribute('src') for x in browser.find_elements(by=By.XPATH,value='//div[@class="highlight_strip_item highlight_strip_screenshot"]/img')]
        try:
            video = browser.find_element(by=By.XPATH, value='//video').get_attribute('src')
        except:
            video = ''
        querys('UPDATE games SET types = %s,summary = %s,recentlyComment = %s,allComment = %s,firm = %s,publisher =%s,imgList = %s,video=%s WHERE id = %s',
               [json.dumps(types),summary,recentlyComment,allComment,firm,publisher,json.dumps(imgList),video,id])



if __name__ == '__main__':
    gameList = querys('select * from games',[],'select')
    for i in gameList[58:]:
        spiderObj = spider(i[-1])
        spiderObj.main(i[0])



