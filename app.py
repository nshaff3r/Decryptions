from flask import Flask, render_template, request, session
from flask_session import Session
from datetime import date

app = Flask(__name__)

@app.route("/")
def index():
    today = date.today()
    number = 1
    curDate = today.strftime("%B %d, %Y")
    return render_template("startup.html", date=curDate, number=number)