const radius = 5;
var data = [];
var cleanData = [];
var adjustArray = [{x:0, y:1},{x:-1, y:-1},{x:1, y:-1},{x:0, y:-3},{x:-2, y:1},{x:2, y:1},{x:-1, y:3},{x:1, y:3},{x:3, y:-1},{x:-3, y:-1} ,{x:2, y:-3},{x:-2, y:-3}];
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
var contactInput =  document.getElementById("contactID");
var issuesInput =  document.getElementById("issuesID");
var unitsInput =  document.getElementById("unitID");
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
        issues: issuesInput.value,
        contact: contactInput.value,
        units: unitsInput.value,
        timeStamp: new Date(),
        draw: true,
     } 

     var cleanRecord = {
      shortName: shortNameInput.value,
      spatialResolution : sr.options[sr.selectedIndex].text,
      temporalResolution : tr.options[tr.selectedIndex].text,
      landuse : landuseInput.options[landuseInput.selectedIndex].text,
      fileType : typeInput.options[landuseInput.selectedIndex].text,
      fullName: nameInput.value,
      source: sourceInput.value,
      link: linkInput.value,
      minSpatialExtend: minSpatialInput.value,
      maxSpatialExtend: maxSpatialInput.value,
      minTimeExtend: minTimeInput.value,
      maxTimeExtend: maxTimeInput.value,
      issues: issuesInput.value,
      contact: contactInput.value,
      timeStamp: new Date(),
      dataUnits: unitsInput.value,
   } 
     data.push(record);
     cleanData.push(cleanRecord)
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
                    "Units: " + data.units+ " <br>"  +
                    "Source: " + data.source+ " <br>" +  
                    "Link: " + data.link+ " <br>" +  
                    "Conatct: " + data.contact+ " <br>" +  
                    "Issues: " + data.issues+ " <br>"+
                    "Time Stamp: " + data.timeStamp+ " <br>"  ;  
                    
}
function mouseExit(e)
{
  panel.style.display = 'none';
}
function download()
{

var csv = CSV(cleanData);
var downloadLink = document.createElement("a");
var blob = new Blob(["\ufeff", csv]);
var url = URL.createObjectURL(blob);
downloadLink.href = url;
downloadLink.download = "data.csv";

document.body.appendChild(downloadLink);
downloadLink.click();
document.body.removeChild(downloadLink);
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