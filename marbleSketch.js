const mainCanvas = document.getElementById("marble-canvas");
const downloadBtn = document.getElementById("download-canvas-button");
let droplets =[];
mainCanvas.addEventListener("click",canvasClicked);
downloadBtn.addEventListener("click",downloadCanvas);



class Drop{

    x;
    y;
    centre
    diameter;
    radius;
    resolution;
    vertices;
    colour;
    
    

    constructor(x,y,size,colour){
        this.x=x;
        this.y=y;
        this.centre = createVector(this.x,this.y);
        this.diameter=size;
        this.resolution=100
        this.radius=this.diameter/2;
        this.fillVertices();
        this.colour = colour

    }

    fillVertices(){
        this.vertices = []
        //Getting vertices all around the circle - more vertices the more smooth the circle is
        //vertices drawn equidistant from eachother
       
        for(let i=0;i<this.resolution;i++){
             //converting each individual point from polar(angle and radius) to cartesian(x,y coords)
             //circumference = 2*PI*r
             //iterating over angles arounf circle circumference
            let angle = map(i,0,this.resolution,0,TWO_PI);
            //vector from sine and cosine of angle - trig
            let vect = createVector(cos(angle),sin(angle));
            //scaling vector by radius
            vect.mult(this.radius);
            //adding x and y to offset
            vect.add(this.x,this.y);
            this.vertices[i]= vect;


        }
    }

    drawDrop(){
        noStroke();
        fill(this.colour);

        //drawing vertices and connecting them together to make the circle rather than drawing it using circle()
        //This is so we can manipulate the shape using the vertices
        beginShape();

        for(let v=0;v<this.vertices.length;v++){
            vertex(this.vertices[v].x,this.vertices[v].y)
        }
        //close constant connects first and last point
        endShape(CLOSE);
    }

    displace(newDrop){
        for(let v=0;v<this.vertices.length;v++){
           
            let point = this.vertices[v].copy();
            let subVal = point.sub(newDrop.centre);
            let magnitudeSq = subVal.magSq()
            let sqRoot = sqrt(1+((newDrop.radius*newDrop.radius)/(magnitudeSq))) ;
            let ans = subVal.mult(sqRoot);
            let finalAns = ans.add(newDrop.centre);
            this.vertices[v].set(finalAns);



        }
    }
}

function setup(){
    createCanvas(800,500,mainCanvas);
    
}

function draw(){
    clear()
    for(let d of droplets){
        d.drawDrop();
    }
    
}


function downloadCanvas(){
    const fileName = document.getElementById("download-canvas-filename").value;
    const fileType = document.getElementById("download-canvas-filetype").value;
    console.log("Name:" + fileName + " Type:" +fileType);
    saveCanvas(fileName,fileType);

}

function canvasClicked(){
    console.log("click")
    let newDrop = new Drop(mouseX,mouseY,document.getElementById("brush-slider").value,document.getElementById("brush-colour").value);
    for(let existingDrop of droplets){
        existingDrop.displace(newDrop);
    }


    droplets.push(newDrop);
    
}

/*
Things to store:
X and Y coordinates, colour and size
*/