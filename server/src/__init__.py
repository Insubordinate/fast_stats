from flask import Flask
from celery import Celery,Task
from flask_cors import CORS,cross_origin





def create_app() -> Flask:

    UPLOAD_FOLDER = 'src/static'

    app = Flask(__name__,static_url_path='/src/static')
    cors= CORS(app)
    app.config.from_mapping(
        CELERY=dict(
            broker_url="redis://localhost",
            result_backend="redis://localhost",
            task_ignore_result=True,
        ),
    )
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config.from_prefixed_env()
    celery_init_app(app)




    from . import views

    app.register_blueprint(views.bp)
    return app




def celery_init_app(app: Flask) -> Celery:
    class FlaskTask(Task):
        def __call__(self, *args: object, **kwargs: object) -> object:
            with app.app_context():
                return self.run(*args, **kwargs)

    celery_app = Celery(app.name, task_cls=FlaskTask)
    celery_app.config_from_object(app.config["CELERY"])
    celery_app.set_default()
    app.extensions["celery"] = celery_app
    return celery_app


