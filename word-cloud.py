import jieba
from matplotlib import pylab as plt
from wordcloud import WordCloud
import numpy as np
from PIL import Image
from pymysql import *

def get_img(field,targetImage,resImage):
    #连接数据库
    conn = connect(host='localhost', user='root', password='root', database='steamdata', port=3306,
                   charset='utf8mb4')
    cursor = conn.cursor()
    sql = f"select {field} from games"
    cursor.execute(sql)
    data = cursor.fetchall()

    text = ''
    for i in data:
        if i[0] != '':
            tagArr = i
            for j in tagArr:
                text += j
    cursor.close()
    conn.close()
    data_cut = jieba.cut(text,cut_all=False)
    string = ' '.join(data_cut)

    #图片
    img = Image.open(targetImage)
    img_arr = np.array(img)
    wc = WordCloud(
        font_path='STHUPO.TTF',
        mask=img_arr,
        background_color='white'
    )
    wc.generate_from_text(string)

    #绘制图片
    fig = plt.figure(1)
    plt.imshow(wc)
    plt.axis('off')
    plt.savefig(resImage,dpi=800,bbox_inches='tight',pad_inches=-0.1)

get_img("summary","./static/steam.jpg","./static/image/summaryCloud.png")




