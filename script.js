d3.json("GDP-data.json").then(data => {
    // Set margins and dimensions for the SVG chart
    const margin = { top: 20, right: 30, bottom: 50, left: 40 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
  
    // Create SVG element
    const svg = d3.select("#chart")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    // Parse the data
    const parseDate = d3.timeParse("%Y-%m-%d");
    const dataset = data.data.map(d => ({
      date: parseDate(d[0]),
      gdp: d[1]
    }));
  
    // Define the scales
    const xScale = d3.scaleTime()
      .domain([d3.min(dataset, d => d.date), d3.max(dataset, d => d.date)])
      .range([0, width]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d.gdp)])
      .nice()
      .range([height, 0]);
  
    // Create X-axis and Y-axis
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
  
    svg.append("g") //x axis
      .attr("id", "x-axis")
      .attr("transform", `translate(0,${height})`)
      .call(xAxis);
  
    svg.append("g") //y axis
      .attr("id", "y-axis")
      .call(yAxis);
  
    // Create the bars for the bar chart
    svg.selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("data-date", d => d.date.toISOString().split("T")[0])//corregido
      .attr("data-gdp", d => d.gdp)
      .attr("x", d => xScale(d.date))
      .attr("y", d => yScale(d.gdp))
      .attr("width", width / dataset.length - 1)
      .attr("height", d => height - yScale(d.gdp))
      .on("mouseover", function (event, d, i) {
        // Tooltip functionality
        const tooltip = d3.select("#tooltip");
        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`Date: ${d.date.toISOString().split("T")[0]}<br>GDP: $${d.gdp.toFixed(1)} Billion`)
        .attr("data-date", d.date.toISOString().split("T")[0])
        .style("left", `${event.pageX + 5}px`)
        .style("top", `${event.pageY - 28}px`);
    })
      .on("mouseout", function () {
    d3.select("#tooltip").transition().duration(200).style("opacity", 0); // Ocultar el tooltip
  });
      
  });