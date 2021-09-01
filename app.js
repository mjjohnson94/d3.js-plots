/// Defining the SVG element dimensions 
var svgWidth = 960;
var svgHeight = 500;

/// Defining the internal margin relative to the SVG element 
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

/// Defining the size of the plot itself, relative to the margin which has been declarede above
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

/// Using the D3 select method the chart element which has been added to the DOM
/// Using the D3 append method to append a new element to the DOM named "svg"
/// Setting the height & width of the element by referencing the svgWidth & svgHeight variables created earlier
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

/// Creating an SVG group element for the visualisation and appending it to the DOM:
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

/// Reading in the CSV file using the d3.csv method
  d3.csv("data.csv").then(function(data) {

    /// Creating a function to extract the poverty data & healthcare data within the csv file
    /// The forEach method is used to apply to function for each item contained within the respective arrays
    data.forEach(function(x)  {

      /// The + operator is used to convert the data from a string to an integer
      /// We print the results to the console to ensure the data has been extracted correctly
      x.poverty = +x.poverty;
      x.healthcare = +x.healthcare;

      console.log(x.poverty)
      console.log(x.healthcare)

    });

    /// The X & Y Linear Scale functions are created, this ensures the data is displayed clearly and visibly on each axis, respective to the values contained within the data sets
    var xLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, x => x.poverty)])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(data, x => x.healthcare)])
    .range([height, 0]);

    /// Utilising the in-built axisBottom & axisLeft functions to draw the X & Y axis automatically:
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    /// Appending the X & Y Axis groups to the visualisation 
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    /// Creating Circles
    
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", x => xLinearScale(x.poverty))
    .attr("cy", x => yLinearScale(x.healthcare))
    .attr("r", "15")
    .attr("fill", "powderblue")
    .attr("opacity", ".75");

    var textsGroup=chartGroup.selectAll('.stateText')
    .data(data)
    .enter()
    .append('text')
    .classed('stateText', true)
    .attr("x", x => xLinearScale(x.poverty))
    .attr("y", x => yLinearScale(x.healthcare))
    .attr('dy', 5)
    /// .attr('font-size', '10px')
    /// .attr('fill', 'black')
    .text(function(x){return x.abbr});
    

    ///  Initialize tool tip
   
    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(x) {
      return (`${x.state}<br>Healthcare: ${x.healthcare}<br>Poverty: ${x.poverty}`);
    });

    /// Calling toolTip into the chartGroup
    
    chartGroup.call(toolTip);

    /// Create event listeners 
    
    textsGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("fill", "white")
      .attr("class", "axisText")
      .text("Healthcare");
  

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .attr("fill", "white")
      .text("Poverty");
     }).catch(function(error) {
      console.log(error)})

  


