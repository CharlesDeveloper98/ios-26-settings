document.addEventListener("DOMContentLoaded", () => {
    const sheetOverlay = document.getElementById("sheetOverlay");
    const finishStartupBtn = id => document.getElementById("finishStartupBtn");

    // Navigation Views Elements
    const mainSettingsView = document.getElementById("mainSettingsView");
    const displayBrightnessView = document.getElementById("displayBrightnessView");
    const displayBrightnessNav = document.getElementById("displayBrightnessNav");
    const backToMainSettings = document.getElementById("backToMainSettings");
           
    // Wi-Fi State Engine Elements
    const wifiNav = document.getElementById("wifiNav");
    const wifiView = document.getElementById("wifiView");
    const backToMainFromWifi = document.getElementById("backToMainFromWifi");
    const wifiToggle = document.getElementById("wifiToggle");
    const mainWifiStatusText = document.getElementById("mainWifiStatusText");
    const connectedNetworkCard = document.getElementById("connectedNetworkCard");
    const connectedNetworkName = document.getElementById("connectedNetworkName");

    // Options Sub-Page View Elements
    const optionsNav = document.getElementById("optionsNav");
    const optionsView = document.getElementById("optionsView");
    const backToDisplayFromOptions = document.getElementById("backToDisplayFromOptions");
    const selectedOptionText = document.getElementById("selectedOptionText");
    const optionRows = document.querySelectorAll(".option-select-row");

    let savedAppearanceOption = localStorage.getItem("ios26_appearance_option") || "Sunset to Sunrise";
    if (selectedOptionText) selectedOptionText.textContent = savedAppearanceOption;

    optionRows.forEach(row => {
        if (row.getAttribute("data-option") === savedAppearanceOption) {
            row.querySelector(".option-checkmark").textContent = "✓";
        } else {
            row.querySelector(".option-checkmark").textContent = "";
        }

        row.addEventListener("click", () => {
            const chosen = row.getAttribute("data-option");
            localStorage.setItem("ios26_appearance_option", chosen);
            if (selectedOptionText) selectedOptionText.textContent = chosen;

            optionRows.forEach(r => {
                r.querySelector(".option-checkmark").textContent = "";
            });
            row.querySelector(".option-checkmark").textContent = "✓";
        });
    });

    if (optionsNav && optionsView && backToDisplayFromOptions) {
        optionsNav.addEventListener("click", () => {
            requestAnimationFrame(() => {
                displayBrightnessView.classList.add("slide-left");
                optionsView.classList.add("active");
            });
        });

        backToDisplayFromOptions.addEventListener("click", () => {
            requestAnimationFrame(() => {
                optionsView.classList.remove("active");
                displayBrightnessView.classList.remove("slide-left");
            });
        });
    }

    // Finish Setting Up Your iPhone Sub-page
    const finishSetupNav = document.getElementById("finishSetupNav");
    const finishSetupView = document.getElementById("finishSetupView");
    const backToMainFromFinishSetup = document.getElementById("backToMainFromFinishSetup");
    const triggerImagePickerRow = document.getElementById("triggerImagePickerRow");
    const profileAvatarContainer = document.getElementById("profileAvatarContainer");
    const deviceImageSelector = document.getElementById("deviceImageSelector");
    const displayProfileAvatar = document.getElementById("displayProfileAvatar");
    const setupPageContactIcon = document.getElementById("setupPageContactIcon");

    const savedAvatarData = localStorage.getItem("ios26_custom_avatar");
    if (savedAvatarData && displayProfileAvatar) {
        displayProfileAvatar.src = savedAvatarData;
        if (setupPageContactIcon) setupPageContactIcon.src = savedAvatarData;
    }

    if (finishSetupNav && finishSetupView && backToMainFromFinishSetup) {
        finishSetupNav.addEventListener("click", () => {
            requestAnimationFrame(() => {
                mainSettingsView.classList.add("slide-left");
                finishSetupView.classList.add("active");
            });
        });

        backToMainFromFinishSetup.addEventListener("click", () => {
            requestAnimationFrame(() => {
                finishSetupView.classList.remove("active");
                mainSettingsView.classList.remove("slide-left");
            });
        });
    }

    function openImageSelector() {
        if (deviceImageSelector) deviceImageSelector.click();
    }

    if (triggerImagePickerRow) triggerImagePickerRow.addEventListener("click", openImageSelector);
    if (profileAvatarContainer) profileAvatarContainer.addEventListener("click", (e) => {
        e.stopPropagation();
        openImageSelector();
    });

    if (deviceImageSelector) {
        deviceImageSelector.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const base64Image = e.target.result;
                    localStorage.setItem("ios26_custom_avatar", base64Image);
                    if (displayProfileAvatar) displayProfileAvatar.src = base64Image;
                    if (setupPageContactIcon) setupPageContactIcon.src = base64Image;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const wifiInfoBtn = document.getElementById("wifiInfoBtn");
    const wifiRenameOverlay = document.getElementById("wifiRenameOverlay");
    const wifiRenameInput = document.getElementById("wifiRenameInput");
    const wifiCancelRenameBtn = document.getElementById("wifiCancelRenameBtn");
    const wifiConfirmRenameBtn = document.getElementById("wifiConfirmRenameBtn");

    let isWifiOn = localStorage.getItem("ios26_wifi_on") !== "false";
    if (wifiToggle) wifiToggle.checked = isWifiOn;

    function getNativeAppNetworkState() {
        if (!navigator.onLine) {
            return { status: "Not Connected", connected: false, type: "none" };
        }
        return { status: "Connected", connected: true, type: "unknown" };
    }

    function updateTruncatedWifiName(name) {
        const maxLength = 18;
        let displayName = name.length > maxLength ? name.substring(0, maxLength) + "…" : name;
        if (connectedNetworkName) connectedNetworkName.textContent = displayName;
        if (mainWifiStatusText && isWifiOn) mainWifiStatusText.textContent = displayName;
    }

    function updateLiveWifiUI() {
        const state = getNativeAppNetworkState();
        const savedCustomWifiName = localStorage.getItem("ios26_custom_wifi_name") || "Home_WiFi_5G";
        const animatableElements = document.querySelectorAll(".wifi-animatable-section");
        const connectedNetworkCardContainer = document.getElementById("connectedNetworkCardContainer");

        if (!isWifiOn) {
            if (mainWifiStatusText) mainWifiStatusText.textContent = "Off";
            animatableElements.forEach(el => el.classList.add("wifi-hidden"));
            if (connectedNetworkCardContainer) connectedNetworkCardContainer.classList.add("wifi-hidden");
            localStorage.setItem("ios26_wifi_on", "false");
        } else {
            animatableElements.forEach(el => el.classList.remove("wifi-hidden"));
            localStorage.setItem("ios26_wifi_on", "true");
            if (state.connected) {
                updateTruncatedWifiName(savedCustomWifiName);
                if (connectedNetworkCardContainer) connectedNetworkCardContainer.classList.remove("wifi-hidden");
            } else {
                if (mainWifiStatusText) mainWifiStatusText.textContent = "Not Connected";
                if (connectedNetworkCardContainer) connectedNetworkCardContainer.classList.add("wifi-hidden");
            }
        }
    }

    if (wifiRenameInput) {
        wifiRenameInput.value = localStorage.getItem("ios26_custom_wifi_name") || "Home_WiFi_5G";
    }

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
            let newName = wifiRenameInput.value.trim() || "Home_WiFi_5G";
            localStorage.setItem("ios26_custom_wifi_name", newName);
            updateTruncatedWifiName(newName);
            wifiRenameOverlay.classList.remove("active");
        });
    }

    if (wifiToggle) {
        wifiToggle.addEventListener("change", () => {
            isWifiOn = wifiToggle.checked;
            updateLiveWifiUI();
        });
    }

    updateLiveWifiUI();

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

    const generalNav = document.getElementById("generalNav");
    const generalView = document.getElementById("generalView");
    const backToMainFromGeneral = document.getElementById("backToMainFromGeneral");

    const batteryNav = document.getElementById("batteryNav");
    const batteryView = document.getElementById("batteryView");
    const backToMainFromBattery = document.getElementById("backToMainFromBattery");

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

    // iOS 26 Unique Startup Sheet Flow Logic
    const isSetupFinished = localStorage.getItem("ios26_setup_completed") === "true";
    const startBtn = document.getElementById("finishStartupBtn");

    if (!isSetupFinished && sheetOverlay) {
        setTimeout(() => {
            sheetOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }, 400);
    }

    if (startBtn) {
        startBtn.addEventListener("click", () => {
            localStorage.setItem("ios26_setup_completed", "true");
            if (sheetOverlay) {
                sheetOverlay.classList.remove("active");
                document.body.style.overflow = "";
            }
        });
    }
});
