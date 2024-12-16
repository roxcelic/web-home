async function loadBskyApi() {
    let post = {
        text: document.getElementById("bsky_post_text")
    }

    let profile = {
        banner: document.getElementById("bsky_banner"),
        pfp: document.getElementById("bsky_pfp"),
        display_name: document.getElementById("bsky_displayname"),
        username: document.getElementById("bsky_username"),
        description: document.getElementById("bsky_description"),

        url: document.getElementById("bsky_url")
    }

    try {
        let response = await fetch('https://api.roxcelic.love/bsky');
        let data = await response.json();

        post.text.innerText = data.post.text;

        data.post.embeds.forEach(embed => {
            const img = document.createElement('img');
            
            img.src = embed.url; 
            img.alt = embed.alt; 
            img.style.borderRadius = "8px";
        
            post.text.appendChild(img);
        });

        profile.banner.style.backgroundImage = `url('${data.profile.banner}')`;
        profile.pfp.style.backgroundImage = `url('${data.profile.avatar}')`;
        profile.display_name.innerText = data.profile.displayName;
        profile.username.innerText = data.profile.handle;
        profile.description.innerText = data.profile.description;

        profile.url.href = `https://bsky.app/profile/${data.profile.handle}`;
    } catch (e) {
        document.getElementById("bluesky_profile").remove();
        document.getElementById("bsky_post").remove();

        console.error(e);
    }
}

export { loadBskyApi };