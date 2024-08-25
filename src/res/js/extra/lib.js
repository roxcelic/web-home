// gather main html elements
const counter = document.getElementById("counter");
const title = document.getElementById("title");

// Function to parse info data, read or modify
export function parseInfoData(action, data) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    // Retrieve the current values
    let parsed = [
        params.get('canmove') === null ? false : params.get('canmove') === 'true',
        params.get('activecas') === null ? 0 : Number(params.get('activecas')),
        params.get('activecontent') === null ? 0 : Number(params.get('activecontent')),
        params.get('lastactive') === null ? [0, 0] : JSON.parse(params.get('lastactive'))
    ];

    // Normalize action to lowercase for consistent comparison
    action = action.toLowerCase();

    if (action === 'r') {
        return parsed;
    } else if (action === 'w_canmove') {
        parsed[0] = data;
        params.set('canmove', data);
    } else if (action === 'w_activecas') {
        parsed[1] = data;
        params.set('activecas', data);
    } else if (action === 'w_activecontent') {
        parsed[2] = data;
        params.set('activecontent', data);
    } else if (action === 'w_lastactive') {
        parsed[3] = data;
        params.set('lastactive', JSON.stringify(data));
    } else {
        return "no arguments given";
    }

    // Update the URL with new parameters
    url.search = params.toString();
    window.history.replaceState({}, '', url.toString());

    return parsed;
}

const childTimeouts = new Map();
export function positionChildAbovePlayer(children, index) {
    if (index < 0 || index >= children.length) {
        console.error('Index out of bounds');
        return;
    }

    const targetElement = children[index];
    const targetRect = targetElement.getBoundingClientRect();
    const playerRect = document.getElementById('player').getBoundingClientRect();
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const playerCenterX = playerRect.left + playerRect.width / 2;
    const movement = playerCenterX - targetCenterX;
    const overshootFactor = 1.1;

    children.forEach(element => {
        const currentLeft = parseFloat(window.getComputedStyle(element).left) || 0;
        const newLeft = `${currentLeft + movement * overshootFactor}px`;
        if (childTimeouts.has(element)) {
            clearTimeout(childTimeouts.get(element));
        }
        element.style.left = newLeft;
        const timeoutId = setTimeout(() => {
            element.style.left = `${currentLeft + movement}px`;
            childTimeouts.delete(element); 
        }, 300); 
        childTimeouts.set(element, timeoutId);
    });
    return movement;
}

const moveDownTimeouts = new Map();
const moveUpTimeouts = new Map();

export function moveDown(children, main) {
    const targetIndex = parseInfoData("r")[1];
    const targetElement = children[targetIndex];
    if (moveDownTimeouts.has(targetElement)) {
        clearTimeout(moveDownTimeouts.get(targetElement));
    }
    if (moveUpTimeouts.has(targetElement)) {
        clearTimeout(moveUpTimeouts.get(targetElement));
    }
    targetElement.style.top = '6vh';
    const timeoutId = setTimeout(() => {
        targetElement.style.top = '5vh';
        moveDownTimeouts.delete(targetElement);
    }, 300);
    moveDownTimeouts.set(targetElement, timeoutId);
    parseInfoData("w_canmove", false);
    setactive(main);
}

export function moveUp(children) {
    const targetIndex = parseInfoData("r")[1];
    const targetElement = children[targetIndex];
    if (moveUpTimeouts.has(targetElement)) {
        clearTimeout(moveUpTimeouts.get(targetElement));
    }
    if (moveDownTimeouts.has(targetElement)) {
        clearTimeout(moveDownTimeouts.get(targetElement));
    }
    targetElement.style.top = '-2vh';
    const timeoutId = setTimeout(() => {
        targetElement.style.top = '0px';
        moveUpTimeouts.delete(targetElement);
    }, 300);
    moveUpTimeouts.set(targetElement, timeoutId);
    parseInfoData("w_canmove", true);
    parseInfoData("w_activecontent", 0);
}

export async function unactive(main) {
    const element = main[`child${parseInfoData("r")[3][0]}`][parseInfoData("r")[3][1]];
    element.style.opacity = 0;
    await new Promise((resolve) => {
        setTimeout(() => {
            element.style.display = "none";
            resolve();
        }, 100);
    });
}

export async function setactive(main) {
    await unactive(main);
    if (!parseInfoData("r")[0]){
        const element = main[`child${parseInfoData("r")[1]}`][parseInfoData("r")[2]];
        element.style.display = "block";
        element.style.opacity = 0;
        setTimeout(() => {
            element.style.opacity = 1;
        }, 100);
        parseInfoData("w_lastactive", [parseInfoData("r")[1], parseInfoData("r")[2]]);
    }
}


export function TextUpdate(main,children){
    let parsedText = parseInfoData("r");

    //title
    title.textContent = children[`${parsedText[1]}`].children[0].textContent;

    //counter
    let max = main[`child${parsedText[1]}`].length;
    if (parsedText[0]==true){counter.style.opacity="0"}
    else {
        counter.style.opacity="1";
        counter.textContent=`${parsedText[2]+1}/${max}`
    }
}

/**this is basically the input manager
 * it will check for an input, and if it matches one it recognises it will preform the action
 * you can also call this input manager as a function, which is what i do to add touch controlls
 */
export function handleKeyEvent(children, key, main){
    let parsedData = parseInfoData("r");
    if (key=="ArrowLeft"||key=="a"){
        if (parsedData[0]==true){
            if(parsedData[1]>0){
                parseInfoData("w_activecas",parsedData[1]-1)
            } else {
                return;
            }
        } else if (parsedData[2] > 0){
            parseInfoData("w_activecontent",parsedData[2]-1);
            setactive(main);
        } else {
            parseInfoData("w_activecontent",main[`child${parsedData[1]}`].length-1);
            setactive(main);
        }
    }
    else if (key=="ArrowRight"||key=="d"){
        if (parsedData[0]==true){
            if(parsedData[1]<children.length-1){
                parseInfoData("w_activecas",parsedData[1]+1)
            } else {
                return;
            }
        } else if (parsedData[2] < main[`child${parsedData[1]}`].length-1){
            parseInfoData("w_activecontent",parsedData[2]+1);
            setactive(main);
        } else {
            parseInfoData("w_activecontent",0);
            setactive(main);
        }
    }
    else if (key=="ArrowDown"&&parsedData[0]==true||key=="s"&&parsedData[0]==true){
        if(children[parsedData[1]].children[1]){window.location.href=children[parsedData[1]].children[1].href}
        else{moveDown(children, main)}
    }
    else if (key=="ArrowUp"&&parsedData[0]==false||key=="w"&&parsedData[0]==false){
        moveUp(children)
        unactive(main);
    } else if (key=="c"&&parsedData[0]==false){
        if (main[`child${parsedData[1]}`][parsedData[2]].querySelector("a")) window.location.href = main[`child${parsedData[1]}`][parsedData[2]].querySelector("a").href;
    }
    else if (parseFloat(key)>=1&&parseFloat(key)<=children.length&&parsedData[0]==true){
        parseInfoData("w_activecas",key-1);
    } else if (parseFloat(key)>=1&&key<=main[`child${parsedData[1]}`].length) {
            parseInfoData("w_activecontent",key-1);
            setactive(main);
    }
    positionChildAbovePlayer(children,parseInfoData("r")[1]);
    TextUpdate(main,children);
}