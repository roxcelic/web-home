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

export function positionChildAbovePlayer(children, index) {
    if (index < 0 || index >= children.length) {
        console.error('Index out of bounds');
        return;
    }
    const targetElement = children[index];
    const targetRect = targetElement.getBoundingClientRect();
    const playerRect = document.getElementById('player').getBoundingClientRect();
    const movement = playerRect.left - targetRect.left;
    children.forEach(element => {
        const currentLeft = parseFloat(window.getComputedStyle(element).left) || 0;
        element.style.left = `${currentLeft + movement }px`;
    });
    return movement;
}

export function moveDown(children, main){
    children[parseInfoData("r")[1]].style.top = "20px";
    parseInfoData("w_canmove",false);
    setactive(main);
}
export function moveUp(children){
    children[parseInfoData("r")[1]].style.top = "0px";
    parseInfoData("w_canmove",true);
    parseInfoData("w_activecontent",0);
}
export function unactive(main){
    main[`child${parseInfoData("r")[3][0]}`][parseInfoData("r")[3][1]].style.display = "none";
}
export function setactive(main){
    unactive(main);
    main[`child${parseInfoData("r")[1]}`][parseInfoData("r")[2]].style.display = "block";
    parseInfoData("w_lastactive",[parseInfoData("r")[1],parseInfoData("r")[2]]);}

export function TextUpdate(main,children){
    let parsedText = parseInfoData("r");

    //title
    console.log(children[`${parsedText[1]}`].children[0].textContent);
    title.textContent = children[`${parsedText[1]}`].children[0].textContent;

    //counter
    let max = main[`child${parsedText[1]}`].length;
    if (parsedText[0]==true){counter.textContent=""}
    else {counter.textContent=`${parsedText[2]+1}/${max}`}
}

export function handleKeyEvent(children, key, main){
    if (key=="ArrowLeft"||key=="a"){
        if (parseInfoData("r")[0]==true){
            if(parseInfoData("r")[1]>0){
                parseInfoData("w_activecas",parseInfoData("r")[1]-1)
            }
        } else if (parseInfoData("r")[2] > 0){
            parseInfoData("w_activecontent",parseInfoData("r")[2]-1);
            setactive(main);
        } else {
            parseInfoData("w_activecontent",main[`child${parseInfoData("r")[1]}`].length-1);
            setactive(main);
        }
    }
    else if (key=="ArrowRight"||key=="d"){
        if (parseInfoData("r")[0]==true){
            if(parseInfoData("r")[1]<children.length-1){
                parseInfoData("w_activecas",parseInfoData("r")[1]+1)
            }
        } else if (parseInfoData("r")[2] < main[`child${parseInfoData("r")[1]}`].length-1){
            parseInfoData("w_activecontent",parseInfoData("r")[2]+1);
            setactive(main);
        } else {
            parseInfoData("w_activecontent",0);
            setactive(main);
        }
    }
    else if (key=="ArrowDown"&&parseInfoData("r")[0]==true||key=="s"&&parseInfoData("r")[0]==true){
        moveDown(children, main)
    }
    else if (key=="ArrowUp"&&parseInfoData("r")[0]==false||key=="w"&&parseInfoData("r")[0]==false){
        moveUp(children)
        unactive(main);
    }
    else if (parseFloat(key)>=1&&parseFloat(key)<=children.length){parseInfoData("w_activecas",key-1)}
    positionChildAbovePlayer(children,parseInfoData("r")[1]);
    TextUpdate(main,children);
}