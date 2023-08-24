
var svg = d3.select("svg");

//get screen width and height
width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;
s = height/600;
w =width/2;
h =height/2;
var svgRoot = d3.select("svg");

svgRoot.attr("width", width)
       .attr("height", height)
       ;

var svg  =  svgRoot.append("svg:g")
var zoom = d3.zoom().on("zoom", function(){
  svg.attr("transform", d3.event.transform);
});

svgRoot.call(zoom) 
     .call(zoom.transform, d3.zoomIdentity.translate(w, h).scale(s));

svg.attr("transform","translate("+w+","+h+") scale("+s+","+s+")")
   ; 


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
  .attr("transform", "translate(" + -200 + "," +120 + "),rotate(-25)")
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
  .attr("transform", "translate(" + -200 + "," + +180 + "),rotate(-25)")
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
  .attr("transform", "translate(" + -200 + "," + +240 + "),rotate(-25)")
  ;

  var circle1 = svg.append("circle")
  .attr("r", "40")
  .attr("stroke", "black")
  .attr("stroke-width", "2px")
  .attr("fill", "white")
  .attr("cx", 320)
  .attr("cy", -130)
  .attr("transform", "translate(" + 0 + "," + 0+ "),rotate(-25)")
  .on("click", function(d){ alert("click on teams"); })

  var circle2 = svg.append("circle")
  .attr("r", "30")
  .attr("stroke", "black")
  .attr("stroke-width", "2px")
  .attr("fill", "white")
  .attr("cx", 410)
  .attr("cy", -70)
  .attr("transform", "translate(" + 0 + "," + 0 + "),rotate(-25)")
  .on("click", function(d){ alert("click on events"); })

  var circle3 = svg.append("circle")
  .attr("r", "20")
  .attr("stroke", "black")
  .attr("stroke-width", "2px")
  .attr("fill", "white")
  .attr("cx", 500)
  .attr("cy", 0)
  .attr("transform", "translate(" + 0 + "," + 0 + "),rotate(-25)")
  .on("click", function(d){ alert("click on about"); })

// label
var label1 = svg.append("text")
.attr("x", 310)
.attr("y", -130)
.attr("transform", "translate(" + 0 + "," + 0+ "),rotate(-25)")
.text("Teams")
.style("font-size",  "7.0px")
.style("font-weight", "bold")
.style("font-family", "Helvetica")
.style("display", "block")
.style("text-align", "left")
;

var label2 = svg.append("text")
.attr("x", 400)
.attr("y", -70)
.attr("transform", "translate(" + 0 + "," + 0 + "),rotate(-25)")
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
.attr("transform", "translate(" + 0 + "," +0 + "),rotate(-25)")
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
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("rx", 220)
  .attr("ry", 220)
  .style("fill", "#444")
  .style("stroke", "#444")
  .style("stroke-width", "2px")
  .style("filter", "url(#blur)")
  ;
  globe.append("ellipse")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("rx", 220)
  .attr("ry", 220)
  .style("fill", "white")
  .style("stroke", "#444")
  .style("stroke-width", "2px")
  ;



function start( link) {

  var simulation = d3.forceSimulation();
;
fetch(link)
    .then((response) => response.json())
    .then((json) => load( json,simulation  ));

}

function load( graph, simulation) {

  //split graph nodes in two arrays with radius 10 and 20
  var nodes1 = graph.nodes.filter(d=> d.radius === 10);
  var nodes2 = graph.nodes.filter(d=>  d.radius === 50);

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
       .attr("width", d=>d.radius*2)
       .attr("height", d=>d.radius)
       .attr("x", d=>-d.radius)
       .attr("y", d=>-d.radius/2)
       .attr("class", "globe-rect")
       .on("click", d=> alert("click on " + d.name))
         // .on("mouseenter", mouseenter)
         // .on("mouseleave", mouseleave)
          ;

  node.append("foreignObject")
      .attr("width", d=>d.radius*2)
      .attr("height", d=>d.radius)
      .attr("x", d=>-d.radius)
      .attr("y", d=>-d.radius/2)
      .append("xhtml:div")
      .on("click", d=>{ alert("click on " + d.name); })
      .attr("class", "node-label")
      .html(d=>d.name)
      ;

  var circle = svg.append("g")
       .attr("class", "nodes")
       .selectAll("circle")
       .data(nodes1)
       .enter().append("circle")
       .attr("class", "globe-circle")
       .attr("r", d=>d.radius)
       .on("click", d=>alert("click on " + d.name))
       // .on("mouseenter", mouseenter)
       // .on("mouseleave", mouseleave)
       ;
  
  var label = svg.append("g")
    .selectAll("text")
    .data(nodes1).enter().append("text")
    .attr("class", "globe-label")
    .text(d=>d.name)   
    ;

 
  simulation.force("link", d3.forceLink().id(d=>d.id));
  simulation.force("center", d3.forceCenter(0, 0));
  simulation.nodes(graph.nodes)
    .force('collision', d3.forceCollide(d=>d.radius+20))
    .on("tick", ticked)
    ;
  simulation.force("link").links(graph.links);
  simulation.force("charge",d3.forceManyBody().strength(-10));
  simulation.force('x', d3.forceX(0))
  simulation.force('y', d3.forceY(0))
  
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