const dataURL = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/8658.json';

// fetching JSON data from the source
async function getSoccerData() {
    // const response = await fetch(dataURL);
    // const data = await response.json();   
    fetch(dataURL)
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err))
};

getSoccerData();

// let dataButton = document.getElementById('showData');
// if(dataButton){
//     dataButton.addEventListener('click', getPassData);
// }
function getPassData(){
    fetch(dataURL)
        .then((res) => res.json())
        .then((data) => {
            let output = '<h2>Data</h2>';
            data.forEach(function (datum) {
                if(datum.type["name"] === "Pass"){
                output += `
                <ul>
                    <li>ID: ${datum.id} </li>
                    <li>time: ${datum.timestamp} </li>
                    <li>team: ${datum.team["name"]} </li>
                    <li>type: ${datum.type["name"]} </li>
                </ul>
                `;
            }
            });
            document.getElementById('dataList').innerHTML = output;
        })
}
getPassData()