console.log("Hello !!!");

document.getElementById("form").addEventListener("submit", event => {
    event.preventDefault();

    const firstCity = document.getElementById("firstCity").value;
    const secondCity = document.getElementById("secondCity").value;

    console.log(firstCity);
    console.log(secondCity);

    const method = document.getElementsByName("method");

    if (method[0].checked) {
        console.log("Promise");
    } else {
        console.log("Async/Await");
    }
})