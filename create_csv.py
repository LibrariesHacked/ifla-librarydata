## This script takes data from map.json and countries_pop.txt
import csv
import json

# In future directly use https://librarymap.ifla.org/api/map

COUNTRY_DATA = 'countries_pop.txt'
LOOKUP_DATA = 'map.json'
OUTPUT_DATA = 'ifla_data.csv'
OUTPUT_TEXT = 'ifla_text.json'

def read_lookup_data():
    """Return 4 data sets for countries, metrics, languages, and contributors"""

    lookups = { 'countries': [], 'metrics': [], 'languages': [], 'contributors': [], 'values': [], 'libraryTypes': [] }
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
    countries_data = []
    set_headers = ['name', 'continent', 'sub_region', 'intermediate_region', 'updated_at']
    dynamic_headers = []

    for country in lookups['countries']:

        # Standard values
        country_data = {}
        for header in set_headers:
            country_data[header] = country[header]

        # Get all the metric values for the country
        country_value_data = {}
        for value in lookups['values']:
            if value['country_id'] == country['id']:
                if value['library_type_id'] not in country_value_data:
                    country_value_data[value['library_type_id']] = {}
                country_value_data[value['library_type_id']][value['metric_id']] = value['val']

        # Assign the metric values
        for metric in lookups['metrics']:

            for type in lookups['libraryTypes']:
                if (type['name'] + '_' + metric['shortname']) not in dynamic_headers:
                    dynamic_headers.append(type['name'] + '_' + metric['shortname'])
                if type['id'] in country_value_data and metric['id'] in country_value_data[type['id']]:
                    country_data[type['name'] + '_' + metric['shortname']] = country_value_data[type['id']][metric['id']]

        countries_data.append(country_data)

    headers = set_headers + dynamic_headers

    with open(OUTPUT_DATA, 'w', newline='') as outputfile:
        csvwriter = csv.writer(outputfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
        csvwriter.writerow(headers)
        for country in countries_data:
            country_row = []
            for header in headers:
                if header in country:
                    country_row.append(country[header])
                else:
                    country_row.append('')
            csvwriter.writerow(country_row)

run()