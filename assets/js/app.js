//Global Variables
var svgWidth = 960
var svgHeight = 500;
var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
  };
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
//data grab:
d3.csv("assets/data/data.csv").then(successHandle, errorHandle);

function errorHandle(error){
throw err;
console.log("stopped #1");
}

function successHandle(csvData) {
    console.log("success fuction running");



var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);


    

   
        // Step 1: Parse Data/Cast as numbers
        // ==============================
        csvData.forEach(function(data) {
            data.id=+data.id;
            
            
            data.poverty = +data.poverty;
            data.povertyMoe=+data.povertyMoe;
            data.age = +data.age;
            data.ageMoe=+data.ageMoe;
            data.income = +data.income;
            data.incomeMoe=+data.incomeMoe;
            data.healthcare = +data.healthcare;
            data.healthcareLow=+data.healthcareLow;
            data.healthcareHigh=+data.healthcareHigh;
            data.obesity = +data.obesity;
            data.obesityLow=+data.obesityLow;
            data.obesityHigh=+data.obesityHigh;
            data.smokes = +data.smokes;
            data.smokesLow=+data.smokesLow;
            data.smokesHigh=+data.smokesHigh;
            
        });
console.log(csvData);
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";


var xLinearScale = xScale(csvData, chosenXAxis);
var yLinearScale = yScale(csvData, chosenYAxis);
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

var xAxis = chartGroup.append("g")
.classed("x-axis", true)
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

var yAxis = chartGroup.append("g")
.classed("y-axis", true)
.call(leftAxis);


  var circlesGroup = chartGroup.selectAll("circle")
            .data(csvData)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d[chosenXAxis]))
            .attr("cy", d => yLinearScale(d[chosenYAxis]))
            .attr("r", "15")
            .attr("fill", "blue")
            .attr("opacity", ".75");

  var textGroup = chartGroup.selectAll(".label")
            .data(csvData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("text-anchor", "middle")
            .text(function(d) {return d.abbr;})
            .attr("x", d => xLinearScale(d[chosenXAxis]))
            .attr("y", d => yLinearScale(d[chosenYAxis])+5)
            .attr("fill", "white");
console.log(textGroup);
  var ylabelsGroup = chartGroup.append("g")
            .attr("transform", "rotate(-90)")
            .attr("class", "axisText")
            .attr("x", 0 - (height / 2))
            .style("text-anchor", "middle");

  var obesityLabel = ylabelsGroup.append("text")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("value", "obesity")
            .classed("inactive", true)
            .attr("dy", "1em")
            .text("Obese (%)");

 var smokesLabel = ylabelsGroup.append("text")
            .attr("y", 20 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("value", "smokes")
            .classed("inactive", true)
            .attr("dy", "1em")
            .text("Smokes (%)");

 var healthcareLabel = ylabelsGroup.append("text")
            .attr("y", 40 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("value", "healthcare")
            .classed("active", true)
            .attr("dy", "1em")
            .text("Lacks Healthcare (%)");
            
  var xlabelsGroup = chartGroup.append("g")
            .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 20)
            .attr("value", "poverty")
            .classed("active", true)
            .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 40)
            .attr("value", "age")
            .classed("inactive", true)
            .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
            .attr("x", 0)
            .attr("y", 60)
            .attr("value", "income")
            .classed("inactive", true)
            .text("Household Income (Median)");
console.log("test good to line 161");
        
        
  var textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

        // Event Listener - x axis (updates chart)
        xlabelsGroup.selectAll("text")
            .on("click", function() {
            // get value of selection
            var xvalue = d3.select(this).attr("value");
            if (xvalue !== chosenXAxis) {

            //Change all x chart attributes via functions
            chosenXAxis = xvalue;
            xLinearScale = xScale(csvData, chosenXAxis);
            xAxis = renderXAxis(xLinearScale, xAxis);
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
            textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
            textGroup = updateToolTip(chosenXAxis, chosenYAxis, textGroup);
            if (chosenXAxis === "poverty") {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            
            }
            else if (chosenXAxis === "age") {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
            
            }
            else {
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }}});

            ylabelsGroup.selectAll("text")
            .on("click", function() {
            // get value of selection
            var yvalue = d3.select(this).attr("value");
            if (yvalue !== chosenYAxis) {

            // replaces chosenYAxis with value
            chosenYAxis = yvalue;

            // updates y scale for new data
            yLinearScale = yScale(csvData, chosenYAxis);

            // updates y axis with transition
            yAxis = renderYAxis(yLinearScale, yAxis);

            // updates circles with new y values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates text in circles with new y values
            textGroup = renderText(textGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            // updates tooltips with new info
            text = updateToolTip(chosenXAxis, chosenYAxis, textGroup);

            // changes classes to change bold text
            if (chosenYAxis === "obesity") {
                obesityLabel
                    .classed("active", true)
                    .classed("inactive", false);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            
            }
            else if (chosenYAxis === "smokes") {
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
            
            }
            else {
                obesityLabel
                    .classed("active", false)
                    .classed("inactive", true);
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
            }
        });
    
  
  
    
};



// Functions needed to create charts:

function xScale(Data, chosenXAxis) {
    // create scales
    const xLinearScale = d3.scaleLinear()
      .domain([d3.min(Data, d => d[chosenXAxis]) * 0.8,
        d3.max(Data, d => d[chosenXAxis]) * 1.2
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

function yScale(demoData, chosenYAxis) {
  
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(demoData, d => d[chosenYAxis]) * 0.8,
        d3.max(demoData, d => d[chosenYAxis]) * 1.2
        ])
        .range([height, 0]);

    return yLinearScale;
}

function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
}

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);

    return yAxis;
}

function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
}

function renderText(textGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    textGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis])+6);
    return textGroup;
}

function updateToolTip(chosenXAxis, chosenYAxis, textGroup) {

    if (chosenXAxis === "poverty") {
        var xlabel = "In Poverty:";
    }
    else if (chosenXAxis === "age") {
        var xlabel = "Median Age:";
    }
    else {
        var xlabel = "Median Income:";
    }

    if (chosenYAxis === "healthcare") {
        var ylabel = "Lack Healthcare:";
    }
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smoke";
    }
    else {
        var ylabel = "Obese";
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
        return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}%`);
        });

    textGroup.call(toolTip);

    textGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
        // onmouseout event
        .on("mouseout", function(data, index) {
        toolTip.hide(data);
        });

    return textGroup;
}
