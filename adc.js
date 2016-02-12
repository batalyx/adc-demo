console.log('how come?');


var o = null;

function Kuvaaja(ctx) {
     this.ctx = ctx;
     this.rounding = 0.0;
     this.resolution = 8;
     this.numSamples = 32;
     this.drawSmpl = false;
     this.drawAks = true;
     this.drawFnc = true;
     this.drawAmpLevel = false;

     this.signal2 = function (x) { return 0.6; };
     this.signal = function (x) { return Math.sin(x*(Math.PI/180.0)); }
     this.signalFM = function(x) {
         var p=x*(3.141*2/640.);
         return 0.8*(Math.sin(p+0.5*Math.sin(1.0*p))); }
}

Kuvaaja.prototype.piirräAkselit = function () {
     var ctx = this.ctx;
     var py = ctx.canvas.height/2;
     ctx.strokeStyle = 'rgb(127,127,127)';
     ctx.beginPath();
     ctx.moveTo(0, py);
     ctx.lineTo(ctx.canvas.width, py);
     ctx.moveTo(1, 0);
     ctx.lineTo(1, ctx.canvas.height);
     ctx.stroke();
     ctx.closePath();
     ctx.strokeStyle = 'black';
};

Kuvaaja.prototype.piirräSample = function (ctx) {
     var ctx = this.ctx;
     var py = ctx.canvas.height/2;
     var ft = ctx.fillStyle;
     var step = ctx.canvas.width / this.numSamples;
     var stepSize = step;
     var rounding = Math.pow(2, this.resolution)/2.0;
     console.log("r "+rounding+" "+Math.pow(2, this.resolution)+" "+this.resolution);
     ctx.fillStyle = 'rgb(255,200,200)';

     // drawing "backwards" so that amp.level lines stay under samples
     for (var x=640; x>0; x-=step) {
         var y = this.signal(x);
         if (rounding > 0) y =  Math.round(rounding * y) / rounding ;
         y *= 0.9*(ctx.canvas.height/2.0);
         ctx.fillRect(x, py, stepSize, -y);

         if (stepSize>3) ctx.strokeRect(x, py, stepSize, -y);

         if (this.drawAmpLevel) {
             var ss = ctx.strokeStyle;
             ctx.strokeStyle='rgba(200,200,200,190)';
             ctx.beginPath();
             ctx.moveTo(x,py-y); ctx.lineTo(0,py-y);ctx.stroke();
             ctx.closePath();
             ctx.strokeStyle = ss;
         }
     }
     ctx.fillStyle = ft;
};

Kuvaaja.prototype.piirräFunktio = function (ctx) {
  var ctx = this.ctx;
  var py = ctx.canvas.height/2;
  ctx.beginPath();
  ctx.moveTo(0, py);
  for (var x=0; x<640; ++x) {
      var y = 0.9*(ctx.canvas.height/2.0)*this.signal(x);
      ctx.lineTo(x, py-y);
  }
  ctx.stroke();
  ctx.closePath();
};


Kuvaaja.prototype.draw = function (aks, sample) {
   if (aks == undefined) aks = true;
   if (sample == undefined) sample = false;
   var ctx = this.ctx;
   ctx.fillStyle = 'white';
   ctx.fillRect(0,0, ctx.canvas.width, ctx.canvas.height);
   ctx.strokeStyle = 'black';

   if (this.drawAks) this.piirräAkselit();
   if (this.drawSmpl) this.piirräSample(ctx);
   if (this.drawFnc) this.piirräFunktio(ctx);
};


 document.addEventListener('DOMContentLoaded', function () {
     var cc = document.querySelector('canvas');
     var ctx = cc.getContext('2d');
     
     if (o==null) o = new Kuvaaja(ctx);

     var dfnc = document.getElementById('dfnc');
     var dsmpls = document.getElementById('dsmpls');
     var dlvls = document.getElementById('dlvls');
     var dns = document.getElementById('dns');
     var dpls = document.getElementById('dpls');
     var dmns = document.getElementById('dmns');
     var dbts = document.getElementById('dbts');

     dfnc.addEventListener(
         'click',
         function () { o.drawFnc=event.target.checked; },
         false);
     dfnc.checked = o.drawFnc;

     dsmpls.addEventListener(
         'click',
         function () {
             o.drawSmpl=event.target.checked;
             dlvls.disabled = !o.drawSmpl;
             dns.disabled = !o.drawSmpl;
             dmns.disabled = !o.drawSmpl;
             dpls.disabled = !o.drawSmpl;
         },
         false);
     dlvls.addEventListener(
         'click',
         function () { o.drawAmpLevel=event.target.checked; },
         false);

     dns.value = o.numSamples;
     dns.addEventListener(
         'change',
         function () { o.numSamples = event.target.valueAsNumber; },
         false);

     dpls.addEventListener(
         'click',
         function () { dns.value = ++o.numSamples;},
         false);

     dmns.addEventListener(
         'click',
         function () { dns.value = --o.numSamples; },
         false);

     dbts.value = o.resolution;
     dbts.addEventListener(
         'change',
         function () { o.resolution = event.target.valueAsNumber; },
         false);

     o.draw();
     window.setInterval(function(){
         o.draw();
     }, 500);
 }, false);
