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

# testCryptogram = 'ZY PKL XSH XC XNNAH X MXP, ZS QKLAM SXIH KUHE SQHCSP PHXEV SK SEP XAA SRH ICKQC UXEZHSZHV.'
# testSolution =  'IF YOU ATE AN APPLE A DAY, IT WOULD TAKE OVER TWENTY YEARS TO TRY ALL THE KNOWN VARIETIES. '
testCryptogram = "Q"
testSolution = "A"
count = 0
alpha = "ABCDEFGHIJKLMNOPQRSTUVQXYZ"
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
    if len(session["replaced"]) == count:
        return redirect("/complete")
    return render_template("index.html", date="June 26,2023", number=number,
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
    if not session.get("replaced"):
        return redirect("/")
    if len(session["replaced"]) == count:
        return render_template("complete.html", date=curDate, number=number,
                           lives=session["lives"], solvedCryptogram=testSolution,
                           dateDashed=slashedDate, attempts=5 - session["lives"])

    else:
        return redirect("/")

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