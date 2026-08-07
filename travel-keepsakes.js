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


const filmCard = document.getElementById("filmCard");

const filmOverlay = document.getElementById("filmOverlay");

const filmStyleName = document.getElementById("filmStyleName");

const filmStyleDescription = document.getElementById("filmStyleDescription");

const chooseFilmStyle = document.getElementById("chooseFilmStyle");

const previousFilm = document.querySelector(".film-arrow-left");

const nextFilm = document.querySelector(".film-arrow-right");


const startButton = document.getElementById("startBooth");
        
const developingScreen = document.getElementById("developingScreen");

const filmReveal = document.getElementById("filmReveal");

const cameraArea = document.getElementById("cameraArea");

const cameraPreview = document.getElementById("cameraPreview");

const cameraButton = document.getElementById("cameraButton");

const uploadButton = document.getElementById("uploadButton");

const photoUpload = document.getElementById("photoUpload");


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


const filmStyles = [

    {
        name:"Adventure",
        description:"Perfect for bucket list adventures and unforgettable journeys.",
        overlay:"assets/overlay/adventure.png"
    },

    {
        name:"Travel",
        description:"Capture the feeling of exploring somewhere new.",
        overlay:"assets/overlay/travel.png"
    },

    {
        name:"Budget",
        description:"For affordable adventures and smart travel memories.",
        overlay:"assets/overlay/budget.png"
    },

    {
        name:"Celebrate",
        description:"A keepsake for special moments and milestones.",
        overlay:"assets/overlay/celebrate.png"
    },

    {
        name:"City",
        description:"Perfect for unforgettable city escapes.",
        overlay:"assets/overlay/city.png"
    },

    {
        name:"Coastal",
        description:"Made for beach days and ocean adventures.",
        overlay:"assets/overlay/coastal.png"
    },

    {
        name:"Romantic",
        description:"A dreamy keepsake for your favorite moments.",
        overlay:"assets/overlay/romantic.png"
    },

    {
        name:"Bubbles",
        description:"A fun and playful travel memory style.",
        overlay:"assets/overlay/bubbles.png"
    },

    {
        name:"Winter",
        description:"Perfect for snowy escapes and cozy adventures.",
        overlay:"assets/overlay/winter.png"
    },

    {
        name:"Sparkles",
        description:"A magical style for unforgettable journeys.",
        overlay:"assets/overlay/sparkles.png"
    },

    {
        name:"Classic",
        description:"A simple keepsake with no added decorations.",
        overlay:"assets/overlay/blank.png"
    }

];


let currentFilm = 0;



function updateFilmStyle(){


    const style = filmStyles[currentFilm];


    if(filmOverlay){

        filmOverlay.src = style.overlay;

        filmOverlay.alt = style.name + " Film Style";

    }


    if(filmStyleName){

        filmStyleName.textContent = style.name;

    }


    if(filmStyleDescription){

        filmStyleDescription.textContent = style.description;

    }


    selectedFilmStyle = style.name.toLowerCase();


}



if(nextFilm){

    nextFilm.addEventListener("click",()=>{


        currentFilm++;


        if(currentFilm >= filmStyles.length){

            currentFilm = 0;

        }


        updateFilmStyle();


    });

}



if(previousFilm){

    previousFilm.addEventListener("click",()=>{


        currentFilm--;


        if(currentFilm < 0){

            currentFilm = filmStyles.length - 1;

        }


        updateFilmStyle();


    });

}



if(chooseFilmStyle){

    chooseFilmStyle.addEventListener("click",()=>{


        selectedFilmStyle = filmStyles[currentFilm].name.toLowerCase();


        console.log(
            "Selected film:",
            selectedFilmStyle
        );


    });

}



/* =====================================================
        CAMERA ACCESS
====================================================== */

async function startCamera() {

    try {

        cameraStream = await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: "user"
            },

            audio: false

        });

        cameraPreview.srcObject = cameraStream;

        cameraArea.style.display = "block";

        cameraPreview.style.display = "block";

    }

    catch (error) {

        console.log(error);

        alert(
            "To use the Photo Booth, please allow camera access when your browser asks. If you choose not to, you can still create your keepsake by uploading photos instead."
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


        const files = Array.from(event.target.files)
            .slice(0,4);



        if(files.length === 0){

            return;

        }



        capturedPhotos = [];



        files.forEach(file=>{


            const reader = new FileReader();



            reader.onload = (e)=>{


                capturedPhotos.push(e.target.result);



                // Continue once uploads finish

                if(capturedPhotos.length === files.length){


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


    // Finish after 4 photos

    if(currentPhoto >= 4){


        showDeveloping();


        return;


    }





    if(photoStatus){


        photoStatus.innerHTML =
        `Photo ${currentPhoto + 1} of 4`;


    }





    // Wait until camera loads

    if(!cameraPreview.videoWidth){


        setTimeout(()=>{


            takePhoto();


        },500);


        return;


    }






    countdownSequence(()=>{


        captureImage();


        currentPhoto++;




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


async function createFilmStrip(){


    if(!canvas) return;



    canvas.width = 600;

    canvas.height = 1500;



    const ctx = canvas.getContext("2d");



    /*
        FILM BACKGROUND COLORS
        Base layer for the selected PNG film design.
    */



    const styles = {


        adventure:"#ead8b8",

        travel:"#ead8b8",

        budget:"#dce7dc",

        celebrate:"#f4d8d8",

        city:"#d9d9d9",

        coastal:"#d7edf2",

        romantic:"#f3dce5",

        bubbles:"#dff4f4",

        winter:"#e7edf5",

        sparkle:"#eee5f8",

        classic:"#333333"


    };



    ctx.fillStyle =
        styles[selectedFilmStyle] || styles.travel;



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


            const x = 80;

            const y = 90 + index * 300;



            /*
                PHOTO WINDOW
            */


            ctx.save();



            ctx.beginPath();


            ctx.rect(

                x,

                y,

                440,

                220

            );


            ctx.clip();



            ctx.drawImage(

                img,

                x,

                y,

                440,

                220

            );



            ctx.restore();






            /*
                PHOTO FRAME BORDER
            */


            ctx.strokeStyle = "#ffffff";


            ctx.lineWidth = 12;



            ctx.strokeRect(

                x,

                y,

                440,

                220

            );



            loadedImages++;




            if(loadedImages === capturedPhotos.length){


                drawFilmDecorations(ctx);



                ctx.fillStyle="#fffdf8";


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
        FILM DECORATIONS
====================================================== */


async function drawFilmDecorations(ctx){


    const filmOverlays = {


        travel:
            "assets/overlay/travel.png",


        budget:
            "assets/overlay/budget.png",


        celebrate:
            "assets/overlay/celebrate.png",


        city:
            "assets/overlay/city.png",


        coastal:
            "assets/overlay/coastal.png",


        romantic:
            "assets/overlay/romantic.png",


        bubbles:
            "assets/overlay/bubbles.png",


        adventure:
            "assets/overlay/adventure.png",


        winter:
            "assets/overlay/winter.png",


        sparkle:
            "assets/overlay/sparkles.png",


        classic:
            "assets/overlay/blank.png"


    };



    const overlayPath = filmOverlays[selectedFilmStyle];



    if(!overlayPath){


        console.log(
            "No film overlay selected:",
            selectedFilmStyle
        );


        return;


    }



    const overlayImage = new Image();



    overlayImage.onload = ()=>{


        ctx.drawImage(

            overlayImage,

            0,

            0,

            canvas.width,

            canvas.height

        );


    };



    overlayImage.onerror = ()=>{


        console.log(
            "Could not load film overlay:",
            overlayPath
        );


    };



    overlayImage.src = overlayPath;



}
        
/* =====================================================
        FINISH DEVELOPING
====================================================== */


async function finishFilm(){


    // Create final film strip first

    await createFilmStrip();



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





        // Trigger reveal animation

        revealFilmStrip();



    },1000);



}







/* =====================================================
        FILM REVEAL ANIMATION
====================================================== */


function revealFilmStrip(){


    if(!filmReveal) return;



    filmReveal.style.display = "block";



    const strip = document.querySelector(
        ".film-strip-preview"
    );



    if(strip){


        strip.classList.remove(
            "show-strip"
        );



        requestAnimationFrame(()=>{


            strip.classList.add(
                "show-strip"
            );


        });


    }



}


/* =====================================================
        DOWNLOAD FILM STRIP
====================================================== */


if(downloadButton){


    downloadButton.addEventListener("click",()=>{


        if(!canvas) return;



        canvas.toBlob((blob)=>{


            if(!blob) return;



            const link = document.createElement("a");



            const styleName = selectedFilmStyle || "travel";



            link.download =
                `RaeRoutes-${styleName}-Keepsake.png`;



            link.href = URL.createObjectURL(blob);



            document.body.appendChild(link);



            link.click();



            document.body.removeChild(link);



            URL.revokeObjectURL(link.href);



        },"image/png");



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



        // Reset film selection

        selectedFilmStyle = "travel";



        filmCards.forEach(card=>{


            card.classList.remove("selected");


        });



        const defaultFilm = document.querySelector(
            `[data-style="${selectedFilmStyle}"]`
        );



        if(defaultFilm){


            defaultFilm.classList.add("selected");


        }






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






        // Hide screens

        if(filmReveal){


            filmReveal.style.display = "none";


        }



        if(developingScreen){


            developingScreen.style.display = "none";


        }



        if(cameraArea){


            cameraArea.style.display = "none";


        }






        // Hide camera preview

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


            photoStatus.innerHTML =
                "Photo 0 of 4";


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


        cameraPreview.pause();


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
