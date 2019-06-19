import os
from typing import Dict

import xmltodict
from flask import Flask, request
from flask_json import FlaskJSON, as_json

import config
from coref_client import CorefClient
from xml_generator_client import XMLGeneratorClient

app = Flask(__name__)
json = FlaskJSON(app)

xml_generator_client = XMLGeneratorClient(config.XML_GENERATOR_JAR_PATH)
coref_client = CorefClient()


@app.route('/')
def home():
    return 'Hello World!'


@app.route('/generate-markable-clusters', methods=['POST'])
@as_json
def coreference_resolution():
    data: Dict = request.get_json(force=True)
    text: str = data['text']

    xml_file_path = f'tmp/{len(os.listdir("tmp"))}.xml'
    res = xmltodict.parse(
        xml_generator_client.generate_xml(text, xml_file_path))

    markable_data = coref_client.get_markable_data(xml_file_path)
    markable_clusters = coref_client.get_markable_clusters(
        xml_file_path, False)

    for phrase in res['data']['sentence']['phrase']:
        if '@id' in phrase:
            phrase['is_singleton'] = int(
                markable_data[int(phrase['@id'])]['is_singleton'])

    os.remove(xml_file_path)

    res['result'] = markable_clusters

    return res
