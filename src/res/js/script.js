import { loadMusicApi } from "./utils/spotify";
import { loadDiscordApi } from "./utils/disocrd";
import { loadBskyApi } from "./utils/bluesky";
import { loadGithubApi } from "./utils/github";
import { go_die, cookieparse } from "./utils/utils";

loadMusicApi();
loadDiscordApi();
loadBskyApi();
loadGithubApi("roxcelic");

document.addEventListener("keydown", (event) => {
    if(event.key == "a") go_die("left");
    if(event.key == "d") go_die("right");
})

document.getElementById("leftbutton").addEventListener("click", function() {
    go_die("left");
});

document.getElementById("rightbutton").addEventListener("click", function() {
    go_die("right");
});