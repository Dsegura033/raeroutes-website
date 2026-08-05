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

    toggle.addEventListener("click", () => {

        const content = toggle.nextElementSibling;
        const icon = toggle.querySelector(".toggle-icon");

        // Close other sections
        creatorToggles.forEach(otherToggle => {

            const otherContent = otherToggle.nextElementSibling;
            const otherIcon = otherToggle.querySelector(".toggle-icon");

            if(otherToggle !== toggle){

                otherContent.style.maxHeight = "0px";
                otherIcon.textContent = "+";
                otherToggle.classList.remove("active");

            }

        });


        // Open / close clicked section
        if(content.style.maxHeight === "0px" || content.style.maxHeight === ""){

            content.style.maxHeight = content.scrollHeight + "px";
            icon.textContent = "−";
            toggle.classList.add("active");

        } else {

            content.style.maxHeight = "0px";
            icon.textContent = "+";
            toggle.classList.remove("active");

        }

    });

});

/* =====================================================
        GLOBAL VARIABLES
====================================================== */


let selectedFilmStyle = null;



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


if(cameraArea){

    cameraArea.style.display = "none";

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


        console.log("Selected film:", selectedFilmStyle);


    });


});


/* =====================================================
        CAMERA ACCESS
====================================================== */


async function startCamera(){


    try{


        cameraStream = await navigator.mediaDevices.getUserMedia({

            video:{
                facingMode:"user"
            },

            audio:false

        });


        cameraPreview.srcObject = cameraStream;


        cameraArea.style.display = "block";


        cameraPreview.style.display = "block";


    }


    catch(error){


        console.log(error);


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

    startButton.addEventListener("click", async()=>{

        capturedPhotos = [];
        currentPhoto = 0;

        if(!cameraStream){

            await startCamera();

        }

        if(cameraArea){

            cameraArea.style.display = "block";

        }

        if(readyScreen){

            readyScreen.style.display = "none";

        }

        setTimeout(()=>{

            takePhoto();

        },500);

    });

}
        
/* =====================================================
        TAKE PHOTOS
====================================================== */


function takePhoto(){


    // Stop after 4 photos

    if(currentPhoto >= 4){


        showDeveloping();


        return;


    }



    // Update photo number

    if(photoStatus){


        photoStatus.innerHTML = 
        `Photo ${currentPhoto + 1} of 4`;


    }



    // Make sure camera is ready

    if(!cameraPreview.videoWidth){


        setTimeout(()=>{


            takePhoto();


        },500);


        return;


    }




    countdownSequence(()=>{


        captureImage();


        currentPhoto++;


        // Small pause before next photo

        setTimeout(()=>{


            takePhoto();


        },1000);



    });



}


/* =====================================================
        COUNTDOWN
====================================================== */


function countdownSequence(callback){


    if(!countdownDisplay){

        callback();

        return;

    }



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


    if(!cameraPreview){

        return;

    }



    // Make sure video is ready

    if(cameraPreview.readyState < 2){

        console.log("Camera not ready yet");

        return;

    }



    const tempCanvas = document.createElement("canvas");



    tempCanvas.width = cameraPreview.videoWidth;


    tempCanvas.height = cameraPreview.videoHeight;



    const ctx = tempCanvas.getContext("2d");



    ctx.drawImage(

        cameraPreview,

        0,

        0,

        tempCanvas.width,

        tempCanvas.height

    );



    const imageData = tempCanvas.toDataURL("image/png");



    capturedPhotos.push(imageData);



    console.log(
        "Photo captured:",
        capturedPhotos.length
    );


}

        
/* =====================================================
        DEVELOPING SCREEN
====================================================== */


function showDeveloping(){


    // Hide camera when developing starts

    if(cameraArea){

        cameraArea.style.display = "none";

    }



    if(readyScreen){

        readyScreen.style.display = "none";

    }



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



    // FILM STYLE BACKGROUNDS

    const styles = {

        vintage: "#f3e4c5",

        passport: "#dfe8dc",

        coastal: "#d8eef2",

        scrapbook: "#f5eadc",

        classic: "#f7f7f2"

    };



    ctx.fillStyle = styles[selectedFilmStyle] || styles.vintage;


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


            // photo frame

            ctx.fillStyle = "#ffffff";


            ctx.fillRect(

                60,

                80 + index * 300,

                480,

                260

            );



            // photo

            ctx.drawImage(

                img,

                80,

                100 + index * 300,

                440,

                220

            );



            loadedImages++;



            if(loadedImages === capturedPhotos.length){


                drawFilmDecorations(ctx);



                ctx.fillStyle="#2F2B28";


                ctx.font="32px cursive";


                ctx.textAlign="center";



                ctx.fillText(

                    "RaeRoutes ✈️",

                    canvas.width / 2,

                    1430

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


    ctx.strokeStyle = "#2F2B28";

    ctx.lineWidth = 4;



    switch(selectedFilmStyle){



        case "coastal":


            drawSun(ctx,500,90);

            drawWave(ctx,40,1380);

            drawShell(ctx,520,1320);

            break;




        case "passport":


            drawCompass(ctx,500,100);

            drawStamp(ctx,80,1350);

            break;




        case "scrapbook":


            drawStar(ctx,500,100);

            drawFlower(ctx,80,1350);

            break;




        case "classic":


            drawStar(ctx,500,100);

            drawStar(ctx,80,1350);

            break;




        case "vintage":


            drawHeart(ctx,500,100);

            drawFlower(ctx,80,1350);

            break;




        default:


            drawStar(ctx,500,100);

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

            x + Math.cos(i * Math.PI / 4) * 55,

            y + Math.sin(i * Math.PI / 4) * 55

        );


        ctx.stroke();


    }


}





function drawWave(ctx,x,y){


    ctx.beginPath();


    ctx.moveTo(x,y);



    for(let i=0;i<120;i++){


        ctx.lineTo(

            x + i * 3,

            y + Math.sin(i / 6) * 10

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





function drawCompass(ctx,x,y){


    ctx.beginPath();


    ctx.arc(

        x,

        y,

        35,

        0,

        Math.PI * 2

    );


    ctx.moveTo(x,y-35);

    ctx.lineTo(x,y+35);


    ctx.moveTo(x-35,y);

    ctx.lineTo(x+35,y);



    ctx.stroke();


}





function drawStamp(ctx,x,y){


    ctx.setLineDash([8,6]);


    ctx.beginPath();


    ctx.arc(

        x,

        y,

        45,

        0,

        Math.PI * 2

    );


    ctx.stroke();



    ctx.setLineDash([]);



    ctx.font = "20px cursive";

    ctx.textAlign = "center";


    ctx.fillText(

        "TRAVEL",

        x,

        y + 5

    );


}





function drawFlower(ctx,x,y){


    ctx.beginPath();


    ctx.arc(

        x,

        y,

        15,

        0,

        Math.PI * 2

    );


    ctx.stroke();



    ctx.beginPath();


    ctx.arc(

        x + 25,

        y,

        15,

        0,

        Math.PI * 2

    );


    ctx.stroke();


}





function drawStar(ctx,x,y){


    ctx.beginPath();



    for(let i=0;i<10;i++){


        const angle = i * Math.PI / 5;


        const radius = i % 2 === 0 ? 25 : 10;



        ctx.lineTo(

            x + Math.cos(angle) * radius,

            y + Math.sin(angle) * radius

        );


    }



    ctx.closePath();


    ctx.stroke();


}




/* =====================================================
        FINISH DEVELOPING
====================================================== */


function finishFilm(){


    // Create final film strip

    createFilmStrip();



    // Stop camera after photos are finished

    if(cameraStream){

        cameraStream.getTracks().forEach(track => {

            track.stop();

        });


        cameraStream = null;

    }



    setTimeout(()=>{



        if(developingScreen){

            developingScreen.style.display = "none";

        }



        if(filmReveal){

            filmReveal.style.display = "block";

        }



        // trigger reveal animation if available

        const strip = document.querySelector(".film-strip-preview");


        if(strip){

            strip.classList.add("show-strip");

        }



    },1000);



}
/* =====================================================
        FILM REVEAL ANIMATION
====================================================== */


function revealFilmStrip(){


    if(!filmReveal) return;



    // Show reveal section

    filmReveal.style.display = "block";



    const strip = document.querySelector(".film-strip-preview");



    if(strip){


        // Reset animation

        strip.classList.remove("show-strip");



        // Restart animation

        requestAnimationFrame(()=>{


            strip.classList.add("show-strip");


        });


    }



}




/* =====================================================
        DOWNLOAD FILM STRIP
====================================================== */


if(downloadButton){


    downloadButton.addEventListener("click",()=>{


        if(!canvas) return;



        const link = document.createElement("a");



        link.download = "RaeRoutes-Travel-Keepsake.png";



        link.href = canvas.toDataURL("image/png");



        document.body.appendChild(link);



        link.click();



        document.body.removeChild(link);



    });


}







/* =====================================================
        RETAKE PHOTO BOOTH
====================================================== */


if(restartButton){


    restartButton.addEventListener("click",()=>{


        // Reset photos

        capturedPhotos = [];


        currentPhoto = 0;



        // Clear canvas

        if(canvas){


            const ctx = canvas.getContext("2d");


            ctx.clearRect(

                0,

                0,

                canvas.width,

                canvas.height

            );


        }




        // Hide finished screens

        if(filmReveal){


            filmReveal.style.display = "none";


        }




        if(developingScreen){


            developingScreen.style.display = "none";


        }




        // Hide camera

        if(cameraPreview){


            cameraPreview.style.display = "none";


        }



        // Stop camera completely

        if(cameraStream){


            cameraStream.getTracks().forEach(track=>{


                track.stop();


            });


            cameraStream = null;


        }




        // Reset status

        if(photoStatus){


            photoStatus.innerHTML = "Photo 0 of 4";


        }




        if(countdownDisplay){


            countdownDisplay.innerHTML = "";


        }



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



        cameraStream = null;



    }



    if(cameraPreview){


        cameraPreview.srcObject = null;


        cameraPreview.style.display = "none";


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

const postcardCanvas = document.createElement("canvas");



let selectedPostcardStyle = "Vintage Air Mail";

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


        // remove old selection

        postcardStyles.forEach(btn=>{


            btn.classList.remove("selected");


        });



        // add new selection

        style.classList.add("selected");



        // save selected design

        selectedPostcardStyle = style.dataset.style || style.innerText;



        // update preview

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


            const img = new Image();



            img.onload = ()=>{


                postcardImage = img.src;



                updatePostcardPreview();


            };



            img.src = e.target.result;



        };



        reader.readAsDataURL(file);



    });


}



/* =====================================================
        POSTCARD CAMERA
====================================================== */


if(postcardCameraButton){


    postcardCameraButton.addEventListener("click", async()=>{


        try{


            postcardStream = await navigator.mediaDevices.getUserMedia({


                video:{

                    facingMode:"user"

                },


                audio:false


            });



            postcardVideo.srcObject = postcardStream;



            postcardVideo.style.display = "block";



            postcardVideo.play();



        }


        catch(error){


            console.log(error);



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


            <div class="postcard-photo-area">


                ${
                    postcardImage
                    ?
                    `<img src="${postcardImage}" class="postcard-image">`
                    :
                    `<div class="empty-photo">
                        Add your travel photo
                    </div>`
                }


            </div>



            <div class="postcard-writing">


                <h4>${destination}</h4>


                <small>${date}</small>


                <p>${message}</p>


                <span>${from}</span>


            </div>



        </div>

    `;

}

// Close DOMContentLoaded
});
