
function toggleContent(el) {

    const elem = document.getElementById(el.id);
    var data = el.id.includes("verb") ? dataset.verb : dataset.noun;
    var i = data.findIndex(item => item.name === elem.innerHTML);
    var secElem = el.id.includes("verb") ? document.getElementById("nounButton") 
                                        : document.getElementById("verbButton");
    if (elem.value === "on")
    {
        document.getElementById("combo").style.display = "none";
        document.getElementById("verb").style.display = "flex";
        document.getElementById("noun").style.display = "flex";
        elem.value = el.innerHTML;
        elem.innerHTML = data[i].desc;
    }
    else 
    {   
        document.getElementById("combo").style.display = "none";
        document.getElementById("verb").style.display = "flex";
        document.getElementById("noun").style.display = "flex";
        elem.innerHTML = el.value;
        elem.value = "on";
    }

    console.log(elem.value +" - " + secElem.value);
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
    document.getElementById("combo").style.display = "none";
    document.getElementById("verb").style.display = "flex";
    document.getElementById("noun").style.display = "flex";
    document.getElementById("verbButton").innerHTML = document.getElementById("verbButton").value;
    document.getElementById("nounButton").innerHTML = document.getElementById("nounButton").value;
    document.getElementById("nounButton").value = "on"
    document.getElementById("verbButton").value = "on";
}
function changeWord(el) {

    const elem = document.getElementById(el.id);
    var data = el.id.includes("verb") ? dataset.verb : dataset.noun;
    if (elem.id.includes("Left"))
    {
        button = elem.nextElementSibling;
        i = data.findIndex(item => item.name === button.innerHTML);
        if(i === 0) i = data.length; 
        button.innerHTML = data[i-1].name;
    }
    else
    {
        button = elem.previousElementSibling;
        i= data.findIndex(item => item.name === button.innerHTML);
        if(i === data.length-1) i = -1; 
        button.innerHTML = data[i+1].name;
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
