/*
Frozen brush

Makes use of a delaunay algorithm to create crystal-like shapes.
I did NOT develop delaunay.js, and not sure who the author really is to give proper credit.

Controls:
	- Drag the mouse.
    - Press any key to toggle between fill and stroke.

Inspired by:
	Makio135's sketch www.openprocessing.org/sketch/385808

*/

var allParticles = [];
var maxLevel = 3;
var useFill = false;
var loopForever = true;

var isScriptLoaded = false;
var data = [];
var fakeMouse;
var fakeMouseDirection;
var fakeMouseVelocityMax = 10;
var fakeMouseRand = 2;

var initialtime = 2; //4seconds to swap between brushes
var timer = initialtime;

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
  createCanvas(windowWidth-100, windowHeight-100); 
  
  colorMode(HSB, 360);

  textAlign(CENTER);
  clear();
    fakeMouse = {x:width/2, y:height/2};
    fakeMouseDirection = createVector(random(-fakeMouseVelocityMax,fakeMouseVelocityMax),random(-fakeMouseVelocityMax,fakeMouseVelocityMax));

} 

function draw() {
  // Create fade effect.
  //var second = second();

  noStroke();
  fill(360, 20);
  clear();
  fill(51);
  rect(0, 0, width, height);
	
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
	 
    for (var i = 0; i < data.length; i += 3) {
      // Collect particles that make this triangle.
      var p1 = allParticles[data[i]];
      var p2 = allParticles[data[i+1]];
      var p3 = allParticles[data[i+2]];
      
      // Don't draw triangle if its area is too big.
      var distThresh = 100;
      
      if (dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y) > distThresh) {
        continue;
      }
      
      if (dist(p2.pos.x, p2.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
        continue;
      }
      
      if (dist(p1.pos.x, p1.pos.y, p3.pos.x, p3.pos.y) > distThresh) {
        continue;
      }
      
      // Base its hue by the particle's life.
      if (useFill) {
        noStroke();
        fill(165+p1.life*1.5, 360, 360);
      } else {
        noFill();
        strokeWeight(2);
        stroke(165+p1.life*1.5, 360, 360);
      }
      
      triangle(p1.pos.x, p1.pos.y, 
               p2.pos.x, p2.pos.y, 
               p3.pos.x, p3.pos.y);
    }
  }
  noStroke();
  fill(255);

  fakeMouseDirection.x = fakeMouseDirection.x + random(-fakeMouseRand,fakeMouseRand);
  fakeMouseDirection.y = fakeMouseDirection.y + random(-fakeMouseRand,fakeMouseRand);	
  fakeMouse.x = fakeMouse.x + fakeMouseDirection.x;
  fakeMouse.y = fakeMouse.y + fakeMouseDirection.y;
