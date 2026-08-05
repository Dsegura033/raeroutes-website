/* =====================================================
        RAE ROUTES - TRAVEL KEEPSAKES
        FULL SCRIPT
====================================================== */


/* =====================================================
        GLOBAL VARIABLES
====================================================== */


let selectedFilm = "vintage";

let boothPhotos = [];

let postcardPhoto = null;

let cameraStream = null;

let currentMode = "camera";





/* =====================================================
        ELEMENTS
====================================================== */


const photoTab = document.getElementById("photoBoothTab");
const postcardTab = document.getElementById("postcardTab");

const photoSection = document.getElementById("photoBooth");
const postcardSection = document.getElementById("postcard");

const filmCards = document.querySelectorAll(".film-card");

const startButton = document.getElementById("startBooth");

const cameraButton = document.getElementById("cameraMode");
const uploadButton = document.getElementById("uploadMode");

const cameraVideo = document.getElementById("cameraPreview");

const uploadInput = document.getElementById("photoUpload");

const countdownDisplay =
document.querySelector(".countdown-display");

const photoStatus =
document.querySelector(".photo-status");

const canvas =
document.getElementById("filmCanvas");

const downloadButton =
document.querySelector(".download-button");

const restartButton =
document.querySelector(".restart-button");







/* =====================================================
        TAB SWITCHING
====================================================== */


if(photoTab && postcardTab){


photoTab.addEventListener("click",()=>{


photoSection.style.display="block";

postcardSection.style.display="none";


});



postcardTab.addEventListener("click",()=>{


photoSection.style.display="none";

postcardSection.style.display="block";


});


}




if(postcardSection){

postcardSection.style.display="none";

}








/* =====================================================
        FILM STYLE PICKER
====================================================== */


filmCards.forEach(card=>{


card.addEventListener("click",()=>{


filmCards.forEach(item=>{

item.classList.remove("selected");

});


card.classList.add("selected");


selectedFilm = card.dataset.style;



});


});









/* =====================================================
        CAMERA
====================================================== */



async function openCamera(){


try{


cameraStream = await navigator.mediaDevices.getUserMedia({

video:{
facingMode:"user"
},

audio:false

});



if(cameraVideo){


cameraVideo.srcObject=cameraStream;


}



}

catch(error){


alert(

"Camera unavailable. Please upload photos instead."

);


}



}





if(cameraButton){


cameraButton.addEventListener("click",()=>{


currentMode="camera";

openCamera();


});


}








/* =====================================================
        UPLOAD MODE
====================================================== */


if(uploadButton){


uploadButton.addEventListener("click",()=>{


currentMode="upload";


uploadInput.click();


});


}






if(uploadInput){


uploadInput.addEventListener("change",(event)=>{


boothPhotos=[];


const files=[...event.target.files].slice(0,4);



files.forEach(file=>{


const reader=new FileReader();


reader.onload=e=>{


boothPhotos.push(e.target.result);


};


reader.readAsDataURL(file);



});



});


}









/* =====================================================
        COUNTDOWN
====================================================== */



function delay(time){

return new Promise(resolve=>setTimeout(resolve,time));

}




async function countdown(){


for(let number=3; number>0; number--){


countdownDisplay.textContent=number;


await delay(1000);


}


countdownDisplay.textContent="📸";


flash();


await delay(500);


countdownDisplay.textContent="";


}







function flash(){


document.body.classList.add("camera-flash");


setTimeout(()=>{


document.body.classList.remove("camera-flash");


},300);


}









/* =====================================================
        START PHOTO BOOTH
====================================================== */


if(startButton){


startButton.addEventListener("click",async()=>{


boothPhotos=[];



for(let i=1;i<=4;i++){


photoStatus.textContent=
`Photo ${i} of 4`;



await countdown();



if(currentMode==="camera"){


boothPhotos.push(
capturePhoto()
);


}



}



photoStatus.textContent=
"Developing your memories...";



await delay(2500);



createFilmStrip();



});


}









/* =====================================================
        CAPTURE CAMERA PHOTO
====================================================== */


function capturePhoto(){


const tempCanvas=
document.createElement("canvas");


tempCanvas.width=
cameraVideo.videoWidth || 500;


tempCanvas.height=
cameraVideo.videoHeight || 400;



const ctx=
tempCanvas.getContext("2d");



ctx.drawImage(

cameraVideo,

0,

0,

tempCanvas.width,

tempCanvas.height

);



return tempCanvas.toDataURL("image/png");



}









/* =====================================================
        FILM STRIP CREATOR
====================================================== */


function createFilmStrip(){


if(!canvas)return;


canvas.width=320;

canvas.height=1000;



const ctx=
canvas.getContext("2d");



ctx.fillStyle=
getFilmColor();



ctx.fillRect(

0,

0,

canvas.width,

canvas.height

);





boothPhotos.forEach((photo,index)=>{


const image=new Image();



image.onload=()=>{


ctx.drawImage(

image,

40,

70+(index*220),

240,

160

);



};



image.src=photo;



});



}






function getFilmColor(){


switch(selectedFilm){


case "passport":

return "#1f355f";


case "coastal":

return "#42b9c2";


case "scrapbook":

return "#efd7b5";


case "classic":

return "#111";


default:

return "#9b6b43";


}



}









/* =====================================================
        DOWNLOAD FILM
====================================================== */


if(downloadButton){


downloadButton.addEventListener("click",()=>{


const link=document.createElement("a");


link.download=
"RaeRoutes-Travel-Keepsake.png";


link.href=
canvas.toDataURL();


link.click();



});


}








/* =====================================================
        RESTART
====================================================== */


if(restartButton){


restartButton.addEventListener("click",()=>{


boothPhotos=[];


photoStatus.textContent=
"Photo 0 of 4";


countdownDisplay.textContent="";


canvas
.getContext("2d")
.clearRect(
0,
0,
canvas.width,
canvas.height
);



});


}









/* =====================================================
        POSTCARD CREATOR
====================================================== */


const postcardInputs =
document.querySelectorAll(
".postcard-details input, .postcard-details textarea"
);


const postcardPreview =
document.querySelector(".postcard-preview");



postcardInputs.forEach(input=>{


input.addEventListener("input",updatePostcard);


});





function updatePostcard(){


if(!postcardPreview)return;



const destination=
postcardInputs[0]?.value || "Your Destination";


const date=
postcardInputs[1]?.value || "Your Date";


const message=
postcardInputs[2]?.value || "Your Memory";


const name=
postcardInputs[3]?.value || "Traveler";



postcardPreview.innerHTML=`

<h2>${destination}</h2>

<p>${date}</p>

<p>${message}</p>

<p>— ${name}</p>

`;



}









/* =====================================================
        POSTCARD PHOTO UPLOAD
====================================================== */


const postcardUpload =
document.querySelector(".postcard-photo input");



if(postcardUpload){


postcardUpload.addEventListener("change",e=>{


const file=e.target.files[0];


const reader=new FileReader();


reader.onload=function(event){


postcardPhoto=
event.target.result;


postcardPreview.style.backgroundImage=
`url(${postcardPhoto})`;


};



reader.readAsDataURL(file);



});



}








/* =====================================================
        FAQ
====================================================== */


const faqItems =
document.querySelectorAll(".faq-item");



faqItems.forEach(item=>{


const question =
item.querySelector("h3");


const answer =
item.querySelector("p");



answer.style.display="none";



question.style.cursor="pointer";



question.addEventListener("click",()=>{


answer.style.display =
answer.style.display==="none"
?
"block"
:
"none";



});


});









/* =====================================================
        CAMERA CLEANUP
====================================================== */


window.addEventListener("beforeunload",()=>{


if(cameraStream){


cameraStream.getTracks()
.forEach(track=>track.stop());


}



});
