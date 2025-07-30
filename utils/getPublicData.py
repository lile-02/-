from utils.query import querys
import json

def getAllGames():
    gameList = querys('select * from games',[],'select')
    def map_fn(item):
        item = list(item)
        item[4] = json.loads(item[4])
        item[9] = json.loads(item[9])
        item[15] = json.loads(item[15])
        item[8] = round(float(item[8]),1)
        return item
    gameList = list(map(map_fn,gameList))
    return gameList

def getAllUser():
    userList = querys('select * from user',[],'select')
    return userList

def getHeadData():
    maxUserLen = len(getAllUser())
    maxGames = len(getAllGames())

    gamesList = getAllGames()
    allUserList = getAllUser()
    minDiscountTitle = ''
    minDiscount = 100
    typeDic = {}
    for i in gamesList:
        if int(i[6]) < minDiscount:
            minDiscount = int(i[6])
            minDiscountTitle = i[1]
        for j in i[9]:
            if typeDic.get(j, -1) == -1:
                typeDic[j] = 1
            else:
                typeDic[j] += 1
    typeSort = list(sorted(typeDic.items(), key=lambda x: x[1], reverse=True))
    return typeSort[0][0],minDiscountTitle,maxUserLen,maxGames
