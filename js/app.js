/* draggable element */


for (var i=0; i<5;i++)
{
  var item = document.getElementById("action" + (i+1));;
  item.addEventListener('dragstart', dragStart);
}

function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    setTimeout(() => {
        e.target.classList.add('hide');
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
    e.target.classList.add('drag-over');
}

function dragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

function dragLeave(e) {
    e.target.classList.remove('drag-over');
}

function drop(e) {
    e.target.classList.remove('drag-over');

    // get the draggable element
    const id = e.dataTransfer.getData('text/plain');
    
    const draggable = document.getElementById(id);
    // add it to the drop target
    if(e.target.id == "arena" || e.target.id == "actions")
    {
    e.target.insertBefore(draggable, e.target.firstChild);

    // display the draggable element
    updateNodes(e.target,draggable);
    }  draggable.classList.remove('hide');
}

function updateNodes(target,draggable)
{
  var arenaNodes = document.getElementById("arena").childNodes;
  console.log(arenaNodes);
  for(i=0; i <  arenaNodes.length; i++)
 {
    var size = 100 + (arenaNodes.length -i) * 40;
    arenaNodes[i].style.setProperty('height',size + 'px');
    arenaNodes[i].style.setProperty('width', size + 'px');
    arenaNodes[i].style.setProperty('position', 'absolute');
    arenaNodes[i].style.setProperty('opacity', '100%');
 }

  if  (target.id === "actions"){
    draggable.style.setProperty('height','100px');
    draggable.style.setProperty('width', '100px');
    draggable.style.setProperty('position', 'relative');
    draggable.style.setProperty('opacity', '100%');
  }

}