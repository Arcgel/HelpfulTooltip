// Populate the message list on page load
function displayMessages() {
    chrome.storage.local.get('websiteMessages', (result) => {
        const storedMessages = JSON.parse(result.websiteMessages || '{}');
        const messageList = document.getElementById('messageList');
        messageList.innerHTML = '';

        Object.keys(storedMessages).forEach((site) => {
            const siteDiv = document.createElement('div')
            siteDiv.innerHTML = `<h2>${site}<h2>`
            siteDiv.className = 'siteDiv'

            const messageDiv = document.createElement('div');
            messageDiv.innerHTML = `<p> ${storedMessages[site]} </p>`;
            messageDiv.className = 'messageoutput'
            
            const deleteButton = document.createElement('button');
            deleteButton.onclick = () => deleteMessage(site);
            deleteButton.className = 'Delete'

            const delbutimg = document.createElement('img');
            delbutimg.src = "images/delete.png"
            delbutimg.alt= "Delete";
            delbutimg.className = "delbutimg";

            deleteButton.appendChild(delbutimg);
            messageDiv.appendChild(deleteButton);   
            siteDiv.appendChild(messageDiv);
            messageList.appendChild(siteDiv)
        });
    });
}

function deleteMessage(site) {
    chrome.storage.local.get('websiteMessages', (result) => {
        let storedMessages = JSON.parse(result.websiteMessages || '{}');
        delete storedMessages[site];

        let localData = JSON.parse(localStorage.getItem('userMessages') || '{}');
        if (localData[site]) {
            delete localData[site];
            localStorage.setItem('userMessages', JSON.stringify(localData));
            console.log(`Deleted ${site} from local storage`);
        }

        chrome.storage.local.set({ websiteMessages: JSON.stringify(storedMessages) }, () => {
            displayMessages(); // Refresh the list after deletion
        });
    });
}

window.onload = displayMessages;
