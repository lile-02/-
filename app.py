import json

from flask import Flask,request,render_template,session,redirect
import time
import sys
import io
from utils.query import querys
from utils.getPublicData import *
from utils.getPageData import *
from utils.getHistoryData import *
from recommendation.machine import *
app = Flask(__name__)
app.secret_key = 'This is secret Key'

sys.stdout = io.TextIOWrapper(sys.stdout.buffer,encoding='utf-8')
sys.stdout = sys.stderr
@app.route('/')
def hello_world():  # put application's code here
    return redirect('/login')

@app.route('/login',methods=['GET','POST'])
def login():
    if request.method == 'POST':
        request.form = dict(request.form)
        print(request.form)
        def filter_fns(item):
            return request.form['username'] in item and request.form['password'] in item
        users = querys('select * from user',[],'select')
        login_success = list(filter(filter_fns,users))
        if not len(login_success):
            return '用户名或密码错误'

        session['username'] = request.form['username']
        return redirect('/home')

        return render_template('./pages-login.html')
    else:
        return render_template('./pages-login.html')

@app.route('/register',methods=['GET','POST'])
def register():
    if request.method == 'POST':
        request.form = dict(request.form)
        if request.form['username'] and request.form['password'] and request.form['passwordChecked']:
            if request.form['password'] != request.form['passwordChecked']:
                return '两次密码不相符'
            else:
                def filter_fn(item):
                    return request.form['username'] in item
            users = querys('select * from user', [], 'select')
            filter_list = list(filter(filter_fn, users))
            if len(filter_list):
                return '该用户名已被注册'
            else:
                querys('insert into user(username,password) values (%s,%s)',
                       [request.form['username'], request.form['password']])
        else:
            return '用户名或者密码为空'
        return redirect('/login')

    else:
        return render_template('./pages-register.html')

@app.route('/home',methods=['GET','POST'])
def home():
    username = session['username']
    typeSort,minDiscountTitle,maxUserLen,maxGames,xData,yData,gamesTimeSort,gamesListData,userListData,typeRes = getHomeData()
    return render_template('index.html',
                           username=username,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames,
                           xData=xData,
                           yData=yData,
                           gamesTimeSort=gamesTimeSort,
                           gamesListData=gamesListData,
                           userListData=userListData,
                           typeRes=typeRes
                           )


@app.route('/tableData',methods=['GET','POST'])
def tableData():
    username = session['username']
    categoryList = getAllGames()
    typeSort,minDiscountTitle,maxUserLen,maxGames = getHeadData()
    return render_template('tableData.html',
                           username=username,
                           categoryList=categoryList,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames
                           )
@app.route('/addHistory/<int:gameId>',methods=['GET','POST'])
def addHistory(gameId):
    username = session['username']
    userId = querys('select id from user where username = %s',[username],'select')[0][0]
    gameID = querys('select id from games where id = %s', [gameId], 'select')[0][0]
    gameUrl = querys('select detailLink from games where id = %s',[gameId],'select')[0][0]
    print(userId,gameID)
    getData(userId,gameID)
    return redirect(gameUrl)

@app.route('/search', methods=['GET', 'POST'])
def search():
    username = session['username']
    typeSort, minDiscountTitle, maxUserLen, maxGames = getHeadData()
    if request.method == 'POST':
        searchWord = dict(request.form)['searchIpt']
        def filter_fn(item):
            if item[1].find(searchWord) == -1:
                return False
            else:
                return True
        data = list(filter(filter_fn,getAllGames()))
        print(data)
        return render_template('search.html',
                           username=username,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames,
                           data=data
                           )
    else:
        return render_template('search.html',
                           username=username,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames
                           )

@app.route('/priceChar', methods=['GET', 'POST'])
def priceChar():
    username = session['username']
    typeSort, minDiscountTitle, maxUserLen, maxGames = getHeadData()
    yearList = ['2023','2022','2021','2020','2019','2018','2017','2016']
    defaultYear = yearList[0]

    if request.method == 'POST':
        year = request.form.get('year')
        defaultYear = year
        x1Data, y1Data, x2Data, y2Data = getPriceCharData(defaultYear)
        resData=[]
        for index,x in enumerate(x2Data):
            resData.append([x,y2Data[index]])

        return render_template('priceChar.html',
                               username=username,
                               typeSort=typeSort,
                               minDiscountTitle=minDiscountTitle,
                               maxUserLen=maxUserLen,
                               maxGames=maxGames,
                               yearList=yearList,
                               defaultYear=defaultYear,
                               x1Data=x1Data,
                               y1Data=y1Data,
                               resData=resData
                           )
    else:
        x1Data, y1Data, x2Data, y2Data = getPriceCharData(defaultYear)
        resData = []
        for index, x in enumerate(x2Data):
            resData.append([x, y2Data[index]])
        return render_template('priceChar.html',
                               username=username,
                               typeSort=typeSort,
                               minDiscountTitle=minDiscountTitle,
                               maxUserLen=maxUserLen,
                               maxGames=maxGames,
                               yearList=yearList,
                               defaultYear=defaultYear,
                               x1Data=x1Data,
                               y1Data=y1Data,
                               resData=resData
                               )

@app.route('/typeChar', methods=['GET', 'POST'])
def typeChar():
    username = session['username']
    typeSort, minDiscountTitle, maxUserLen, maxGames = getHeadData()
    typeList,x2Data,y2Data = getTypeList()
    defaultType = typeList[0]
    if request.args.get('type'):
        defaultType = request.args.get('type')
        x1Data, y1Data = getTypeChar(defaultType)
        return render_template('typeChar.html',
                           username=username,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames,
                           typeList=typeList,
                           defaultType=defaultType,
                               x1Data=x1Data,
                               y1Data=y1Data,
                               x2Data=x2Data,
                               y2Data=y2Data
                           )
    else:
        x1Data, y1Data = getTypeChar(defaultType)
        return render_template('typeChar.html',
                           username=username,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames,
                           typeList=typeList,
                           defaultType=defaultType,
                               x1Data=x1Data,
                               y1Data=y1Data,
                               x2Data=x2Data,
                               y2Data=y2Data
                           )

@app.route('/rateChar', methods=['GET', 'POST'])
def rateChar():
    username = session['username']
    typeSort, minDiscountTitle, maxUserLen, maxGames = getHeadData()
    rateOneList,rateTwoList = getRateCharData()
    return render_template('rateChar.html',
                           username=username,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames,
                           rateOneList=rateOneList,
                           rateTwoList=rateTwoList
                           )

@app.route('/firmChar', methods=['GET', 'POST'])
def firmChar():
    username = session['username']
    typeSort, minDiscountTitle, maxUserLen, maxGames = getHeadData()
    x1Data,y1Data,x2Data,y2Data = getFirmCharData()
    return render_template('firmChar.html',
                           username=username,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames,
                           x1Data=x1Data,
                           y1Data=y1Data,
                           x2Data=x2Data,
                           y2Data=y2Data
                           )

@app.route('/anotherChar', methods=['GET', 'POST'])
def anotherChar():
    username = session['username']
    typeSort, minDiscountTitle, maxUserLen, maxGames = getHeadData()
    resData = getAnotherCharData()
    return render_template('anotherChar.html',
                           username=username,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames,
                           resData=resData
                           )

@app.route('/titleCloud', methods=['GET', 'POST'])
def titleCloud():
    username = session['username']
    typeSort, minDiscountTitle, maxUserLen, maxGames = getHeadData()
    return render_template('titleCloud.html',
                           username=username,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames,
                           )



@app.route('/summaryCloud', methods=['GET', 'POST'])
def summaryCloud():
    username = session['username']
    typeSort, minDiscountTitle, maxUserLen, maxGames = getHeadData()
    return render_template('summaryCloud.html',
                           username=username,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames,
                           )


@app.route('/recommendation', methods=['GET', 'POST'])
def recommendation():
    username = session['username']
    typeSort, minDiscountTitle, maxUserLen, maxGames = getHeadData()
    user_ratings = getUser_ratings()  # 获取所有用户的评分数据

    # 检查用户是否在评分数据中
    if username not in user_ratings:
        # 如果用户没有历史记录，返回热门游戏作为默认推荐
        # 假设 getHotGames() 是获取热门游戏的函数，需自行实现
        recommended_items = getHotGames()
    else:
        # 有历史记录，正常生成推荐
        recommended_items = user_basee_collaborative_filtering(username, user_ratings)

    # 后续处理推荐数据（和之前相同）
    recommendedData = []
    for item in recommended_items:
        try:
            dataList = querys('select * from games where title = %s', [item], 'select')[0]
            dataList = list(dataList)
            dataList[-3] = json.loads(dataList[-3])
            recommendedData.append(dataList)
        except:
            continue  # 忽略查询失败的游戏

    return render_template('recommendation.html',
                           username=username,
                           typeSort=typeSort,
                           minDiscountTitle=minDiscountTitle,
                           maxUserLen=maxUserLen,
                           maxGames=maxGames,
                           recommendedData=recommendedData
                           )

@app.route('/loginOut', methods=['GET', 'POST'])
def loginOut():
    session.clear()
    return redirect('/login')
if __name__ == '__main__':
    app.run()
