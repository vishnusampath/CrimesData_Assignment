var	margin = {top: 60, right: 30, bottom: 30, left: 350},
	width = 1400 - margin.left - margin.right,
	height = 400 - margin.top - margin.bottom;

//var	parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.scale.ordinal()
    .rangeRoundBands([0,width], 0.3,0.3);
var	y = d3.scale.linear().range([height, 0]);

 var	xAxis = d3.svg.axis().scale(x)
 	.orient("bottom");

var	yAxis = d3.svg.axis().scale(y)
	.orient("left");

var	valueline = d3.svg.line()
	.x(function(d) { return x(d.Year); })
	.y(function(d) { return y(d.Arrested); });

var	valueline2 = d3.svg.line()
	.x(function(d) { return x(d.Year); })
	.y(function(d) { return y(d.NotArrested); });



var	svg = d3.select("#multiline")
	.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.json("crimes_assault.json", function(error, data) {
	data.forEach(function(d) {
		d.Year = d.Year;
		d.Arrested = +d.Arrested;
		d.NotArrested = +d.NotArrested;
	});

  x.domain(data.map(function(d){
      return d.Year;
  }));
	// Scale the range of the data
	//x.domain(d3.extent(data, function(d) { return d.Year; }));
	y.domain([0, d3.max(data, function(d) { return Math.max(d.Arrested, d.NotArrested); })]);

	svg.append("path")		// Add the valueline path.
		.attr("class", "line")
    .style("stroke", "lightseagreen")
		.attr("d", valueline(data));

	svg.append("path")		// Add the valueline2 path.
		.attr("class", "line")
		.style("stroke", "purple")
		.attr("d", valueline2(data));


	svg.append("g")			// Add the X Axis
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

	svg.append("g")			// Add the Y Axis
		.attr("class", "y axis")
		.call(yAxis);

	svg.append("text")
		.attr("transform", "translate(" + (width+3) + "," + y(data[0].Arrested) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "end")
		.style("fill", "lightseagreen")
		.style("font-size", "16px")
		.text("Arrested");

	svg.append("text")
		.attr("transform", "translate(" + (width+3) + "," + y(data[0].NotArrested) + ")")
		.attr("dy", ".35em")
		.attr("text-anchor", "end")
		.style("fill", "purple")
		.style("font-size", "16px")
		.text("NotArrested");

});
