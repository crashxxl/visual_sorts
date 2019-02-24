let array = [];
let select1 = null;
let select2 = null;
let verified = -1;
let accesses = 0;
let comparisons = 0;
let osc;
const delay = ms => new Promise(res => setTimeout(res, ms));
let deleyed = 0;

async function blocking_wait() {
  if(deleyed <= 1 && vm.started) {
    await delay(1/vm.speed);
    deleyed = vm.speed;
  }
  deleyed--;
}

async function get_array_value(i) {
  await blocking_wait();
  select1 = i;
  accesses++;
  return array[i];
}

async function set_array_value(i, value) {
  await blocking_wait();
  select2 = i;
  accesses++;
  array[i] = value;
}

async function compare_values(i, j) {
  comparisons++;
  await blocking_wait();
  return i - j;
}

async function shuffle_array() {
  let j, x, i;
  for (i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = await get_array_value(i);
    await set_array_value(i, await get_array_value(j));
    await set_array_value(j, x);
  }
}


function init_array() {
  array = [];
  for(let i = 0; i < vm.size; i++) {
    array.push(i + 1);
  }
}

async function finish_array() {
  for(let i = 0; i < array.length; i++) {
    await get_array_value(i);
    await get_array_value(i);
    await get_array_value(i);
    await get_array_value(i);
    await get_array_value(i);
    await get_array_value(i);
    verified++;
  }
}


function draw_array_circle(p) {
  let radius = p.min(p.width, p.height) / 2;
  let cx = p.width/2;
  let cy = p.height/2;

  for(let i = 0; i < array.length; i++) {
    let a = p.map(i, 1, array.length, 0, p.TWO_PI) - p.HALF_PI;
    let r = radius - p.map(p.abs(array[i] - i), 0, array.length, 0, radius);
    p.strokeWeight(1);
    if(i == select1) {
      p.stroke(0, 0, 100);
      p.fill(0, 0, 255);
    } else if(i == select2) {
      p.stroke(100, 0, 0);
      p.fill(255, 0, 0);
    } else if(i <= verified) {
      p.stroke(0, 100, 0);
      p.fill(0, 255, 0);
    } else {
      p.stroke(0);
      p.colorMode(p.HSB, array.length, array.length, array.length);
      p.fill(array[i], array.length, array.length);
      p.colorMode(p.RGB);
    }
    p.arc(cx, cy, r*2, r*2, a - p.radians(360/array.length)/2, a + p.radians(360/array.length)/2)
    //p.line(cx, cy, cx + p.cos(a) * r, cy + p.sin(a) * r);
  }

}

function draw_array (p) {

  for(let i = 0; i < array.length; i++) {
    if(i == select1) {
      p.stroke(0, 0, 100);
      p.fill(0, 0, 255);
    } else if(i == select2) {
      p.stroke(100, 0, 0);
      p.fill(255, 0, 0);
    } else if(i <= verified) {
      p.stroke(0, 100, 0);
      p.fill(0, 255, 0);
    } else {
      p.stroke(0);
      p.fill(50, 50, 50);
    }
    p.rect(p.width/array.length * i, p.height, p.width/array.length, -p.height/array.length * array[i]);
  }
}
let sketch = function (p) {
  p.setup = function() {
    osc = new p5.TriOsc();
    osc.amp(0.5);
    osc.freq(0);
    init_array();
    //p.createCanvas(800, 600, p.WEBGL);
    p.windowResized();
  }
  p.draw = function () {
    vm.accesses += accesses;
    accesses = 0;
    vm.comparisons += comparisons;
    comparisons = 0;
    p.background(255, 255, 255);
    vm.drawingFunction(p);
    if(select1 != null) {
      osc.amp(0.1, 0.01);
      osc.freq(array[select1] / array.length * 1000)
    } else {
      osc.freq(0);
      osc.amp(0, 0.01);
    }

    select1 = select2 = null;
  }
  p.mousePressed = function () {

  }
  p.windowResized = function () {
    p.resizeCanvas(document.getElementById('canvas-wrapper').offsetWidth, document.getElementById('canvas-wrapper').offsetHeight);
  }
}

new p5(sketch, 'canvas-wrapper');
