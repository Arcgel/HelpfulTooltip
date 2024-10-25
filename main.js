
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
} //Timer Logic that starts counting if a message is created

function Delete_verification() {
    if (document.getElementById('Floating-Window')) {
        notneeded();
    } else {
        return;
    }
} //Fixing the error on the Chrome error extension

function notneeded() {
    const tooltip = document.getElementById('Floating-Window');
    if (tooltip) {
        tooltip.remove();
    }
} //Logic for the Close button

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
} // Very Important Logic as it creates the popup on any sites and it will sits on the top of the page.

function getSubdomainMessage(domain, storedMessages) {
    const subdomainParts = domain.split('.'); // Split domain into parts
    const subdomainMatches = []; // To hold possible matches

    // Build possible subdomains (e.g., "google.com" from "docs.google.com")
    for (let i = 0; i < subdomainParts.length; i++) {
        subdomainMatches.push(subdomainParts.slice(i).join('.'));
    }

    // Check for subdomain matches, prioritizing more specific matches first
    for (let subdomain of subdomainMatches) {
        if (storedMessages[subdomain]) {
            return storedMessages[subdomain]; // Return the first match found
        }
    }

    return null; // Return null if no match found
}

function getMessage(type, callback) {
    chrome.runtime.sendMessage({ action: 'getMessages' }, (response) => {
        const storedMessages = JSON.parse(response[type] || '{}');
        const url = window.location.href;
        const domain = new URL(url).hostname; // Extracts the domain like "docs.google.com"
        const fullPath = new URL(url).href;
        const queryParams = new URL(url).searchParams; // The searchParams object will include the parameters q and sort
        const searchQuery = queryParams.get("q"); // Extracts the search query like "q=javascript" this is normally used in bing and google

        let exactMatchMessage = null;

        // Step 1: Check for specific "easter egg" keyword in the search query (like "q=javascript")
        if (searchQuery) {
            const keyword = searchQuery.toLowerCase(); //So that it can read despite the Upper case and Capitalization
            const easterEggMessages = {
                "javascript": "Bought to you by: JavaScript Cebu's Hackathon",
                "dark souls": ["To Be Alive... To Walk This Earth... That's The Real Curse Right There.",
                            "Only In Truth, The Lords Will Abandon Their Thrones, And The Unkindled Will Tise. Nameless Accursed Undead, Unfit Even To Be Cinder. And So It Is That Ash Seeketh Embers...",
                            "Seek Strength. The Rest Will Follow."
                ],
                "cat" : "Bilie Elish: Meow, Meow, Meow, Meow, Meow, Meow, Meow, Meow,",
                "dragonball": ["Its over 9000!!!!!!!!!!!!!!!!!!!!!!!!",
                                "But Perhaps It Is My Anger That Has Made Me Blind...",
                                "We can't just give up because things aren't the way we want them to be."
                ],
                "plant vs zombies garden warfare": "The Author is a big fan of the Series",
                "monster hunter rise": "Better than world - Author",
                "java" : "Its either this or C is your first language",
                "i wanna die" : "Watch This: https://youtu.be/Rl1ImG2b1k8",
                // Add more keyword-specific Easter egg messages here
            };//Array for you easter eggs

            if (easterEggMessages[keyword]/*Compare the Query to the Array easterEggMessages*/) {
                exactMatchMessage = easterEggMessages[keyword]; // Check if there an exact match
            }
        }
            //Check if its the same as a full URL for more specific Messagin
        if (storedMessages[fullPath]/*Compare the Query to the trsuted and untrusted array*/) {
            exactMatchMessage = storedMessages[fullPath];
        }

        // If no keyword match, check for an exact domain match
        if (!exactMatchMessage) {
            if (storedMessages[domain]) {
                exactMatchMessage = storedMessages[domain];
            }
            if (!exactMatchMessage) {
                exactMatchMessage = getSubdomainMessage(domain, storedMessages);
            }
        }

        // Step 5: Determine which message to display
        if (exactMatchMessage) {
            const randomMessage = Array.isArray(exactMatchMessage)
                ? exactMatchMessage[Math.floor(Math.random() * exactMatchMessage.length)]
                : exactMatchMessage;
            callback(randomMessage);
        } else {
            callback(null);
        }
    }); // this function will get the first result that is given and checked.
}
function verifyMessage() {
    getMessage('untrustedWebsites', (untrustedMessage) => { //if its untrsuted it will follow this logic
        if (untrustedMessage) {
            createPopup(untrustedMessage);
            timer();
        } else {
            getMessage('websiteMessages', (trustedMessage) => { //if its trusted it will follow this logic
                if (trustedMessage) {
                    createPopup(trustedMessage);
                    timer();
                }
            });
        }
        
    });
}

window.onload = verifyMessage;




