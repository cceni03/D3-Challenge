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
// function used for updating y-scale var upon click on axis label
function yScale(healthData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.85,
        d3.max(healthData, d => d[chosenYAxis]) * 1.15
      ])
      .range([height, 0]);
  
    return yLinearScale;
  }

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles on xAxis change
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// function used for updating ABBR group with a transition to
// new circles on xAxis change
function renderXAbbr(abbrGroup, newXScale, chosenXAxis) {
  
    abbrGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return abbrGroup;
  }

// function used for updating circles group with a transition to
// new circles on yAxis change
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

// function used for updating ABBR group with a transition to
// new circles on yAxis change
function renderYAbbr(abbrGroup, newYScale, chosenYAxis) {
  
    abbrGroup.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYAxis]));
  
    return abbrGroup;
  }

// function used for updating circles group with new tooltip for xAxis change
function updateXToolTip(chosenXAxis, circlesGroup, abbrGroup) {

  var xlabel;
  var ylabel = chosenYAxis;

  if (chosenXAxis === "poverty") {
    xlabel = "Poverty:";
  }
  else if (chosenXAxis === "age") {
    xlabel = "Age:";
  }
  else {
    xlabel = "Income:"; 
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, -80])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);
  abbrGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  abbrGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

  return circlesGroup;
}

// function used for updating circles group with new tooltip for yAxis change
function updateYToolTip(chosenYAxis, circlesGroup, abbrGroup) {

    var ylabel;
    var xlabel = chosenXAxis;
  
    if (chosenYAxis === "healthcare") {
      ylabel = "Lacks Healthcare:";
    }
    else if (chosenYAxis === "obesity") {
      ylabel = "Obesity:";
    }
    else {
        ylabel = "Smokes:";
    }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([50, -80])
      .html(function(d) {
        return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
      });
  
    circlesGroup.call(toolTip);
    abbrGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    abbrGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
         toolTip.hide(data);
      });

    return circlesGroup;
  }

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(healthData, err) {
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.obesity = +data.obesity;
    //console.log(data.abbr)
    data.income = +data.income;
    data.smokes = +data.smokes
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // yLinearScale function above csv import
  var yLinearScale = yScale(healthData, chosenYAxis);

  // Create y scale function
//   var yLinearScale = d3.scaleLinear()
//     .domain([0, d3.max(healthData, d => d.healthcare)])
//     .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .classed("y-axis", true)
    .attr("transform", `translate(0, 0)`)
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 10)
    .attr("fill", "steelblue")
    .attr("opacity", ".5");
    //console.log(circlesGroup);

  // append initial state abbreviations at cicle centers
  //console.log(healthData);
  var abbrGroup = chartGroup.selectAll("mytext")
    .data(healthData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d[chosenYAxis] - 0.15))
    .text(d => d.abbr)
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "white")
    .attr('text-anchor', 'middle');
    //console.log(abbrGroup);

  // Create group for three x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income (Median)");

  // Create group for three y-axis labels
  var ylabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(0, ${height/2})`);


  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -40)
    .attr("x", 0)
    .attr("value", "healthcare") // value to grab for event listener
    .classed("active", true)
    .text("Lacks Healthcare (%)");

  var obesityLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -60)
    .attr("x", 0)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("Obesity (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -80)
    .attr("x", 0)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

  // updateToolTip function above csv import (xAxis)
  var circlesGroup = updateXToolTip(chosenXAxis, circlesGroup, abbrGroup);

  // updateToolTip function above csv import (yAxis)
  var circlesGroup = updateYToolTip(chosenYAxis, circlesGroup, abbrGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        //console.log(chosenXAxis);
        //console.log(chosenYAxis);

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(healthData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);

        // updates circle ABBR with new x values
        abbrGroup = renderXAbbr(abbrGroup, xLinearScale, chosenXAxis);

        // updates tooltips with new info
        circlesGroup = updateXToolTip(chosenXAxis, circlesGroup, abbrGroup);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "poverty"){
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

  // y axis labels event listener
  ylabelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      // replaces chosenYAxis with value
      chosenYAxis = value;

      //console.log(chosenYAxis);
      //console.log(chosenXAxis);

      // functions here found above csv import
      // updates y scale for new data
      yLinearScale = yScale(healthData, chosenYAxis);

      // updates y axis with transition
      yAxis = renderYAxes(yLinearScale, yAxis);

      // updates circles with new y values
      circlesGroup = renderYCircles(circlesGroup, yLinearScale, chosenYAxis);

      // updates circle ABBR with new y values
      abbrGroup = renderYAbbr(abbrGroup, yLinearScale, chosenYAxis);

      // updates tooltips with new info
      circlesGroup = updateYToolTip(chosenYAxis, circlesGroup, abbrGroup);

      // changes classes to change bold text
      if (chosenYAxis === "obesity") {
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "healthcare"){
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
      obesityLabel
        .classed("active", false)
        .classed("inactive", true);
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", true)
        .classed("inactive", false);
      }
    }
  });
}).catch(function(error) {
  console.log(error);
});
