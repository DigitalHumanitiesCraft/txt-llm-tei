import openai
import os

# Specify the directory containing the text files
input_directory = 'input'
output_directory = 'output'

# Define the prompt template
prompt_template = """
Make the following annotations in the unstructured text and tag it with XML elements. This is a letter from or to Hugo Schuchardt (1842-1927).
Here are the mapping rules: 
Named Entities:
* dateline: <dl> </dl>
* location: <l> </l>
* person: <p> </p>
* organisation: <o> </o>
* address: <a> </a>
Textual strucutres:
* paragaphs: <p> </p>
* closer: <c> </c>
* signed: <s> </s>
Other:
* dates: <d> </d>
* editorial comment: <e> </e> and add @n with a counter.

Further rules:
* The mapping rules must always be adhered to. If you are not able to comply with them, just write "Failed" instead.
*The original text must not be changed.
* "|1|" is a page breaks.
* Each element must always close after the annotated string.
* There is a <root> element as the root, which means that the xml is well-formed.

Unstructured text:
´´´
{}
´´´
"""

# Insert your OpenAI API key here
openai_api_key = ''
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
