const dataURL = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/8658.json';

// fetching JSON data from the source
async function getSoccerData() {
    // const response = await fetch(dataURL);
    // const data = await response.json();

    fetch(dataURL)
    .then((res) => res.json())
    .then((data) => {
        document.getElementById('output').innerHTML = data;
    })
    .catch((err) => console.log(err))
};

getSoccerData();

