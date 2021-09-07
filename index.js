const dataURL = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/8658.json';
let d3 = require("d3@6", "d3-contour@2");

document.getElementById('passData').addEventListener('click', dataTable);

// function getData(){
//     fetch(dataURL)
//         .then((res) => res.json())
//         .then((data) => {
//             let output = '<h2>Data</h2>';
//             data.forEach(function (datum) {
//                 if(datum.type["name"] === "Pass"){ 
//                     output += `
//                         <div>
//                         <li>ID: ${datum.id} </li>
//                         <li>time: ${datum.timestamp} </li>
//                         <li>team: ${datum.team["name"]} </li>
//                         <li>player: ${datum.player["name"]} </li>
//                         <li>type: ${datum.type["name"]} </li>
//                         <li>recipient: ${datum.pass.recipient} </li>
//                         <br>
//                         </div>
//                     `;
//                 }
//             });

//             document.getElementById('passDataList').innerHTML = output;
//         })
// }

function selectMode(){
    const matchModes = document.getElementById('dropbtn');
    let selectedMode = matchModes.options[matchModes.selectedIndex].value;
    alert(selectedMode);
    return(selectedMode);
    
}
console.log(selectMode());

function dataTable(){
    fetch(dataURL).then(
        res=> {
            res.json().then(
                data=>{
                    // adjusting 2nd half minutes
                    data.forEach((el) => {
                        if (el.period === 2){
                            el.minute += 45;
                        }
                    })

                    if(data.length > 0){
                        let temp= "";

                        // -- star for loop
                        data.forEach((el) => {
                            if (el.type["name"] === "Pass"){
                                temp += "<tr>";
                                temp += "<td>" + el.period + "</td>";
                                temp += "<td>" + el.timestamp.slice(0,5) + "</td>";
                                temp += "<td>" + el.team.name + "</td>";
                                temp += "<td>" + el.player.name + "</td>";
                                temp += "<td>" + el.type.name + "</td>";
                                temp += "<td>" + el.pass.recipient + "</td>";
                                temp += "<td>" + el.location + "</td>";
                                temp += "<td>" + el.pass.end_location + "</td>";
                                temp += "<td>" + el.pass.length + "</td>";
                                temp += "<td>" + el.pass.angle + "</td></tr>";
                            }
                        })
                        // --close for loop

                        let tablePos = document.getElementById("data");
                        tablePos.insertAdjacentHTML('afterend',temp);                    
                    }
                }
            ).catch(error => {
                throw Error("ERROR: no data found");
            })
        }
    )
}


// Countours
let margin = { top: 80, right: 25, bottom: 30, left: 40 },
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

let svg = d3.select("#fieldSVG")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

