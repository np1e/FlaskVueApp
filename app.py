from flask import Flask, render_template
from api import api
from database import db

app = Flask(__name__)
app.config.from_envvar('CONFIG')
db.init_app(app)

app.register_blueprint(api, url_prefix='/api')


@app.route('/')
def hello_world():
    return render_template('index.html')
