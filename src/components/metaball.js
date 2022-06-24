class Metaball {
    constructor(parent) {
        var minR = 30, maxR = 100;  // min and max radius
        var maxV = 1; // vax velocity
        this.collection = parent;
        this.r = Math.floor(Math.random()*(maxR-minR))+minR; // radius
        var randx = Math.floor(Math.random()*(this.collection.size.width-(2*this.r)))+this.r;
        var randy = Math.floor(Math.random()*(this.collection.size.height-(2*this.r)))+this.r; 
        this.pos = {x:randx,y:randy};
        this.vel = {x:Math.random()*2*maxV-maxV,y:Math.random()*2*maxV-maxV};
    }

    component (x,y) {
        var r = this.r;
        var dx = (x-this.pos.x);
        var dy = (y-this.pos.y);
        return ((r*r)/((dx*dx)+(dy*dy))) || 0
    };

    collision () {
        var px = this.pos.x;
        var py = this.pos.y;
        var vx = this.vel.x;
        var vy = this.vel.y;
        var r = this.r;
        // x-axis bounce
        if (px+vx+r>=this.collection.size.width || px+vx-r<=0) {
            this.vel.x = vx * (-1);
        }
        // y-axis bounce
        if (py+vy+r>=this.collection.size.height || py+vy-r<=0) {
            this.vel.y = vy * (-1);
        }
    }

    update() {
        if (true/*running*/) {
            this.collision();
            var vx = this.vel.x;
            var vy = this.vel.y;
            this.pos.x += vx;
            this.pos.y += vy;
        }
    }

}
export default Metaball;