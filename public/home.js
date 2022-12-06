function login(){
    let request = new XMLHttpRequest;
    request.open('GET', '/loadMoreDataLogin');
    request.send();
    request.addEventListener('load', function(){
        
    })
}

function loadMore(){
    let request = new XMLHttpRequest;
    request.open('GET', '/loadMoreData');
    request.send();
    request.addEventListener('load', function(){
        let obj1 = JSON.parse(request.responseText)
        for(i = 0; i < obj1.length; i++){
            let container = document.getElementById("hhhhh");
            let flag = document.getElementsByClassName("child");
            flag = flag.length;
            let child = document.createElement('div');
            child.setAttribute("class", "child");
            let img = document.createElement("img");
            img.setAttribute("id", "img");
            img.src = obj1[i].image;
            child.appendChild(img);
            let pName = document.createElement("h3");
            pName.setAttribute("id", "pName");
            pName.innerHTML = obj1[i].productName;
            child.appendChild(pName);
            let p = document.createElement("p");
            let b = document.createElement("b");
            b.setAttribute("id", "details");
            b.innerHTML = obj1[i].price;
            p.appendChild(b);
            child.appendChild(p);
            let divTest = document.createElement("div");
            divTest.setAttribute("id", "divTest");
            let cart = document.createElement("input");
            cart.setAttribute("type", "button");
            cart.setAttribute("class", "button2");
            cart.setAttribute("id", `btn2${flag}`);
            cart.setAttribute("value", "Add To Cart");
            cart.setAttribute("onclick", "addItemToCart(id)");
            divTest.appendChild(cart)
            let input = document.createElement("input");
            input.setAttribute("type", "button");
            input.setAttribute("class", "button1");
            input.setAttribute("id", `btn${flag}`);
            input.setAttribute("value", "View Details");
            input.setAttribute("onclick", "loadDialogBox(id)");
            divTest.appendChild(input)
            child.appendChild(divTest);
            container.appendChild(child);
            flag++;
        }   
    })
}

function load(){
    let request = new XMLHttpRequest;
    request.open('GET', '/loadMoreData');
    request.send();
    request.addEventListener('load', function(){
        let obj1 = JSON.parse(request.responseText)
        for(i = 0; i < obj1.length; i++){
            let container = document.getElementById("hhhhh");
            let flag = document.getElementsByClassName("child");
            flag = flag.length;
            let child = document.createElement('div');
            child.setAttribute("class", "child");
            let img = document.createElement("img");
            img.setAttribute("id", "img");
            img.src = obj1[i].image;
            child.appendChild(img);
            let pName = document.createElement("h3");
            pName.setAttribute("id", "pName");
            pName.innerHTML = obj1[i].productName;
            child.appendChild(pName);
            let p = document.createElement("p");
            let b = document.createElement("b");
            b.setAttribute("id", "details");
            b.innerHTML = obj1[i].price;
            p.appendChild(b);
            child.appendChild(p);
            let divTest = document.createElement("div");
            divTest.setAttribute("id", "divTest");
            let cart = document.createElement("a");
            cart.setAttribute("class", "button2");
            cart.setAttribute("href", "/login");
            cart.innerHTML = "Add to Cart";
            divTest.appendChild(cart)
            let input = document.createElement("input");
            input.setAttribute("type", "button");
            input.setAttribute("class", "button1");
            input.setAttribute("id", `btn${flag}`);
            input.setAttribute("value", "View Details");
            input.setAttribute("onclick", "loadDialogBox(id)");
            divTest.appendChild(input)
            child.appendChild(divTest);
            container.appendChild(child);
            flag++;
        }   
    })
}

function loadDialogBox(id){
    id = id.slice(3);
    dialog.open = true;
    let request = new XMLHttpRequest;
    request.open('GET', '/getData');
    request.send();
    request.addEventListener('load', function(){
        let obj = JSON.parse(request.responseText)
        let dialogIMG = document.getElementById("dialogIMG");
        dialogIMG.src = obj[id].image;
        let dialogH3 = document.getElementById("dialogH3");
        dialogH3.innerHTML = obj[id].productName;
        let dialogH1 = document.getElementById("dialogH1");
        dialogH1.innerHTML = obj[id].price;
        let dialogP = document.getElementById("dialogP");
        dialogP.innerHTML = obj[id].details;
    })
}

function closeDialogBox(){
    let dialog = document.getElementById("dialog");
    dialog.open = false;
}

function addItemToCart(id){
    let p = id;
    id = id.slice(4);
    // console.log(id)
    let request = new XMLHttpRequest;
    request.open('POST', '/cart');
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ id }));
    request.addEventListener('load', function(){
        let cartBtn = document.getElementById(p);
        cartBtn.value = "Added";
        cartBtn.disabled = true;
    })
}