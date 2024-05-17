const lock = true;
function toggleContent(el) {

    const elem = document.getElementById(el.id);
    var data = el.id.includes("verb") ? dataset.verb : dataset.noun;
    var i = data.findIndex(item => item.name === elem.innerHTML);
    var secElem = el.id.includes("verb") ? document.getElementById("nounButton") 
                                        : document.getElementById("verbButton");
    if (elem.value === "on")
    {
        document.getElementById("container").style.display = "none";
        document.getElementById("combo").style.display = "flex";

        elem.value = el.innerHTML;
        document.getElementById("comboButton").innerHTML = data[i].desc;
    }
    else 
    {   
        document.getElementById("container").style.display = "none";
        document.getElementById("combo").style.display = "flex";

        document.getElementById("comboButton").innerHTML = data[i].desc;
        elem.value = "on";
    }


    if (elem.value !== "on" && secElem.value !== "on")
        {
            var combo = document.getElementById("verbButton").value + " " + document.getElementById("nounButton").value;
            var i = dataset.combos.findIndex(x=> x.name === combo);
            console.log(i + " - " + combo);
            document.getElementById("comboButton").innerHTML = dataset.combos[i].desc;
            document.getElementById("combo").style.display = "flex";
            document.getElementById("verb").style.display = "none";
            document.getElementById("noun").style.display = "none";
        }
}
function resetToDefault() {        
    document.getElementById("container").style.display = "block";
    document.getElementById("combo").style.display = "none";
}
function changeWord(el) {

    const elem = document.getElementById(el.id);
   
    var label = el.id.includes("verb") ? "verb" : "noun";
    button =  document.getElementById(label+ "Button");
    var data = dataset[label];
    var topList = document.getElementById(label+ "TopList");
    var bottomList = document.getElementById(label+ "BottomList");
    if (elem.id.includes("Left"))
    {

        i = data.findIndex(item => item.name === button.innerHTML);
        console.log("left - TOP");
        if(i === 0) i = data.length; 
        button.innerHTML = data[i-1].name;

        // fill 10 names before current to toList 
        topList.innerHTML = "";
        for(var j = 1; j < 10; j++)
        {
            if(i-1-j < 0) break;
            //place string to the begiging of the list
            topList.innerHTML = data[i-1-j].name + "<br>" + topList.innerHTML;
        }
        // fill 10 names after current to bottomList
        bottomList.innerHTML = "";
        for(var j = 1; j < 10; j++)
        {
            if(i+1+j > data.length-1) break;
            bottomList.innerHTML += data[i+1+j].name + "<br>";
        }
    }
    if (elem.id.includes("Right"))
    {
        console.log("righ - BOTTOM");
        i= data.findIndex(item => item.name === button.innerHTML);
        if(i === data.length-1) i = -1; 
        button.innerHTML =data[i+1].name;

        // fill 10 names before current to toList 
        topList.innerHTML = "";
        for(var j = 0; j < 10; j++)
        {
            if(i-j < 0) break;
            topList.innerHTML = data[i-j].name + "<br>" + topList.innerHTML;
        }
        // fill 10 names after current to bottomList
        bottomList.innerHTML = "";
        for(var j = 1; j < 11; j++)
        {
            if(i+1+j > data.length-1) break;
            bottomList.innerHTML += data[i+1+j].name + "<br>";
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('./data.json')
    .then(response => response.json())
    .then(loadData)
    .catch(console.error);
});

function loadData(data) {
  dataset = data;
}

function changeLock(el) {
    if (el.value == "on")
    {
      document.getElementById("lock").value = "off";
    }
    else
    {
       document.getElementById("lock").value = "on";
    }

}