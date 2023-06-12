// Use the D3 library to read in samples.json from the URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

// display the data
d3.json(url).then(function(data) {
  console.log(data);
});


// Check inspector console to see if each function is running on page load


// function that contains instructions at page load/refresh
// function does not run until called
function init() {
  // code that runs once (only on page load or refresh)

  // this checks that our initial function runs.
  console.log("The Init() function ran")

  // create dropdown/select
  
  // Use D3 to select the dropdown menu
  let menuOption = d3.select("#selDataset");

  //list all the ids in the 'names' section
  d3.json(url).then(function(data) {
    let idSelection = data.names;
    idSelection.forEach((sample) => {menuOption.append("option").text(sample).property("value",sample)});
    let chosenSample = idSelection[0];
    buildBarChart(chosenSample);
    buildBubbleChart(chosenSample);
    createSummary(chosenSample);
    });
  

  // run functions to generate plots with default id = 940
  // createScatter('940')
  // buildBarChart('940')
  // buildBubbleChart('940')
  // createSummary('940')

};

// function that runs whenever the dropdown is changed
// this function is in the HTML and is called with an input called 'this.value'
// that comes from the select element (dropdown)
function optionChanged(newID) {
  // code that updates graphics
  // one way is to recall each function
  buildBarChart(newID)
  buildBubbleChart(newID)
  createSummary(newID)

};

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
// function for bar chart
function buildBarChart(sample){
  d3.json(url).then(function(data){
    //locate value and filter via id
    let samples = data.samples;
    let resultArray = samples.filter(sampleOBJ => sampleOBJ.id == sample);
    let result = resultArray[0];

    //require the element of bar chart
    let otu_ids = result.otu_ids;
    let sample_values = result.sample_values;
    let otu_labels = result.otu_labels;
    
    //set range for x, y, text
    let xAxis = sample_values.slice(0,10);
    let yAxis= otu_ids.slice(0,10).map(id => `OTU${id}`);
    let labelText = otu_labels.slice(0,10);

    //plot the bar chart
    let barChart = {
      x: xAxis.reverse(),
      y: yAxis.reverse(),
      text: labelText.reverse(),
      type: "bar",
      orientation: "h",
      marker: {
        color: xAxis,
        colorscale: 'rgb(142,124,195)'
      }
    };

    let layout = {
      title: 'Top 10 Belly Button found in an individual',
      margin: {
        l: 65,
        r: 25,
        b: 25,
        t: 55,
      }
    };

    var config = {responsive: true}

    Plotly.newPlot("bar", [barChart], layout, config);

  });
};

function buildBubbleChart(sample){
  d3.json(url).then(function(data){
    //locate value and filter via id
    let samples = data.samples;
    let resultArray = samples.filter(sampleOBJ => sampleOBJ.id == sample);
    let result = resultArray[0];

    //require the element of bar chart
    let otu_ids = result.otu_ids;
    let sample_values = result.sample_values;
    let otu_labels = result.otu_labels;

    //plot bubble chart
    let bubbleChart = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'rgb(142,124,195)'
      }
    };

    let layout = {
      title: 'Bacteria in each sample ',
      margin: {
        l: 55,
        r: 35,
        b: 65,
        t: 55,
      },
      xaxis:{title:"OTU ID"},
      yaxis:{title:"Sample Value"}

    };

    var config = {responsive: true}

    Plotly.newPlot("bubble", [bubbleChart], layout, config);

  })
};

function createSummary(sample){
  d3.json(url).then(function(data) {
    //locate the metadata
    let metaData = data.metadata;
    let resultArray = metaData.filter(sampleOBJ => sampleOBJ.id == sample);
    let result = resultArray[0];
    //select the "sample-metadata" in the html
    d3.select("#sample-metadata").html();
    //Mapping the value: using the object.keys, value, entries to return an arry of [key, value] pairs.
    Object.entries(result).forEach(function([key,value]){
      d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
    })
  })

};

init();


