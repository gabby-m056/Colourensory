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
let currentData;

let latestValues;
let saveToDB = false;
let userDetailsData;
const USER_ID="UserID";
const EXPERIMENT_ID="ExperimentID";
const USER_DETAILS="UserDetails";
const CURRENT_DATA="CurrentData";

//JS doesn't support enums so this is the best equivalent
const Type={

    MARBLE: "marble",
    BLEND: "blend"

}



class Experiment{
    id;
    img;
    experimentMarks=[];
    type;

    constructor(marksArray,type){
        this.id=sessionStorage.getItem(EXPERIMENT_ID);
        this.img=saveCanvasToDataURL(type);
        this.experimentMarks = marksArray;
        this.type=type;
    }
}

async function readData(){

    try{
        const response = await fetch(`${REMOTEDB_URL}?table=${USER_EXPERIMENTS_TABLE}`);
        const jsonData = await response.json();
        currentData = checkCurrentData(JSON.parse(jsonData.data));
        localStorage.setItem(CURRENT_DATA, JSON.stringify(currentData));
        latestValues = currentData[currentData.length - 1];
        //console.log(data);
        console.log("Current Data: ", currentData);
       
    }
    catch (e) {
        console.error("Error fetching data:", e);
    }

}

function checkCurrentData(currentDataArray){
    findUserDetails();
    console.log("user details data in check current data:", userDetailsData);
    let indexToSplice =[];
    for(let data of currentDataArray){
        console.log(data.UserID, userDetailsData.UserID);
        if(data.UserID!==userDetailsData.UserID){
            indexToSplice.push(currentDataArray.indexOf(data));
            console.log(currentDataArray.indexOf(data));
        }
        
    }
    for(let i=indexToSplice.length-1;i>=0;i--){
        currentDataArray.splice(indexToSplice[i],1);
    }
    return currentDataArray;
    
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
        console.log(table, result);
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
        
            checkforUserDetails();
            checkForExperimentID();
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

function savetoDBUserExperiment(experiment){
    console.log(experiment);
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
        experiment.id = sessionStorage.getItem(EXPERIMENT_ID);
        let userIDToSave = localStorage.getItem(USER_DETAILS);
        console.log("user ",userIDToSave);
        let experimentData = {
            ExperimentID: experiment.id,
            UserID: JSON.parse(userIDToSave).UserID,
            Type: experiment.type,
            LastSaved: dateNow(),
            Image:experiment.img
        }
        console.log("No existing experiment record found for user, creating new record");

        addData(USER_EXPERIMENTS_TABLE, experimentData);
       

    }
}

function savetoDBExperimentDrops(experiment){
     for(d=0;d<experiment.experimentMarks.length;d++){
        let dropToAdd={
            ExperimentID: experiment.id,
            DropID:	d.toString(),
            X:experiment.experimentMarks[d].x,	
            Y:	experiment.experimentMarks[d].y,
            R:	red(experiment.experimentMarks[d].colour).toString(),
            G:	green(experiment.experimentMarks[d].colour).toString(),
            B:	blue(experiment.experimentMarks[d].colour).toString(),
            Size:	experiment.experimentMarks[d].diameter,
            
            
        }
        console.log("Adding drop to database: ", dropToAdd);
        addData(DROP_TABLE, dropToAdd);
    }
}

async function saveExperimentToDB(experiment){
    await savetoDBUserExperiment(experiment);
    await savetoDBExperimentDrops(experiment);
    
}

function checkforUserDetails(){
    // Check if user details are already stored in localStorage
    findUserDetails();
    console.log("Checking for user details in localStorage: ", userDetailsData);
    if(userDetailsData===null){
       createUserDetails();
    }
}

function findUserDetails(){
    try{
        userDetailsData = JSON.parse(localStorage.getItem(USER_DETAILS));
        if(userDetailsData.UserName===null && userDetailsData.UserID!==null){
            console.log("Found user details in localStorage but name is not set: ", userDetailsData);
        }
    }
    catch(e){
        console.error("Cant find user details in localStorage: ", e);
        userDetailsData = null;
    }

    
}

function createUserDetails(){
    userDetailsData = createUserID();
    localStorage.setItem(USER_DETAILS, JSON.stringify(userDetailsData));
}


/*function getUserID(){
    userDetailsData.UserID
}

function getUserName(){}*/

function checkForExperimentID(){
    console.log("Checking for experiment ID");
    let id = sessionStorage.getItem(EXPERIMENT_ID);
    if(id===null){
        
        try{
            id = createID(latestValues.ExperimentID.toString());
            sessionStorage.setItem(EXPERIMENT_ID, id);
            console.log("New experiment created with ID: " + id);
        }
        catch (e) {
            console.error("Error creating new experiment ID: ", e);
        }
    }
    else{
        console.log("Existing experiment with ID: " + id);
    }
        
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
                UserName: null,
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

function saveCanvasToDataURL(type){
    let canvas;
    if(type===Type.MARBLE){
        canvas = document.getElementById("marble-canvas");
    }
    else{
        canvas = document.getElementById("blend-canvas");
    }


    let dataURL = canvas.toDataURL("image/jpeg", 1.0);
    return dataURL;

}

function dateConvert(dateISO){
    let tempDateObj = new Date(dateISO);
    //Since ISO is displayed in format YYYY-MM-DDTHH:mm:ss.sssZ, we need to convert it to DD/MM/YYYY HH:mm:ss format for it to be more easily readable for users.
    let dateObj = tempDateObj.toLocaleString("en-GB", { timeZone: "GB-Eire" });
    //removes comma and replaces it with at for DD/MM/YYYY at HH:mm format from date string to make it more readable for users
    let displayDate = dateObj.replace(","," at"); 
    //removes last 3 characters from date string to remove seconds and make it more readable for users
    return displayDate.substring(0, displayDate.length - 3); 
}

function dateNow(){
    //let tempDateNowObj = new Date().toLocaleString("en-GB", { timeZone: "GB-Eire" });
    let dateNowObj = new Date().toISOString();
    return dateNowObj;
}