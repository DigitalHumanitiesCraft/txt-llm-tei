import os
import re
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom

def prettify(elem):
    rough_string = tostring(elem, 'utf-8')
    reparsed = minidom.parseString(rough_string)
    return reparsed.toprettyxml(indent="  ")

def extract_location_date(content):
    location_date_line = next(line for line in content.split('\n') if line.strip())
    match = re.match(r'^(.*?)(?:,| d\.? )(.*)$', location_date_line)
    if match:
        location, date = match.groups()
    else:
        location, date = location_date_line, None
    return location.strip(), date.strip() if date else None

def extract_salutation_body_closing(content):
    lines = content.split('\n')
    salutation = next((line for line in lines[1:] if line.strip()), None)
    body_lines, closing_lines, in_closing = [], [], False
    for line in lines[2:]:
        if not in_closing and not line.strip():
            in_closing = True
        if in_closing:
            closing_lines.append(line)
        else:
            body_lines.append(line)
    body = ' '.join(line.strip() for line in body_lines if line.strip())
    closing = ' '.join(line.strip() for line in closing_lines if line.strip())
    return salutation.strip() if salutation else None, body, closing.strip() if closing else None

def transform_to_tei_xml(content):
    location, date = extract_location_date(content)
    salutation, body_text, closing = extract_salutation_body_closing(content)
    TEI = Element('TEI')
    teiHeader = SubElement(TEI, 'teiHeader')
    text = SubElement(TEI, 'text')
    body = SubElement(text, 'body')
    opener = SubElement(body, 'opener')  # Define 'opener' first
    dateline = SubElement(opener, 'dateline')  # Then define 'dateline' using 'opener'
    SubElement(dateline, 'placeName').text = location
    if date: SubElement(dateline, 'date').text = date
    if salutation: SubElement(opener, 'salute').text = salutation
    SubElement(body, 'p').text = body_text
    if closing: SubElement(body, 'closer').text = closing
    return prettify(TEI)

# Directory paths
input_folder = 'input'
output_folder = 'output'

# Ensure the output folder exists
if not os.path.exists(output_folder):
    os.mkdir(output_folder)

# Process all .txt files in the input folder
for filename in os.listdir(input_folder):
    if filename.endswith('.txt'):
        input_file_path = os.path.join(input_folder, filename)
        output_file_path = os.path.join(output_folder, filename.replace('.txt', '.xml'))
        with open(input_file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        tei_xml_content = transform_to_tei_xml(content)
        with open(output_file_path, 'w', encoding='utf-8') as file:
            file.write(tei_xml_content)
