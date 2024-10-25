// JavaScript: form.js

// Function to copy the URL of the current tab
function copyhref() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let currentTabUrl = tabs[0].url;
        document.getElementById('website').value = currentTabUrl;
    });
}

// Function to transfer local storage data to Chrome storage
function transferLocalToChrome() {
    let localData = JSON.parse(localStorage.getItem('userMessages') || '{}');
    chrome.storage.local.get('websiteMessages', (result) => {
        let storedMessages = JSON.parse(result.websiteMessages || '{}');

        // Update Chrome storage with data from local storage
        for (const site in localData) {
            if (!storedMessages[site]) {
                storedMessages[site] = [localData[site]]; // Create new entry
            } else {
                // Check if the message already exists
                if (!storedMessages[site].includes(localData[site])) {
                    storedMessages[site].push(localData[site]); // Add if it doesn't exist
                }
            }
        }

        // Save updated messages back to Chrome storage
        chrome.storage.local.set({ websiteMessages: JSON.stringify(storedMessages) }, () => {
            console.log('Local storage data transferred to Chrome storage successfully!');
        });
    });
}

// Event listeners setup after DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    const copyButton = document.getElementById('buttomicon');
    const submitButton = document.getElementById('UTTSites');
    const toggleButton = document.getElementById("sakura-button");

    // Attach event listeners
    copyButton.addEventListener("click", copyhref);
    toggleButton.addEventListener("click", toggleBackground);
    submitButton.onsubmit = submit;

    transferLocalToChrome();
});

// Function to handle form submission
function submit(event) {
    event.preventDefault();

    let newsite = document.getElementById('website').value.trim();
    let newmessage = document.getElementById('message').value.trim();

    if (!newsite || !newmessage) {
        console.log('Site or message cannot be empty!');
        return; // Exit if either field is empty
    }

    // Update local storage
    let localData = JSON.parse(localStorage.getItem('userMessages') || '{}');
    localData[newsite] = newmessage;
    localStorage.setItem('userMessages', JSON.stringify(localData));

    // Send message to save to Chrome storage
    chrome.runtime.sendMessage({
        action: 'saveMessage',
        data: { newsite, newmessage }
    }, (response) => {
        if (response.status === 'success') {
            console.log('Message saved successfully!');

            // Transfer from local storage to websiteMessages in Chrome storage
            chrome.storage.local.get('websiteMessages', (result) => {
                let storedMessages = JSON.parse(result.websiteMessages || '{}');

                // Update websiteMessages with new message
                if (!storedMessages[newsite]) {
                    storedMessages[newsite] = [newmessage]; // Create new entry
                } else {
                    // Check if the message already exists
                    if (!storedMessages[newsite].includes(newmessage)) {
                        storedMessages[newsite].push(newmessage); // Add new message if it doesn't exist
                    }
                }

                // Transfer local storage data to website storage
                let localMessages = JSON.parse(localStorage.getItem('userMessages') || '{}');
                for (const site in localMessages) {
                    if (!storedMessages[site]) {
                        storedMessages[site] = [localMessages[site]]; // Create new entry for each site
                    } else {
                        // Check if the message already exists
                        if (!storedMessages[site].includes(localMessages[site])) {
                            storedMessages[site].push(localMessages[site]); // Add if it doesn't exist
                        }
                    }
                }

                // Save updated messages back to Chrome storage
                chrome.storage.local.set({ websiteMessages: JSON.stringify(storedMessages) }, () => {
                    console.log('Website messages updated successfully!');
                });
            });

            // Clear input fields
            document.getElementById('website').value = '';
            document.getElementById('message').value = '';
        }
    });
}

// Function to toggle background
function toggleBackground() {
    document.body.classList.toggle("alt-background");
}
