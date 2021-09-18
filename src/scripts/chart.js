let mapMode = "Pass";   // preset to pass
let matchid = 8658; //preset to final
let matchName;
dataURL = `https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${matchid}.json`;
const csvURL = "../../dist/assets/data/worldcup_match_id.csv";


// Loading csv and retrieving match data
let matchList = { "Group Stage": [], "Round of 16": [], "Quarter-finals": [], "Semi-finals": [], "3rd Place Final": [], "Final": [] };
let stages = Object.keys(matchList);

async function loadData(csvURL) {
    // console.log("csv: " + csvURL);
    await d3.csv(csvURL).then(function (data) {
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
        // return matchList;
    })
};
// loadData(csvURL);


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


// ensure wait loading (w/ asyncfunction)
const loopData = async function () {
    for (let i = 0; i < stages.length; i++) {
        let obj = matchList[stages[i]];
        for (let j = 0; j < obj.length; j++) {

            let el = document.createElement("li");

            const innerValFunc = function () {
                el.innerHTML = `<a href="#" class="chooseMatch" value=${obj[j].match_id}>${obj[j].match_name}</a>`;
            };

            loadData(csvURL)
                .then(innerValFunc)
                .then(() => {
                    let match_32 = document.getElementById("match_32");
                    let match_16 = document.getElementById("match_16");
                    let match_8 = document.getElementById("match_8");
                    let match_4 = document.getElementById("match_4");
                    let match_3 = document.getElementById("match_3");
                    let match_1 = document.getElementById("match_1");
                }
                )
                .then(() => {
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
                )
        }
    }
};
let matchSelection;
matchSelection = document.getElementsByClassName("chooseMatch");
loadData(csvURL).then(loopData).then(matchSelect);


// get match name and map mode from user's clicks
// const choosingMatch = function(){ 
// return matchSelection=document.getElementsByClassName("chooseMatch");
// }
// loopData().then(choosingMatch());

function matchSelect() {
    setTimeout(() => {
        console.log(matchSelection.length);
        for (let i = 0; i < matchSelection.length; i++) {
            matchSelection[i].addEventListener("click", function () {
                matchName = matchSelection[i].innerHTML;
                document.getElementById("demo1").innerHTML = matchName;
                matchid = matchSelection[i].getAttribute("value");
                console.log("matchName: " + matchName);
                console.log("matchid: " + matchid);
                dataURL = `https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${matchid}.json`;
                dataFilter();
            });
        }
    }, 500);
}


// filtering data
let filtered_data;
let pass_arr1 = [];
let pass_arr2 = [];


async function dataFilter() {
    setTimeout(() => {
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

                        let filteredData = [];
                        if (data.length > 0) {
                            data.forEach((datum) => {
                                let temp = {};
                                if (datum.type["name"] === mapMode) {
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
                            filtered_data = filteredData.filter((x) => x.id !== undefined);

                            filtered_data.forEach((data) => {
                                if (data.teamname === filtered_data[0].teamname) {
                                    pass_arr1.push({ x: `${data["pass_start_loc"][0] * 5.8}`, y: `${data["pass_start_loc"][1] * 5.8}`, group: data.teamname, timestamp: data.timestamp });
                                } else {
                                    pass_arr2.push({ x: `${data["pass_start_loc"][0] * 5.8}`, y: `${data["pass_start_loc"][1] * 5.8}`, group: data.teamname, timestamp: data.timestamp });
                                }

                            })

                        }
                        return filtered_data;
                    }
                ).then(drawPlot1)
                    .then(drawPlot2)
                    .catch(error => {
                        throw Error(`${error}`);
                    })
            }
        )
    }, 600)
}


//////////////////////////////////////////////////////////
let req = new XMLHttpRequest();
// field
// ball coordinates
let pass_x = [];
let pass_y = [];
let receive_x = [];
let receive_y = [];
let time_min = [];
let time_sec = [];
let teamname = [];

// plots x,y scales, axes, and dimensions
let xScale;
let yScale;
let colorScale;
let timeScale;

let xAxis;
let yAxis;

let width = 1000;
let height = 680;
let padding = 100;

// selecting canvas attr
let canvas = d3.select('#canvas');
canvas.attr('width', width);
canvas.attr('height', height);

const timeConv = d3.timeParse("%I:%M-%S");

// functions
let generateScales = () => {
    xScale = d3.scaleLinear()
        .domain([0, 120])
        .range([padding, width - padding - 60])
    yScale = d3.scaleLinear()
        .domain([80, 00])
        .range([padding, height - padding])
    colorScale = d3.scaleLinear()
        .domain([0, 1])
        .range(["white", "#69b3a2"])
    timeScale = d3.scaleTime;
}

let drawCanvas = () => {
    svg.attr('width', width);
    svg.attr('height', height);
}


let drawAxes = () => {
    let xAxis = d3.axisBottom(xScale).tickSize(0).tickValues([]);
    let yAxis = d3.axisLeft(yScale).tickSize(0).tickValues([]);

    // create SVG group element
    canvas.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(150, 490)');

    canvas.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(250, -90)')
}

let appendImage = () => {
    canvas.append("svg:image")
        .attr('x', 170)
        .attr('y', 10)
        .attr('width', width - padding)
        .attr('height', height - padding - 100)
        .attr("xlink:href", "../../dist/assets/Images/soccerfield.svg")
}

let drawPlot1 = async () => {
    let data = pass_arr1;

    let densityData = d3.contourDensity()
        .x(function (d) { return d.x })
        .y(function (d) { return d.y })
        // .group(function (d) { return d.group})
        .size([width + 500, height + 500])
        .bandwidth(5) // for resolution
        .thresholds(35)
        (data);
    console.log(data);
    console.log("densityData: ");
    console.log(densityData);

    canvas
        .selectAll("path")
        .data(densityData)
        .enter()
        // .size([width. height])
        .append("path")
        .attr("d", d3.geoPath())
        .attr("fill", "pink")
        .attr("stroke", "red")
        .attr("stroke-linejoin", "round")
        .attr('transform', 'translate(255, 18)');

}

let drawPlot2 = () => {
    let data = pass_arr2;

    let densityData = d3.contourDensity()
        .x(function (d) { return d.x })
        .y(function (d) { return d.y })
        // .group(function (d) { return d.group})
        .size([width + 500, height + 500])
        .bandwidth(5) // for resolution
        .thresholds(35)
        (data);
    console.log(data);
    console.log("densityData: ");
    console.log(densityData);

    canvas
        .selectAll("path")
        .data(densityData)
        .enter()
        // .size([width. height])
        .append("path")
        .attr("d", d3.geoPath())
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-linejoin", "round")
        .attr('transform', 'translate(255, 18)');
}


// fetch JSON data
req.open('GET', dataURL, true);
req.onload = () => {
    // let object = filtered_data;
    // console.log("req.responseText: ");
    // console.log(req.responseText);
    generateScales();
    // drawCells();
    drawAxes();
    appendImage();
    drawPlot1();
    drawPlot2();
}
req.send();
















