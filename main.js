
function notneeded() {
    const tooltip = document.getElementById('Floating-Window');
    tooltip.remove();
}

window.onload = function() {
    const url = window.location.href;

    if (url.includes('youtube.com')) {
        document.getElementById('Content').innerHTML = 'Hey hi YouTube!';
    } else if (url.includes('http://127.0.0.1:5500/main.html')) {
        document.getElementById('Content').innerHTML = 'TestField';
    } else {
        notneeded();
    }

    let timeLeft = 10;
    const countdown = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(countdown);
            notneeded(); // Remove the popup after countdown ends
        } else {
            timeLeft--;
        }
    }, 1000);
};
// Function to create the popup
function createPopup() {
    const existingPopup = document.getElementById('Floating-Window');
    if (existingPopup) return;

    // Create popup div
    const popup = document.createElement('div');
    popup.id = 'Floating-Window';
    popup.className = 'Floating-window';

    const parentDiv = document.createElement('div');
    parentDiv.id = 'parent';//wrapper for the content and div
    parentDiv.className = 'parent'

    const contentDiv = document.createElement('div');
    contentDiv.id = 'Content'; // This is where the message will be displayed

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.className = 'closing';
    closeButton.onclick = notneeded;

    parentDiv.appendChild(contentDiv);
    parentDiv.appendChild(closeButton);
    popup.appendChild(parentDiv);
    document.body.appendChild(popup);
}

createPopup();