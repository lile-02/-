from utils.query import *

def getData(userId,gameId):
    hisData = querys('select id from history where game_id= %s AND user_id = %s',[gameId,userId],'select')
    if len(hisData):
        querys('UPDATE history SET count = count + 1 WHERE game_id= %s AND user_id = %s',[gameId,userId])
    else:
        querys('INSERT INTO history(game_id,user_Id,count) VALUES (%s,%s,%s)',[gameId,userId,1])
