var CURRENT_USER = null;
var edited = -1;
var interval = setInterval(function () { }, 1000);
document.addEventListener("DOMContentLoaded", function () {

    fetch("/api/whoCurrentUser")
        .then((response) => response.json())
        .then((data) => {
            if (data.USERNAME) {
                CURRENT_USER = data;
            }
        }).then(function () {
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
    like = (id) => {
        /*
                 “Like” and “Unlike”:
                 Users should be able to click a button or link on any post to toggle whether or not they “like” that post.
                 Using JavaScript, you should asynchronously let the server know to update the like count (as via a call to fetch) and
                 then update the post’s like count displayed on the page, without requiring a reload of the entire page.
             */
        if (!CURRENT_USER.USERNAME) {
            document.querySelector("[href='/login']").click();
        }
        console.log(id)
        fetch(`/api/posts/${id}`, {
            method: "PUT",
        })
            .then((response) => response.json())
            .then(function (data) {
                document.querySelector(`#post${id} `).innerHTML = `
                    <p class="creator"> 
                    ${data.creator.username} ${CURRENT_USER.USERNAME === data.creator.username
                        ? '<a id="edit" onclick="edit(' + data.id + ')">edit</a>'
                        : ""}</p >
      <p class="date">${data.created_at}</p>
      <p class="body">${data.post_body}</p>

      <img onclick="like(${data.id})" class=${data.likes.some((x) => false || x === CURRENT_USER.USERNAME)
                        ? "liked"
                        : "notLiked"
                    } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${data.likes.length}</p>`;
            });
    }
    edit = (id) => {
        if (edited === -1) {
            edited = id
        }
        else {
            document.querySelector(`#post${edited} .cancel`).click()
            edited = id
        }
        fetch(`/api/posts/${id} `)
            .then((response) => response.json())
            .then((item) => {
                document.querySelector(`#post${id}`).innerHTML = `
                <p class="creator"> ${item.creator.username}
        <a class="cancel">Cancel </a>
        <a class="save">Save</a>
        </p >
      <p class="date">${item.created_at}</p>
     <textarea class="body" id="edit" value=""></textarea>
      <img onclick="like(${item.id})" class=${item.likes.some((x) => false || x === CURRENT_USER.USERNAME)
                        ? "liked"
                        : "notLiked"
                    } 
    src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${item.likes.length}</p>`;
                document.querySelector("textarea#edit").value = item.post_body;

                document.querySelector("a.cancel").onclick = () => {
                    document.querySelector(`#post${item.id} `).innerHTML = `
         <p class="creator">${item.creator.username}

         ${CURRENT_USER.USERNAME === item.creator.username
                            ? '<a id="edit" onclick="edit(' + item.id + ')">edit</a>'
                            : ""
                        }</p>
         <p class="date">${item.created_at}</p>
         <p class="body">${item.post_body}</p>

         <img onclick="like(${item.id})" class=${item.likes.some((x) => false || x === CURRENT_USER.USERNAME)
                            ? "liked"
                            : "notLiked"
                        } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
         <p>Likes ${item.likes.length}</p>`;
                    edited = -1;
                };
                document.querySelector("a.save").onclick = () => {
                    fetch(`/api/edit/${id} `, {
                        method: "PUT",
                        body: JSON.stringify({
                            post_body: document.querySelector("textarea#edit").value,
                        }),
                    })
                        .then((response) => response.json())
                        .then(function (item) {
                            document.querySelector(`#post${id}`).innerHTML = `
                <p class="creator"> ${item.creator.username} ${CURRENT_USER.USERNAME === item.creator.username
                                    ? '<a id="edit" onclick="edit(' + item.id + ')">edit</a>'
                                    : ""
                                }</p >
      <p class="date">${item.created_at}</p>
      <p class="body">${item.post_body}</p>

      <img onclick="like(${item.id})" class=${item.likes.some((x) => false || x === CURRENT_USER.USERNAME)
                                    ? "liked"
                                    : "notLiked"
                                } src="https://img.icons8.com/external-justicon-flat-justicon/64/000000/external-like-notifications-justicon-flat-justicon.png"/>
      <p>Likes ${item.likes.length}</p>`;
                            edited = -1;
                        });
                };
            });
    };
    pagination = (e) => {
        if (e.id === "Next") {
            history.replaceState({ ...history.state, section: history.state.section + 1 }, "Next")
            document.querySelector(`${history.state.page}`).click()
        }
        else {
            history.replaceState({ ...history.state, section: history.state.section - 1 }, "Previous")
            document.querySelector(`${history.state.page}`).click()
        }

    }
    follow = (id) => {
        console.log(id)
        fetch(`/api/followUser/${id}`, { method: "POST" })
            .then(response => response.json())
            .then(function (data) {
                console.log(data)
                let profile = `
            <div>
            <p id="name">
                ${data.user}
                </p>
                <button id="Follow" onclick="follow(${id})" class="btn ${data.followed_data.some((x) => false || x === CURRENT_USER.ID) ? "btn-danger" : "btn-primary"}">
                ${data.followed_data.some((x) => false || x === CURRENT_USER.ID) ? "UnFollow" : "Follow"}
                </button>
                </div>
                <div class="Follow_block">
                <div>
                <p>Following
                ${data.following}
                </p>
                </div>
                <div>
                <p>Followed
                ${data.followed}
                </p>
                </div>
                </div>
                `;
                document.querySelector("#UserProfile").innerHTML = profile;


            })
    }
    user = (id) => {
        clearInterval(interval)
        if (CURRENT_USER && id === CURRENT_USER.ID) {
            document.querySelector("#Profile").click()
        }
        else {
            history.pushState({ page: `${id}`, section: 1 }, "", "/")

            fetch(`/api/userProfile/${id}`).then(response => response.json()).then(function (data) {
                document.querySelector("#app").innerHTML = "";
                document.querySelector("#pagination").innerHTML = "";
                let profile = `<div class="posts Profile" id="UserProfile">
            <div>
            <p id="name">
                ${data.user}
                </p>
                <button onclick="follow(${id})" class="btn ${data.following_data.some((x) => false || x === CURRENT_USER.ID) ? "btn-danger" : "btn-primary"}">
                ${data.following_data.some((x) => false || x === CURRENT_USER.ID) ? "UnFollow" : "Follow"}
                </button>
                </div>
                <div class="Follow_block">
                <div>
                <p>Following
                ${data.following}
                </p>
                </div>
                <div>
                <p>Followed
                ${data.followed}
                </p>
                </div>
                </div></div >
                `;
                document.querySelector("#app").innerHTML = profile;
                document.querySelector("#Follow").onclick = follow(id)


            });
            fetch(`/api/postsOfUser/${id}/${history.state.section}`).then(response => response.json()).then(function (data) { load(data) })
        }
    }
    load = (data) => {
        console.log(data)
        document.querySelector("#pagination").innerHTML = ""
        let postCard = data.data.map(
            (item) =>
                `
       <div class="posts" id="post${item.id}">
         <p class="creator" onclick="user(${item.creator.id})">${item.creator.username}

         ${CURRENT_USER.USERNAME === item.creator.username
                    ? '<a id="edit" onclick="edit(' + item.id + ')">edit</a>'
                    : ""
                }</p>
         <p class="date">${item.created_at}</p>
         <p class="body">${item.post_body}</p>

         <img onclick="like(${item.id})" class=${item.likes.some((x) => false || x === CURRENT_USER.USERNAME)
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
    }
});
document.querySelector("#AllPosts").onclick = (e) => {
    clearInterval(interval)

    if (window.location.pathname === "/") {
        e.preventDefault();

    }

    if (history.state === null || history.state.section === 1) {
        history.pushState({ page: "#AllPosts", section: 1 }, "", "/")
    }
    if (CURRENT_USER.USERNAME !== null) {

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
        document.querySelector("form.allPosts").onsubmit = (e) => {
            e.preventDefault();
            fetch(`/api/posts`, {
                method: "POST",
                body: JSON.stringify({ post_body: e.target[0].value }),
            })
                .then((response) => response.json())
                .then((data) => (e.target[0].value = ""));
        };


    }

    fetch(`/api/postsID/${history.state.section}`)
        .then((response) => response.json())
        .then((data) => {

            load(data);
            if (CURRENT_USER.USERNAME !== null) {

                document.querySelector("form.allPosts").onsubmit = (e) => {
                    e.preventDefault();
                    fetch(`/api/posts`, {
                        method: "POST",
                        body: JSON.stringify({ post_body: e.target[0].value }),
                    })
                        .then((response) => response.json())
                        .then((data) => (e.target[0].value = ""));
                };
            }
        })

};

document.querySelector("#Profile").onclick = (e) => {
    e.preventDefault();
    if (history.state === null || history.state.section === 1)
        history.pushState({ page: "#Profile", section: 1 }, "", "/profile")
    fetch("/api/profile")
        .then((response) => response.json())
        .then((data) => {
            document.querySelector("#app").innerHTML = "";
            document.querySelector("#pagination").innerHTML = "";
            let profile = `<div class="posts Profile">
            <p id="name">
                ${data.user}
                </p>
                <div class="Follow_block">
                <div>
                <p>Following
                ${data.following}
                </p>
                </div>
                <div>
                <p>Followed
                ${data.followed}
                </p>
                </div>
                </div></div >
                `;
            document.querySelector("#app").innerHTML = profile;
        });
    fetch(`/api/postsOfUser/${CURRENT_USER.ID}/${history.state.section}`)
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                document.querySelector("#app").innerHTML += `<center> <h1>
                    ${data.error}
                </h1></center > `;
            } else {

                load(data)

            }
        });

};
document.querySelector("#Following").onclick = (e) => {
    clearInterval(interval)
    e.preventDefault();
    if (history.state === null || history.state.section === 1)
        history.pushState({ page: "#Following", section: 1 }, "", "/following")

    interval = setInterval(function () {
        fetch(`/api/following/${history.state.section}`)
            .then((response) => response.json())
            .then((data) => {
                document.querySelector("#app").innerHTML = "";
                document.querySelector("#pagination").innerHTML = "";
                if (data.error) {
                    document.querySelector("#app").innerHTML += `<center> <h1>
                    ${data.error}
                </h1></center > `;
                } else {
                    load(data);
                }
            });
    }, 1000)
};
