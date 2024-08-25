import { parseInfoData, positionChildAbovePlayer, handleKeyEvent, moveDown, TextUpdate, moveUp, unactive   } from "./extra/lib";

// Fetch the main elements which contain the content
const holder = document.getElementById("holder");
const player = document.getElementById('player2');

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

positionChildAbovePlayer(children, parseInfoData("w_activeCas",parseInfoData("r")[1])[1]);
if (parseInfoData("r")[0] == false){
    moveDown(children, main);
}
TextUpdate(main,children);

document.addEventListener('keydown', event =>  {
    handleKeyEvent( children,event.key,main);
});

/**swipe controlls */
let startX = null;
let startY = null;
document.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});
document.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const distanceX = endX - startX;
    const distanceY = endY - startY;
    if (Math.abs(distanceX) > Math.abs(distanceY)) {
        if (distanceX > 50) {
            handleKeyEvent(children,"a",main);
        } else if (distanceX < -50) {
            handleKeyEvent(children,"d",main);
        }
    } else {
        if (distanceY > 50) {
            handleKeyEvent(children,"s",main);
        } else if (distanceY < -50) {
            handleKeyEvent(children,"w",main);
        }
    }
    startX = null;
    startY = null;
});