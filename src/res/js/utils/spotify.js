async function loadMusicApi() {

    let musical = document.getElementById("musical");
    let musical2 = document.getElementById("musical2");

    let title = document.getElementById("music--title");
    let cover = document.getElementById("music--cover");
    let album = document.getElementById("music--album");
    let artist = document.getElementById("music--artist");

    // let embed_song = document.getElementById("music--song--embed");
    let embed_album = document.getElementById("music--album--embed");
    let embed_artist = document.getElementById("music--artist--embed");
    let embed_playlist = document.getElementById("personal-playlist-embed");

    try {
        let response = await fetch('https://api.roxcelic.love');
        let data = await response.json();

        if (!data.time.paused){
            title.textContent = data.track.name;
            cover.style.backgroundImage = `url('${data.track.cover[0].url}')`;
            album.textContent = data.track.album;
            artist.textContent = data.track.artists.map(artist => (artist.name)).join('|');
    
            // embed_song.src = data.embeds.track;
            embed_album.src = data.embeds.album;
            embed_artist.src = data.embeds.artists[0];
    
            updateLoadingBar(data.time);
        } else {
            musical.children[1].style.display = "none";
            musical2.children[0].style.display = "none";
            musical2.children[1].style.display = "none";

            document.getElementById("personal_playlist_embed").style.display = "none";

            title.textContent = data.track.name ?? null;
            cover.style.backgroundImage = `url('${data.track.cover[0].url ?? ""}')`;
            album.textContent = data.track.album ?? null;
            artist.textContent = data.track.artists.map(artist => (artist.name)).join('|') ?? null;
    
            // embed_song.src = "";
            embed_album.src = "";
            embed_artist.src = "";
        }

        if(embed_playlist.src == "") embed_playlist.src = data.embeds.top_playlist;
    } catch (e) {
        Array.from(musical.children).forEach(child => {
            child.style.display = "none";
        });   
        
        Array.from(musical2.children).forEach(child => {
            child.style.display = "none";
        });   

        document.getElementById("personal_playlist_embed").remove();

        console.error(e);
    }
}

function updateLoadingBar({ percent = 0, duration_ms, progress_ms }) {
    const bar = document.getElementById("loading-bar");
    const timer = document.getElementById("loading-bar-timer");

    const fullTime = new Date(duration_ms).toISOString().substr(14, 5);
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const currentProgress = Math.min(
            percent + (elapsed / (duration_ms - progress_ms)) * (100 - percent),
            100
        );

        const currentTime = new Date((duration_ms * currentProgress) / 100).toISOString().substr(14, 5);

        bar.style.width = `${currentProgress}%`;
        timer.textContent = `${currentTime}/${fullTime}`;

        if (currentProgress < 100) {
            requestAnimationFrame(update);
        } else {
            loadMusicApi();
        }
    }

    update();
}


export { loadMusicApi };