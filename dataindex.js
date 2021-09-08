const dataURL = 'https://raw.githubusercontent.com/statsbomb/open-data/master/data/events/8658.json';
let req = new XMLHttpRequest();
// let mapMode;
// let matchid;
let mapMode = "pass";

// ball coordinates
let pass_x;
let pass_y;
let receive_x;
let receive_y;

// plots x,y scales, axes, and dimensions
let xScale;
let yScale;

let xAxis;
let yAxis;

let width = 1100;
let height = 622;
let padding = 100;

// selecting canvas attr
let canvas = d3.select('#canvas');
canvas.attr('width', width);
canvas.attr('height', height);

// functions
let generateScales = () => {
    xScale = d3.scaleLinear()
        .range([padding, width - padding])
    yScale = d3.scaleLinear()
        .range([padding, height - padding])
}

let drawCanvas = () => { 
    svg.attr('width', width);
    svg.attr('height', height);
}

let drawCells = () => {
    // select all rectangles in canvas
    canvas.selectAll('rect')
        .data(pass_x)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr('fill', (item) => {
            if(item.team.name==="France"){
                return 'SteelBlue'
            } else {
                return 'Orange'
            }

        })
}

let drawAxes = () => {
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    // create SVG group element
    canvas.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')');
    
    canvas.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')

}


// fetch JSON data
req.open('GET', dataURL, true);
req.onload = () => {
    let object = JSON.parse(req.responseText);
    console.log(req.responseText);
    pass_x = object[location[0]];
    pass_y = object[location[1]];
    console.log([pass_x, pass_y]);
    generateScales();
    // drawCells();
    drawAxes();
}
req.send();


// function dataTable() {
//     fetch(dataURL).then(
//         res => {
//             res.json().then(
//                 data => {
//                     // adjusting 2nd half minutes
//                     data.forEach((el) => {
//                         if (el.period === 2) {
//                             el.minute += 45;
//                         }
//                     })

//                     if (data.length > 0) {
//                         let temp = "";

//                         // -- star for loop
//                         data.forEach((el) => {
//                             if (el.type["name"] === "Pass") {
//                                 temp += "<tr>";
//                                 temp += "<td>" + el.period + "</td>";
//                                 temp += "<td>" + el.timestamp.slice(0, 5) + "</td>";
//                                 temp += "<td>" + el.team.name + "</td>";
//                                 temp += "<td>" + el.player.name + "</td>";
//                                 temp += "<td>" + el.type.name + "</td>";
//                                 temp += "<td>" + el.pass.recipient + "</td>";
//                                 temp += "<td>" + el.location + "</td>";
//                                 temp += "<td>" + el.pass.end_location + "</td>";
//                                 temp += "<td>" + el.pass.length + "</td>";
//                                 temp += "<td>" + el.pass.angle + "</td></tr>";
//                             }
//                         })
//                         // --close for loop

//                         // let tablePos = document.getElementById("data");
//                         // tablePos.insertAdjacentHTML('afterend', temp);
//                     }
//                 }
//             ).catch(error => {
//                 throw Error("ERROR: no data found");
//             })
//         }
//     )
// }