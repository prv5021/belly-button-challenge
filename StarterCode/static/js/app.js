//function to read json file
function dataPlot(id) {
    
    d3.json("samples.json").then((data) => {
         
        var metadata = data.metadata;
        console.log(metadata);

        var samples = data.samples;
        console.log(samples);

        // Filter Metadata by subject ID
        var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == id)[0]
        console.log(filteredMetadata);

        // Filter Samples by subject ID
        var filteredSample = samples.filter(bacteriaInfo => bacteriaInfo.id == id)[0]
        console.log(filteredSample);

        // create variables for charts
        // get the sample_values for the top 10 OTU ids for the bar chart
        var sample_values = filteredSample.sample_values
        console.log(sample_values);
        var Top10_sample_values = filteredSample.sample_values.slice(0, 10).reverse()
        console.log(Top10_sample_values);

        // use otu_ids as the labels for charts
        var otu_ids = filteredSample.otu_ids
        console.log(otu_ids);
        var Top10_otu_ids = filteredSample.otu_ids.slice(0, 10).map(otu_id => `OTU ${otu_id}`).reverse()
        console.log(Top10_otu_ids);
        
        // use otu_labels as the hovertext for charts
        var otu_labels = filteredSample.otu_labels
        console.log(otu_labels);

        // create the trace for Bar chart
        var bar_trace = [{
            // x values
            x: Top10_sample_values,
            // y values
            y: Top10_otu_ids,
            
            text: otu_labels.slice(0, 10).reverse(),
            type: 'bar',
            orientation: 'h',
        }]
        
        // define bar layout
        var bar_layout = {
            title: "<b>Top 10 Microbial Species in Belly Buttons</b>",
            xaxis: { title: "Bacteria Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        // display plot
        Plotly.newPlot('bar', bar_trace, bar_layout)

        // build a Bubble Chart
        var bubble_trace = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
            
        ];
        var bubble_layout = {
            title: "<b>Bacteria Cultures Per Sample</b>",
            hovermode: "closest",
            xaxis: {title: "OTU ID"},
            yaxis: { title: "Sample Values" },
            height: 600,
            width: 1200
        };

        Plotly.newPlot("bubble", bubble_trace, bubble_layout); 
    });
};


function DemoInfo(id) {
    d3.json("samples.json").then(data => {
 
     // get the metadata info for the demographic Info section
         var metadata = data.metadata
         var filteredMetadata = metadata.filter(bacteriaInfo => bacteriaInfo.id == id)[0]
 
         console.log(filteredMetadata)
         var demographic_Info = d3.select("#sample-metadata");
 
         // to empty the demographic info section 
         demographic_Info.html("");
 
         //call for demographic data for the id and append the info to the panel
         Object.entries(filteredMetadata).forEach((key) => {   
             demographic_Info.append("h5").text(key[0].toUpperCase() + ": " + key[1] + "\n");    
         });
     })
 };
 

// Display the sample metadata
//function for the change in option

function optionChanged(id) {
    dataPlot(id);
    DemoInfo(id);
}

//call to initialize 
function initialize() {
    var dropdown = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        
        // get the ids in dropdwown menu
        var id = data.names;
        id.forEach(id => {
            dropdown.append("option").text(id).property("value", id)
        });

        //show charts and demographic info by calling the functions
        dataPlot(id[0]);
        DemoInfo(id[0]);
    });
};

//Calling initialize function
initialize();