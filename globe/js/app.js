
var svg = d3.select("svg");


width = +svg.attr("width"),
height = +svg.attr("height")
var sw = screen.width;
var sh = screen.height;

var zoom = d3.zoom().on("zoom", function(){
  svg.attr("transform", d3.event.transform);
});

svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
   .call(zoom) // here
   .call(zoom.transform, d3.zoomIdentity.translate(-width/4, -height/3).scale(1.2))
   .append("svg:g")
   .attr("transform","translate("+(-width/4)+","+(-height/3)+") scale(1.2,1.2)"); 

var svgns = "http://www.w3.org/2000/svg";
start('./globe.json')

// Add orbits as curves
var orbit1 = svg.append("ellipse")
  .attr("rx", "600")
  .attr("ry", "400")
  .attr("stroke", "#444")
  .attr("stroke-width", "1px")
  .attr("fill", "none")
  .attr("transform", "rotate(45)")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("transform", "translate(" + (width/2-200) + "," + (height/2+120) + "),rotate(-25)")
  ;

  var orbit2 = svg.append("ellipse")
  .attr("rx", "700")
  .attr("ry", "500")
  .attr("stroke", "#444")
  .attr("stroke-width", "1px")
  .attr("fill", "none")
  .attr("transform", "rotate(45)")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("transform", "translate(" + (width/2-200) + "," + (height/2+180) + "),rotate(-25)")
  ;

  var orbit32 = svg.append("ellipse")
  .attr("rx", "800")
  .attr("ry", "600")
  .attr("stroke", "#444")
  .attr("stroke-width", "1px")
  .attr("fill", "none")
  .attr("transform", "rotate(45)")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("transform", "translate(" + (width/2-200) + "," + (height/2+240) + "),rotate(-25)")
  ;

  var circle1 = svg.append("circle")
  .attr("r", "40")
  .attr("stroke", "black")
  .attr("stroke-width", "2px")
  .attr("fill", "white")
  .attr("cx", 300)
  .attr("cy", -150)
  .attr("transform", "translate(" + (width/2) + "," + (height/2) + "),rotate(-25)")
  .on("click", function(d){ alert("click on teams"); })

  var circle2 = svg.append("circle")
  .attr("r", "30")
  .attr("stroke", "black")
  .attr("stroke-width", "2px")
  .attr("fill", "white")
  .attr("cx", 400)
  .attr("cy", -100)
  .attr("transform", "translate(" + (width/2) + "," + (height/2) + "),rotate(-25)")
  .on("click", function(d){ alert("click on events"); })

  var circle3 = svg.append("circle")
  .attr("r", "20")
  .attr("stroke", "black")
  .attr("stroke-width", "2px")
  .attr("fill", "white")
  .attr("cx", 500)
  .attr("cy", 0)
  .attr("transform", "translate(" + (width/2) + "," + (height/2) + "),rotate(-25)")
  .on("click", function(d){ alert("click on about"); })

// label
var label1 = svg.append("text")
.attr("x", 290)
.attr("y", -150)
.attr("transform", "translate(" + (width/2) + "," + (height/2) + "),rotate(-25)")
.text("Teams")
.style("font-size",  "7.0px")
.style("font-weight", "bold")
.style("font-family", "Helvetica")
.style("display", "block")
.style("text-align", "left")
;

var label2 = svg.append("text")
.attr("x", 390)
.attr("y", -100)
.attr("transform", "translate(" + (width/2) + "," + (height/2) + "),rotate(-25)")
.text("Events")
.style("font-size",  "7.0px")
.style("font-weight", "bold")
.style("font-family", "Helvetica")
.style("display", "block")
.style("text-align", "left")
;

var label3 = svg.append("text")
.attr("x", 490)
.attr("y", 0)
.attr("transform", "translate(" + (width/2) + "," + (height/2) + "),rotate(-25)")
.text("About")
.style("font-size",  "7.0px")
.style("font-weight", "bold")
.style("font-family", "Helvetica")
.style("display", "block")
.style("text-align", "left")
;

//Add big ball ellipse to d3 svg as globe with blur filter
var filter = svg.append("defs")
      .append("filter")
      .attr("id", "blur")
      .append("feGaussianBlur")
      .attr("stdDeviation", 20); 
var globe = svg.append("g")

 globe.append("ellipse")
  .attr("cx", width/2)
  .attr("cy", height/2)
  .attr("rx", 220)
  .attr("ry", 220)
  .style("fill", "#444")
  .style("stroke", "#444")
  .style("stroke-width", "2px")
  .style("filter", "url(#blur)")
  ;
  globe.append("ellipse")
  .attr("cx", width/2)
  .attr("cy", height/2)
  .attr("rx", 220)
  .attr("ry", 220)
  .style("fill", "white")
  .style("stroke", "#444")
  .style("stroke-width", "2px")
  ;



function start( link) {

var simulation = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.id; }))
.force("charge", d3.forceManyBody().strength(-10))
.force("center", d3.forceCenter(width/2 , height/2))
;
;
fetch(link)
    .then((response) => response.json())
    .then((json) => load( json,simulation  ));

}

function load( graph, simulation) {

  //split graph nodes in two arrays with radius 10 and 20
var nodes1 = graph.nodes.filter(function(d){return d.radius === 10});
var nodes2 = graph.nodes.filter(function(d){return d.radius === 20});

  graph.links.forEach(function(d){
  d.source = d.source_id;    
  d.target = d.target_id;
  });           
  
  var link = svg.append("g")
         .style("stroke", "#444")
         .selectAll("line")
         .data(graph.links)
         .enter().append("line");

              
            
  var node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("rect")
          .data(nodes2)
          .enter().append("g");
          
       
   node.append("rect")
          .attr("width", function (d) { return 100; })
          .attr("height", function (d) { return 45; })
          .style("fill", function (d) {   return  d.color  })
          .attr("x", function (d) { return -50; })
          .attr("y", function (d) { return -20; })
          .style("stroke", "#969696")
          .style("stroke-width", "0px")
          .attr("justify-content", "center")
          .on("click", function(d){ alert("click on " + d.name); })
         // .on("mouseenter", mouseenter)
         // .on("mouseleave", mouseleave)
          ;

  node.append("foreignObject")
          .attr("width", function(d) { return 90})
          .attr("height", function(d) { return 40})
          .attr("x", function(d) { return -45;})
          .attr("y", function(d) { return -15;})
          .append("xhtml:div")
          .on("click", d=>{ alert("click on " + d.name); })
          .attr("class", "node-label")
          .html(function(d) { return d.name; })
          .style("text-align", "left")
          .style("font-size",  "7.0px")
          .style("font-family", "Helvetica")
          .style("display", "block")
          .style("text-align", "left")
          .style("text-overflow", "ellipsis")
          .style("line-height", "1.2em")
          .style("padding", "3px")
          .style("color", "lightgrey")
          .style("vertical-align", "top" )
          .style("word-wrap", "break-word")
          ;

  var circle = svg.append("g")
           .attr("class", "nodes")
           .selectAll("circle")
           .data(nodes1)
           .enter().append("circle")
           .attr("justify-content", "center")
           .attr("r", function (d) { return 10; })
           .style("fill", function (d) {  return "white" ; })
           .style("stroke", "#444")
           .style("stroke-width", "2px")
           .on("click", function(d){ alert("click on " + d.name); })
 // .on("mouseenter", mouseenter)
 // .on("mouseleave", mouseleave)
;
  
  var label = svg.append("g")
    .selectAll("text")
    .attr("class", "labels")
    .data(nodes1).enter().append("text")
    .text(function(d) { return d.name; })
    .style("font-size",  "7.0px")
    .style("font-weight", "bold")
    .style("font-family", "Helvetica")
    .style("display", "block")
    .style("text-align", "left")
    .style("text-overflow", "ellipsis")
    .style("line-height", "1.2em")
    .style("color", "#444")
    .style("padding", "3px")
;




  simulation.nodes(graph.nodes)
    .force('collision', d3.forceCollide().radius(function(d) {
      return 55 })).on("tick", ticked);
  
  simulation.force("link").links(graph.links);
  simulation.force("charge",d3.forceManyBody());
  simulation.force('x', d3.forceX(1))
  simulation.force('y', d3.forceY(1))

  function ticked() {

    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    
    node

         .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
         .attr("id", function (d) { return d.id; });

    circle
         .attr("cx", function (d) { return d.x; })
         .attr("cy", function(d) { return d.y ; })
         .attr("id", function (d) { return d.id; });
    
    label
         .attr("x", function (d) { return d.x +13; })
         .attr("y", function(d) { return d.y ; })
         .attr("id", function (d) { return  "label" +d.id; });


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

  }
function mouseenter(d) 
{
  d3.select(this).attr("r",function (d) { return 70;});
  var label = document.getElementById("label" + d.id);
  var arr=d.name.split(" ");
  if (arr.length === 1)
     label.style.fontSize =  (150 / arr[0].length) + "px";
  else 
  {
     label.style.fontSize =   (150 / Math.max ( arr[0].length, arr[1].length))+ "px";
     label.childNodes[0].setAttribute("dy", 7 + d.radius/2+ "px");
     label.childNodes[1].setAttribute("dy", -4-d.radius/4 + "px");
  }

  var pathes =document.querySelectorAll('line');
  for (i = 0; i < pathes.length; i++) 
  {
        if (pathes[i].x2.baseVal.value.toPrecision(4) === d.x.toPrecision(4) 
        ||  pathes[i].x1.baseVal.value.toPrecision(4) === d.x.toPrecision(4))
        {
          pathes[i].setAttribute("stroke-width", 4);
          pathes[i].setAttribute("stroke",d.color);
        }  
  }
  if (d.name.includes("Goal")) 
  {
    var img = document.getElementById("img" + d.id);
    img.setAttributeNS('http://www.w3.org/1999/xlink', "href",  "resources/images/e-web-goal-"+d.name.split(" ")[1]+"-min.png")
  }
}
function mouseleave(d) 
{
  d3.select(this).attr("r",function (d) { return 20 + d.radius/2;});
  //var circle = document.getElementById(d.id);
  var pathes =document.querySelectorAll('line');
  for (i = 0; i < pathes.length; i++) {
     pathes[i].setAttribute("stroke-width", 1);
     pathes[i].setAttribute("stroke", "#444");
  }
  var label = document.getElementById("label" + d.id);
  var arr=d.name.split(" ");
  if (arr.length === 1)
     label.style.fontSize =   5 + (d.radius / arr[0].length) + "px";
  else
  {
     label.style.fontSize =   5 + (d.radius / Math.max ( arr[0].length, arr[1].length))+ "px";
     label.childNodes[0].setAttribute("dy", 2.5 + d.radius/4+ "px");
     label.childNodes[1].setAttribute("dy", -1-d.radius/6 + "px");
  }

  if (d.name.includes("Goal")) 
  {
    var img = document.getElementById("img" + d.id);
    img.setAttributeNS('http://www.w3.org/1999/xlink', "href",  "resources/images bw/e-web-goal-"+d.name.split(" ")[1]+"-min.png")
  }
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
  svg.selectAll("*").remove();
  start(link);
}


}