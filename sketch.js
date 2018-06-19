
var allParticles = [];
var maxLevel = 3;
var useFill = true;
var loopForever = true;

var isScriptLoaded = false;
var data = [];
var fakeMouse;
var fakeMouseDirection;
var fakeMouseVelocityMax = 10;
var fakeMouseRand = 2;

// Moves to a random direction and comes to a stop.
// Spawns other particles within its lifetime.
function Particle(x, y, level) {
  this.level = level;
  this.life = 0;
  
  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(map(this.level, 0, maxLevel, 5, 2));
  
  this.move = function() {
    this.life++;
    
    // Add friction.
    this.vel.mult(0.9);
    
    this.pos.add(this.vel);
    
    // Spawn a new particle if conditions are met.
    if (this.life % 10 == 0) {
      if (this.level > 0) {
        this.level -= 1;
        var newParticle = new Particle(this.pos.x, this.pos.y, this.level-1);
        allParticles.push(newParticle);
      }
    }
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight); 
  
  colorMode(HSB, 360);
  
  textAlign(CENTER);
  clear();
    fakeMouse = {x:width/2, y:height/2};
    fakeMouseDirection = createVector(random(-fakeMouseVelocityMax,fakeMouseVelocityMax),random(-fakeMouseVelocityMax,fakeMouseVelocityMax));

} 

function draw() {
  // Create fade effect.
  noStroke();
  fill(360, 20);
	clear();
  //rect(0, 0, width, height);
  
  
  // Move and spawn particles.
  // Remove any that is below the velocity threshold.
  for (var i = allParticles.length-1; i > -1; i--) {
    allParticles[i].move();
    
    if (allParticles[i].vel.mag() < 0.01) {
      allParticles.splice(i, 1);
    }
  }

if (allParticles.length > 0) {
    // Run script to get points to create triangles with.
    data = Delaunay.triangulate(allParticles.map(function(pt) {
      return [pt.pos.x, pt.pos.y];
    }));
  	
    strokeWeight(0.1);
    	
