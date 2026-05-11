const mainCanvas = document.getElementById("blend-canvas");
const colourPicker = document.getElementById("brush-colour");
//const cssColour = document.documentElement.style.getPropertyValue("--circle-colour");

let marks = [];
let b = 0;

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
        
        circle(this.x,this.y,200);
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
     document.getElementById("blend-mode").innerHTML = "Blend Mode: "+ blendModes[b];
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
    let mark = new Mark(mouseX,mouseY,colour,b);
    marks.push(mark);
   
    console.log(blendModes[b]);
    console.log(marks.length);
     b++;
    if(b===blendModes.length){
        b=0;
    }
}

function selectedMode(){
    let blendMode = document.getElementById("blend-mode-select");
    

}
