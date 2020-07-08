const base_url = "https://api.football-data.org/v2/";
const API_KEY = "43c5599d14b4447a96b1493a0483084a";

// Code for fetch
function fetchApi(url) {
    return fetch(base_url + url, {
        headers: {
            "X-Auth-Token": API_KEY
        }
    })
}

// If the fetch successful
function status(response) {
    if (response.status !== 200) {
        console.log("Error: " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
};

// Code for parsing json to array Javascript
function json(response) {
    console.log(response);
    return response.json();
};

// Code for error handling
function error(error) {
    console.log("Error: " + error);
};

// Code for hiding loader
function hideLoader() {
    const loader = document.getElementById("loader");
    loader.style.display = "none";
};

// Code for showing button area in standing.html
function showButtonArea() {
    const buttonArea = document.getElementById("button-area");
    buttonArea.style.display = "block";
};

// Code for replace underscore with space
function replaceString(word) {
    return word.replace("_", " ");
}

// Code for replace http with https
function replaceUrl(url) {
    return url.replace("http://", "https://");
}

// Code for processing available league to HTML
function processLeagueToHtml(data) {
    hideLoader();
    let leagueHTML = "<table><tbody>"
    data.competitions.forEach(competition => {
        const {id, name, code} = competition;
        leagueHTML += `
            <tr>
                <td><img src="./images/${code}.png" alt="League's photo" class="responsive-image league-pict"></td>
                <td>${name}</td>
                <td>
                    <a href="./standing.html?id=${id}" class="btn waves-effect block-action">Standing</a>
                    <a href="./schedule.html?id=${id}" class="btn waves-effect block-action">Schedule</a>
                </td>
            </tr>
        `;
    });
    leagueHTML += "</tbody></table>"
    document.getElementById("league-list").innerHTML = leagueHTML;
};

// Code for requesting json data for available league in TIER_ONE 
function getLeague() {
    let isInCache = false;

    // Check cache
    if ("caches" in window) {
        caches.match(base_url + "competitions?plan=TIER_ONE").then(function(response) {
            if (response) {
                isInCache = true;
                response.json().then(data => {
                    processLeagueToHtml(data);
                    console.log("cache")
                })
            }
        });
    }
    
    fetchApi("competitions?plan=TIER_ONE")
        .then(status)
        .then(json)
        .then(processLeagueToHtml)
        .catch(errorMessage => {
            error(errorMessage);
            if (!isInCache) {
                hideLoader();
                M.toast({html: "App is offline", classes: "rounded"});
            }
        })
};

// Code for building standing table
function buildStandingTable(table) {
    let tableHTML = "";
    tableHTML += `
        <table class="responsive-table centered striped">
            <thead>
                <tr>
                    <th>POS</th>
                    <th>TEAMS</th>
                    <th>M</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>PTS</th>
                </tr>
            </thead>
            <tbody>
    `;
    table.forEach(club => {
        const teamLogo = club.team.crestUrl || "./images/bola.png";
        const {position, team, playedGames, won, draw, lost, goalsFor, goalsAgainst, goalDifference, points} = club;
        tableHTML += `
            <tr>
                <td>${position}</td>
                <td>
                    <img src=${replaceUrl(teamLogo)} alt="Team's logo" class="responsive-image team-logo" onerror='this.onerror = null; this.src="./images/bola.png"'>
                    &nbsp;${team.name}
                </td>
                <td>${playedGames}</td>
                <td>${won}</td>
                <td>${draw}</td>
                <td>${lost}</td>
                <td>${goalsFor}</td>
                <td>${goalsAgainst}</td>
                <td>${goalDifference}</td>
                <td>${points}</td>
            </tr>
        `;
    });
    tableHTML += `</tbody></table>`;
    return tableHTML;
};

// Code for processing standing data to group table
function processStandingToTable(data) {
    hideLoader();
    showButtonArea();
    const leagueName = data.competition.name;
    const standingsData = data.standings;
    const {stage} = standingsData[0];
    tableHTML = `
        <h5>${leagueName}</h5>
        <h6>${replaceString(stage)}</h6>
    `;
    if (standingsData.length > 1) {
        // If there are more than 1 group
        standingsData.forEach(item => {
            tableHTML += `
                <div class="divider"></div>
                <h6>${replaceString(item.group)}</h6>
            `;
            tableHTML += buildStandingTable(item.table);
        });
    } else {
        tableHTML += buildStandingTable(standingsData[0].table);
    }
    document.getElementById("body-content").innerHTML = tableHTML;
};

// Code for requesting json data for standings in selected league
function getStandingById() {
    return new Promise(function(resolve, reject) {
        let isInCache = false;

        // Get parameter id's value
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get("id");
    
        // Check cache
        if ("caches" in window) {
            caches.match(base_url + "competitions/" + idParam + "/standings?standingType=TOTAL").then(function(response) {
                if (response) {
                    isInCache = true;
                    response.json().then(function(data) {
                        processStandingToTable(data);
                        resolve(data);
                    })
                }
            });
        }

        fetchApi("competitions/" + idParam + "/standings?standingType=TOTAL")
            .then(status)
            .then(json)
            .then(function(data) {
                processStandingToTable(data);
                resolve(data);
            })
            .catch(errorMessage => {
                error(errorMessage);
                if (!isInCache) {
                    hideLoader();
                    M.toast({html: "App is offline", classes: "rounded"});
                }
            })
    });
};

// Code for processing schedule data
function processScheduleData(data) {
    hideLoader();
    const leagueName = data.competition.name;
    scheduleHTML = `<h5>${leagueName}</h5>`;
    if (data.matches.length > 0) {
        scheduleHTML += `
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Home Team</th>
                        <th>Away Team</th>
                    </tr>
                </thead>
                <tbody>
        `;
        data.matches.forEach(match => {
            const dateObj = new Date(match.utcDate);
            const date = dateObj.toDateString();
            const time = dateObj.toTimeString();
            scheduleHTML += `
                <tr>
                    <td>${date}</td>
                    <td>
                        ${time.substring(0,8)}
                        <br>
                        ${time.substring(18)}
                    </td>
                    <td>${match.homeTeam.name}</td>
                    <td>${match.awayTeam.name}</td>
                </tr>
            `;
        })
        scheduleHTML += "</tbody></table>"
    } else {
        scheduleHTML += `<h6>No Scheduled Match</h6>`
    }
    document.getElementById("body-content").innerHTML = scheduleHTML;
};

// Code for requesting json data for schedules in selected league
function getScheduleById() {
    return new Promise(function(resolve, reject) {
        let isInCache = false;

        // Get parameter id's value
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get("id");
    
        // Check cache
        if ("caches" in window) {
            caches.match(base_url + "competitions/" + idParam + "/matches?status=SCHEDULED").then(function(response) {
                if (response) {
                    isInCache = true;
                    response.json().then(function(data) {
                        processScheduleData(data);
                        resolve(data);
                    })
                }
            });
        }
        
        fetchApi("competitions/" + idParam + "/matches?status=SCHEDULED")
            .then(status)
            .then(json)
            .then(function(data) {
                processScheduleData(data);
                resolve(data);
            })
            .catch(errorMessage => {
                error(errorMessage);
                if (!isInCache) {
                    hideLoader();
                    M.toast({html: "App is offline", classes: "rounded"});
                }
            })
    });
};

// Code for processing favorite data
function processFavoriteStanding(data) {
    const {id, name, code} = data.competition;
    const standingHTML = `
        <tr>
            <td><img src="./images/${code}.png" alt="League's photo" class="responsive-image league-pict"></td>
            <td>${name}</td>
            <td><a href="./standing.html?id=${id}&favorite=true" class="btn waves-effect block-action"><b>See Standing</b></a></td>
        </tr>
    `;
    return standingHTML;
};

// Code for requesting favorite standings from indexed DB
function getFavoriteStandings() {
    let favoriteHTML = "";
    getAll().then(function(standings) {
        if (standings.length > 0) {
            favoriteHTML += "<table><tbody>"
            standings.forEach(function(standing) {
                favoriteHTML += processFavoriteStanding(standing);
            })
            favoriteHTML += "</tbody></table>"
        }
        else {
            favoriteHTML += `
                <h5>No favorite standing...</h5>
                <p>Try to add some standing as your favorite</p>
            `
        }
        hideLoader();
        document.getElementById("favorite-list").innerHTML = favoriteHTML;
    })
};

// Code for requesting standing of favorite league from indexed DB
function getFavoriteStandingById() {
    return new Promise(function(resolve, reject) {
        const urlParams = new URLSearchParams(window.location.search);
        const idParam = urlParams.get("id");

        getById(idParam).then(function(data) {
            processStandingToTable(data);
            resolve(data);
        })
    })
}