import { 
    getDataSpotify, 
    getDataCurrent, 
    fetchAndDisplayPosts, 
    popup, 
    updateTitleText, 
    handleKeyEvent, 
    handleGamepadEvent,
    getstatus,
    fetchDataFromWorker
} from "./extra/lib";

let lastExecutionTime = 0;
const throttleInterval = 300;

document.addEventListener('keydown', event => lastExecutionTime = handleKeyEvent(event.key, lastExecutionTime, throttleInterval));

requestAnimationFrame(() => handleGamepadEvent(lastExecutionTime, throttleInterval));
document.getElementById('touch_left').addEventListener('click', () => handleKeyEvent('ArrowLeft', lastExecutionTime, throttleInterval));
document.getElementById('touch_right').addEventListener('click', () => handleKeyEvent('ArrowRight', lastExecutionTime, throttleInterval));
document.getElementById('touch_down').addEventListener('click', () => handleKeyEvent('ArrowDown', lastExecutionTime, throttleInterval));
document.getElementById('touch_up').addEventListener('click', () => handleKeyEvent('ArrowUp', lastExecutionTime, throttleInterval));
document.getElementById('touch_c').addEventListener('click', () => handleKeyEvent('c', lastExecutionTime, throttleInterval));
document.getElementById('touch_x').addEventListener('click', () => handleKeyEvent('x', lastExecutionTime, throttleInterval));
document.getElementById('touch_z').addEventListener('click', () => handleKeyEvent('z', lastExecutionTime, throttleInterval));

async function start(){
    updateTitleText(0);
    const data = await fetchDataFromWorker();
    getDataCurrent(document.getElementById("live-1"), document.getElementById("live-2"), data);
    getDataSpotify(data);
    fetchAndDisplayPosts();
    if (!localStorage.getItem('popupShown')) {
        popup();
    }
    getstatus("status", data);
}
start();