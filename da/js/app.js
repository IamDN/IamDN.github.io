var lock = true;
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
    if (lock) ChangeBothSides(el);
    else ChangeOneSide(el);

   
}

function ChangeOneSide(el) {
    const elem = document.getElementById(el.id);
   
    var label = el.id.includes("verb") ? "verb" : "noun";
    button =  document.getElementById(label+ "Button");
    var data = dataset[label];
    var topList = document.getElementById(label+ "TopList");
    var bottomList = document.getElementById(label+ "BottomList");
    if (elem.id.includes("Left") ) // this mean button top
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
            var extra = i-1-j%3 == 0 ? "<br>" : "";
            console.log(i-1-j + " - " + data[i-1-j].name + " - " + extra);
            topList.innerHTML = data[i-1-j].name + "<br>" + extra+ topList.innerHTML;
        }
        // fill 10 names after current to bottomList
        bottomList.innerHTML = "";
        for(var j = 1; j < 10; j++)
        {
            if(i+1+j > data.length-1) break;
            var extra = i+1+j%3 == 0 ? "<br>" : "";
            console.log(i+1+j + " - " + data[i+1+j].name + " - " + extra);
            bottomList.innerHTML += data[i+1+j].name + "<br>" + extra;
        }
    }

    if (elem.id.includes("Right")) // this mean button bottom
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
            var extra = i-j%3 == 0 ? "<br>" : "";
            console.log(i-j + " - " + data[i-j].name + " - " + extra);
            topList.innerHTML = data[i-j].name + "<br>"+ extra + topList.innerHTML;
        }
        // fill 10 names after current to bottomList
        bottomList.innerHTML = "";
        for(var j = 1; j < 11; j++)
        {
            if(i+1+j > data.length-1) break;
            console.log(i+1+j + " - " + data[i+1+j].name + " - " + extra);
            var extra = i+1+j%3 == 0 ? "<br>" : "";
            bottomList.innerHTML += data[i+1+j].name + "<br>"+extra;
        }
    }
}

function ChangeBothSides(el) {

    const elem = document.getElementById(el.id);
   
    var label = el.id.includes("verb") ? "verb" : "noun";
    button =  document.getElementById(label+ "Button");
    buttonVerb =  document.getElementById("verbButton");
    buttonNoun =  document.getElementById("nounButton");
    var dataVerb = dataset["verb"];
    var dataNoun = dataset["noun"];
    var topListVerb = document.getElementById("verbTopList");
    var bottomListVerb = document.getElementById("verbBottomList");
    var topListNoun = document.getElementById("nounTopList");
    var bottomListNoun = document.getElementById("nounBottomList");
    if (elem.id.includes("Left") ) // this mean button top
    {
        i = dataset[label].findIndex(item => item.name === button.innerHTML);
        console.log("left - TOP");
        if(i === 0) i = dataVerb.length; 
        buttonVerb.innerHTML = dataVerb[i-1].name;
        buttonNoun.innerHTML = dataNoun[i-1].name;
   

        // fill 10 names before current to toList 
        topListVerb.innerHTML = "";
        topListNoun.innerHTML = "";
        for(var j = 1; j < 10; j++)
        {
            if(i-1-j < 0) break;
            //place string to the begiging of the list
            var extra = (i-1-j)%3 == 2 ? "<br>" : "";
            console.log(i-1-j + " ? " + (i-1-j)%3);
            topListVerb.innerHTML = dataVerb[i-1-j].name + "<br>" + extra + topListVerb.innerHTML  ;
            topListNoun.innerHTML = dataNoun[i-1-j].name + "<br>" + extra + topListNoun.innerHTML  ;
        }
        // fill 10 names after current to bottomList
        bottomListVerb.innerHTML = "";
        bottomListNoun.innerHTML = "";
        for(var j = 1; j < 10; j++)
        {
            if(i-1+j > dataVerb.length-1) break;
            var extra =( i-1+j)%3 == 2 ? "<br>" : "";
            bottomListVerb.innerHTML += dataVerb[i-1+j].name + "<br>" + extra;
            bottomListNoun.innerHTML += dataNoun[i-1+j].name + "<br>" + extra;
        }
    }

    if (elem.id.includes("Right")) // this mean button bottom
    {

        i= dataset[label].findIndex(item => item.name === button.innerHTML);
        if(i === dataVerb.length-1) i = -1; 
        buttonVerb.innerHTML =dataVerb[i+1].name;
        buttonNoun.innerHTML =dataNoun[i+1].name;

        // fill 10 names before current to toList 
        topListVerb.innerHTML = "";
        topListNoun.innerHTML = "";
        for(var j = 0; j < 10; j++)
        {
            if(i-j < 0) break;
            var extra = (i-j)%3 == 2 ? "<br>" : "";
            console.log(i-j + " ? " + (i+1+j)%3);
            topListVerb.innerHTML = dataVerb[i-j].name + "<br>" + extra + topListVerb.innerHTML;
            topListNoun.innerHTML = dataNoun[i-j].name + "<br>" + extra + topListNoun.innerHTML;
        }
        // fill 10 names after current to bottomList
        bottomListVerb.innerHTML = "";
        bottomListNoun.innerHTML = "";
        for(var j = 1; j < 11; j++)
        {
            if(i+1+j > dataVerb.length-1) break;
            var extra = (i+1+j)%3 == 2 ? "<br>" : "";
            bottomListVerb.innerHTML += dataVerb[i+1+j].name + "<br>"+ extra;
            bottomListNoun.innerHTML += dataNoun[i+1+j].name + "<br>"+ extra;
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

bottomListNoun = document.getElementById("nounBottomList");
bottomListVerb = document.getElementById("verbBottomList");

  // fill 10 names after current to bottomList
  bottomListVerb.innerHTML = "";
  bottomListNoun.innerHTML = "";
  for(var j = 1; j < 11; j++)
  { 
      var extra = (j)%3 == 2 ? "<br>" : "";
      bottomListVerb.innerHTML += data["verb"][j].name + "<br>" + extra;
      bottomListNoun.innerHTML += data["noun"][j].name + "<br>" + extra;
  }
}

function ChangeLock(el) {
    lockButton =  document.getElementById("lock");
    if (el.value == "on")
    {
        lockButton.value = "off";
      // change icon of lockButton
      lockButton.innerHTML = '<img src="gui/unlock.png" alt="down" width="32" height="32">';
      document.getElementById("extraTohideDown").style.display = "flex";
      document.getElementById("extraTohideUp").style.display = "flex";
      lock = false;
    }
    else
    {
        lockButton.value = "on";
        lockButton.innerHTML = '<img src="gui/lock.png" class="image" alt="down" width="32" height="32">';
        document.getElementById("extraTohideDown").style.display = "none";
        document.getElementById("extraTohideUp").style.display = "none";
       lock = true;
    }

}