from flask import Flask, redirect, render_template, request, session, jsonify
from flask_session import Session
from datetime import date, timedelta

app = Flask(__name__)

app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=1)
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

today = date.today()
number = 1
curDate = today.strftime("%B %d, %Y")
testCryptogram = 'GDS FGEGS XC YZRRSFXGE GEQSF ZGF REYS CKXY E REGZLS HEQXGE IXKH CXK "FQV-GZRGSH IEGSK."'
testSolution =  'THE STATE OF MINNESOTA TAKES ITS NAME FROM A NATIVE DAKOTA WORD FOR "SKY-TINTED WATER."'
count = 16


@app.route("/", methods=["GET", "POST"])
def index():
    if not session.get("returning"):
        return redirect("/welcome")
    if not session.get("lives"):
        session["lives"] = 5
    if not session.get("replaced"):
        session["replaced"] = []
    if not session.get("failed"):
        session["failed"] = []
    return render_template("index.html", date=curDate, number=number,
                           lives=session["lives"], cryptogramText=testCryptogram,
                           replaced=session["replaced"], failed=session["failed"])

@app.route("/welcome", methods=["GET", "POST"])
def new():
    if request.method == "POST":
        session["returning"] = request.form.get("newUser")
        return redirect("/")
    return render_template("welcome.html", date=curDate, number=number)

@app.route("/api", methods=["POST"])
def api():
    data = request.json
    if testCryptogram.find(data["old"]) == testSolution.find(data["new"]):
         complete = False
         session["replaced"].append(data["old"] + data["new"])
         if len(session["replaced"]) == count:
             complete = True
         return jsonify({'message': 'correct', 'lives': session["lives"], 'complete': complete}), 200
    else:
        session["lives"] -= 1
        session["failed"].append(data["old"] + data["new"])
        return jsonify({'message': 'wrong', 'lives': session["lives"], 'complete': False}), 200