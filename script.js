document.addEventListener("DOMContentLoaded", () => {
    const sheetOverlay = document.getElementById("sheetOverlay");
    const sheetTitle = document.getElementById("sheetTitle");
    
    const page1 = document.getElementById("page1");
    const page2 = document.getElementById("page2");
    const page3 = document.getElementById("page3");
    
    const toPage2Btn = document.getElementById("toPage2Btn");
    const toPage1Btn = document.getElementById("toPage1Btn");
    const toPage3Btn = document.getElementById("toPage3Btn");
    const toPage2BtnFrom3 = document.getElementById("toPage2BtnFrom3");
    const finishBtn = document.getElementById("finishBtn");

    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const profileCard = document.getElementById("profileCard");
    const errorMsg = document.getElementById("errorMsg");
    const displayProfileName = document.getElementById("displayProfileName");

    // Load saved profile name if already stored
    const savedFirstName = localStorage.getItem("ios26_firstname");
    const savedLastName = localStorage.getItem("ios26_lastname");
    if (savedFirstName || savedLastName) {
        displayProfileName.textContent = `${savedFirstName || ""} ${savedLastName || ""}`.trim();
    }

    // Check if it's the user's first time opening the app
    const hasOpenedBefore = localStorage.getItem("ios26_installed");

    if (!hasOpenedBefore) {
        setTimeout(() => {
            openSheet();
        }, 500);
        localStorage.setItem("ios26_installed", "true");
    }

    function openSheet() {
        sheetOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        goToPage(1);
    }

    function closeSheet() {
        sheetOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    function goToPage(pageNumber) {
        page1.classList.remove("active");
        page2.classList.remove("active");
        page3.classList.remove("active");

        if (pageNumber === 1) {
            page1.classList.add("active");
            sheetTitle.textContent = "Settings Setup";
        } else if (pageNumber === 2) {
            page2.classList.add("active");
            sheetTitle.textContent = "System Personalization";
        } else if (pageNumber === 3) {
            page3.classList.add("active");
            sheetTitle.textContent = "Profile Setup";
            validateInputs();
        }
    }

    function validateInputs() {
        const fName = firstNameInput.value.trim();
        const lName = lastNameInput.value.trim();

        if (fName !== "" || lName !== "") {
            finishBtn.classList.remove("disabled");
            finishBtn.classList.add("ios-blue");
            errorMsg.classList.remove("visible");
        } else {
            finishBtn.classList.add("disabled");
            finishBtn.classList.remove("ios-blue");
        }
    }

    firstNameInput.addEventListener("input", validateInputs);
    lastNameInput.addEventListener("input", validateInputs);

    toPage2Btn.addEventListener("click", () => goToPage(2));
    toPage1Btn.addEventListener("click", () => goToPage(1));
    toPage3Btn.addEventListener("click", () => goToPage(3));
    toPage2BtnFrom3.addEventListener("click", () => goToPage(2));

    finishBtn.addEventListener("click", () => {
        const fName = firstNameInput.value.trim();
        const lName = lastNameInput.value.trim();

        if (fName === "" && lName === "") {
            profileCard.classList.remove("shake");
            void profileCard.offsetWidth;
            profileCard.classList.add("shake");
            errorMsg.classList.add("visible");
            return;
        }

        localStorage.setItem("ios26_firstname", fName);
        localStorage.setItem("ios26_lastname", lName);
        displayProfileName.textContent = `${fName} ${lName}`.trim();

        closeSheet();
    });

    sheetOverlay.addEventListener("click", (e) => {
        e.stopPropagation();
    });
});
