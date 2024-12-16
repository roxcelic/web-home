async function go_die(id) {
    let side = document.getElementById(id);

    if (side.style[id] == "0px" || side.style[id] == "") {
        side.style[id] = `-${(side.getBoundingClientRect().width / 2) + 10}px`;

        window.addEventListener('resize', function() {
            side.style[id] = '0px'; 
        });
    } else {
        side.style[id] = '0px';
    }
}

function cookieparse(name, action, value) {
    if (action === "write") {
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
    } else if (action === "read") {
        const cookies = document.cookie.split("; ");
        for (let cookie of cookies) {
            const [cookieName, cookieValue] = cookie.split("=");
            if (cookieName === name) {
                return decodeURIComponent(cookieValue);
            }
        }
        return null;
    }
}


export { go_die, cookieparse };