import requests
from xml.etree import ElementTree
# import xml.etree.cElementTree as ET
# import urllib2
# from xml.dom.minidom import parseString
# import xml.dom
# from lxml import etree
import re
import json
import time
import sys

class Record:
    def __init__(self, authors, title, institution, date):
        self.authors = authors
        self.title = title
        self.institution = institution
        self.date = date

    def __str__(self):
        border = len(title)*"="
        line = len(title)*"-"
        body = border + "\n" + title + "\n" + line + "\n"
        for author in authors:
            body += author.__str__() + "\n"
        body += line + "\n" + date + "\n" +  border
        return body

class Author:
    def __init__(self, firstname, lastname, affiliation):
        self.firstname = firstname
        self.lastname = lastname
        self.affiliation = affiliation

    def __str__(self):
        return (self.firstname + " " + self.lastname).encode("utf-8")


tempStr = "http://export.arxiv.org/oai2?verb=GetRecord&identifier=oai:arXiv.org:0804.2273&metadataPrefix=arXiv"

longStr = 'http://export.arxiv.org/oai2?verb=ListRecords&metadataPrefix=arXiv'

records = []

someRecords = []

data = {}

debug = False
addAll = True

thousandsOfRecordsToRead = 20

for j in range(0,thousandsOfRecordsToRead):
    print "Begin Request:" + str(j)
    response = requests.get(longStr)
    
    responseText = response.text.encode("utf-8")
    responseText = re.sub(' xmlns="[^"]+"', '', responseText)#Gets rid of namespaces, bless!
    print "End Request:" + str(j) + ":len=" + str(sys.getsizeof(responseText))
    root = ElementTree.fromstring(responseText)

    if sys.getsizeof(responseText) < 1500000:
        break

    if j > 1 and debug: #make sure the resumptions are correct. 
        print responseText

    for record in root.iter("record"):
        authors = []
        title = ""
        date = ""
        id = ""
        category = ""
        for author in record.iter("author"):
            firstname =""
            aff = None
            if(len(author.findall("forenames")) == 0):
                firstname = "WTF"
            else:
                firstname = author.findall("forenames")[0].text

            if(len(author.findall("affiliation")) != 0):
                aff = author.findall("affiliation")[0].text 
            
            lastname = author.findall("keyname")[0].text
            author = Author(firstname, lastname, aff)
            authors.append(author)
        
        for t in record.iter("title"):
            title =  t.text

        for i in record.iter("id"):
            id = i.text
        for d in record.iter("datestamp"):
            date = d.text

        for c in record.iter("categories"):
            category = c.text
        
        tempObj = {}
        tempObj["id"] = id
        tempObj["authors"] = map((lambda x: {"name": str(x), "affiliation": x.affiliation}), authors)
        tempObj["title"] = title
        tempObj["date"] = date
        tempObj["categories"] = category
        if sum(1 if x.affiliation != None else 0 for x in authors) > 0:
            someRecords.append(tempObj)
        records.append(tempObj)
    resumptionToken = ""
    for token in root.iter("resumptionToken"):
        resumptionToken = token.text

    longStr = "http://export.arxiv.org/oai2?verb=ListRecords&resumptionToken=" + resumptionToken
    
    time.sleep(10) #Have to sleep to make consecutive queries. 

addAllTxt = "-all" if addAll else ""

with open('data' + addAllTxt + '.json', 'w') as outfile:
    json.dump(records, outfile)

with open('data' + '.json', 'w') as outfile:
    json.dump(someRecords, outfile)
