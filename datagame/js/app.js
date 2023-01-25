const radius = 5;
var data = [];
var adjustArray = [{x:0, y:1},{x:-3.5, y:-1},{x:3.5, y:-1},{x:0, y:-3},{x:-3.5, y:3},{x:3.5, y:3}];
var svgns = "http://www.w3.org/2000/svg";
var svg = document.getElementById('svg');
var sr =  document.getElementById("spatial resolution");
var tr =  document.getElementById("temporal resolution");
var shortNameInput =  document.getElementById("shortNameID");
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
        shortName: shortNameInput.value,
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
    label.setAttributeNS(null, 'font-size', '10px');
    label.innerHTML = tr.options[i].text;
    svg.appendChild(label);
  }
  for (let i =0; i< sr.length;i++)
  {
    var label = document.createElementNS(svgns, 'text');
    label.setAttributeNS(null, 'x', 13 +i/sr.length * 85 + '%');
    label.setAttributeNS(null, 'y', '95%');
    label.setAttributeNS(null, 'font-size', '10px');
    label.innerHTML = sr.options[sr.length - (i+1)].text;
    svg.appendChild(label);
  }
}

function updateGraph()
{

    for (let i =0; i< data.length;i++)
    {
      //? var box = svg.getBoundingClientRect();
      if(data[i].draw && data[i].count <adjustArray.length )
      {
      var label = document.createElementNS(svgns, 'text');
      var adjust = adjustArray[data[i].count];

      var x = 90 - data[i].srv /sr.length *85 + adjust.x;
      var y =  5 +data[i].trv /tr.length *90+ adjust.y;
      label.setAttributeNS(null, 'x', x + '%');
      label.setAttributeNS(null, 'y', y+'%');
      label.setAttributeNS(null, 'font-size', '10px');
      label.setAttributeNS(null, 'fill', 'black');
      label.innerHTML = data[i].shortName;
      label.addEventListener("mouseenter", (e) =>  mouseEnter(e,data[i]));
      label.addEventListener("mouseout", mouseExit);
      svg.appendChild(label);
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
function download()
{
console.log(CSV(data))
var encodedUri = encodeURI(CSV(data));
window.open(encodedUri);
}
function CSV(array) {
  // Use first element to choose the keys and the order
  var keys = Object.keys(array[0]);

  // Build header
  var result = keys.join(",") + "\n";

  // Add the rows
  array.forEach(function(obj){
      result += keys.map(k => obj[k]).join(",") + "\n";
  });

  return result;
}