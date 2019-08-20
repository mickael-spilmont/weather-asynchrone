// Launch GET request at www.prevision-meteo.ch, and return a promise
function getWeather(city) {
    const request = new XMLHttpRequest();
    return new Promise((resolve, reject) => {

        // Warning : arrow function does not allow use of "this" in this case
        request.onreadystatechange = function() {
            if(this.readyState == XMLHttpRequest.DONE && this.status === 200) {
                const response = JSON.parse(this.responseText);
                resolve(response);
            } else if(this.readyState == XMLHttpRequest.DONE) {
                reject(new Error(`The request have failed with code ${this.status}`));
            }
        };
        request.open('GET', `https://www.prevision-meteo.ch/services/json/${city}`);
        request.send();
    });
};

// Function that processes requests using promise.all
function showResultsPromise(firstCity, secondCity) {
    console.log("Promise");
    Promise.all([getWeather(firstCity), getWeather(secondCity)]).then(responses => {
        updateHtml(responses);

    }, error => {
        console.log(`Error status : ${error}`);
        document.getElementById("result").innerHTML = "An error has occurred !";
    })
}

// Asynchrone function, show the results of two getWeather() with await
async function showResultsAsync(firstCity, secondCity) {
    console.log("Async/Await");
    const responses = new Array();

    try {
        responses.push(await getWeather(firstCity));
        responses.push(await getWeather(secondCity));
        
        updateHtml(responses);

    } catch(error) {
        console.log(`The request failed ${error}`);
        document.getElementById("result").innerHTML = "An error has occurred !";
    }
}

// Print result on Html page
function updateHtml(responses) {
    const result = document.getElementById("result");
    result.innerHTML = "";

    for(element of responses) {
        result.innerHTML += `
            ${element.city_info.name} : 
            ${element.current_condition.condition} ; 
            ${element.current_condition.tmp}°<br>
            `;
    }
}

// Get formulary data on submit
document.getElementById("form").addEventListener("submit", event => {
    event.preventDefault();

    const firstCity = document.getElementById("firstCity").value;
    const secondCity = document.getElementById("secondCity").value;

    // console.log(firstCity);
    // console.log(secondCity);

    const method = document.getElementsByName("method");

    // Allow to use "promise" or "async/await" according to the choice of the user
    method[0].checked ? showResultsPromise(firstCity, secondCity) : showResultsAsync(firstCity, secondCity);
});