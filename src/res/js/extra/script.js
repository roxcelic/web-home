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

async function fetchDataFromWorker() {
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

export async function getDataSpotify() { 
  const data = await fetchDataFromWorker();
  if (!data) return;

  const spotifyItem1 = document.getElementById("spotifyicon");
  const spotifyItem2 = document.getElementById("spotifydata");
  const spotifyItem3 = document.getElementById("main_playlist");

  spotifyItem1.style.backgroundImage = `url('${data.spotify.pfp[1].url}')`;

  spotifyItem2.appendChild(createElement("p", {}, data.spotify.userName));
  spotifyItem2.appendChild(createElement("a", { href: data.spotify.link.spotify }, "Come visit my Spotify here!"));

  spotifyItem3.src = `https://open.spotify.com/embed/playlist/${data.spotifyplaylist}?utm_source=generator&theme=1`;
}

export async function getDataCurrent(host, host1) { 
  const data = await fetchDataFromWorker();
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
      const accountResponse = await fetch(accountUrl);
      if (!accountResponse.ok) {
          throw new Error(`HTTP error! status: ${accountResponse.status}`);
      }
      const accountData = await accountResponse.json();
      const profilePictureUrl = accountData.avatar;
      const response = await fetch(apiUrl);
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts = await response.json();
      const nonReplies = posts.filter(post => !post.in_reply_to_id).slice(0,8);
      const contentElement = document.getElementById('content_4');
      nonReplies.forEach(post => {
          const postElement = document.createElement('div');
          postElement.className = 'red';
          const pfpElement = document.createElement('img');
          pfpElement.className = 'pfp_block';
          pfpElement.src = profilePictureUrl;
          pfpElement.alt = 'Profile Picture';
          pfpElement.style.top = "0";
          const contentDiv = document.createElement('div');
          contentDiv.className = 'content';
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
          }
          contentElement.appendChild(postElement);
      });
  } catch (error) {
      console.error('Error fetching posts:', error);
  }
}

export function popup() {
  if (!document.getElementById('popup')) {
      const popupHtml = `
          <div id="popup" style="
              display: flex;
              align-items: center;
              justify-content: center;
              position: fixed;
              z-index: 1000;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              overflow: auto;
          ">
              <div style="
                  background-color: red;
                  padding: 20px;
                  border: 1px solid #888;
                  width: 80%;
                  max-width: 400px;
                  position: relative;
                  border-radius: 12px;
              ">
                  <p>
                      HEY<br>
                      Welcome to my website, this popup will only appear
                      when you press 'z' or if it's your first time visiting my website.<br><br>
                      The controls for this site are as follows:<br>
                      <t><code>z</code>: spawns the welcome popup<br>
                      <t><code>x</code>: closes the welcome popup<br>
                      <t><code>c</code>: follows the link that is on the content currently 'playing' if there is one<br>
                      <t><code>Up_arrow</code>: unselects the 'cassette'<br>
                      <t><code>Left_arrow</code>: moves the content left<br>
                      <t><code>Down_arrow</code>: selects the 'cassette'<br>
                      <t><code>Right_arrow</code>: moves the content right<br><br>
                      Remember each cassette has multiple 'tracks' so when you select one you can move left and right within it<br><br>
                      To close this popup press 'x' or click anywhere on the page that isn't the popup.
                  </p>
              </div>
          </div>
      `;
      document.body.insertAdjacentHTML('beforeend', popupHtml);
      localStorage.setItem('popupShown', 'true');
      const popup = document.getElementById('popup');
      window.addEventListener('click', function(event) { 
          if (event.target === popup) {
              popup.remove();
          }
      });
  }
}
