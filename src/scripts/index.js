// for navbar about
function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}

$(function () {
  $('.dropdown-list > ul').toggleClass('no-js js');
  $('.dropdown-list .js ul').hide();

  $('.dropdown-list .js').click(function(e) 
    {
      $(this).find('ul').slideToggle(400); 
      $('.dropdown-list .js ul').not($(this).find('ul')).hide();
      e.preventDefault();
      e.stopPropagation();
  });      
});


let mapMode = "Pass";   // preset to pass
let matchid = 8658; //preset to final
let matchName;
dataURL = `https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${matchid}.json`;
const csvURL = "dist/assets/data/worldcup_match_id.csv";

// Loading csv and retrieving match data
let matchList = { 
  "Group Stage": [], 
  "Round of 16": [], 
  "Quarter-finals": [], 
  "Semi-finals": [], 
  "3rd Place Final": [], 
  "Final": [] 
};

let stages = Object.keys(matchList);

async function loadData(csvURL) {
  await d3.csv(csvURL).then(function (data) {
    data.forEach(function (datum) {
      for (let i = 0; i < stages.length; i++) {
        if (datum["competition_stage"] === stages[i]) {
          let tmp = {};
          tmp.match_id = datum["match_id"];
          tmp.match_name = datum["home_team"] + " vs " + datum["away_team"];
          matchList[stages[i]].push(tmp);
        }
      }
    })
  })
};


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
    document.getElementById("demo1").innerHTML = modeName.innerHTML;
  });
}

// reset button
function refreshPage(){
  window.location.reload();
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
      })
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
      })
    }
  }
};
let matchSelection;
matchSelection = document.getElementsByClassName("chooseMatch");
loadData(csvURL).then(loopData).then(matchSelect);


// get match name and map mode from user's clicks
function matchSelect() {
  setTimeout(() => {
    for (let i = 0; i < matchSelection.length; i++) {
      matchSelection[i].addEventListener("click", function () {
        matchName = matchSelection[i].innerHTML;
        let idx = matchName.indexOf('vs');
        document.getElementById("demo2a").innerHTML = matchName.slice(0,idx-1) +' &nbsp;';
        document.getElementById("demo2b").innerHTML = " vs " + '&nbsp;';
        document.getElementById("demo2c").innerHTML = matchName.slice(idx+3, matchName.length);
        matchid = matchSelection[i].getAttribute("value");
        dataURL = `https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/${matchid}.json`;
        dataFilter1()
      });
    }
  }, 500);
}


// filtering data
let filtered_data_pass;
let filtered_data_shot;
let pass_arr1 = [];
let pass_arr2 = [];
let pass_arr_all = [];
let shot_arr1 = [];
let shot_arr2 = [];
let shot_arr_all = [];


async function dataFilter1() {  
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

            // filtering pass data
            let filteredDataPass = [];
            if (data.length > 0) {
              data.forEach((datum) => {
                let temp = {};
                if (datum.type["name"] === 'Pass') {
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
                filteredDataPass.push(temp);
              })

              filtered_data_pass = filteredDataPass.filter((x) => x.id !== undefined);

              filtered_data_pass.forEach((data) => {
                if (data.teamname === filtered_data_pass[0].teamname) {
                  pass_arr1.push({ x: `${data["pass_start_loc"][0] * 5.8}`, y: `${data["pass_start_loc"][1] * 5.8}`, group: data.teamname, timestamp: data.timestamp });
                } else {
                  pass_arr2.push({ x: `${data["pass_start_loc"][0] * 5.8}`, y: `${data["pass_start_loc"][1] * 5.8}`, group: data.teamname, timestamp: data.timestamp });
                }

              })

              filtered_data_pass.forEach((data) => {
                  pass_arr_all.push({ x: `${data["pass_start_loc"][0] * 5.8}`, y: `${data["pass_start_loc"][1] * 5.8}`, group: data.teamname, timestamp: data.timestamp });

              })

              

            }


            // filtering shot data
            let filteredDataShot = [];
            if (data.length > 0) {
              data.forEach((datum) => {
                let temp = {};
                if (datum.type["name"] === 'Shot'){
                  temp.id = datum.id;
                  temp.period = datum.period;
                  temp.timestamp = datum.timestamp.slice(0, 5);
                  temp.teamname = datum.team.name;
                  temp.playername = datum.player.name;
                  temp.event = datum.type.name;
                  temp.shot_start_loc = datum.location;
                  temp.shot_end_loc = datum.shot.end_location;
                }
                filteredDataShot.push(temp);
              })
              
              filtered_data_shot = filteredDataShot.filter((x) => x.id !== undefined);
              console.log(filtered_data_shot);

              filtered_data_shot.forEach((datum, idx) => {
                // if(idx % 2 === 0) {
                if(datum.period === 2) {
                  datum.shot_start_loc[0] = 0 + (125 - datum.shot_start_loc[0]);
                  datum.shot_end_loc[0] = 0 + (125 - datum.shot_end_loc[0]);
                }
              })
              
              filtered_data_shot.forEach((data) => {
                if (data.teamname === filtered_data_shot[0].teamname) {
                  shot_arr1.push({ x: `${data["shot_start_loc"][0] * 5.8}`, y: `${data["shot_start_loc"][1] * 5.8}`, group: data.teamname, timestamp: data.timestamp });
                } else {
                  shot_arr2.push({ x: `${data["shot_start_loc"][0] * 5.8}`, y: `${data["shot_start_loc"][1] * 5.8}`, group: data.teamname, timestamp: data.timestamp });
                }

              })

              filtered_data_shot.forEach((data) => {
                  shot_arr_all.push({ x: `${data["shot_start_loc"][0] * 5.8}`, y: `${data["shot_start_loc"][1] * 5.8}`, group: data.teamname, timestamp: data.timestamp });

              })

              

            }
            if(modeName.innerHTML === "Passing"){
              return filtered_data_pass;
            } else if(modeName.innerHTML === "Shooting") {
              return filtered_data_shot;
            } 
          }
        )
        .then(drawPlotFunction)
          .catch(error => {
            // throw Error(`${error}`);
            alert("Choose map mode on \"Select Mode\" dropdown before selecting a match.");
            refreshPage();
          })
      }
    )
  }, 600)
}

function drawPlotFunction (){
  if(modeName.innerHTML === "Passing"){
    drawPlot1()
  } else if (modeName.innerHTML === "Shooting") {
    drawPlot2()
  } else if((modeName.innerHTML !== "Passing") || (modeName.innerHTML !== "Shooting")) {
    alert("Choose map mode on \"Select Mode\" dropdown before selecting a match.")
  }
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
let canvas1 = d3.select('#canvas1');
canvas1.attr('width', width+100);
canvas1.attr('height', height);

const timeConv = d3.timeParse("%I:%M-%S");

// functions
let generateScales = () => {
  xScale = d3.scaleLinear()
    .domain([0, 120])
    .range([padding, width - padding - 60])
  yScale = d3.scaleLinear()
    .domain([80, 100])
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
  canvas1.append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', 'translate(230, 470)');

  canvas1.append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', 'translate(330, -90)')
}

let appendImage = () => {
  canvas1.append("svg:image")
  .attr('x', 250)
  .attr('y', 10)
  .attr('width', width - padding)
  .attr('height', height - padding - 100)
  .attr("href", "dist/assets/image/soccerfield.jpeg")
}


// plotting passes
let drawPlot1 = async () => {
  let data1 = pass_arr1;
  let data2 = pass_arr2;


  let densityData1 = d3.contourDensity()
    .x(function (d) { return d.x })
    .y(function (d) { return d.y })
    // .group(function (d) { return d.group })
    .size([width + 500, height + 500])
    .bandwidth(5) // for resolution
    .thresholds(35)
    (data1);

  let densityData2 = d3.contourDensity()
    .x(function (d) { return d.x })
    .y(function (d) { return d.y })
    // .group(function (d) { return d.group })
    .size([width + 500, height + 500])
    .bandwidth(5) // for resolution
    .thresholds(35)
    (data2);

    
  canvas1.append('g')
    .selectAll("path")
    .data(densityData1)
    .enter()
    .append("path")
    .attr('id', 'teamA')
    .attr("d", d3.geoPath())
    .attr("fill", "pink")
    .attr("stroke", "red")
    .attr("stroke-linejoin", "round")
    .attr('transform', 'translate(335, 14)')

  canvas1.append('g')
    .selectAll("path")
    .data(densityData2)
    .enter()
    .append("path")
    .attr('id', 'teamb')
    .attr("d", d3.geoPath())
    .attr("fill", "lightblue")
    .attr("stroke", "blue")
    .attr("stroke-linejoin", "round")
    .attr('transform', 'translate(335, 14)')
}

// plotting shots
let drawPlot2 = async () => {
  let data1 = shot_arr1;
  let data2 = shot_arr2;


  let densityData1 = d3.contourDensity()
    .x(function (d) { return d.x })
    .y(function (d) { return d.y })
    .size([width + 500, height + 500])
    .bandwidth(4) // for resolution
    .thresholds(3)
    (data1);

  let densityData2 = d3.contourDensity()
    .x(function (d) { return d.x })
    .y(function (d) { return d.y })
    .size([width + 500, height + 500])
    .bandwidth(4) // for resolution
    .thresholds(3)
    (data2);
    
  canvas1.append('g')
    .selectAll("path")
    .data(densityData1)
    .enter()
    .append("path")
    .attr('id', 'teamA')
    .attr("d", d3.geoPath())
    .attr("fill", "red")
    // .attr("stroke", "red")
    .attr("stroke-linejoin", "round")
    .attr('transform', 'translate(335, 14)')

  canvas1.append('g')
    .selectAll("path")
    .data(densityData2)
    .enter()
    .append("path")
    .attr('id', 'teamB')
    .attr("d", d3.geoPath())
    .attr("fill", "blue")
    // .attr("stroke", "blue")
    .attr("stroke-linejoin", "round")
    .attr('transform', 'translate(335, 14)')
}



// fetch JSON data, then draw axes & field
req.open('GET', dataURL, true);
req.onload = () => {
  generateScales();
  drawAxes();
  appendImage();
}
req.send();
















