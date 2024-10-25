chrome.runtime.onInstalled.addListener(() => {

    const websiteMessages = { //For trusted website and showing messaages if the site is found
        "youtube.com": [
            "Seek to Specific Time: Press a number key (0-9) to jump to a specific percentage of the video (e.g., 5 jumps to 50%).",
            "Play/Pause: Press the spacebar or K to play or pause the video.",
            "Subtitle Controls: Press C to turn captions on or off, and + or - to increase or decrease caption font size."
        ],
        "amazon.com": [
            "Use Price Trackers to monitor product prices.",
            "Take Advantage of Lightning Deals & Coupons for extra savings.",
            "Read Customer Reviews Carefully to make informed purchases."
        ],
        "reddit.com": [
            "Follow Reddit Etiquette: Familiarize yourself with subreddit rules to avoid bans.",
            "Use the Search Function to find answers before asking questions.",
            "Utilize the Upvote/Downvote System to promote valuable content."
        ],
        "github.com": [
            "Use Branches to manage features and bug fixes separately.",
            "Write Clear Commit Messages to document your changes.",
            "Utilize GitHub Actions to automate testing and deployment."
        ],
        "wikipedia.org": [
            "Use the Table of Contents to navigate long articles quickly.",
            "Check the References section for more in-depth information.",
            "Edit articles to contribute to the community and improve information."
        ],
        "linkedin.com": [
            "Keep your profile updated to attract potential employers.",
            "Engage with content by commenting and sharing to expand your network.",
            "Use keywords in your profile to improve search visibility."
        ],
        "google.com": [
            "Use quotation marks for exact phrase searches.",
            "Search by file type using 'filetype:pdf' to find specific document formats.",
            "Utilize Google Scholar for academic research."
        ],
        "bing.com": [
            "Try Bing rewards for points on searches.",
            "Use image search for reverse image searches.",
            "Explore the news section for trending stories."
        ],
        "stackoverflow.com": [
            "Search for similar questions before posting.",
            "Use code formatting (```) to improve readability in your questions.",
            "Upvote helpful answers to support the community."
        ],
        "tiktok.com": [
            "Use trending hashtags to increase visibility.",
            "Engage with other users through comments and duets.",
            "Experiment with different video lengths to see what resonates."
        ],
        "pinterest.com": [
            "Create boards for organizing your ideas.",
            "Use the search bar to discover new content based on your interests.",
            "Follow users with similar interests for inspiration."
        ],
        "discord.com": [
            "Use the search function to find messages in large servers.",
            "Create custom emojis for personal server branding.",
            "Utilize voice channels for real-time discussions."
        ],
        "spotify.com": [
            "Create playlists for different moods and occasions.",
            "Discover new music with Spotify's curated playlists.",
            "Share your playlists with friends for collaborative listening."
        ],
        "netlify.com": [
            "Use continuous deployment to automatically update your site on changes.",
            "Deploy directly from your Git repository for easy integration.",
            "Utilize forms to capture user data without additional backend code."
        ],
        "dropbox.com": [
            "Use file requests to collect files from others.",
            "Share links with expiration dates for enhanced security.",
            "Use version history to restore previous versions of files."
        ],
        "zoom.us": [
            "Use breakout rooms for group activities in larger meetings.",
            "Record meetings for later reference or sharing.",
            "Enable virtual backgrounds for a professional appearance."
        ],
        "paypal.com": [
            "Enable two-factor authentication for added security.",
            "Use PayPal.me links to easily request payments.",
            "Check for buyer protection on eligible purchases."
        ],
        "127.0.0.1:5500/main.html": [
            "TestField - You're working locally, good luck debugging!",
            "Use console.log() to check values during development.",
            "Refresh frequently to see changes as you code."
        ],
        "main.html": [
            "Bug Fixed",
            "Hello World",
            "Ensure all links are functional before deployment."
        ]
    };

    const untrustedWebsites = { //For untrusted website and showing messaages if the site is found to warn the user
        "kissanime.com.ru": [
            "Kissanime with a twist of Russia? Watch out for shady streams!",
            "Virus Infested Site"
        ],
        "kissanime.ba": ["Is this the Kissanime you know? Or just a knockoff from nowhere?"],
        "aniwave.com.es": ["Spanish waves of anime or a sea of scams? Surf with caution!"]
    };

    chrome.storage.local.set({ websiteMessages: JSON.stringify(websiteMessages) });     /*For storing messages in chrome storage*/
    chrome.storage.local.set({ untrustedWebsites: JSON.stringify(untrustedWebsites) });

    chrome.storage.local.get(['websiteMessages', 'untrustedWebsites'], (result) => {
        if (!result.websiteMessages) {
            chrome.storage.local.set({ websiteMessages });
        }
        if (!result.untrustedWebsites) {
            chrome.storage.local.set({ untrustedWebsites });
        }
    });
}); //Checking if the messages are in chrome storage

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getMessages') {
        // Get stored messages for the content script
        chrome.storage.local.get(['websiteMessages', 'untrustedWebsites'], (result) => {
            sendResponse({
                websiteMessages: result.websiteMessages,/*Sending the messages to main.js so it can be displayed */
                untrustedWebsites: result.untrustedWebsites
            });
        });
        return true; // keep the message channel open for async sendResponse
    }

    if (request.action === 'saveMessage') {  //Recieving messages from form.js so that users can have thier own messages
        const { newsite, newmessage } = request.data;

        chrome.storage.local.get('websiteMessages', (result) => {
            let storedMessages = JSON.parse(result.websiteMessages || '{}'); //Adding the data on the array

            if (storedMessages[newsite]) {
                if (Array.isArray(storedMessages[newsite])) {
                    storedMessages[newsite].push(newmessage); //Pushing the new message if Site and an Array of Message already exists
                } else {
                    storedMessages[newsite] = [storedMessages[newsite], newmessage]; //Creating a new array if there's only one message
                }
            } else {
                storedMessages[newsite] = [newmessage];  // it essentially create a new site and add the message.
            }

            chrome.storage.local.set({ websiteMessages: JSON.stringify(storedMessages) }, () => {
                sendResponse({ status: 'success' }); ///checking if it got pass through
            });
        });
        return true;
    }
});