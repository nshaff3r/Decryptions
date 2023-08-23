from flask import Flask, redirect, render_template, request, session
from flask_session import Session
from datetime import date, timedelta

app = Flask(__name__)

app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30000)
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

today = date.today()
number = 1
curDate = today.strftime("%B %d, %Y")
TESTCRYPTOGRAM = 'GDS FGEGS XC YZRRSFXGE GEQSF ZGF REYS CKXY E REGZLS HEQXGE IXKH CXK "FQV-GZRGSH IEGSK."'

@app.route("/")
def index():
    if not session.get("returning"):
        return redirect("/welcome")
    return render_template("index.html", date=curDate, number=number, cryptogramText=TESTCRYPTOGRAM)

@app.route("/welcome", methods=["GET", "POST"])
def new():
    if request.method == "POST":
        session["returning"] = request.form.get("newUser")
        return redirect("/")
    return render_template("welcome.html", date=curDate, number=number)