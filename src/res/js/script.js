var cassettes = [
    "casette_1",
    "casette_2",
    "casette_3",
]
var contents = [
    "content_1",
    "content_2",
    "content_3",
]
var found_cassettes = []
var found_content = []
var step = 110;
var player = "player";
var walkman = document.getElementById("walkman");
var canMove = true;
var pos = 0;
var extraTop = 13;
var down_child = 0;
var content = document.getElementById("content");

cassettes.forEach(item => {
    found_cassettes.push(document.getElementById(item));
});
contents.forEach(item => {
    found_content.push(document.getElementById(item));
});


function setactivecontent(item){
    const childrens = content.children;
    const children2 = childrens[checkdown()].children;
    const childrenArray = Array.from(children2);
    childrenArray[item].style.opacity = "1";
}
function setunactivecontent(item){
    const childrens = content.children;
    const children2 = childrens[checkdown()].children;
    const childrenArray = Array.from(children2);
    childrenArray[item].style.opacity = "0";
}
function isAbove(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
    const verticallyAligned = rect1.top < rect2.top;
    const horizontallyAligned = rect1.left < rect2.right && rect1.right > rect2.left;
    return verticallyAligned && horizontallyAligned;
}


function moveL() {
    pos-=1;
    found_cassettes.forEach(item => {
        let currentRight = parseInt(item.style.right) || 0;
        item.style.right = (currentRight + step) + "px";
    });
}

function moveR() {
    pos+=1;
    found_cassettes.forEach(item => {
        let currentRight = parseInt(item.style.right) || 0;
        item.style.right = (currentRight - step) + "px";
    });
}

function moveD() {
    found_cassettes.some(item => {
        if (isAbove(item, walkman)) {
            canMove = false;
            const walkmanRect = walkman.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();
            const currentTop = parseInt(window.getComputedStyle(item).top, 10) || 0;
            const distanceToMove = (walkmanRect.bottom - itemRect.top) / 2;
            const newTop = currentTop + distanceToMove;      
            item.style.top = newTop + extraTop + 'px';
            return true; 
        }
        return false; 
    });
}
function moveU() {
    reset();
    down_child = 0;
    found_cassettes.forEach(item => {
        canMove = true;
        item.style.top = "0px";
    });
}
function checkdown() {
    for (let index = 0; index < found_cassettes.length; index++) {
        const item = found_cassettes[index];
        if (item.style.top != "0px" && item.style.top != 0 && item.style.top != null) {
            return index;
        }
    }
    return -1;
}
function moveR_u() {

    const childrens = content.children;
    const children2 = childrens[checkdown()].children;
    const childrenArray = Array.from(children2);

    setunactivecontent(down_child);
    if (down_child+1 <= childrenArray.length-1){down_child+=1;}
    setactivecontent(down_child);
}

function moveL_u(){
    setunactivecontent(down_child);
    if (down_child-1 >= 0){down_child-=1;}
    setactivecontent(down_child);
}

function reset(){
    const childrens = content.children;
    const children2 = childrens[checkdown()].children;
    const childrenArray = Array.from(children2);
    childrenArray.forEach(item => {
        item.style.opacity = "0";
    });
}


let lastExecutionTime = 0;
const throttleInterval = 250; 


document.addEventListener('keydown', function(event) {
    handleKeyEvent(event.key);
});

function handleKeyEvent(key) {
    const currentTime = Date.now();
    if (currentTime - lastExecutionTime < throttleInterval) {
        return;
    }
    lastExecutionTime = currentTime;

    if (key === 'ArrowLeft') {
        if (canMove && pos > -1 * Math.floor(found_cassettes.length / 2)) {
            moveL();
        } else if (!canMove) {
            moveL_u();
        }
    } else if (key === 'ArrowRight') {
        if (canMove && pos < Math.floor(found_cassettes.length / 2)) {
            moveR();
        } else if (!canMove) {
            moveR_u();
        }
    } else if (key === 'ArrowDown' && canMove) {
        moveD();
        setactivecontent(0);
    } else if (key === 'ArrowUp' && !canMove) {
        moveU();
    }
}

document.getElementById('touch_left').addEventListener('click', function() {
    handleKeyEvent('ArrowLeft');
});

document.getElementById('touch_right').addEventListener('click', function() {
    handleKeyEvent('ArrowRight');
});

document.getElementById('touch_down').addEventListener('click', function() {
    handleKeyEvent('ArrowDown');
});

document.getElementById('touch_up').addEventListener('click', function() {
    handleKeyEvent('ArrowUp');
});
