 


async function starting(){
  canManipulateData = false;
  console.log("starting function called");
    await readData(); 
    await readUserDetails();
    checkforUserDetails();
    console.log("User details: ", userDetailsData,typeof(currentData), currentData);
    console.log("finish data reading");
    
   
}

function enableDataManipulation(){
    canManipulateData = true;
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

function testLoop(){
  let array = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
  let loopLength = Math.ceil((array.length-1)/4);
  console.log("loop length: ", loopLength);
  for(let r=0;r<loopLength;r++){
        let marbleCardRow = [];
        
        for(let i=0;i<4;i++){
          let index = r*4 + i;
          if(index > array.length-1){
            console.log("array looped through, breaking loop");
            break;
          }
          marbleCardRow.push(array[index]);
          console.log("Index: ", array[index], "Row: ", r, "Card in row: ", i);
        }
        console.log("add row to main array ", r);
          
  }
}