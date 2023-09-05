import os
import json
from xml.etree import ElementTree as ET

# Initialize the paths for the input 'txt' and 'xml' folders, and the output JSONL file.
txt_folder = "txt"
xml_folder = "xml"
jsonl_output_path = "hsa-training-data.jsonl"

# Define the XML namespace dictionary to search for elements in the XML files.
namespaces = {"tei": "http://www.tei-c.org/ns/1.0"}

# Open the JSONL output file for writing.
with open(jsonl_output_path, "w", encoding="utf-8") as jsonl_file:
    # Loop through each .txt file in the 'txt' folder.
    for txt_filename in os.listdir(txt_folder):
        # Generate the corresponding .xml filename.
        xml_filename = txt_filename.replace(".txt", ".xml")

        # Check if a matching .xml file exists in the 'xml' folder.
        if xml_filename in os.listdir(xml_folder):
            # Read the content of the .txt file.
            with open(
                os.path.join(txt_folder, txt_filename), "r", encoding="utf-8"
            ) as f:
                txt_content = f.read()

            # Parse the corresponding .xml file.
            tree = ET.parse(os.path.join(xml_folder, xml_filename))
            root = tree.getroot()

            # Check if the .xml file has more than 50 lines.
            xml_content = ET.tostring(root, encoding="utf-8").decode("utf-8")
            if xml_content.count("\n") > 50:
                continue  # Skip this pair and proceed to the next

            # Initialize variable to hold the relevant XML content.
            letter_div = None

            # Search for the <div> element with type='letter'.
            for div in root.findall(".//tei:div[@type='letter']", namespaces):
                letter_div = ET.tostring(div, encoding="utf-8").decode("utf-8")

                # Remove the namespace prefixes from the XML string.
                cleaned_letter_div = letter_div.replace("ns0:", "").replace(
                    ' xmlns:ns0="http://www.tei-c.org/ns/1.0"', ""
                )
                break

            # If no matching <div> is found, skip this pair.
            if letter_div is None:
                continue

            # Create the JSONL entry.
            jsonl_entry = {
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a TEI XML expert. Make the following annotations in the unstructured text and tag it with XML elements.\nThis is a letter from or to Hugo Schuchardt (1842-1927).\nHere are the mapping rules:\nNamed Entities:\n* dateline: <dateline> </dateline>\n* location: <location> </location>\n* person: <persName> </persName>\n* organisation: <orgName> </orgName>\n* address: <address> </address>\nTextual structures:\n* paragraphs: <p> </p>\n* closer: <closer> </closer>\n* signed: <signed> </signed>\nOther:\n* dates: <date> </date>\n* editorial comment: <note> </note> and add @n with a counter.\nFurther rules:\n* The mapping rules must always be adhered to. If you are not able to comply with them, just write 'Failed' instead.\n* The original text must not be changed.\n* '|1|' is a page break.\n* Each element must always close after the annotated string.\n* There is a <TEI> element as the root, which means that the xml is well-formed.\n* Use a standard minimal <teiHeader>",
                    },
                    {
                        "role": "user",
                        "content": f"Generate TEI XML from the following text:\n{txt_content}",
                    },
                    {"role": "assistant", "content": cleaned_letter_div},
                ]
            }

            # Write the JSONL entry to the output file, preserving Unicode characters.
            jsonl_file.write(json.dumps(jsonl_entry, ensure_ascii=False) + "\n")
