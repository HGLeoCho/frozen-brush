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
var maxLevel = 5;
var useFill = false;

var data = [];

function Particle(x, y, level) {
	  this.level = level;
  this.life = 0;

	  this.pos = new p5.Vector(x, y);
  this.vel = p5.Vector.random2D();
  this.vel.mult(map(this.level, 0, maxLevel, 5, 2));

	  this.move = function() {
    this.life++;
