function copyhref(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        let currentTabUrl = tabs[0].url;
        document.getElementById('website').value = currentTabUrl;
    });
}
document.getElementById('buttomicon').onclick = copyhref;

function submit(event) {
    event.preventDefault();

    let newsite = document.getElementById('website').value;
    let newmessage = document.getElementById('message').value;

    let localData = JSON.parse(localStorage.getItem('userMessages') || '{}');
    localData[newsite] = newmessage;
    localStorage.setItem('userMessages', JSON.stringify(localData));

    chrome.runtime.sendMessage({
        action: 'saveMessage',
        data: { newsite, newmessage }
    }, (response) => {
        if (response.status === 'success') {
            console.log('Message saved successfully!');
            document.getElementById('website').value = '';
            document.getElementById('message').value = '';
        }
    });
}

document.getElementById('UTTSites').onsubmit = submit;