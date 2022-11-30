function decrease(id){
    // console.log(id)
    let request = new XMLHttpRequest();
    request.open('POST' ,'/qty');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ val: 0, id }));
    request.addEventListener('load', () => {
        let qty = document.getElementById(`${id}`);
        qty = qty.parentNode.parentNode.parentNode.children[3].children[0];
        qty.innerHTML = JSON.parse(request.responseText);
    })
}

function increase(id){
    // console.log(id)
    let request = new XMLHttpRequest();
    request.open('POST' ,'/qty');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ val: 1, id }));
    request.addEventListener('load', () => {
        let qty = document.getElementById(`${id}`);
        qty = qty.parentNode.parentNode.parentNode.children[3].children[0];
        qty.innerHTML = JSON.parse(request.responseText);
    })
}

function deleteData(id){
    console.log(id)
    let request = new XMLHttpRequest();
    request.open('POST' ,'/delete');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ id }));
    request.addEventListener('load', () => {
        window.location.reload();
    })
}