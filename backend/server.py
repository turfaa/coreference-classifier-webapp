import os
from typing import Dict

import xmltodict
from flask import Flask, request
from flask_cors import CORS
from flask_json import FlaskJSON, as_json

import config
from coref_client import CorefClient
from helper import dict_to_camel_cased_key, dict_to_snake_cased_key
from xml_generator_client import XMLGeneratorClient

app = Flask(__name__)
CORS(app)
json = FlaskJSON(app)

xml_generator_client = XMLGeneratorClient(config.XML_GENERATOR_JAR_PATH)
coref_client = CorefClient()


@app.route('/')
def home():
    return 'Hello World!'


@app.route('/generate-markable-clusters', methods=['POST'])
@as_json
def coreference_resolution():
    data: Dict = dict_to_snake_cased_key(request.get_json(force=True))
    text: str = data['text']
    use_singleton_classifier: bool = data['use_singleton_classifier']

    xml_file_path = f'tmp/{len(os.listdir("tmp"))}.xml'
    res = xmltodict.parse(
        xml_generator_client.generate_xml(text, xml_file_path))

    markable_data = coref_client.get_markable_data(xml_file_path)
    markable_clusters = coref_client.get_markable_clusters(
        xml_file_path, use_singleton_classifier)

    if use_singleton_classifier:
        for phrase in res['data']['sentence']['phrase']:
            if '@id' in phrase:
                phrase['is_singleton'] = int(
                    markable_data[int(phrase['@id'])]['is_singleton'])

    os.remove(xml_file_path)

    res['result'] = markable_clusters

    return dict_to_camel_cased_key(res)
