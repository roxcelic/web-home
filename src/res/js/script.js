import { parseInfoData, positionChildAbovePlayer, handleKeyEvent, moveDown, TextUpdate } from "./extra/lib";

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

//init

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