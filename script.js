const margin = {
    top : 40,
    right:30,
    bottom:70,
    left:60,
  },
   width = 800 - margin.left-margin.right,
  height = 500 - margin.top - margin.bottom
  
  const svg = d3.select("#viewData")
    .append("svg") 
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
  
  fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
    .then((response) => response.json())
    .then((json) => {
    const data = json
   
     const keys = [["Riders with doping allegations", "black"], ["No doping allegations", "white"]]
      const size = 20
      
       const x = d3.scaleLinear()
        .domain([
          d3.min(data, item => item.Year) - 1, 
          d3.max(data, item => item.Year) + 1 
        ])
        .range([0, width])
       
       svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format('d')))
    
    const y = d3.scaleTime()
        .domain([
          d3.min(data, item => new Date(item.Seconds * 1000)), 
          d3.max(data, item => new Date(item.Seconds * 1000))
        ])
        .range([0, height])
    
      svg.append("g")
        .attr("id", "y-axis")
        .call(d3.axisLeft(y).tickFormat(d3.timeFormat('%M:%S')))
    
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("y", -55)
        .attr("x", -85)
        .attr("dy", ".95em")
        .attr("transform", "rotate(-90)")
        .text("Time in Minutes (min)")
    .attr("font-weight", "bold")
    
     const tooltip = d3.select("body")
        .append("div")
        .attr("id", "tooltip")
        .style("position", "absolute")
        .style("padding", "10px")
        .style("background-color", "grey")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("visibility", "hidden")
       
        const mouseover = (event, item) => {
        tooltip.html(
          item.Name + ": " + item.Nationality + "<br />" +
          "Year: " + item.Year + ", Time: " + item.Time + 
          (item.Doping ? "<br /><br />" + item.Doping  : "") 
        )
          .style("visibility", "visible")
      }
  
    const mousemove = (event, item) => {
        tooltip.style("transform","translateY(-50%)")
          .style("left", (event.clientX) + 30 + "px")
          .style("top", event.clientY + "px")
          .attr('data-year', item.Year)
      }     
       
        const mouseleave = (event, item) => {
        tooltip.style("visibility", "hidden")
      }
        
        svg.append('g')
        .selectAll("dot")
        .data(data)
        .join("circle")
          .attr("class", "dot")
          .attr("data-xvalue", item => item.Year)
          .attr("data-yvalue", item => new Date(item.Seconds * 1000))
          .attr("cx", item => x(item.Year))
          .attr("cy", height)
          .attr("r", 5)
          .style("fill", item => (item["Doping"] === "" ? "white" : "black"))
          .style("stroke", "black")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)   
  
      svg.append("g")
        .attr("id", "legend")
      .selectAll("mydots")
        .data(keys)
        .enter()
        .append("rect")
          .attr("x", 450)
          .attr("y", (item,index) => 150 + index * (size + 5))
          .attr("width", size)
          .attr("height", size)
          .style("fill", item => item[1])
    
      svg.select("#legend")
        .selectAll("mylabels")
          .data(keys)
          .enter()
          .append("text")
            .attr("x", 450 + size * 1.5)
            .attr("y", (item,index) => 150 + index * (size + 5) + ( size / 2))
        .attr("font-size", "19px")    
    .attr("font-weight", "bold")
        .style("fill", item => item[1])
            .text(item => item[0])
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    
     svg.selectAll("circle")
        .transition()
        .duration(500)
        .attr("cy", item => y(new Date(item.Seconds * 1000)))
        .delay((item, index) => index * 10)
    })
    .catch(e => console.error(e));