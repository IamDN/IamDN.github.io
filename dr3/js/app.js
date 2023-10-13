const svgns = "http://www.w3.org/2000/svg";


// get real level of svg element
var width = document.documentElement.clientWidth,
    height = document.documentElement.clientHeight;
 var content;
 var   root;
 var nodes;
var  i = 0;
var testX =0;
var gi =1;
var test =0;
holdingX = false;


var force = d3.layout.force()
    .linkDistance(d=>d.level >= 1 ? 20 : 50)
    .charge(-400)
    .gravity(0.001)
    .friction(0.7)
    .linkStrength(0.4)
    .theta(0.2)
    .alpha(0.1)
    .size([width, height])
    .on("tick", onTick);


var svg = d3.select("#svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

svg.append("g")
    .attr("class", "groups")
    .attr("id", "groups");

const groupsLayer = document.getElementById("groups");

let zoom = d3.behavior.zoom().on('zoom', handleZoom);

function handleZoom(e) {
      svg.attr('transform', "translate(" + d3.event.translate + ") scale("+  d3.event.scale + ")");
    }
    d3.behavior.zoom().scaleExtent([1, 10]);
var ha = d3.select("#svg")
ha.call(zoom);    



var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

// variables
var buttons;   
var linkTemp;
//svg groups
var background = svg.append("g");
var linkTempGroup = svg.append('g');
// draw crosses on grid 50x50
for (var x = -width ; x <= 2*width; x += 50) {
  for (var y = -height; y <= 2*height; y += 50) {
    //draw little squares
    background.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 1,5)
        .attr("fill", "lightgrey")
  }
}
d3.json("content.json", function(error, json) {
  if (error) throw error;
  content = json;
});

d3.json("graph.json", function(error, json) {
  if (error) throw error;
  root = json;
});

//run function 3 seconds after start
setTimeout(function() {

  init(root);
  update(); // HACK to avoid starting tick from 0 position on default
  collapsed(root);
  update();

}, 100);




function update() {

 nodes = flatten(root);
  var links = d3.layout.tree().links(nodes);

  // Update links.
  link = link.data(links, function(d) { return d.target.id; });
  link.exit().remove();
  link.enter().insert("line", ".node")
      .attr("id", function(d) { return "link"+ d.target.id;})
      .attr("class", "link")
      .attr("opacity",d=> d.source.level > 1 ? 1 : 0)
     ;

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
      .start();

  // Update nodes.
  node = node.data(nodes, function(d) { return d.id; });
  node.exit().remove();

  var nodeEnter = node
      .enter().append("g")
      .attr("class", "node")
      .attr("id", function(d) { return "node"+ d.id;})
      .attr("opacity",d=> d.level > 0 ? 1 : 0)
      .on("mouseover",  onMouseOver)
      .on("mouseout", onMouseOut)
      .call(force.drag)

      ;
      force.drag().on("dragend", dragend);    
      force.drag().on("dragstart", dragstart);

nodeEnter.append("rect")

      .attr("id", function(d) { return "rect"+ d.id;})
      .attr("width", d=> d.level > 1 ? 100 : 30)
      .attr("height", d=> d.level > 1 ? 66 : 30)
      .attr("x", d=> d.level > 1 ? -50 : -15)
      .attr("y", d=> d.level > 1 ? -33 : -15)
      .attr("rx", d=> d.level > 1 ? 0 : 15)
      .attr("ry", d=> d.level > 1 ? 0 : 15)
      .style("fill", "white")
      .style("stroke", "black")
      .style("stroke-width", 1)
      .on("click",onNodeClick)
 
      ;

// create node with div as child text label
  nodeEnter.append("foreignObject")
      .attr("width", d=> d.level > 1 ? 100 : 30)
      .attr("height", d=> d.level > 1 ? 70 : 30)
      .attr("x", d=> d.level > 1 ? -50 : -15)
      .attr("y", d=> d.level > 1 ? -33 : -15)
      .append("xhtml:div")
      .style("stroke", "black")
      .html(d=>d.text)
      .on("click", onNodeClick)

      ;



     // apped pin to node
  nodeEnter.append("image")
      .attr("xlink:href", "pin.png")
      .attr("id",function(d) { return "pin"+ d.id;})
      .attr("x", d=> d.level > 1 ? -50 : -25)
      .attr("y", d=> d.level > 1 ? -45 : -25)
      .attr("width", 15)
      .attr("height", 15)
      .style("display", "none")
      .on("click", function(d) {       
            if(d.fixed)
             {
                 d.fixed = false;
                 d3.select(this).attr("xlink:href", "pin.png")
              } else
              {
                d.fixed = true;
                d3.select(this).attr("xlink:href", "unpin.png")
         }})
      ;


     // apped x to node
     nodeEnter.append("image")
      .attr("xlink:href", "x.png")
      .attr("id",function(d) { return "x"+ d.id;})
      .attr("x", 40)
      .attr("y", d=> d.level > 1 ? -45 : -25)
      .attr("width", 15)
      .attr("height", 15)
      .style("display", "none")
      .on("click", function(d) {   
            // remove node
            d3.select("#node"+d.id).remove();
            // remove link
            d3.select("#link"+d.id).remove();
            // remove pin
            d3.select("#pin"+d.id).remove();
            // remove x
            d3.select("#x"+d.id).remove();
            // remove thumb
            d3.select("#thumb"+d.id).remove();
            // remove text
            d3.select("#text"+d.id).remove();
            // remove image
            d3.select("#image"+d.id).remove();
     
           })
      ;
}


// document.onkeydown = function (e) {
  
//   force.charge(0)   
//   .gravity(.05)
//   .start();

// };

// document.onkeyup = function (e) {
//   force.charge(-970)
//   .gravity(.05)
//   .start();
// };

function color(d) {
  return d.selected  ? d.color
      : d._children ? "#ffffff"
      : "#ffffff" ; // leaf node
}

function colorStroke(d) {
  return d.selected ? "#999999"
      : "#999999" ; // leaf node
}


// Returns a list of all nodes under the root.
function flatten(root) {
  var nodes = [], i = 0;

  function recurse(node) {
    if (node.children) node.children.forEach(recurse);
    nodes.push(node);
  }

  recurse(root);
  return nodes;
}

function init(root) {

  function initChildren(node,  pi) {
    node.id = i++;
    node.likes = 0;
    node.pin = false;
    node.parrentIdx = pi;
    node.x = node.x !=null? width/2 + (node.x -2) *50: width/2;
    node.y = node.y !=null? height/2 +(node.y-2) *35: height/2;

	  if(node.children) {
      node.children.forEach(function(item, index){
        initChildren(item,node.id );
      });
	  }
  }
  initChildren(root,0);
  
}

function collapsed(root) {
  
  function hideChildren(node) {
	  if(node.children) {
		   node._children = node.children;
		   node.children = null;
      
	   	node._children.forEach(hideChildren);
	  }
  }
  root.children.forEach(hideChildren);
 // hideChildren(root); // hide children of root
}
// Duplicate the node
function inser(object) {

  function check(node) {

	  if(node.id === object.parrentIdx) {

       clone = {
        name: object.name, 
        parrentIdx: object.parrentIdx , 
        children : undefined,
        id : ++i, 
        _children : null,
        level:object.level, 
        index: object.index, 
        selected: true,
        tools: object.tools,
        text: object.text,
        color: object.color,
        likes: 0,
      }
       
       node.children.push(clone);
      }
    else  
    {
      if(node.children != null)
		      node.children.forEach(check);
    }
	 
  }
  check(root);
}

function updatelevel(nodes) {

  function sum(node) {
    if(node.children)
     { 
       var count =0;
       for (var i =0; i<  node.children.length; ++i)
        {
            count = count + node.children[i].likes;
        }
        node.likes =  count;
     }

     //update foreiner object  button label of this node
      var thumb = document.getElementById( "thumb" + node.id);
      var text = document.getElementById( "text" + node.id);

      if(thumb && node.children != undefined)
      {
            // Set width of button
            thumb.setAttribute("width",  30 )
            thumb.setAttribute("height",  30)
            thumb.setAttribute("href", "thumpup.png")
            d3.select("#thumb" + node.id).style("display", "flex");
            //set text as likes
            text.textContent = node.likes;
          
           // set text opacity to 1
            text.setAttribute("opacity", 1);

      }

        
  }
  nodes.forEach(function(item, index){sum(item)});
  console.log(nodes);
}

//Assign function to listen slider events
// var slider = document.getElementById("myRange");
// slider.oninput = function() {
//   //TODO
// }

function updateGroups()
{
  //delete previsous
  while (groupsLayer.firstChild) {
    groupsLayer.removeChild(groupsLayer.firstChild);}

  var groups = {};
  function groupsCollect(child)
  {
     if(child.children )
        {
          for(var i =0; i< child.children.length;++i)
          {
            if(child.children[i].groupID)
            {
              if(groups[child.children[i].groupID])
              {
                groups[child.children[i].groupID] += " " + child.children[i].x+","+child.children[i].y;
              } else
              {
                groups[child.children[i].groupID]= child.children[i].x+","+child.children[i].y ;
              }
          }
          }
        }
     if(child.children)
          child.children.forEach(groupsCollect)
  } 
   d3.selectAll(".node").data().forEach(groupsCollect);

   for (var key in groups) {

    let poly = document.createElementNS(svgns ,'polyline');
     poly.id =  key;

     poly.tagName = key;
     poly.setAttributeNS(null, "points", groups[key]);
     poly.setAttributeNS(null, "fill", "none");
     poly.setAttribute ("stroke" ,"#c6c6c6");
     poly.setAttribute ("stroke-width" ,280);
     poly.setAttribute ("stroke-linejoin" ,"round");
     poly.setAttribute ("stroke-linecap" ,"round");
     poly.setAttribute ("stroke-opacity" ,.3);
     groupsLayer.append(poly);

     // delete link outline on click
      poly.addEventListener("click", function(e) {

        // check if "x" key is hold
        if(holdingX)
        {

        var id = e.target.id;
    
        var node = d3.selectAll(".node").data().find(function(item){return item.groupID == id});
       

         
          //Find all elements by key id in the document
          console.log(key);
          var elements = document.getElementsByTagName("*"+key);
          console.log(elements);
          //Loop through the elements and remove the class
          while(elements.length > 0){
              elements[0].parentNode.removeChild(elements[0]);
          }


   

          //remove group id from node
      
         

          if(node){
          node.groupID = undefined;
          
            
        }
        update();
      }   
     }
    );
    }
}


function shadeColor(color, amount) {

  //return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));

}

document.body.addEventListener('keydown', (event) => {
  if(event.key === 'x') {
    holdingX = true;
    force.stop();
  }
});

document.body.addEventListener('keyup', (event) => {
  holdingX = false;
  force.start();
});

function onTick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      ;

  node.attr("transform", function(d) { 
       return "translate(" + d.x + "," + d.y + ")";
  } );
  updateGroups();
}