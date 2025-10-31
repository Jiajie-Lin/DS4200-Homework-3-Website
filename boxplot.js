// Load the data
const socialMedia = d3.csv("socialMedia.csv");
// Once the data is loaded, proceed with plotting
socialMedia.then(function(data) {
// Convert string values to numbers
    data.forEach(function(d) {
    d.Likes = +d.Likes;
});
// Define the dimensions and margins for the SVG
let width = 600;
let height = 400;
let margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
};

// Create the SVG container
let svg = d3.select('#boxplot')
            .append('svg')
            .attr('width',width)
            .attr('height',height)
            .style('background','beige')

// Set up scales for x and y axes
let yScale = d3.scaleLinear()
                .domain([0,1000])
                .range([height - margin.bottom, margin.top])
//change padding 
let xScale = d3.scaleBand()
              .domain([... new Set(data.map(d => d.AgeGroup))])
              .range([margin.left, width - margin.right])
              .padding(.25)

// You can use the range 0 to 1000 for the number of Likes, or if you want, you can use
// d3.min(data, d => d.Likes) to achieve the min value and
// d3.max(data, d => d.Likes) to achieve the max value
// For the domain of the xscale, you can list all three age groups or use
// [...new Set(data.map(d => d.AgeGroup))] to achieve a unique list of the agegroup
// Add scales
// Add x-axis label
let xAxis = svg.append('g')
              .call(d3.axisBottom(xScale))
              .attr('transform', `translate(0, ${height - margin.bottom})`)
// Add y-axis label
let yAxis = svg.append('g')
            .call(d3.axisLeft(yScale))
            .attr('transform', `translate(${margin.left}, 0)`)

const rollupFunction = function(groupData) {
const values = groupData.map(d => d.Likes).sort(d3.ascending);
const min = d3.min(values);
const q1 = d3.quantile(values, 0.25);
const median = d3.quantile(values, 0.5)
const max = d3.max(values)
const q3 = d3.quantile(values,0.72)
return {min, q1, median, max, q3};
};

//groupby age group and gathers the data and rollupfunction
const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.AgeGroup);

// for eaah quantiles and agegroup in quantilesby group we make these shapes 
quantilesByGroups.forEach((quantiles, AgeGroup) => {

const x = xScale(AgeGroup);
const boxWidth = xScale.bandwidth();
// Draw vertical lines
svg.append('line')
    .attr('x1', x + boxWidth/2)           
    .attr('y1', yScale(quantiles.min))  
    .attr('x2', x + boxWidth/2)           
    .attr('y2', yScale(quantiles.max))  
    .attr('stroke', 'black')
    .attr('stroke-width', 1);

// Draw box
svg.append('rect')
    .attr('x', x)
    .attr('y', yScale(quantiles.q3))
    .attr('width', boxWidth)
    .attr('fill', 'beige')
    .attr('stroke', 'black')
    .attr("height", yScale(quantiles.q1) - yScale(quantiles.q3))

    
// Draw median line
svg.append('line') 
    .attr('x1', x)
    .attr('y1', yScale(quantiles.median))
    .attr('x2', x + boxWidth)
    .attr('y2', yScale(quantiles.median))
    .attr('stroke', 'black')
});

});


// Prepare you data and load the data again.
// This data should contains three columns, platform, post type and average number of likes.
const socialMediaAvg = d3.csv("socialMediaAvg.csv");
socialMediaAvg.then(function(data) {
// Convert string values to numbers
    data.forEach(function(d) {
    d.Likes = +d.Likes;
    });
// Define the dimensions and margins for the SVG
let height = 400;
let width = 600;

let margin = {
    right:50,
    left:50,
    top:50,
    bottom:50
};
// Create the SVG container
let svg = d3.select('#barplot')
            .append('svg')
            .attr('width',width)
            .attr('height',height)
            .style('background','beige')

// Define four scales
// Scale x0 is for the platform, which divide the whole scale into 4 parts
let x0Scale = d3.scaleBand()
                .domain([... new Set(data.map(d => d.Platform))])
                .range([margin.left, width - margin.right])

// Scale x1 is for the post type, which divide each bandwidth of the previous 
// x0 scale into three part for each post type
let x1Scale = d3.scaleBand()
                .domain([... new Set(data.map(d => d.PostType))])
                .range([0,x0Scale.bandwidth()])
// Recommend to add more spaces for the y scale for the legend
let yScale = d3.scaleLinear()
                .domain([0,800])
                .range([height - margin.bottom,margin.top])
// Also need a color scale for the post type
const color = d3.scaleOrdinal()
.domain([...new Set(data.map(d => d.PostType))])
.range(["#1f77b4", "#ff7f0e", "#2ca02c"]);
// Add scales x0 and y
// Add x-axis label
// Add y-axis label
let xAxis = svg.append('g')
              .call(d3.axisBottom(x0Scale))
              .attr('transform', `translate(0, ${height - margin.bottom})`)
// Add y-axis label
let yAxis = svg.append('g')
            .call(d3.axisLeft(yScale))
            .attr('transform', `translate(${margin.left}, 0)`)
// Group container for bars
const barGroups = svg.selectAll("bar")
.data(data)
.enter()
.append("g")
.attr("transform", d => `translate(${x0Scale(d.Platform)},0)`);
// Draw bars
barGroups.append("rect")
        .attr('x', d => x1Scale(d.PostType))
        .attr('y', d => yScale(d.Likes))
        .attr('width', x1Scale.bandwidth())
        .attr('height', d => height - margin.bottom - yScale(d.Likes))
        .attr('fill', d => color(d.PostType)); 

// Add the legend
const legend = svg.append("g")
.attr("transform", `translate(${width - 150}, ${margin.top})`);
const types = [...new Set(data.map(d => d.PostType))];
types.forEach((type, i) => {
// Alread have the text information for the legend.
// Now add a small square/rect bar next to the text with different color.
legend.append("rect")
.attr("x", 0)
.attr("y", i * 20)
.attr("width", 15)
.attr("height", 15)
.attr("fill", color(type));
legend.append("text")
.attr("x", 20)
.attr("y", i * 20 + 12)
.text(type)
.attr("alignment-baseline", "middle");
});
});

//last 
// Prepare you data and load the data again.
// This data should contains two columns, date (3/1-3/7) and average number of likes.
const socialMediaTime = d3.csv("socialMediaTime.csv");
socialMediaTime.then(function(data) {
    data.forEach(function(d) {
    d.Likes = +d.Likes;
});
// Define the dimensions and margins for the SVG
let width = 600;
let height = 400;
let margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 50,
};

// Create the SVG container
let svg = d3.select('#lineplot')
            .append('svg')
            .attr('width',width)
            .attr('height',height)
            .style('background','beige')

// Set up scales for x and y axes
let yScale = d3.scaleLinear()
                .domain([0,1000])
                .range([height - margin.bottom, margin.top])
let xScale = d3.scaleBand()
                .domain([... new Set(data.map(d => d.Date))])
                .range([margin.left, width - margin.right])
// Draw the axis, you can rotate the text in the x-axis here
let xAxis = svg.append('g')
              .call(d3.axisBottom(xScale))
              .attr('transform', `translate(0, ${height - margin.bottom})`)
              .selectAll('text')
              .attr('transform', 'rotate(-45)')
              .style('text-anchor', 'end');     

// Add y-axis label
let yAxis = svg.append('g')
            .call(d3.axisLeft(yScale))
            .attr('transform', `translate(${margin.left}, 0)`)    

// Draw the line and path. Remember to use curveNatural.
// Create line generator
let line = d3.line()
    .x(d => xScale(d.Date) + xScale.bandwidth()/2)             
    .y(d => yScale(d.Likes))      
    .curve(d3.curveNatural);     

svg.append('path')
    .datum(data)                       
    .attr('fill', 'none')              
    .attr('stroke', 'steelblue')      
    .attr('stroke-width', 2)           
    .attr('d', line);                  
});
