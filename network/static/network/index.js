var CURRENT_USER = null;
document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/whoCurrentUser")
        .then((response) => response.json())
        .then((data) => {
            if (data.USERNAME) {
                CURRENT_USER = data.USERNAME;
            }
        }).then(function () {
            console.log(window.location)
            if (window.location.pathname === "/") {
                document.querySelector("#AllPosts").click();
            }
            else if (window.location.pathname === "/following") {
                document.querySelector("#Following").click();

            }
            else if (window.location.pathname === "/profile") {
                document.querySelector("#Profile").click();

            }

        }
        )
});
document.querySelector("#AllPosts").onclick = (e) => {
    if (history.state === null)
        history.pushState({ page: "#AllPosts", section: 1 }, "", "/")
    console.log(history.state)
    if (window.location.pathname === "/") {

        e.preventDefault();
    }
    if (CURRENT_USER) {
        document.querySelector("#app").innerHTML = `<form class="allPosts" >
        <div class="posts">
            <textarea class="d-block" required> </textarea>
            <input class="btn btn-primary" type="submit" value="Post"/>
        </div>
        </form>`;
        document.querySelector("form.allPosts").onsubmit = (e) => {
            e.preventDefault();
            fetch(`/api/posts`, {
                method: "POST",
                body: JSON.stringify({ post_body: e.target[0].value }),
            })
                .then((response) => response.json())
                .then(() => (e.target[0].value = ""));
        };
    }

    fetch(`/api/postsID/${history.state.section}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)
            let postCard = data.data.map(
                (item) =>
                    `
       <div class="posts" id="post${item.id}">
         <p class="creator">${item.creator}

         ${CURRENT_USER === item.creator
                        ? '<a id="edit" onclick="edit(' + item.id + ')">edit</a>'
                        : ""
                    }</p>
         <p class="date">${item.created_at}</p>
         <p class="body">${item.post_body}</p>

         <img onclick="like(${item.id})" class=${item.likes.some((x) => false || x === CURRENT_USER)
                        ? "liked"
                        : "notLiked"
                    } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
         <p>Likes ${item.likes.length}</p>
       </div>`
            );
            if (document.querySelector("#allPosts"))
                document.querySelector("#allPosts").innerHTML = postCard;
            else
                document.querySelector(
                    "#app"
                ).innerHTML += `<div id="allPosts" class="allPosts">${postCard}</div>`;

            document.querySelector("#pagination").innerHTML =
                `
        ${data.id <= data.num_page && data.id !== 1 ?
                    '<li class="page-item"><a class="page-link" onclick="pagination(Previous)" id="Previous">Previous</a></li>'
                    : ''}
        ${data.id <= data.num_page && data.id !== data.num_page ?
                    '<li class="page-item"><a class="page-link" onclick="pagination(Next)" id="Next">Next</a></li>'
                    : ''}
                `
            document.querySelector("form.allPosts").onsubmit = (e) => {
                e.preventDefault();
                fetch(`/ api / posts`, {
                    method: "POST",
                    body: JSON.stringify({ post_body: e.target[0].value }),
                })
                    .then((response) => response.json())
                    .then((data) => (e.target[0].value = ""));
            };

        })
};

document.querySelector("#Profile").onclick = (e) => {
    history.pushState({ page: "#Profile", section: 1 }, "", "/profile")
    e.preventDefault();
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
                </p></div >
                `;
            document.querySelector("#app").innerHTML = profile;
        });
    fetch("/api/postsOfUser")
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                document.querySelector("#app").innerHTML += `<center> <h1>
                    ${data.error}
                </h1></center > `;
            } else {
                let postCard = data.map(
                    (item) =>
                        `
                    <div class="posts" id = "post${item.id}">
      <p class="creator">${item.creator} ${CURRENT_USER === item.creator
                            ? '<a id="edit" onclick="edit(' + item.id + ')">edit</a>'
                            : ""
                        }</p>
      <p class="date">${item.created_at}</p>
      <p class="body">${item.post_body}</p>

      <img onclick="like(${item.id})" class=${item.likes.some((x) => false || x === CURRENT_USER)
                            ? "liked"
                            : "notLiked"
                        } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${item.likes.length}</p>
    </div > `
                );

                document.querySelector(
                    "#app"
                ).innerHTML += `<div class="allPosts"> ${postCard}</div > `;
            }
        });

};
document.querySelector("#Following").onclick = (e) => {
    history.pushState({ page: "#Following", section: 1 }, "", "/following")
    e.preventDefault();
    fetch("/api/following")
        .then((response) => response.json())
        .then((data) => {
            document.querySelector("#app").innerHTML = "";
            if (data.error) {
                document.querySelector("#app").innerHTML += `<center> <h1>
                    ${data.error}
                </h1></center > `;
            } else {
                let postCard = data.map(
                    (item) =>
                        `
                    <div class="posts" id = "post${item.id}">
      <p class="creator">${item.creator} ${CURRENT_USER === item.creator
                            ? '<a id="edit" onclick="edit(' + item.id + ')">edit</a>'
                            : ""
                        }</p>
      <p class="date">${item.created_at}</p>
      <p class="body">${item.post_body}</p>

      <img onclick="like(${item.id})" class=${item.likes.some((x) => false || x === CURRENT_USER)
                            ? "liked"
                            : "notLiked"
                        } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${item.likes.length}</p>
    </div > `
                );

                document.querySelector(
                    "#app"
                ).innerHTML += `<div class="allPosts" > ${postCard}</div > `;
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
    if (!CURRENT_USER) {
        document.querySelector("[href='/login']").click();
    }
    fetch(`/api/posts`)
        .then((response) => response.json())
        .then((data) => {
            fetch(`/api/posts/${id}`, {
                method: "PUT",
                body: JSON.stringify({ ...data }),
            })
                .then((response) => response.json())
                .then(function (data) {
                    document.querySelector(`#post${id} `).innerHTML = `
                    <p class="creator"> 
                    ${data.creator} ${CURRENT_USER === data.creator
                            ? '<a id="edit" onclick="edit(' + data.id + ')">edit</a>'
                            : ""}</p >
      <p class="date">${data.created_at}</p>
      <p class="body">${data.post_body}</p>

      <img onclick="like(${data.id})" class=${data.likes.some((x) => false || x === CURRENT_USER)
                            ? "liked"
                            : "notLiked"
                        } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${data.likes.length}</p>`;
                });
        });
};
edit = (id) => {
    fetch(`/api/posts/ ${id} `)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            document.querySelector(`#post${id}`).innerHTML = `
                <p class="creator"> ${data.creator}
        <a class="cancel">Cancel </a>
        <a class="save">Save</a>
        </p >
      <p class="date">${data.created_at}</p>
     <textarea class="body" id="edit" value=""></textarea>
      <img onclick="like(${data.id})" class=${data.likes.some((x) => false || x === CURRENT_USER)
                    ? "liked"
                    : "notLiked"
                } 
    src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${data.likes.length}</p>`;
            document.querySelector("#edit").value = data.post_body;
            document.querySelector("a.cancel").onclick = () => {
                document.querySelector(`#post${id} `).innerHTML = `
                < p class="creator" > ${data.creator}
        <a class="cancel">Cancel </a>
        <a class="save">Save</a>
        </p >
      <p class="date">${data.created_at}</p>
     <textarea class="body" id="edit" value=""></textarea>
      <img onclick="like(${data.id})" class=${data.likes.some((x) => false || x === CURRENT_USER)
                        ? "liked"
                        : "notLiked"
                    } 
    src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${data.likes.length}</p>`;
            };
            document.querySelector("a.save").onclick = () => {
                fetch(`/api/edit/${id} `, {
                    method: "PUT",
                    body: JSON.stringify({
                        post_body: document.querySelector("#edit").value,
                    }),
                })
                    .then((response) => response.json())
                    .then(function (data) {
                        document.querySelector(`#post${id}`).innerHTML = `
                <p class="creator"> ${data.creator} ${CURRENT_USER === data.creator
                                ? '<a id="edit" onclick="edit(' + data.id + ')">edit</a>'
                                : ""
                            }</p >
      <p class="date">${data.created_at}</p>
      <p class="body">${data.post_body}</p>

      <img onclick="like(${data.id})" class=${data.likes.some((x) => false || x === CURRENT_USER)
                                ? "liked"
                                : "notLiked"
                            } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${data.likes.length}</p>`;
                    });
            };
        });
};
pagination = (e) => {
    if (e.id === "Next") {
        history.replaceState({ ...history.state, section: history.state.section + 1 }, "Next")
        console.log(history.state)
        document.querySelector(`${history.state.page}`).click()
    }
    else {
        history.replaceState({ ...history.state, section: history.state.section - 1 }, "Previous")
        console.log(history.state)
        document.querySelector(`${history.state.page}`).click()
    }

}
