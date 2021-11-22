document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#AllPosts").click();

});
var interval;
document.querySelector("#AllPosts").onclick = (e) => {
    e.preventDefault()

    document.querySelector("#app").innerHTML = `<form class="allPosts">
        <div class="posts">
            <textarea class="d-block" required> </textarea>
            <input class="btn btn-primary" type="submit" value="Post" />
        </div>
        </form>`;

    document.forms[0].onsubmit = (e) => {
        console.log(e);
        e.preventDefault();
    }
    console.log(x);
    interval = setInterval(function () {
        fetch("/api/all_posts")
            .then((response) => response.json())
            .then((data) => {
                let postCard = data.map(
                    (item) =>
                        `
    <div class="posts" id="post${item.id}">
      <p class="creator">${item.creator}</p>
      <p class="date">${item.created_at}</p>
      <p class="body">${item.post_body}</p>

      <img onclick="like(${item.id})" class=${item.likes.some(
                            (x) => false || x === document.querySelector("strong").innerHTML
                        )
                            ? "liked"
                            : "notLiked"
                        } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${item.likes.length}</p>
    </div>`
                );
                if (document.querySelector("#allPosts"))
                    document.querySelector("#allPosts").innerHTML = postCard
                else
                    document.querySelector("#app").innerHTML += `<div id="allPosts" class="allPosts">${postCard}</div>`;

            })
    }, 1000);

};
document.querySelector("#Profile").onclick = (e) => {
    fetch("/api/profile")
        .then((response) => response.json())
        .then((data) => {
            document.querySelector("#app").innerHTML = "";
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
            if (data.error) {
                document.querySelector("#app").innerHTML += `<center><h1>
                    ${data.error}
                    </h1></center>`;
            } else {
                let postCard = data.map(
                    (item) =>
                        `
    <div class="posts" id="post${item.id}">
      <p class="creator">${item.creator}</p>
      <p class="date">${item.created_at}</p>
      <p class="body">${item.post_body}</p>

      <img onclick="like(${item.id})" class=${item.likes.some((x) => false || x === e.target.innerText)
                            ? "liked"
                            : "notLiked"
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
document.querySelector("#Following").onclick = (e) => {
    clearInterval(interval)
    fetch("/api/following")
        .then((response) => response.json())
        .then((data) => {
            document.querySelector("#app").innerHTML = "";
            if (data.error) {
                document.querySelector("#app").innerHTML += `<center><h1>
                    ${data.error}
                    </h1></center>`;
            } else {
                let postCard = data.map(
                    (item) =>
                        `
    <div class="posts" id="post${item.id}">
      <p class="creator">${item.creator}</p>
      <p class="date">${item.created_at}</p>
      <p class="body">${item.post_body}</p>

      <img onclick="like(${item.id})" class=${item.likes.some((x) => false || x === e.target.innerText)
                            ? "liked"
                            : "notLiked"
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
like = (id) => {
    /*
         “Like” and “Unlike”:
         Users should be able to click a button or link on any post to toggle whether or not they “like” that post.
         Using JavaScript, you should asynchronously let the server know to update the like count (as via a call to fetch) and
         then update the post’s like count displayed on the page, without requiring a reload of the entire page.
     */

    fetch(`/api/posts`)
        .then((response) => response.json())
        .then((data) => {
            fetch(`/api/posts/${id}`, {
                method: "PUT",
                body: JSON.stringify({ ...data }),
            })
                .then((response) => response.json())
                .then(function (data) {
                    document.querySelector(
                        `#post${id}`
                    ).innerHTML = `    <p class="creator">${data.creator}</p>
      <p class="date">${data.created_at}</p>
      <p class="body">${data.post_body}</p>

      <img onclick="like(${data.id})" class=${data.likes.some(
                        (x) => false || x === document.querySelector("strong").innerHTML
                    )
                            ? "liked"
                            : "notLiked"
                        } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${data.likes.length}</p>`;
                });
        });
};
