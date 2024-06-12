from flask import Flask, redirect, render_template, request, session, jsonify
from flask_session import Session
from datetime import datetime, timedelta
from pytz import timezone
import socket, struct
import sqlite3

app = Flask(__name__)
app.config.from_pyfile('instance/config.py')
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=9999)
app.config['SESSION_REFRESH_EACH_REQUEST'] = True
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
app.permanent_session_lifetime = timedelta(days=9999)

def onvisit(fetch=True): 
    est = timezone('America/New_York') 
    dateobj = datetime.now(est)
    today = dateobj.strftime("%Y-%m-%d")
    session["curDate"] = dateobj.strftime("%B %d, %Y")
    session["slashedDate"] = dateobj.strftime("%m/%d")
    if not session.get("visited"):
        session["visited"] = today
    if session["visited"] != today:
        session["visited"] = today
        session["switch"] = True
        session["lives"] = 4
        session["finished"] = False
        session["stats"] = False
        session["failed"] = []
        session["replaced"] = []
    if fetch:
        getpuzzle()

def getpuzzle():
    sqliteConnection = sqlite3.connect('static/cryptograms.db')
    cursor = sqliteConnection.cursor()
    cursor.execute("SELECT problem, solution, published_id FROM puzzles JOIN published ON puzzles.id = published.cryptogram_id WHERE date = (?);", (str(session["visited"]) + " 00:00:00",))
    data = cursor.fetchone()
    sqliteConnection.close()
    try:
        session["solution"] = data[0]
        session["cryptogram"] = data[1]
        session["number"] = data[2]
    except:
        session["solution"] = 'A PHOTON CHECKS INTO A HOTEL. "CAN I HELP YOU WITH YOUR LUGGAGE?" HE\'S ASKED. "NO THANKS, I\'M TRAVELING LIGHT."'
        session["cryptogram"] = 'G IVZYZR QVHQMD ARYZ G VZYHU. "QGR A VHUI BZL KAYV BZLO ULNNGNH?" VH\'D GDMHP. "RZ YVGRMD, A\'J YOGTHUARN UANVY."'
        session["number"] = 62
    # session["solution"] = 'AND'
    # session["cryptogram"] = 'XSN'
    # session["number"] = 62
    count = 0
    alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for letter in alpha:
        if letter not in session["solution"]:
            count += 1
    count = 26 - count
    session['count'] = count

@app.route("/debug1923409123.html")
def debug():
    return render_template("debug1923409123.html", metric=[session['lives'], session['finished'], len(session["replaced"]), session['count']])

@app.route("/", methods=["GET", "POST"])
def index():
    onvisit()
    session.permenant = True
    app.permanent_session_lifetime = timedelta(days=9999)
    if not session.get("returning"): 
        return redirect("/welcome")
    if not session.get("replaced"):
        session["replaced"] = []
    if len(session["replaced"]) == session['count']:
            session["finished"] = True
    if not session.get("finished"):
        session["finished"] = False
    if session["finished"]:
        return redirect("/complete")
    if not session.get("lives"):
        session["lives"] = 4
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
            "lives": [0, 0, 0, 0, 0]
        }
    return render_template("index.html", date=session["curDate"], number=session["number"],
                           lives=session["lives"], cryptogramText=session["cryptogram"],
                           replaced=session["replaced"], failed=session["failed"])

@app.route("/welcome", methods=["GET", "POST"])
def welcome():
    onvisit(fetch=False)
    if request.method == "POST":
        session["returning"] = request.form.get("newUser")
        if session["returning"] == "no":
            return redirect("/instructions")
        else:
            return redirect("/")
    return render_template("welcome.html", date=session["curDate"], number=session["number"])

@app.route("/complete")
def complete():
    onvisit(fetch=False)
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

    return render_template("complete.html", date=session["curDate"], number=session["number"], solvedCryptogram=session["solution"],
                    dateDashed=session["slashedDate"], attempts=4 - session["lives"], state=session["lives"])

@app.route("/stats")
def stats():
    onvisit(fetch=False)
    if not session.get("history"):
        session["history"] = {
            "games": 0,
            "solved": 0,
            "streak": 0,
            "maxStreak": 0,
            "avgLives": 0,
            "closeCalls": 0,
            "lives": [0, 0, 0, 0, 0]
        }
    return render_template("stats.html", date=session["curDate"], number=session["number"], data=session["history"])

@app.route("/instructions")
def instructions():
    onvisit(fetch=False)
    return render_template("instructions.html", date=session["curDate"], number=session["number"])

@app.route("/give")
def give():
    onvisit(fetch=False)
    return render_template("give.html", date=session["curDate"], number=session["number"])

@app.errorhandler(404)
def page_not_found(e):
    onvisit(fetch=False)
    return render_template("404.html", date=session["curDate"], number=session["number"]), 404

@app.route("/api", methods=["POST"])
def api():
    est = timezone('America/New_York') 
    ip = request.environ.get('HTTP_X_REAL_IP', request.remote_addr)
    data = request.json
    if session["cryptogram"].find(data["old"]) == session["solution"].find(data["new"]):
         session["replaced"].append(data["old"] + data["new"])
         if len(session["replaced"]) == session['count']:
            session["finished"] = True
            sqliteConnection = sqlite3.connect('static/data.db')
            cursor = sqliteConnection.cursor()
            cursor.execute('INSERT INTO solved (IP, Date, Lives, Solved) VALUES (?, ?, ?, ?);', (ip, datetime.now(est), session["lives"], 1))
            sqliteConnection.commit()
            sqliteConnection.close()
         return jsonify({'message': 'correct', 'lives': session["lives"], 'complete': session["finished"]}), 200
    else:
        session["lives"] -= 1
        session["failed"].append(data["old"] + data["new"])
        if (int(session["lives"]) == 0):
            session["finished"] = True
            sqliteConnection = sqlite3.connect('static/data.db')
            cursor = sqliteConnection.cursor()
            cursor.execute('INSERT INTO solved (IP, Date, Lives, Solved) VALUES (?, ?, ?, ?);', (ip, datetime.now(est), session["lives"], 0))
            sqliteConnection.commit()
            sqliteConnection.close()
        return jsonify({'message': 'wrong', 'lives': session["lives"], 'complete': session["finished"]}), 200

if __name__ == "__main__":
    app.debug = True
    app.run(host='0.0.0.0')
