import { parseInfoData, positionChildAbovePlayer, syncContentPositions, handleKeyEvent } from "./extra/lib";

// Fetch the main elements which contain the content
const holder = document.getElementById("holder");
const player = document.getElementById('player');

// Defining variables which may be used later on
let children = Array.from(holder.children);
let main = {};

// Loop through children of 'holder' and populate 'main' object
children.forEach((element, index) => {
    main[`child${index}`] = Array.from(element.children);
});

//init

//set param values if unset
const defaultValues = {
    canmove: 'true',
    activecas: '0',
    activecontent: '0'
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

window.addEventListener('resize', () => syncContentPositions(player));
window.addEventListener('scroll', () => syncContentPositions(player));

positionChildAbovePlayer(children, parseInfoData("w_activeCas",parseInfoData("r")[1])[1]);

document.addEventListener('keydown', event =>  {
    handleKeyEvent( children,event.key);
});