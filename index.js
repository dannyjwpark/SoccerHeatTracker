const dataURL = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/8658.json';

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

function dataTable(){
    fetch(dataURL).then(
        res=> {
            res.json().then(
                data=>{
                    console.log(data);
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
                                temp += "<td>" + el.pass.length + "</td>";
                                temp += "<td>" + el.pass.angle + "</td></tr>";
                            }
                        })
                        // --close for loop

                        document.getElementById("data").innerHTML = temp;                    }
                }
            )
        }
    )
}

// dataTable();
