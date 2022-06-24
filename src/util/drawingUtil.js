// ---------- Start Draw Helpers ---------- //
export function rgbToHex(r,g,b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// export function fillRect(x,y,w,h){
//     fill(85,85,85);
//     stroke(0,a=0);
//     rect(x,y,w,h);
// }

export function drawText(c,s,x,y){
    c.fill(0,180,220);
    c.strokeWeight(0);
    c.textSize(8);
    c.textAlign("center","center");
    c.text(s,x,y);
}

export function drawLine(c,x1,y1,x2,y2,color){
    c.beginPath(); 
    c.moveTo(x1,y1);
    c.lineTo(x2,y2);
    c.lineWidth = 2;
    c.strokeStyle = color || "#ffffff";
    c.stroke();
    c.closePath();
}

export function drawVLine(c,x,size){
    c.beginPath(); 
    c.moveTo(x+0.5,0);
    c.lineTo(x+0.5,size.height);
    c.lineWidth = 1;
    c.strokeStyle = "#b3b3b3"
    c.stroke();
    c.closePath();
}

export function drawHLine(c,y,size){
    c.beginPath(); 
    c.moveTo(0,y+0.5);
    c.lineTo(size.width,y+0.5);
    c.lineWidth = 1;
    c.strokeStyle = "#b3b3b3"
    c.stroke();
    c.closePath();
}

export function drawCircle(c,x,y,r){
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2)
    c.lineWidth=0.5;
    c.strokeStyle = "#ffffff"
    c.stroke();
    c.closePath();    
}
// ---------- End Draw Helpers ----------//