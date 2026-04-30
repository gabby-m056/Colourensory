const mainCanvas = document.getElementById("marble-canvas");
const downloadBtn = document.getElementById("download-canvas-button");
const saveBtn = document.getElementById("save-canvas-button");
let wasCanvasClicked = false;
let droplets =[];
mainCanvas.addEventListener("click",canvasClicked);
downloadBtn.addEventListener("click",downloadCanvas);
saveBtn.addEventListener("click",saveExperiment);



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
    clear();
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
    console.log("draw on canvas");
    let newDrop = new Drop(mouseX,mouseY,document.getElementById("brush-slider").value,document.getElementById("brush-colour").value);
    console.log("drop:" + newDrop);
    for(let existingDrop of droplets){
        existingDrop.displace(newDrop);
    }


    droplets.push(newDrop);
    wasCanvasClicked=false;
}

/*function clearCanvas(){
    clear();
    droplets = [];
    if(dataBeingUsed==true){
        const selectData = 
        {
           ExperimentID: localStorage.getItem(EXPERIMENT_ID),
        };
        deleteData(DROP_TABLE, selectData);
    }

}*/




function saveExperiment(){
    if(dataBeingUsed==false){
        dataBeingUsed=true;
        readData();
        checkForID(USER_ID);
        checkForID(EXPERIMENT_ID);
        
    }

    saveExperimentToDB(droplets);

    let experimentID="E0000002"
    if(isExistingExperiment==false){
       
    }

    for(d=0;d<droplets.length;d++){
        let dropToAdd={
            ExperimentID: experimentID,
            DropID:	d,
            X:droplets[d].x,	
            Y:	droplets[d].y,
            R:	red(droplets[d].colour),
            G:	green(droplets[d].colour),
            B:	blue(droplets[d].colour),
            Size:	droplets[d].diameter,
        }
        addData(dropToAdd);
    }

    

}


/*
Things to store:
X and Y coordinates, colour and size
*/