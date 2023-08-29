localStorage.setItem('theme', "theme-light");
document.documentElement.className = "theme-light";

var sizeX = 100;
var sizeY = 50;
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

function drawSpace(orbits){

//Add big ball ellipse to d3 svg as globe with blur filter
var filter = svg.append("defs")
      .append("filter")
      .attr("id", "blur")
      .append("feGaussianBlur")
      .attr("stdDeviation", 20); 
var globe = svg.append("g")

 globe.append("ellipse")
  .attr("class", "globe-outer")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("rx", 225)
  .attr("ry", 225)
  .style("filter", "url(#blur)")
  ;
  globe.append("ellipse")
  .attr("class", "globe-inner")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("rx", 220)
  .attr("ry", 220)
  ;

  //Add orbits
  for(var i=0;i<orbits.length;i++){
    //draw orbit
    svg.append("ellipse")
    .attr("class", "orbit")
    .attr("rx", orbits[i].rx)
    .attr("ry", orbits[i].ry)
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("transform", "translate(" + orbits[i].tx + "," +orbits[i].ty+ "),rotate(-25)")
    ;

    //draw circle
    svg.append("circle")
    .attr("class", "orbit-circle")
    .attr("r", orbits[i].r)
    .attr("cx", orbits[i].cx)
    .attr("cy", orbits[i].cy)
    .attr("transform", "translate(" + 0 + "," + 0+ "),rotate(-25)")
    .on("click", function(d){ alert("click on" + orbits[i].name); })

    // label
    svg.append("text")
    .attr("class", "orbit-label")
    .attr("x", orbits[i].cx-orbits[i].name.length*2)
    .attr("y", orbits[i].cy+2)
    .attr("transform", "translate(" + 0 + "," + 0+ "),rotate(-25)")
    .text(orbits[i].name)
    ;
  }
}





function start( link) {

  var simulation = d3.forceSimulation();
;
fetch(link)
    .then((response) => response.json())
    .then((json) => onLoad( json,simulation  ));

}

function onLoad( graph, simulation) {
  
  drawSpace( graph.orbits);

  graph.links.forEach(function(d){
  d.source = d.source_id;    
  d.target = d.target_id;
  });           
  
  var link = svg.append("g")
         .selectAll("line")
         .data(graph.links)
         .enter().append("line")
         .attr("class", "node-link");
   
  // Create groups for each node          
  var node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("rect")
          .data(graph.nodes)
          .enter().append("g");
          
  // Add background rectangle for each node     
  node.append("rect")
       .attr("width", sizeX)
       .attr("height", d=>d.isQuestion?sizeY/1.5:sizeY/2)
       .attr("x", -sizeX/2)
       .attr("y", d=>d.isQuestion?-sizeY/2:-sizeY/4)
      //  .attr("rx", d=>d.isQuestion?0:sizeY/4)
      //  .attr("ry", d=>d.isQuestion?0:sizeY/4)
       .attr("class", d=>d.isQuestion?"globe-rect":"globe-tag")
       .on("click", d=> alert("click on " + d.name))
        ;
 // Text for each node
  node.append("foreignObject")
      .attr("width", sizeX)
      .attr("height", d=>d.isQuestion?sizeY:sizeY/2)
      .attr("x", -sizeX/2)
      .attr("y", d=>d.isQuestion?-sizeY/2:-sizeY/8)
      .append("xhtml:div")
      .on("click", d=>{ alert("click on " + d.name); })
      .attr("class", d=>d.isQuestion?"node-label":"globe-label")
      .html(d=>d.keyName)
      ;

  simulation.force("link", d3.forceLink().id(d=>d.id).strength(0.1));
  simulation.force("center", d3.forceCenter(0, 0));
  simulation.nodes(graph.nodes).force('collision', d3.forceCollide(sizeX/2 + 10))
  simulation.force("link").links(graph.links);
  simulation.force("charge",d3.forceManyBody().strength(0.1));
  simulation.force('x', d3.forceX(0).strength(d=>(d.isQuestion)?0.1:1))
  simulation.force('y', d3.forceY(0).strength(d=>(d.isQuestion)?0.1:1))
  simulation.on("tick", ticked);
    // do all tick from simulation till end
  for (var i = 0; i < 100; i++) {
    simulation.tick();
  }

  
  // ticked();

  function ticked() {

    link
        .attr("x1", d=> d.source.x)
        .attr("y1", d=> d.source.y)
        .attr("x2", d=> d.target.x)
        .attr("y2", d=> d.target.y);
    
    node
        // .attr("transform",d=> d.isQuestion? "translate(" + d.x + "," + d.y + ")":"translate(0,0") TODO
         .attr("transform",d=>"translate(" + d.x + "," + d.y + ")" )
         .attr("id", d=> d.id);
  }

}

// listen to keydown events on the document
d3.select(document).on("keydown", function() {
  //if d key pressed
  if (d3.event.keyCode === 68) {
    localStorage.setItem('theme', "theme-dark");
    document.documentElement.className = "theme-dark";
  }
  // if l key pressed
  if (d3.event.keyCode === 76) {
    localStorage.setItem('theme', "theme-light");
    document.documentElement.className = "theme-light";

  }
} );
