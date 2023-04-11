from celery.result import AsyncResult
from flask import Blueprint
from flask import request
from werkzeug.utils import secure_filename
import os
from flask import current_app

from . import tasks

bp = Blueprint("tasks", __name__, url_prefix="/tasks")


@bp.get("/result/<id>")
def result(id):
    result = AsyncResult(id)
    ready = result.ready()
    return {
        "ready": ready,
        "successful": result.successful() if ready else None,
        "value": result.get() if ready else result.result,
    }


@bp.post("/add")
def add():
    a = request.form.get("a", type=int)
    b = request.form.get("b", type=int)
    result = tasks.add.delay(a, b)
    return {"result_id": result.id}


@bp.post("/upload")
def upload():
    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        file.save(os.path.join(current_app.config['UPLOAD_FOLDER'],filename))
        result = tasks.upload.delay()
        return {"result_id": result.id}


@bp.post("/process")
def process():
    filename = request.form.get("filename",type=str)
    result = tasks.process.delay(filename)
    return {"result_id": result.id}