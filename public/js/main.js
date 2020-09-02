const message = document.querySelector('.message');

if(message.innerHTML === ''){
    message.style.right = '0';
}else{
    message.style.right = '20px';
    setTimeout(() => {
        message.style.right = '-100%'
        message.innerHTML = '';
    }, 5000);
}