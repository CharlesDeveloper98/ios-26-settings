document.addEventListener("DOMContentLoaded", () => {
    const sheetOverlay = document.getElementById("sheetOverlay");
    const closeSheetBtn = document.getElementById("closeSheet");
    const resetBtn = document.getElementById("reset-onboarding");
    
    const page1 = document.getElementById("page1");
    const page2 = document.getElementById("page2");
    const nextPageBtn = document.getElementById("nextPageBtn");
    const prevPageBtn = document.getElementById("prevPageBtn");

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
        goToPage(1); // Reset to page 1 on open
    }

    function closeSheet() {
        sheetOverlay.classList.remove("active");
    }

    function goToPage(pageNumber) {
        if (pageNumber === 1) {
            page1.classList.add("active");
            page2.classList.remove("active");
        } else if (pageNumber === 2) {
            page2.classList.add("active");
            page1.classList.remove("active");
        }
    }

    // Navigation Event Listeners
    nextPageBtn.addEventListener("click", () => {
        goToPage(2);
    });

    prevPageBtn.addEventListener("click", () => {
        goToPage(1);
    });

    closeSheetBtn.addEventListener("click", closeSheet);

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
