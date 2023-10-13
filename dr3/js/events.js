document.onmousemove = function(e){

    if(linkTemp === undefined) return;
  
    // update the link position
    linkTemp.attr("x2", e.pageX)
        .attr("y2", e.pageY);
  }

function onActionClick(d)
{
    var data = root._children.find(function(x){return x.name == d.name});
    if(data)
    {
      root.children.push(data);
      data.selected = true;
      update();
      createLink(d);
    }
}