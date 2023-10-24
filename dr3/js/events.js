document.onmousemove = function(e){
    // get atrribude translate from svg
    var scaledClick = getScaledXY(e.pageX, e.pageY);
    history.updateOnMove(scaledClick.x  ,scaledClick.y);
}

// Handle creation of the link between nodes
var count =0;
function onCreateLink (d) {
  //get mouse postion of click
  var scaledClick = getScaledXY(d3.event.pageX, d3.event.pageY);
  d.sx = scaledClick.x;
  d.sy = scaledClick.y;

  history.addHistory(d);
}

function getScaledXY(x,y)
{
  var transform= svg.attr("transform")
  if(transform !== null) 
  {
    var ts = transform.split("translate")[1];
    var ss = transform.split("scale")[1];
    var s = Number(ss.substring(ss.indexOf("(")+1, ss.indexOf(")")));
    var t = ts.substring(ts.indexOf("(")+1, ts.indexOf(")"));
    tx = Number(t.split(",")[0]);
    ty = Number(t.split(",")[1]);
    x= x/s -tx/s;
    y= y/s -ty/s;

  }

  return{x:x, y:y};
}

// Toggle children on click.
function onNodeClick(d) {

    if(d3.event !=null)
    if (d3.event.defaultPrevented) return; // ignore drag
   
    //select node
    if(!d3.select("#node"+d.id).attr("class").includes("active"))
    {alert("I'm sorry Dave, I'm afraid I can't do that ... I think you know what the problem is just as well as I do" ); return ;};
     
    //Create link for node level 1
   if(d.level===1)
    onCreateLink(d);

  if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
      if(d.children)
      d.children.forEach(element => {
        element.x = d.x;
        element.y = d.y;});
    
      
    }
    d.selected = true;
    update();
    updateInteraction();
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

     // handle panel
    current = d.id;
    setTimeout(function() {
      if(current==d.id) {    
        
      hoverPanel = document.getElementById("hoverPanel");
      hoverContent = document.getElementById("hoverContent"); 
      hoverPanel.classList.add("block");
      hoverPanel.classList.remove("none");
      hoverContent.innerHTML = " I am putting myself to the fullest possible use, which is all I think that any conscious entity can ever hope to do.";
     }
    }, 500);

}

function onMouseOut(d)
{
    current = -1;
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


    // handle panel
    hoverPanel = document.getElementById("hoverPanel");
    hoverContent = document.getElementById("hoverContent"); 
    hoverPanel.classList.add("none");
    hoverPanel.classList.remove("block");
    hoverContent.innerHTML = "";
}



function dragstart(d) {

    //ignore click on node
//if (d3.event.defaultPrevented) return; // ignore drag
    testX = d.x; //Test if clik on node
}

function onUserChanged(user)
{
    history.setUser(user);

}

//on press T key
document.onkeydown = function(e){
  console.log("....key pressed.....");
  e = e || window.event;
  var key = e.which || e.keyCode;
  if(key===84){
    var data = history.getHistory();
    var json = JSON.stringify(data);
    console.log(json);
  }
}

function onMode()
{
  //switch isBeginer mode
  if(isBeginerMode)
  {
    isBeginerMode = false;
     document.getElementById("modeButton").innerHTML = "Demo Mode";
  } else
  {
    isBeginerMode = true;
    document.getElementById("modeButton").innerHTML = "Full Mode";

  }
  updateInteraction();

}


function updateInteraction()
{
  var last = history.getLastClick();

  //TODO update root and hide all non fixed nodes

  function restartChildren(node) {
    console.log("restartChildren" + node.fixed);
    if(node.fixed)
    {
      node.selected = true;
    }
    else
    {
      node.selected = false;
      node._children = node.children;
    }
    //TODO update root and hide all non fixed nodes
      // node.children = node._children;
      // node._children = null;
	  if(node.children) {
      node.children.forEach(function(item){
        restartChildren(item );
      });
	  }
  }
  console.log("last click: "+last.row + " " + isBeginerMode);
  if(last.row==0 && isBeginerMode)
  {
      restartChildren(root);
      update();
      console.log("restart");
      
  }

    


  node.classed("active", d=> !isBeginerMode|| d.level > 1 ||
       (last.row +  1 == d.row && last.col == d.col)   || 
       (last.row ==3 && d.row ==0) 
  )
  ;
}

function onShowHistory()
{

    var button = document.getElementById("historyButton");
    console.log("show history");
    if(button.innerHTML=== "Show History")
    {
        button.innerHTML = "Hide History";
        history.showHistory();
    }
    else
    {
        button.innerHTML = "Show History";
        history.hideHistory();
    }
}

function onDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
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


function dragend(d) {
   
    //ignore click on node
   // if (d3.event.defaultPrevented) return; // ignore drag
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
 
