import * as d3 from "d3";

export default (data) => {
    const width = 1000;
    const height = 680;
    // const margin = 5;
    const padding = 100;
    // const adj = 45;

    // debugger 

    // overall SVG
    const svg = d3.select("#chart").append("svg")
        // .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "-"
            + adj + " -"
            + adj + " "
            + (width + adj * 3) + " "
            + (height + adj * 3))
        .style("padding", padding)
        .style("margin", margin)
        .classed("svg-content", true);

    // scales
    const timeConv = d3.timeParse("%Y-%m-%d");

    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().rangeRound([height, 0]);

    // debugger 

    xScale.domain(d3.extent(data, function (d) {
        return timeConv(d.date)
    }));


    yScale.domain([d3.min(data, function (d) {
        return d.close - 5;
    }), d3.max(data, function (d) {
        return d.close;
    })]);

    // axes 
    const yaxis = d3.axisRight()
        // .ticks(10, "$f")
        .ticks(10)
        .scale(yScale);

    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + width + ", 0)")
        .call(yaxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("dy", ".75em")
        .attr("y", 35)
        .style("text-anchor", "end")
        .style("fill", "#063970")
        .style("font-size", "16px")
        .style("font-weight", "bold")
        .text("Benchmark");

    // lines 
    const line = d3.line()
        .x(function (d) { return xScale(timeConv(d.date)); })
        .y(function (d) { return yScale(d.close); });

    const dataObj = { values: data }
    const slices = []
    slices.push(dataObj)

    let id = 0;
    const ids = function () {
        return "line-" + id++;
    }

    const path = svg.append("path")
        .attr("class", ids)
        .attr("id", "benchmark")
        .attr("d", line(data))

    const totalLength = path.node().getTotalLength();

    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        // .ease("linear")
        .attr("stroke-dashoffset", 0);
};