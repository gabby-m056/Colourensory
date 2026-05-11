const mainCanvas = document.getElementById("blend-canvas");
const colourPicker = document.getElementById("brush-colour");
let previousBtn;
let selectedBlendMode = document.getElementById("blend-mode-select");
let currentBlendMode;
selectedBlendMode.addEventListener("click", (clickEvent)=>{
    currentBlendMode=clickEvent.target;
    console.log(currentBlendMode);
    selectedMode();
})
//const cssColour = document.documentElement.style.getPropertyValue("--circle-colour");

let marks = [];
let currentBlendModeNo = 0;

class Mark{
    
    x;
    y;
    colour;
    blendModeNo;

    constructor(x, y, colour,blendModeNo){
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.blendModeNo = blendModeNo;
    }

 

    drawMark(){
        noStroke();
        
        fill(this.colour);
        blendMode(blendModes[this.blendModeNo]);
        
        circle(this.x,this.y,250);
    }
}

function setup(){
    
    let canvas = createCanvas(1000,600,mainCanvas);
    blendModes = [DARKEST, LIGHTEST, DIFFERENCE, MULTIPLY, EXCLUSION, SCREEN, OVERLAY, HARD_LIGHT, SOFT_LIGHT, DODGE, BURN];
    
  
}

function randomColour()
{
    if(colourPicker.value===color(0)){
        colourPicker.value = color(Math.round(random(0,255)),Math.round(random(0,255)),Math.round(random(0,255)));
    }
    
}

function draw(){
    clear();
     document.getElementById("blend-mode").innerHTML = "Blend Mode: "+ showBlendModeText();
    /*if(marks.length>0){
        marks[marks.length-1].x = mouseX;
        marks[marks.length-1].y = mouseY;
    }*/
    for(let m of marks){
       
        m.drawMark();

    }
   
    

    /*if(keyCode===ENTER){
        console.log("Enter key pressed");
        document.getElementById("mark-1").style.backgroundColor = "#95327f";
    }*/
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
}
