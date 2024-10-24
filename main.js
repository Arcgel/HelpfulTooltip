
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
        let messagePop = null;

        for (let site in storedMessages) {
            if (url.includes(site)) {
                messagePop = storedMessages[site];
                break;
            }
        }

        if (messagePop) {
            const randomMessage = Array.isArray(messagePop)
                ? messagePop[Math.floor(Math.random() * messagePop.length)]
                : messagePop;
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




