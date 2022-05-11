from flask import Flask, render_template, request, abort
from static.data.eia import EiaData


# Initiate Flask Application
app = Flask(__name__)

@app.errorhandler(500)
def internal_error(error):
    return render_template("eia_error.html")

# Homepage url
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# EIA url
@app.route('/eia', methods=['GET', 'POST'])
def eia_index():
    if request.method == "GET":
        return render_template('eia_index.html')
    if request.method == "POST":
        eia_state = request.form.get("eia_state")
        eia_data = get_eia_data(eia_state)
        return render_template('eia_index.html', eia_state=eia_state, eia_data=eia_data)

# # EPA url
# @app.route('/epa', methods=['GET', 'POST'])
# def epa_index():
#     if request.method == "GET":
#         return render_template('epa_index.html')
#     if request.method == "POST":
#         epa_state = request.form.get("epa_state")
#         epa_start_year = request.form.get("epa_start_year")
#         epa_data = get_epa_data(epa_state, epa_start_year)
#         return render_template('epa_index.html', epa_data=epa_data)
#     # return render_template('epa_index.html')

# NOAA climate disasters url
@app.route('/noaa', methods=['GET', 'POST'])
def noaa_index():
    return render_template('noaa_index.html')

# NOAA sea level url
@app.route('/sea-level', methods=['GET', 'POST'])
def sea_level_index():
    return render_template('sea_level_index.html')

# Bills url
@app.route('/bills', methods=['GET', 'POST'])
def bills_index():
    return render_template('bills_index.html')

# Temperature url
@app.route('/temperature', methods=['GET', 'POST'])
def temperature_index():
    return render_template('temperature_index.html')

# Report url
@app.route('/report', methods=['GET', 'POST'])
def report_index():
    return render_template('report_index.html')


# Get EIA data from API
@app.route('/get-eia-data', methods=['GET', 'POST'])
def get_eia_data(state):
    ''' Send JSON data to Javascript '''
    eia_data = EiaData(state)
    eia_json_data = eia_data.run_query()
    return eia_json_data

# # Get EPA data from API
# @app.route('/get-epa-data', methods=['GET', 'POST'])
# def get_epa_data(state, start_year):
#     ''' Send JSON data to Javascript '''
#     epa_data = EpaData(state, start_year)
#     epa_json_data = epa_data.run_query()
#     return epa_json_data


if __name__ == '__main__':
    app.run()
