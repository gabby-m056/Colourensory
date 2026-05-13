const mainCanvas = document.getElementById("blend-canvas");
const colourPicker = document.getElementById("brush-colour");
const selectedBlendMode = document.getElementById("blend-mode-select");
const colourSwatches = document.getElementById("colour-buttons");
const downloadBtn = document.getElementById("download-canvas-button");
const saveBtn = document.getElementById("save-canvas-button");
let saveClicked = false;
let currentColourButton;
let previousBtn;

let currentBlendMode;
selectedBlendMode.addEventListener("click", (clickEvent)=>{
    currentBlendMode=clickEvent.target;
    console.log(currentBlendMode);
    selectedMode();
});
colourSwatches.addEventListener("click", (clickEvent)=>{
    currentColourButton = clickEvent.target;
    selectedColour();

});        
//const cssColour = document.documentElement.style.getPropertyValue("--circle-colour");

let marks = [];
let currentBlendModeNo = 0;

let blendModeInfo =[

    "This blend mode compares the colour of the mark you drop with the colour underneath it, checks both colours RGB values and keeps the lowest red, green and blue value between both colours. Try dropping different colours and see what happens!",
    "This blend mode compares the colour of the mark you drop with the colour underneath it, checks both colours RGB values and keeps the highest red, green and blue value between both colours. Try dropping different colours and see what happens!",
    "This blend mode compares the colour of the mark you drop with the colour underneath it, checks both colours RGB values and subtracts each smaller red,green and blue value from the larger red,green and blue value. Try dropping different colours and see what happens!",
    "This blend mode compares the colour of the mark you drop with the colour underneath it, and multiplies both colours RGB values together to make a new value. Try dropping different colours and see what happens!",
    "This blend mode compares the colour of the mark you drop with the colour underneath it, and subtracts RGB values similar to Difference. However, mid-tone colour values are given a more subtle and muted colour as the contrast between both colours is reduced compared to Difference mode. Try dropping different colours and see what happens!",
    "This blend mode compares the colour of the mark you drop with the colour underneath it, inverts both colours, multiplies the inverted RGB values together to make a new value and inverts it back. Try dropping different colours and see what happens!",
    "This blend mode compares the colour of the mark you drop with the colour underneath it, checks the colour underneath's RGB value, if each RGB value is dark it applies Multiply Mode and if it is light it applies Screen Mode. Try dropping different colours and see what happens!",
    "This blend mode compares the colour of the mark you drop with the colour underneath it, checks the dropped colour's RGB value, if each RGB value is dark it applies Multiply Mode and if it is light it applies Screen Mode. Try dropping different colours and see what happens!",
    "This blend mode compares the colour of the mark you drop with the colour underneath it, checks the dropped colour's RGB value and applies Multiply or Screen Mode like Hard Light but squares the values to reduce the contrast. Try dropping different colours and see what happens!",
    "This blend mode compares the colour of the mark you drop with the colour underneath it, lightening the colour underneath based on the dropped colour's RGB value by decreasing the contrast between layers. Try dropping different colours and see what happens!",
    "This blend mode compares the colour of the mark you drop with the colour underneath it, darkening the colour underneath based on the dropped colour's RGB value by increasing the contrast between layers. Try dropping different colours and see what happens!"

]

downloadBtn.addEventListener("click",downloadCanvas);
saveBtn.addEventListener("click",saveExperiment);

class Mark{
    
    x;
    y;
    colour;
    blendModeNo;
    diameter;

    constructor(x, y, colour,blendModeNo){
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.blendModeNo = blendModeNo;
        this.diameter = 250;
    }

 

    drawMark(){
        noStroke();
        
        fill(this.colour);
        blendMode(blendModes[this.blendModeNo]);
        
        circle(this.x,this.y,this.diameter);
    }
}

function setup(){
    
    let canvas = createCanvas(1000,600,mainCanvas);
    blendModes = [DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN];
    background(255);
  
}

function randomColour()
{
    if(colourPicker.value===color(0)){
        colourPicker.value = color(Math.round(random(0,255)),Math.round(random(0,255)),Math.round(random(0,255)));
    }
    
}

function draw(){
    clear();
    background(255);
     document.getElementById("blend-mode-heading").innerHTML = "Blend Mode: "+ showBlendModeText();
    /*if(marks.length>0){
        marks[marks.length-1].x = mouseX;
        marks[marks.length-1].y = mouseY;
    }*/
    for(let m of marks){
       
        m.drawMark();

    }
   if(saveClicked && saveToDB){
        let experimentToSave = new Experiment(marks,Type.BLEND);
        console.log(experimentToSave);
        saveExperimentToDB(experimentToSave);
        
        saveClicked=false;
        saveToDB=false;
        //starting();
   }
    
}

function mousePressed(){
   
    colour = colourPicker.value;
    if(mouseX>0&&mouseX<width&&mouseY>0&&mouseY<height){
        let mark = new Mark(mouseX,mouseY,colour,currentBlendModeNo);
        marks.push(mark);
   
        console.log(blendModes[currentBlendModeNo]);
        console.log(marks.length);
    }
}



function showBlendModeText(){
    try{
        return currentBlendMode.innerText;
    }
    //if there is no blend mode selected by user input
    catch(e){
        let blendModeTxt = blendModes[currentBlendModeNo];
        let finalTxt= blendModeTxt.charAt(0).toUpperCase() + blendModeTxt.substring(1,blendModeTxt.length);
        return finalTxt
    }
}

function selectedColour(){
    let colourBtns = document.getElementsByClassName("colour-swatch")
    for(let btn of colourBtns){
        if(btn!==currentColourButton){
            btn.classList.remove('active');
        }
    }
    currentColourButton.classList.add('active');
    colourPicker.value = window.getComputedStyle(currentColourButton).getPropertyValue("background-color");
}

function selectedMode(){

    let blendModeBtns = document.getElementsByClassName("btn-blend-mode")
    for(let btn of blendModeBtns){
        if(btn!==currentBlendMode){
            btn.classList.remove('active');
        }
    }

    if(currentBlendMode.innerText==="Darken"){
        currentBlendModeNo=0;
    }
    if(currentBlendMode.innerText==="Lighten"){
        currentBlendModeNo=1;
    }
    if(currentBlendMode.innerText==="Difference"){
        currentBlendModeNo=2;
    }
    if(currentBlendMode.innerText==="Multiply"){
        currentBlendModeNo=3;
    }
    if(currentBlendMode.innerText==="Exclusion"){
        currentBlendModeNo=4;
    }
    if(currentBlendMode.innerText==="Screen"){
        currentBlendModeNo=5;
    }
    if(currentBlendMode.innerText==="Overlay"){
        currentBlendModeNo=6;
    }
    if(currentBlendMode.innerText==="Hard Light"){
        currentBlendModeNo=7;
    }
    if(currentBlendMode.innerText==="Soft Light"){
        currentBlendModeNo=8;
    }
    if(currentBlendMode.innerText==="Dodge"){
        currentBlendModeNo=9;
    }
    if(currentBlendMode.innerText==="Burn"){
        currentBlendModeNo=10;
    }

    let blendModeExplanation = document.getElementById("blend-mode-explanation");
    blendModeExplanation.textContent=blendModeInfo[currentBlendModeNo];
}

function downloadCanvas(){
    
    let imageToSave = saveCanvasAsImage();
    saveCanvas(imageToSave[0],imageToSave[1]);

}

async function saveExperiment(){
    if(marks.length==0){
        console.log("Your canvas is empty! Draw something before saving.");
        return;
    }
    else{
        console.log("Saving experiment...");
        saveClicked = true;
        await dataInitiated();
    }  

}