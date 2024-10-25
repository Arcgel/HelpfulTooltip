
function timer() {
    let timeLeft = 10;
    const countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            Delete_verification();
        } else {
            timeLeft--;
        }
    }, 1000);
}

function Delete_verification() {
    if (document.getElementById('Floating-Window')) {
        notneeded();
    } else {
        return;
    }
}

function notneeded() {
    const tooltip = document.getElementById('Floating-Window');
    if (tooltip) {
        tooltip.remove();
    }
}

function createPopup(message) {
    const existingPopup = document.getElementById('Floating-Window');
    if (existingPopup) return;

    const popup = document.createElement('div');
    popup.id = 'Floating-Window';
    popup.className = 'Floating-window';

    const parentDiv = document.createElement('div');
    parentDiv.id = 'parent';
    parentDiv.className = 'parent';

    const contentDiv = document.createElement('div');
    contentDiv.id = 'Content';
    contentDiv.innerHTML = message;

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'closing';
    closeButton.onclick = notneeded;

    parentDiv.appendChild(contentDiv);
    parentDiv.appendChild(closeButton);
    popup.appendChild(parentDiv);
    document.body.appendChild(popup);
}

function getMessage(type, callback) {
    chrome.runtime.sendMessage({ action: 'getMessages' }, (response) => {
        const storedMessages = JSON.parse(response[type] || '{}');
        const url = window.location.href;
        const domain = new URL(url).hostname; // Extracts the domain like "google.com"

        let exactMatchMessage = null;
        let keywordMatchMessage = null;

        // Step 1: Check for an exact domain match
        if (storedMessages[domain]) {
            if (Array.isArray(storedMessages[domain])) {
                exactMatchMessage = storedMessages[domain];
            } else {
                // Check if the message contains sub-path rules
                for (let path in storedMessages[domain]) {
                    if (url.includes(`${domain}/${path}`)) {
                        exactMatchMessage = storedMessages[domain][path];
                        break;
                    }
                }
            }
        }

        // Step 2: If no exact domain match, check for keyword matches in the URL
        if (!exactMatchMessage) {
            for (let keyword in storedMessages) {
                if (url.includes(keyword.toLowerCase())) {
                    keywordMatchMessage = storedMessages[keyword];
                    break;
                }
            }
        }

        // Step 3: Show the exact domain message if found, else show the keyword-based message
        const messageToDisplay = exactMatchMessage || keywordMatchMessage;

        if (messageToDisplay) {
            const randomMessage = Array.isArray(messageToDisplay)
                ? messageToDisplay[Math.floor(Math.random() * messageToDisplay.length)]
                : messageToDisplay;
            callback(randomMessage);
        } else {
            callback(null);
        }
    });
}

function verifyMessage() {
    getMessage('untrustedWebsites', (untrustedMessage) => {
        if (untrustedMessage) {
            createPopup(untrustedMessage);
            timer();
        } else {
            getMessage('websiteMessages', (trustedMessage) => {
                if (trustedMessage) {
                    createPopup(trustedMessage);
                    timer();
                }
            });
        }
        
    });
}

window.onload = verifyMessage;




