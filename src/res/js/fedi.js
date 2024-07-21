async function fetchAndDisplayPosts() {
    const apiUrl = 'https://fedi.roxcelic.love/api/v1/accounts/AjITkomZCGnFUiYbc8/statuses';
    const accountUrl = 'https://fedi.roxcelic.love/api/v1/accounts/AjITkomZCGnFUiYbc8';

    try {
        // Fetch account information to get the profile picture URL
        const accountResponse = await fetch(accountUrl);
        if (!accountResponse.ok) {
            throw new Error(`HTTP error! status: ${accountResponse.status}`);
        }
        const accountData = await accountResponse.json();
        const profilePictureUrl = accountData.avatar; // Assuming 'avatar' contains the profile picture URL

        // Fetch the posts
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const posts = await response.json();
        const nonReplies = posts.filter(post => !post.in_reply_to_id).slice(0,8);
        const contentElement = document.getElementById('content_4');
        contentElement.innerHTML = '';

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

            // Append the first attached image if available
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
            console.log(post.content);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

fetchAndDisplayPosts();