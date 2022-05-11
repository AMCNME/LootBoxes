
/**
* By Alvaro Trigo 
* Follow me on Twitter: https://twitter.com/imac2
*/
(function(){
    init();
    
    var g_containerInViewport;
    function init(){
        setStickyContainersSize();
        bindEvents();
    }
    
    function bindEvents(){
        window.addEventListener("wheel", wheelHandler);        
    }
    
    function setStickyContainersSize(){
        document.querySelectorAll('.outerWrap').forEach(function(container){
            const stikyContainerHeight = container.querySelector('.innerWrap').scrollWidth;
            container.setAttribute('style', 'height: ' + stikyContainerHeight + 'px');
        });
    }
    
    function isElementInViewport (el) {
        const rect = el.getBoundingClientRect();
        return rect.top <= 0 && rect.bottom > document.documentElement.clientHeight;
    }
    
    function wheelHandler(evt){
        
        const containerInViewPort = Array.from(document.querySelectorAll('.outerWrap')).filter(function(container){
            return isElementInViewport(container);
        })[0];
    
        if(!containerInViewPort){
            return;
        }
    
        var isPlaceHolderBelowTop = containerInViewPort.offsetTop < document.documentElement.scrollTop;
        var isPlaceHolderBelowBottom = containerInViewPort.offsetTop + containerInViewPort.offsetHeight > document.documentElement.scrollTop;
        let g_canScrollHorizontally = isPlaceHolderBelowTop && isPlaceHolderBelowBottom;
    
        if(g_canScrollHorizontally){
            containerInViewPort.querySelector('.innerWrap').scrollLeft += evt.deltaY;
        }
    }
    })();

window.onscroll = function() {myFunction()};

function myFunction() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("myBar").style.width = scrolled + "%";
} 

var timelinePoints = document.querySelectorAll('.timeline');
for (let i = 0; i < timelinePoints.length; i++){
    new Waypoint({
        element: timelinePoints[i],
        handler: function(direction) {
            if(direction === 'right'){
                this.element.querySelector('.timelinePoint').className = 'timelinePointActive';
            } else {
                this.element.querySelector('.timelinePointActive').className = 'timelinePoint';
            }
        },
    context: document.querySelector('.innerWrap'),
    horizontal: 'true',
    offset: '40%'
})};


var visBox = document.getElementById("primaryVisContainer");
var dataText = document.querySelectorAll(".visText")
var appBlocks = document.getElementById("appVis").getElementsByClassName("appBlock");

/** Generate the visualisation for marketplaces */
function appBlocksVis(data){
    for (let i=0; i < appBlocks.length; i++){
        let block = appBlocks[i];
        block.className = "appBlock";
        d3.csv(data).then((d) =>{
            let row = d[i];
            if (row.Free == "FALSE"){
                block.classList.add("paid");
            }
            if (row.IAP == "TRUE"){
                block.classList.add("IAP");
            }
            if (row.Gambling == "TRUE"){
                block.classList.add("lootBox");
            }
        });
    }
};

var textStartWaypoint = new Waypoint ({
    element: document.getElementById("firstContainer"),
    handler: function(direction){
        if (direction == 'down'){
            document.getElementById("person").className = ("hide")
            document.getElementById("progressContainer").className = ("visible")
        }else if (direction == 'up'){
            document.getElementById("person").classList.remove("hide")
            document.getElementById("progressContainer").className = ("hide")
        }
    }
})

var title = document.getElementById("title");
var secondTitle = document.getElementById("secondTitle")
var lastTitle = document.getElementById("lastTitle")

var titleStick = new Waypoint ({
    element: title,
    handler: function(direction){
        if (direction == 'down'){
            title.classList.add("sticky")
        } else if(direction =='up'){
            title.classList.remove("sticky")
        }
    }
}) 

var playStoreWaypoint = new Waypoint ({
    element: document.getElementById("visExtContainer"),
    handler: function(direction){
        if(direction === "down"){
            visBox.className = ("appVisBlockContainer stickyVis")
        } else if(direction === "up"){
            visBox.className = ("appVisBlockContainer")
        }
    },
})

var playStationWaypoint = new Waypoint ({
    element: document.getElementById("playstation"),
    handler: function(direction){
        if(direction === "down"){
            visBox.className = ("appVisBlockContainer bottomVis")
        } else if(direction === "up"){
            visBox.className = ("appVisBlockContainer stickyVis")
        }
    },
    offset: "20%",
})

for (let i=0; i < dataText.length; i++){
    new Waypoint ({
        element: dataText[i],
        handler: function(direction){
            let previous = this.previous();
            let visKey = "/data/" + this.element.id + ".csv";
            appBlocksVis(visKey)
            if(direction === "down"){
                this.element.classList.add("active");
                if(previous !== null){
                    if(previous.id !== 'visExtContainer' && previous.className !== 'stickyVis'){
                        previous.element.classList.remove("active")
                    }
                }
            } else if(direction === "up"){
                this.element.classList.remove("active");
                if(previous !== null){
                    if(previous.id !== 'visExtContainer' && previous.className !== 'stickyVis'){
                        previous.element.classList.remove("active")
                    }
                }
            }
        },
        offset: "40%",
    });
}



