const mainCanvas = document.getElementById("blend-canvas");
//const cssColour = document.documentElement.style.getPropertyValue("--circle-colour");
let blendModes = [];
let marks = [];
let clickCounter = 0;

class Mark{
    
    x;
    y;
    colour;
    blendMode;

    constructor(x, y, colour,blendMode){
        this.x = x;
        this.y = y;
        this.colour = colour;
        this.blendMode= blendMode;
    }

 

    drawMark(){
        noStroke();
        fill(this.colour);
        circle(this.x,this.y,70);
    }
}

function setup(){
    
    let canvas = createCanvas(600,400, mainCanvas);
    document.getElementById()
}

function draw(){
    clear();
    console.log("Marks array: ", marks);
    for(let m of marks){
       
        m.drawMark();
    }

    /*if(keyCode===ENTER){
        console.log("Enter key pressed");
        document.getElementById("mark-1").style.backgroundColor = "#95327f";
    }*/
}

function mousePressed(){
    clickCounter++;
    let colour = document.getElementById("brush-colour").value;
    let mark = new Mark(mouseX,mouseY,colour);
    marks.push(mark);
    

}

