function notneeded(){
    const tooltip = document.getElementById('Floating-Window');
    tooltip.remove();
}
window.onload = function(){
    const url = window.location.href;
    if(url.includes('youtube.com')){
        console.log(url)
        function content(){
            document.getElementById('Content').innerHTML = 'Working'
        }
        content();
    }else if(url.includes('http://127.0.0.1:5500/main.html')){
        function content(){
            document.getElementById('Content').innerHTML = 'TestField'
        }
        content();
    }else{
        notneeded();
    }
}

