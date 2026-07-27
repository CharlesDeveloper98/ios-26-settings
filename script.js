document.addEventListener("DOMContentLoaded", () => {
    const sheetOverlay = document.getElementById("sheetOverlay");
    const sheetTitle = document.getElementById("sheetTitle");
    const resetBtn = document.getElementById("reset-onboarding");
    
    const page1 = document.getElementById("page1");
    const page2 = document.getElementById("page2");
    const page3 = document.getElementById("page3");
    
    const toPage2Btn = document.getElementById("toPage2Btn");
    const toPage1Btn = document.getElementById("toPage1Btn");
    const toPage3Btn = document.getElementById("toPage3Btn");
    const toPage2BtnFrom3 = document.getElementById("toPage2BtnFrom3");
    const finishBtn = document.getElementById("finishBtn");

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
        goToPage(1);
    }

    function closeSheet() {
        sheetOverlay.classList.remove("active");
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
        }
    }

    // Navigation Event Listeners
    toPage2Btn.addEventListener("click", () => goToPage(2));
    toPage1Btn.addEventListener("click", () => goToPage(1));
    toPage3Btn.addEventListener("click", () => goToPage(3));
    toPage2BtnFrom3.addEventListener("click", () => goToPage(2));

    // Final finish button exits/closes the popup sheet
    finishBtn.addEventListener("click", () => {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        if(firstName || lastName) {
            console.log("Saved Profile:", firstName, lastName);
        }
        closeSheet();
    });

    sheetOverlay.addEventListener("click", (e) => {
        if (e.target === sheetOverlay) {
            closeSheet();
        }
    });

    resetBtn.addEventListener("click", () => {
        localStorage.removeItem("ios26_installed");
        alert("State cleared! Refresh the page to see the fresh start popup again.");
    });
});
