## This script takes data from map.json and countries_pop.txt
import csv
import json

COUNTRY_DATA = 'countries_pop.txt'
LOOKUP_DATA = 'map.json'

def read_lookup_data():
    """Return 4 data sets for countries, metrics, languages, and contributors"""

    lookups = { 'countries': [], 'metrics': [], 'languages': [], 'contributors': [] }
    with open(LOOKUP_DATA, encoding='utf-8') as data_file:
        data = json.loads(data_file.read())
        for idx, item in enumerate(lookups.items()): # For each lookup type
            for row in data[item[0]]:
                lookups[item[0]].append(row)
    
    return lookups

def run():
    """Main method for creating a single CSV"""

    lookups = read_lookup_data()

    ## Our single CSV will essentially be every country, with each column being associated data taken from other lookups
    countries = []

    for country in lookups['countries']:

        contributors = []
        for contributor in lookups['contributors']:
            if contributor['country_id'] == country['id']:
                contributors.append(contributor);

        print(country['name'])
        print(contributors)

        # Country values to take: name, continent, sub_region, intermediate_region
        country_data = {
            'name': country['name'],
            'continent': country['continent'],
            'sub_region': country['sub_region'],
            'intermediate_region': country['intermediate_region']
        }

run()