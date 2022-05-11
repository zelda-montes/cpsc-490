import json
import requests
from datetime import datetime

class EpaData():
	def __init__(self, state, startYear, paramCode=None):
		self.state = state
		self.startyear = startYear
		self.endYear = startYear

		if paramCode is None:
			self.paramCode = "42602"
		else:
			self.paramCode = paramCode

		self.api_key = "khakimouse49"
		self.email = "lina.montes@yale.edu"


	def build_query(self):
		complete_query = f"https://aqs.epa.gov/data/api/annualData/byState?email={self.email}&key={self.api_key}&param={self.paramCode}&bdate={self.startyear}&edate={self.endYear}&state={self.state}"
		print(complete_query)
		return complete_query


	def filter_response(self, response):
		response_dict = response.json()
		# data_dict = response_dict["series"][0].get("data")

		data_list = response_dict["Data"]
		concentration = sum(d.get("ninety_eighth_percentile", 0) for d in data_list)


	def run_query(self):
		query = self.build_query()
		response = requests.get(query)
		return response
		# data_json = self.filter_response(response)
		# return data_json
