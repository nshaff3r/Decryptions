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
slashedDate = today.strftime("%m/%d")
if (slashedDate[:2] != "10"):
    slashedDate = slashedDate.replace("0", "")

testCryptogram = 'ZY PKL XSH XC XNNAH X MXP, ZS QKLAM SXIH KUHE SQHCSP PHXEV SK SEP XAA SRH ICKQC UXEZHSZHV.'
testSolution =  'IF YOU ATE AN APPLE A DAY, IT WOULD TAKE OVER TWENTY YEARS TO TRY ALL THE KNOWN VARIETIES. '
# testCryptogram = "QQQ QQQ QQ Q Q QQQ QQ QQ QQ Q Q QQQQQQ QQ QQQ QQQQQQQ QQQ QQQ QQQ QQQQQ QQQQ QQQQQ QQQ QQ QQQQQ QQ"
# testSolution = "AAA AAA AA A A AAA AA AA AA A A AAAAAA AA AAA AAAAAAA AAA AAA AAA AAAAA AAAA AAAAA AAA AA AAAAA AA"
# testSolution = "ZOF FYF QJ MVCOZQYVFHY JQV FRZFVZFJRHFRZ QFZFY HFMC ZQ ZOF HJQQSF FYFY, MOFVF HQRCY OSFCFQ ZOFH ZQ OFYY ZJHF."
count = 0
alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
for letter in alpha:
    if letter not in testSolution:
        count += 1
count = 26 - count

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
    if not session.get("finished"):
        session["finished"] = False
    if session["finished"]:
        return redirect("/complete")
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
                           lives=session["lives"], cryptogramText=testCryptogram,
                           replaced=session["replaced"], failed=session["failed"])

@app.route("/welcome", methods=["GET", "POST"])
def welcome():
    if request.method == "POST":
        session["returning"] = request.form.get("newUser")
        return redirect("/")
    return render_template("welcome.html", date=curDate, number=number)

@app.route("/complete")
def complete():
    if not session.get("finished"):
        return redirect("/")

    if not session.get("stats"):
        session["stats"] = True
        if session["finished"]:
            if session["lives"] < 0:
                session["lives"] = 0
            session["history"]["avgLives"] = (session["history"]["streak"] * \
                session["history"]["games"] + session["lives"]) / (session["history"]["games"] + 1)
            session["history"]["games"] += 1
            session["history"]["lives"][session["lives"]] += 1
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

    return render_template("complete.html", date=curDate, number=number, solvedCryptogram=testSolution,
                    dateDashed=slashedDate, attempts=5 - session["lives"], status=win)

@app.route("/stats")
def stats():
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
    return render_template("instructions.html", date=curDate, number=number)

@app.route("/api", methods=["POST"])
def api():
    data = request.json
    if testCryptogram.find(data["old"]) == testSolution.find(data["new"]):
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