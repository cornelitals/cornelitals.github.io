window.onhashchange = function() {
    let page = window.location.hash.substr(1);
    if (page === "") {
        page = "home";
        loadPage(page);
    }
}