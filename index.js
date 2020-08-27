function Board(el, row, col) {
	this.el = document.querySelector(el);
	this.row = row;
	this.col = col;
  this.testMode=false;
  this.generateGrid();
  this.reset();
}

//Generate Game Board
Board.prototype.generateGrid=function(){
   this.el.innerHTML="";
   const fragment = document.createDocumentFragment('div');
   for (var i=0; i<this.row; i++) {
     row = this.el.insertRow(i);
     for (var j=0; j<this.col; j++) {
       cell = row.insertCell(j);
       let self=this;
       cell.onclick = function() { 
         self.clickCell(this); 
      };
       var mine = document.createAttribute("data-mine");       
       mine.value = "false";             
       cell.setAttributeNode(mine);
     }
   }
    this.addMines();
}

//Add mines randomly
Board.prototype.addMines =function(){
  for (var i=0; i<(this.row+this.col); i++) {
    var row = Math.floor(Math.random() * this.row);
    var col = Math.floor(Math.random() * this.col);
    var cell = this.el.rows[row].cells[col];
    cell.setAttribute("data-mine","true");
    if (this.testMode) cell.innerHTML="X";
  }
}

//Highlight all mines in red
Board.prototype.revealMines=function(){
  for (var i=0; i<this.row; i++) {
    for(var j=0; j<this.col; j++) {
      var cell = this.el.rows[i].cells[j];
      if (cell.getAttribute("data-mine")=="true") cell.className="mine";
    }
  }
}

//Check Level Completion
Board.prototype.checkLevelCompletion=function(){
  var levelComplete = true;
    for (var i=0; i<this.row; i++) {
      for(var j=0; j<this.col; j++) {
        if ((this.el.rows[i].cells[j].getAttribute("data-mine")=="false") && (this.el.rows[i].cells[j].innerHTML=="")) levelComplete=false;
      }
  }
  if (levelComplete) {
    alert("You Win!");
    this.revealMines();
  }
}

//Event Binding functionality
Board.prototype.clickCell=function(cell) {
  //console.log("Logged");
  //Check if the end-user clicked on a mine
  if (cell.getAttribute("data-mine")=="true") {
    this.revealMines();
    alert("Game Over");
  } else {
    cell.className="clicked";
    //Count and display the number of adjacent mines
    var mineCount=0;
    var cellRow = cell.parentNode.rowIndex;
    var cellCol = cell.cellIndex;
    //alert(cellRow + " " + cellCol);
    for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,this.row-1); i++) {
      for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,this.col-1); j++) {
        if (this.el.rows[i].cells[j].getAttribute("data-mine")=="true") mineCount++;
      }
    }
    cell.innerHTML=mineCount;
    if (mineCount==0) { 
      //Reveal all adjacent cells as they do not have a mine
      for (var i=Math.max(cellRow-1,0); i<=Math.min(cellRow+1,this.row-1); i++) {
        for(var j=Math.max(cellCol-1,0); j<=Math.min(cellCol+1,this.col-1); j++) {
          //Recursive Call
          if (this.el.rows[i].cells[j].innerHTML=="") this.clickCell(this.el.rows[i].cells[j]);
        }
      }
    }
    this.checkLevelCompletion();
  }
}

//Reset Game
Board.prototype.reset=function(){
  let el=document.getElementById("button");
  var self=this;
  el.addEventListener("click",function(){
      self.generateGrid();
  });
}


