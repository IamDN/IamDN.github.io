var width = 1200,
    height = 700,
    root;

var force = d3.layout.force()
    .linkDistance(100)
    .charge(-300)
    .gravity(.05)
    .size([width, height])
    .on("tick", tick);



var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var description = svg.append("text")
    .attr("dy", "12")
    .attr("dx", width/2)
    .attr("class", "description")
    .text(function(d) { return "description"; });

var link = svg.selectAll(".link"),
    node = svg.selectAll(".node");

d3.json("graph.json", function(error, json) {
  if (error) throw error;

  root = json;

  init(root);
  update();
  collapsed(root);
  update();
});

function update() {

  var nodes = flatten(root);
  var links = d3.layout.tree().links(nodes);

  // Update links.
  link = link.data(links, function(d) { return d.target.id; });
  link.exit().remove();
  link.enter().insert("line", ".node")
      .attr("class", "link");

  // Restart the force layout.
  force
      .nodes(nodes)
      .links(links)
      .start();

  // Update nodes.
  node = node.data(nodes, function(d) { return d.id; });

  node.exit().remove();

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .on("click", click)
      .on("mouseover", function (d) {description.text ( d.text);})
      .on("mouseout", function (d) {description.text ( "");})
      .call(force.drag);

  nodeEnter.append("circle")
      .attr("r", function(d) { return 20 + d.size *5});

  nodeEnter.append("text")
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
      //.text(function(d) { return d.parrentIdx + " | " + d.id; }); for testing

  node.select("circle")
      .style("fill", color)
      ;

}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })
;

  node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function color(d) {
  return d.selected ? "#3182bd"
      : d._children ? "919191"// collapsed package
      : "c9c9c9" ; // leaf node
}

// Toggle children on click.
function click(d) {
  if (d3.event.defaultPrevented) return; // ignore drag

  if(d.children === undefined)
  {
    //TODO clone
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
  var  i = 0;
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
  hideChildren(root);
}
