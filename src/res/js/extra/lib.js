export { getDataSpotify, getDataCurrent, fetchAndDisplayPosts, popup, getstatus, fetchDataFromWorker } from "./script";
import { popup } from "./script";

const cassettes = ["casette_1", "casette_2", "casette_3", "casette_4", "casette_5"];
const foundCassettes = cassettes.map(id => document.getElementById(id));
const step = 110;
const walkman = document.getElementById("walkman");
const content = document.getElementById("content");
const titleText = document.getElementById("title-text");
const content_num = document.getElementById("content-view");
let canMove = document.getElementById("canMove");
let pos = 0;
const extraTop = 13;
let downChild = 0;

function getChildrenArray(element) {
    return element ? Array.from(element.children) : [];
}

function setContentOpacity(index, display, opacity) {
    const currentContent = content.children[checkDown()];
    if (currentContent) {
        const childrenArray = getChildrenArray(currentContent);
        if (childrenArray[index]) {
            if (display == ""){
                childrenArray[index].style.opacity = opacity;
                setTimeout(() => {
                    childrenArray[index].style.display = display;
                }, 150);
            } else {
                childrenArray[index].style.display = display;
                setTimeout(() => {
                    childrenArray[index].style.opacity = opacity;
                }, 150);
            }
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
            canMove.textContent="False";
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
                content_num.style.opacity = "1";
            }, 300);
            const currentContent = content.children[checkDown()];
            const childrenArray = getChildrenArray(currentContent);
            content_num.textContent = downChild + 1 + "/" + childrenArray.length; 
            return true;
        }
        return false;
    });
}

function moveU() {
    reset();
    downChild = 0;
    let item = foundCassettes[checkDown()-1];
    canMove.textContent = "True";
        item.style.transition = 'top 0.3s';
        item.style.top = `${-20}px`;
        setTimeout(() => {
            item.style.top = `${0}px`;
            item.style.transition = '';
        }, 300);
}

function checkDown() {
    return foundCassettes.findIndex(item => item.style.top !== "0px" && item.style.top) + 1;
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
    setContentOpacity(downChild, "", "");
    const currentContent = content.children[checkDown()];
    if (currentContent) {
        const childrenArray = getChildrenArray(currentContent);
        if (downChild + 1 <= childrenArray.length - 1) {
            downChild++;
        } else {
            downChild = 0;
        }
        setContentOpacity(downChild, "flex", "1");
        content_num.textContent = downChild + 1 + "/" + childrenArray.length; 
    }
}

function moveL_u() {
    const currentContent = content.children[checkDown()];
    const childrenArray = getChildrenArray(currentContent);
    setContentOpacity(downChild, "", "");
    if (downChild - 1 >= 0) {
        downChild--;
    } else {
        downChild = childrenArray.length - 1;
    }
    setContentOpacity(downChild, "flex", "1");
    content_num.textContent = downChild + 1 + "/" + childrenArray.length; 
}

function reset() {
    const currentContent = content.children[checkDown()];
    if (currentContent) {
        const childrenArray = getChildrenArray(currentContent);
        childrenArray.forEach(item => {
            content_num.style.opacity = "0";
            item.style.opacity = "0";
                setTimeout(() => {
                    item.style.display = "none";
                }, 150);
        });
    }
}

export function updateTitleText(pos) {
    titleText.textContent = checkSelect(pos + Math.floor(foundCassettes.length / 2));
}

export function handleKeyEvent(key, lastExecutionTime, throttleInterval) {
    const currentTime = Date.now();
    if (currentTime - lastExecutionTime < throttleInterval) return lastExecutionTime;
    lastExecutionTime = currentTime;

    if (key === 'ArrowLeft' || key === "a" && !document.getElementById('popup')) {
        if (canMove.textContent=="True" && pos > -Math.floor(foundCassettes.length / 2)) {
            moveR();
            updateTitleText(pos);
        } else if (canMove.textContent=="False") {
            moveL_u();
        }
    } else if (key === 'ArrowRight' || key === "d" && !document.getElementById('popup')) {
        if (canMove.textContent=="True" && pos < Math.floor(foundCassettes.length / 2)) {
            moveL();
            updateTitleText(pos);
        } else if (canMove.textContent=="False") {
            moveR_u();
        }
    } else if (key === 'ArrowDown' || key === "s" && !document.getElementById('popup')) {
        foundCassettes.forEach(item => {
            if (isAbove(item, walkman)) {
                let link = item.querySelector('a');
                if (link) {
                    window.location.href = link.href;
                }
                link = item.querySelector('iframe');
                if (link) {
                    window.location.href = link.src;
                }
            }
        });
        if (canMove.textContent=="True") {
            moveD();
            setContentOpacity(0, "flex", "1");
        }
    } else if (key === 'ArrowUp' || key === "w" && !canMove.textContent=="True") {
        moveU();
    } else if (key === 'c' && !document.getElementById('popup')) {
        if (!canMove.textContent=="True") {
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
    } else if (key === 'x') {
        if (document.getElementById('popup')) {
            document.getElementById('popup').remove();
        }
    } else if (key === 'z' && !document.getElementById('popup')) {
        popup();
    }
    return lastExecutionTime
}
export function handleGamepadEvent(lastExecutionTime, throttleInterval) {
    const gamepads = navigator.getGamepads();
    if (!gamepads) return;

    for (let gamepad of gamepads) {
        if (!gamepad) continue;

        gamepad.buttons.forEach((button, index) => {
            if (button.pressed) {
                switch (index) {
                    case 12: // D-pad up
                        handleKeyEvent('ArrowUp', lastExecutionTime, throttleInterval);
                        break;
                    case 13: // D-pad down
                        handleKeyEvent('ArrowDown', lastExecutionTime, throttleInterval);
                        break;
                    case 14: // D-pad left
                        handleKeyEvent('ArrowLeft', lastExecutionTime, throttleInterval);
                        break;
                    case 15: // D-pad right
                        handleKeyEvent('ArrowRight', lastExecutionTime, throttleInterval);
                        break;
                    case 0: // A button (or equivalent)
                        handleKeyEvent('c', lastExecutionTime, throttleInterval);
                        break;
                    case 1: // B button (or equivalent)
                        handleKeyEvent('x', lastExecutionTime, throttleInterval);
                        break;
                    case 2: // X button (or equivalent)
                        handleKeyEvent('z', lastExecutionTime, throttleInterval);
                        break;
                    // Add more cases if needed for other buttons
                }
            }
        });

        // Handle joystick movements
        const leftStickX = gamepad.axes[0];
        const leftStickY = gamepad.axes[1];

        if (leftStickX < -0.5) {
            handleKeyEvent('ArrowLeft', lastExecutionTime, throttleInterval);
        } else if (leftStickX > 0.5) {
            handleKeyEvent('ArrowRight', lastExecutionTime, throttleInterval);
        }

        if (leftStickY < -0.5) {
            handleKeyEvent('ArrowUp', lastExecutionTime, throttleInterval);
        } else if (leftStickY > 0.5) {
            handleKeyEvent('ArrowDown', lastExecutionTime, throttleInterval);
        }
    }

    requestAnimationFrame(() => handleGamepadEvent(lastExecutionTime, throttleInterval));
}