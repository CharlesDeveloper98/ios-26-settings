document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. DOM ELEMENT REFERENCES & INITIALIZATION
    // ==========================================
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
           
    // Wi-Fi Engine Elements
    const wifiNav = document.getElementById("wifiNav");
    const wifiView = document.getElementById("wifiView");
    const backToMainFromWifi = document.getElementById("backToMainFromWifi");
    const wifiToggle = document.getElementById("wifiToggle");
    const mainWifiStatusText = document.getElementById("mainWifiStatusText");
    const wifiDynamicContentWrapper = document.getElementById("wifiDynamicContentWrapper");
    const connectedNetworkCard = document.getElementById("connectedNetworkCard");
    const connectedNetworkName = document.getElementById("connectedNetworkName");
    const wifiInfoBtn = document.getElementById("wifiInfoBtn");
    const wifiRenameOverlay = document.getElementById("wifiRenameOverlay");
    const wifiRenameInput = document.getElementById("wifiRenameInput");
    const wifiCancelRenameBtn = document.getElementById("wifiCancelRenameBtn");
    const wifiConfirmRenameBtn = document.getElementById("wifiConfirmRenameBtn");

    // Options Sub-Page View Elements
    const optionsNav = document.getElementById("optionsNav");
    const optionsView = document.getElementById("optionsView");
    const backToDisplayFromOptions = document.getElementById("backToDisplayFromOptions");
    const selectedOptionText = document.getElementById("selectedOptionText");
    const optionRows = document.querySelectorAll(".option-select-row");

    // Apple Account Signup Elements
    const finishSetupNav = document.getElementById("finishSetupNav");
    const profileCardLink = document.querySelector(".profile-card-link");
    const appleSignupOverlay = document.getElementById("appleSignupOverlay");
    const closeAppleSignupBtn = document.getElementById("closeAppleSignupBtn");
    const appleSignInSubmitBtn = document.getElementById("appleSignInSubmitBtn");
    const useEmailBtn = document.getElementById("useEmailBtn");
    const usePhoneBtn = document.getElementById("usePhoneBtn");
    const appleIdentifier = document.getElementById("appleIdentifier");
    const inputLabel = document.getElementById("inputLabel");
    const countryDisplayTag = document.getElementById("countryDisplayTag");
    const ios26AlertBox = document.getElementById("ios26AlertBox");
    const emailInputRow = document.getElementById("emailInputRow");
    const phoneInputRow = document.getElementById("phoneInputRow");

    // Country Code Picker Elements
    const countryPickerOverlay = document.getElementById("countryPickerOverlay");
    const countrySelectorTrigger = document.getElementById("countrySelectorTrigger");
    const closeCountryPickerBtn = document.getElementById("closeCountryPickerBtn");
    const countryListContainer = document.getElementById("countryListContainer");
    const alphabetGlideSidebar = document.getElementById("alphabetGlideSidebar");
    const countrySearchInput = document.getElementById("countrySearchInput");
    const selectedCountryFlag = document.getElementById("selectedCountryFlag");
    const selectedCountryCodeText = document.getElementById("selectedCountryCodeText");
    const phoneNumberField = document.getElementById("phoneNumberField");

    // Password & Authentication Elements
    const passwordInput = document.getElementById("applePassword");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const eyeIcon = document.getElementById("eyeIcon");
    const continueBtn = document.getElementById('continueButton');
    const errorContainer = document.getElementById('errorAlertMessage');

    // General & Battery Elements
    const generalNav = document.getElementById("generalNav");
    const generalView = document.getElementById("generalView");
    const backToMainFromGeneral = document.getElementById("backToMainFromGeneral");
    const batteryNav = document.getElementById("batteryNav");
    const batteryView = document.getElementById("batteryView");
    const backToMainFromBattery = document.getElementById("backToMainFromBattery");
    const batteryPercentText = document.getElementById("batteryPercentText");
    const mainBatteryStatusText = document.getElementById("mainBatteryStatusText");
    const batteryLevelFill = document.getElementById("batteryLevelFill");
    const lastChargedText = document.getElementById("lastChargedText");

    // Display, Brightness & Theme Elements
    const lightModeOption = document.getElementById("lightModeOption");
    const darkModeOption = document.getElementById("darkModeOption");
    const automaticToggle = document.getElementById("automaticToggle");
    const boldTextToggle = document.getElementById("boldTextToggle");
    const htmlElement = document.documentElement;

    // ==========================================
    // 2. APPEARANCE & OPTIONS SUB-PAGE ENGINE
    // ==========================================
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

    // ==========================================
    // 3. APPLE ACCOUNT SIGNUP & MODAL ENGINE
    // ==========================================
    let alertFadeTimer = null;

    function showIOS26Alert(message) {
        if (!ios26AlertBox) return;
        if (alertFadeTimer) clearTimeout(alertFadeTimer);

        ios26AlertBox.textContent = message;
        ios26AlertBox.classList.add("show");

        alertFadeTimer = setTimeout(() => {
            ios26AlertBox.classList.remove("show");
        }, 5000);
    }

    function openAppleSignupModal() {
        if (appleSignupOverlay) {
            appleSignupOverlay.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    }

    function closeAppleSignupModal() {
        if (appleSignupOverlay) {
            appleSignupOverlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    }

    if (finishSetupNav) finishSetupNav.addEventListener("click", (e) => { e.stopPropagation(); openAppleSignupModal(); });
    if (profileCardLink) profileCardLink.addEventListener("click", openAppleSignupModal);
    if (closeAppleSignupBtn) closeAppleSignupBtn.addEventListener("click", closeAppleSignupModal);
    if (appleSignInSubmitBtn) appleSignInSubmitBtn.textContent = "Continue";

    function updateSwitchContainerStates() {
        const val = appleIdentifier ? appleIdentifier.value.trim() : "";
        const isUsingPhone = usePhoneBtn && usePhoneBtn.classList.contains("active");

        if (val.length > 0 && val !== "+") {
            if (isUsingPhone) {
                useEmailBtn.classList.add("dimmed");
                usePhoneBtn.classList.remove("dimmed");
            } else {
                usePhoneBtn.classList.add("dimmed");
                useEmailBtn.classList.remove("dimmed");
            }
        } else {
            useEmailBtn.classList.remove("dimmed");
            usePhoneBtn.classList.remove("dimmed");
        }
    }

    // ==========================================
    // 4. COUNTRY DATABASE & RULES
    // ==========================================
    const countriesDatabase = [
        { name: "Afghanistan", code: "+93", flag: "🇦🇫", letter: "A" },
        { name: "Albania", code: "+355", flag: "🇦🇱", letter: "A" },
        { name: "Algeria", code: "+213", flag: "🇩🇿", letter: "A" },
        { name: "Andorra", code: "+376", flag: "🇦🇩", letter: "A" },
        { name: "Angola", code: "+244", flag: "🇦🇴", letter: "A" },
        { name: "Argentina", code: "+54", flag: "🇦🇷", letter: "A" },
        { name: "Armenia", code: "+374", flag: "🇦🇲", letter: "A" },
        { name: "Australia", code: "+61", flag: "🇦🇺", letter: "A" },
        { name: "Austria", code: "+43", flag: "🇦🇹", letter: "A" },
        { name: "Azerbaijan", code: "+994", flag: "🇦🇿", letter: "A" },
        { name: "Bahamas", code: "+1242", flag: "🇧🇸", letter: "B" },
        { name: "Bahrain", code: "+973", flag: "🇧🇭", letter: "B" },
        { name: "Bangladesh", code: "+880", flag: "🇧🇩", letter: "B" },
        { name: "Belarus", code: "+375", flag: "🇧🇾", letter: "B" },
        { name: "Belgium", code: "+32", flag: "🇧🇪", letter: "B" },
        { name: "Brazil", code: "+55", flag: "🇧🇷", letter: "B" },
        { name: "Canada", code: "+1", flag: "🇨🇦", letter: "C" },
        { name: "China", code: "+86", flag: "🇨🇳", letter: "C" },
        { name: "Egypt", code: "+20", flag: "🇪🇬", letter: "E" },
        { name: "France", code: "+33", flag: "🇫🇷", letter: "F" },
        { name: "Germany", code: "+49", flag: "🇩🇪", letter: "G" },
        { name: "India", code: "+91", flag: "🇮🇳", letter: "I" },
        { name: "Italy", code: "+39", flag: "🇮🇹", letter: "I" },
        { name: "Japan", code: "+81", flag: "🇯🇵", letter: "J" },
        { name: "Nigeria", code: "+234", flag: "🇳🇬", letter: "N" },
        { name: "UK", code: "+44", flag: "🇬🇧", letter: "U" },
        { name: "USA / Canada", code: "+1", flag: "🇺🇸", letter: "🇺" }
    ];

    const countryRules = {
        "+1": { name: "USA / Canada", mask: "+1 (###) ###-####" },
        "+20": { name: "Egypt", mask: "+20 ### ### ####" },
        "+33": { name: "France", mask: "+33 # ## ## ## ##" },
        "+39": { name: "Italy", mask: "+39 ### ### ####" },
        "+44": { name: "UK", mask: "+44 #### ######" },
        "+49": { name: "Germany", mask: "+49 ### #######" },
        "+55": { name: "Brazil", mask: "+55 ## ##### ####" },
        "+81": { name: "Japan", mask: "+81 ## #### ####" },
        "+86": { name: "China", mask: "+86 ### #### ####" },
        "+91": { name: "India", mask: "+91 ##### #####" },
        "+234": { name: "Nigeria", mask: "+234 ### ### ####" }
    };

    let currentSelectedCountry = countriesDatabase.find(c => c.code === "+1") || countriesDatabase[0];

    function renderCountryList(filterText = "") {
        if (!countryListContainer) return;
        countryListContainer.innerHTML = "";
        
        const filtered = countriesDatabase.filter(c => 
            c.name.toLowerCase().includes(filterText.toLowerCase()) || c.code.includes(filterText)
        );

        let currentLetterHeader = "";
        filtered.forEach(country => {
            if (country.letter !== currentLetterHeader && !filterText) {
                currentLetterHeader = country.letter;
                const headerDiv = document.createElement("div");
                headerDiv.className = "country-alphabet-header";
                headerDiv.textContent = currentLetterHeader;
                headerDiv.id = `letter-header-${currentLetterHeader}`;
                countryListContainer.appendChild(headerDiv);
            }

            const row = document.createElement("div");
            row.className = "country-item-row clickable";
            row.innerHTML = `
                <div class="country-row-left">
                    <span class="country-item-flag">${country.flag}</span>
                    <span class="country-item-name">${country.name}</span>
                </div>
                <span class="country-item-code">${country.code}</span>
            `;

            row.addEventListener("click", () => {
                selectCountry(country);
                closeCountryPickerModal();
            });

            countryListContainer.appendChild(row);
        });
    }

    function renderAlphabetSidebar() {
        if (!alphabetGlideSidebar) return;
        alphabetGlideSidebar.innerHTML = "";
        const uniqueLetters = [...new Set(countriesDatabase.map(c => c.letter))];

        uniqueLetters.forEach(letter => {
            const span = document.createElement("span");
            span.className = "alphabet-glide-letter";
            span.textContent = letter;
            span.addEventListener("click", () => {
                const targetHeader = document.getElementById(`letter-header-${letter}`);
                if (targetHeader) targetHeader.scrollIntoView({ behavior: "smooth" });
            });
            alphabetGlideSidebar.appendChild(span);
        });
    }

    function selectCountry(country) {
        currentSelectedCountry = country;
        if (selectedCountryFlag) selectedCountryFlag.textContent = country.flag;
        if (selectedCountryCodeText) selectedCountryCodeText.textContent = country.code;
        if (countryDisplayTag) countryDisplayTag.textContent = country.name;
        if (phoneNumberField) {
            phoneNumberField.value = country.code + " ";
            phoneNumberField.focus();
        }
        updateAppleButtonState();
    }

    function openCountryPickerModal() {
        if (countryPickerOverlay) {
            countryPickerOverlay.classList.add("active");
            renderCountryList();
            renderAlphabetSidebar();
        }
    }

    function closeCountryPickerModal() {
        if (countryPickerOverlay) countryPickerOverlay.classList.remove("active");
    }

    if (countrySelectorTrigger) countrySelectorTrigger.addEventListener("click", openCountryPickerModal);
    if (closeCountryPickerBtn) closeCountryPickerBtn.addEventListener("click", closeCountryPickerModal);
    if (countrySearchInput) countrySearchInput.addEventListener("input", (e) => renderCountryList(e.target.value.trim()));

    // Unified Email / Phone Switcher Logic
    if (useEmailBtn && usePhoneBtn) {
        useEmailBtn.addEventListener("click", (e) => {
            if (useEmailBtn.classList.contains("dimmed")) {
                e.stopImmediatePropagation();
                e.preventDefault();
                showIOS26Alert("You have to use only one method for sign up.");
                return;
            }
            useEmailBtn.classList.add("active");
            usePhoneBtn.classList.remove("active");
            if (emailInputRow) emailInputRow.style.display = "flex";
            if (phoneInputRow) phoneInputRow.style.display = "none";
            if (inputLabel) inputLabel.textContent = "Email";
            if (appleIdentifier) {
                appleIdentifier.type = "email";
                appleIdentifier.placeholder = "example@icloud.com";
                appleIdentifier.value = "";
            }
            if (countryDisplayTag) countryDisplayTag.textContent = "";
            updateSwitchContainerStates();
            updateAppleButtonState();
        });

        usePhoneBtn.addEventListener("click", (e) => {
            if (usePhoneBtn.classList.contains("dimmed")) {
                e.stopImmediatePropagation();
                e.preventDefault();
                showIOS26Alert("You have to use only one method for sign up.");
                return;
            }
            usePhoneBtn.classList.add("active");
            useEmailBtn.classList.remove("active");
            if (emailInputRow) emailInputRow.style.display = "none";
            if (phoneInputRow) phoneInputRow.style.display = "flex";
            if (inputLabel) inputLabel.textContent = "Phone";
            if (appleIdentifier) {
                appleIdentifier.type = "tel";
                appleIdentifier.placeholder = "+*** *** ***";
                appleIdentifier.value = "+";
            }
            if (countryDisplayTag) countryDisplayTag.textContent = "";
            updateSwitchContainerStates();
            updateAppleButtonState();
        });
    }

    // Phone Input Masking & Auto-Detection
    if (appleIdentifier) {
        appleIdentifier.addEventListener("input", (e) => {
            updateSwitchContainerStates();
            
            if (usePhoneBtn && usePhoneBtn.classList.contains("active")) {
                let val = e.target.value;
                if (!val.startsWith("+")) val = "+" + val.replace(/\+/g, "");

                let cleanDigits = val.replace(/[^\d+]/g, "");
                let detectedCountry = "";
                let matchedRule = null;

                const sortedPrefixes = Object.keys(countryRules).sort((a, b) => b.length - a.length);
                for (let prefix of sortedPrefixes) {
                    if (cleanDigits.startsWith(prefix)) {
                        detectedCountry = countryRules[prefix].name;
                        matchedRule = countryRules[prefix];
                        break;
                    }
                }

                if (countryDisplayTag) countryDisplayTag.textContent = detectedCountry;

                if (matchedRule) {
                    let activePrefix = Object.keys(countryRules).find(p => cleanDigits.startsWith(p));
                    let rawNums = cleanDigits.slice(activePrefix.length);
                    let maxAllowedDigits = (matchedRule.mask.match(/#/g) || []).length;
                    if (rawNums.length > maxAllowedDigits) rawNums = rawNums.slice(0, maxAllowedDigits);

                    let formatted = activePrefix + " ";
                    let digitIdx = 0;
                    for (let char of matchedRule.mask.slice(formatted.length)) {
                        if (char === '#' && digitIdx < rawNums.length) {
                            formatted += rawNums[digitIdx];
                            digitIdx++;
                        } else if (char !== '#' && digitIdx < rawNums.length) {
                            formatted += char;
                            if (rawNums[digitIdx]) {
                                formatted += rawNums[digitIdx];
                                digitIdx++;
                            }
                        } else {
                            break;
                        }
                    }
                    if (digitIdx < rawNums.length) formatted += rawNums.slice(digitIdx);
                    appleIdentifier.value = formatted;
                } else {
                    appleIdentifier.value = cleanDigits;
                }
            }

            if (errorContainer) {
                errorContainer.classList.remove('visible');
                errorContainer.textContent = "";
            }
            updateAppleButtonState();
        });
    }

    // Password Visibility Toggle
    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";

            if (isPassword) {
                eyeIcon.innerHTML = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>`;
            } else {
                eyeIcon.innerHTML = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>`;
            }
        });
    }

    function updateAppleButtonState() {
        if (!appleIdentifier || !passwordInput || !continueBtn) return;
        const identifierVal = appleIdentifier.value.trim();
        const passwordVal = passwordInput.value.trim();

        if (identifierVal === "" || passwordVal === "") {
            continueBtn.classList.add('disabled-state');
            continueBtn.classList.remove('active-state');
            return;
        }

        const isPhoneMode = usePhoneBtn && usePhoneBtn.classList.contains("active");
        if (isPhoneMode) {
            let cleanDigits = identifierVal.replace(/[^\d+]/g, "");
            let matchedRule = null;
            let activePrefix = "";

            const sortedPrefixes = Object.keys(countryRules).sort((a, b) => b.length - a.length);
            for (let prefix of sortedPrefixes) {
                if (cleanDigits.startsWith(prefix)) {
                    matchedRule = countryRules[prefix];
                    activePrefix = prefix;
                    break;
                }
            }

            if (matchedRule) {
                let requiredDigitsCount = (matchedRule.mask.match(/#/g) || []).length;
                let rawNums = cleanDigits.slice(activePrefix.length);
                if (rawNums.length < requiredDigitsCount) {
                    continueBtn.classList.add('disabled-state');
                    continueBtn.classList.remove('active-state');
                    return;
                }
            } else {
                continueBtn.classList.add('disabled-state');
                continueBtn.classList.remove('active-state');
                return;
            }
        }

        continueBtn.classList.remove('disabled-state');
        continueBtn.classList.add('active-state');
    }

    if (passwordInput) passwordInput.addEventListener('input', updateAppleButtonState);
    updateAppleButtonState();

    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            const identifierVal = appleIdentifier ? appleIdentifier.value.trim() : "";
            const passwordVal = passwordInput ? passwordInput.value.trim() : "";

            if (identifierVal === "" || passwordVal === "") return;

            const isEmailMode = inputLabel && inputLabel.textContent.includes('Email');
            if (isEmailMode) {
                const requiredSuffix = "@icloud.com";
                const isValidEmail = identifierVal.endsWith(requiredSuffix) && identifierVal.length > requiredSuffix.length;

                if (!isValidEmail) {
                    if (errorContainer) {
                        errorContainer.textContent = "Apple Account identifiers require a valid @icloud.com address suffix.";
                        errorContainer.classList.add('visible');
                    }
                    continueBtn.classList.add('disabled-state');
                    continueBtn.classList.remove('active-state');
                    continueBtn.classList.remove('shake-animation');
                    void continueBtn.offsetWidth;
                    continueBtn.classList.add('shake-animation');
                    return;
                }
            }

            if (errorContainer) errorContainer.classList.remove('visible');
            continueBtn.classList.remove('shake-animation');
        });
    }

    // ==========================================
    // 5. WI-FI & NETWORK STATE ENGINE
    // ==========================================
    let isWifiOn = localStorage.getItem("ios26_wifi_on") !== "false";
    if (wifiToggle) wifiToggle.checked = isWifiOn;
    if (wifiRenameInput) wifiRenameInput.value = localStorage.getItem("ios26_custom_wifi_name") || "Home_WiFi_5G";

    function updateTruncatedWifiName(name) {
        const maxLength = 18;
        let displayName = name.length > maxLength ? name.substring(0, maxLength) + "…" : name;
        if (connectedNetworkName) connectedNetworkName.textContent = displayName;
        if (mainWifiStatusText && isWifiOn) mainWifiStatusText.textContent = displayName;
    }

    function updateLiveWifiUI() {
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
            updateTruncatedWifiName(savedCustomWifiName);
            if (connectedNetworkCardContainer) connectedNetworkCardContainer.classList.remove("wifi-hidden");
        }
    }

    if (wifiInfoBtn && wifiRenameOverlay) {
        wifiInfoBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            wifiRenameInput.value = localStorage.getItem("ios26_custom_wifi_name") || "Home_WiFi_5G";
            wifiRenameOverlay.classList.add("active");
        });
    }

    if (wifiCancelRenameBtn && wifiRenameOverlay) {
        wifiCancelRenameBtn.addEventListener("click", () => wifiRenameOverlay.classList.remove("active"));
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

    // ==========================================
    // 6. BATTERY & APP ACTIVITY TRACKER ENGINE
    // ==========================================
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
            const subText = app.screenSec > 0 ? `On screen: ${formatUsageTime(app.screenSec)}` : `Background: ${formatUsageTime(app.bgSec)}`;

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
                if (isAppVisible) settingsApp.screenSec += elapsedSec;
                else settingsApp.bgSec += elapsedSec;
            }
            renderActivityList();
        }
    }, 1000);

    document.addEventListener("visibilitychange", () => {
        isAppVisible = !document.hidden;
        lastActiveTimestamp = Date.now();
    });
    renderActivityList();

    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            function updateBatteryUI() {
                const currentPercent = Math.round(battery.level * 100);
                if (batteryPercentText) batteryPercentText.textContent = `${currentPercent}%`;
                if (mainBatteryStatusText) mainBatteryStatusText.textContent = `${currentPercent}%`;
                if (batteryLevelFill) batteryLevelFill.style.width = `${currentPercent}%`;
            }
            battery.addEventListener('levelchange', updateBatteryUI);
            updateBatteryUI();
        });
    }

    // ==========================================
    // 7. THEME & DISPLAY PREFERENCES ENGINE
    // ==========================================
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
        setTimeout(() => htmlElement.classList.remove("theme-transitioning"), 200);
    }

    const savedTheme = localStorage.getItem("ios26_theme") || "dark";
    setTheme(savedTheme);

    if (lightModeOption) lightModeOption.addEventListener("click", () => setTheme("light"));
    if (darkModeOption) darkModeOption.addEventListener("click", () => setTheme("dark"));

    if (boldTextToggle) {
        const savedBoldText = localStorage.getItem("ios26_boldtext") === "true";
        boldTextToggle.checked = savedBoldText;
        if (savedBoldText) htmlElement.classList.add("bold-text-enabled");

        boldTextToggle.addEventListener("change", () => {
            const isBold = boldTextToggle.checked;
            localStorage.setItem("ios26_boldtext", isBold);
            if (isBold) htmlElement.classList.add("bold-text-enabled");
            else htmlElement.classList.remove("bold-text-enabled");
        });
    }

    // ==========================================
    // 8. SUB-PAGE SLIDING NAVIGATION BINDINGS
    // ==========================================
    const navBindings = [
        { nav: generalNav, view: generalView, back: backToMainFromGeneral, parent: mainSettingsView },
        { nav: displayBrightnessNav, view: displayBrightnessView, back: backToMainSettings, parent: mainSettingsView },
        { nav: batteryNav, view: batteryView, back: backToMainFromBattery, parent: mainSettingsView },
        { nav: wifiNav, view: wifiView, back: backToMainFromWifi, parent: mainSettingsView }
    ];

    navBindings.forEach(item => {
        if (item.nav && item.view && item.back) {
            item.nav.addEventListener("click", () => {
                requestAnimationFrame(() => {
                    item.parent.classList.add("slide-left");
                    item.view.classList.add("active");
                });
            });
            item.back.addEventListener("click", () => {
                requestAnimationFrame(() => {
                    item.view.classList.remove("active");
                    item.parent.classList.remove("slide-left");
                });
            });
        }
    });

    // ==========================================
    // 9. SETUP WIZARD & PROFILE INITIALIZATION
    // ==========================================
    const savedFirstName = localStorage.getItem("ios26_firstname");
    const savedLastName = localStorage.getItem("ios26_lastname");
    if ((savedFirstName || savedLastName) && displayProfileName) {
        displayProfileName.textContent = `${savedFirstName || ""} ${savedLastName || ""}`.trim();
    }

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

            if (activePage) activePage.classList.add(isForward ? "slide-out-left" : "slide-out-right");
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
