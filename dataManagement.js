const USER_EXPERIMENTS_TABLE = "User_Experiments";
const DROP_TABLE = "Experiment_Drops";
const REMOTEDB_URL="https://script.google.com/macros/s/AKfycbzum4SuXwJgPwB9F_rMWUCM9MgcQiZAwJ90n_Fa93iOqCT70V8tjNPPiWVgzuGNM6flvA/exec"
let isExistingExperiment = false;
/*To be set to true when the website needs data functionality, 
such as saving/loading experiments and users.
Avoids using unnecessary storage/running unneeded API calls when not needed, 
such as when just using the canvas drawing features.*/
let dataBeingUsed = false;
let currentData = null;

const USER_ID="UserID";
const EXPERIMENT_ID="ExperimentID";


async function readData(){

    try{
        const response = await fetch(`${REMOTEDB_URL}?table=${USER_EXPERIMENTS_TABLE}`);
        const userData = await response.json();
        currentData = JSON.parse(userData.data);

        console.log(userData);
        console.log(currentData);
        checkForUserID();
    }
    catch (e) {
        console.error("Error fetching data:", e);
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

function createID(id){
    let idToIncrement=id.slice(1);
    let incrementedID = parseInt(idToIncrement) + 1;
    incrementedID = id[0] + incrementedID.toString().padStart(7,"0");
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
    return incrementedID;
}

async function savetoDBUserExperiment(){

    let needToAddExperiment = true;
    for(i=0;i<currentData.length;i++){
        //
        if(currentData[i].ExperimentID==localStorage.getItem(EXPERIMENT_ID)&&currentData[i].UserID==localStorage.getItem(USER_ID)){
            
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
            ExperimentID: localStorage.getItem(EXPERIMENT_ID),
            UserID: localStorage.getItem(USER_ID),
        }
        console.log("No existing experiment record found for user, creating new record");

        addData(USER_EXPERIMENTS_TABLE, experimentData);

    }
}

async function savetoDBExperimentDrops(droplets){
     for(d=0;d<droplets.length;d++){
        let dropToAdd={
            ExperimentID: localStorage.getItem(EXPERIMENT_ID),
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

function checkForID(idType){
    let id = localStorage.getItem(idType);
    if(id==null){
        if(idType==USER_ID){
            tempI = createID(currentData[currentData.length - 1].UserID);

        }
        else if(idType==EXPERIMENT_ID){
            id = createID(currentData[currentData.length - 1].ExperimentID);
        }
        else{
            console.error("Invalid ID type: " + idType);
        }
        
        localStorage.setItem(idType, id);
    }
    else{
        console.log("Existing " + idType + " with ID: " + id);
    }

}

function createUserID(){
    let idAlreadyTaken = false;
    do{
        let generatedID = createID(currentData[currentData.length - 1].UserID);
        idAlreadyTaken = isUserIDTaken(generatedID);
        if(idAlreadyTaken===false){
            return generatedID;
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
