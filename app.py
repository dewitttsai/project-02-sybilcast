import pymongo
import pprint
import pandas as pd
from sodapy import Socrata
from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
from flask import jsonify
import json
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route("/", methods=['GET', 'POST'])
def home():
    client = Socrata("data.lacity.org",
                 "GvIj0aUYYnBp2YRAZ2OHttpL6",
                 username="jackantonyan@gmail.com",
                 password="Ja142536$")
    results = client.get("63jg-8b9z", limit=2500000)

    max_temps = ["2010-09-27", "2011-10-12", "2012-09-15", "2013-08-29", "2014-09-16", "2015-09-09", "2016-09-26", "2017-10-24", "2018-07-06", "2019-09-14"]
    min_temps = ["2010-12-31", "2011-12-06", "2012-12-31", "2013-01-14", "2014-12-27", "2015-12-27", "2016-12-19", "2017-12-22", "2018-02-24", "2019-09-15"]
    days = max_temps + min_temps

    results_df = pd.DataFrame.from_records(results)
    results_df['date_occ'] = pd.to_datetime(results_df['date_occ'])
    results_df['date_occ'] = results_df['date_occ'].astype(str)
    new_results_df=results_df[['date_occ','time_occ','crm_cd','crm_cd_desc','area_name', 'lat', 'lon',]]

    df_date = new_results_df.set_index("date_occ")
    df_final = df_date.loc[days]
    df_final_fixed = df_final.reset_index()

    df_json_dict = df_final_fixed.to_dict(orient="records")

    mongo_client = pymongo.MongoClient('mongodb://localhost:27017')
    db = mongo_client.crime_db
    col = db["crime_data"]
    if col.count() > 0:
        col.drop()

    
    db = mongo_client.crime_db
    col = db["crime_data"]
    col.insert(df_json_dict)
    final = col.find()
    finals = []
    for j in final:
        j.pop('_id')
        finals.append(j)
    return jsonify(finals)

@app.route("/data", methods=['GET', 'POST'])
def data():
    mongo_client = pymongo.MongoClient('mongodb://localhost:27017')
    db = mongo_client.crime_db
    col = db["crime_data"]
    final = col.find()
    finals = []
    for j in final:
        j.pop('_id')
        finals.append(j)
    return jsonify(finals)

if __name__ == "__main__":
    app.run() 