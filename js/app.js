
fetch('./data.json')
    .then((response) => response.json())
    .then((json) => load( json));

/* draggable element */
let dataset = [];
function load(data) {
    console.log(data);
    let box = document.getElementById("actions");;
    let x = box.offsetLeft + 300;
    let y =box.offsetTop + 300;

    for (var i=0; i<data.action.length;i++)
    {
        let div = document.createElement("div");
        div.id = data.action[i].id;
        div.className = "item action" + i;
        div.draggable = "true";
        div.style.left = x + Math.round((150*Math.cos(i*(2*Math.PI/6))))-60 + 'px';
        div.style.top = y+ Math.round((150*Math.sin(i*(2*Math.PI/6))))-60 + 'px';
        div.style.setProperty(  "background-color", data.action[i].color);
        div.addEventListener('dragstart', dragStart);
        div.innerHTML = "<br>" +data.action[i].name;
        box.appendChild(div); 
    }
    dataset = data;
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
       // e.target.classList.add('hide');
    }, 0);
}


/* drop targets */
const boxes = document.querySelectorAll('.box');

boxes.forEach(box => {
    box.addEventListener('dragenter', dragEnter)
    box.addEventListener('dragover', dragOver);
    box.addEventListener('dragleave', dragLeave);
    box.addEventListener('drop', drop);
});


function dragEnter(e) {
    e.preventDefault();
    if  (e.target.id.includes('(what)') || e.target.id === "arena"){
        e.target.classList.add('drag-over');
    }
}

function dragOver(e) {
    e.preventDefault();
    console.log(e.target.id);
    if  (e.target.id.includes('(what)')|| e.target.id === "arena"){
       e.target.classList.add('drag-over');
    }
}

function dragLeave(e) {
    if  (e.target.id.includes('(what)') || e.target.id === "arena"){
       e.target.classList.remove('drag-over');
    }
}

function drop(e) {
    if  (e.target.id.includes('(what)')  || e.target.id === "arena"){
        e.target.classList.remove('drag-over');
    }
    var num = 1;
    if  (e.target.id.includes('(what)')  ){
        num  = Number(e.target.getAttribute("count")) +1;
        e.target.setAttribute("count", num );
        console.log("LOL: " + e.target.getAttribute("count"));
    }
    // get the draggable element
    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);
    
    let obj = dataset.action.find(item => item.id === id);
    console.log(e);
    for(i=0; i <  obj.outcome.length; i++)
    {
        createDiv(obj.outcome[i], i, obj, e,num);
    }

    createShadow(e);
    // add it to the drop target
    if(e.target.id == "arena" || e.target.id == "actions")
    {
       e.target.insertBefore(draggable, e.target.firstChild);
      
       // display the draggable element
       updateNodes(e.target,draggable);
   
    }  
    draggable.classList.remove('hide');
}
function createDiv(outcome, i, obj, e, num) {

    var arena =  document.getElementById("arena");
    var arenaNodes =arena.childNodes;
  

    let div = document.createElement("div");
    div.id = outcome + i;
    div.className = outcome + i;
    //div.draggable = "true";
    let count= arenaNodes.length;
    let r =   30 +  20*num ;
    console.log("radius" + r);
    let left = e.screenX + Math.round((r*Math.cos(count*(2*Math.PI/3))))-50 + 'px';
    let top = e.screenY+ Math.round((r*Math.sin(count*(2*Math.PI/3))))-110 + 'px';
    div.style.left = left;
    div.style.top = top;
    div.style.setProperty(  "background-color", obj.color);
    div.style.setProperty('height',60 + 'px');
    div.style.setProperty('width', 60 + 'px');
    div.style.setProperty('border-radius', 40 + '%');
    div.style.setProperty('position', 'absolute');
    div.style.setProperty('color', 'white');
    div.style.setProperty('text-align', ' center');
    div.style.setProperty('font-size', '12px');
    // if(outcome.includes("(what)"))
    // {

    //     div.style.setProperty('border', 'dashed 3px grey'); 
    // }
    div.setAttribute("count", num);
    div.innerHTML = "<br>" +outcome;
    var arena =  document.getElementById("arena");
    arena.appendChild(div); 

}

function createShadow(e)
{   var r  = e.target.style.getPropertyValue('border');

    var arena =  document.getElementById("arena");
    let shadow = document.createElement("div");
    let left = e.screenX ;
    let top = e.screenY;
    shadow.style.left = left -100+ 'px';
    shadow.style.top = top+ -100 +'px';
    shadow.style.setProperty(  "background-color", "grey");
    shadow.style.setProperty('height',100 + 'px');
    shadow.style.setProperty('width', 100 + 'px');
    shadow.style.setProperty('border-radius', 50 + '%');
    shadow.style.setProperty('position', 'absolute');
    shadow.style.setProperty('filter', "blur(50px)");
    //shadow.style.setProperty('opacity', '50%');
    arena.prepend(shadow);

}

function updateNodes(target,draggable)
{ 
   // Update actions
   var actions = document.getElementById("actions");
   var actionsNodes =actions.childNodes;
   let actionsx = actions.offsetLeft + 200;
   let actionsy =actions.offsetTop + 200;
for(i=0; i <  actionsNodes.length; i++)
 {

    actionsNodes[i].style.left = actionsx + Math.round((150*Math.cos(i*(2*Math.PI/6))))-60 + 'px';
    actionsNodes[i].style.top = actionsy+ Math.round((150*Math.sin(i*(2*Math.PI/6)))) -60+ 'px';
    actionsNodes[i].style.setProperty('opacity', '100%');
    actionsNodes[i].classList.remove('hide');
  }

}