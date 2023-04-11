from celery import shared_task
import pandas as pd
import os
from flask import current_app
import matplotlib

matplotlib.use('agg')

@shared_task(ignore_result=False,name='tasks.add')
def add(a: int, b: int) -> int:
    return a + b



@shared_task(ignore_result=False,name='tasks.upload')
def upload():
    return 100


@shared_task(ignore_result=False,name='tasks.process')
def process(filename):
    try:
        df = pd.read_csv(os.path.join(current_app.config['UPLOAD_FOLDER'],filename))
        stats = {}
        stats['col_num'] = len(df)
        stats['col_names'] = list(df.columns)
        counts = df.isna().sum()
        percentages = round(df.isna().mean() * 100, 1)
        percentages = percentages.where(percentages > 0.0).dropna()
        null_values = pd.concat([counts, percentages], axis=1, keys=["count", "%"])
        stats['null_percentages'] = null_values.to_json()
        fig = percentages.plot(kind='bar',figsize=(20,10)).get_figure()
        fig.savefig(os.path.join(current_app.config['UPLOAD_FOLDER'],'.jpg'))
        return stats   
    except:
        return False


