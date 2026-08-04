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

        
           
           // --- Native APK / Build.yml Wi-Fi State Engine ---
    const wifiNav = document.getElementById("wifiNav");
    const wifiView = document.getElementById("wifiView");
    const backToMainFromWifi = document.getElementById("backToMainFromWifi");
    const wifiToggle = document.getElementById("wifiToggle");
    const mainWifiStatusText = document.getElementById("mainWifiStatusText");
    const wifiDynamicContentWrapper = document.getElementById("wifiDynamicContentWrapper");
    const connectedNetworkCard = document.getElementById("connectedNetworkCard");
    const connectedNetworkName = document.getElementById("connectedNetworkName");

    let isWifiOn = localStorage.getItem("ios26_wifi_on") !== "false";
    if (wifiToggle) wifiToggle.checked = isWifiOn;

    function getNativeAppNetworkState() {
        // Check standard Cordova/PhoneGap connection plugin if available in APK build
        if (navigator.connection) {
            const networkState = navigator.connection.type;
            
            // Connection types defined by cordova-plugin-network-information
            if (typeof Connection !== 'undefined') {
                if (networkState === Connection.WIFI) {
                    return { status: "Connected", connected: true, type: "wifi" };
                } else if (networkState === Connection.NONE || networkState === Connection.UNKNOWN) {
                    return { status: "Not Connected", connected: false, type: "none" };
                } else {
                    // Cellular or other data types while Wi-Fi switch might be active
                    return { status: "Not Connected", connected: false, type: "cellular" };
                }
            }
        }

        // Fallback for native Android webviews supporting standard navigator online properties
        if (!navigator.onLine) {
            return { status: "Not Connected", connected: false, type: "none" };
        }

        // Default assumption if online through a network interface
        return { status: "Connected", connected: true, type: "unknown" };
    }

    function updateLiveWifiUI() {
        const state = getNativeAppNetworkState();

        if (!isWifiOn) {
            // Wi-Fi Switch is toggled OFF manually by user
            if (mainWifiStatusText) mainWifiStatusText.textContent = "Off";
            if (wifiDynamicContentWrapper) wifiDynamicContentWrapper.classList.add("wifi-hidden");
            
            if (connectedNetworkCard) {
                connectedNetworkCard.classList.remove("animate-show");
                connectedNetworkCard.classList.add("animate-hide");
            }
            localStorage.setItem("ios26_wifi_on", "false");
        } else {
            // Wi-Fi Switch is toggled ON
            if (wifiDynamicContentWrapper) wifiDynamicContentWrapper.classList.remove("wifi-hidden");
            localStorage.setItem("ios26_wifi_on", "true");

            // Check if device is actively linked to a Wi-Fi network interface
            if (state.connected && (state.type === "wifi" || state.type === "unknown")) {
                if (mainWifiStatusText) mainWifiStatusText.textContent = "Connected";
                if (connectedNetworkName) connectedNetworkName.textContent = "Home_WiFi_5G"; 
                
                if (connectedNetworkCard) {
                    connectedNetworkCard.style.display = "block";
                    connectedNetworkCard.classList.remove("animate-hide");
                    void connectedNetworkCard.offsetWidth; // Force layout reflow for animation
                    connectedNetworkCard.classList.add("animate-show");
                }
            } else {
                // Wi-Fi is turned ON in settings, but phone isn't linked to any router/access point
                if (mainWifiStatusText) mainWifiStatusText.textContent = "Not Connected";
                
                if (connectedNetworkCard) {
                    connectedNetworkCard.classList.remove("animate-show");
                    connectedNetworkCard.classList.add("animate-hide");
                }
            }
        }
    }

    // Native Cordova / WebView Event Listeners bundled into APK builds
    document.addEventListener("online", updateLiveWifiUI, false);
    document.addEventListener("offline", updateLiveWifiUI, false);
    
    // Standard web fallbacks just in case
    window.addEventListener('online', updateLiveWifiUI);
    window.addEventListener('offline', updateLiveWifiUI);

    if (wifiToggle) {
        wifiToggle.addEventListener("change", () => {
            isWifiOn = wifiToggle.checked;
            updateLiveWifiUI();
        });
    }

    // Run check on initial application view load inside APK
    document.addEventListener("deviceready", () => {
        updateLiveWifiUI();
    }, false);

    // Immediate fallback execution
    updateLiveWifiUI();



    

    // Wi-Fi Sub-page Slide Navigation Bindings
    if (wifiNav && wifiView && backToMainFromWifi) {
        wifiNav.addEventListener("click", () => {
            requestAnimationFrame(() => {
                mainSettingsView.classList.add("slide-left");
                wifiView.classList.add("active");
            });
        });

        backToMainFromWifi.addEventListener("click", () => {
            requestAnimationFrame(() => {
                wifiView.classList.remove("active");
                mainSettingsView.classList.remove("slide-left");
            });
        });
    }

    // General View Elements
    const generalNav = document.getElementById("generalNav");
    const generalView = document.getElementById("generalView");
    const backToMainFromGeneral = document.getElementById("backToMainFromGeneral");

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

    // Precise Battery Tracking Engine
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
                if (batteryPercentText) batteryPercentText.textContent = `${currentPercent}%`;
                if (mainBatteryStatusText) mainBatteryStatusText.textContent = `${currentPercent}%`;
                if (batteryLevelFill) batteryLevelFill.style.width = `${currentPercent}%`;

                if (batteryLevelFill) {
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
                }

                if (lastChargedText) {
                    if (lastUnpluggedPercent && lastUnpluggedTime) {
                        const timeAgoString = formatTimeAgo(lastUnpluggedTime);
                        lastChargedText.textContent = `Last Charged to ${lastUnpluggedPercent}%: ${timeAgoString}`;
                    } else {
                        lastChargedText.textContent = `Last Charged: Not available yet`;
                    }
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
        if (lastChargedText) lastChargedText.textContent = `Last Charged: Not supported`;
    }

    // Display & Brightness interactive state elements
    const lightModeOption = document.getElementById("lightModeOption");
    const darkModeOption = document.getElementById("darkModeOption");
    const automaticToggle = document.getElementById("automaticToggle");
    const htmlElement = document.documentElement;



        // --- Native APK / Build.yml System Theme Engine ---
    const autoThemeToggle = document.getElementById("autoThemeToggle"); // Adjust ID to match your actual automatic switch element
    const lightThemeBtn = document.getElementById("lightThemeCard");   // Adjust to your light theme selector element if needed
    const darkThemeBtn = document.getElementById("darkThemeCard");     // Adjust to your dark theme selector element if needed

    function applyTheme(theme) {
        if (theme === "dark") {
            document.documentElement.classList.add("dark-theme");
            document.documentElement.classList.remove("light-theme");
            localStorage.setItem("ios26_theme", "dark");
        } else {
            document.documentElement.classList.add("light-theme");
            document.documentElement.classList.remove("dark-theme");
            localStorage.setItem("ios26_theme", "light");
        }
    }

    function checkSystemTheme() {
        const isAutoEnabled = localStorage.getItem("ios26_auto_theme") === "true";
        
        if (isAutoEnabled) {
            // Check native OS dark mode preference inside Android WebView
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? "dark" : "light");
        }
    }

    // Listen to real-time system theme changes on Android
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (localStorage.getItem("ios26_auto_theme") === "true") {
                applyTheme(event.matches ? "dark" : "light");
            }
        });
    }

    // Handle Automatic Toggle Switch change
    if (autoThemeToggle) {
        autoThemeToggle.checked = localStorage.getItem("ios26_auto_theme") === "true";
        
        autoThemeToggle.addEventListener("change", () => {
            if (autoThemeToggle.checked) {
                localStorage.setItem("ios26_auto_theme", "true");
                checkSystemTheme();
            } else {
                localStorage.setItem("ios26_auto_theme", "false");
            }
        });
    }

    // Initial check on app startup inside APK
    document.addEventListener("deviceready", () => {
        checkSystemTheme();
    }, false);

    checkSystemTheme();

    

    // Bold Text interactive state
    const boldTextToggle = document.getElementById("boldTextToggle");
    const savedBoldText = localStorage.getItem("ios26_boldtext") === "true";

    if (boldTextToggle) {
        boldTextToggle.checked = savedBoldText;
        if (savedBoldText) htmlElement.classList.add("bold-text-enabled");

        boldTextToggle.addEventListener("change", () => {
            const isBold = boldTextToggle.checked;
            localStorage.setItem("ios26_boldtext", isBold);
            if (isBold) {
                htmlElement.classList.add("bold-text-enabled");
            } else {
                htmlElement.classList.remove("bold-text-enabled");
            }
        });
    }

    // Sub-page sliding navigations
    if (generalNav && generalView && backToMainFromGeneral) {
        generalNav.addEventListener("click", () => {
            requestAnimationFrame(() => {
                mainSettingsView.classList.add("slide-left");
                generalView.classList.add("active");
            });
        });

        backToMainFromGeneral.addEventListener("click", () => {
            requestAnimationFrame(() => {
                generalView.classList.remove("active");
                mainSettingsView.classList.remove("slide-left");
            });
        });
    }

    if (displayBrightnessNav && displayBrightnessView && backToMainSettings) {
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
    }

    if (batteryNav && batteryView && backToMainFromBattery) {
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
    }

    const savedFirstName = localStorage.getItem("ios26_firstname");
    const savedLastName = localStorage.getItem("ios26_lastname");
    if ((savedFirstName || savedLastName) && displayProfileName) {
        displayProfileName.textContent = `${savedFirstName || ""} ${savedLastName || ""}`.trim();
    }

    // Setup Flow Popup Logic
    const isSetupFinished = localStorage.getItem("ios26_setup_completed") === "true";
    if (!isSetupFinished && sheetOverlay) {
        setTimeout(() => openSheet(), 400);
    }

    function openSheet() {
        if (!sheetOverlay) return;
        sheetOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
        requestAnimationFrame(() => goToPage(1));
    }

    function closeSheet() {
        if (!sheetOverlay) return;
        sheetOverlay.classList.remove("active");
        document.body.style.overflow = "";
    }

    function goToPage(pageNumber) {
        const pages = [page1, page2, page3];
        const targetPage = pages[pageNumber - 1];
        if (!targetPage) return;
        
        const activePage = document.querySelector('.setup-page.active');
        if (activePage === targetPage) return;

        const activePageNumber = activePage ? parseInt(activePage.id.replace('page', '')) : 1;
        const isForward = pageNumber > activePageNumber;

        requestAnimationFrame(() => {
            pages.forEach(p => {
                if (p) p.classList.remove("active", "slide-out-left", "slide-in-right", "slide-out-right", "slide-in-left");
            });

            if (activePage) {
                activePage.classList.add(isForward ? "slide-out-left" : "slide-out-right");
            }

            targetPage.classList.add(isForward ? "slide-in-right" : "slide-in-left");
            targetPage.classList.add("active");
        });

        if (sheetTitle) {
            if (pageNumber === 1) sheetTitle.textContent = "Settings Setup";
            else if (pageNumber === 2) sheetTitle.textContent = "System Personalization";
            else if (pageNumber === 3) {
                sheetTitle.textContent = "Profile Setup";
                validateInputs();
            }
        }
    }

    function validateInputs() {
        if (!firstNameInput || !lastNameInput || !finishBtn) return;
        const fName = firstNameInput.value.trim();
        const lName = lastNameInput.value.trim();

        if (fName !== "" || lName !== "") {
            finishBtn.classList.remove("disabled");
            finishBtn.classList.add("ios-blue");
            if (errorMsg) errorMsg.classList.remove("visible");
        } else {
            finishBtn.classList.add("disabled");
            finishBtn.classList.remove("ios-blue");
        }
    }

    if (firstNameInput) firstNameInput.addEventListener("input", validateInputs);
    if (lastNameInput) lastNameInput.addEventListener("input", validateInputs);

    if (toPage2Btn) toPage2Btn.addEventListener("click", () => goToPage(2));
    if (toPage1Btn) toPage1Btn.addEventListener("click", () => goToPage(1));
    if (toPage3Btn) toPage3Btn.addEventListener("click", () => goToPage(3));
    if (toPage2BtnFrom3) toPage2BtnFrom3.addEventListener("click", () => goToPage(2));

    if (finishBtn) {
        finishBtn.addEventListener("click", () => {
            const fName = firstNameInput ? firstNameInput.value.trim() : "";
            const lName = lastNameInput ? lastNameInput.value.trim() : "";

            if (fName === "" && lName === "") {
                if (profileCard) {
                    profileCard.classList.remove("shake");
                    void profileCard.offsetWidth;
                    profileCard.classList.add("shake");
                }
                if (errorMsg) errorMsg.classList.add("visible");
                return;
            }

            localStorage.setItem("ios26_firstname", fName);
            localStorage.setItem("ios26_lastname", lName);
            localStorage.setItem("ios26_setup_completed", "true");

            if (displayProfileName) {
                displayProfileName.textContent = `${fName} ${lName}`.trim();
            }

            closeSheet();
        });
    }
});
