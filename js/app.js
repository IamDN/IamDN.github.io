const svg = document.getElementById("svg");
const arena =  document.getElementById("arena");
const tools =  document.getElementById("tools");
const actions =  document.getElementById("actions");
const svgns = "http://www.w3.org/2000/svg";
var groups = [];

fetch('./data.json')
    .then((response) => response.json())
    .then((json) => load( json));

/* draggable element */
let dataset = [];
function load(data) {
    dataset = data;

    for (var i=0; i<data.action.length;i++)
    {
        createItem(document.getElementById("actions"), "actions", data.action, i )
    }

	for (var i=0; i<data.tools.length;i++)
    {
        createItem(document.getElementById("tools"), "tool", data.tools, i )
    }
}

function createItem (parrent, type, arr, i )
{
    let div = document.createElement("div");
    if  (typeof arr[i].tags !== 'undefined')
       div.id = "tags " + arr[i].tags;
    else
       div.id = arr[i].id;
    div.name = "tags";
    div.className = "item "+ type+ " "+ i;
    div.draggable = "true";
    div.style.left = 0 + 'px' ;
    div.style.top = parrent.offsetHeight / arr.length  * i + 'px';
    div.style.backgroundColor = arr[i].color;
    div.innerHTML = arr[i].name;
    div.addEventListener('dragstart', dragStart);
    parrent.appendChild(div); 
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
       // e.target.classList.add('hide');
    }, 0);
}


/* drop targets */
// boxes.forEach(box => {  box.addEventListener('dragenter', dragEnter) });

arena.addEventListener('dragenter', dragEnter)
arena.addEventListener('dragover', dragOver);
arena.addEventListener('dragleave', dragLeave);
arena.addEventListener('drop', drop);

function dragEnter(e) {
    e.preventDefault();
    if  (e.target.id.includes('group') || e.target.id === "arena"|| e.target.id === "svg"){
        e.target.classList.add('drag-over');
    }
}

function dragOver(e) {
    e.preventDefault();

    if  (e.target.id.includes('group')|| e.target.id === "arena"|| e.target.id === "svg"){
       e.target.classList.add('drag-over');
    }
}

function dragLeave(e) {
    if  (e.target.id.includes('group') || e.target.id === "arena"|| e.target.id === "svg"){
       e.target.classList.remove('drag-over');
    }
}

function drop(e) {
    if  ( e.target.id === "arena"){  e.target.classList.remove('drag-over');}

    // get the draggable element
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);

    let obj = dataset.action.find(item => item.id === id);

	if(obj !== undefined)
    {
		for(i=0; i <  obj.outcome.length; i++)
		{
			createDiv(obj.outcome[i], i, obj, e, draggable.id);
		}
        updateGroups(draggable.id,draggable.style.backgroundColor);
	} else if (e.target.id === "arena" )
	{
		    // case of movement inside of arena
			draggable.style.left = e.layerX - 30 +  "px";
			draggable.style.top = e.layerY - 30 +  "px";

            let lines = Array.from(document.querySelectorAll(`[id^="lines"]`));
            for (var i=0; i < lines.length; i++)
            {

                var names = lines[i].id.split("|")
                if (names[0].includes(draggable.className))
                {
                    lines[i].setAttribute('x1',e.layerX);
                    lines[i].setAttribute('y1',e.layerY);
                } else if (names[1] !== undefined)
                {
                     if(names[1].includes(draggable.className))
                     {
                        lines[i].setAttribute('x2',e.layerX);
                        lines[i].setAttribute('y2',e.layerY);
                     }
                }
            }

        // Update relevant group    
        let actionsAll = Array.from(actions.querySelectorAll(`[id^="action"]`));
        let idAction = draggable.id.split(" ")[2];
        let action = actionsAll.filter(item => item.id.includes(idAction) );
        updateGroups(action[0].id, action[0].style.backgroundColor);
	} 
    draggable.classList.remove('hide');
   
}

function updateGroups(id, color)
{

    var thisGroup = groups.find(x => x.id === id) ;
    if (thisGroup === undefined)
         {

            var newGroup = new Group (id, color);
            newGroup.update(id);
            groups.push(newGroup);
         }
    else 
        {
            thisGroup.update( id );
        }   
}

function createDiv(outcome, i, obj, e, id) {

    var arenaNodes =arena.childNodes;
  
    let div = document.createElement("div");
    div.id = "tags " + outcome.tags + " " + id;
    div.className = "subItem " + outcome.name + i;
    let count= arenaNodes.length;
    let r =   60 ;
     
    let left = e.clientX - arena.offsetLeft + Math.round((r*Math.cos(count*(2*Math.PI/3))));
    let top =  e.clientY - arena.offsetTop + Math.round((r*Math.sin(count*(2*Math.PI/3)))) ;
    let leftString = left + 'px';
    let topString = top + 'px';
    div.style.left = leftString;
    div.style.top = topString;
    div.style.setProperty(  "background-color", "grey");
    div.style.setProperty('height',r+ 'px');
    div.style.setProperty('width', r + 'px');
    div.style.setProperty('border-radius', 40 + '%');
    div.style.setProperty('position', 'absolute');
    div.style.setProperty('color', 'white');
    div.style.setProperty('text-align', ' center');
    div.style.setProperty('font-size', '12px');
    div.innerHTML =  outcome.name;
    div.draggable = "true";
	div.addEventListener('dragstart', dragStart);

    arena.appendChild(div); 

    let tags = Array.from(document.querySelectorAll(`[id^="tags"]`));
    console.log(outcome.tags)
    for (var i=0; i<outcome.tags.length;i++)
    {
        let tag = outcome.tags[i];
        let founds = tags.filter(item => item.id.includes(tag) );

        for (var ii=0; ii<founds.length;ii++)
        {
            // Skip teh rest if the same object, no line 
            if(founds[ii].id === div.id)
                continue

            // Define line base on if tools or subItem    
            var isTool = founds[ii].className.includes("tool");
            var x1 = left + 30 
            var y1 =  top + 30
            var x2 = isTool ? tools.offsetLeft-150 : founds[ii].offsetLeft + 30;
            var y2 = isTool ? founds[ii].offsetTop + 50: founds[ii].offsetTop + 30;
            var n = isTool? div.className : div.className+ "|" + founds[ii].className ;   
            createLine (x1,y1,x2,y2,n);
        }
    }
}

function createLine (x1,y1,x2,y2, name)
{
    // Create line in svg format
    var newLine = document.createElementNS(svgns ,'line');
    newLine.id = "lines "  + name;
    newLine.setAttribute ("x1", x1);
    newLine.setAttribute ("y1", y1);
    newLine.setAttribute ("x2" , x2);
    newLine.setAttribute ("y2" , y2);
    newLine.setAttribute ("stroke" ,"black");
    newLine.setAttribute ("stroke-width" ,1);
    svg.append(newLine);
}



class Group
{
   constructor(id, color)
   {
       this.id = id;
       this.createGroup(color);
       this.poly;
       console.log("Hello word" +color);
   }

   update(name)
   {
    let all = Array.from(document.querySelectorAll(`[id^="tags"]`));

    let points = all.filter(item => item.id.includes(name) );
    console.log(points);
    var pointString = "";
    points.forEach(point=> { 
        var box = point.getBoundingClientRect();
        var x = box.left + box.width/2 - arena.offsetLeft;
        var y = box.top + box.height/2- arena.offsetTop;
        pointString = pointString + x+ "," + y + " ";
    });

    //Add again first to close loop
    var box = points[0].getBoundingClientRect();
    var x = box.left + box.width/2 - arena.offsetLeft;
    var y = box.top + box.height/2- arena.offsetTop;
    pointString = pointString + x+ "," + y + " ";

    this.poly.setAttributeNS(null, "points", pointString);
   }

   createGroup (color)
   {
    // Create line in svg format
    let poly = document.createElementNS(svgns ,'polyline');
    poly.setAttributeNS(null, "points", "0,0 1,1");
    poly.setAttributeNS(null, "fill", "none");
    poly.setAttribute ("stroke" ,color);
    poly.setAttribute ("stroke-width" ,200);
    poly.setAttribute ("stroke-linejoin" ,"round");
    poly.setAttribute ("stroke-linecap" ,"round");
    poly.setAttribute ("stroke-opacity" ,.3);
    svg.append(poly);
    this.poly = poly;
}
}


