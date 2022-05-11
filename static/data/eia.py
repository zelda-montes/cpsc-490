import json
import requests

class EiaData():
	def __init__(self, state, category=None, start=None, end=None):
		self.state = state

		if category is None:
			self.category = "EMISS.CO2-TOTV-TT-TO"
		else:
			self.category = category

		if start is not None:
			self.start = start

		if end is not None:
			self.end = end

		self.api_key = "cUfplw5RMpsgAsv65xiOdd7vF5LneyogS1fKp4NJ"


	def build_query(self):
		series_id = f"{self.category}-{self.state}.A"
		complete_query = f"https://api.eia.gov/series/?api_key={self.api_key}&series_id={series_id}"
		return complete_query


	def filter_response(self, response):
		response_dict = response.json()
		data_dict = response_dict["series"][0].get("data")

		final_list = []
		for entry in data_dict:
			d = {}
			d['year'] = entry[0]
			d['emissions'] = entry[1]
			final_list.append(d)

		final_json = json.dumps(final_list)
		return final_json


	def time_series(self, dict):
		pass


	def run_query(self):
		query = self.build_query()
		response = requests.get(query)
		data_json = self.filter_response(response)
		return data_json
