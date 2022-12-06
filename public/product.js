function deleteProduct(id){
    let request = new XMLHttpRequest();
    request.open('POST' ,'/deleteProduct');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ id }));
    request.addEventListener('load', () => {
        window.location.reload();
    })
}