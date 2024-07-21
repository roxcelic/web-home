import { getalbum } from "./spotify";
import { fetchDataFromWorker } from "./script";

export async function getdata_spotify(){ 
    let data = await fetchDataFromWorker();

    let newcontent;

    let spotify_item1 = document.getElementById("spotifyicon");
    let spotify_item2 = document.getElementById("spotifydata");
    let spotify_item3 = document.getElementById("main_playlist");

    spotify_item1.style.backgroundImage = "url('"+data.spotify.pfp[1].url+"')";

    newcontent = document.createElement("p");
    newcontent.textContent = newcontent.textContent + data.spotify.userName;
    spotify_item2.appendChild(newcontent);

    newcontent = document.createElement("a");
    newcontent.textContent = "come visit my spotify here!";
    newcontent.href = data.spotify.link.spotify;
    spotify_item2.appendChild(newcontent);

    spotify_item3.src = "https://open.spotify.com/embed/playlist/"+data.spotifyplaylist+"?utm_source=generator&theme=1";
}

export async function getdata_current(host, host1){ 
    let data = await fetchDataFromWorker();

    if (typeof data.lastfm['@attr'] !== 'undefined'){
        host.style.display = "block";
        host1.style.display = "block";
        
        let newcontent;

        let current_item1 = document.getElementById("currenticon");
        let current_item2 = document.getElementById("currentdata");
        let current_item3 = document.getElementById("albumname");
        let current_item5 = document.getElementById("albumembed");

        current_item1.style.backgroundImage = "url('"+data.lastfm.image[3]['#text']+"')";

        newcontent = document.createElement("p");
        newcontent.textContent = data.lastfm.name + "- by -" + data.lastfm.artist['#text'];
        current_item2.appendChild(newcontent);

        current_item3.textContent = current_item3.textContent + data.lastfm.album['#text'];

        let albumdata = await getalbum(data.lastfm.album['#text'], data.lastfm.artist['#text']);

        current_item5.src = "https://open.spotify.com/embed/album/" + albumdata.song + "?utm_source=generator&theme=1";

        item2.append(current_item5);
    }
    else host.parentNode.removeChild(host);host1.parentNode.removeChild(host1);

}