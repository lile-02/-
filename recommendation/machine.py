import numpy as np
from sklearn.metrics.pairwise import  cosine_similarity
import os

from utils.query import querys
# user_ratings = {
#     "admin":{"赛博朋克":1},
#     "userA":{"赛博朋克":1,"艾尔登法环":2}
# }

def getUser_ratings():
    user_ratings = {}
    userList = list(querys('select * from user', [], 'select'))  # 所有用户
    historyList = list(querys('select * from history', [], 'select'))  # 所有历史记录

    # 先初始化所有用户到字典中（即使没有历史记录）
    for user in userList:
        userName = user[1]
        user_ratings[userName] = {}  # 初始化空字典

    # 再填充有历史记录的用户的评分
    for history in historyList:
        userId = history[0]  # 假设 history 表的第0列是 user_id
        gameID = history[1]
        try:
            # 根据 user_id 查用户名
            userName = querys('select username from user where id = %s', [userId], 'select')[0][0]
            # 根据 game_id 查游戏名
            gameName = querys('select title from games where id = %s', [gameID], 'select')[0][0]
            # 历史记录次数（假设 history 表的第3列是次数）
            historyCount = history[3]
            # 更新用户的评分
            user_ratings[userName][gameName] = historyCount
        except Exception as e:
            print(f"处理历史记录时出错: {e}")
            continue

    print("用户评分数据:", user_ratings)
    return user_ratings

def user_basee_collaborative_filtering(user_name,user_ratings,top_n=3):
    #获取目标用户的数据
    target_user_ratings = user_ratings[user_name]

    #保存相似度得分
    user_similarity_scores = {}

    #目标用户转为numpy数组
    target_user_ratings_list = np.array([
        rating for _ ,rating in target_user_ratings.items()
    ])

    #计算相似得分
    for user,rating in user_ratings.items():
        if user == user_name:
            continue
        #将其他用户数据也转为numpy数组
        user_ratings_list = np.array([rating.get(item,0) for item in target_user_ratings])
        #计算余弦相似度
        similarity_score = cosine_similarity([user_ratings_list],[target_user_ratings_list])[0][0]
        user_similarity_scores[user] = similarity_score
    sorted_similar_user = sorted(user_similarity_scores.items(),key=lambda x:x[1],reverse=True)
    print(sorted_similar_user)

    #选择topn个相似用户作为推荐结果
    recommended_items = set()
    for similar_user,_ in sorted_similar_user[:top_n]:
        recommended_items.update(user_ratings[similar_user].keys())
    #过滤
    recommended_items = [item for item in recommended_items if item not in target_user_ratings]
    print(recommended_items)
    return recommended_items



if __name__ == '__main__':
    user_name ='admin'
    user_ratings = getUser_ratings()
    user_basee_collaborative_filtering(user_name,user_ratings)