document.onmousemove = function(e){

    if(linkTemp === undefined) return;
  
    // update the link position
    linkTemp.attr("x2", e.pageX)
        .attr("y2", e.pageY);
  }

// Handle creation of the link between nodes
var count =0;
function onCreateLink (d) {
    // get current mouse position
    if(count <3)
    {
    linkTemp = linkTempGroup.append("line")
    .attr("class", "linkTemp")
    .attr("x1", x=> d.x)
    .attr("y1", x=> d.y)
    .attr("x2", x=> d.x)
    .attr("y2", x=> d.y)
    ;
    count = count +1;
    } else
    {
     //remove all child from linkTempGroup
        linkTempGroup.selectAll("*").remove();
        count = 0;

    }
 
  }

// Toggle children on click.
function onNodeClick(d) {

    if(d3.event !=null)
    if (d3.event.defaultPrevented) return; // ignore drag
  
    //Create link for node level 1
   if(d.level===1)
    onCreateLink(d);
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
      d.children.forEach(element => {
        element.x = d.x;
        element.y = d.y;});
    
      
    }
    d.selected = true;
    update();
  }

function onMouseOver(d)
{
    ha.on('.zoom', null);
    //get pin image and set display to flex
    if(d.level>1)
    {        
        d3.select("#pin"+d.id).style("display", "flex");
        d3.select("#x"+d.id).style("display", "flex");
    }
    const light = shadeColor(  d.color ,50);
    d3.select("#rect"+d.id).style("fill",light);
}

function onMouseOut(d)
{
    ha.call(zoom);
    //get pin image and set display to none if image is not unpin.png
    if(d3.select("#pin"+d.id).attr("xlink:href") === "pin.png")
    {
        d3.select("#pin"+d.id).style("display", "none");
    }
    if(d3.select("#x"+d.id).attr("xlink:href") === "x.png")
    {
        d3.select("#x"+d.id).style("display", "none");
    }
    // if(d3.select("#thumb"+d.id).attr("xlink:href") === "thump.png")
    //     d3.select("#thumb"+d.id).style("display", "none");

    if(d.children|| (d.selected && d.level>0))
    {
      d3.select("#rect"+d.id).style("fill",d.color);
        
    } else
    {
      d3.select("#rect"+d.id).style("fill", "white");
    }
}



function dragstart(d) {

    //ignore click on node
//if (d3.event.defaultPrevented) return; // ignore drag
console.log("dragstarted");
testX = d.x;
}

function dragend(d) {
   
    //ignore click on node
   // if (d3.event.defaultPrevented) return; // ignore drag
    console.log("drag ended");
    if (testX === d.x)
        {
           return;
        }
    d3.selectAll('rect').each(function(e, i) {
    var distance = Math.sqrt(Math.pow(e.x - d.x, 2) + Math.pow(e.y- d.y, 2));


    if(distance < 50 && e.id !== d.id )
    {
      links.push({"source": d , "target": e})
   
      link = link.data(links, function(f) { return f.target.id; });
      link.exit().remove();
      link.enter().insert("line", ".node")
                 .attr("class", "link")
                 .attr("opacity", 1);

      force
           .nodes(nodes)
          .links(links)
           .start();
       
      if(d.groupID)
             e.groupID = d.groupID;
     else if (e.groupID)
              d.groupID = e.groupID; 
      else
        {
          d.groupID = gi;
          e.groupID = gi;
                     ++gi;
        }    
         updateGroups();
        }

      });
      if (d.fixed)
      {
        d.x = d.px = Math.round(d.x / 50) * 50;
        d.y = d.py = Math.round(d.y / 50) * 50;
      }
      }
 
