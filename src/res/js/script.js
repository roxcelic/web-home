var cassettes = [
    "casette_1",
    "casette_2",
    "casette_3",
]
var found_cassettes = []
var step = 110;
var player = "player";
var walkman = document.getElementById("walkman");
var canMove = true;
var pos = 0;

cassettes.forEach(item => {
    found_cassettes.push(document.getElementById(item));
});

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
            item.style.top = newTop + 'px';
            return true; 
        }
        return false; 
    });
}
function moveU() {
    found_cassettes.forEach(item => {
        canMove = true;
        item.style.top = "0px";
    });
}

let lastExecutionTime = 0;
const throttleInterval = 250; 
document.addEventListener('keydown', function(event) {
    const currentTime = Date.now();
    if (currentTime - lastExecutionTime < throttleInterval) {
        return;
    }
    lastExecutionTime = currentTime;
    if (event.key === 'ArrowLeft') {
        if (canMove && pos > -1 * Math.floor(found_cassettes.length / 2)) {moveL();}
    } else if (event.key === 'ArrowRight') {
        if (canMove && pos < Math.floor(found_cassettes.length / 2 )) {moveR();}
    } else if (event.key === 'ArrowDown') {
        if (canMove) {
            moveD();
        }
    } else if (event.key === 'ArrowUp') {
        moveU();
    }
});
function Mover(dir){
    const currentTime = Date.now();
    if (currentTime - lastExecutionTime < throttleInterval) {
        return;
    }
    lastExecutionTime = currentTime;
    if (dir === 'ArrowLeft') {
        if (canMove && pos > -1 * Math.floor(found_cassettes.length / 2)) {moveL();}
    } else if (dir === 'ArrowRight') {
        if (canMove && pos < Math.floor(found_cassettes.length / 2 )) {moveR();}
    } else if (dir === 'ArrowDown') {
        if (canMove) {
            moveD();
        }
    } else if (dir === 'ArrowUp') {
        moveU();
    }
}