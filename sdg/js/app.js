var svg = d3.select("svg"),
width = +svg.attr("width"),
height = +svg.attr("height")

start('./ALL.json')

function start( link) {

;

var simulation = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.id; }))
.force("charge", d3.forceManyBody().strength(-400))
.force("center", d3.forceCenter(width/2 , height/2 ))
.force("x", d3.forceX())
.force("y", d3.forceY());
;
fetch(link)
    .then((response) => response.json())
    .then((json) => load( json,simulation  ));

}

function load( graph, simulation) {

  console.log(graph)

  graph.links.forEach(function(d){
  d.source = d.source_id;    
  d.target = d.target_id;
  });           
  
  var link = svg.append("g")
              .style("stroke", "#aaa")
              .selectAll("line")
              .data(graph.links)
              .enter().append("line");
  
  var node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(graph.nodes)
          .enter().append("circle")
          .attr("r", 60)
         // .call(drag(simulation))
          .on("click", function(d){ alert("click on " + d.name); })
          .on("mouseenter", mouseenter)
          .on("mouseleave", mouseleave)
  ;
  
  var label = svg.append("g")
    .attr("class", "labels")
    .selectAll("text")
    .data(graph.nodes)
    .enter().append("text")
      .attr("class", "label")
      .text(function(d) { return d.name; })
      .attr("pointer-events", "none");
      

  simulation.nodes(graph.nodes)
    .force('collision', d3.forceCollide().radius(function(d) {
      return d.radius + 1 })).on("tick", ticked);
  
  simulation.force("link").links(graph.links);
  
  function ticked() {

  link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
  
  node
       .attr("r", function (d) { return d.radius/1.2; })
       .style("fill", function (d) { return d.color; })
       .style("stroke", "#969696")
       .style("stroke-width", "0px")
       .attr("cx", function (d) { return d.x; })
       .attr("cy", function(d) { return d.y; })
       .attr("id", function (d) { return d.id; });
  
  label
      .attr("x", function(d) { return d.x -d.radius/1.6 ; })
      .attr("y", function (d) { return d.y+d.radius/5; })
      .style("font-size", function (d) { return d.radius/2.5; })
      .style("font-family","Helvetica, sans-serif")
      .style("fill", "#eeeeee")
      .style("margin", "auto")
      .style("text-align", "center");
  };
  }
drag = simulation => {
  
  function dragstarted(event, d) {
    // if (!event.active) simulation.alphaTarget(0.3).restart();
  }
  
  function dragged(event, d) {
  }
  
  function dragended(event, d) {
    // if (!event.active) simulation.alphaTarget(0);
    // d.fx = null;
    // d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

function click(d) 
{
    alert(d.name); //considering dot has a title attribute
}

function mouseenter(d) 
{
  //var circle = document.getElementById(d.id);
  //circle.style.fill = d.overcolor;
}
function mouseleave(d) 
{
  //var circle = document.getElementById(d.id);
  //circle.style.fill = d.color;
}

/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

function switchData(link) {
  console.log(link);
  svg.selectAll("*").remove();
  start(link);
}

