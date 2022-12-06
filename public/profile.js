let confirmPassword = document.getElementById('confirmPassword');
let newPassword = document.getElementById('changePassword');
let btn = document.getElementById('button');
btn.style.backgroundColor = 'grey';
btn.disabled = true;

function confirm(){
    if(newPassword.value == confirmPassword.value && newPassword.value != "" && confirmPassword.value != ""){
        btn.style.backgroundColor = 'teal';
        btn.disabled = false;
    }
    else{
        btn.style.backgroundColor = 'grey';
        btn.disabled = true;
    }
}