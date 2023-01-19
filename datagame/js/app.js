const radius = 5;
var data = [];
var adjustArray = [{x:0, y:1},{x:-1, y:-1},{x:1, y:-1},{x:0, y:-3},{x:-2, y:1},{x:2, y:1},{x:-1, y:3},{x:1, y:3},{x:3, y:-1},{x:-3, y:-1} ,{x:2, y:-3},{x:-2, y:-3}];
var svgns = "http://www.w3.org/2000/svg";
var svg = document.getElementById('svg');
var sr =  document.getElementById("spatial resolution");
var tr =  document.getElementById("temporal resolution");
var nameInput =  document.getElementById("nameID");
var landuseInput =  document.getElementById("landuseID");
var typeInput =  document.getElementById("typeID");
var sourceInput =  document.getElementById("sourceID");
var linkInput =  document.getElementById("linkID");
var minSpatialInput =  document.getElementById("minSpaceExtendID");
var maxSpatialInput =  document.getElementById("maxSpaceExtendID");
var minTimeInput =  document.getElementById("minTimeExtendID");
var maxTimeInput =  document.getElementById("maxTimeExtendID");

var panel =  document.getElementById("panelID");
drawLines();

function enable() {
    var record = {
        srv: sr.selectedIndex, 
        srt : sr.options[sr.selectedIndex].text,
        trv: tr.selectedIndex, 
        trt : tr.options[tr.selectedIndex].text,
        count : dataExists(sr.selectedIndex,  tr.selectedIndex),
        landuse : landuseInput.options[landuseInput.selectedIndex].text,
        type : typeInput.options[landuseInput.selectedIndex].text,
        name: nameInput.value,
        source: sourceInput.value,
        link: linkInput.value,
        minSpatial: minSpatialInput.value,
        maxSpatial: maxSpatialInput.value,
        minTime: minTimeInput.value,
        maxTime: maxTimeInput.value,
        draw: true,
     } 
     data.push(record);
     updateGraph();
}

function dataExists(srv, trv){
  var id = 0;
  for(var i=0; i<data.length; i++){
      if(data[i].srv === srv && data[i].trv === trv) 
         id = id +1;
  }
  return id;
}

function drawLines() {

  for (let i =0; i< tr.length;i++)
  {
    var label = document.createElementNS(svgns, 'text');
    label.setAttributeNS(null, 'x', '1%');
    label.setAttributeNS(null, 'y', 5 +  i/tr.length * 90 + '%');
    label.setAttributeNS(null, 'text-font', '8');
    label.innerHTML = tr.options[i].text;
    svg.appendChild(label);
  }
  for (let i =0; i< sr.length;i++)
  {
    var label = document.createElementNS(svgns, 'text');
    label.setAttributeNS(null, 'x', 13 +i/sr.length * 85 + '%');
    label.setAttributeNS(null, 'y', '95%');
    label.setAttributeNS(null, 'text-font', '8');
    label.innerHTML = sr.options[sr.length - (i+1)].text;
    svg.appendChild(label);
  }
}

function updateGraph()
{

    for (let i =0; i< data.length;i++)
    {
      //? var box = svg.getBoundingClientRect();
      if(data[i].draw && data[i].count <12 )
      {
      var circle = document.createElementNS(svgns, 'circle');
      var adjust = adjustArray[data[i].count];

      var x = 90 - data[i].srv /sr.length *85 + adjust.x;
      var y =  5 +data[i].trv /tr.length *90+ adjust.y;
      circle.setAttributeNS(null, 'cx', x + '%');
      circle.setAttributeNS(null, 'cy', y+'%');
      circle.setAttributeNS(null, 'height', '50');
      circle.setAttributeNS(null, 'width', '50');
      circle.setAttributeNS(null, 'fill', 'black');
      circle.setAttributeNS(null, 'r', radius +'');
      circle.addEventListener("mouseenter", (e) =>  mouseEnter(e,data[i]));
      circle.addEventListener("mouseout", mouseExit);
      svg.appendChild(circle);
      data[i].draw = false;
      }
    }
}

function mouseEnter(e,data)
{
  panel.style.left = e.clientX + 'px';
  panel.style.top =  e.clientY + 'px';
  panel.style.display = 'inline-block';
  panel.innerHTML = "Name: " + data.name + " <br>" +
                    "Landuse: " + data.trt + " <br>" + 
                    "Type: " + data.type + " <br>" +
                    "Spatial resolution: " + data.srt + " <br>" + 
                    "Temporal resolution: " + data.trt + " <br>" +  
                    "Min Spatial Extent: " + data.minSpatial + " <br>" + 
                    "Max Spatial Extent: " + data.maxSpatial + " <br>" + 
                    "Min Temporal Extent: " + data.minTime + " <br>" + 
                    "Max Temporal Extent: " + data.maxTime + " <br>" + 
                    "Source: " + data.source+ " <br>" +  
                    "Link: " + data.link+ " <br>" ;  
                    
}
function mouseExit(e)
{
  panel.style.display = 'none';
}