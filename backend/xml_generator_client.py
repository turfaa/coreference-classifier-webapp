import os


class XMLGeneratorClient:
    def __init__(self, jar_path: str) -> None:
        self.jar_path = jar_path

    def generate_xml(self, text: str, output_file_path: str) -> str:
        input_file_path = output_file_path + '_input'

        tmp_file = open(input_file_path, 'w')
        tmp_file.write(text)
        tmp_file.close()

        os.system(
            f'java -jar "{self.jar_path}" "{input_file_path}" "{output_file_path}"')
        os.remove(input_file_path)

        with open(output_file_path, 'r') as f:
            result = f.read()

        return result
