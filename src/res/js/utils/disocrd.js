async function loadDiscordApi() {
    let banner = document.getElementById("banner");
    let pfp = document.getElementById("pfp");
    let displayname = document.getElementById("displayname");
    let username = document.getElementById("username");

    try {
        let response = await fetch('https://api.roxcelic.love/discord');
        let data = await response.json();

        banner.style.backgroundColor = data.userInfo.banner_color;
        banner.style.backgroundImage = `url('https://cdn.discordapp.com/avatars/${data.userInfo.id}/${data.userInfo.banner}.png')`;
        pfp.style.backgroundImage = `url('https://cdn.discordapp.com/avatars/${data.userInfo.id}/${data.userInfo.avatar}.png')`;
        displayname.textContent = data.userInfo.global_name;
        username.textContent = `@${data.userInfo.username}`;

    } catch (e) {
        document.getElementById("discord_profile").remove();

        console.error(e);
    }
}

export { loadDiscordApi };