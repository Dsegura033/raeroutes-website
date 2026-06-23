document.addEventListener("DOMContentLoaded", () => {


  // ===== Lightbox (medium-large popup on top) =====
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
  const closeBtn = lightbox ? lightbox.querySelector('.close-btn') : null;

  document.querySelectorAll('.collection-card').forEach(card => {
    card.addEventListener('click', () => {
      if (!lightboxImg || !lightbox) return;
      const img = card.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
    });
  });

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove('active');
    lightboxImg.src = '';
    lightboxImg.alt = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // ===== Mobile nav toggle =====
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.getElementById('mobileNav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
    });
  }

  // ===== Intersection observers =====
  const createObserver = (selector) => {
    const elements = document.querySelectorAll(selector);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    elements.forEach(el => observer.observe(el));
  };

  createObserver('.services-gifting h2, .services-gifting p, .service-card');
  createObserver('.about-section h2, .about-section p, .about-section .about-btn');
  createObserver('.contact-split h2, .contact-split p, .contact-split .contact-buttons a, .contact-split .qr-box img');

 

  // ===== Why Cards Animation =====
  const whyCards = document.querySelectorAll('.why-card');
  if (whyCards.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    whyCards.forEach(card => observer.observe(card));
  }

 

  // ===== Footer PDF Modal =====
  const modal = document.getElementById("pdfModal");
  const pdfImg = document.getElementById("pdfImage");
  const external = document.getElementById("pdfExternal");
  const pdfCloseBtn = document.querySelector(".pdf-close");
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  let currentImages = [];
  let currentIndex = 0;

  document.querySelectorAll(".footer-links button").forEach(btn => {
    btn.addEventListener("click", () => {
      currentImages = btn.getAttribute("data-images").split(",").map(i => i.trim());
      currentIndex = 0;

      if(pdfImg) pdfImg.src = currentImages[currentIndex];
      if(external) external.href = currentImages[currentIndex];

      if(modal) modal.classList.add("active");

      if(prevBtn) prevBtn.style.display = currentImages.length > 1 ? 'inline-block' : 'none';
      if(nextBtn) nextBtn.style.display = currentImages.length > 1 ? 'inline-block' : 'none';
    });
  });

  const closeModal = () => {
    if(modal) modal.classList.remove("active");
    if(pdfImg) pdfImg.src = "";
  };

  if (pdfCloseBtn) pdfCloseBtn.addEventListener("click", closeModal);
  if (modal) modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
  if (prevBtn) prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      if(pdfImg) pdfImg.src = currentImages[currentIndex];
      if(external) external.href = currentImages[currentIndex];
    }
  });
  if (nextBtn) nextBtn.addEventListener("click", () => {
    if (currentIndex < currentImages.length - 1) {
      currentIndex++;
      if(pdfImg) pdfImg.src = currentImages[currentIndex];
      if(external) external.href = currentImages[currentIndex];
    }
  });

  // ===== Traveler Quiz =====
  const travelerButtons = document.querySelectorAll('.traveler-card .options button');
  const travelerResult = document.querySelector('.traveler-card .result');

  const travelerDescriptions = {
    "The City Explorer": [
    "You thrive on the energy of bustling streets and hidden cafés. Urban adventures are your playground!",
    "Skylines, museums, and late night eats fuel your travel style. Cities make you feel alive.",
    "You love discovering neighborhoods, local spots, and the rhythm of a city that never sleeps.",
    "Every alley and corner holds a story you want to uncover.",
    "You plan your trips around must-see landmarks and local secrets alike.",
    "Vibrant streets, cultural hotspots, and late-night finds are your perfect escape."
  ],
  "The Coastal Relaxer": [
    "Your soul finds calm in waves and golden sands. Beach sunsets are your reset.",
    "Salt air, slow mornings, and ocean views are your version of luxury.",
    "You travel to unwind: sunshine, water, and doing absolutely nothing sound perfect.",
    "Sandy toes and beach breezes are the soundtrack to your ideal trip.",
    "Your vacation mantra is 'relax, recharge, repeat.'",
    "You seek destinations where the sea meets serenity at every turn."
  ],
  "The Adventure Seeker": [
    "You crave thrills, hikes, and the unknown. Mountains and rivers are your playground!",
    "Your trips are powered by adrenaline, fresh air, and stories worth telling.",
    "You’re happiest chasing views, pushing limits, and exploring off the beaten path.",
    "Every trail, peak, and rapid is an invitation for your next challenge.",
    "You thrive on spontaneous adventures and unexpected detours.",
    "Travel is your playground for heart-pounding memories and epic experiences."
  ],
  "The Cozy & Chill friend": [
    "You cherish quiet mornings and hygge vibes. Quaint towns and slow days suit you best.",
    "Your perfect trip includes cozy cafés, scenic walks, and zero pressure.",
    "You travel to feel calm, comfortable, and fully present; no rushing required.",
    "Soft blankets, warm drinks, and peaceful surroundings are your ideal.",
    "You love slow-paced exploration, intimate corners, and charming hideaways.",
    "Relaxation and comfort are the heart of every trip you plan."
  ],
  "The Smart Budgeter": [
    "You love discovering amazing experiences without breaking the bank.",
    "Your trips are clever, curated, and make every dollar count.",
    "You enjoy travel that’s accessible, smart, and still full of memorable moments.",
    "You hunt for deals and hidden gems like a pro.",
    "Every trip is about maximizing fun without overspending.",
    "Smart planning, clever choices, and unforgettable memories define your adventures."
  ],
  "The Celebration friend": [
    "You travel to honor life’s big moments with joy and style.",
    "Birthdays, anniversaries, and milestones become unforgettable experiences.",
    "You love planning trips that make memories shine bright for everyone involved.",
    "Every trip is a party, every moment worth celebrating.",
    "Your adventures are full of laughter, joy, and meaningful rituals.",
    "You make milestones magical with personalized, memorable escapes."
  ],
  "The Romantic": [
    "You seek intimate, dreamy getaways with special someone(s).",
    "Candlelit dinners, scenic walks, and private moments are your ideal.",
    "Your trips are all about connection, romance, and unforgettable shared memories.",
    "You love escapes that spark love, laughter, and lasting memories.",
    "Scenic hideaways and cozy settings set the mood for your journeys.",
    "Every moment is curated to bring hearts closer together."
  ],
  "The Seasonal Friend": [
    "You embrace cozy, seasonal adventures both indoors and outdoors.",
    "Snowy landscapes, warm drinks, and festive vibes are your comfort zone.",
    "Your trips capture the magic of the season, from charming towns to winter activities.",
    "You love destinations that sparkle with seasonal charm.",
    "Every trip is a chance to embrace the cozy magic of winter.",
    "From snowy peaks to festive streets, your wanderlust thrives in the cold season."
  ]
  };

  travelerButtons.forEach(button => {
    button.addEventListener('click', () => {
      const type = button.getAttribute('data-type');
      const descriptions = travelerDescriptions[type];
      if (!descriptions) return;

      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      if(travelerResult){
        travelerResult.innerHTML = `<strong>${type}</strong><br>${randomDescription}`;
        travelerResult.style.display = 'block';
      }
    });
  });

  // ===== Plan My Trip Wheel =====
  const spinBtn = document.getElementById('spinTrip');
  const tripResult = document.querySelector('.trip-result');
  const destEl = tripResult ? tripResult.querySelector('.destination') : null;
  const vibeEl = tripResult ? tripResult.querySelector('.vibe') : null;
  const partnerEl = tripResult ? tripResult.querySelector('.partner') : null;

  const destinations = [
    "New York City, NY","Miami, FL","Sedona, AZ","San Francisco, CA",
  "Asheville, NC","Chicago, IL","Yellowstone, WY","Key West, FL",
  "New Orleans, LA","Honolulu, HI","Austin, TX","Denver, CO",
  "Napa Valley, CA","Boston, MA","Orlando, FL",
  "Paris, France","Kyoto, Japan","Santorini, Greece","Reykjavik, Iceland",
  "Marrakech, Morocco","Bali, Indonesia","Rome, Italy","Sydney, Australia",
  "Tulum, Mexico","Cape Town, South Africa","Amsterdam, Netherlands",
  "London, England","Prague, Czech Republic","Bora Bora, French Polynesia",
  "Barcelona, Spain","Lisbon, Portugal","Vancouver, Canada","Queenstown, New Zealand",
  "Cinque Terre, Italy","Helsinki, Finland","Maui, HI","Buenos Aires, Argentina",
  "Istanbul, Turkey","Edinburgh, Scotland","Seoul, South Korea","Patagonia, Chile"
  ];

  const vibes = [
  "Relaxed & Luxurious","Adventure & Nature","Romantic & Cozy","Urban & Vibrant",
  "Family Fun","Cultural & Historic","Chill & Hygge","Beach & Sun",
  "Food & Culinary","Festival & Party","Roadtrip & Exploration","Wellness & Spa",
  "Snow & Winter Fun","Island Hopping","Art & Museums","Music & Live Shows",
  "Hiking & Trails","Shopping & Style","Hidden Gems & Local Life","Sunset & Scenic Views"
  ];

  const partners = [
   "Partner 👫","Friends 👭","Family 👨‍👩‍👧","Solo ✈️","Pet 🐾",
  "Adventure Buddy 🧗","Group Tour 🚌","Bestie Squad 👯","Parents / Relatives 👵👴","Co-worker / Work Retreat 💼",
  "Sibling Duo 👬","Newlyweds 💍","College Friends 🎓","Kids & Teens 👶👧","Grandparents 👴👵",
  "Pet & Human Duo 🐶","Travel Club 🌍","Fitness Friends 🏃‍♂️","Art Lovers 🎨"
  ];

  if (spinBtn && tripResult) {
    spinBtn.addEventListener('click', () => {
      tripResult.style.display = 'block';
      let i = 0;
      const interval = setInterval(() => {
        if(destEl) destEl.textContent = destinations[Math.floor(Math.random() * destinations.length)];
        if(vibeEl) vibeEl.textContent = vibes[Math.floor(Math.random() * vibes.length)];
        if(partnerEl) partnerEl.textContent = partners[Math.floor(Math.random() * partners.length)];
        i++;
        if(i > 20) clearInterval(interval);
      }, 50);
    });
  }

}); // end DOMContentLoaded



<!-- Lottie player (keep if used elsewhere) -->
<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>

