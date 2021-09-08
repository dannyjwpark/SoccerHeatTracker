const dataURL = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/8658.json';
let req = new XMLHttpRequest();
let mapMode = "Pass";
let matchid;
let matchName;


// get metch name and map mode from user's clicks
let matchSelection = document.getElementsByClassName("chooseMatch");

for(let i=0; i<matchSelection.length; i++){
    matchSelection[i].addEventListener("click", function(){
        matchName = matchSelection[i];
        document.getElementById("demo1").innerHTML = matchName.innerHTML;
        console.log("matchName: " + matchName.innerHTML);
        dataFilter();
    });
}


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


// document.getElementById('matchChoose').addEventListener('click', dataFilter);

// function selectMode(){
//     const matchModes = document.querySelector('dropdown-content');
//     let selectedMode = matchModes.options[matchModes.selectedIndex].value;
//     alert(selectedMode);
//     return(selectedMode);
    
// }
// console.log(selectMode());




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









