

const marbleSection = document.getElementById("section-saved-marble");
const blendSection = document.getElementById("section-saved-blend");
let marbleExperiments = [];
let blendExperiments = [];
let displayExecuted = false;

function draw(){
    if(canManipulateData && !displayExecuted){
        executeDisplay();
    }
}

function executeDisplay(){
    displaySavedExperiments();
    displayExecuted = true;
}

function displaySavedExperiments(){
    console.log("Displaying saved experiments");
    let newDivRow = createNewRow();
    for(let experiment of currentData){
        if(experiment.Type === "marble"){
            marbleExperiments.push(experiment);
            // Create and append marble experiment card
        }
        else if(experiment.Type === "blend"){
            blendExperiments.push(experiment);
        }
        else{
            console.log("Experiment type not recognised: ", experiment.Type);
        }
    }
    ;
    // row r is r*n to (r+1)*n-1 cards, where n is the number of cards per row (4 in this case)
    //r*4 to (r+1)*4-1
    let marbleCards = populateCards(marbleExperiments,marbleSection);
    let blendCards = populateCards(blendExperiments,blendSection);
    /*let loopLength = Math.ceil((ar.length-1)/4);
    console.log("loop length: ", loopLength);
    for(let r=0;r<loopLength;r++){
            let marbleCardRow = [];
            for(let i=0;i<4;i++){
            let index = r*4 + i;
            if(index > array.length-1){
                console.log("array looped through, breaking loop");
                return;
            }
            marbleCardRow.push(array[index]);
            console.log("Index: ", array[index], "Row: ", r, "Card in row: ", i);
        }
            
    }
    
        let marbleCardRow = [];
        let newCard = createExperimentCard(marbleExperiment);
        marbleCards.push(newCard);
        if(marbleCards.length === 4){
    }*/

    /*
    <div class="row">
                    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                        <a href="BlendModes/blend.html" class="btn card play-btn-card card-saved-experiment" id="blend-btn-card">
                            <img src="../Play/playCardImages/marbleImg.jpg" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title play-btn-card-title">Marble Experiment</h5>
                                <p class="card-text">Last Saved: 2023-10-01 at 11:04</p>
                            </div>
                        </a>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                        <a href="BlendModes/blend.html" class="btn card play-btn-card">
                            <img src="../Play/playCardImages/marbleImg.jpg" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title play-btn-card-title">Marble Experiment</h5>
                                <p class="card-text">Last Saved: 2023-10-01 at 11:04</p>
                            </div>
                        </a>
                    </div>
                     <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                        <a href="BlendModes/blend.html" class="btn card play-btn-card">
                            <img src="../Play/playCardImages/marbleImg.jpg" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title play-btn-card-title">Marble Experiment</h5>
                                <p class="card-text">Last Saved: 2023-10-01 at 11:04</p>
                            </div>
                        </a>
                    </div>
                    <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
                        <a href="BlendModes/blend.html" class="btn card play-btn-card">
                            <img src="..." class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title play-btn-card-title">Marble Experiment</h5>
                            </div>
                        </a>
                    </div>
                        
                </div>
    */
}

function addCardRow(cards, rowIndex,section){
    let newDivRow = createNewRow();
    for(let card of cards){
        let newCard = createExperimentCard(card);
        newDivRow.innerHTML += newCard;
    }
    section.appendChild(newDivRow);
}

function createNewRow(){
    let newDiv = document.createElement("div");
    newDiv.classList.add("row");
    return newDiv;
}

function populateCards(cardArray,section){
    let sortedCards=[];
  let loopLength = Math.ceil((cardArray.length-1)/4);
  console.log("loop length: ", loopLength);
  for(let r=0;r<loopLength;r++){
        let cardRow = [];
        for(let i=0;i<4;i++){
          let index = r*4 + i;
          if(index > cardArray.length-1){
            console.log("array looped through, breaking loop");
            return;
          }
          cardRow.push(cardArray[index]);
          console.log("Index: ", cardArray[index], "Row: ", r, "Card in row: ", i);
        }
        sortedCards.push(cardRow);
        addCardRow(cardRow, r, section);

  }
  console.log("Marble cards: ", sortedCards);
  return sortedCards;
}

function experimentImageCheck(experiment){
    if(experiment.Image.contains("data:image/jpeg;base64")){
        return experiment.Image;
    }
    else{
        return "../Play/playCardImages/marbleImg.jpg";
    }
}

function createExperimentCard(experiment){
    let newCardInnerHTML =`<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
    <a href="BlendModes/blend.html" class="btn card play-btn-card card-saved-experiment" id="${experiment.Type}-btn-card">
    <img src="${experimentImageCheck(experiment)}" class="card-img-top" alt="...">
    <div class="card-body">
    <h5 class="card-title play-btn-card-title">Marble Experiment</h5>
    <p class="card-text">Last Saved: ${dateConvert(experiment.Date)}</p></div></a></div>`;
    return newCardInnerHTML;
}