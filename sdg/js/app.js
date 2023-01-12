
var svg = d3.select("svg");


width = +svg.attr("width"),
height = +svg.attr("height")

var zoom = d3.zoom().on("zoom", function(){
  svg.attr("transform", d3.event.transform);
});

svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
   .call(zoom) // here
   .call(zoom.transform, d3.zoomIdentity.translate(50, 50).scale(0.5))
   .append("svg:g")
   .attr("transform","translate(50,50) scale(.5,.5)"); 



var svgns = "http://www.w3.org/2000/svg";
start('./ALL.json')

function start( link) {



var simulation = d3.forceSimulation()
.force("link", d3.forceLink().id(function(d) { return d.id; }))
.force("charge", d3.forceManyBody().strength(-400))
.force("center", d3.forceCenter(width/2 , height/1.2))
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
              .style("stroke", "#444")
              .selectAll("line")
              .data(graph.links)
              .enter().append("line");

 var imgs = svg.append("g")
              .attr("class", "images")
              .selectAll("image")
              .data(graph.nodes).enter()
              .append("svg:image")   
               .attr("xlink:href", function(d){if (d.name.includes("Goal")) return "resources/images bw/e-web-goal-"+d.name.split(" ")[1]+"-min.png"})
               .on("click", function(d){ alert("click on " + d.name); })  ;

  var node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(graph.nodes)
          .enter().append("circle")
          .attr("justify-content", "center")
         // .call(drag(simulation))
          .on("click", function(d){ alert("click on " + d.name); })
          .on("mouseenter", mouseenter)
          .on("mouseleave", mouseleave)
  ;

  
  var label = svg.append("g")
    .attr("position","relative")
    .attr("class", "labels")
    .attr("dominant-baseline", "middle")
    .selectAll("text")
    .attr("class", "labels")
    .attr("class", "labels")
    .data(graph.nodes)
    .enter().append("g")
    .each(function (d) {
        var arr = d.name.split(" ");
        var newData = [];
        for (i = 0; i < arr.length; i++) {
           newData.push({label : arr[i], idx : i})
        }
            d3.select(this).selectAll("text").data(newData).enter().append("text")
                .text(function (a) {if (d.name.includes("Goal")) return "" ; else return  a.label  })
                .attr("dy",function (a) { 
                  if (arr.length === 1)
                    return  d.radius/10;
                  else
                   return  a.idx? 2.5 + d.radius/4: -1-d.radius/6 ;
                  })
                .attr("dx",0)
                .attr("dx",0)
                .attr("position","absolute")
                .attr("class","label")
                .attr("text-anchor","middle")
        }

    );

  simulation.nodes(graph.nodes)
    .force('collision', d3.forceCollide().radius(function(d) {
      return 30 +d.radius/1.1  })).on("tick", ticked);
  
  simulation.force("link").links(graph.links);
  simulation.force("charge",d3.forceManyBody());
  simulation.force('x', d3.forceX().x(function(d) {return 100;}))
  simulation.force('y', d3.forceY().y(function(d) { return 100;}))
  function ticked() {

    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });
    
    node
         .attr("r", function (d) { return 20 + d.radius/2; })
         .style("fill", function (d) {  if (d.name.includes("Goal")) return "transparent" ; else return  d.color  })
         .style("stroke", "#969696")
         .style("stroke-width", "0px")
         .attr("cx", function (d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .attr("id", function (d) { return d.id; });
    
     label
         .attr("transform", function(d) { return "translate(" +d.x+"," +d.y+")"; })
         .style("font-size", function (d) { 
          var arr=d.name.split(" ");
          if (arr.length === 1)
            return  5 + (d.radius / arr[0].length);
          else
           return  5 + (d.radius / Math.max ( arr[0].length, arr[1].length));
          })
         .style("font-family","Helvetica, sans-serif")
         .style("fill", "#eeeeee")
         .attr("id", function (d) { return  "label" +d.id; });
  
  
    imgs
        .attr("x", function(d) { return d.x- 10 -d.radius /0.9; })
        .attr("y", function (d) { return d.y -10-  d.radius/0.9; })
        .attr("width", function (d) { return 20 + d.radius/0.45; })
        .attr("heigth", function (d) { return 20 +  d.radius/0.45; })
        .attr("id", function (d) { return  "img" +d.id; });
    };
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


