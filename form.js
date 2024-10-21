function copyhref(){
    const url = window.location.href;
    document.getElementById('website').value = url;
}

document.getElementById('buttomicon').onclick = copyhref;