const dbPromised = idb.open("football-league", 1, function(upgradeDb) {
    const standingsObjectStore = upgradeDb.createObjectStore("standings", {
        keyPath: "competition.id"
    });
    standingsObjectStore.createIndex("league_name", "competition.name");
});

function saveToFavorite(standing) {
    dbPromised
        .then(function(db) {
            const tx = db.transaction("standings", "readwrite");
            const store = tx.objectStore("standings");
            store.add(standing);
            return tx.complete;
        })
        .then(function() {
            console.log("Saved to favorite");
            M.toast({html: "Added to favorite", classes: "rounded"});
        });
};

function removeFromFavorite(id) {
    dbPromised
        .then(function(db) {
            const tx = db.transaction("standings", "readwrite");
            const store = tx.objectStore("standings");
            store.delete(parseInt(id));
            return tx.complete;
        })
        .then(function() {
            console.log("Removed from favorite");
            M.toast({html: "Removed from favorite", classes: "rounded"});
        });
};

function getAll() {
    return new Promise(function(resolve, reject) {
        dbPromised
            .then(function(db) {
                const tx = db.transaction("standings", "readonly");
                const store = tx.objectStore("standings");
                return store.getAll();
            })
            .then(function(standings) {
                resolve(standings);
            })
    });
};

function getById(id) {
    return new Promise(function(resolve, reject) {
        dbPromised
        .then(function(db) {
            const tx = db.transaction("standings", "readonly");
            const store = tx.objectStore("standings");
            return store.get(parseInt(id));
        })
        .then(function(standing) {
            resolve(standing);
        });
    });
};