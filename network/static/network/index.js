document.addEventListener("DOMContentLoaded", function () {

    fetch("/api/all_posts").then(response => response.json()).
        then(data => {
            let postCard = data.map(
                (item) =>
                    `
    <div class="posts">
      <p class="creator">${item.creator}</p>
      <p class="date">${item.created_at}</p>
      <p class="body">${item.post_body}</p>

      <img class=${item.likes.some((x) => false || x === document.querySelector("strong").innerHTML) ? "liked" : "notLiked"
                    } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${item.likes.length}</p>
    </div>`
            );

            document.querySelector(
                "#app"
            ).innerHTML += `<div class="allPosts">${postCard}</div>`;
        })

    document.querySelector("#Profile").onclick = (e) => {
        fetch("/api/profile")
            .then((response) => response.json())
            .then((data) => {
                document.querySelector('#app').innerHTML = ""
                let profile = `<div><p>
                ${data.user}
                </p>
                <p>following
                ${data.following}
                </p>
                <p>followed
                ${data.followed}
                </p></div>
                `;
                document.querySelector("#app").innerHTML = profile;
            });
        fetch("/api/posts")
            .then((response) => response.json())
            .then((data) => {
                let postCard = data.map(
                    (item) =>
                        `
    <div class="posts">
      <p class="creator">${item.creator}</p>
      <p class="date">${item.created_at}</p>
      <p class="body">${item.post_body}</p>

      <img class=${item.likes.some((x) => false || x === e.target.innerText) ? "liked" : "notLiked"
                        } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${item.likes.length}</p>
    </div>`
                );

                document.querySelector(
                    "#app"
                ).innerHTML += `<div class="allPosts">${postCard}</div>`;
            });
    };
    document.querySelector("#Following").onclick = (e) => {
        fetch("/api/following")
            .then((response) => response.json())
            .then((data) => {
                document.querySelector('#app').innerHTML = ""
                if (data.error) {
                    document.querySelector(
                        "#app"
                    ).innerHTML += `<center><h1>
                    ${data.error}
                    </h1></center>`                }
                else {
                    let postCard = data.map(
                        (item) =>
                            `
    <div class="posts">
      <p class="creator">${item.creator}</p>
      <p class="date">${item.created_at}</p>
      <p class="body">${item.post_body}</p>

      <img class=${item.likes.some((x) => false || x === e.target.innerText) ? "liked" : "notLiked"
                            } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${item.likes.length}</p>
    </div>`
                    );

                    document.querySelector(
                        "#app"
                    ).innerHTML += `<div class="allPosts">${postCard}</div>`;
                }
            });

    };
});
