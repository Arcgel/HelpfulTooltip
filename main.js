
const websiteMessages = {
    "youtube.com": "Hey hi YouTube! Ready to lose track of time with 'just one more video'?",
    "amazon.com": "Welcome to Amazon! Your bank account is shaking in fear.",
    "facebook.com": "Time to scroll through endless status updates and food pics on Facebook!",
    "twitter.com": "Welcome to Twitter! Hope you're ready for a tweetstorm.",
    "reddit.com": "Reddit? Say goodbye to your productivity for the next few hours.",
    "netflix.com": "Netflix: Where 'just one episode' turns into a season marathon.",
    "github.com": "GitHub, where your code goes to meet bugs and endless commits.",
    "wikipedia.org": "Ah, Wikipedia... Let's see how deep you can go into the rabbit hole.",
    "linkedin.com": "Welcome to LinkedIn, where professionals connect and humble brag.",
    "instagram.com": "Instagram, where reality is filtered and likes make the world go round.",
    "google.com": "Google knows everything. Even the things you thought you forgot.",
    "yahoo.com": "Yahoo! Still surviving... somehow.",
    "bing.com": "Bing: Still trying.",
    "chat.openai.com": "ChatGPT: Here to make you wonder if bots will take over the world.",
    "stackoverflow.com": "Stack Overflow: Where you copy-paste your way to success.",
    "github.com": "GitHub: Because coding in one go is too mainstream.",
    "quora.com": "Quora: Where random strangers argue about everything.",
    "tiktok.com": "TikTok: 'I'll just watch one'—the biggest lie you tell yourself.",
    "pinterest.com": "Pinterest: Where your DIY dreams go to die.",
    "whatsapp.com": "WhatsApp: Because texting is just too simple.",
    "zoom.us": "Zoom: You're on mute again, aren't you?",
    "slack.com": "Slack: Where productivity goes to chat.",
    "discord.com": "Discord: The only thing more chaotic than the server is your sleep schedule.",
    "apple.com": "Apple: Where everything costs an arm and a leg, but looks really cool.",
    "microsoft.com": "Microsoft: Because sometimes things need 42 updates.",
    "spotify.com": "Spotify: Curating your life's soundtrack, one ad at a time.",
    "netlify.com": "Netlify: Deploying websites faster than you can debug them.",
    "dropbox.com": "Dropbox: Where your files go to hide... somewhere in the cloud.",
    "zoom.us": "Zoom: Where the mute button becomes the most powerful tool.",
    "paypal.com": "PayPal: Conveniently draining your funds, one transaction at a time.",
    "127.0.0.1:5500/main.html": "TestField - You're working locally, good luck debugging!",
    "default": "Welcome to the Internet, where every click is a new adventure!"
};

const untrustedWebsites = {
    "vivobarefootshoesza.co.za": "Beware! This site might be as fragile as its barefoot promises.",
    "vivobarefootshoes.co.za": "Tread carefully, your wallet might not stay as light as your feet.",
    "vivobarefootlondon.com": "Is it really from London, or just another imposter? Proceed with caution!",
    "vivoshoeuk.com": "UK shoes? Or just a fancy URL? Don't let your guard down!",
    "vivobarefotsale.com": "Big sale or big scam? Watch your step on this site!",
    "vivobarafootshoesca.com": "Canada calling... or is it? Make sure to double-check!",
    "vivoskonorge.com": "Norway might be far, but so could be your chances of getting those shoes.",
    "vivobarefootnorgeno.com": "Another Norway-based site? Make sure it’s legit before you step in.",
    "vivobarefootsverige.com.se": "Sverige in the URL, but are the deals real? Time to investigate!",
    "vivobarefootromaniaro.com": "Romania or not, this site looks like it needs a second glance.",
    "vivobarefootpt.com": "Portugal promises but who knows if it delivers. Be cautious.",
    "vivobarefootdanmark.top": "Top deals from Denmark? Or top-notch phishing? You decide.",
    "groundiesblackfriday.com": "Black Friday forever? Feels too good to be true. Keep an eye out!",
    "groundiesaustraliasale.com": "Australia's sale or just another mirage? Stay on your toes.",
    "groundiesbarefootaustralia.com": "Barefoot in Australia or walking into a trap? Tread wisely.",
    "default": "Welcome to a suspicious site. Be extra careful, and double-check before proceeding!"
};

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

function showMessageForWebsite() {
    const url = window.location.href;
    let message = websiteMessages["default"];

    for (let site in websiteMessages) {
        if (url.includes(site)) {
            message = websiteMessages[site];
            break;
        }
    }

    createPopup(message);
}

window.onload = function () {
    showMessageForWebsite();

    let timeLeft = 10;
    const countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            notneeded();
        } else {
            timeLeft--;
        }
    }, 1000);
};
