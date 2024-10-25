// Populate the message list on page load
function displayMessages() {
    chrome.storage.local.get('websiteMessages', (result) => {
        const storedMessages = JSON.parse(result.websiteMessages || '{}');
        const messageList = document.getElementById('messageList');
        messageList.innerHTML = '';

        Object.keys(storedMessages).forEach((site) => {
            const messageDiv = document.createElement('div');
            messageDiv.innerHTML = `<p>${site}: ${storedMessages[site]}</p>`;
            
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteMessage(site);

            messageDiv.appendChild(deleteButton);
            messageList.appendChild(messageDiv);
        });
    });
}

function deleteMessage(site) {
    chrome.storage.local.get('websiteMessages', (result) => {
        let storedMessages = JSON.parse(result.websiteMessages || '{}');
        delete storedMessages[site];

        chrome.storage.local.set({ websiteMessages: JSON.stringify(storedMessages) }, () => {
            displayMessages(); // Refresh the list after deletion
        });
    });
}

window.onload = displayMessages;
