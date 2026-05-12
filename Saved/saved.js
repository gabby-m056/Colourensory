document.addEventListener("load", displaySavedExperiments);

const marbleSection = document.getElementById("section-saved-marble");
const blendSection = document.getElementById("section-saved-blend");
let marbleExperiments = [];
let blendExperiments = [];

function displaySavedExperiments(){
    
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
    let marbleCards=[];
    // row r is r*n to (r+1)*n-1 cards, where n is the number of cards per row (4 in this case)
    //r*4 to (r+1)*4-1
    for(let r=0;r<Math.ceil(marbleExperiments.length/4);r++){
        let marbleCardRow = [];
        for(let i=0;i<4;i++){
        
    
            
            let newCard = createExperimentCard(marbleExperiments[i]);
            marbleCardRow.push(newCard);
            
        }
        if(marbleCardRow.length === 4){
                
        }
    }
        let marbleCardRow = [];
        let newCard = createExperimentCard(marbleExperiment);
        marbleCards.push(newCard);
        if(marbleCards.length === 4){
    }


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

function createNewRow(){
    let newDiv = document.createElement("div");
    newDiv.classList.add("row");
    return newDiv;
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