from flask import Flask, redirect, render_template, request, session, jsonify
from flask_session import Session
from datetime import datetime, timedelta
from pytz import timezone
import sqlite3

app = Flask(__name__)
app.config.from_pyfile('instance/config.py')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=9999)
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

today = ""
curDate = ""
number = 0
count = 26
cryptogram = ""
solution = ""
slashedDate = ""


def onvisit():
    global today, curDate, slashedDate
    est = timezone('America/New_York') 
    dateobj = datetime.now(est)
    today = dateobj.strftime("%Y-%m-%d")
    curDate = dateobj.strftime("%B %d, %Y")
    slashedDate = dateobj.strftime("%m/%d")
    if not session.get("visited"):
        session["visited"] = today
        getpuzzle()
    if session["visited"] != today:
        getpuzzle()
        session["lives"] = 4
        session["finished"] = False
        session["stats"] = False
        session["failed"] = []
        session["replaced"] = []
        session["visited"] = today
    elif cryptogram == "" or number == 0:
        getpuzzle()

def getpuzzle():
    global number, count, cryptogram, solution
    sqliteConnection = sqlite3.connect('static/cryptograms.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("SELECT problem, solution, published_id FROM puzzles JOIN published ON puzzles.id = published.cryptogram_id WHERE date = (?);", (str(today) + " 00:00:00",))
    data = cursor.fetchone()
    try:
        solution = data[0]
        cryptogram = data[1]
        number = data[2]
    except:
        solution = 'A PHOTON CHECKS INTO A HOTEL. "CAN I HELP YOU WITH YOUR LUGGAGE?" HE\'S ASKED. "NO THANKS, I\'M TRAVELING LIGHT."'
        cryptogram = 'G IVZYZR QVHQMD ARYZ G VZYHU. "QGR A VHUI BZL KAYV BZLO ULNNGNH?" VH\'D GDMHP. "RZ YVGRMD, A\'J YOGTHUARN UANVY."'
        number = 2
    count = 0
    alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for letter in alpha:
        if letter not in solution:
            count += 1
    count = 26 - count

@app.route("/debug1923409123")
def debug1923409123():
    return render_template("debug1923409123.html", metric=session["history"])

@app.route("/", methods=["GET", "POST"])
def index():
    onvisit()
    session.permenant = True
    if not session.get("returning"): 
        return redirect("/welcome")
    if not session.get("finished"):
        session["finished"] = False
    if session["finished"]:
        return redirect("/complete")
    if not session.get("lives"):
        session["lives"] = 4
    if not session.get("replaced"):
        session["replaced"] = []
    if not session.get("failed"):
        session["failed"] = []
    if not session.get("history"):
        session["history"] = {
            "games": 0,
            "solved": 0,
            "streak": 0,
            "maxStreak": 0,
            "avgLives": 0,
            "closeCalls": 0,
            "lives": [0, 0, 0, 0, 0, 0]
        }
    return render_template("index.html", date=curDate, number=number,
                           lives=session["lives"], cryptogramText=cryptogram,
                           replaced=session["replaced"], failed=session["failed"])

@app.route("/welcome", methods=["GET", "POST"])
def welcome():
    onvisit()
    if request.method == "POST":
        session["returning"] = request.form.get("newUser")
        if session["returning"] == "no":
            return redirect("/instructions")
        else:
            return redirect("/")
    return render_template("welcome.html", date=curDate, number=number)

@app.route("/complete")
def complete():
    onvisit()
    if not session.get("finished"):
        return redirect("/")
    if not session.get("stats"):
        session["stats"] = False
    if not session["stats"]:
        session["stats"] = True
        if session["finished"]:
            if session["lives"] < 0:
                session["lives"] = 0
            session["history"]["games"] += 1
            session["history"]["lives"][session["lives"]] += 1
            total = session["history"]["lives"][1] + 2 * session["history"]["lives"][2] \
                + 3 * session["history"]["lives"][3] + 4 * session["history"]["lives"][4]
            session["history"]["avgLives"] = total / (session["history"]["games"])
            if session["lives"] == 0:
                session["history"]["streak"] = 0
            else:
                session["history"]["solved"] += 1
                session["history"]["streak"] += 1
                if session["history"]["streak"] > session["history"]["maxStreak"]:
                    session["history"]["maxStreak"] = session["history"]["streak"]
                if session["lives"] == 1:
                    session["history"]["closeCalls"] += 1
        
    if session["lives"] == 0:
        win = False
    else:
        win = True

    return render_template("complete.html", date=curDate, number=number, solvedCryptogram=solution,
                    dateDashed=slashedDate, attempts=5 - session["lives"], state=session["lives"])

@app.route("/stats")
def stats():
    onvisit()
    if not session.get("history"):
        session["history"] = {
            "games": 0,
            "solved": 0,
            "streak": 0,
            "maxStreak": 0,
            "avgLives": 0,
            "closeCalls": 0,
            "lives": [0, 0, 0, 0, 0, 0]
        }
    return render_template("stats.html", date=curDate, number=number, data=session["history"])

@app.route("/instructions")
def instructions():
    onvisit()
    return render_template("instructions.html", date=curDate, number=number)

@app.route("/give")
def give():
    onvisit()
    return render_template("give.html", date=curDate, number=number)

@app.errorhandler(404)
def page_not_found(e):
    onvisit()
    return render_template("404.html", date=curDate, number=number), 404

@app.route("/api", methods=["POST"])
def api():
    data = request.json
    if cryptogram.find(data["old"]) == solution.find(data["new"]):
         session["replaced"].append(data["old"] + data["new"])
         if len(session["replaced"]) == count:
             session["finished"] = True
         return jsonify({'message': 'correct', 'lives': session["lives"], 'complete': session["finished"]}), 200
    else:
        session["lives"] -= 1
        session["failed"].append(data["old"] + data["new"])
        if (int(session["lives"]) == 0):
            session["finished"] = True
        return jsonify({'message': 'wrong', 'lives': session["lives"], 'complete': session["finished"]}), 200

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0')
