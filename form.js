function copyhref() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let currentTabUrl = tabs[0].url;
        document.getElementById('website').value = currentTabUrl;
    });
}
document.getElementById('buttomicon').onclick = copyhref;

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

            // Now, transfer from local storage to websiteMessages in Chrome storage
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




document.getElementById('UTTSites').onsubmit = submit;