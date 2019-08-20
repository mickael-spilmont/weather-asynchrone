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

// Asynchrone function, show the results of two getWeather() with await
async function showResultsAsync(firstCity, secondCity, result) {
    const responses = new Array();

    try {
        responses.push(await getWeather(firstCity));
        responses.push(await getWeather(secondCity));

        for(element of responses) {
            result.innerHTML += `
                ${element.city_info.name} : 
                ${element.current_condition.condition} ; 
                ${element.current_condition.tmp}°<br>
                `;
        }

    } catch(error) {
        console.log(`The request failed ${error}`);
        result.innerHTML = "An error has occurred !";
    }
}

// Get formulary data on submit
document.getElementById("form").addEventListener("submit", event => {
    event.preventDefault();

    const result = document.getElementById("result");
    result.innerHTML = "";

    const firstCity = document.getElementById("firstCity").value;
    const secondCity = document.getElementById("secondCity").value;

    // console.log(firstCity);
    // console.log(secondCity);

    const method = document.getElementsByName("method");

    // if promised is checked, we use promise all to retrieve the results of the requests
    if (method[0].checked) {
        console.log("Promise");
        Promise.all([getWeather(firstCity), getWeather(secondCity)]).then(responses => {

            for(element of responses) {
                result.innerHTML += `
                    ${element.city_info.name} : 
                    ${element.current_condition.condition} ; 
                    ${element.current_condition.tmp}°<br>
                    `;
            }

        }, error => {
            console.log(`Error status : ${error}`);
            result.innerHTML = "An error has occurred !";
        })

    // if async/await is checked, we use asynchrone function showResultsAsync() to retrieve the results of the requests
    } else {
        console.log("Async/Await");
        showResultsAsync(firstCity, secondCity, result);
    }
});