// Define the base API URL
const API_BASE = "http://localhost:8080";

// --- DOM Elements ---

// Grab various elements from the DOM (Document Object Model) for interaction
const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInputUploadButton");
const textarea = document.getElementById("inputText");
const fileList = document.getElementById("fileList");
const convertButton = document.getElementById("convertButton");

// This object will store a mapping between filenames, corpus_id, and letter_id
let fileMapping = {};

/**
 * Utility function to handle API fetch requests.
 * @param {string} endpoint - The endpoint for the request relative to API_BASE.
 * @param {object} options - Additional fetch options like method, headers, etc.
 * @returns {Promise} - Resolves with the parsed JSON data or rejects with an error.
 */
async function fetchData(endpoint, options = {}) {
  // Make a fetch request to the specified endpoint with the given options
  const response = await fetch(`${API_BASE}${endpoint}`, options);

  // If the response was not successful, throw an error
  if (!response.ok) {
    throw new Error(`Failed request: ${response.statusText}`);
  }

  // Check if the expected response type is text, otherwise default to JSON
  if (options.responseType === "text") {
    return response.text();
  }

  return response.json();
}

// Fetch all filenames from the server and display them in the file list.
async function fetchAndDisplayFilenames() {
  try {
    // Fetch data from the server
    const data = await fetchData("/corpus/1/letter");
    // Display the fetched filenames
    displayFilenames(data);
  } catch (error) {
    // Log and alert the user about the error
    console.error("Error fetching files:", error);
    alert("Error fetching files. Please try again.");
  }
}

// Function to display the list of filenames on the UI
function displayFilenames(data) {
  // Clear any previous list
  fileList.innerHTML = "";

  // Loop through the provided data and create links for each file
  data.forEach((file) => {
    // Store the relationship between the filename and its ids
    fileMapping[`${file.name}`] = {
      corpus_id: file.corpus_id,
      letter_id: file.id,
    };

    // Create a new list item and link for each file
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.innerText = file.name;
    // Store the filename as a data attribute for later retrieval
    a.setAttribute("data-filename", `${file.name}`);
    li.appendChild(a);
    fileList.appendChild(li);
  });
}

// Add a click event listener to the fileList element
fileList.addEventListener("click", async function (evt) {
  // Prevent the default action of the event (like navigating to a link)
  evt.preventDefault();

  // Get the element that was clicked
  const clickedElement = evt.target;

  // Check if it was a link (tag name "A")
  if (clickedElement.tagName === "A") {
    // Get the filename from the data attribute
    const filename = clickedElement.getAttribute("data-filename");

    try {
      // Fetch the content of the file using its mapping details
      const content = await fetchFileContent(fileMapping[filename]);
      // Display the fetched content in the textarea
      textarea.value = content;
      // Store the filename as a data attribute on the textarea for later use
      textarea.setAttribute("data-filename", filename);
    } catch (error) {
      // Log and alert the user about the error
      console.error("Error fetching file content:", error);
      alert("Error fetching file content. Please try again.");
    }
  }
});

// Fetch the content of a specific file based on its mapping details
async function fetchFileContent(file) {
  const endpoint = `/corpus/${file.corpus_id}/letter/${file.letter_id}/txt`;
  return fetchData(endpoint, { responseType: "text" });
}

// Add a click event listener to the uploadButton to trigger the file input click
uploadButton.addEventListener("click", function () {
  fileInput.click();
});

// Add a change event listener to the file input to handle file uploads
fileInput.addEventListener("change", async function () {
  try {
    // Upload the selected files
    await uploadFiles();
    // Refresh the file list to reflect the new uploads
    fetchAndDisplayFilenames();
  } catch (error) {
    // Log and alert the user about the error
    console.error("Error uploading files:", error);
    alert("Error uploading files. Please try again.");
  }
});

// Function to handle the uploading of files
async function uploadFiles() {
  // Create a FormData object to hold the files
  const formData = new FormData();
  // Loop through the selected files and append them to the FormData
  for (let i = 0; i < fileInput.files.length; i++) {
    formData.append("name", fileInput.files[i]);
  }
  // Make a POST request to the server to upload the files
  await fetchData("/corpus/1/upload", {
    method: "POST",
    body: formData,
  });
}

// Add a click event listener to the convertButton to handle file conversion
convertButton.addEventListener("click", async function () {
  // Get the spinner element inside the button
  const spinner = convertButton.querySelector(".spinner-border");
  // Disable the button and show the spinner while the conversion is in progress
  toggleConversionButtonState(true, spinner);

  try {
    // Attempt to convert the selected file to XML
    await convertToXML();
  } catch (error) {
    // Log and alert the user about the error
    console.error("Error during conversion:", error);
    alert("Error converting or fetching XML content. Please try again.");
  } finally {
    // Re-enable the button and hide the spinner after the conversion process
    toggleConversionButtonState(false, spinner);
  }
});

// Function to toggle the state of the conversion button
function toggleConversionButtonState(disable, spinner) {
  // Disable or enable the button based on the provided state
  convertButton.disabled = disable;
  // Show or hide the spinner based on the provided state
  spinner.style.display = disable ? "inline-block" : "none";
}

// Function to handle the conversion of the selected file to XML
async function convertToXML() {
  // Get the filename of the currently selected file
  const currentFile = getCurrentFilename();

  // Check if the file is valid for conversion
  if (!isValidFile(currentFile)) {
    alert("Please select a valid .txt file first.");
    return;
  }

  // Start the conversion process
  const convertData = await initiateConversion(currentFile);
  // Fetch the converted XML content
  const xmlContent = await fetchConvertedXMLContent(currentFile, convertData);

  // Display the fetched XML content
  displayXML(xmlContent);
}

// Function to get the filename of the currently selected file
function getCurrentFilename() {
  return textarea.getAttribute("data-filename");
}

// Function to check if a file is valid for conversion
function isValidFile(filename) {
  return fileMapping[filename]?.corpus_id && fileMapping[filename]?.letter_id;
}

// Function to initiate the conversion process on the server
async function initiateConversion(filename) {
  const endpoint = `/corpus/${fileMapping[filename].corpus_id}/letter/${fileMapping[filename].letter_id}/convert`;
  // Logging the endpoint and any data being sent
  console.log("Sending request to:", endpoint);
  console.log("Filename:", filename);
  return fetchData(endpoint, { method: "POST" });
}

// Function to fetch the converted XML content from the server
async function fetchConvertedXMLContent(filename, convertData) {
  const endpoint = `/corpus/${fileMapping[filename].corpus_id}/letter/${fileMapping[filename].letter_id}/tei/${convertData.id}/xml`;
  return fetchData(endpoint, { responseType: "text" });
}

// Function to display the fetched XML content
function displayXML(xmlContent) {
  teiXMLPreviewEditor.setValue(xmlContent);
}

// Fetch and display filenames upon page load
fetchAndDisplayFilenames();

document.addEventListener("DOMContentLoaded", function () {
  const userInput = document.getElementById("userInput");
  const sendButton = document.getElementById("sendButton");
  const chatArea = document.getElementById("chatArea");
  const fileInput = document.getElementById("fileInput");

  function escapeHTML(unsafeText) {
    return unsafeText
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function addMessage(content, className) {
    const escapedContent = escapeHTML(content); // Escape the content
    const messageDiv = document.createElement("div");
    messageDiv.className = className;
    messageDiv.innerHTML = `<p>${escapedContent}</p>`;
    chatArea.appendChild(messageDiv);
    chatArea.scrollTop = chatArea.scrollHeight; // Scroll to the bottom
  }

  async function sendMessage() {
    const userMessage = userInput.value.trim(); // Get the user input value

    // Retrieve the filename from the data-filename attribute of the textarea
    const filename = textarea.getAttribute("data-filename");

    if (userMessage && filename) {
      // Ensure both userMessage and filename are present
      addMessage(userMessage, "user-message"); // Add user message to chat area
      userInput.value = ""; // Clear the input field

      // Declare the endpoint as a const
      const endpoint = `/corpus/${fileMapping[filename].corpus_id}/letter/${fileMapping[filename].letter_id}/chat`;

      try {
        // Send the user's message to the backend using the fetchData function
        const response = await fetchData(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: userMessage,
        });
        console.log("user", userMessage);

        // Use the id from the response as the chatbot's response
        const botResponse = `Your request has been processed with the ID: ${response.id}`;
        addMessage(botResponse, "bot-message");

        // Using the tei_id from the response to fetch the XML content
        const xmlContent = await fetchConvertedXMLContent(filename, response);
        displayXML(xmlContent);
      } catch (error) {
        // Handle errors, like network issues or invalid responses
        addMessage(
          "Error processing your request. Please try again later.",
          "bot-message"
        );
        console.error("Error:", error);
      }
    }
  }

  // Event listener for Send button
  sendButton.addEventListener("click", sendMessage);

  // Event listener for Enter key in the input field
  userInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default action (form submission)
      sendMessage();
    }
  });

  // Event listener for file input
  fileInput.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      const fileName = this.files[0].name;
      addMessage(`File attached: ${fileName}`, "user-message");
      // Here, you can handle the file, e.g., upload it to a server
      // For this example, we'll just display the file name in the chat area
    }
  });
  // Function to handle selection of a prompt template from the dropdown
  function handleTemplateSelection(event) {
    event.preventDefault(); // Prevent the default action (navigation)
    const template = event.target.getAttribute("data-value"); // Get the selected template
    if (template) {
      userInput.value = template; // Insert the selected template into the input field
    }
  }

  // Get references to the dropdown items and add event listeners to them
  const dropdownItems = document.querySelectorAll(
    ".dropdown-menu .dropdown-item"
  );
  dropdownItems.forEach((item) => {
    item.addEventListener("click", handleTemplateSelection);
  });
});
