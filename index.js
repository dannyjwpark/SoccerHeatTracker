const dataURL = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/8658.json';
const csvURL = "dist/assets/data/worldcup_match_id.csv";
let req = new XMLHttpRequest();
let mapMode = "Pass";
let matchid;
let matchName;


// get metch name and map mode from user's clicks
let matchSelection = document.getElementsByClassName("chooseMatch");

for(let i=0; i<matchSelection.length; i++){
    matchSelection[i].addEventListener("click", function(){
        matchName = matchSelection[i].innerHTML;
        document.getElementById("demo1").innerHTML = matchName;
        console.log("matchName: " + matchName);
        dataFilter();
    });
}

// object of all the matches
let modeSelection = document.getElementsByClassName("chooseMode");

for (let i = 0; i < modeSelection.length; i++) {
    modeSelection[i].addEventListener("click", function () {
        modeName = modeSelection[i];
        if(modeName.innerHTML==="Shooting"){
            mapMode = "Shot"
        } else {
            mapMode = "Pass"
        }
        document.getElementById("demo2").innerHTML = modeName.innerHTML;
        console.log("mode: " + modeName.innerHTML);
    });
}


// 


let matchList = {"Group Stage": [], "Round of 16": [], "Quarter-finals": [], "Semi-finals": [], "3rd Place Final": [], "Final": []};
d3.csv(csvURL).then(function(data){
    data.forEach(function(datum){
        // console.log(datum.home_team + " vs " + datum.away_team);
        for(let i=0; i<Object.keys(matchList).length; i++){
            if(datum["competition_stage"] === Object.keys(matchList)[i]){
                let tmp = {};
                tmp.match_id = datum["match_id"];
                tmp.match_name = datum["home_team"] + " vs " + datum["away_team"];
                matchList[Object.keys(matchList)[i]].push(tmp);
            }
        }
    })
    console.log(matchList);
    return matchList; 
})


// 


let filtered_data;

function dataFilter(){
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
                        
                        let filteredData=[];
                        data.forEach((datum) => {
                            let temp = {};
                            if (datum.type["name"] === "Pass") {
                                temp.id = datum.id;
                                temp.period = datum.period;
                                temp.timestamp = datum.timestamp.slice(0,5);
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









