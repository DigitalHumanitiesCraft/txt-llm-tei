import openai
import os

# Specify the directory containing the text files
input_directory = 'input'
output_directory = 'output'

# Define the prompt template
prompt_template = """
Given the following text of a letter, convert it into TEI XML format. 
The text includes a location and date, an address, the body of the letter, a closing salutation, and a signature. 
In the TEI XML, these should be represented by the <dateline>, <p>, <closer>, and <signed> elements respectively. 
Names should be enclosed in <persName> tags without reference links. 
Page breaks are indicated by a vertical bar followed by a number, like "|2|", and should be converted into a <pb> element with the n attribute set to the page number. 
Ignore the facs attribute in the <pb> element. 
Also, include an note> element with a n attribute for numbering, which contains a editorial comment.
Unstructured text:
´´´
{}
´´´

Provide the XML structure for the text content, including appropriate tags and hierarchy. Convert this into the corresponding TEI XML format.
"""

# Insert your OpenAI API key here
openai_api_key = 'OpenAI API'
openai.api_key = openai_api_key

# Loop through each text file in the input directory
for filename in os.listdir(input_directory):
    if filename.endswith('.txt'):
        # Read the content of the text file
        with open(os.path.join(input_directory, filename), 'r', encoding='utf-8') as file:
            text_content = file.read()

        # Construct the prompt for GPT-3.5
        prompt = prompt_template.format(text_content)

        # Send the prompt to GPT-3.5 and get the response
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=1000  # Adjust as needed
        )

        # Extract the XML content from the response
        xml_content = response.choices[0].text

        # Save the XML content to the output directory
        output_filename = filename.replace('.txt', '.xml')
        with open(os.path.join(output_directory, output_filename), 'w') as file:
            file.write(xml_content)

        print(f"Processed {filename} and saved as {output_filename}")
