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
           

        // --- Native APK / Build.yml Wi-Fi State & Rename Engine Elements ---
    const wifiNav = document.getElementById("wifiNav");
    const wifiView = document.getElementById("wifiView");
    const backToMainFromWifi = document.getElementById("backToMainFromWifi");
    const wifiToggle = document.getElementById("wifiToggle");
    const mainWifiStatusText = document.getElementById("mainWifiStatusText");
    const wifiDynamicContentWrapper = document.getElementById("wifiDynamicContentWrapper");
    const connectedNetworkCard = document.getElementById("connectedNetworkCard");
    const connectedNetworkName = document.getElementById("connectedNetworkName");

    // Rename Popup Elements
    const wifiInfoBtn = document.getElementById("wifiInfoBtn");
    const wifiRenameOverlay = document.getElementById("wifiRenameOverlay");
    const wifiRenameInput = document.getElementById("wifiRenameInput");
    const wifiCancelRenameBtn = document.getElementById("wifiCancelRenameBtn");
    const wifiConfirmRenameBtn = document.getElementById("wifiConfirmRenameBtn");

    let isWifiOn = localStorage.getItem("ios26_wifi_on") !== "false";
    if (wifiToggle) wifiToggle.checked = isWifiOn;

    function getNativeAppNetworkState() {
        if (navigator.connection) {
            const networkState = navigator.connection.type;
            if (typeof Connection !== 'undefined') {
                if (networkState === Connection.WIFI) {
                    return { status: "Connected", connected: true, type: "wifi" };
                } else if (networkState === Connection.NONE || networkState === Connection.UNKNOWN) {
                    return { status: "Not Connected", connected: false, type: "none" };
                } else {
                    return { status: "Not Connected", connected: false, type: "cellular" };
                }
            }
        }
        if (!navigator.onLine) {
            return { status: "Not Connected", connected: false, type: "none" };
        }
        return { status: "Connected", connected: true, type: "unknown" };
    }

    function updateTruncatedWifiName(name) {
        const maxLength = 18;
        let displayName = name;
        if (name.length > maxLength) {
            displayName = name.substring(0, maxLength) + "…";
        }
        // Update Wi-Fi sub-page connected network card label
        if (connectedNetworkName) {
            connectedNetworkName.textContent = displayName;
        }
        // Synchronize and display the active custom Wi-Fi name on the main settings page view
        if (mainWifiStatusText && isWifiOn) {
            mainWifiStatusText.textContent = displayName;
        }
    }



                                        function updateLiveWifiUI() {
        const state = getNativeAppNetworkState();
        const savedCustomWifiName = localStorage.getItem("ios26_custom_wifi_name") || "Home_WiFi_5G";
        const animatableElements = document.querySelectorAll(".wifi-animatable-section");
        const connectedNetworkCardContainer = document.getElementById("connectedNetworkCardContainer");

        // Check browser / network connection type precisely
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const effectiveType = connection ? connection.type : null;
        const networkTypeStr = (state.type || effectiveType || "").toLowerCase();

        // Check if device is actively on cellular/mobile data
        const isCellular = effectiveType === 'cellular' || networkTypeStr.includes('cellular') || networkTypeStr.includes('data');

        // Check if device is strictly connected to Wi-Fi
        const isWifiConnected = state.connected && !isCellular && (networkTypeStr.includes('wifi') || networkTypeStr.includes('wireless') || networkTypeStr === 'unknown');

        if (!isWifiOn) {
            // Condition 1: Wi-Fi toggle is OFF -> Hide everything and animate connected card away
            if (mainWifiStatusText) mainWifiStatusText.textContent = "Off";
            animatableElements.forEach(el => el.classList.add("wifi-hidden"));
            if (connectedNetworkCardContainer) {
                connectedNetworkCardContainer.classList.add("wifi-hidden");
            }
            localStorage.setItem("ios26_wifi_on", "false");
        } else {
            // Condition 2: Wi-Fi toggle is ON -> Show general Wi-Fi sections
            animatableElements.forEach(el => el.classList.remove("wifi-hidden"));
            localStorage.setItem("ios26_wifi_on", "true");

            // Check real-time connection state for the connected card
            if (isWifiConnected) {
                // Toggle ON & Wi-Fi Connected -> Animate and display connected card
                updateTruncatedWifiName(savedCustomWifiName);
                if (connectedNetworkCardContainer) {
                    connectedNetworkCardContainer.classList.remove("wifi-hidden");
                }
            } else {
                // Toggle ON, but Wi-Fi Disconnected or using Mobile Data -> Animate connected card away
                if (mainWifiStatusText) mainWifiStatusText.textContent = "Not Connected";
                if (connectedNetworkCardContainer) {
                    connectedNetworkCardContainer.classList.add("wifi-hidden");
                }
            }
        }
    }






    


    // Initialize Wi-Fi name input value
    if (wifiRenameInput) {
        wifiRenameInput.value = localStorage.getItem("ios26_custom_wifi_name") || "Home_WiFi_5G";
    }

    // Wi-Fi Popup Event Listeners
    if (wifiInfoBtn && wifiRenameOverlay) {
        wifiInfoBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            wifiRenameInput.value = localStorage.getItem("ios26_custom_wifi_name") || "Home_WiFi_5G";
            wifiRenameOverlay.classList.add("active");
        });
    }

    if (wifiCancelRenameBtn && wifiRenameOverlay) {
        wifiCancelRenameBtn.addEventListener("click", () => {
            wifiRenameOverlay.classList.remove("active");
        });
    }

    if (wifiConfirmRenameBtn && wifiRenameOverlay) {
        wifiConfirmRenameBtn.addEventListener("click", () => {
            let newName = wifiRenameInput.value.trim();
            if (newName === "") {
                newName = "Home_WiFi_5G";
            }
            localStorage.setItem("ios26_custom_wifi_name", newName);
            updateTruncatedWifiName(newName);
            wifiRenameOverlay.classList.remove("active");
        });
    }

    

    document.addEventListener("online", updateLiveWifiUI, false);
    document.addEventListener("offline", updateLiveWifiUI, false);
    window.addEventListener('online', updateLiveWifiUI);
    window.addEventListener('offline', updateLiveWifiUI);

    if (wifiToggle) {
        wifiToggle.addEventListener("change", () => {
            isWifiOn = wifiToggle.checked;
            updateLiveWifiUI();
        });
    }

    document.addEventListener("deviceready", () => {
        updateLiveWifiUI();
    }, false);

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

    function setTheme(theme) {
        htmlElement.classList.add("theme-transitioning");
        htmlElement.setAttribute("data-theme", theme);
        localStorage.setItem("ios26_theme", theme);

        if (lightModeOption && darkModeOption) {
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
    
    if (automaticToggle) automaticToggle.checked = savedAutomatic;

    if (savedAutomatic) {
        setTheme(getSystemTheme());
    } else if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme("dark");
    }

    if (lightModeOption) {
        lightModeOption.addEventListener("click", () => {
            if (automaticToggle && automaticToggle.checked) {
                automaticToggle.checked = false;
                localStorage.setItem("ios26_automatic", "false");
            }
            setTheme("light");
        });
    }

    if (darkModeOption) {
        darkModeOption.addEventListener("click", () => {
            if (automaticToggle && automaticToggle.checked) {
                automaticToggle.checked = false;
                localStorage.setItem("ios26_automatic", "false");
            }
            setTheme("dark");
        });
    }

    if (automaticToggle) {
        automaticToggle.addEventListener("change", () => {
            const isAutomatic = automaticToggle.checked;
            localStorage.setItem("ios26_automatic", isAutomatic);
            if (isAutomatic) setTheme(getSystemTheme());
        });
    }

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

    // Add scroll listener to subviews for advanced iOS header blur behavior
    document.querySelectorAll('.settings-subview').forEach(subview => {
        subview.addEventListener('scroll', () => {
            const header = subview.querySelector('.subview-header');
            if (!header) return;
            
            if (subview.scrollTop > 10) {
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
            } else {
                header.style.boxShadow = 'none';
            }
        });
    });

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
