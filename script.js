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

    // Battery View Elements
    const batteryNav = document.getElementById("batteryNav");
    const batteryView = document.getElementById("batteryView");
    const backToMainFromBattery = document.getElementById("backToMainFromBattery");
    const batteryPercentText = document.getElementById("batteryPercentText");
    const mainBatteryStatusText = document.getElementById("mainBatteryStatusText");
    const batteryLevelFill = document.getElementById("batteryLevelFill");
    const lastChargedText = document.getElementById("lastChargedText");

    // --- Real-Time iOS App Activity Tracker Engine ---
    const systemApps = [
        { id: "display", name: "Display & Home", icon: "assets/home.png", color: "blue", screenSec: 300, bgSec: 0, usagePct: 5 },
        { id: "settings", name: "Settings", icon: "assets/settings.png", color: "grey-icon", screenSec: 120, bgSec: 30, usagePct: 3 },
        { id: "siri", name: "Siri & Intelligence", icon: "assets/siri.png", color: "gradient-siri", screenSec: 10, bgSec: 120, usagePct: 2 },
        { id: "safari", name: "Safari", icon: "assets/safari.png", color: "blue", screenSec: 45, bgSec: 15, usagePct: 1 }
    ];

    let lastActiveTimestamp = Date.now();
    let isAppVisible = !document.hidden;

    function formatUsageTime(seconds) {
        if (seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        if (mins < 60) return `${mins}m`;
        const hrs = Math.floor(mins / 60);
        return `${hrs}h ${mins % 60}m`;
    }

    function renderActivityList() {
        const container = document.getElementById("appActivityListContainer");
        if (!container) return;

        const sortedApps = [...systemApps].sort((a, b) => b.usagePct - a.usagePct);

        container.innerHTML = sortedApps.map((app, index) => {
            const isDivider = index < sortedApps.length - 1;
            const subText = app.screenSec > 0 
                ? `On screen: ${formatUsageTime(app.screenSec)}` 
                : `Background: ${formatUsageTime(app.bgSec)}`;

            return `
                <div class="settings-row clickable">
                    <div class="row-left">
                        <div class="setting-icon ${app.color}">
                            <img src="${app.icon}" alt="${app.name}" onerror="this.style.display='none'">
                        </div>
                        <div class="row-text-stack">
                            <span class="row-label-text">${app.name}</span>
                            <span class="row-sub-label">${subText}</span>
                        </div>
                    </div>
                    <div class="row-right">
                        <span class="row-status-text">${app.usagePct}%</span>
                        <span class="chevron-icon">›</span>
                    </div>
                </div>
                ${isDivider ? '<div class="card-divider indent"></div>' : ''}
            `;
        }).join('');
    }

    setInterval(() => {
        const now = Date.now();
        const elapsedSec = Math.floor((now - lastActiveTimestamp) / 1000);

        if (elapsedSec >= 1) {
            lastActiveTimestamp = now;
            const settingsApp = systemApps.find(a => a.id === "settings");
            if (settingsApp) {
                if (isAppVisible) {
                    settingsApp.screenSec += elapsedSec;
                } else {
                    settingsApp.bgSec += elapsedSec;
                }

                const totalSec = systemApps.reduce((acc, a) => acc + a.screenSec + a.bgSec, 0);
                systemApps.forEach(app => {
                    const appTotal = app.screenSec + app.bgSec;
                    app.usagePct = Math.max(1, Math.round((appTotal / totalSec) * 12));
                });
            }
            renderActivityList();
        }
    }, 1000);

    document.addEventListener("visibilitychange", () => {
        isAppVisible = !document.hidden;
        lastActiveTimestamp = Date.now();
    });

    renderActivityList();

    // Precise Battery Tracking Engine (iOS 26 Style - Fixed Unplug Logic)
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            let lastUnpluggedPercent = localStorage.getItem("ios26_last_unplugged_pct");
            let lastUnpluggedTime = localStorage.getItem("ios26_last_unplugged_time") ? parseInt(localStorage.getItem("ios26_last_unplugged_time")) : null;
            let wasCharging = battery.charging;

            function formatTimeAgo(timestamp) {
                if (!timestamp) return null;
                const seconds = Math.floor((Date.now() - timestamp) / 1000);
                if (seconds < 60) return "Just now";
                const minutes = Math.floor(seconds / 60);
                if (minutes < 60) return `${minutes}m ago`;
                const hours = Math.floor(minutes / 60);
                if (hours < 24) return `${hours}h ago`;
                return `${Math.floor(hours / 24)}d ago`;
            }

            function updateBatteryUI() {
                const currentPercent = Math.round(battery.level * 100);
                batteryPercentText.textContent = `${currentPercent}%`;
                mainBatteryStatusText.textContent = `${currentPercent}%`;
                batteryLevelFill.style.width = `${currentPercent}%`;

                batteryLevelFill.classList.remove("color-green", "color-normal", "color-yellow", "color-red");

                if (currentPercent === 100) {
                    batteryLevelFill.classList.add("color-green");
                } else if (currentPercent >= 21 && currentPercent <= 99) {
                    batteryLevelFill.classList.add("color-normal");
                } else if (currentPercent >= 16 && currentPercent <= 20) {
                    batteryLevelFill.classList.add("color-yellow");
                } else if (currentPercent <= 15) {
                    batteryLevelFill.classList.add("color-red");
                }

                if (lastUnpluggedPercent && lastUnpluggedTime) {
                    const timeAgoString = formatTimeAgo(lastUnpluggedTime);
                    lastChargedText.textContent = `Last Charged to ${lastUnpluggedPercent}%: ${timeAgoString}`;
                } else {
                    lastChargedText.textContent = `Last Charged: Not available yet`;
                }
            }

            battery.addEventListener('chargingchange', () => {
                if (wasCharging && !battery.charging) {
                    lastUnpluggedPercent = Math.round(battery.level * 100);
                    lastUnpluggedTime = Date.now();
                    
                    localStorage.setItem("ios26_last_unplugged_pct", lastUnpluggedPercent);
                    localStorage.setItem("ios26_last_unplugged_time", lastUnpluggedTime);
                }
                wasCharging = battery.charging;
                updateBatteryUI();
            });

            battery.addEventListener('levelchange', updateBatteryUI);

            updateBatteryUI();
            setInterval(updateBatteryUI, 30000);
        });
    } else {
        lastChargedText.textContent = `Last Charged: Not supported`;
    }

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

    // Bold Text interactive state
    const boldTextToggle = document.getElementById("boldTextToggle");
    const savedBoldText = localStorage.getItem("ios26_boldtext") === "true";

    boldTextToggle.checked = savedBoldText;
    if (savedBoldText) {
        htmlElement.classList.add("bold-text-enabled");
    }

    boldTextToggle.addEventListener("change", () => {
        const isBold = boldTextToggle.checked;
        localStorage.setItem("ios26_boldtext", isBold);
        if (isBold) {
            htmlElement.classList.add("bold-text-enabled");
        } else {
            htmlElement.classList.remove("bold-text-enabled");
        }
    });

    // Sub-page sliding navigation: Display & Brightness
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

    // Sub-page sliding navigation: Battery
    batteryNav.addEventListener("click", () => {
        requestAnimationFrame(() => {
            mainSettingsView.classList.add("slide-left");
            batteryView.classList.add("active");
        });
    });

    backToMainFromBattery.addEventListener("click", () => {
        requestAnimationFrame(() => {
            batteryView.classList.remove("active");
            mainSettingsView.classList.remove("slide-left");
        });
    });

    const savedFirstName = localStorage.getItem("ios26_firstname");
    const savedLastName = localStorage.getItem("ios26_lastname");
    if (savedFirstName || savedLastName) {
        displayProfileName.textContent = `${savedFirstName || ""} ${savedLastName || ""}`.trim();
    }

    // Setup Flow Popup Logic (Loops until checkmark is clicked)
    const isSetupFinished = localStorage.getItem("ios26_setup_completed") === "true";
    if (!isSetupFinished) {
        setTimeout(() => {
            openSheet();
        }, 400);
    }

        function openSheet() {
        sheetOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        
        // Force layout tick to ensure smooth liquid glass bubble slide-up entrance
        requestAnimationFrame(() => {
            goToPage(1);
        });
    }


    function closeSheet() {
        sheetOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

           function goToPage(pageNumber) {
        const pages = [page1, page2, page3];
        const targetPage = pages[pageNumber - 1];
        const activePage = document.querySelector('.setup-page.active');
        
        if (activePage === targetPage) return;

        const activePageNumber = activePage ? parseInt(activePage.id.replace('page', '')) : 1;
        const isForward = pageNumber > activePageNumber;

        // Use requestAnimationFrame to guarantee silky-smooth hardware acceleration sync
        requestAnimationFrame(() => {
            pages.forEach(p => {
                p.classList.remove("active", "slide-out-left", "slide-in-right", "slide-out-right", "slide-in-left");
            });

            if (activePage) {
                activePage.classList.add(isForward ? "slide-out-left" : "slide-out-right");
            }

            targetPage.classList.add(isForward ? "slide-in-right" : "slide-in-left");
            targetPage.classList.add("active");
        });

        if (pageNumber === 1) {
            sheetTitle.textContent = "Settings Setup";
        } else if (pageNumber === 2) {
            sheetTitle.textContent = "System Personalization";
        } else if (pageNumber === 3) {
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
        
        // Mark setup as completely finished so popup stops appearing
        localStorage.setItem("ios26_setup_completed", "true");

        displayProfileName.textContent = `${fName} ${lName}`.trim();

        closeSheet();
    });
});
