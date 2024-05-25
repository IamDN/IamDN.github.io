var lock = true;
var isMobile = false;
var originalSize = 0;
var isLeftHalf = true;
var version = "0.2.3";
var mouseOverVerb = false;
var mouseOverNoun = false;

function toggleContent(el) {

    const elem = document.getElementById(el.id);
    var data = el.id.includes("verb") ? dataset.verb : dataset.noun;
    var i = data.findIndex(item => item.name === elem.innerHTML);
    var secElem = el.id.includes("verb") ? document.getElementById("nounButton") 
                                        : document.getElementById("verbButton");
    if (elem.value === "on")
    {
        console.log("change " + el.innerHTML);
        elem.value = el.innerHTML;
        
        if(isMobile)
        {
           console.log(" update data mobile " + data[i].desc);
           document.getElementById("container").style.display = "none";
           document.getElementById("combo").style.display = "flex";
           document.getElementById("comboButton").innerHTML = data[i].desc;
           document.getElementById("comboButton").value = el.id.includes("verb")? "verb" : "noun";
        } else
        {
            elem.value = el.innerHTML;
            elem.innerHTML = data[i].desc;
            elem.style.height = data[i].height ;
            console.log(elem);
        }
      
    }
    else 
    {      
        if(isMobile)
            {
               document.getElementById("container").style.display = "none";
               document.getElementById("combo").style.display = "flex";
               document.getElementById("comboButton").innerHTML = data[i].desc;
               document.getElementById("comboButton").value = "none";

     
            }
            else
        {
           
             elem.innerHTML = elem.value ;
            elem.style.height = originalSize ;

        }
        elem.value = "on";
    }
//TODO: implemete combos
    // if (elem.value !== "on" && secElem.value !== "on")
    //     {
    //         var combo = document.getElementById("verbButton").value + " " + document.getElementById("nounButton").value;
    //         var i = dataset.combos.findIndex(x=> x.name === combo);
    //         console.log(i + " - " + combo);
    //         document.getElementById("comboButton").innerHTML = dataset.combos[i].desc;
    //         document.getElementById("combo").style.display = "flex";

    //     }
}
function resetToDefault() {        
    document.getElementById("container").style.display = "block";
    document.getElementById("combo").style.display = "none";
    document.getElementById("comboButton").value ="none";

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
        if (i===-1)  i = data.findIndex(item => item.name === button.value);
        if(i === 0) i = data.length; 
        button.innerHTML = data[i-1].name;
        button.style.height = originalSize;
        button.value = "on";
        // fill 10 names before current to toList 
        topList.innerHTML = "";
        for(var j = 1; j < 10; j++)
        {
            if(i-1-j < 0) break;
            //place string to the begiging of the list
            var extra = (i-1-j)%3 == 2 ? "<br>" : "";
            topList.innerHTML = data[i-1-j].name + "<br>" + extra + topList.innerHTML  ;
        }
        // fill 10 names after current to bottomList
        bottomList.innerHTML = "";
        for(var j = 1; j < 10; j++)
        {
            if(i+1+j > data.length-1) break;
            var extra = ( i-1+j)%3== 0 ? "<br>" : "";
            bottomList.innerHTML += data[i-1+j].name + "<br>" + extra;
        }
    }

    if (elem.id.includes("Right")) // this mean button bottom
    {
        i= data.findIndex(item => item.name === button.innerHTML);
        if (i===-1)  i = data.findIndex(item => item.name === button.value);
        if(i === data.length-1) i = -1; 
        button.innerHTML =data[i+1].name;
        button.style.height = originalSize;
        button.value = "on";
        // fill 10 names before current to toList 
        topList.innerHTML = "";
        for(var j = 0; j < 10; j++)
        {
            if(i-j < 0) break;
            var extra = (i-j)%3 == 2 ? "<br>" : "";
            topList.innerHTML =  data[i-j].name + "<br>" + extra + topList.innerHTML;
        }
        // fill 10 names after current to bottomList
        bottomList.innerHTML = "";
        for(var j = 1; j < 11; j++)
        {
            if(i+1+j > data.length-1) break;
            var extra = (i+1+j)%3 == 2 ? "<br>" : "";
            bottomList.innerHTML += data[i+1+j].name + "<br>"+ extra;
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
        if (i===-1)      i = dataset[label].findIndex(item => item.name === button.value);
        if(i === 0) i = dataVerb.length; 
        buttonVerb.innerHTML = dataVerb[i-1].name;
        buttonNoun.innerHTML = dataNoun[i-1].name;
        buttonVerb.style.height = originalSize;
        buttonNoun.style.height  = originalSize;
        buttonVerb.value = "on";
        buttonNoun.value = "on";

        // fill 10 names before current to toList 
        topListVerb.innerHTML = "";
        topListNoun.innerHTML = "";
        for(var j = 1; j < 10; j++)
        {
            if(i-1-j < 0) break;
            //place string to the begiging of the list
            var extra = (i-1-j)%3 == 2 ? "<br>" : "";
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
        if (i===-1)      i = dataset[label].findIndex(item => item.name === button.value);
        if(i === dataVerb.length-1) i = -1; 
        buttonVerb.innerHTML =dataVerb[i+1].name;
        buttonNoun.innerHTML =dataNoun[i+1].name;
        buttonVerb.style.height = originalSize;
        buttonNoun.style.height  = originalSize;
        buttonVerb.value = "on";
        buttonNoun.value = "on";

        // fill 10 names before current to toList 
        topListVerb.innerHTML = "";
        topListNoun.innerHTML = "";
        for(var j = 0; j < 10; j++)
        {
            if(i-j < 0) break;
            var extra = (i-j)%3 == 2 ? "<br>" : "";
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

window.mobileCheck = function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};

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

  isMobile = mobileCheck();
  if (isMobile)
  {
    document.getElementById("center").classList.add("mobileCenter");
    document.getElementById("center").classList.remove("desktopCenter");
    document.getElementById("verticalTop").classList.add("mobileList");
    document.getElementById("verticalTop").classList.remove("desktopList");
    document.getElementById("verticalBottom").classList.add("mobileList");
    document.getElementById("verticalBottom").classList.remove("desktopList");
    
  } else
  {
    document.getElementById("center").classList.add("desktopCenter");
    document.getElementById("center").classList.remove("mobileCenter");
    document.getElementById("verticalTop").classList.add("desktopList");
    document.getElementById("verticalTop").classList.remove("mobileList");
    document.getElementById("verticalBottom").classList.add("desktopList");
    document.getElementById("verticalBottom").classList.remove("mobileList");
  }
  originalSize = document.getElementById("verbButton").offsetHeight + "px";
  document.getElementById("test").innerHTML ="Design Actions v" + version;
  StartListening();
}

function ChangeLock(el) {
    lockButton =  document.getElementById("lock");
    if (el.value == "on")
    {
        lockButton.value = "off";
      // change icon of lockButton
      lockButton.innerHTML = '<img src="gui/unlock.png" alt="down" width="32" height="32">';
    //   document.getElementById("extraTohideDown").style.display = "flex";
    //   document.getElementById("extraTohideUp").style.display = "flex";
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
function ScrollContent(value, half) {
    if (value > 0) {

      if (lock) {
       ChangeBothSides(document.getElementById("verbRight"));
       }
       else
       {
        ChangeOneSide(document.getElementById( half +"Right"));
       }
   } else if (value < 0) {

        if (lock) {
             ChangeBothSides(document.getElementById("verbLeft"));
       }else
         {
              ChangeOneSide(document.getElementById( half + "Left"));
          }
}

}
function StartListening() {
    document.getElementById("verbButton").addEventListener("mouseover", function() {
        mouseOverVerb = true;
    },false);

    document.getElementById("verbButton").addEventListener("mouseout", function() {
        mouseOverVerb = false;
    },false);
    
    document.getElementById("nounButton").addEventListener("mouseover", function() {
        mouseOverNoun = true;
    },false);
    
    document.getElementById("nounButton").addEventListener("mouseout", function() {
        mouseOverNoun = false;
    },false);
    
}




// listen to scroll to change coloums
var desktopScrollAdjust  =0;
document.addEventListener("mousewheel", function(e){ 

    if (document.getElementById("verbButton").value != "on" && mouseOverVerb) 
        return;

    if (document.getElementById("nounButton").value != "on" && mouseOverNoun) return;


    // if it is on mobile ignore every second scroll
    if (desktopScrollAdjust> 0) {
        desktopScrollAdjust = desktopScrollAdjust - 1;
        return;
    } 
    desktopScrollAdjust= 3

    var half = e.pageX >window.innerWidth / 2? "noun" : "verb";
    ScrollContent(e.deltaY, half);
}, false);

// listen to mouse move
// window.addEventListener("mousemove", function(e){
//     // get screen size
//     var screenWidth = window.innerWidth;
//     isLeftHalf = e.screenX >screenWidth / 2;
//     console.log(isLeftHalf);
// }, false);

// Listen to swipe
var mobileScrollAdjust  =0;
var previsualY = 0;
var previsualX = 0;

window.addEventListener("touchmove", function(e){
//window.addEventListener("keydown", function(e){
    var previsualY = 0;
// check if swap is vertical or horizontal
     if (document.getElementById("combo").style.display != "none")
    {
  
    } else
    {
        if (mobileScrollAdjust> 0) {
            mobileScrollAdjust = mobileScrollAdjust - 1;
            return;
        } 
        mobileScrollAdjust= 5

        isLeftHalf = e.touches[0].screenX >window.innerWidth/ 2;
        var isLeftHalf = e.touches[0].screenX >window.innerWidth / 2;
        var half = isLeftHalf? "noun" : "verb";
this.document.getElementById("test").innerHTML = -(e.touches[0].screenY - previsualY);
        ScrollContent(-(e.touches[0].screenY - previsualY), half);
        
    }
     previsualY = e.touches[0].screenY;
     previsualX = e.touches[0].screenX;
}, false);

var startX;
window.addEventListener("touchstart", function(e){
 
    startX = e.touches[0].screenX;
}, false);

window.addEventListener("touchend", function(e){
  
    if (document.getElementById("combo").style.display == "none")
        return;

    var button = document.getElementById("comboButton");
    var isVerb = button.value.includes("verb");
  if (startX< e.changedTouches[0].screenX -100 && !isVerb) {

   
     
    var data = isVerb  ? dataset.noun : dataset.verb;

    var otherLabel = isVerb  ? "noun" : "verb";

    var otherButton = document.getElementById(otherLabel + "Button");
    var i = data.findIndex(item => item.name === otherButton.innerHTML);

    if(i>=0)
    {
        button.innerHTML = data[i].desc;
        button.value = button.value.includes("verb") ? "noun":"verb";
    }
  } else if (startX> e.changedTouches[0].screenX +100 && isVerb) {
    var data = isVerb  ? dataset.noun : dataset.verb;

    var otherLabel = isVerb  ? "noun" : "verb";

    var otherButton = document.getElementById(otherLabel + "Button");
    var i = data.findIndex(item => item.name === otherButton.innerHTML);

    if(i>=0)
    {
        button.innerHTML = data[i].desc;
        button.value = button.value.includes("verb") ? "noun":"verb";
    }
  }
}, false);

//listen if on mobile user is swiping vertically to scroll
// const element = document.querySelector('.block-swipe-nav');

// element.addEventListener('touchstart', (e) => {

//     // prevent swipe to navigate gesture
//     e.preventDefault();

//     // 
// });

