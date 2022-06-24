import { rgbToHex } from '../util/drawingUtil';
import Metaball from './metaball';
import { drawCircle, drawLine, drawVLine, drawHLine } from './../util/drawingUtil';

class MetaballCollection {
    constructor(n) {
        this.res=10;
        this.drawOrigCircles = true;
        this.limit = 1
        this.drawMarchingSquares = true;
        this.drawInterp = true;
        this.drawGrid = false;

        this.numBalls=n;
        this.balls=[];
        this.size={width:window.innerWidth, height:window.innerHeight};
        for(var i=0; i<n; i++) {
            this.balls.push(new Metaball(this));
        }
        this.truthy = [];
    }

    addBall() {
        var temp = new Metaball(this)
        this.balls.push(temp);
        this.numBalls++;
    }

    removeBall() {
        this.balls.pop();
        this.numBalls--;
    }

    sumComponents (x,y) {
        var sum = 0;
        this.balls.forEach(ball=>sum+=ball.component(x,y))
        return sum;
    }

    update (ctx) {
        this.balls.forEach(ball=>ball.update());
        this.updateTruthArr();
        this.getCellTypes();
        this.drawBasicMarchingSquares(ctx);

        if (this.drawOrigCircles) {
            // draw actual circles
            this.balls.forEach(ball=>{drawCircle(ctx,ball.pos.x,ball.pos.y,ball.r)})
        }
    }

    updateTruthArr() {
        this.truthy = [];
        var temp = [];
        for (var j=0; j<this.size.height; j+=this.res) {
            for (var i=0; i<this.size.width; i+=this.res) { 
                if (this.sumComponents(i,j)>=this.limit) {
                    temp.push(1);
                } else {
                    temp.push(0);
                }
            }
            this.truthy.push(temp);
            temp = [];
        }
        //console.log(this.truthy);
        return this.truthy;
    }

    getCellTypes() {
        this.types = [];
        var temp = [];
        for (var j=0; j<this.truthy.length-1; j++) {
            for (var i=0; i<this.truthy[0].length-1; i++) { 
                //console.log(this.truthy[j][i]);
                temp.push(`0b${this.truthy[j][i]}${this.truthy[j][i+1]}${this.truthy[j+1][i]}${this.truthy[j+1][i+1]}`);
            }
            this.types.push(temp);
            temp = [];
        }
    }

    interpX(x1,x2,y) {
        return (x2-x1)*((this.limit-this.sumComponents(x1,y))/(this.sumComponents(x2,y)-this.sumComponents(x1,y)))
    }
    interpY(y1,y2,x) {
        return (y2-y1)*((this.limit-this.sumComponents(x,y1))/(this.sumComponents(x,y2)-this.sumComponents(x,y1)))
    }

    drawBasicMarchingSquares(ctx) {
        if (this.drawMarchingSquares) {
            //strokeWeight(1.5);
            //stroke(255,255,255);
            var mx = 0.5;
            var my = 0.5;
            var mx1=0.5;
            var mx2=0.5;
            var my1=0.5;
            var my2=0.5;
            var r = 50;
            var g = 50;
            var b = 50;
            var color, dist, maxdist, cmap;
            for (var j=0; j<this.types.length; j++) {
                for (var i=0; i<=this.types[0].length; i++) {
                    if (this.types[j][i] !== '0b0000' && this.types[j][i] !== '0b1111') {  //0:NW, 1:NE, 2:SW, 3:SE)
                        maxdist = Math.sqrt((this.size.width/2)**2 + (this.size.height/2)**2);
                        dist =  Math.sqrt(((this.res*i)-this.size.width/2)**2 + ((this.res*j)-this.size.height/2)**2);
                        cmap = dist/(maxdist);
                        g = Math.floor((cmap)*255)
                        b = Math.floor((1-cmap)*255)
                        // g = Math.floor((1-(res*i)/size.width)*255)
                        // b = Math.floor((res*i)/size.width*255)
                        color = rgbToHex(r,g,b);

                        if (this.types[j][i] === '0b1000' || 
                            this.types[j][i] === '0b0111' || 
                            this.types[j][i] === '0b0110') {
                            if (this.drawInterp) {
                                mx = this.interpX(this.res*i,this.res*(i+1),this.res*j)/this.res;
                                my = this.interpY(this.res*j,this.res*(j+1),this.res*i)/this.res;
                            }
                            drawLine(ctx,this.res*i,this.res*(j+my),this.res*(i+mx),this.res*j,color); 
                        }
                        if (this.types[j][i] === '0b0100' ||
                            this.types[j][i] === '0b1011' ||
                            this.types[j][i] === '0b1001') {
                            if (this.drawInterp) {
                                mx = this.interpX(this.res*i,this.res*(i+1),this.res*j)/this.res;
                                my = this.interpY(this.res*j,this.res*(j+1),this.res*(i+1))/this.res;
                            }
                            drawLine(ctx,this.res*(i+mx),this.res*j,this.res*(i+1),this.res*(j+my),color); 
                        }
                        if (this.types[j][i] === '0b0010' ||
                            this.types[j][i] === '0b1101' ||
                            this.types[j][i] === '0b1001') {
                            if (this.drawInterp) {
                                mx = this.interpX(this.res*i,this.res*(i+1),this.res*(j+1))/this.res;
                                my = this.interpY(this.res*j,this.res*(j+1),this.res*(i))/this.res;    
                            }
                            drawLine(ctx,this.res*i,this.res*(j+my),this.res*(i+mx),this.res*(j+1),color); 
                        }
                        if (this.types[j][i] === '0b0001' ||
                            this.types[j][i] === '0b1110' ||
                            this.types[j][i] === '0b0110') {
                            if (this.drawInterp) {
                                mx = this.interpX(this.res*i,this.res*(i+1),this.res*(j+1))/this.res;
                                my = this.interpY(this.res*j,this.res*(j+1),this.res*(i+1))/this.res; 
                            }
                            drawLine(ctx,this.res*(i+mx),this.res*(j+1),this.res*(i+1),this.res*(j+my),color); 
                        }
                        if (this.types[j][i] === '0b0011' || 
                            this.types[j][i] === '0b1100') {
                            if (this.drawInterp) {
                                my1 = this.interpY(this.res*j,this.res*(j+1),this.res*i)/this.res;
                                my2 = this.interpY(this.res*j,this.res*(j+1),this.res*(i+1))/this.res;
                            }
                            drawLine(ctx,this.res*i,this.res*(j+my1),this.res*(i+1),this.res*(j+my2),color); 
                        }
                        if (this.types[j][i] === '0b0101' ||
                            this.types[j][i] === '0b1010') {
                            if (this.drawInterp) {
                                mx1 = this.interpX(this.res*i,this.res*(i+1),this.res*j)/this.res;
                                mx2 = this.interpX(this.res*i,this.res*(i+1),this.res*(j+1))/this.res;        
                            }
                            drawLine(ctx,this.res*(i+mx1),this.res*j,this.res*(i+mx2),this.res*(j+1),color);
                        }
                    }
                    if (this.drawGrid && this.res>=4) { // grid vertical
                        drawVLine(ctx, i*this.res, this.size);
                    }
                }
                if (this.drawGrid && this.res>=4) { // grid vertical
                    drawHLine(ctx,j*this.res, this.size);
                }
            }
        }
    }
}

export default MetaballCollection;