/* =====================================================
        RAE ROUTES - TRAVEL KEEPSAKES
        Full Interactive Script
====================================================== */


document.addEventListener("DOMContentLoaded", () => {


/* =====================================================
        VARIABLES
====================================================== */


let selectedFilmStyle = "vintage";

let capturedPhotos = [];

let currentPhoto = 0;

let cameraStream = null;



const filmCards = document.querySelectorAll(".film-card");

const startButton = document.getElementById("startBooth");

const uploadButton = document.getElementById("uploadMode");

const cameraButton = document.getElementById("cameraMode");

const photoUpload = document.getElementById("photoUpload");

const cameraPreview = document.getElementById("cameraPreview");

const photoStatus = document.querySelector(".photo-status");

const countdown = document.querySelector(".countdown-display");

const developingScreen = document.querySelector(".developing-screen");

const canvas = document.getElementById("filmCanvas");

const downloadButton = document.querySelector(".download-button");

const restartButton = document.querySelector(".restart-button");

const filmReveal = document.querySelector(".film-reveal");



/* =====================================================
        HIDE STARTING SECTIONS
====================================================== */


developingScreen.style.display = "none";

filmReveal.style.display = "none";

cameraPreview.style.display = "none";





/* =====================================================
        FILM STYLE PICKER
====================================================== */


filmCards.forEach(card => {


    card.addEventListener("click", () => {


        filmCards.forEach(item => {

            item.classList.remove("selected");

        });


        card.classList.add("selected");


        selectedFilmStyle = card.dataset.style;


    });


});





/* =====================================================
        CAMERA ACCESS
====================================================== */


async function startCamera(){


    try {


        cameraStream = await navigator.mediaDevices.getUserMedia({

            video:true,

            audio:false

        });


        cameraPreview.srcObject = cameraStream;

        cameraPreview.style.display = "block";


    }


    catch(error){


        alert(
            "Camera access was unavailable. Try uploading your photos instead!"
        );


    }


}





cameraButton.addEventListener("click", () => {

    startCamera();

});






/* =====================================================
        UPLOAD PHOTO MODE
====================================================== */


uploadButton.addEventListener("click", () => {


    photoUpload.click();


});





photoUpload.addEventListener("change", (event)=>{


    const files = Array.from(event.target.files);


    capturedPhotos = [];


    files.slice(0,4).forEach(file=>{


        const reader = new FileReader();


        reader.onload = e=>{


            capturedPhotos.push(e.target.result);


            if(capturedPhotos.length === 4){

                createFilmStrip();

            }


        };


        reader.readAsDataURL(file);


    });



});







/* =====================================================
        START PHOTO BOOTH
====================================================== */


startButton.addEventListener("click", ()=>{


    if(!cameraStream){

        startCamera();

    }


    capturedPhotos = [];

    currentPhoto = 0;


    takePhoto();


});






function takePhoto(){


    if(currentPhoto >=4){


        showDeveloping();


        return;


    }



    photoStatus.innerHTML = 
    `Photo ${currentPhoto + 1} of 4`;



    countdownSequence(()=>{


        captureImage();


        currentPhoto++;


        takePhoto();


    });


}







/* =====================================================
        COUNTDOWN
====================================================== */


function countdownSequence(callback){


    let number = 3;


    countdown.innerHTML = number;



    let timer = setInterval(()=>{


        number--;


        if(number >0){


            countdown.innerHTML = number;


        }


        else{


            clearInterval(timer);


            countdown.innerHTML="📸";


            setTimeout(()=>{


                countdown.innerHTML="";


                callback();


            },700);


        }



    },1000);



}







/* =====================================================
        CAPTURE IMAGE
====================================================== */


function captureImage(){


    const tempCanvas = document.createElement("canvas");


    tempCanvas.width = cameraPreview.videoWidth || 600;

    tempCanvas.height = cameraPreview.videoHeight || 400;



    const context = tempCanvas.getContext("2d");



    context.drawImage(

        cameraPreview,

        0,

        0,

        tempCanvas.width,

        tempCanvas.height

    );



    capturedPhotos.push(

        tempCanvas.toDataURL("image/png")

    );



}








/* =====================================================
        DEVELOPING SCREEN
====================================================== */


function showDeveloping(){


    developingScreen.style.display="block";


    setTimeout(()=>{


        createFilmStrip();


    },3000);



}








/* =====================================================
        CREATE FILM STRIP
====================================================== */


function createFilmStrip(){


    canvas.width = 500;

    canvas.height = 1200;


    const ctx = canvas.getContext("2d");



    ctx.fillStyle="#111";

    ctx.fillRect(

        0,

        0,

        canvas.width,

        canvas.height

    );




    capturedPhotos.forEach((photo,index)=>{


        const img = new Image();


        img.onload=()=>{


            ctx.drawImage(

                img,

                60,

                80 + index*260,

                380,

                210

            );


            ctx.fillStyle="#fff";


            ctx.font="25px Poppins";


            ctx.fillText(

                "RaeRoutes",

                180,

                1150

            );



        };


        img.src=photo;



    });



    applyFilmStyle();



    setTimeout(()=>{


        developingScreen.style.display="none";


        filmReveal.style.display="block";


    },1000);



}








/* =====================================================
        APPLY FILM STYLE
====================================================== */


function applyFilmStyle(){


    if(selectedFilmStyle==="vintage"){


        canvas.style.filter="sepia(30%)";


    }



    if(selectedFilmStyle==="passport"){


        canvas.style.filter="contrast(110%)";


    }



    if(selectedFilmStyle==="coastal"){


        canvas.style.filter="brightness(110%)";


    }



    if(selectedFilmStyle==="scrapbook"){


        canvas.style.filter="saturate(130%)";


    }



    if(selectedFilmStyle==="classic"){


        canvas.style.filter="grayscale(100%)";


    }


}








/* =====================================================
        DOWNLOAD
====================================================== */


downloadButton.addEventListener("click",()=>{


    const link=document.createElement("a");


    link.download="raeroutes-film-strip.png";


    link.href=canvas.toDataURL();


    link.click();



});








/* =====================================================
        RESTART
====================================================== */


restartButton.addEventListener("click",()=>{


    capturedPhotos=[];

    currentPhoto=0;


    filmReveal.style.display="none";

    developingScreen.style.display="none";


    photoStatus.innerHTML="Photo 0 of 4";


});








/* =====================================================
        POSTCARD CREATOR
====================================================== */


const postcardUpload =
document.getElementById("postcardUploadButton");


const postcardFile =
document.getElementById("postcardPhotoUpload");


const postcardPreview =
document.querySelector(".postcard-preview");



postcardUpload.addEventListener("click",()=>{


    postcardFile.click();


});





postcardFile.addEventListener("change",(event)=>{


    const file=event.target.files[0];


    if(!file) return;



    const reader=new FileReader();


    reader.onload=e=>{


        postcardPreview.innerHTML=`

        <img 
        src="${e.target.result}"
        style="max-width:100%; border-radius:15px;">

        `;


    };


    reader.readAsDataURL(file);



});









/* =====================================================
        TAB BUTTONS
====================================================== */


const photoTab=document.getElementById("photoBoothTab");

const postcardTab=document.getElementById("postcardTab");


const photoSection=document.getElementById("photoBooth");

const postcardSection=document.getElementById("postcard");




photoTab.addEventListener("click",()=>{


    photoSection.scrollIntoView({

        behavior:"smooth"

    });


});




postcardTab.addEventListener("click",()=>{


    postcardSection.scrollIntoView({

        behavior:"smooth"

    });


});





});
