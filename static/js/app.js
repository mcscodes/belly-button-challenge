// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    var metadata = data.metadata

    // Filter the metadata for the object with the desired sample number
    var resultArray = metadata.filter (obj => obj.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    resultArray.forEach((obj) => {
      Object.entries(obj).forEach(([key, value]) => {
        panel.append("p").text(`${key}: ${value}`);
      });
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    var samples = data.samples

    // Filter the samples for the object with the desired sample number
    var selectedSample = samples.filter(obj => obj.id == sample)[0];
  
    // Get the otu_ids, otu_labels, and sample_values
    var sortedData = selectedSample.sample_values.slice(0, 10).reverse();
    var otuIds = selectedSample.otu_ids.slice(0, 10).reverse();
    var otuLabels = selectedSample.otu_labels.slice(0, 10).reverse();


    // Build a Bubble Chart
    var trace1 = {
      x: selectedSample.otu_ids,
      y: selectedSample.sample_values,
      text: selectedSample.otu_labels,
      mode: 'markers',
      marker: {
        size: selectedSample.sample_values,
        color: selectedSample.otu_ids
      }
    };
    
    var bubbleData = [trace1];

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    var yticks = otuIds.map(id => `OTU ${id}`);


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    var trace2 = {
      x: sortedData,
      y: yticks,
      text: otuLabels,
      type: "bar",
      orientation: "h"
    };

    var barData = [trace2];

    // Render the Bar Chart
    Plotly.newPlot("bar", barData);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    var names = data.names;


    // Use d3 to select the dropdown with id of `#selDataset`
    var dropdown = d3.select("#selDataset");


    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });


    // Get the first sample from the list
    var firstSample = names[0];


    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);
    buildMetadata(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
