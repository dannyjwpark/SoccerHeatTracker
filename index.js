let req = new XMLHttpRequest();
let mapMode = "Pass";   // preset to pass
let matchid = 8658; //preset to final
let matchName;
const dataURL = `https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${matchid}.json`;
const csvURL = "dist/assets/data/worldcup_match_id.csv";

// Loading csv and retrieving match data
let matchList = { "Group Stage": [], "Round of 16": [], "Quarter-finals": [], "Semi-finals": [], "3rd Place Final": [], "Final": [] };
let stages = Object.keys(matchList);
// const loadCSV = d3.csv(csvURL).then(function (data) {
//     data.forEach(function (datum) {
//         // console.log(datum.home_team + " vs " + datum.away_team);
//         for (let i = 0; i < stages.length; i++) {
//             if (datum["competition_stage"] === stages[i]) {
//                 let tmp = {};
//                 tmp.match_id = datum["match_id"];
//                 tmp.match_name = datum["home_team"] + " vs " + datum["away_team"];
//                 matchList[stages[i]].push(tmp); 
//             }
//         }
//     })
//     return matchList;
// })
// loadCSV;

async function loadData(){
    const matchtable = await d3.csv(csvURL).then(function (data) {
        data.forEach(function (datum) {
            // console.log(datum.home_team + " vs " + datum.away_team);
            for (let i = 0; i < stages.length; i++) {
                if (datum["competition_stage"] === stages[i]) {
                    let tmp = {};
                    tmp.match_id = datum["match_id"];
                    tmp.match_name = datum["home_team"] + " vs " + datum["away_team"];
                    matchList[stages[i]].push(tmp);
                }
            }
        })

        return matchList;
    })
};
loadData();


// get and set map mode
let modeSelection = document.getElementsByClassName("chooseMode");

for (let i = 0; i < modeSelection.length; i++) {
    modeSelection[i].addEventListener("click", function () {
        modeName = modeSelection[i];
        if (modeName.innerHTML === "Shooting") {
            mapMode = "Shot"
        } else {
            mapMode = "Pass"
        }
        document.getElementById("demo2").innerHTML = modeName.innerHTML;
        console.log("mode: " + modeName.innerHTML);
    });
}



// Populate matches dropdown
let match_32 = document.getElementById("match_32");
let match_16 = document.getElementById("match_16");
let match_8 = document.getElementById("match_8");
let match_4 = document.getElementById("match_4");
let match_3 = document.getElementById("match_3");
let match_1 = document.getElementById("match_1");

let el = document.createElement("li");
// el.innerHTML = `<a href="#" class="chooseMatch">Russia vs Saudi Arabia</a>`;

// ensure wait loading (w/ asyncfunction)

el.innerHTML = `<a href="#" class="chooseMatch">${matchList[stages[0]][0].match_name}</a>`

match_32.appendChild(el);




for(let i = 0; i < stages.length; i++) {
    let obj = matchList[stages[i]];
    for(let j=0; j < obj.length; j++){
        let el = document.createElement("li");
        el.innerHTML = `<a href="#" class="chooseMatch">${obj[j]["match_name"]}</a>`;
        // el.textContent = `<a href="#" class="chooseMatch">${obj[j]["match_name"]}</a>`;
        // el.value = obj[j]["match_id"];
        if (stages[i] === "Group Stage") {
            match_32.appendChild(el);
        } else if (stages[i] === "Round of 16") {
            match_16.appendChild(el);
        } else if (stages[i] === "Quarter-finals") {
            match_8.appendChild(el);
        } else if (stages[i] === "Semi-finals") {
            match_4.appendChild(el);
        } else if (stages[i] === "3rd Place Final") {
            match_3.appendChild(el);
        } else if (stages[i] === "Final") {
            match_1.appendChild(el);
        }
    }
}


// get metch name and map mode from user's clicks
let matchSelection = document.getElementsByClassName("chooseMatch");

for (let i = 0; i < matchSelection.length; i++) {
    matchSelection[i].addEventListener("click", function () {
        matchName = matchSelection[i].innerHTML;
        document.getElementById("demo1").innerHTML = matchName;
        // matchid = matchSelection[i].value;
        console.log("matchName: " + matchName);
        // console.log("matchid: " + matchid);
        dataFilter();
    });
}


// filtering data
let filtered_data;

function dataFilter() {
    fetch(dataURL).then(
        res => {
            res.json().then(
                data => {
                    // adjusting 2nd half minutes
                    data.forEach((el) => {
                        if (el.period === 2) {
                            el.minute += 45;
                        }
                    })

                    if (data.length > 0) {
                        // let temp= "";

                        // // -- star for loop
                        // data.forEach((el) => {
                        //     if (el.type["name"] === "pass"){

                        //         temp += "<tr>";
                        //         temp += "<td>" + el.period + "</td>";
                        //         temp += "<td>" + el.timestamp.slice(0,5) + "</td>";
                        //         temp += "<td>" + el.team.name + "</td>";
                        //         temp += "<td>" + el.player.name + "</td>";
                        //         temp += "<td>" + el.type.name + "</td>";
                        //         temp += "<td>" + el.location + "</td>";
                        //         temp += "<td>" + el.pass.end_location + "</td>";
                        //         temp += "<td>" + el.pass.length + "</td>";
                        //         temp += "<td>" + el.pass.angle + "</td></tr>";
                        //     }
                        // })
                        // --close for loop

                        let filteredData = [];
                        data.forEach((datum) => {
                            let temp = {};
                            if (datum.type["name"] === "Pass") {
                                temp.id = datum.id;
                                temp.period = datum.period;
                                temp.timestamp = datum.timestamp.slice(0, 5);
                                temp.teamname = datum.team.name;
                                temp.playername = datum.player.name;
                                temp.event = datum.type.name;
                                temp.pass_start_loc = datum.location;
                                temp.pass_end_loc = datum.pass.end_location;
                                temp.pass_length = datum.pass.length;
                                temp.pass_angle = datum.pass.angle;
                            }
                            filteredData.push(temp);
                        })

                        console.log(filteredData);
                        filtered_data = filteredData;
                        return filtered_data;

                        // let tablePos = document.getElementById("data");
                        // tablePos.insertAdjacentHTML('afterend',temp);                    
                    }
                }
            ).catch(error => {
                throw Error("ERROR: no data found");
            })
        }
    )
}





// field









