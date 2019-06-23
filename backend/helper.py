from typing import Any, Dict

from stringcase import camelcase, snakecase


def dict_to_camel_cased_key(dct: Dict[str, Any]) -> Dict[str, Any]:
    new_dict = {}

    for key, value in dct.items():
        new_dict[camelcase(key)] = value if type(
            value) != dict else dict_to_camel_cased_key(value)

    return new_dict


def dict_to_snake_cased_key(dct: Dict[str, Any]) -> Dict[str, Any]:
    new_dict = {}

    for key, value in dct.items():
        new_dict[snakecase(key)] = value if type(
            value) != dict else dict_to_snake_cased_key(value)

    return new_dict
