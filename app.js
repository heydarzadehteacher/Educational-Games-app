function createGameCard(game){

    const favorites = JSON.parse(
        localStorage.getItem("favorites")
    ) || [];


    const isFavorite = favorites.some(
        item => item.id === game.id
    );


    return `

    <div class="game-card">


       <div class="game-cover">

    <span class="game-icon">
        ${game.icon}
    </span>

    <span class="game-grade">
        🎓 ${game.grades.join("، ")}
    </span>

</div>



        <div class="game-info">


            <h3>

                ${game.title}

            </h3>


            <p>

                🎓 ${game.grades.join("، ")}

            </p>


        </div>



        <div class="game-actions">


            <button 
            class="start-btn"
            onclick="openGame('${game.id}','${game.link}','${game.title}','${game.icon}')">

                ▶ شروع

            </button>



            <span 
            class="favorite-btn ${isFavorite ? "active" : ""}"
            onclick="toggleFavorite(${game.id})">

                ${isFavorite ? "★" : "☆"}

            </span>


        </div>


    </div>

    `;

}


function createMiniGameCard(game){

    return `

    <div class="mini-game-card">

        ${game.icon}

        <p>
            ${game.title}
        </p>

    </div>

    `;

}





function showGames(gameList){

    let cards = "";


    if(gameList.length === 0){


        cards = `

        <div class="game-card">


            <div class="game-cover">

                🎮

            </div>



            <div class="game-info">


                <h3>

                    به‌زودی اضافه می‌شود

                </h3>



                <p>

                    🌱 بازی‌های آموزشی این پایه در حال آماده‌سازی است.

                </p>


            </div>


        </div>

        `;


    }


    else{


        gameList.forEach(game=>{

            cards += createGameCard(game);

        });


    }



    document.querySelector(".games-container").innerHTML = cards;


}







function showNewGames(){


    const container = document.querySelector(".new-games-container");


    if(!container) return;



    const newGames = games.filter(game => game.isNew);



    let html = "";



    newGames.forEach(game=>{


        html += createMiniGameCard(game);


    });



    container.innerHTML = html;


}


function showFavorites(){

    const container = document.querySelector(".favorites-container");


    if(!container) return;



    const favorites = JSON.parse(

        localStorage.getItem("favorites")

    ) || [];



    if(favorites.length === 0){


        container.innerHTML = `

        <div class="mini-game-card">

            ⭐

            <p>
                هنوز بازی مورد علاقه‌ای انتخاب نشده
            </p>

        </div>

        `;


        return;

    }



    let html = "";



    favorites.forEach(game=>{


        html += createMiniGameCard(game);


    });



    container.innerHTML = html;


}





function showRecentGames(){


    const container = document.querySelector(".recent-container");


    if(!container) return;



    const recentGames = JSON.parse(

        localStorage.getItem("recentGames")

    ) || [];



    if(recentGames.length === 0){


        container.innerHTML = `

        <div class="mini-game-card">


            🎮


            <p>

                هنوز بازی‌ای اجرا نشده

            </p>


        </div>

        `;


        return;


    }




    let html = "";



    recentGames.forEach(game=>{


        html += createMiniGameCard(game);


    });



    container.innerHTML = html;


}








function openGame(id,link,title,icon){



    let recentGames = JSON.parse(

        localStorage.getItem("recentGames")

    ) || [];

// افزایش تعداد بازی‌های انجام شده

let playedCount = Number(
    localStorage.getItem("playedCount")
) || 0;


playedCount++;


localStorage.setItem(
    "playedCount",
    playedCount
);

// ثبت تعداد اجرای هر بازی

let gameStats = JSON.parse(
    localStorage.getItem("gameStats")
) || {};


if(gameStats[id]){

    gameStats[id]++;

}
else{

    gameStats[id] = 1;

}


localStorage.setItem(
    "gameStats",
    JSON.stringify(gameStats)
);


    recentGames = recentGames.filter(

        game=>game.title !== title

    );



    recentGames.unshift({

        title:title,

        icon:icon

    });



    recentGames = recentGames.slice(0,5);



    localStorage.setItem(

        "recentGames",

        JSON.stringify(recentGames)

    );



    showRecentGames();



    if(link){

        window.location.href = link;

    }


}









function toggleFavorite(id){



    let favorites = JSON.parse(

        localStorage.getItem("favorites")

    ) || [];




    const game = games.find(

        item => item.id === id

    );




    const exists = favorites.some(

        item => item.id === id

    );




    if(exists){


        favorites = favorites.filter(

            item => item.id !== id

        );


    }


    else{


        favorites.push(game);


    }



    localStorage.setItem(

        "favorites",

        JSON.stringify(favorites)

    );



    const activeGrade = document.querySelector(".grade-btn.active");


showGames(

    activeGrade

    ? games.filter(game =>

        game.gradeIds.includes(

            Number(activeGrade.dataset.grade)

        )

    )

    : games

);

showFavoriteCount();

showFavorites();

}









showGames(games);

showRecentGames();

showNewGames();

showFavorites();









// =========================
// فیلتر بر اساس پایه
// =========================



const gradeButtons = document.querySelectorAll(".grade-btn");



gradeButtons.forEach(button=>{


    button.addEventListener("click",function(){



        const wasActive = this.classList.contains("active");




        gradeButtons.forEach(btn=>{


            btn.classList.remove("active");


        });




        if(wasActive){


            showGames(games);


            return;


        }




        this.classList.add("active");




        const selectedGrade = this.dataset.grade;




if(selectedGrade==="other"){


    const filteredGames = games.filter(game =>

        game.gradeIds.includes("other")

    );


    showGames(filteredGames);


}

else{


    const filteredGames = games.filter(game =>


        game.gradeIds.includes(

            Number(selectedGrade)

        )


    );


    showGames(filteredGames);


}



    });



});

// =========================
// ثبت نام پروفایل
// =========================


function setupProfile(){


    const nameButton = document.querySelector(".name-btn");

    const profileTitle = document.querySelector(".profile-info h3");


    if(!nameButton || !profileTitle) return;



    const savedName = localStorage.getItem("profileName");



    if(savedName){

        profileTitle.innerHTML = 
        `سلام، ${savedName} 🌱`;

        nameButton.innerHTML = 
        "✍️ ثبت نام";

    }



    nameButton.addEventListener("click",function(){



        const name = prompt(
            "نام خود را وارد کنید:"
        );



        if(name && name.trim() !== ""){


            localStorage.setItem(
                "profileName",
                name.trim()
            );


            profileTitle.innerHTML =
            `سلام، ${name.trim()} 🌱`;


            nameButton.innerHTML =
            "✍️ ثبت نام";


        }


    });



}



setupProfile();

// نمایش تعداد بازی‌های انجام شده

function showPlayedCount(){

    const countElement = document.querySelector("#played-count");

    if(!countElement) return;


    const playedCount = localStorage.getItem("playedCount") || 0;


    countElement.innerHTML = playedCount;

}


showPlayedCount();

// نمایش تعداد بازی‌های مورد علاقه

function showFavoriteCount(){

    const countElement = document.querySelector("#favorite-count");

    if(!countElement) return;


    const favorites = JSON.parse(
        localStorage.getItem("favorites")
    ) || [];


    countElement.innerHTML = favorites.length;

}


showFavoriteCount();

// نمایش پرتکرارترین بازی‌ها

function showPopularGames(){

    const container = document.querySelector("#popular-games");

    if(!container) return;


    const gameStats = JSON.parse(
        localStorage.getItem("gameStats")
    ) || {};


    const sortedGames = Object.entries(gameStats)
        .sort((a,b)=> b[1] - a[1])
        .slice(0,5);



    if(sortedGames.length === 0){

        container.innerHTML =
        "هنوز اطلاعاتی ثبت نشده";

        return;

    }



    let html = "";



    sortedGames.forEach(item=>{


        const game = games.find(
            game => game.id == item[0]
        );


        if(game){

            html += `
            
            <div class="popular-item">
            
                ${game.icon}
                ${game.title}
                (${item[1]} بار)

            </div>
            
            `;

        }


    });



    container.innerHTML = html;


}



showPopularGames();

function showProfileMessage(){
    alert("این بخش برای مدیریت چند پروفایل طراحی شده است و در نسخه‌های آینده فعال خواهد شد.");
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js")
        .then(() => {
            console.log("Service Worker فعال شد");
        })
        .catch(error => {
            console.log("خطا در فعال‌سازی Service Worker:", error);
        });
    });
}
