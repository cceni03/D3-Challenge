var svgWidth = 800;
var svgHeight = 500;

var margin = { 
    top: 20, 
    right: 40, 
    bottom: 80, 
    left: 100 
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, 
// Shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", 'translate(${margin.left}, ${margin.top})');

// Parameters
var chosenXAxis = "In Poverty (%)";
var chosenYAxis = "Lacks Healthcare (%)";

// Use Function to update scale on axis upon clicking
function xScale(healthData, chosenXAxis){
    // Create Scales
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData,d => d[chosenXAxis]) * 0.75,
        d3.max(healthData, d => d[chosenXAxis]) * 1.25
    ])
    .range([0, width]);

    return xLinearScale;
}