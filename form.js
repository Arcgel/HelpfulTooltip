function copyhref(){
    const url = window.location.href;
    document.getElementById('website').value = url;
}

document.getElementById('buttomicon').onclick = copyhref;

function submit(event){
event.preventDefault();
let storedMessages = JSON.parse(localStorage.getItem('websiteMessages')) || {};

let newsite = document.getElementById('website').value;
let newmessage = document.getElementById('message').value;

if (storedMessages[newsite]){
    if(Array.isArray(storedMessages[newsite])){
        storedMessages
    }else{
        storedMessages[newsite] = [storedMessages[newsite],[newmessage]];
    }
}else{
    storedMessages[newsite] = [newmessage];
}

localStorage.setItem('websiteMessages', JSON.stringify(storedMessages));

document.getElementById('website').value = '';
document.getElementById('message').value = '';

}

document.getElementById('UTTSites').onsubmit = submit;