import { parseInfoData, positionChildAbovePlayer, handleKeyEvent, moveDown, TextUpdate } from "./extra/lib";
import { fetchDataFromWorker, getDataCurrent, getDataSpotify, fetchAndDisplayPosts, getstatus } from "./extra/api";

// Fetch the main elements which contain the content
const holder = document.getElementById("holder");
const player = document.getElementById('player2');
const config = document.getElementById('config');
const close = document.getElementById('close-btn');

// Defining variables which may be used later on
let children = Array.from(holder.children);
let children2 = Array.from(player.children);
let main = {};

// Loop through children of 'holder' and populate 'main' object
children2.forEach((element, index) => {
    main[`child${index}`] = Array.from(element.children);
});

/**a function to make it so you can click on a cassette to make it active */
async function Update(index){
    if (parseInfoData("r")[0]==true){
        parseInfoData("w_activeCas",index);
        positionChildAbovePlayer(children, parseInfoData("r")[1])[1];
    }
}

//init

/**the continuation of the above function */
children.forEach((item, index) => {
    item.addEventListener('click', () => Update(index));
});

//set param values if unset
const defaultValues = {
    canmove: 'true',
    activecas: Math.floor(children.length / 2),
    activecontent: '0',
    lastactive: '[0,0]'
};
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
for (const [key, defaultValue] of Object.entries(defaultValues)) {
    if (!params.has(key)) {
        params.set(key, defaultValue);
    }
}

// Update the URL with default values
url.search = params.toString();
window.history.replaceState({}, '', url.toString());

if (parseInfoData("r")[1]>=0&&parseInfoData("r")[1]<=children.length-1){
    positionChildAbovePlayer(children, parseInfoData("w_activeCas",parseInfoData("r")[1])[1]);
} else {
    parseInfoData("w_activeCas",Math.floor(children.length / 2));
}
if (parseInfoData("r")[0] == false&&main[`child${parseInfoData("r")[1]}`][parseInfoData("r")[2]]!=undefined){
    moveDown(children, main);
} else {
    parseInfoData("w_activeContent",0);
    parseInfoData("w_canMove",true);
    parseInfoData("w_lastactive",[0,0]);
}
TextUpdate(main,children);

document.addEventListener('keydown', event =>  {
    handleKeyEvent( children,event.key,main);
});
const touch = document.getElementById('touch');
touch.addEventListener('click', function() {
    touch.remove();
});

/**set localstorage variables */
let variblenames = ['left','right','up','down'];
let variablecontent = ['a','d','w','s'];
variblenames.forEach((element, index) => {
    if (!localStorage.getItem(element)) {localStorage.setItem(element, variablecontent[index]);}
});
/**setup closebtn */
close.addEventListener('click', function(){
    config.style.display="none";
});
/**checkbox handling */
let checkboxnames = ['horizontalControlls','verticalControlls'];
let checkboxs = {};
checkboxnames.forEach(element => {
    checkboxs[element] = document.getElementById(element);
});
/**set checkbox values */
if (localStorage.getItem('left')=='d')checkboxs[checkboxnames[0]].checked=true;
if (localStorage.getItem('up')=='s')checkboxs[checkboxnames[1]].checked=true;
/**checkbox functions */
checkboxs[checkboxnames[0]].addEventListener('change', function() {
    if (checkboxs[checkboxnames[0]].checked) {
        localStorage.setItem('left', 'd');
        localStorage.setItem('right', 'a');
    } else {
        localStorage.setItem('left', 'a');
        localStorage.setItem('right', 'd');
    }
});
checkboxs[checkboxnames[1]].addEventListener('change', function() {
    if (checkboxs[checkboxnames[1]].checked) {
        localStorage.setItem('up', 's');
        localStorage.setItem('down', 'w');
    } else {
        localStorage.setItem('up', 'w');
        localStorage.setItem('down', 's');
    }
});

/**touch controlls */
let startX = null;
let startY = null;
let touchStartTime = null;
let tapTimeout = null;
let lastTapTime = 0;
const TAP_THRESHOLD = 200; 
const DOUBLE_TAP_THRESHOLD = 250;
document.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
    touchStartTime = Date.now();
});
document.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const distanceX = endX - startX;
    const distanceY = endY - startY;
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - touchStartTime;
    if (Math.abs(distanceX) < 10 && Math.abs(distanceY) < 10) {
        if (touchDuration < TAP_THRESHOLD) {
            if (touchEndTime - lastTapTime < DOUBLE_TAP_THRESHOLD) {
                handleDoubleTap();
                clearTimeout(tapTimeout);
            } else {
                tapTimeout = setTimeout(() => {
                    handleKeyEvent(children, "c", main);
                }, DOUBLE_TAP_THRESHOLD);
            }
            lastTapTime = touchEndTime;
        }
    } else {
        if (Math.abs(distanceX) > Math.abs(distanceY)) {
            if (distanceX > 50) {
                handleKeyEvent(children, localStorage.getItem('right'), main);
            } else if (distanceX < -50) {
                handleKeyEvent(children, localStorage.getItem('left'), main);
            }
        } else {
            if (distanceY > 50) {
                handleKeyEvent(children, localStorage.getItem('down'), main);
            } else if (distanceY < -50) {
                handleKeyEvent(children, localStorage.getItem('up'), main);
            }
        }
    }
    startX = null;
    startY = null;
    touchStartTime = null;
});

function handleDoubleTap() {
    if (config.style.display=="none"||config.style.display==""){
        config.style.display="block";
    }
}
/**api */
async function start(){
    try {
        const data = await fetchDataFromWorker();
        getDataCurrent(document.getElementById("live-1"), document.getElementById("live-2"), data);
        getDataSpotify(data);
        await fetchAndDisplayPosts();
        getstatus("status", data);
        children2.forEach((element, index) => {
            main[`child${index}`] = Array.from(element.children);
        });
    } catch (error) {
        console.error("An error occurred:", error);
    }
}
start();
