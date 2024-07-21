import { getdata_spotify } from "./extra/main";
import { getdata_current } from "./extra/main";

const cassettes = ["casette_1","casette_2","casette_3","casette_4","casette_5"];
const contents = ["content_1","content_2","content_3","content_4","content_5"];

const foundCassettes = cassettes.map(id => document.getElementById(id));
const foundContents = contents.map(id => document.getElementById(id));

const step = 110;
const walkman = document.getElementById("walkman");
const content = document.getElementById("content");
const titleText = document.getElementById("title-text");

let canMove = true;
let pos = 0;
const extraTop = 13;
let downChild = 0;

function getChildrenArray(element) {
    return element ? Array.from(element.children) : [];
}

function setContentOpacity(index, opacity) {
    const currentContent = content.children[checkDown()];
    if (currentContent) {
        const childrenArray = getChildrenArray(currentContent);
        if (childrenArray[index]) {
            childrenArray[index].style.opacity = opacity;
        }
    }
}

function isAbove(elem1, elem2) {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();
    return rect1.top < rect2.top && rect1.left < rect2.right && rect1.right > rect2.left;
}

function moveL() {
    pos++;
    foundCassettes.forEach(item => {
        const currentRight = parseInt(item.style.right, 10) || 0;
        const newRight = currentRight + step;

        item.style.transition = 'right 0.3s';
        item.style.right = `${newRight + 10}px`;
        setTimeout(() => {
            item.style.right = `${newRight}px`;
            item.style.transition = '';
        }, 300);
    });
}

function moveR() {
    pos--;
    foundCassettes.forEach(item => {
        const currentRight = parseInt(item.style.right, 10) || 0;
        const newRight = currentRight - step;

        item.style.transition = 'right 0.3s';
        item.style.right = `${newRight - 10}px`;
        setTimeout(() => {
            item.style.right = `${newRight}px`;
            item.style.transition = '';
        }, 300);
    });
}

function moveD() {
    foundCassettes.some(item => {
        if (isAbove(item, walkman)) {
            canMove = false;
            const walkmanRect = walkman.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();
            const currentTop = parseInt(window.getComputedStyle(item).top, 10) || 0;
            const distanceToMove = (walkmanRect.bottom - itemRect.top) / 2;
            const newTop = currentTop + distanceToMove + extraTop;
            item.style.transition = 'top 0.3s';
            item.style.top = `${newTop + 20}px`;
            setTimeout(() => {
                item.style.top = `${newTop}px`;
                item.style.transition = '';
            }, 300);
            return true;
        }
        return false;
    });
}


function moveU() {
    reset();
    downChild = 0;
    let item = foundCassettes[checkDown()];

    canMove = true;
        item.style.transition = 'top 0.3s';
        item.style.top = `${-20}px`;
        setTimeout(() => {
            item.style.top = `${0}px`;
            item.style.transition = '';
        }, 300);
}

function checkDown() {
    return foundCassettes.findIndex(item => item.style.top !== "0px" && item.style.top);
}

function checkSelect(index) {
    const currentCassette = foundCassettes[index];
    if (currentCassette) {
        const childrenArray = getChildrenArray(currentCassette);
        return childrenArray[0]?.textContent;
    }
    return "";
}

function moveR_u() {
    setContentOpacity(downChild, "0");
    const currentContent = content.children[checkDown()];
    if (currentContent) {
        const childrenArray = getChildrenArray(currentContent);
        if (downChild + 1 <= childrenArray.length - 1) {
            downChild++;
        } else {
            downChild = 0;
        }
        setContentOpacity(downChild, "1");
    }
}

function moveL_u() {
    const currentContent = content.children[checkDown()];
    const childrenArray = getChildrenArray(currentContent);
    setContentOpacity(downChild, "0");
    if (downChild - 1 >= 0) {
        downChild--;
    } else {
        downChild = childrenArray.length - 1;
    }
    setContentOpacity(downChild, "1");
}

function reset() {
    const currentContent = content.children[checkDown()];
    if (currentContent) {
        const childrenArray = getChildrenArray(currentContent);
        childrenArray.forEach(item => item.style.opacity = "0");
    }
}

function updateTitleText() {
    titleText.textContent = checkSelect(pos + Math.floor(foundCassettes.length / 2));
}

function sendMessageToSpotifyIframe(iframe, message) {
    iframe.contentWindow.postMessage(message, 'https://sdk.scdn.co');
}

let lastExecutionTime = 0;
var throttleInterval = 300;

document.addEventListener('keydown', event => handleKeyEvent(event.key));

function handleKeyEvent(key) {
    const currentTime = Date.now();
    if (currentTime - lastExecutionTime < throttleInterval) return;
    lastExecutionTime = currentTime;

    if (key === 'ArrowLeft') {
        if (canMove && pos > -Math.floor(foundCassettes.length / 2)) {
            moveR();
            updateTitleText();
        } else if (!canMove) {
            moveL_u();
        }
    } else if (key === 'ArrowRight') {
        if (canMove && pos < Math.floor(foundCassettes.length / 2)) {
            moveL();
            updateTitleText();
        } else if (!canMove) {
            moveR_u();
        }
    } else if (key === 'ArrowDown') {
        if (canMove){
            moveD();
            setContentOpacity(0, "1");
        }
    } else if (key === 'ArrowUp' && !canMove) {
        moveU();
    } else if (key === 'c'){
        if (!canMove) {
            const currentContent = content.children[checkDown()].children[downChild];
            if (currentContent) {
                let link = currentContent.querySelector('a');
                if (link) {
                    window.location.href = link.href;
                }
                link = currentContent.querySelector('iframe');
                if (link) {
                    window.location.href = link.src;
                }
            }
        }
    }
}

document.getElementById('touch_left').addEventListener('click', () => handleKeyEvent('ArrowLeft'));
document.getElementById('touch_right').addEventListener('click', () => handleKeyEvent('ArrowRight'));
document.getElementById('touch_down').addEventListener('click', () => handleKeyEvent('ArrowDown'));
document.getElementById('touch_up').addEventListener('click', () => handleKeyEvent('ArrowUp'));

updateTitleText();
getdata_current(document.getElementById("live-1"),document.getElementById("live-2"));
getdata_spotify();