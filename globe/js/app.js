// set dark theme as default
localStorage.setItem('theme', "theme-dark");
document.documentElement.className = "theme-dark";

//get screen width and height
width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;
height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

// set basic disposition
var sizeX = 90;
var sizeY = 50;
var padding = 7;
var s = height/600;
var w =width/3.5;
var h =height/2;

// set svg
var svgRoot = d3.select("svg")
      .attr("width", width)
      .attr("height", height);
var svg  =  svgRoot.append("svg:g")
      .attr("transform","translate("+w+","+h+") scale("+s+","+s+")"); 

//Zoom is deactivated for now but leaving it here in case we want to use it later
// var zoom = d3.zoom().on("zoom", function(){
//   svg.attr("transform", d3.event.transform);
// });
// svgRoot.call(zoom) 
//      .call(zoom.transform, d3.zoomIdentity.translate(w, h).scale(s));

// start the simulation
start('./globe.json')

function drawSpace(orbits, about)
{
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
    .attr("rx", 245)
    .attr("ry", 245)
    .style("filter", "url(#blur)")
    ;
    globe.append("ellipse")
    .attr("class", "globe-inner")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("rx", 240)
    .attr("ry", 240)
    .on("mouseleave", function(d){ d3.select(".about").html(about.text)  })
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
      .attr("transform", "translate(" + orbits[i].tx + "," +orbits[i].ty+ "),rotate("+ orbits[i].a + ")")
      ;

    //draw circle
    svg.append("circle")
      .attr("class", "orbit-circle")
      .attr("r", orbits[i].r)
      .attr("cx", orbits[i].cx)
      .attr("cy", orbits[i].cy)
      .attr("transform", "translate(" + 0 + "," + 0+ "),rotate(0)")
      .on("mouseenter", function(d){ d3.select(this).classed("hover" , true); })
      .on("mouseleave", function(d){ d3.select(this).classed("hover" , false); })
      .on("click", function(d){ console.log(d) })
      ;

    // label
    svg
      .append("text")
      .attr("class", "orbit-label")
      .style("width", orbits[i].r + "px")
      .style("height", orbits[i].r + "px")
      .attr("x", orbits[i].cx-orbits[i].name.length*3)
      .attr("y", orbits[i].cy+2)
      .attr("transform", "translate(" + 0 + "," + 0+ "),rotate(0)")
      .text(orbits[i].name)
      .on("click", function(d){ console.log(d) })
      ;
    }
    // Add about text
    svg.append("foreignObject")
      .attr("width", 300)
      .attr("height", 400)
      .attr("x", about.x)
      .attr("y", about.y)
      .append("xhtml:div")
      .classed("about", true)
      .html(about.text)
  ;
}

function start( link) {

  // create simulation
  var simulation = d3.forceSimulation();
  // load json
  fetch(link)
    .then((response) => response.json())
    .then((json) => onLoad( json,simulation  ));
}

function onLoad( graph, simulation) {
  // draw space
  drawSpace( graph.orbits, graph.about);

  // init links
  graph.links.forEach(function(d){
  d.source = d.source_id;    
  d.target = d.target_id;
  });           
  
  var link = svg.append("g")
         .selectAll("path")
         .data(graph.links)
         .enter().append("path")
         .attr("class", "node-link")
         ;
   
  // Create groups for each node          
  var node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("rect")
          .data(graph.nodes)
          .enter().append("g")
          .on("mouseenter", hoverIn)
          .on("mouseleave", hoverOut)
          .attr("transform",d=> d.isQuestion? 
                "translate(0,0)":
                "translate("+graph.map[d.name].x+","+graph.map[d.name].y+")")
          
  // Add background rectangle for each node     
   node.append("rect")
       .attr("width", d=>d.isQuestion? sizeX: sizeX)
       .attr("height", d=>d.isQuestion?sizeX*0.6:sizeY/2)
       .attr("x",d=>d.isQuestion? -sizeX/2:-sizeX/2)
       .attr("y", d=>d.isQuestion?-sizeY/2:-sizeY/4)
       .attr("rx", d=>d.isQuestion?4:sizeY/4)
       .attr("ry", d=>d.isQuestion?4:sizeY/4)
       .attr("transform",d=> d.isQuestion? "rotate(0)":"rotate("+ graph.map[d.name].a+")")
       .attr("class", d=>d.isQuestion?"globe-rect":"globe-tag")
       .classed( d=>d.keyName, true)
       .on("click", d=> alert("click on " + d.name))
       .attr("fill", function(d){
         var ori = d3.select(this).style("fill");
         var oriSub = ori.substring(4,ori.length-1);
         d.rgb = ori;
         d.hls = RGBToHSL(oriSub.split(",")[0],oriSub.split(",")[1],oriSub.split(",")[2]);
       })
       ;

 // Text for each node
   node.append("foreignObject")
      .attr("class", "label-container")
      .attr("width", d=>d.isQuestion? sizeX: sizeX)
      .attr("height", d=>d.isQuestion?"54px":sizeY/2)
      .attr("x", -sizeX/2)
      .attr("y", d=>d.isQuestion?"-25px":-sizeY/8)
      .attr("transform",d=> d.isQuestion? "rotate(0)":"rotate("+ graph.map[d.name].a+")")
      .append("xhtml:div")
      .on("click", d=>{ alert("click on " + d.name); })
      .attr("class", d=>d.isQuestion?"node-label":"globe-label")
      .style("padding", d=>d.isQuestion?padding + "px":"0px")
      .style("height", d=>d.isQuestion?(sizeX*0.6 - 2*padding) +"px":sizeY/2)
      .html(d=>d.keyName)
      ;

  // setup simulation forces    
  simulation.force("link", d3.forceLink().id(d=>d.id).strength(0.0));
  simulation.force("center", d3.forceCenter(0, 0));
  simulation.nodes(graph.nodes).force('collision', d3.forceCollide(d=>d.isQuestion?sizeX/2+10:0))
  simulation.force("link").links(graph.links);
  simulation.force("charge",d3.forceManyBody().strength(0.1));
  simulation.force('x', d3.forceX(0).strength(d=>(d.isQuestion)?0.6:1))
  simulation.force('y', d3.forceY(0).strength(d=>(d.isQuestion)?0.7:0.1))
  simulation.on("tick", ticked);
    // do all tick from simulation till end
  for (var i = 0; i < 100; i++) {
    simulation.tick();
  }
  function ticked() {
    
    // Strait links version
    // link
    // .attr("x1", function(d){ return d.source.isQuestion?d.source.x:graph.map[d.source.keyName].x ;})
    // .attr("y1", function(d){return d.source.isQuestion?d.source.y:graph.map[d.source.keyNamee].y; })
    // .attr("x2", function(d){ return d.target.isQuestion?d.target.x:graph.map[d.target.keyName].x ;})
    // .attr("y2", function(d){ return d.target.isQuestion?d.target.y:graph.map[d.target.keyName].y ;})
 
    // Curved links version
  link.attr("d", 
    function(d) {
      var sx =  d.source.isQuestion?d.source.x:graph.map[d.source.name].x;
      var sy =  d.source.isQuestion?d.source.y:graph.map[d.source.name].y;
      var tx =  d.target.isQuestion?d.target.x:graph.map[d.target.name].x;
      var ty =  d.target.isQuestion?d.target.y:graph.map[d.target.name].y;

      var cx = (sx + tx);
      var cy = (sy + ty);
      return "M " + 
          sx + " " + sy + 
          " Q " + 
          cx/7 + " " + cy/7  + " " +
          //0 + " " + 0  + " " +
          tx + " " + ty;
  });
  // move nodes
    node.attr("transform",d=> d.isQuestion? 
              "translate(" + d.x + "," + d.y + ")":
              "translate("+graph.map[d.name].x+","+graph.map[d.name].y+")");

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

function hoverIn (d){
  //Reset all rects and lines
  clearInterval(timer);
  d3.selectAll("rect").style("fill",d=>d.rgb);
  d3.selectAll("path").style("stroke-width", "0.5px");
  // select all lines with the same source or target

   d3.selectAll("path")
     .filter(l=> l.source.keyName === d.keyName || l.target.keyName === d.keyName)
     .style("stroke-width", "2px")
     .attr("hack", function(l){ 
         d3.selectAll("rect")
         .filter(r=>r.keyName == l.source.keyName || r.keyName==l.target.keyName)
         .style("fill", function(r){
          var factor = r.isQuestion? 1:0.5;
          var ca = HSLToRGB (r.hls[0], r.hls[1], r.hls[2]+30*factor);
          return "rgb("+ca[0]+","+ca[1]+","+ca[2]+")";
        });
         ;
        })
     ;

    //get html from about div
    d3.select(".about").html(d.name  + " - Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
}
var timer;
function hoverOut (d){
  // select all lines with the same source or target
  var op = 30;
  timer = setInterval(function () {
    if (op <= 0){
        clearInterval(timer);
    }
    op -= 0.5;
     d3.selectAll("path")
    .filter(l=>l.source.keyName === d.keyName|| l.target.keyName === d.keyName)
    .style("stroke-width", (op /15 + 0.5) + "px")
    .style("fill", function(l){ // fade out for rects
          //Select all rects with r
          d3.selectAll("rect")
          .filter(r=>r.keyName == l.source.keyName || r.keyName==l.target.keyName)
          .style("fill", function(r){
            var factor = r.isQuestion? 1:0.5;
            var ca = HSLToRGB (r.hls[0], r.hls[1], r.hls[2]+op*factor );
            return "rgb("+ca[0]+","+ca[1]+","+ca[2]+")";
          });
          return op + "px";
      });
    }
    , 60);
}


const HSLToRGB = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};

function RGBToHSL(r,g,b) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;
  
    // Find greatest and smallest channel values
    let cmin = Math.min(r,g,b),
        cmax = Math.max(r,g,b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;
    // Calculate hue
  // No difference
  if (delta == 0)
    h = 0;
  // Red is max
  else if (cmax == r)
    h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax == g)
    h = (b - r) / delta + 2;
  // Blue is max
  else
    h = (r - g) / delta + 4;

  h = Math.round(h * 60);
    
  // Make negative hues positive behind 360°
  if (h < 0)
      h += 360;
  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [ h ,  s , + l ];
}
