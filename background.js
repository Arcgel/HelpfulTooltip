chrome.runtime.onInstalled.addListener(() => {

    const websiteMessages = {
        'youtube.com': [
            "Hey hi YouTube! Ready to lose track of time with 'just one more video'?",
            "Hello Youtube"
        ],
        "amazon.com": ["Welcome to Amazon! Your bank account is shaking in fear."],
        "facebook.com": ["Time to scroll through endless status updates and food pics on Facebook!"],
        "twitter.com": ["Welcome to Twitter! Hope you're ready for a tweetstorm."],
        "reddit.com": ["Reddit? Say goodbye to your productivity for the next few hours."],
        "netflix.com": ["Netflix: Where 'just one episode' turns into a season marathon."],
        "github.com": ["GitHub, where your code goes to meet bugs and endless commits."],
        "wikipedia.org": ["Ah, Wikipedia... Let's see how deep you can go into the rabbit hole."],
        "linkedin.com": ["Welcome to LinkedIn, where professionals connect and humble brag."],
        "instagram.com": ["Instagram, where reality is filtered and likes make the world go round."],
        //"google.com": ["Google knows everything. Even the things you thought you forgot."],
        "yahoo.com": ["Yahoo! Still surviving... somehow."],
        "bing.com": ["Bing: Still trying."],
        "chat.openai.com": ["ChatGPT: Here to make you wonder if bots will take over the world."],
        "stackoverflow.com": ["Stack Overflow: Where you copy-paste your way to success."],
        "github.com": ["GitHub: Because coding in one go is too mainstream."],
        "quora.com": ["Quora: Where random strangers argue about everything."],
        "tiktok.com": ["TikTok: 'I'll just watch one'—the biggest lie you tell yourself."],
        "pinterest.com": ["Pinterest: Where your DIY dreams go to die."],
        "whatsapp.com": ["WhatsApp: Because texting is just too simple."],
        "zoom.us": ["Zoom: You're on mute again, aren't you?"],
        "slack.com": ["Slack: Where productivity goes to chat."],
        "discord.com": ["Discord: The only thing more chaotic than the server is your sleep schedule."],
        "apple.com": ["Apple: Where everything costs an arm and a leg, but looks really cool."],
        "microsoft.com": ["Microsoft: Because sometimes things need 42 updates."],
        "spotify.com": ["Spotify: Curating your life's soundtrack, one ad at a time."],
        "netlify.com": ["Netlify: Deploying websites faster than you can debug them."],
        "dropbox.com": ["Dropbox: Where your files go to hide... somewhere in the cloud."],
        "zoom.us": ["Zoom: Where the mute button becomes the most powerful tool."],
        "paypal.com": ["PayPal: Conveniently draining your funds, one transaction at a time."],
        "127.0.0.1:5500/main.html": ["TestField - You're working locally, good luck debugging!"],
        "main.html" :[
            "Bug Fixed",
            "Hello World"
        ],
        //'docs.google.com': ["The most important thing is the document."],
        "https://docs.google.com/presentation/d/1KxhaocEwFEv9k_zdvc2jvVhqK0S17lBg/edit#slide=id.p1" : ["database management"]
    };
    
    const untrustedWebsites = {
        "kissanime.com.ru": [
            "Kissanime with a twist of Russia? Watch out for shady streams!",
            "Virus Infested Site"
        ], 
        "kissanime.ba": ["Is this the Kissanime you know? Or just a knockoff from nowhere?"],
        "aniwave.com.es": ["Spanish waves of anime or a sea of scams? Surf with caution!"]
    };

chrome.storage.local.set({ websiteMessages: JSON.stringify(websiteMessages) });
chrome.storage.local.set( {untrustedWebsites: JSON.stringify(untrustedWebsites)});

chrome.storage.local.get(['websiteMessages', 'untrustedWebsites'], (result) => {
    if (!result.websiteMessages) {
        chrome.storage.local.set({ websiteMessages });
    }
    if (!result.untrustedWebsites) {
        chrome.storage.local.set({ untrustedWebsites });
    }
});
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getMessages') {
        // Get stored messages for the content script
        chrome.storage.local.get(['websiteMessages', 'untrustedWebsites'], (result) => {
            sendResponse({
                websiteMessages: result.websiteMessages,
                untrustedWebsites: result.untrustedWebsites
            });
        });
        return true; // keep the message channel open for async sendResponse
    }

    if (request.action === 'saveMessage') {
        // Save new messages from the popup
        const { newsite, newmessage } = request.data;

        chrome.storage.local.get('websiteMessages', (result) => {
            let storedMessages = JSON.parse(result.websiteMessages || '{}');

            if (storedMessages[newsite]) {
                if (Array.isArray(storedMessages[newsite])) {
                    storedMessages[newsite].push(newmessage);
                } else {
                    storedMessages[newsite] = [storedMessages[newsite], newmessage];
                }
            } else {
                storedMessages[newsite] = [newmessage];
            }

            chrome.storage.local.set({ websiteMessages: JSON.stringify(storedMessages) }, () => {
                sendResponse({ status: 'success' });
            });
        });
        return true;
    }
});