function serv(number) {
  var a = "input";

  var selected = "2";

  var xhttp = new XMLHttpRequest();

  xhttp.open("GET", "server.php?info=1&var=" + selected, true);

  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(this.responseText);
    }
  };
  xhttp.send();
}

var CAN_KILL = true;

var allCubes = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function drawCubes() {
  let cubeSpace = document.getElementById("cubesSpace");
  style = getComputedStyle(cubeSpace);
  let cubeSize = 20;
  for (let y = 0; y < parseInt(style.height.replace("px", "")) / cubeSize; y++){
    console.log("a")
    for (let x = 0; x < parseInt(style.width.replace("px", "")) / cubeSize; x++){
      let html = `<div class="cube" id=${"cube"+x+"_"+y} style="grid-column-start:${x} grid-column-end:${x+1} grid-row-start${y} grid-row-end${y+1}"</div>`;
      cubeSpace.innerHTML += html;
    }
  }
}

function has4Neighbors(x, y) {
  if (x > 0 && x < 19) {
    if (y > 0 && y < 4) {
      if (
        allCubes[y + 1][x] >= 1 &&
        allCubes[y - 1][x] >= 1 &&
        allCubes[y][x + 1] >= 1 &&
        allCubes[y][x - 1] >= 1
      ) {
        return true;
      }
    }
  }
  return false;
}

function recalculateEdgeCubes() {
  for (let y = 0; y < allCubes.length; y++) {
    for (let x = 0; x < allCubes[y].length; x++) {
     // console.log(allCubes[y][x]);
      if (allCubes[y][x] !== 0) {
        if (has4Neighbors(x, y) == false) {
          allCubes[y][x] = 2; //2 means it is exposed
        }
      }
    }
  }
}

drawCubes();
recalculateEdgeCubes();

function deleteCubes(x, y){
  CAN_KILL=false;
  allCubes[y][x]=0;
  console.log(x, y)
  let cubes = document.getElementById("cubesSpace");
  let specificCube = document.getElementById("cube"+x+"_"+y);
  if (specificCube)
  {
    specificCube.style.opacity="0";
  }
  recalculateEdgeCubes();
}


function movePlatform(deltaX){
  
}

function mainGame() {
  let cube = document.getElementById("player");

  let cubeVector = { x: 1, y: 1 };

  function detectCollision(Px, Py) {
    for (let y = 0; y < allCubes.length; y++) {
      for (let x = 0; x < allCubes[y].length; x++) {
        if (allCubes[y][x] == 2) {
          let currentCubePos = { y:100-y*20, x:0+x*20};


          if (currentCubePos.x < Px+20&&
            currentCubePos.x+20 > Px&&
            currentCubePos.y < Py+20&&
            currentCubePos.y+20 > Py)
            {
              deleteCubes(x, y);
              return 2
            }
        }

      }
    }
    return false;
  }
  //let cubeSpace = document.getElementById("gameBoard");

  function loop() {
    let style = getComputedStyle(cube);
    let left = parseFloat(style.left.replace("px", ""));
    let bottom = parseFloat(style.bottom.replace("px", ""));

    if (left >= 380 || left <= 0 || detectCollision(left, bottom) === 1) {
      cubeVector.x *= -1;
    }
    if (bottom >= 150 || detectCollision(left, bottom) === 2) {
      CAN_KILL=true;
      cubeVector.y *= -1;
    }
    if (bottom <= -280) {
      cubeVector.y *= -1;
      //return false;
    }

    cube.style.left = left + cubeVector.x + "px";
    cube.style.bottom = bottom + cubeVector.y + "px";
    //console.log((left + cubeVector.x));

    setTimeout(loop, 0);
  }
  loop();
}

mainGame();
