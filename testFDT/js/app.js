const svgns = "http://www.w3.org/2000/svg";


var width = 1200,
    height = 700,
    root;

var  i = 0;
var test =0;
var force = d3.layout.force()
    .linkDistance(100)
    .charge(-370)
    .gravity(.05)
    .size([width, height])
    .on("tick", tick);

var svg = d3.select("#svg")
    .attr("width", width)
    .attr("height", height).append("g");
svg.append("g")
    .attr("class", "groups")
    .attr("id", "groups")
const groupsLayer = document.getElementById("groups");

var description = d3.select("#svg").append("text")
    .attr("dy", "12")
    .attr("dx", width/2)
    .attr("class", "description")
    .text(function(d) { return "description"; });

let zoom = d3.behavior.zoom()
    .on('zoom', handleZoom);

function handleZoom(e) {

      svg.attr('transform', "translate(" + d3.event.translate + ") scale("+  d3.event.scale + ")");
    }
    var ha = d3.select("#svg")

ha.call(zoom);    

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

d3.json("graph.json", function(error, json) {
  if (error) throw error;

  root = json;

  init(root);
  update(); // HACK to avoid starting tick from 0 position on default
  collapsed(root);
  update();
});

function update() {

  var nodes = flatten(root);
  var links = d3.layout.tree().links(nodes);


  
  updateSize(nodes)
  // Update links.
  link = link.data(links, function(d) { return d.target.id; });
  link.exit().remove();
  link.enter().insert("line", ".node")
      .attr("class", "link")
      .attr("opacity", function(d) { 

        if (d.source.size ===4) return  test
        else return 1});;

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
      .start();

  // Update nodes.
  node = node.data(nodes, function(d) { 

    return d.id; });

 
  node.exit().remove();

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .on("click", click)
      .on("mouseover", function (d) {ha.on('.zoom', null); ;description.text ( d.text);})
      .on("mouseout", function (d) {ha.call(zoom);description.text ( "");})
      .call(force.drag);

 force.drag().on("dragend", dragend);    

  nodeEnter.append("circle")
      .attr("opacity", function(d) { 
       if (d.size ===4) return  test
       else return 1})
       .style("stroke",colorStroke)
       ;

  nodeEnter.append("text")
      .attr("dy", ".35em")
      .text(function(d) { return d.name; })
      .attr("opacity", function(d) { 

        if (d.size ===4) return  test
        else return 1});;;
      //.text(function(d) { return d.parrentIdx + " | " + d.id; }); for testing

  node.select("circle")
      .style("fill", color)
      ;


      node.selectAll("circle").attr("r", function(d) { 
        return 20 + d.sum * 2;}); 

        function dragend(d) {
      
          d3.selectAll('circle').each(function(e, i) {
          var distance = Math.sqrt(Math.pow(e.x - d.x, 2) + Math.pow(e.y- d.y, 2));
          var inside = distance < 40 + d.sum * 2;
          if(inside && distance >0)
          {
             links.push({"source": d , "target": e})
             console.log("yes");
             link = link.data(links, function(f) { return f.target.id; });
             link.exit().remove();
             link.enter().insert("line", ".node")
                 .attr("class", "link")
                 .attr("opacity", 1);

                 
                

             force
                 .nodes(nodes)
                 .links(links)
                 .start();
          }
        });
        }

}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
      ;

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  updateGroupSelection();
}




function color(d) {
  return d.selected && d.size ===4 ? "#5EBF71"
      :d.selected && d.size ===3 ? "#83DF78"
      : d.selected && d.size ===2 ? "#B0F578"
      : d.selected && d.size ===1 ? "#D2EB73"
      : d._children && d.size ===3 ? "#ffffff"
      : d._children && d.size ===2 ? "#ffffff"
      : "#ffffff" ; // leaf node
}
function colorStroke(d) {
  return d.selected ? "#999999"
      : "#999999" ; // leaf node
}

// Toggle children on click.
function click(d) {
  if (d3.event.defaultPrevented) return; // ignore drag

  if(d.children === undefined && d.selected)
  {
    inser(d);
    d.selected = true;
    update();
    return;
  } 

  else if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  d.selected = true;
  update();
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
    node.parrentIdx = pi;
   
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
  //hideChildren(root);
}
function inser(object) {

  function check(node) {

	  if(node.id === object.parrentIdx) {

       clone = {
        name: object.name, 
        parrentIdx: object.parrentIdx , 
        children : undefined,
        id : ++i, 
        _children : null,
        size:1, 
        index: object.index, 
        selected: true,
        tools: object.tools
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

function updateSize(nodes) {

  function sum(node) {
    if(node.children)
     { 
       var count =1;
       for (var i =0; i<  node.children.length; ++i)
        {
          if (node.children[i].selected ===true)
          {
            count = count + node.children[i].sum;
          }
        }

        node.sum = count;

     }
     else
     {
       node.sum = 1;
     }
  }
  nodes.forEach(function(item, index){sum(item)});
}

//Assign function to listen slider events
var slider = document.getElementById("myRange");
slider.oninput = function() {
  document.getElementById("label").innerHTML = "Group by tool fit : " + this.value*10 + "%";
  updateGroupSelection();
}

function updateGroupSelection()
{

  if(slider.value ==0)
       return;
    // Fill dictionary with tools and hows points
    var hows = {};
    function toolsCollect(child)
    {
       if(child.tools && child.selected)
          {
            for(var i =0; i< child.tools.length;++i)
            {
              if(child.tools[i].fit>= slider.value)
              {
                if(hows[child.tools[i].name])
                {
                  hows[child.tools[i].name] += " " + child.x+","+child.y;
                } else
                {
                  hows[child.tools[i].name]= child.x+","+child.y ;
                }
            }
            }
          }
       if(child.children)
            child.children.forEach(toolsCollect)
    } 

    d3.selectAll(".node").data().forEach(toolsCollect)

    while (groupsLayer.firstChild) {
      groupsLayer.removeChild(groupsLayer.firstChild);

  }
    index = 0;
    for (var key in hows) {

        let poly = document.createElementNS(svgns ,'polyline');
         poly.id = key;
         poly.setAttributeNS(null, "points", hows[key]);
         poly.setAttributeNS(null, "fill", "none");
         poly.setAttribute ("stroke" ,"#c6c6c6");
         poly.setAttribute ("stroke-width" ,100);
         poly.setAttribute ("stroke-linejoin" ,"round");
         poly.setAttribute ("stroke-linecap" ,"round");
         poly.setAttribute ("stroke-opacity" ,.3);
         groupsLayer.append(poly);
         var bbox = poly.getBoundingClientRect();


         textX =  bbox.x < width/2 ? 20:  width - 150;
         textY =  bbox.y + bbox.height/2 - (index  % 3)*25;
         ++index;
         let text= document.createElementNS(svgns ,'text');
         text.id = key;
         text.setAttributeNS(null, "x", textX );
         text.setAttributeNS(null, "y", textY );
         text.setAttributeNS(null,"font-size","20");
         text.setAttributeNS(null,"font-family",'Helvetica Neue');
         text.setAttribute ("fill" ,"#c6c6c6");
         text.innerHTML = key;

         poly.addEventListener('mouseenter', function(e) {
          poly.setAttribute('stroke', '#87b5dd');
          text.setAttribute('fill', '#87b5dd');
         });
         poly.addEventListener('mouseleave', function(e) {
          poly.setAttribute('stroke', "#c6c6c6");
          text.setAttribute('fill', "#c6c6c6");
         });
         groupsLayer.append(text);
      
  }

}