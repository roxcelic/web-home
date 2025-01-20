async function loadGithubApi(username) {
    let profile = {
        url: document.getElementById("github_url"),
        banner: document.getElementById("github_banner"),
        pfp: document.getElementById("github_pfp"),
        display_name: document.getElementById("github_displayname"),
        username: document.getElementById("github_username"),
        description: document.getElementById("github_description")
    }
    try {
        const response = await fetch(`https://api.roxcelic.love/github`);
        
        const data = await response.json();

        const profile_data = {
            display_name: data.name,
            name: data.login,
            avatar: data.avatar_url,
            bio: data.bio,
            url: data.html_url
        };

        profile.url.href = profile_data.url;
        profile.banner.style.backgroundColor = "pink";
        profile.pfp.style.backgroundImage = `url('${profile_data.avatar}')`;
        profile.display_name.innerText = profile_data.display_name;
        profile.username.innerText = profile_data.name;
        profile.description.innerText = profile_data.bio;
        

    } catch (error) {
        console.error(error);
        profile.url.parentElement.remove();
    }
}

export { loadGithubApi };