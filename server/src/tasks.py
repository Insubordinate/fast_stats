from slack_sdk.webhook import WebhookClient
from celery import shared_task
import pandas as pd
import os
from flask import current_app
import matplotlib
import requests
import sqlite3

matplotlib.use('agg')




import requests



@shared_task(ignore_result=False, name='tasks.process')
def process(id,unique_id):
    try:

        ### Process the CSV
        df = pd.read_csv(os.path.join(current_app.config['UPLOAD_FOLDER'], id))
        
        stats = {}
        stats['col_num'] = len(df)
        stats['col_names'] = list(df.columns)
        counts = df.isna().sum()
        
        percentages = round(df.isna().mean() * 100, 1)
        percentages = percentages.where(percentages > 0.0).dropna()
        null_values = pd.concat([counts, percentages],
                                axis=1, keys=["count", "%"])
        stats['null_percentages'] = null_values.to_json()
        
        fig = percentages.plot(kind='bar', figsize=(20, 10)).get_figure()
        
        flag_raised = True if len(percentages) > len(df)/2 else False
        
        message_text = 'DANGER HIGH NUMBER OF MISSING DATA' if flag_raised else 'GOOD DATA'
        

        ###Update DB with Condition

        conn = get_db_connection()
        update_row_with_status(conn,unique_id,flag_raised)




        ### Save the graph of the stats
        path_to_save = os.path.join(
            current_app.config['UPLOAD_FOLDER'])+f'/{id[:-4]}'
        fig.savefig(path_to_save)
        path_to_save = path_to_save +".png"



        ### Make Slack Messages
        thread_number = issue_slack_message(path_to_save)
        upload_to_slack(thread_number,path_to_save,message_text) 




        return 100
    
    except Exception as e:
        return e








def issue_slack_message(id_of_image):
    token = "Bearer xoxb-5113916375905-5117860592577-rXyRKiUUYfbOCtLjCXJjSBvT"
    channel = "C052Z4XBMNF"
    url = "https://slack.com/api/chat.postMessage"
    headers = {"Content-Type": 'application/json; charset=utf-8',
               "Authorization": token}
    data = {
        'channel': 'C052Z4XBMNF',
        'text': f'Stats on {id_of_image}',
    }
    res = requests.post(url, headers=headers, json=data)
    return res.json()['ts']


def upload_to_slack(thread,image_location,message_text):
    token = "Bearer xoxb-5113916375905-5117860592577-rXyRKiUUYfbOCtLjCXJjSBvT"
    url = "https://slack.com/api/files.upload"
    headers = {"Authorization": token}
    fp = image_location
    files = {'file': open(fp, 'rb')}
    data = {
        'channels': 'C052Z4XBMNF',
        'initial_comment': message_text,
        'thread_ts':thread
    }

    res = requests.post(url, headers=headers, data=data, files=files)
    return res.json()





def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn


def update_row_with_status(conn,id,flag_raised):
        conn = get_db_connection()
        conn.execute("UPDATE data SET flag_raised=? WHERE id=? ",(flag_raised,id))
        conn.commit()
        conn.close()