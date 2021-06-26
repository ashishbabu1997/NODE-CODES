
var req = new XMLHttpRequest();
req.open('GET', `${document.location}?js=true`, false);
req.send(null);
var token = req.getResponseHeader('Authorisation');


function click_handler2(event) {
    let name = event.target.getAttribute('name');
    console.log("name : ", name);
    fetch('../candidates/emailTemplate', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
             "Accept":"text/html"
        },
        body: JSON.stringify({ html: true, file: name, Authorisation: token })
    }).then(async(response) => {
        let content = await response.text();
        document.getElementById("demo").innerHTML = content;
    })

}

var list = document.getElementsByClassName("list-span");
for (var i = 0; i < list.length; i++) {
    list[i].addEventListener("click", click_handler2, false);
}