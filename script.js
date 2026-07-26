document.addEventListener("DOMContentLoaded", () => {
    const sheetOverlay = document.getElementById("sheetOverlay");
    const closeSheetBtn = document.getElementById("closeSheet");
    const resetBtn = document.getElementById("reset-onboarding");

    // Check if it's the user's first time opening the app
    const hasOpenedBefore = localStorage.getItem("ios26_installed");

    if (!hasOpenedBefore) {
        // Trigger popup on fresh start after a brief delay for smoothness
        setTimeout(() => {
            openSheet();
        }, 500);

        // Mark as opened so it won't auto-popup on subsequent refreshes
        localStorage.setItem("ios26_installed", "true");
    }

    function openSheet() {
        sheetOverlay.classList.add("active");
    }

    function closeSheet() {
        sheetOverlay.classList.remove("active");
    }

    // Close button event
    closeSheetBtn.addEventListener("click", closeSheet);

    // Optional: Click outside sheet to close
    sheetOverlay.addEventListener("click", (e) => {
        if (e.target === sheetOverlay) {
            closeSheet();
        }
    });

    // Debug button to test the fresh start animation again anytime
    resetBtn.addEventListener("click", () => {
        localStorage.removeItem("ios26_installed");
        alert("State cleared! Refresh the page to see the fresh start popup again.");
    });
});
