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

    // Navigation Views Elements
    const mainSettingsView = document.getElementById("mainSettingsView");
    const displayBrightnessView = document.getElementById("displayBrightnessView");
    const displayBrightnessNav = document.getElementById("displayBrightnessNav");
    const backToMainSettings = document.getElementById("backToMainSettings");

    // Display & Brightness interactive state elements
    const lightModeOption = document.getElementById("lightModeOption");
    const darkModeOption = document.getElementById("darkModeOption");
    const automaticToggle = document.getElementById("automaticToggle");

    const htmlElement = document.documentElement;

    function setTheme(theme) {
        htmlElement.classList.add("theme-transitioning");
        htmlElement.setAttribute("data-theme", theme);
        localStorage.setItem("ios26_theme", theme);

        if (theme === "light") {
            lightModeOption.classList.add("active");
            lightModeOption.querySelector(".radio-check").classList.add("checked");
            lightModeOption.querySelector(".radio-check").textContent = "✓";
            
            darkModeOption.classList.remove("active");
            darkModeOption.querySelector(".radio-check").classList.remove("checked");
            darkModeOption.querySelector(".radio-check").textContent = "";
        } else {
            darkModeOption.classList.add("active");
            darkModeOption.querySelector(".radio-check").classList.add("checked");
            darkModeOption.querySelector(".radio-check").textContent = "✓";
            
            lightModeOption.classList.remove("active");
            lightModeOption.querySelector(".radio-check").classList.remove("checked");
            lightModeOption.querySelector(".radio-check").textContent = "";
        }

        setTimeout(() => {
            htmlElement.classList.remove("theme-transitioning");
        }, 200);
    }

    function getSystemTheme() {
        if (window.matchMedia("(prefers-color-scheme: light)").matches) return "light";
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
        return "light";
    }

    const savedTheme = localStorage.getItem("ios26_theme");
    const savedAutomatic = localStorage.getItem("ios26_automatic") === "true";
    
    automaticToggle.checked = savedAutomatic;

    if (savedAutomatic) {
        setTheme(getSystemTheme());
    } else if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme("dark");
    }

    lightModeOption.addEventListener("click", () => {
        if (automaticToggle.checked) {
            automaticToggle.checked = false;
            localStorage.setItem("ios26_automatic", "false");
        }
        setTheme("light");
    });

    darkModeOption.addEventListener("click", () => {
        if (automaticToggle.checked) {
            automaticToggle.checked = false;
            localStorage.setItem("ios26_automatic", "false");
        }
        setTheme("dark");
    });

    automaticToggle.addEventListener("change", () => {
        const isAutomatic = automaticToggle.checked;
        localStorage.setItem("ios26_automatic", isAutomatic);
        if (isAutomatic) setTheme(getSystemTheme());
    });

    // Sub-page sliding navigation with instant execution
    displayBrightnessNav.addEventListener("click", () => {
        requestAnimationFrame(() => {
            mainSettingsView.classList.add("slide-left");
            displayBrightnessView.classList.add("active");
        });
    });

    backToMainSettings.addEventListener("click", () => {
        requestAnimationFrame(() => {
            displayBrightnessView.classList.remove("active");
            mainSettingsView.classList.remove("slide-left");
        });
    });

    const savedFirstName = localStorage.getItem("ios26_firstname");
    const savedLastName = localStorage.getItem("ios26_lastname");
    if (savedFirstName || savedLastName) {
        displayProfileName.textContent = `${savedFirstName || ""} ${savedLastName || ""}`.trim();
    }

    const hasOpenedBefore = localStorage.getItem("ios26_installed");
    if (!hasOpenedBefore) {
        setTimeout(() => {
            openSheet();
        }, 400);
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
});
