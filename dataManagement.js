const USER_EXPERIMENTS_TABLE = "User_Experiments";
const DROP_TABLE = "Experiment_Drops";
const USER_DETAILS_TABLE = "User_Details";
const REMOTEDB_URL="https://script.google.com/macros/s/AKfycbzum4SuXwJgPwB9F_rMWUCM9MgcQiZAwJ90n_Fa93iOqCT70V8tjNPPiWVgzuGNM6flvA/exec"
let isExistingExperiment = false;
/*To be set to true when the website needs data functionality, 
such as saving/loading experiments and users.
Avoids using unnecessary storage/running unneeded API calls when not needed, 
such as when just using the canvas drawing features.*/
let dataBeingUsed = false;
let currentData = null;
let latestValues;
let saveToDB = false;
const USER_ID="UserID";
const EXPERIMENT_ID="ExperimentID";
const USER_DETAILS="UserDetails";


async function readData(){

    try{
        const response = await fetch(`${REMOTEDB_URL}?table=${USER_EXPERIMENTS_TABLE}`);
        const jsonData = await response.json();
        currentData = JSON.parse(data.data);
        latestValues = currentData[currentData.length - 1];
        console.log(data);
        console.log("Current Data: ", currentData);
       
    }
    catch (e) {
        console.error("Error fetching data:", e);
    }

}

async function readUserDetails(){
    try{
        const response = await fetch(`${REMOTEDB_URL}?table=${USER_DETAILS_TABLE}`);
        const jsonUserDetails = await response.json();
        //localStorage.setItem(USER_DETAILS, jsonUserDetails.data);
        console.log("User Details: ", jsonUserDetails);

    }
    catch (e) {
        console.error("Error fetching user details: ", e);
    }
}

async function addData(table, dataToAdd) {
    try {
        // Step 1. Send a POST request to the database with the data to add
        const response = await fetch(`${REMOTEDB_URL}?table=${table}`, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "add",
                data: dataToAdd
            })
        });
        // Step 2. Convert the response to JSON format
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error("Error adding data:", error);
    }
}

async function deleteData(table, dataToSelect) {
    try {
        // Step 1. Send a POST request to the database with the data to delete
        const response = await fetch(`${DB_ENDPOINT}?table=${table}`, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "delete",
                data: {
                    select: dataToSelect
                }
            })
        });
        // Step 2. Convert the response to JSON format
        const result = await response.json();
        console.log(result);
    } catch (error) {
        console.error("Error deleting data:", error);
    }
}

async function dataInitiated(){
    if(dataBeingUsed==false){
        dataBeingUsed=true;
        try{
            await readData();
        //checks if data has been populated as readData is async
        
            checkForID(USER_ID);
            checkForID(EXPERIMENT_ID);
            saveToDB=true;
        }
        catch (e) {
            console.error("Error initiating data:", e);
        }
        
        

    }
}

function createID(id){
    let idToIncrement=id.slice(1);
    let incrementedID = parseInt(idToIncrement) + 1;
    incrementedID = id[0] + incrementedID.toString().padStart(7,"0");
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    return incrementedID;
}

function savetoDBUserExperiment(){

    let needToAddExperiment = true;
    for(i=0;i<currentData.length-1;i++){
        //
        if(currentData[i].ExperimentID==sessionStorage.getItem(EXPERIMENT_ID)&&currentData[i].UserID==localStorage.getItem(USER_ID)){
            
            //record already exists so update existing experiment with new data 
            //only need to access experiment drops table to add new drops with existing experiment ID
            // no need to update user experiments table as experiment record already exists and doesn't need to be updated with any new info such as new experiment ID or user ID
            needToAddExperiment=false;
            console.log("Existing experiment record found for user, no need to create new record");
            return;
        }
       
    }
     //record doesn't exist so create new experiment record
    if(needToAddExperiment===true){
        let experimentData = {
            ExperimentID: sessionStorage.getItem(EXPERIMENT_ID),
            UserID: localStorage.getItem(USER_ID),
        }
        console.log("No existing experiment record found for user, creating new record");

        addData(USER_EXPERIMENTS_TABLE, experimentData);

    }
}

function savetoDBExperimentDrops(droplets){
     for(d=0;d<droplets.length;d++){
        let dropToAdd={
            ExperimentID: sessionStorage.getItem(EXPERIMENT_ID),
            DropID:	d,
            X:droplets[d].x,	
            Y:	droplets[d].y,
            R:	red(droplets[d].colour),
            G:	green(droplets[d].colour),
            B:	blue(droplets[d].colour),
            Size:	droplets[d].diameter,
        }
        addData(DROP_TABLE, dropToAdd);
    }
}

async function saveExperimentToDB(droplets){
    await savetoDBUserExperiment();
    await savetoDBExperimentDrops(droplets);
}

function checkforUserDetails(){
    // Check if user details are already stored in localStorage
    let userDetails = localStorage.getItem(USER_DETAILS);
    console.log("Checking for user details in localStorage: ", userDetails);
    if(!userDetails){
        createUserID();
    }
}

function checkForID(idType){
    console.log("Checking for " + idType);
    //let id = localStorage.getItem(idType);
    //if(id===null){
        if(idType==USER_ID){
            let id = localStorage.getItem()
            id = createUserID();
            localStorage.setItem(USER_ID, id);

        }
        else if(idType==EXPERIMENT_ID){
            id = createID(latestValues.ExperimentID.toString());
            sessionStorage.setItem(EXPERIMENT_ID, id);
        }
        else{
            console.error("Invalid ID type: " + idType);
        }
        
        //localStorage.setItem(idType, id);
        console.log("New " + idType + " created with ID: " + id);
    //}
    //else{
        console.log("Existing " + idType + " with ID: " + id);
    //}

}

function createUserID(){
    let idAlreadyTaken = false;
    do{
        let generatedID = createID(latestValues.UserID.toString());
        idAlreadyTaken = isUserIDTaken(generatedID);
        console.log("Generated user ID: " + generatedID + " Taken? " + idAlreadyTaken);
        if(idAlreadyTaken===false){
            
            let userDetails ={
                UserID: generatedID,
                UserName: "User" + generatedID.slice(1),
            }
            return userDetails
        }
    }
    while(idAlreadyTaken===true)
    

}

function isUserIDTaken(generatedID){
    
    for(i=0;i<currentData.length;i++){
        if(currentData[i].UserID===generatedID){
            console.log("Existing user with ID: " + generatedID);
            // User Id already taken
            return true;
        }
            
        
    }
    return false;
}
