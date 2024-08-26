async function fetchData(url, params = {}) {
    try {
        const response = await fetch(url, params);
        if (response.ok) {
            return await response.json();
        } else {
            console.error("Error fetching data:", response.status);
        }
    } catch (error) {
        console.error("An error occurred while fetching data:", error);
    }
    return null;
}
  
export async function fetchDataFromWorker() {
    return await fetchData("https://api.roxcelic.love/");
}
  
async function getAlbum(input, artist) {
    const url = `https://api.roxcelic.love/?input=${input}&artist=${artist}`;
    return await fetchData(url);
}
  
function createElement(tag, attributes = {}, textContent = "") {
    const element = document.createElement(tag);
    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            element.setAttribute(key, attributes[key]);
        }
    }
    element.textContent = textContent;
    return element;
}
  
export async function getDataSpotify(data) { 
    if (!data) return;
  
    const spotifyItem1 = document.getElementById("spotifyicon");
    const spotifyItem2 = document.getElementById("spotifydata");
    const spotifyItem3 = document.getElementById("main_playlist");
  
    spotifyItem1.style.backgroundImage = `url('${data.spotify.pfp[1].url}')`;
  
    spotifyItem2.appendChild(createElement("p", {}, data.spotify.userName));
    spotifyItem2.appendChild(createElement("a", { href: data.spotify.link.spotify }, "Come visit my Spotify here!"));
  
    spotifyItem3.src = `https://open.spotify.com/embed/playlist/${data.spotifyplaylist}?utm_source=generator&theme=1`;
}
  
export async function getstatus(id, data){
      const status = document.getElementById(id);
      let checkdate = Math.abs(new Date() - new Date(data.status.date)) <= (parseInt(data.status.last) * 60 * 60 * 1000);
      if (data.status.type == "string" && checkdate){
          status.textContent = data.status.message;
      }else if (data.status.type == "html" && checkdate){
          status.innerHTML = data.status.message;
      }
      else {
          status.textContent = "-";
      }
}
  
export async function getDataCurrent(host, host1, data) { 
    if (!data) return;
  
    if (data.lastfm['@attr']) {
  
        const currentItem1 = document.getElementById("currenticon");
        const currentItem2 = document.getElementById("currentdata");
        const currentItem3 = document.getElementById("albumname");
        const currentItem5 = document.getElementById("albumembed");
  
        currentItem1.style.backgroundImage = `url('${data.lastfm.image[3]['#text']}')`;
  
        const artistText = `${data.lastfm.name} - by - ${data.lastfm.artist['#text']}`;
        currentItem2.appendChild(createElement("p", {}, artistText));
  
        currentItem3.textContent = data.lastfm.album['#text'];
  
        const albumData = await getAlbum(data.lastfm.album['#text'], data.lastfm.artist['#text']);
        currentItem5.src = `https://open.spotify.com/embed/album/${albumData.song}?utm_source=generator&theme=1`;
    } else {
        host.remove();
        host1.remove();
    }
}
  
export async function fetchAndDisplayPosts() {
    const apiUrl = 'https://fedi.roxcelic.love/api/v1/accounts/AjITkomZCGnFUiYbc8/statuses';
    const accountUrl = 'https://fedi.roxcelic.love/api/v1/accounts/AjITkomZCGnFUiYbc8';

    try {
        const [accountResponse, postsResponse] = await Promise.all([fetch(accountUrl), fetch(apiUrl)]);
        
        if (!accountResponse.ok || !postsResponse.ok) {
            throw new Error(`HTTP error! Account status: ${accountResponse.status}, Posts status: ${postsResponse.status}`);
        }

        const accountData = await accountResponse.json();
        const posts = await postsResponse.json();

        const profilePictureUrl = accountData.avatar;
        const nonReplies = posts.filter(post => !post.in_reply_to_id).slice(0, 8);

        const contentElement = document.getElementById('fedi');
        const fragment = document.createDocumentFragment();

        nonReplies.forEach(post => {
            const postElement = createPostElement(post, profilePictureUrl);
            fragment.appendChild(postElement);
        });

        contentElement.appendChild(fragment);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

function createPostElement(post, profilePictureUrl) {
    const postElement = document.createElement('div');
    postElement.className = 'box content';

    const pfpElement = document.createElement('img');
    pfpElement.className = 'pfp_block';
    pfpElement.src = profilePictureUrl;
    pfpElement.alt = 'Profile Picture';
    pfpElement.style.top = "0";

    const contentDiv = document.createElement('div');
    contentDiv.className = 'contentd';
    contentDiv.innerHTML = post.content;

    postElement.appendChild(pfpElement);
    postElement.appendChild(contentDiv);

    if (post.media_attachments && post.media_attachments.length > 0) {
        const firstImage = post.media_attachments.find(media => media.type === 'image');
        if (firstImage) {
            const imageElement = document.createElement('img');
            const imageLink = document.createElement('a');
            imageLink.href = firstImage.url;
            imageElement.className = 'attached_image';
            imageElement.src = firstImage.url;
            imageElement.alt = 'Attached Image';
            imageElement.style.borderRadius = '5px';
            imageLink.style.margin = 'auto';
            imageElement.style.bottom = "0";

            imageLink.appendChild(imageElement);
            postElement.appendChild(imageLink);
        }
    } else {
        const linkElement = document.createElement('a');
        linkElement.href = post.url;
        postElement.appendChild(linkElement);
    }

    return postElement;
}
