
//function for deleting the tooltip
function notneeded() {
    const tooltip = document.getElementById('Floating-Window');
    tooltip.remove();
}
function timer(){   
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
function Delete_verification(){
    if(document.getElementById('Floating-Window')){
        notneeded();
    } else{
        return;
    }
}
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
    closeButton.id = 'Closing';
    closeButton.onclick = notneeded;

    parentDiv.appendChild(contentDiv);
    parentDiv.appendChild(closeButton);
    popup.appendChild(parentDiv);
    document.body.appendChild(popup);
}

function popuplogic() {
    const url = window.location.href;
    if (url.includes('youtube.com')) {
        createPopup();
        document.getElementById('Content').innerHTML = 'Hey hi YouTube!';
        timer();
    } else if (url.includes('http://127.0.0.1:5500/main.html')) {
        createPopup();
        document.getElementById('Content').innerHTML = 'TestField';
        timer();
    } else {
        return;
    }
}

window.onload = popuplogic;


