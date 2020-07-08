document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const isFromFavorite = urlParams.get("favorite");
    const idParam = urlParams.get("id");

    const btnFavorite = document.getElementById("favorite");
    const btnRemove = document.getElementById("remove");
    const arrowBack = document.getElementById("arrow-back");
    const buttonArea = document.getElementById("button-area");

    // Hide buttonArea
    buttonArea.style.display = "none";
    
    let item;
    
    // Check in indexed DB
    getById(idParam).then(function(result) {
        // If founded in indexed DB
        if (result) {
            // Hide favorite button and show remove button
            btnFavorite.style.display = "none";
            btnRemove.style.display = "block";
        }
        else {
            // Hide remove button and show favorite button
            btnFavorite.style.display = "block";
            btnRemove.style.display = "none";
        }
    })
    
    if (isFromFavorite) {
        // Change href of arrow back
        arrowBack.setAttribute("href", "./index.html#favorite")
        item = getFavoriteStandingById();
    } else {
        item = getStandingById();
    }
    
    btnFavorite.onclick = () => {
        btnFavorite.style.display = "none";
        btnRemove.style.display = "block";
        console.log("Favorite clicked");
        item.then(function(standing) {
            saveToFavorite(standing);
        });
    }

    btnRemove.onclick = () => {
        btnFavorite.style.display = "block";
        btnRemove.style.display = "none";
        console.log("Remove clicked");
        removeFromFavorite(idParam);
    }
});