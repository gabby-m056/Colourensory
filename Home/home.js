window.addEventListener("load", checkUserName);
const nameInput = document.getElementById("name-input");
const submitNameBtn = document.getElementById("submit-name-button");
const main = document.querySelector("main");
submitNameBtn.addEventListener("click", addUserName);


function checkUserName(){
    starting();
    findUserDetails();
    const hello = document.getElementById("hello");
    console.log("Checking for user name in user details: ", userDetailsData);
    if(userDetailsData !== null && userDetailsData.UserName !== null){
        removeNameInput();
        addStartButton();
        
        hello.textContent = "Hello " + userDetailsData.UserName + "!";
    }
    else{
        let placeholderName = "User";
        hello.textContent = "Hello " + placeholderName + "!";

    }
}
function addUserName(){
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

function addStartButton(){
    
    main.innerHTML +=`<section id="welcome-back-user">
    <label id="get-started-label" for="get-started">Time to Experiment and Play with Colour!</label><br>
    <a href="../Play/play.html" name="get-started" id="get-started-button" class="btn btn-primary cta-buttons" role="button">
    Let\'s Play!</a></section>`
}