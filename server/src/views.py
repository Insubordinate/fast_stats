from celery.result import AsyncResult
from flask import Blueprint
from flask import request
from werkzeug.utils import secure_filename
import os
from flask import current_app
import sqlite3
import uuid
from . import tasks
import json

bp = Blueprint("tasks", __name__, url_prefix="/tasks")


def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn




@bp.get("/result/<id>")
def result(id):
    result = AsyncResult(id)
    ready = result.ready()
    return {
        "ready": ready,
        "successful": result.successful() if ready else None,
        "value": result.get() if ready else result.result,
    }


@bp.get("/info")
def info():
    conn = get_db_connection()
    res = conn.execute("SELECT * FROM data")
    data = res.fetchall()
    results = [tuple(row) for row in data]
    print(results)
    results = json.dumps(results)
    conn.close()
    return results
    



@bp.post("/upload")
def upload():
    file = request.files['file']
    if file:

        ## CREATE THE UNIQUE ID
        unique_id = str(uuid.uuid1())
        unique_id_with_csv = unique_id + ".csv"
        file_location = os.path.join(current_app.config['UPLOAD_FOLDER'],unique_id_with_csv)




        file.save(file_location)

        ## ENTRY INTO THE DB
        conn = get_db_connection()
        conn.execute("INSERT INTO data(id,filename,location) VALUES (?,?,?)",(unique_id,unique_id_with_csv,file_location))
        conn.commit()
        conn.close()


        
        result = tasks.process.delay(unique_id_with_csv,unique_id)
        return {"result_id": result.id}
        