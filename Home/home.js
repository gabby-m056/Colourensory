function newUser(){
    // Check if user details are already stored in localStorage
    let jsonUserDetails = localStorage.getItem(USER_DETAILS);
    if(jsonUserDetails===null){
        //should have read in by now
    }

    let userDetails = JSON.parse(jsonUserDetails);
    console.log("User details: ", userDetails);
}