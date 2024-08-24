// Function to parse info data, read or modify
export function parseInfoData( action, data) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    // Retrieve the current values as an array
    let parsed = [
        params.get('canmove') === null ? false : params.get('canmove') === 'true',
        params.get('activecas') === null ? 0 : Number(params.get('activecas')),
        params.get('activecontent') === null ? 0 : Number(params.get('activecontent'))
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



export function syncContentPositions(player) {
    if (player) {
        const playerRect = player.getBoundingClientRect();
        const contents = document.querySelectorAll('.content');
        contents.forEach(content => {
            content.style.left = `${playerRect.left}px`;
            content.style.top = `${playerRect.top - content.offsetHeight}px`;
        });
    }
}

export function handleKeyEvent(children, key){
    if (key == "ArrowLeft" && parseInfoData("r")[0]==true){parseInfoData("w_activecas",parseInfoData("r")[1]-1);}
    else if (key == "ArrowRight" && parseInfoData("r")[0]==true){parseInfoData("w_activecas",parseInfoData("r")[1]+1);}
    positionChildAbovePlayer(children,parseInfoData("r")[1]);
}