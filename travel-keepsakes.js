/* =====================================================
        RAE ROUTES - TRAVEL KEEPSAKES
        Interactive Creator Script
====================================================== */


document.addEventListener("DOMContentLoaded", () => {



/* =====================================================
        CREATOR ACCORDIONS
====================================================== */


const creatorToggles = document.querySelectorAll(".creator-toggle");


creatorToggles.forEach(toggle => {


    const content = toggle.nextElementSibling;

    const icon = toggle.querySelector(".toggle-icon");



    // Start closed

    content.style.maxHeight = "0px";

    content.style.overflow = "hidden";

    content.style.transition = "max-height .5s ease";



    toggle.addEventListener("click", () => {



        const isOpen = toggle.classList.contains("active");



        // Close all sections

        creatorToggles.forEach(otherToggle => {


            const otherContent = otherToggle.nextElementSibling;

            const otherIcon = otherToggle.querySelector(".toggle-icon");


            otherToggle.classList.remove("active");


            otherIcon.textContent = "+";


            otherContent.style.maxHeight = "0px";


        });





        // Open clicked section

        if(!isOpen){


            toggle.classList.add("active");


            icon.textContent = "−";


            content.style.maxHeight = content.scrollHeight + "px";


        }



    });



});








/* =====================================================
        GLOBAL VARIABLES
====================================================== */


let selectedFilmStyle = null;

let selectedPostcardStyle = null;


let capturedPhotos = [];

let currentPhoto = 0;


let cameraStream = null;



/* =====================================================
        PHOTO BOOTH ELEMENTS
====================================================== */


const filmCards = document.querySelectorAll(".film-card");


const startButton = document.getElementById("startBooth");


const uploadButton = document.getElementById("uploadMode");


const cameraButton = document.getElementById("cameraMode");


const photoUpload = document.getElementById("photoUpload");


const cameraPreview = document.getElementById("cameraPreview");


const photoStatus = document.querySelector(".photo-status");


const countdownDisplay = document.querySelector(".countdown-display");


const developingScreen = document.querySelector(".developing-screen");


const filmReveal = document.querySelector(".film-reveal");


const canvas = document.getElementById("filmCanvas");


const downloadButton = document.querySelector(".download-button");


const restartButton = document.querySelector(".restart-button");





/* =====================================================
        INITIAL STATES
====================================================== */


if(developingScreen){

    developingScreen.style.display = "none";

}


if(filmReveal){

    filmReveal.style.display = "none";

}


if(cameraPreview){

    cameraPreview.style.display = "none";

}





/* =====================================================
        FILM STYLE SELECTION
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


    try{


        cameraStream = await navigator.mediaDevices.getUserMedia({

            video:true,

            audio:false

        });



        cameraPreview.srcObject = cameraStream;


        cameraPreview.style.display = "block";


    }


    catch(error){


        alert(
            "Camera access was unavailable. Please upload your photos instead."
        );


    }


}






/* =====================================================
        CAMERA BUTTON
====================================================== */


if(cameraButton){


    cameraButton.addEventListener("click", ()=>{


        startCamera();


    });


}







/* =====================================================
        UPLOAD PHOTO MODE
====================================================== */


if(uploadButton){


    uploadButton.addEventListener("click", ()=>{


        photoUpload.click();


    });


}






if(photoUpload){


    photoUpload.addEventListener("change",(event)=>{


        const files = Array.from(event.target.files);



        capturedPhotos = [];



        files.slice(0,4).forEach(file=>{


            const reader = new FileReader();



            reader.onload = (e)=>{


                capturedPhotos.push(e.target.result);



                if(capturedPhotos.length === 4){


                    showDeveloping();


                }



            };



            reader.readAsDataURL(file);



        });



    });


}







/* =====================================================
        START PHOTO BOOTH
====================================================== */


if(startButton){


    startButton.addEventListener("click", ()=>{



        capturedPhotos = [];


        currentPhoto = 0;



        if(!cameraStream){


            startCamera();


        }



        setTimeout(()=>{


            takePhoto();


        },1000);



    });


}








/* =====================================================
        TAKE PHOTOS
====================================================== */


function takePhoto(){



    if(currentPhoto >= 4){


        showDeveloping();


        return;


    }





    if(photoStatus){


        photoStatus.innerHTML = 
        `Photo ${currentPhoto + 1} of 4`;


    }




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



    let count = 3;



    countdownDisplay.innerHTML = count;



    const timer = setInterval(()=>{



        count--;



        if(count > 0){


            countdownDisplay.innerHTML = count;


        }


        else{


            clearInterval(timer);



            countdownDisplay.innerHTML = "📸";



            setTimeout(()=>{


                countdownDisplay.innerHTML = "";

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



    tempCanvas.width =
        cameraPreview.videoWidth || 600;



    tempCanvas.height =
        cameraPreview.videoHeight || 400;




    const ctx = tempCanvas.getContext("2d");




    ctx.drawImage(

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


    if(developingScreen){

        developingScreen.style.display = "block";

    }


    setTimeout(()=>{


        finishFilm();


    },3000);


}







/* =====================================================
        CREATE FILM STRIP
====================================================== */


function createFilmStrip(){


    if(!canvas) return;



    canvas.width = 600;

    canvas.height = 1500;



    const ctx = canvas.getContext("2d");



    // Film background

    ctx.fillStyle = "#111";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );



    let loadedImages = 0;



    capturedPhotos.forEach((photo,index)=>{


        const img = new Image();



        img.onload = ()=>{


            ctx.drawImage(

                img,

                80,

                100 + index * 300,

                440,

                240

            );



            loadedImages++;



            if(loadedImages === capturedPhotos.length){


                drawFilmDecorations(ctx);


                ctx.fillStyle="#ffffff";

                ctx.font="30px cursive";

                ctx.textAlign="center";


                ctx.fillText(

                    "RaeRoutes ✈️",

                    canvas.width / 2,

                    1420

                );


            }



        };



        img.src = photo;


    });



}









/* =====================================================
        COLLECTION DOODLES
====================================================== */


function drawFilmDecorations(ctx){


    ctx.strokeStyle="#ffffff";

    ctx.lineWidth=4;



    switch(selectedFilmStyle){



        case "coastal":


            drawSun(ctx,500,80);

            drawWave(ctx,40,1400);

            drawShell(ctx,520,1350);

            break;





        case "adventure":


            drawMountain(ctx,70,70);

            drawCompass(ctx,520,1350);

            break;





        case "romantic":


            drawHeart(ctx,520,90);

            drawFlower(ctx,70,1350);

            break;





        case "winter":


            drawSnowflake(ctx,520,90);

            drawSnowflake(ctx,80,1350);

            break;



        default:


            drawStar(ctx,520,90);

            drawStar(ctx,80,1350);



    }



}








/* =====================================================
        DOODLE FUNCTIONS
====================================================== */


function drawSun(ctx,x,y){


    ctx.beginPath();

    ctx.arc(x,y,30,0,Math.PI*2);

    ctx.stroke();



    for(let i=0;i<8;i++){


        ctx.beginPath();

        ctx.moveTo(x,y);


        ctx.lineTo(

            x + Math.cos(i)*55,

            y + Math.sin(i)*55

        );


        ctx.stroke();


    }


}







function drawWave(ctx,x,y){


    ctx.beginPath();


    ctx.moveTo(x,y);



    for(let i=0;i<100;i++){


        ctx.lineTo(

            x+i*3,

            y + Math.sin(i/5)*10

        );


    }


    ctx.stroke();


}







function drawShell(ctx,x,y){


    ctx.beginPath();

    ctx.arc(

        x,

        y,

        25,

        Math.PI,

        0

    );


    ctx.stroke();


}







function drawHeart(ctx,x,y){


    ctx.beginPath();


    ctx.moveTo(x,y+20);


    ctx.bezierCurveTo(

        x-40,y-20,

        x-40,y+50,

        x,y+70

    );


    ctx.bezierCurveTo(

        x+40,y+50,

        x+40,y-20,

        x,y+20

    );


    ctx.stroke();


}







function drawSnowflake(ctx,x,y){


    for(let i=0;i<6;i++){


        ctx.beginPath();


        ctx.moveTo(x,y);


        ctx.lineTo(

            x + Math.cos(i)*40,

            y + Math.sin(i)*40

        );


        ctx.stroke();


    }


}







function drawMountain(ctx,x,y){


    ctx.beginPath();


    ctx.moveTo(x,y+80);

    ctx.lineTo(x+50,y);

    ctx.lineTo(x+100,y+80);


    ctx.stroke();


}







function drawCompass(ctx,x,y){


    ctx.beginPath();


    ctx.arc(

        x,

        y,

        35,

        0,

        Math.PI*2

    );


    ctx.stroke();


}







function drawFlower(ctx,x,y){


    ctx.beginPath();


    ctx.arc(

        x,

        y,

        15,

        0,

        Math.PI*2

    );


    ctx.stroke();


}







function drawStar(ctx,x,y){


    ctx.beginPath();


    for(let i=0;i<10;i++){


        const angle = i * Math.PI / 5;


        const radius = i % 2 === 0 ? 25 : 10;


        ctx.lineTo(

            x + Math.cos(angle)*radius,

            y + Math.sin(angle)*radius

        );


    }


    ctx.closePath();


    ctx.stroke();


}








/* =====================================================
        FINISH DEVELOPING
====================================================== */


function finishFilm(){


    createFilmStrip();



    setTimeout(()=>{


        if(developingScreen){

            developingScreen.style.display="none";

        }



        if(filmReveal){

            filmReveal.style.display="block";

        }



    },1000);



}

        /* =====================================================
        FILM REVEAL ANIMATION
====================================================== */


function revealFilmStrip(){


    if(!filmReveal) return;



    filmReveal.style.display = "block";



    const strip = document.querySelector(".film-strip-preview");



    if(strip){


        strip.classList.remove("show-strip");


        setTimeout(()=>{


            strip.classList.add("show-strip");


        },100);



    }



}








/* =====================================================
        DOWNLOAD FILM STRIP
====================================================== */


if(downloadButton){


    downloadButton.addEventListener("click",()=>{


        const link = document.createElement("a");


        link.download = "RaeRoutes-Travel-Keepsake.png";


        link.href = canvas.toDataURL("image/png");


        link.click();



    });



}








/* =====================================================
        RETAKE PHOTO BOOTH
====================================================== */


if(restartButton){


    restartButton.addEventListener("click",()=>{


        capturedPhotos = [];


        currentPhoto = 0;



        if(canvas){


            const ctx = canvas.getContext("2d");


            ctx.clearRect(

                0,

                0,

                canvas.width,

                canvas.height

            );


        }





        if(filmReveal){


            filmReveal.style.display="none";


        }



        if(developingScreen){


            developingScreen.style.display="none";


        }





        if(cameraPreview){


            cameraPreview.style.display="none";


        }





        if(photoStatus){


            photoStatus.innerHTML="Photo 0 of 4";


        }



        countdown.innerHTML="";



    });



}








/* =====================================================
        STOP CAMERA
====================================================== */


function stopCamera(){


    if(cameraStream){


        cameraStream.getTracks().forEach(track=>{


            track.stop();


        });


        cameraStream=null;


    }



}
        /* =====================================================
        POSTCARD CREATOR
====================================================== */


const postcardUploadButton = document.getElementById("postcardUploadButton");

const postcardCameraButton = document.getElementById("postcardCameraButton");

const postcardFile = document.getElementById("postcardPhotoUpload");

const postcardVideo = document.getElementById("postcardCameraPreview");

const postcardPreview = document.querySelector(".postcard-preview");



let selectedPostcardStyle = "vintage";

let postcardImage = "";

let postcardStream = null;





/* =====================================================
        POSTCARD STYLE SELECTION
====================================================== */


const postcardStyles = document.querySelectorAll(
    ".postcard-style-picker button"
);



postcardStyles.forEach((style)=>{


    style.addEventListener("click",()=>{


        postcardStyles.forEach(btn=>{


            btn.classList.remove("selected");


        });



        style.classList.add("selected");



        selectedPostcardStyle = style.innerText;



        updatePostcardPreview();



    });



});








/* =====================================================
        UPLOAD PHOTO
====================================================== */


if(postcardUploadButton){


    postcardUploadButton.addEventListener("click",()=>{


        postcardFile.click();


    });


}






if(postcardFile){


    postcardFile.addEventListener("change",(event)=>{


        const file = event.target.files[0];



        if(!file) return;



        const reader = new FileReader();



        reader.onload = (e)=>{


            postcardImage = e.target.result;


            updatePostcardPreview();



        };



        reader.readAsDataURL(file);



    });



}








/* =====================================================
        POSTCARD CAMERA
====================================================== */


if(postcardCameraButton){


postcardCameraButton.addEventListener("click",async()=>{


    try{


        postcardStream = await navigator.mediaDevices.getUserMedia({

            video:true,

            audio:false

        });



        postcardVideo.srcObject = postcardStream;


        postcardVideo.style.display="block";



    }


    catch(error){


        alert(
        "Camera unavailable. Try uploading a photo instead!"
        );


    }



});



}








/* =====================================================
        LIVE TEXT UPDATES
====================================================== */


const postcardInputs = document.querySelectorAll(

    ".postcard-details input, .postcard-details textarea"

);



postcardInputs.forEach(input=>{


    input.addEventListener("input",()=>{


        updatePostcardPreview();


    });


});








/* =====================================================
        CREATE POSTCARD PREVIEW
====================================================== */


function updatePostcardPreview(){


    if(!postcardPreview) return;



    const destination =
    document.querySelector(
    ".postcard-details input:nth-of-type(1)"
    )?.value || "Your Adventure";



    const date =
    document.querySelector(
    ".postcard-details input:nth-of-type(2)"
    )?.value || "";



    const message =
    document.querySelector(
    ".postcard-details textarea"
    )?.value || "Greetings from somewhere beautiful ✈️";



    const from =
    document.querySelector(
    ".postcard-details input:nth-of-type(3)"
    )?.value || "";





    postcardPreview.innerHTML = `


        <div class="postcard-design ${selectedPostcardStyle}">


            ${
                postcardImage
                ?
                `<img src="${postcardImage}">`
                :
                `<div class="empty-photo">
                    Add your travel photo
                </div>`
            }



            <div class="postcard-writing">


                <h4>${destination}</h4>


                <small>${date}</small>


                <p>${message}</p>


                <span>${from}</span>


            </div>



        </div>


    `;



}




});
