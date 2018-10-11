

var mousedown = false;
var last_mousex = last_mousey = 0;
var mousex = mousey = 0;
var mousedown = false;
var rectROI;
var click_state =0 ;


let imgElement = document.getElementById('imageOriginal');
let inputElement = document.getElementById('imageInput');
let inputCanvas = document.getElementById('inputCanvas');
let imageCanvas_header = document.getElementById("imageCanvas_header");
let imageCanvas_combine = document.getElementById("imageCanvas_combine");


let mat;
let arrCircles;
let dst_org = null;
let gb_count=0 ;
let Img_scale = 1.0;
let zoom_factor = 1.0;
let dsp_org = null;
let last_processing_time = 0;



function getMousePos(canvas, evt) {

  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}


function FindPosition(oElement)
{
  if(typeof( oElement.offsetParent ) != "undefined")
  {
    for(var posX = 0, posY = 0; oElement; oElement = oElement.offsetParent)
    {
      posX += oElement.offsetLeft;
      posY += oElement.offsetTop;
    }
    return [ posX, posY ];
  }
  else
  {
    return [ oElement.x, oElement.y ];
  }
}



function initDraw(canvas) {
  var mouse = {
    x: 0,
    y: 0,
    startX: 0,
    startY: 0,
    offSetX: 0,
    offSetY: 0
  };
  function setMousePosition(e) {
        var ev = e || window.event; //Moz || IE
        if (ev.pageX) { //Moz
          mouse.x = ev.pageX + window.pageXOffset;
          mouse.y = ev.pageY + window.pageYOffset;
        } else if (ev.clientX) { //IE
          mouse.x = ev.clientX + document.body.scrollLeft;
          mouse.y = ev.clientY + document.body.scrollTop;
        }
        let ImgPos = FindPosition(inputCanvas);
        mouse.offSetX = ImgPos[0];
        mouse.offSetY = ImgPos[1];

      };
      var element = null;

      canvas.onmousedown = function (e) {
       setMousePosition(e);

       last_mousex = parseInt(e.pageX-mouse.offSetX);
       last_mousey = parseInt(e.pageY-mouse.offSetY);
       mousedown = true;


     }
     canvas.onmouseup = function (e) {
       mousedown = false;
     }

     canvas.onmousemove = function (e) {
      setMousePosition(e);
      let x = e.pageX - mouse.offSetX;
      let y = e.pageY - mouse.offSetY;
        /*if (element !== null) {
            element.style.width = Math.abs(mouse.x - mouse.startX) + 'px';
            element.style.height = Math.abs(mouse.y - mouse.startY) + 'px';
            element.style.left = (mouse.x - mouse.startX < 0) ? mouse.x - mouse.offSetX + 'px' : mouse.startX - mouse.offSetX + 'px';
            element.style.top = (mouse.y - mouse.startY < 0) ? mouse.y - mouse.offSetY + 'px' : mouse.startY-mouse.offSetY + 'px';
          }*/
          if ( mousedown == true && ( x>last_mousex ) && (y>last_mousey) ){

           var ctx = canvas.getContext('2d');
	ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
        //let dst = dsp_org.clone();
        let p1 = new cv.Point(last_mousex,last_mousey);
        let p2 = new cv.Point(x,y);
        let dsp = dsp_org.clone();
        cv.rectangle(dsp,p1,p2,[255,0,0,255],2);

        rectROI = new cv.Rect(last_mousex,last_mousey, x - last_mousex, y - last_mousey);
        //console.log ("rectROI = [" + last_mousex + "," + last_mousey + "," + x + "," + y + "]"):
        cv.imshow('inputCanvas',dsp); 
        dsp.delete();
        //ctx.beginPath();
        //var width = x - last_mousex;
        //var height = y - last_mousey;
        //ctx.rect(last_mousex,last_mousey,width,height);
        //ctx.strokeStyle = 'black';
        //ctx.lineWidth = 10;
        //ctx.stroke();
      }
	//document.getElementById('mouse_result').innerHTML = "(" + String(last_mousex) + "," + String(last_mousey) + ") - (" + x + "," + y + ")";


}
canvas.onclick = function (e) {
  setMousePosition(e);

  if ( click_state == 0) {
    last_mousex = parseInt(e.pageX-mouse.offSetX);
    last_mousey = parseInt(e.pageY-mouse.offSetY);
    mousedown = true;
    click_state = 1;
  } else {
    click_state = 0;
    let x = e.pageX - mouse.offSetX;
    let y = e.pageY - mouse.offSetY;

    if ( ( x>last_mousex ) && (y>last_mousey)) {
      var ctx = canvas.getContext('2d');
          ctx.clearRect(0,0,canvas.width,canvas.height); //clear canvas
          let p1 = new cv.Point(last_mousex,last_mousey);
          let p2 = new cv.Point(x,y);
          let dsp = dsp_org.clone();
          cv.rectangle(dsp,p1,p2,[255,0,0,255],2);

          rectROI = new cv.Rect(last_mousex,last_mousey, x - last_mousex, y - last_mousey);
          cv.imshow('inputCanvas',dsp); 
          dsp.delete();
        }

        document.getElementById('mouse_result').innerHTML = "click_state = " + String(click_state) +"(" + String(last_mousex) + "," + String(last_mousey) + ") - (" + x + "," + y + ")";

      }
    }
  }




  document.body.classList.add("loading");


  inputElement.addEventListener('change', (e) => {
    imgElement.src = URL.createObjectURL(e.target.files[0]);
  }, false);


  imgElement.onload = function() {
  /*src = cv.imread(imgElement);
  height = src.size().height;
  width = src.size().width;
  
  let max_a = 800;
  let mat = new cv.Mat();

  if (height>width){
  	let scale = height/max_a;
  	
	let dsize = new cv.Size(Math.round(width/scale), max_a);
	cv.resize(src, mat, dsize, 0, 0, cv.INTER_AREA);

  }else{
  	let scale = width/max_a;
	let dsize = new cv.Size(max_a,Math.round(height/scale));
	cv.resize(src, mat, dsize, 0, 0, cv.INTER_AREA);
  }

  cv.imshow('imageCanvas', mat);
  */
  document.getElementById('circlesButton').disabled = false;
  document.getElementById('lbl_status').innerHTML = "Ready";
  imgElement.style.cursor="crosshair";

  //if (dst_org != null) dst_org.delete();

  dst_org = cv.imread(imgElement);
  dsp_org = dst_org.clone();
  cv.imshow('inputCanvas',dst_org);
  zoom_factor = dst_org.size().width/imgElement.style.width;

  rectROI = new cv.Rect(0,0,dst_org.size().width,dst_org.size().height);
  imageCanvas.width = 50;
  imageCanvas.height = 50;
  imageCanvas_header.width = 800;
  imageCanvas_header.height = 75;

  let ctext = imageCanvas.getContext('2d');
  ctext.clearRect(0,0,imageCanvas.width,imageCanvas.height);

  imageCanvas_combine.style.display="none";


  initDraw(document.getElementById('inputCanvas'));

 //document.getElementById('debugCanvas').style.visibility = "hidden";
};

function Img_zoomin(){
  var currWidth = inputCanvas.clientWidth;
  var currHeight = inputCanvas.clientHeight;
  if(currWidth > 2500) return false;
  else{
    var newWidth = currWidth + 100;
    var scale = parseFloat(newWidth/currWidth);
    var newHeight = parseInt(currHeight*scale);  
            //inputCanvas.style.width = newWidth + "px";
           // inputCanvas.style.height = newHeight + "px";
           zoom_factor = dst_org.size().width/newWidth;
           let dsize = new cv.Size(newWidth,newHeight);
           rectROI = new cv.Rect (parseInt(rectROI.x*scale),parseInt(rectROI.y*scale),parseInt(rectROI.width*scale),parseInt(rectROI.height*scale));
           if (dsp_org != null) dsp_org.delete();

           dsp_org = dst_org.clone();
           
           cv.resize(dsp_org, dsp_org, dsize, 0, 0, cv.INTER_AREA);
           let p1 = new cv.Point(rectROI.x,rectROI.y);
           let p2 = new cv.Point(rectROI.x + rectROI.width,rectROI.y + rectROI.height);
           let dsp = dsp_org.clone();
           cv.rectangle(dsp,p1,p2,[255,0,0,255],2);
           cv.imshow ("inputCanvas",dsp);  
           console.log("newWidth ="+newWidth+" newHeight="+newHeight + "scale = " + scale);
           dsp.delete();


         }


       };

       function Img_zoomout(){
        //var myImg = document.getElementById("map");
        var currWidth = inputCanvas.clientWidth;
        var currHeight = inputCanvas.clientHeight;
        if(currWidth < 100) return false;
        else{
         var newWidth = currWidth - 100;
         var scale =  parseFloat(newWidth/currWidth);
         var newHeight = parseInt(currHeight*scale);	
            //inputCanvas.style.width = newWidth + "px";
	    //inputCanvas.style.height = newHeight + "px";

	    zoom_factor = dst_org.size().width/newWidth;
      let dsize = new cv.Size(newWidth,newHeight);

      rectROI = new cv.Rect (parseInt(rectROI.x*scale),parseInt(rectROI.y*scale),parseInt(rectROI.width*scale),parseInt(rectROI.height*scale));
      if (dsp_org != null) dsp_org.delete();

      dsp_org = dst_org.clone();

      cv.resize(dsp_org, dsp_org, dsize, 0, 0, cv.INTER_AREA);
      let p1 = new cv.Point(rectROI.x,rectROI.y);
      let p2 = new cv.Point(rectROI.x + rectROI.width,rectROI.y + rectROI.height);
      let dsp = dsp_org.clone();
      cv.rectangle(dsp,p1,p2,[255,0,0,255],2);

      cv.imshow ("inputCanvas",dsp);	
      console.log("newWidth ="+newWidth+" newHeight="+newHeight + "scale = " + scale);
      dsp.delete();
    }

  };

  function IsResize() {
    var checkBox = document.getElementById("Chk_Resize");
    var text = document.getElementById("txt_Scale");
    if (checkBox.checked == true){
      text.style.display = "block";
    } else {
     text.style.display = "none";
   }
 }


 function DrawCircles(src,circles){
	// draw circles
  let cnt = 0;
  let hd = 70;

  let dst = src.clone();
  let h = dst.size().height;
  let w = dst.size().width;

	//let dsize = new cv.Size(Math.round(w*Img_scale), Math.round(h*Img_scale));
	//cv.resize(dst, dst, dsize, 0, 0, cv.INTER_AREA);
	

	let line_width = parseInt(document.getElementById("txt_linew").value);	
	let disp_fontsize = parseFloat(document.getElementById("txt_disp_fontsize").value);
	let txt_Comment = document.getElementById("txt_Comment").value;
  for (let i = 0; i < circles.length; ++i) {
   let x = circles[i]["x"];
   let y = circles[i]["y"];
   let radius = circles[i]["radius"];
   let type = circles[i]["type"];

   let center = new cv.Point(x, y);
   if ( type == 1){
     cv.circle(dst, center, radius, [0, 255, 0, 255], line_width);
     cv.circle(dst, center,1 ,[0, 0, 255,255],1);
   }else{
     cv.circle(dst, center, radius, [0, 0, 255, 255], line_width);
     cv.circle(dst, center,1 ,[0, 0, 255,255],1);
   }

   cnt = cnt+1;
   let p1 = new cv.Point(x,y);
   cv.putText(dst,String(cnt)+"/"+String(Math.round(radius)), p1,cv.FONT_HERSHEY_TRIPLEX,0.3,[255,255,255,255],1);
 }
        //clear header
/*        for (let i = 0; i < hd; i++) {
          for (let j = 0; j < dst.size().width; j++) {
            dst.ucharPtr(i, j)[0] = 255;
            dst.ucharPtr(i, j)[1] = 255;
            dst.ucharPtr(i, j)[2] = 255;

          }
        }*/
	// get a new date (locale machine date time)
	var date = new Date();
	// get the date as a string
	var n = date.toDateString();
	// get the time as a string
	var time = date.toLocaleTimeString();


  // let pos1 = new cv.Point(10,20);
  // let pos2 = new cv.Point(10,40);
  // let pos3 = new cv.Point(10,60);

  // cv.putText(dst ,"Count : "+ String (cnt), pos1,cv.FONT_HERSHEY_SIMPLEX,disp_fontsize,[0,0,255,255],1);
  // cv.putText(dst ,"Date/Time : " + n + "--"+time + " (" + last_processing_time.toFixed(2) + " sec.)", pos2,cv.FONT_HERSHEY_SIMPLEX,disp_fontsize*0.75,[0,0,0,255],1);
  // cv.putText(dst ,"Comment : "+ txt_Comment, pos3 ,cv.FONT_HERSHEY_SIMPLEX,disp_fontsize*0.75,[0,0,0,255],1);

  var ctx = imageCanvas_header.getContext("2d");

  ctx.clearRect(0,0,imageCanvas_header.width,imageCanvas_header.height);

  ctx.font =  disp_fontsize +  "px Calibri";
  ctx.fillStyle = "#0000FF";
  ctx.fillText("Count : "+ String (cnt),10,20);
  ctx.fillText("Date/Time : " + n + "--"+time + " (" + last_processing_time.toFixed(2) + " sec.)",10,40);
  ctx.fillText("Comment : "+ txt_Comment,10,60);

  cv.imshow('imageCanvas', dst);

  var ctx_combine = imageCanvas_combine.getContext("2d");
  ctx_combine.clearRect(0,0,imageCanvas_combine.width,imageCanvas_combine.height);

  imageCanvas_combine.width = imageCanvas.width;
  imageCanvas_combine.height = imageCanvas_header.height+imageCanvas.height;

  ctx_combine.drawImage(imageCanvas_header,0,0);
  ctx_combine.drawImage(imageCanvas,0,imageCanvas_header.height);

  dst.delete();

}

document.getElementById('circlesButton').onclick = function() {
	
	//this.disabled = true;
	document.getElementById('circlesButton').disabled = true;
	document.getElementById('lbl_status').innerHTML = "<span style='color:#FF0000'> Processing...</span>";
	imageCanvas.style.cursor="progress";
	setTimeout(function(){ processCircleDetection(); }, 10);

}

function processCircleDetection()

{

	let t0 = performance.now();

	//reset array Circles
	arrCircles = [];

	//let mat = cv.imread(imgElement);
	let mat = dsp_org.roi(rectROI);

 height = mat.size().height;
 width = mat.size().width;


 let scale = parseFloat(document.getElementById("txt_Scale").value);

 let chkResize = document.getElementById("Chk_Resize");
 if ( chkResize.checked){
  Img_scale = scale;

  		/*if (height>width){
  			let scale = height/max_a;
  	
			let dsize = new cv.Size(Math.round(width/scale), max_a);
			cv.resize(mat, mat, dsize, 0, 0, cv.INTER_AREA);

  		}else{
  			let scale = width/max_a;
			let dsize = new cv.Size(max_a,Math.round(height/scale));
			cv.resize(mat, mat, dsize, 0, 0, cv.INTER_AREA);
    }*/

    let dsize = new cv.Size(Math.round(width*scale), Math.round(height*scale));
    cv.resize(mat, mat, dsize, 0, 0, cv.INTER_AREA);

  }else{
    Img_scale = 1.0;
  }

  cv.imshow('imageCanvas', mat);

  	//let mat = cv.imread('imageCanvas');
	//dst_org = mat.clone();
	let circles = new cv.Mat();

	cv.cvtColor(mat, mat, cv.COLOR_RGBA2GRAY, 0);
	cv.equalizeHist(mat, mat);
	height = mat.size().height;
	width = mat.size().width;

	//cv.imshow('debugCanvas',mat);

	let ksize = new cv.Size(5, 5);
	// You can try more different parameters
	cv.GaussianBlur(mat, mat, ksize, 0, 0, cv.BORDER_DEFAULT);
	cv.medianBlur(mat, mat, 5);

	var minDist = parseInt(document.getElementById("txt_mindist").value);
	var param1 = parseInt(document.getElementById("txt_param1").value);
	var param2 = parseInt(document.getElementById("txt_param2").value);
	var minRas = parseInt(document.getElementById("txt_minRas").value);
	var maxRas = parseInt(document.getElementById("txt_maxRas").value);

	// You can try more different parameters
	cv.HoughCircles(mat, circles, cv.HOUGH_GRADIENT,
    1, minDist,  param1,param2, minRas, maxRas);

	document.getElementById('circlesButton').disabled = true;
	//document.getElementById('lbl_status').innerHTML = "Processing...";
	//document.getElementById("imageCanvas").style.cursor="crosshair";
	
	for (let i = 0; i < circles.cols; i++){
		let circle = [];

		circle["x"] = circles.data32F[i * 3];
   circle["y"] = circles.data32F[i * 3 + 1];
   circle["radius"] = circles.data32F[i * 3 + 2];
		circle["type"] = 1; //1 = auto, 0 = manual

		arrCircles.push(circle);
	}

	let t1 = performance.now();

	last_processing_time = (t1-t0)/1000; //in sec.

	// draw circles
	DrawCircles(dsp_org.roi(rectROI),arrCircles);	

	/*cnt = 0;
	for (let i = 0; i < circles.cols; ++i) {
    	let x = circles.data32F[i * 3];
    	let y = circles.data32F[i * 3 + 1];
    	let radius = circles.data32F[i * 3 + 2];
    	let center = new cv.Point(x, y);
    	cv.circle(dst, center, radius, [0, 255, 0, 255], 2);

    	cv.circle(dst, center,1 ,[0, 0, 255,255],1)
        cnt = cnt+1

        let p1 = new cv.Point(x,y);
        cv.putText(dst,String(cnt)+"/"+String(Math.round(radius)), p1,cv.FONT_HERSHEY_SIMPLEX,0.3,[255,255,255,255],1)

	}
	let p2 = new cv.Point(width/2,30);
	cv.putText(dst,"("+ String(height)+","+String(width)+") : " + "Count = "+ String (cnt), p2,cv.FONT_HERSHEY_SIMPLEX,0.5,[255,255,255,255],1)
	cv.imshow('imageCanvas', dst);
	*/
	document.getElementById('circlesButton').disabled = false;
	document.getElementById('lbl_status').innerHTML = "Ready";
	document.getElementById("imageCanvas").style.cursor="pointer";


	
	mat.delete();
	circles.delete();


	//frame.delete();
	//this.disabled = false;

};

document.getElementById('button').onclick = function() {
  this.href = document.getElementById("imageCanvas_combine").toDataURL("image/png");
  this.download = "image.png";
};

function onOpenCvReady() {
  document.body.classList.remove("loading");
}


function add_remove_circle(e) {

  var canvas = document.getElementById('imageCanvas');
  var context = canvas.getContext("2d"); 
  let ras = parseInt(document.getElementById('txt_radius').value);
  var pos = getMousePos(canvas, e);
  posx = pos.x;
  posy = pos.y;

  var RadAddRemove = document.getElementById('rad_action');

   //Remove Circle	   
   if (document.getElementById('rad_remove').checked ){

     for (let i = 0 ; i < arrCircles.length ; i++){
       let x = arrCircles[i]["x"];
       let y = arrCircles[i]["y"];
       let r = arrCircles[i]["radius"];

       dist = Math.sqrt((x-posx)*(x-posx)+(y-posy)*(y-posy));
       if ( dist <= r ){
		//context.fillStyle = "#FF0000";
		//context.beginPath();
		//context.arc(x, y, r, 0, 2*Math.PI);
		//context.fill();
		arrCircles.splice(i,1);	
		DrawCircles(dsp_org.roi(rectROI),arrCircles);	
		break;
	}
}
   // Add Circle
 }else if (document.getElementById('rad_add').checked ){
  let newCircle = [];
  newCircle["x"] = posx;
  newCircle["y"] = posy;
  newCircle["radius"] = ras;
  newCircle["type"] = 0;
  arrCircles.push(newCircle);
  DrawCircles(dsp_org.roi(rectROI),arrCircles);
}else{
	//do nothing
}



}


