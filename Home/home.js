const main = document.querySelector("main");
window.addEventListener("load", checkUserName);
//window.addEventListener("finished",loadingComplete())
const nameInput = document.getElementById("name-input");
const submitNameBtn = document.getElementById("submit-name-button");

submitNameBtn.addEventListener("click", addUserName);



function checkUserName(){
    
    findUserDetails();
    const hello = document.getElementById("hello");
    console.log("Checking for user name in user details: ", userDetailsData);
    if(userDetailsData !== null && userDetailsData.UserName !== null){
        loading();
        hello.textContent = "Hello " + userDetailsData.UserName + "!";
        removeNameInput();
        continueLoad().then(function(result){
            console.log("complete load", result);
            loadingComplete();
        })
        
        
        
        //console.log("test ", userDetailsData.UserName)
        
    }
    else{
        starting();
        let placeholderName = "User";
        hello.textContent = "Hello " + placeholderName + "!";


    }
}

function loadingComplete(){
    console.log("reached");
    removeLoading();
    addStartButton();
    
}
function addUserName(){
    console.log("add username",userDetailsData);
    newUserDetailsData = {
        UserID: userDetailsData.UserID,
        UserName: nameInput.value,
    }
    localStorage.removeItem(USER_DETAILS);
    localStorage.setItem(USER_DETAILS, JSON.stringify(newUserDetailsData));
    checkUserName();
}

function removeNameInput(){
    
    const nameElements = document.getElementById("first-time-user");
    /*for(let element of nameElements){
        main.removeChild(element);
    }*/
    main.removeChild(nameElements);
}

function loading(){
    main.innerHTML+= `<section id="loading-section">
                <div class="spinner-border start-spinner align-self-center" id="starting-spinner" role="status">
                <span class="visually-hidden">Loading...</span>
                 </div>
                 
                <h2 id="loading-text">Loading...</h2>
            </section>`;

    
    
}

function removeLoading(){
    let loadingSection = document.getElementById("loading-section");
    main.removeChild(loadingSection);
}

function addStartButton(){
    
    main.innerHTML +=`<section id="welcome-back-user">
    <label id="get-started-label" for="get-started">Time to Experiment and Play with Colour!</label><br>
    <a href="../Play/play.html" name="get-started" id="get-started-button" class="btn btn-primary cta-buttons" role="button">
    Let\'s Play!</a></section>`
}