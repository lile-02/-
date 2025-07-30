from utils.getPublicData import *
from utils.query import querys
from datetime import datetime


def getHomeData():
    maxUserLen = len(getAllUser())
    maxGames = len(getAllGames())

    gamesList = getAllGames()
    allUserList = getAllUser()
    minDiscountTitle = ''
    minDiscount = 100
    typeDic = {}
    timeDic = {}
    for i in gamesList:
        if int(i[6]) < minDiscount:
            minDiscount = int(i[6])
            minDiscountTitle = i[1]
        for j in i[9]:
            if typeDic.get(j, -1) == -1:
                typeDic[j] = 1
            else:
                typeDic[j] += 1
        if timeDic.get(i[3], -1) == -1:
            timeDic[i[3]] = 1
        else:
            timeDic[i[3]] += 1

    gamesListData = list(gamesList)
    typeSort = list(sorted(typeDic.items(), key=lambda x: x[1], reverse=True))
    timeSort = list(sorted(timeDic.items(), key=lambda date: date[1], reverse=True))
    # 饼图类型
    typeRes = []
    for i in typeSort:
        typeRes.append({
            'name': i[0],
            'value': i[1]
        })
    print(typeRes)

    def get_timestamp(date):
        try:
            datetime.strptime(date, "%Y 年 %m 月 %d 日").timestamp()
            return datetime.strptime(date, "%Y 年 %m 月 %d 日").timestamp()
        except:
            return 0

    gamesTimeSort = sorted(gamesList, key=lambda date: get_timestamp(date[3]), reverse=True)
    xData = []
    yData = []
    for i in timeSort:
        xData.append(i[0])
        yData.append(i[1])
    userDic = {}
    for i in allUserList:
        if userDic.get(i[-1], -1) == -1:
            userDic[i[-1]] = 1
        else:
            userDic[i[-1]] += 1
    userListData = []
    for key, value in userDic.items():
        userListData.append({
            'name': key,
            'value': value
        })
    print(userListData)
    return typeSort[0][0], minDiscountTitle, maxUserLen, maxGames, xData[:10], yData[:10], gamesTimeSort[
                                                                                           :10], gamesListData, userListData, typeRes[
                                                                                                                              :10]


def getPriceCharData(year):
    gameList = getAllGames()
    x1Data = ['0-100元', '100-200元', '200-300元', '300-500元', '500-600元', '600及以上']
    y1Data = [0 for x in range(len(x1Data))]
    x2Data = ['0-10元', '10-50元', '50-100元', '100-150元', '150-200元', '200及以上']
    y2Data = [0 for x in range(len(x2Data))]
    for i in gameList:
        if i[3][:4] == year:
            if int(i[7]) < 100:
                y1Data[0] += 1
            elif int(i[7]) < 200:
                y1Data[1] += 1
            elif int(i[7]) < 300:
                y1Data[2] += 1
            elif int(i[7]) < 500:
                y1Data[3] += 1
            elif int(i[7]) < 600:
                y1Data[4] += 1
            else:
                y1Data[5] += 1
        if i[3][:4] == year:
            if int(i[8]) < 10:
                y2Data[0] += 1
            elif int(i[8]) < 50:
                y2Data[1] += 1
            elif int(i[8]) < 100:
                y2Data[2] += 1
            elif int(i[8]) < 150:
                y2Data[3] += 1
            elif int(i[8]) < 200:
                y2Data[4] += 1
            else:
                y2Data[5] += 1
    return x1Data, y1Data, x2Data, y2Data


def getTypeList():
    typeDic = {}
    gamesList = getAllGames()
    for i in gamesList:
        for j in i[9]:
            if typeDic.get(j, -1) == -1:
                typeDic[j] = 1
            else:
                typeDic[j] += 1
    typeSort = list(sorted(typeDic.items(), key=lambda x: x[1], reverse=True))
    print(typeSort)
    x2Data = []
    y2Data = []
    for i in typeSort:
        x2Data.append(i[0])
        y2Data.append(i[1])
    return [x[0] for x in typeSort][:10], x2Data, y2Data


def getTypeChar(defaultType):
    typeDic = {}
    gamesList = getAllGames()
    x1Data = []
    for i in gamesList:
        flag = False
        for j in i[9]:
            if j == defaultType: flag = True
            if typeDic.get(j, -1) == -1:
                typeDic[j] = 1
            else:
                typeDic[j] += 1
        if flag:
            x1Data.append(int(i[6]) / 10)
    x1Data = list(set(x1Data))
    y1Data = [0 for x in range(len(x1Data))]
    for i in gamesList:
        flag = False
        for j in i[9]:
            if j == defaultType: flag = True
        if flag:
            for index, j in enumerate(x1Data):
                if j == (int(i[6]) / 10):
                    y1Data[index] += 1
    return x1Data, y1Data


def getRateCharData():
    gamesList = getAllGames()
    rateOneList = [
        {
            'name': '好评',
            'value': 0
        },
        {
            'name': '一般',
            'value': 0
        }
    ]
    rateTwoList = [
        {
            'name': '好评',
            'value': 0
        },
        {
            'name': '一般',
            'value': 0
        }
    ]
    for i in gamesList:
        if i[5] == '一般':
            rateOneList[1]['value'] += 1
        else:
            rateOneList[0]['value'] += 1
        if i[12] == '一般':
            rateTwoList[1]['value'] += 1
        else:
            rateTwoList[0]['value'] += 1
    return rateOneList,rateTwoList

def getFirmCharData():
    gamesList = getAllGames()
    firmDic = {}
    publishDic = {}
    for i in gamesList:
        if firmDic.get(i[13],-1) == -1:
            firmDic[i[13]] = 1
        else:
            firmDic[i[13]] += 1

        if publishDic.get(i[14],-1) == -1:
            publishDic[i[14]] = 1
        else:
            publishDic[i[14]] += 1

    return list(firmDic.keys()),list(firmDic.values()),list(publishDic.keys()),list(publishDic.values())

def getAnotherCharData():
    gamesList = getAllGames()
    cDic = {}
    for i in gamesList:
        for j in i[4]:
            if cDic.get(j,-1) == -1:
                cDic[j] = 1
            else:
                cDic[j] += 1
    resData = []
    for k,v in cDic.items():
        resData.append({
            'name':k,
            'value':v
        })
    return resData
