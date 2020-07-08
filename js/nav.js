function loadPage(page) {    
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
            const content = document.querySelector("#body-content");
            if (this.status === 200) {
                content.innerHTML = xhr.responseText;
                if (page === "home") {
                    getLeague();
                }
                else if (page === "favorite") {
                    getFavoriteStandings();
                }
            } else if (this.status === 404) {
                content.innerHTML = "<h5><b>OOPS!!</b> The page you're trying to reach doesn't seem to exist.</h5>";
            } else {
                content.innerHTML = "<h5><b>OOPS!!</b> The page cannot be accessed.</h5>";
            }
        }
    };
    xhr.open("GET", "pages/" + page + ".html", true);
    xhr.send();
}

document.addEventListener("DOMContentLoaded", function() {
    const sidenavElement = document.querySelectorAll(".sidenav");
    M.Sidenav.init(sidenavElement);
    loadNav();

    function loadNav () {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if(this.readyState === 4) {
                if(this.status !== 200) return;

                // Load menu
                document.querySelectorAll(".topnav, .sidenav").forEach(elm => {
                    elm.innerHTML = xhr.responseText;
                });

                // Set event listener for every menu
                document.querySelectorAll(".sidenav a, .topnav a").forEach(elm => {
                    elm.addEventListener("click", function(event) {
                        // Close Sidenav
                        const sidenav = document.querySelector(".sidenav");
                        M.Sidenav.getInstance(sidenav).close();

                        // Load page content when called
                        const page = event.target.getAttribute("href").substr(1);
                        loadPage(page);
                    });
                });
            }
        };
        xhr.open("GET", "nav.html", true);
        xhr.send();
    }

    // Load page content
    let page = window.location.hash.substr(1);
    if (page === "") page = "home";
    loadPage(page);
});