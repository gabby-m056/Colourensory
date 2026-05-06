window.addEventListener("load", starting);

async function starting(){
    await readData();
    await readUserDetails();
    checkforUserDetails();
    console.log("User details: ", userDetailsData);
}


/*This method is based upon an example from the LabEx String is AlphaNumeric Tutorial
Author: LabEx
Location: https://labex.io/tutorials/string-is-alphanumeric-28407
Accessed: 06/05/2026
 */
function isAlphaNumeric(str) {
  // Using regular expression to check for alphanumeric characters
  return /^[a-zA-Z0-9]+$/.test(str);
}