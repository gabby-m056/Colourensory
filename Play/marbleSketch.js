const mainCanvas = document.getElementById("marble-canvas");
const newBtn = document.getElementById("new-canvas-button");
const downloadBtn = document.getElementById("download-canvas-button");
const saveBtn = document.getElementById("save-canvas-button");
let colourPicker = new iro.ColorPicker(document.getElementById("brush-colour"),{
    width: 320,
    color: "#95327f",
    display: "flex",
    layout: [
    { 
      component: iro.ui.Box,
      options: {}
    },
    {
        component: iro.ui.Slider,
        options: {
        // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
        sliderType: 'hue'
        }
    },
   /* {
        component: iro.ui.Slider,
        options: {
        // can also be 'saturation', 'value', 'red', 'green', 'blue', 'alpha' or 'kelvin'
        sliderType: 'alpha'
        }
    },*/
  ],
  layoutDirection:"horizontal"


});
let wasCanvasClicked = false;
let droplets =[];
let saveClicked = false;

//colourPicker.addEventListener("input",changeColour);
//colourPicker.addEventListener("keydown",hexColourInputActive)
mainCanvas.addEventListener("click",canvasClicked);
newBtn.addEventListener("click",newCanvas);
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
    image;
    
    
    

    constructor(x,y,size,colour){
        this.x=x;
        this.y=y;
        this.centre = createVector(this.x,this.y);
        this.diameter=size;
        this.resolution=floor(this.diameter*3);
        this.radius=this.diameter/2;
        this.fillVertices();
        this.colour = colour

    }

    fillVertices(){
        this.vertices = []
        //Getting vertices all around the circle - more vertices the more smooth the circle is
        //vertices drawn equidistant from eachother
       console.log("resolution:" + this.resolution);
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
    //let w = windowWidth*0.51979166666;
    //let h = windowHeight*0.33125;
    createCanvas(800,600,mainCanvas);
    background(255);
    
}

function draw(){
    clear();
    background(255);
    //if(checkHexInput()===false){
        document.getElementById("colour-hex-value").value = colourPicker.color.hexString;
    //}
    
     
    if(droplets.length===0){
        sessionStorage.removeItem(EXPERIMENT_ID);
    }
    for(let d of droplets){
        d.drawDrop();
    }
    if(saveClicked && saveToDB){
        let experimentToSave = new Experiment(droplets);
        console.log(experimentToSave);
        saveExperimentToDB(experimentToSave);
        saveClicked=false;
        saveToDB=false;
    }
    
}

function hexColourInputActive(){
    changeColour();
    document.getElementById("colour-hex-value").value="#"
    return true;
}

function checkHexInput(){
    if(hexColourInputActive()===true){
       return true;
    }
    else{
        return false;
    }
}


function changeColour(){
    let changeToColour = document.getElementById("colour-hex-value").value;
    
        if(changeToColour.length===6){
            if(isAlphaNumeric(changeToColour)===true){
                let addHashtoColour = "#"+ changeToColour;
                changeToColour = addHashtoColour;
            }
            else{
                return;
            }
        }
        else if(changeToColour.length===7){
            if(changeToColour.charAt(0)!=="#"||isAlphaNumeric(changeToColour.substring(1,6))===false){
                return;
            }
        }
        else{
            return;
        }
        colourPicker.color.hexString = changeToColour;
    
}





function newCanvas(){
    clear();
    droplets = [];
    sessionStorage.removeItem(EXPERIMENT_ID);
}

function saveCanvasAsImage(){
    let fileName = document.getElementById("download-canvas-filename").value ?? sessionStorage.getItem(EXPERIMENT_ID);
    let fileType = document.getElementById("download-canvas-filetype").value ?? ".jpg";
    if(fileName===""){
        let tempFname = sessionStorage.getItem(EXPERIMENT_ID);
        fileName=  tempFname ?? "myExperiment";
        console.log("fname ",fileName)
    }
    console.log("filename: ",fileType, "filetype ", fileType)
    let currentExperimentImage=
    [
        fileName,
        fileType
    ]
    
    return currentExperimentImage
   
}

function downloadCanvas(){
    
    let imageToSave = saveCanvasAsImage();
    saveCanvas(imageToSave[0],imageToSave[1]);

}





function canvasClicked(){
    console.log("draw on canvas");
    let newDrop = new Drop(mouseX,mouseY,document.getElementById("brush-slider").value, colourPicker.color.rgbaString);
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



async function saveExperiment(){
    if(droplets.length==0){
        console.log("Your canvas is empty! Draw something before saving.");
        return;
    }
    else{
        console.log("Saving experiment...");
        saveClicked = true;
        await dataInitiated();
    }
    

    

}


/*
Things to store:
X and Y coordinates, colour and size
*/