import requests
import sqlite3
import json

cords = open("coordinates.txt", "w")
results = set()
sqliteConnection = sqlite3.connect('data.db')
cursor = sqliteConnection.cursor()
cursor.execute("SELECT IP FROM solved")
data = []
for ip in cursor.fetchall():
    data.append(ip[0])


for addr in data[48:]:
    header = {"User-Agent": "keycdn-tools:https://apple.com"}
    url = f"https://tools.keycdn.com/geo.json?host={addr}"
    response = requests.get(url, headers=header)
    response_json = response.json()
    res = f'{response_json["data"]["geo"]["latitude"]}, {response_json["data"]["geo"]["longitude"]}\n'
    print(res, end="")
    results.add(res)
for itm in results:
    cords.write(itm)
cords.close()