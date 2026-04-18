const mainCanvas = document.getElementById("marble-canvas");
let droplets =[];

class Drop{

    x;
    y;
    centre
    diameter;
    radius;
    resolution;
    vertices;
    colour;
    
    

    constructor(x,y){
        this.x=x;
        this.y=y;
        this.centre = createVector(this.x,this.y);
        this.diameter=50;
        this.resolution=100
        this.radius=this.diameter/2;
        this.fillVertices();
        this.colour = color(random(0,254))

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
            //vector from sine and cosine of angle
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
    for(let d of droplets){
        d.drawDrop();
    }
}

function mousePressed(){
    let newDrop = new Drop(mouseX,mouseY);
    for(let existingDrop of droplets){
        existingDrop.displace(newDrop);
    }


    droplets.push(newDrop);
    
}