let p1 = document.getElementById("p1");
let p2 = document.getElementById("p2");
let blocks1 = p1.getElementsByClassName("block");
let blocks2 = p2.getElementsByClassName("block");
let positions = ["row1 col1","row1 col2","row1 col3","row1 col4","row1 col5","row2 col1","row2 col2","row2 col3","row2 col4","row2 col5","row3 col1","row3 col2","row3 col3","row3 col4","row3 col5","row4 col1","row4 col2","row4 col3","row4 col4","row4 col5","row5 col1","row5 col2","row5 col3","row5 col4","row5 col5"];
let colors = ["red","red","red","red","orange","orange","orange","orange","yellow","yellow","yellow","yellow","white","white","white","white","green","green","green","green","blue","blue","blue","blue"];
let refblocks = document.getElementsByClassName("refblock");
let result = document.getElementById("result");
let cancel = document.getElementById("cancel");
let resume = document.getElementById("resume");
let pause = document.getElementById("pause");
let rep = document.getElementById("rep");
let record = document.getElementById("record");
let upBt1 = document.getElementById("up1");
let downBt1 = document.getElementById("down1");
let leftBt1 = document.getElementById("left1");
let rightBt1 = document.getElementById("right1");
let enterBt1 = document.getElementById("submit1");
let hide = document.getElementById("hide");
let high = 999999;
let cocolors1;
let coposition1;
// corresponding html div element
let corres1;
let timer;

cancel.addEventListener("click",remove,false);
document.getElementById("replay").addEventListener("click",replay,false);
resume.addEventListener("click",back,false);
rep.addEventListener("click",replay,false);
hide.addEventListener("click",hideTime,false);

replay();

// activate arrows
function act(){
    document.addEventListener("keydown",game,false);
    upBt1.addEventListener("click",up,false);
    downBt1.addEventListener("click",down,false);
    leftBt1.addEventListener("click",left,false);
    rightBt1.addEventListener("click",right,false);
    enterBt1.addEventListener("click",enter,false);
}

function hideTime(){
    document.getElementById("count").style.setProperty("visibility","hidden");
    hide.removeEventListener("click",hideTime,false);
    hide.textContent = "Show Time";
    hide.addEventListener("click",showTime,false);
}

function showTime(){
    document.getElementById("count").style.setProperty("visibility","visible");
    hide.removeEventListener("click",showTime,false);
    hide.textContent = "Hide Time";
    hide.addEventListener("click",hideTime,false);
}

// remove the result box
function remove(){
    result.style.setProperty("visibility","hidden");
    resume.style.setProperty("visibility","hidden");
    rep.style.setProperty("visibility","visible");
    pause.removeEventListener("click",stop,false);
}

// resume
function back(){
    result.style.setProperty("visibility","hidden");
    resume.style.setProperty("visibility","hidden");
    act();
    timer = setInterval(time,100);
}

// pause
function stop(){
    result.style.setProperty("visibility","visible");
    resume.style.setProperty("visibility","visible");
    document.removeEventListener("keydown",game,false);
    upBt1.removeEventListener("click",up,false);
    downBt1.removeEventListener("click",down,false);
    leftBt1.removeEventListener("click",left,false);
    rightBt1.removeEventListener("click",right,false);
    enterBt1.removeEventListener("click",enter,false);
    document.getElementById("output").textContent = "Paused";
    clearInterval(timer);
}

// make timer works
function time(){
    count+=0.1;
    document.getElementById("time").textContent = "Time used: "+parseFloat(count).toFixed(1)+"s";
}

function replay(){
    result.style.setProperty("visibility","hidden");
    resume.style.setProperty("visibility","hidden");
    rep.style.setProperty("visibility","hidden");
    pause.addEventListener("click",stop,false);
    act();
    count = 0;
    timer = setInterval(time,100);

    cocolors1 = colors.slice();
    coposition1 = positions.slice();
    corres1 = positions.slice();
    for (let i of refblocks){
        let num = Math.floor(cocolors1.length*Math.random());
        i.className = cocolors1[num]+" refblock";
        cocolors1.splice(num,1);
    }
    for (let i of blocks1){
        let num = Math.floor(coposition1.length*Math.random());
        i.className = i.className.split(" ").slice(0,2).join(" ");
        i.className = i.className+" "+coposition1[num];
        corres1[positions.indexOf(coposition1[num])] = i;
        coposition1.splice(num,1);
    }

    coposition2 = positions.slice();
    corres2 = positions.slice();
    for (let i of blocks2){
        let num = Math.floor(coposition2.length*Math.random());
        i.className = i.className.split(" ").slice(0,2).join(" ");
        i.className = i.className+" "+coposition2[num];
        corres2[positions.indexOf(coposition2[num])] = i;
        coposition2.splice(num,1);
    }
}

//arrow keys
function up(){
    index = positions.indexOf(coposition[0])+5;
    if (index<positions.length){
        temp = corres[index].className.split(" ");
        temp.push(coposition[0]);
        coposition[0] = temp.splice(2,2).join(" ");
        corres[index].className = temp.join(" ");
        corres[index-5] = corres[index];
        corres[index] = null;
    }
}
function down(){
    index = positions.indexOf(coposition[0])-5;
    if (index>=0){
        temp = corres[index].className.split(" ");
        temp.push(coposition[0]);
        coposition[0] = temp.splice(2,2).join(" ");
        corres[index].className = temp.join(" ");
        corres[index+5] = corres[index];
        corres[index] = null;
    }
}
function left(){
    index = positions.indexOf(coposition[0])+1;
    if (index>=0 && index%5!=0){
        temp = corres[index].className.split(" ");
        temp.push(coposition[0]);
        coposition[0] = temp.splice(2,2).join(" ");
        corres[index].className = temp.join(" ");
        corres[index-1] = corres[index];
        corres[index] = null;
    }
}
function right(){
    index = positions.indexOf(coposition[0])-1;
    if (index<=positions.length && (index+1)%5!=0){
        temp = corres[index].className.split(" ");
        temp.push(coposition[0]);
        coposition[0] = temp.splice(2,2).join(" ");
        corres[index].className = temp.join(" ");
        corres[index+1] = corres[index];
        corres[index] = null;
    }
}
function enter(){
    clearInterval(timer);
    document.removeEventListener("keydown",game,false);
    upBt.removeEventListener("click",up,false);
    downBt.removeEventListener("click",down,false);
    leftBt.removeEventListener("click",left,false);
    rightBt.removeEventListener("click",right,false);
    enterBt.removeEventListener("click",enter,false);
    compare = [6,7,8,11,12,13,16,17,18];
    point = 0;
    result.style.setProperty("visibility","visible");
    document.getElementById("output").textContent = "Error";
    resume.style.setProperty("visibility","visible");
    for (let i = 0;i<9;i++){
        color = corres[compare[i]].className.split(" ")[0];
        refcolor = refblocks[i].className.split(" ")[0];
        if (color == refcolor){
            point++;
        }
    }
    if (point==9){
        showTime();
        document.getElementById("output").textContent = "You Win!";
        resume.style.setProperty("visibility","hidden");
        if (count<high){
            high = count.toFixed(1);
            record.textContent = "personal record: "+String(high)+"s";
        }
    }
    else{
        document.getElementById("output").textContent = "You Failed";
        resume.style.setProperty("visibility","hidden");
    }
}

function game(event){
    if (event.key == "ArrowUp"){
        event.preventDefault();
        up();
    }
    if (event.key == "ArrowDown"){
        event.preventDefault();
        down();
    }
    if (event.key == "ArrowRight"){
        event.preventDefault();
        right();
    }
    if (event.key == "ArrowLeft"){
        event.preventDefault();
        left();
    }
    if (event.key == "Enter"){
        enter();
    }
}