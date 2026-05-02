window.addEventListener("load", starting);

async function starting(){
    await readData();
    await readUserDetails();
    checkforUserDetails();
    console.log("User details: ", userDetailsData);
}