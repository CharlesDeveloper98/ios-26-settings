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

    // Options Sub-Page View Elements
    const optionsNav = document.getElementById("optionsNav");
    const optionsView = document.getElementById("optionsView");
    const backToDisplayFromOptions = document.getElementById("backToDisplayFromOptions");
    const selectedOptionText = document.getElementById("selectedOptionText");
    const optionRows = document.querySelectorAll(".option-select-row");

    // Load saved option state
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

    // Slide Transition for Options Sub-page
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



        // --- iOS 26 Tappable Country Sheet Engine ---
    const tappableCountryContainer = document.getElementById("tappableCountryContainer");
    const countrySheetOverlay = document.getElementById("countrySheetOverlay");
    const closeCountrySheetBtn = document.getElementById("closeCountrySheetBtn");
    const countryListScrollView = document.getElementById("countryListScrollView");
    const countrySearchInput = document.getElementById("countrySearchInput");

    // Open Pop-up Sheet
    if (tappableCountryContainer && countrySheetOverlay) {
        tappableCountryContainer.addEventListener("click", () => {
            renderCountryPickerList("");
            countrySheetOverlay.classList.add("active");
        });
    }

    // Close Pop-up Sheet
    if (closeCountrySheetBtn && countrySheetOverlay) {
        closeCountrySheetBtn.addEventListener("click", () => {
            countrySheetOverlay.classList.remove("active");
        });
    }

    if (countrySheetOverlay) {
        countrySheetOverlay.addEventListener("click", (e) => {
            if (e.target === countrySheetOverlay) {
                countrySheetOverlay.classList.remove("active");
            }
        });
    }

      // Render Alphabetical List with iOS Keyboard Picker Styling inside Single Container rows
function renderCountryPickerList(filterText = "") {
    if (!countryListScrollView) return;

    let sortedEntries = Object.entries(countryRules).sort((a, b) => {
        return a[1].name.localeCompare(b[1].name);
    });

    if (filterText.trim() !== "") {
        const query = filterText.toLowerCase();
        sortedEntries = sortedEntries.filter(([code, data]) => 
            data.name.toLowerCase().includes(query) || code.includes(query)
        );
    }

    countryListScrollView.innerHTML = sortedEntries.map(([code, data]) => {
        return `
            <div class="country-picker-row settings-row clickable" data-code="${code}">
                <div class="row-left">
                    <span class="row-label-text">${data.name}</span>
                </div>
                <div class="row-right">
                    <span class="row-status-text">${code}</span>
                    <span class="country-row-check chevron-icon">✓</span>
                </div>
            </div>
        `;
    }).join('');

    // Attach click listeners to rows
    document.querySelectorAll(".country-picker-row").forEach(row => {
        row.addEventListener("click", () => {
            const selectedCode = row.getAttribute("data-code");
            const matchedRule = countryRules[selectedCode];

            if (appleIdentifier && matchedRule) {
                appleIdentifier.value = selectedCode + " ";
                if (countryDisplayTag) {
                    countryDisplayTag.textContent = matchedRule.name;
                }
                if (tappableCountryContainer) {
                    tappableCountryContainer.style.display = "flex";
                }
            }

            countrySheetOverlay.classList.remove("active");
            updateAppleButtonState();
        });
    });
}



    // Search Filtering Listener
    if (countrySearchInput) {
        countrySearchInput.addEventListener("input", (e) => {
            renderCountryPickerList(e.target.value);
        });
    }

    

    // --- iOS 26 Apple Account Signup Modal Engine ---
    const finishSetupNav = document.getElementById("finishSetupNav");
    const profileCardLink = document.querySelector(".profile-card-link");
    const appleSignupOverlay = document.getElementById("appleSignupOverlay");
    const closeAppleSignupBtn = document.getElementById("closeAppleSignupBtn");
    const appleSignInSubmitBtn = document.getElementById("appleSignInSubmitBtn");

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

    if (finishSetupNav) {
        finishSetupNav.addEventListener("click", (e) => {
            e.stopPropagation();
            openAppleSignupModal();
        });
    }

    if (profileCardLink) {
        profileCardLink.addEventListener("click", () => {
            openAppleSignupModal();
        });
    }

    if (closeAppleSignupBtn) {
        closeAppleSignupBtn.addEventListener("click", () => {
            closeAppleSignupModal();
        });
    }

    if (appleSignInSubmitBtn) {
        appleSignInSubmitBtn.textContent = "Continue";
    }
    
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
        if (connectedNetworkName) {
            connectedNetworkName.textContent = displayName;
        }
        if (mainWifiStatusText && isWifiOn) {
            mainWifiStatusText.textContent = displayName;
        }
    }

    function updateLiveWifiUI() {
        const state = getNativeAppNetworkState();
        const savedCustomWifiName = localStorage.getItem("ios26_custom_wifi_name") || "Home_WiFi_5G";
        const animatableElements = document.querySelectorAll(".wifi-animatable-section");
        const connectedNetworkCardContainer = document.getElementById("connectedNetworkCardContainer");

        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const effectiveType = connection ? connection.type : null;
        const networkTypeStr = (state.type || effectiveType || "").toLowerCase();

        const isCellular = effectiveType === 'cellular' || networkTypeStr.includes('cellular') || networkTypeStr.includes('data');
        const isWifiConnected = state.connected && !isCellular && (networkTypeStr.includes('wifi') || networkTypeStr.includes('wireless') || networkTypeStr === 'unknown');

        if (!isWifiOn) {
            if (mainWifiStatusText) mainWifiStatusText.textContent = "Off";
            animatableElements.forEach(el => el.classList.add("wifi-hidden"));
            if (connectedNetworkCardContainer) {
                connectedNetworkCardContainer.classList.add("wifi-hidden");
            }
            localStorage.setItem("ios26_wifi_on", "false");
        } else {
            animatableElements.forEach(el => el.classList.remove("wifi-hidden"));
            localStorage.setItem("ios26_wifi_on", "true");

            if (isWifiConnected) {
                updateTruncatedWifiName(savedCustomWifiName);
                if (connectedNetworkCardContainer) {
                    connectedNetworkCardContainer.classList.remove("wifi-hidden");
                }
            } else {
                if (mainWifiStatusText) mainWifiStatusText.textContent = "Not Connected";
                if (connectedNetworkCardContainer) {
                    connectedNetworkCardContainer.classList.add("wifi-hidden");
                }
            }
        }
    }

        



        // --- iOS 26 Apple Account Signup Advanced Interactivity & Container State Engine ---
    const useEmailBtn = document.getElementById("useEmailBtn");
    const usePhoneBtn = document.getElementById("usePhoneBtn");
    const appleIdentifier = document.getElementById("appleIdentifier");
    const inputLabel = document.getElementById("inputLabel");
    const countryDisplayTag = document.getElementById("countryDisplayTag");
    const ios26AlertBox = document.getElementById("ios26AlertBox");

    let alertFadeTimer = null;

    function showIOS26Alert(message) {
        if (!ios26AlertBox) return;
        
        if (alertFadeTimer) {
            clearTimeout(alertFadeTimer);
        }

        ios26AlertBox.textContent = message;
        ios26AlertBox.classList.add("show");

        // 5-second automatic fade-out mechanism
        alertFadeTimer = setTimeout(() => {
            ios26AlertBox.classList.remove("show");
        }, 5000);
    }

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

    if (useEmailBtn && usePhoneBtn && appleIdentifier) {
        useEmailBtn.addEventListener("click", (e) => {
            // Strictly intercept and block execution if dimmed, while displaying the alert
            if (useEmailBtn.classList.contains("dimmed")) {
                e.stopImmediatePropagation();
                e.preventDefault();
                showIOS26Alert("You have to use only one method for sign up.");
                return;
            }
            
            useEmailBtn.classList.add("active");
            usePhoneBtn.classList.remove("active");
            if (inputLabel) inputLabel.textContent = "Email";
            appleIdentifier.type = "email";
            appleIdentifier.placeholder = "example@icloud.com";
            appleIdentifier.value = "";
            if (countryDisplayTag) countryDisplayTag.textContent = "";
            updateSwitchContainerStates();
            updateAppleButtonState();
        });

        usePhoneBtn.addEventListener("click", (e) => {
            // Strictly intercept and block execution if dimmed, while displaying the alert
            if (usePhoneBtn.classList.contains("dimmed")) {
                e.stopImmediatePropagation();
                e.preventDefault();
                showIOS26Alert("You have to use only one method for sign up.");
                return;
            }

            usePhoneBtn.classList.add("active");
            useEmailBtn.classList.remove("active");
            if (inputLabel) inputLabel.textContent = "Phone";
            appleIdentifier.type = "tel";
            appleIdentifier.placeholder = "+*** *** ***";
            appleIdentifier.value = "+";
            if (countryDisplayTag) countryDisplayTag.textContent = "";
            updateSwitchContainerStates();
            updateAppleButtonState();
        });

        appleIdentifier.addEventListener("input", (e) => {
            updateSwitchContainerStates();
            
            if (usePhoneBtn.classList.contains("active")) {
                let val = e.target.value;
                if (!val.startsWith("+")) {
                    val = "+" + val.replace(/\+/g, "");
                }
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



                    // Inside your input event listener where country is detected:
    if (detectedCountry) {
        if (countryDisplayTag) countryDisplayTag.textContent = detectedCountry;
        if (tappableCountryContainer) tappableCountryContainer.style.display = "flex";
    } else {
        if (countryDisplayTag) countryDisplayTag.textContent = "";
        if (tappableCountryContainer) tappableCountryContainer.style.display = "none";
    }

                

                if (matchedRule) {
                    let activePrefix = Object.keys(countryRules).find(p => cleanDigits.startsWith(p));
                    let rawNums = cleanDigits.slice(activePrefix.length);
                    let maxAllowedDigits = (matchedRule.mask.match(/#/g) || []).length;
                    if (rawNums.length > maxAllowedDigits) {
                        rawNums = rawNums.slice(0, maxAllowedDigits);
                    }

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
                    if (digitIdx < rawNums.length) {
                        formatted += rawNums.slice(digitIdx);
                    }
                    appleIdentifier.value = formatted;
                } else {
                    appleIdentifier.value = cleanDigits;
                }
            }
        });
    }


            


    // Country code prefix mapping dictionary & formatting definitions
    const countryRules = {
    // North America & Caribbean (Zone 1)
    "+1": { name: "USA / Canada", mask: "+1 (###) ###-####", flag: "🇺🇸🇨🇦" },
    "+1242": { name: "Bahamas", mask: "+1 (242) ###-####", flag: "🇧🇸" },
    "+1246": { name: "Barbados", mask: "+1 (246) ###-####", flag: "🇧🇧" },
    "+1264": { name: "Anguilla", mask: "+1 (264) ###-####", flag: "🇦🇮" },
    "+1268": { name: "Antigua and Barbuda", mask: "+1 (268) ###-####", flag: "🇦🇬" },
    "+1284": { name: "British Virgin Islands", mask: "+1 (284) ###-####", flag: "🇻🇬" },
    "+1345": { name: "Cayman Islands", mask: "+1 (345) ###-####", flag: "🇰🇾" },
    "+1441": { name: "Bermuda", mask: "+1 (441) ###-####", flag: "🇧🇲" },
    "+1473": { name: "Grenada", mask: "+1 (473) ###-####", flag: "🇬🇩" },
    "+1649": { name: "Turks and Caicos Islands", mask: "+1 (649) ###-####", flag: "🇹🇨" },
    "+1664": { name: "Montserrat", mask: "+1 (664) ###-####", flag: "🇲🇸" },
    "+1671": { name: "Guam", mask: "+1 (671) ###-####", flag: "🇬🇺" },
    "+1684": { name: "American Samoa", mask: "+1 (684) ###-####", flag: "🇦🇸" },
    "+1758": { name: "Saint Lucia", mask: "+1 (758) ###-####", flag: "🇱🇨" },
    "+1767": { name: "Dominica", mask: "+1 (767) ###-####", flag: "🇩🇲" },
    "+1784": { name: "Saint Vincent and the Grenadines", mask: "+1 (784) ###-####", flag: "🇻🇨" },
    "+1809": { name: "Dominican Republic", mask: "+1 (809) ###-####", flag: "🇩🇴" },
    "+1829": { name: "Dominican Republic", mask: "+1 (829) ###-####", flag: "🇩🇴" },
    "+1849": { name: "Dominican Republic", mask: "+1 (849) ###-####", flag: "🇩🇴" },
    "+1868": { name: "Trinidad and Tobago", mask: "+1 (868) ###-####", flag: "🇹🇹" },
    "+1876": { name: "Jamaica", mask: "+1 (876) ###-####", flag: "🇯🇲" },

    // Africa (Zone 2)
    "+20": { name: "Egypt", mask: "+20 ### ### ####", flag: "🇪🇬" },
    "+212": { name: "Morocco", mask: "+212 ## ####-###", flag: "🇲🇦" },
    "+213": { name: "Algeria", mask: "+213 ## ### ####", flag: "🇩🇿" },
    "+216": { name: "Tunisia", mask: "+216 ## ### ###", flag: "🇹🇳" },
    "+218": { name: "Libya", mask: "+218 ## ### ####", flag: "🇱🇾" },
    "+220": { name: "Gambia", mask: "+220 ### ####", flag: "🇬🇲" },
    "+221": { name: "Senegal", mask: "+221 ## ### ####", flag: "🇸🇳" },
    "+222": { name: "Mauritania", mask: "+222 ## ## ####", flag: "🇲🇷" },
    "+223": { name: "Mali", mask: "+223 ## ## ####", flag: "🇲🇱" },
    "+224": { name: "Guinea", mask: "+224 ### ## ## ##", flag: "🇬🇳" },
    "+225": { name: "Ivory Coast", mask: "+225 ## ## ## ##", flag: "🇨🇮" },
    "+226": { name: "Burkina Faso", mask: "+226 ## ## ####", flag: "🇧🇫" },
    "+227": { name: "Niger", mask: "+227 ## ## ####", flag: "🇳🇪" },
    "+228": { name: "Togo", mask: "+228 ## ## ####", flag: "🇹🇬" },
    "+229": { name: "Benin", mask: "+229 ## ## ####", flag: "🇧🇯" },
    "+230": { name: "Mauritius", mask: "+230 ### ####", flag: "🇲🇺" },
    "+231": { name: "Liberia", mask: "+231 ### ### ###", flag: "🇱🇷" },
    "+232": { name: "Sierra Leone", mask: "+232 ## ######", flag: "🇸🇱" },
    "+233": { name: "Ghana", mask: "+233 ## ### ####", flag: "🇬🇭" },
    "+234": { name: "Nigeria", mask: "+234 ### ### ####", flag: "🇳🇬" },
    "+235": { name: "Chad", mask: "+235 ## ## ## ##", flag: "🇹🇩" },
    "+236": { name: "Central African Republic", mask: "+236 ## ## ####", flag: "🇨🇫" },
    "+237": { name: "Cameroon", mask: "+237 #### ####", flag: "🇨🇲" },
    "+238": { name: "Cape Verde", mask: "+238 ### ## ##", flag: "🇨🇻" },
    "+239": { name: "Sao Tome and Principe", mask: "+239 ## #####", flag: "🇸🇹" },
    "+240": { name: "Equatorial Guinea", mask: "+240 ### ### ###", flag: "🇬🇶" },
    "+241": { name: "Gabon", mask: "+241 # ## ## ##", flag: "🇬🇦" },
    "+242": { name: "Republic of the Congo", mask: "+242 ## ### ####", flag: "🇨🇬" },
    "+243": { name: "Democratic Republic of the Congo", mask: "+243 ### ### ###", flag: "🇨🇩" },
    "+244": { name: "Angola", mask: "+244 ### ### ###", flag: "🇦🇴" },
    "+245": { name: "Guinea-Bissau", mask: "+245 # ######", flag: "🇬🇼" },
    "+248": { name: "Seychelles", mask: "+248 # ### ###", flag: "🇸🇨" },
    "+249": { name: "Sudan", mask: "+249 ## ### ####", flag: "🇸🇩" },
    "+250": { name: "Rwanda", mask: "+250 ### ### ###", flag: "🇷🇼" },
    "+251": { name: "Ethiopia", mask: "+251 ## ### ####", flag: "🇪🇹" },
    "+252": { name: "Somalia", mask: "+252 # ### ###", flag: "🇸🇴" },
    "+253": { name: "Djibouti", mask: "+253 ## ## ## ##", flag: "🇩🇯" },
    "+254": { name: "Kenya", mask: "+254 ### ######", flag: "🇰🇪" },
    "+255": { name: "Tanzania", mask: "+255 ## ### ####", flag: "🇹🇿" },
    "+256": { name: "Uganda", mask: "+256 ### ######", flag: "🇺🇬" },
    "+257": { name: "Burundi", mask: "+257 ## ## ####", flag: "🇧🇮" },
    "+258": { name: "Mozambique", mask: "+258 ## ### ###", flag: "🇲🇿" },
    "+260": { name: "Zambia", mask: "+260 ## #######", flag: "🇿🇲" },
    "+261": { name: "Madagascar", mask: "+261 ## ## #####", flag: "🇲🇬" },
    "+263": { name: "Zimbabwe", mask: "+263 # ######", flag: "🇿🇼" },
    "+264": { name: "Namibia", mask: "+264 ## ### ####", flag: "🇳🇦" },
    "+265": { name: "Malawi", mask: "+265 # ### ####", flag: "🇲🇼" },
    "+266": { name: "Lesotho", mask: "+266 # ### ####", flag: "🇱🇸" },
    "+267": { name: "Botswana", mask: "+267 ## ### ###", flag: "🇧🇼" },
    "+268": { name: "Eswatini", mask: "+268 ## ## ####", flag: "🇸🇿" },
    "+269": { name: "Comoros", mask: "+269 ## ## ####", flag: "🇰🇲" },
    "+27": { name: "South Africa", mask: "+27 ## ### ####", flag: "🇿🇦" },

    // Europe (Zones 3 & 4)
    "+30": { name: "Greece", mask: "+30 ### ### ####", flag: "🇬🇷" },
    "+31": { name: "Netherlands", mask: "+31 # ########", flag: "🇳🇱" },
    "+32": { name: "Belgium", mask: "+32 ### ## ## ##", flag: "🇧🇪" },
    "+33": { name: "France", mask: "+33 # ## ## ## ##", flag: "🇫🇷" },
    "+34": { name: "Spain", mask: "+34 ### ### ###", flag: "🇪🇸" },
    "+350": { name: "Gibraltar", mask: "+350 ########", flag: "🇬🇮" },
    "+351": { name: "Portugal", mask: "+351 ### ### ###", flag: "🇵🇹" },
    "+352": { name: "Luxembourg", mask: "+352 ### ###", flag: "🇱🇺" },
    "+353": { name: "Ireland", mask: "+353 ## ### ####", flag: "🇮🇪" },
    "+354": { name: "Iceland", mask: "+354 ### ####", flag: "🇮🇸" },
    "+355": { name: "Albania", mask: "+355 ## ### ###", flag: "🇦🇱" },
    "+356": { name: "Malta", mask: "+356 #### ####", flag: "🇲🇹" },
    "+357": { name: "Cyprus", mask: "+357 ## ######", flag: "🇨🇾" },
    "+358": { name: "Finland", mask: "+358 ## ### ## ##", flag: "🇫🇮" },
    "+359": { name: "Bulgaria", mask: "+359 ### ### ###", flag: "🇧🇬" },
    "+36": { name: "Hungary", mask: "+36 ## ### ####", flag: "🇭🇺" },
    "+370": { name: "Lithuania", mask: "+370 ### #####", flag: "🇱🇹" },
    "+371": { name: "Latvia", mask: "+371 ## ### ###", flag: "🇱🇻" },
    "+372": { name: "Estonia", mask: "+372 #### ####", flag: "🇪🇪" },
    "+373": { name: "Moldova", mask: "+373 #### ####", flag: "🇲🇩" },
    "+374": { name: "Armenia", mask: "+374 ## ######", flag: "🇦🇲" },
    "+375": { name: "Belarus", mask: "+375 ## ### ## ##", flag: "🇧🇾" },
    "+376": { name: "Andorra", mask: "+376 ### ###", flag: "🇦🇩" },
    "+377": { name: "Monaco", mask: "+377 # ## ## ## ##", flag: "🇲🇨" },
    "+378": { name: "San Marino", mask: "+378 #### ######", flag: "🇸🇲" },
    "+380": { name: "Ukraine", mask: "+380 ## ### ## ##", flag: "🇺🇦" },
    "+381": { name: "Serbia", mask: "+381 ## ### ####", flag: "🇷🇸" },
    "+382": { name: "Montenegro", mask: "+382 ## ### ###", flag: "🇲🇪" },
    "+383": { name: "Kosovo", mask: "+383 ## ### ###", flag: "🇽🇰" },
    "+385": { name: "Croatia", mask: "+385 ## ### ####", flag: "🇭🇷" },
    "+386": { name: "Slovenia", mask: "+386 ## ### ###", flag: "🇸🇮" },
    "+387": { name: "Bosnia and Herzegovina", mask: "+387 ## ######", flag: "🇧🇦" },
    "+389": { name: "North Macedonia", mask: "+389 ## ### ###", flag: "🇲🇰" },
    "+39": { name: "Italy", mask: "+39 ### ### ####", flag: "🇮🇹" },
    "+40": { name: "Romania", mask: "+40 ### ### ###", flag: "🇷🇴" },
    "+41": { name: "Switzerland", mask: "+41 ## ### ####", flag: "🇨🇭" },
    "+420": { name: "Czech Republic", mask: "+420 ### ### ###", flag: "🇨🇿" },
    "+421": { name: "Slovakia", mask: "+421 ### ### ###", flag: "🇸🇰" },
    "+423": { name: "Liechtenstein", mask: "+423 ### ####", flag: "🇱🇮" },
    "+43": { name: "Austria", mask: "+43 ### ########", flag: "🇦🇹" },
    "+44": { name: "UK", mask: "+44 #### ######", flag: "🇬🇧" },
    "+45": { name: "Denmark", mask: "+45 ## ## ## ##", flag: "🇩🇰" },
    "+46": { name: "Sweden", mask: "+46 ## ### ## ##", flag: "🇸🇪" },
    "+47": { name: "Norway", mask: "+47 ### ## ###", flag: "🇳🇴" },
    "+48": { name: "Poland", mask: "+48 ### ### ###", flag: "🇵🇱" },
    "+49": { name: "Germany", mask: "+49 ### #######", flag: "🇩🇪" },

    // South & Central America (Zone 5)
    "+500": { name: "Falkland Islands", mask: "+500 #####", flag: "🇫🇰" },
    "+501": { name: "Belize", mask: "+501 ### ####", flag: "🇧🇿" },
    "+502": { name: "Guatemala", mask: "+502 #### ####", flag: "🇬🇹" },
    "+503": { name: "El Salvador", mask: "+503 #### ####", flag: "🇸🇻" },
    "+504": { name: "Honduras", mask: "+504 #### ####", flag: "🇭🇳" },
    "+505": { name: "Nicaragua", mask: "+505 #### ####", flag: "🇳🇮" },
    "+506": { name: "Costa Rica", mask: "+506 #### ####", flag: "🇨🇷" },
    "+507": { name: "Panama", mask: "+507 #### ####", flag: "🇵🇦" },
    "+508": { name: "Saint Pierre and Miquelon", mask: "+508 ## ## ##", flag: "🇵🇲" },
    "+509": { name: "Haiti", mask: "+509 #### ####", flag: "🇭🇹" },
    "+51": { name: "Peru", mask: "+51 ### ### ###", flag: "🇵🇪" },
    "+52": { name: "Mexico", mask: "+52 ## #### ####", flag: "🇲🇽" },
    "+53": { name: "Cuba", mask: "+53 # #######", flag: "🇨🇺" },
    "+54": { name: "Argentina", mask: "+54 # ########", flag: "🇦🇷" },
    "+55": { name: "Brazil", mask: "+55 ## ##### ####", flag: "🇧🇷" },
    "+56": { name: "Chile", mask: "+56 # #### ####", flag: "🇨🇱" },
    "+57": { name: "Colombia", mask: "+57 ### ### ####", flag: "🇨🇴" },
    "+58": { name: "Venezuela", mask: "+58 ### ### ####", flag: "🇻🇪" },
    "+591": { name: "Bolivia", mask: "+591 # ### ####", flag: "🇧🇴" },
    "+592": { name: "Guyana", mask: "+592 ### ####", flag: "🇬🇾" },
    "+593": { name: "Ecuador", mask: "+593 # ### ####", flag: "🇪🇨" },
    "+595": { name: "Paraguay", mask: "+595 ### ### ###", flag: "🇵🇾" },
    "+597": { name: "Suriname", mask: "+597 ### ###", flag: "🇸🇷" },
    "+598": { name: "Uruguay", mask: "+598 # ### ####", flag: "🇺🇾" },

    // Oceania & Southeast Asia (Zone 6)
    "+60": { name: "Malaysia", mask: "+60 ## #### ####", flag: "🇲🇾" },
    "+61": { name: "Australia", mask: "+61 ### ### ###", flag: "🇦🇺" },
    "+62": { name: "Indonesia", mask: "+62 ### ### ####", flag: "🇮🇩" },
    "+63": { name: "Philippines", mask: "+63 ### ### ####", flag: "🇵🇭" },
    "+64": { name: "New Zealand", mask: "+64 ## ### ####", flag: "🇳🇿" },
    "+65": { name: "Singapore", mask: "+65 #### ####", flag: "🇸🇬" },
    "+66": { name: "Thailand", mask: "+66 ## ### ####", flag: "🇹🇭" },
    "+670": { name: "East Timor", mask: "+670 #### ####", flag: "🇹🇱" },
    "+673": { name: "Brunei", mask: "+673 ### ####", flag: "🇧🇳" },
    "+674": { name: "Nauru", mask: "+674 ### ####", flag: "🇳🇷" },
    "+675": { name: "Papua New Guinea", mask: "+675 ### ####", flag: "🇵🇬" },
    "+676": { name: "Tonga", mask: "+676 #####", flag: "🇹🇴" },
    "+677": { name: "Solomon Islands", mask: "+677 #####", flag: "🇸🇧" },
    "+678": { name: "Vanuatu", mask: "+678 #####", flag: "🇻🇺" },
    "+679": { name: "Fiji", mask: "+679 ## #####", flag: "🇫🇯" },
    "+680": { name: "Palau", mask: "+680 ### ####", flag: "🇵🇼" },
    "+685": { name: "Samoa", mask: "+685 #####", flag: "🇼🇸" },
    "+686": { name: "Kiribati", mask: "+686 #####", flag: "🇰🇮" },
    "+688": { name: "Tuvalu", mask: "+688 #####", flag: "🇹🇻" },
    "+689": { name: "French Polynesia", mask: "+689 ## ## ##", flag: "🇵🇫" },
    "+690": { name: "Tokelau", mask: "+690 ####", flag: "🇹🇰" },
    "+691": { name: "Micronesia", mask: "+691 ### ####", flag: "🇫🇲" },
    "+692": { name: "Marshall Islands", mask: "+692 ### ####", flag: "🇲🇭" },

    // Russia & Central Asia (Zone 7)
    "+7": { name: "Russia / Kazakhstan", mask: "+7 (###) ###-##-##", flag: "🇷🇺🇰🇿" },

    // East Asia & Special Services (Zone 8)
    "+81": { name: "Japan", mask: "+81 ## #### ####", flag: "🇯🇵" },
    "+82": { name: "South Korea", mask: "+82 ## #### ####", flag: "🇰🇷" },
    "+84": { name: "Vietnam", mask: "+84 ## #### ####", flag: "🇻🇳" },
    "+852": { name: "Hong Kong", mask: "+852 #### ####", flag: "🇭🇰" },
    "+853": { name: "Macau", mask: "+853 #### ####", flag: "🇲🇴" },
    "+855": { name: "Cambodia", mask: "+855 ## ### ###", flag: "🇰🇭" },
    "+856": { name: "Laos", mask: "+856 ## ## ### ###", flag: "🇱🇦" },
    "+86": { name: "China", mask: "+86 ### #### ####", flag: "🇨🇳" },
    "+880": { name: "Bangladesh", mask: "+880 ### ########", flag: "🇧🇩" },
    "+886": { name: "Taiwan", mask: "+886 # #### ####", flag: "🇹🇼" },

    // West, Central & South Asia (Zone 9)
    "+90": { name: "Turkey", mask: "+90 ### ### ####", flag: "🇹🇷" },
    "+91": { name: "India", mask: "+91 ##### #####", flag: "🇮🇳" },
    "+92": { name: "Pakistan", mask: "+92 ### #######", flag: "🇵🇰" },
    "+93": { name: "Afghanistan", mask: "+93 ## ### ####", flag: "🇦🇫" },
    "+94": { name: "Sri Lanka", mask: "+94 ## ### ####", flag: "🇱🇰" },
    "+95": { name: "Myanmar", mask: "+95 # ### ####", flag: "🇲🇲" },
    "+960": { name: "Maldives", mask: "+960 ### ####", flag: "🇲🇻" },
    "+961": { name: "Lebanon", mask: "+961 ## ### ###", flag: "🇱🇧" },
    "+962": { name: "Jordan", mask: "+962 # #### ####", flag: "🇯🇴" },
    "+963": { name: "Syria", mask: "+963 ## ########", flag: "🇸🇾" },
    "+964": { name: "Iraq", mask: "+964 ### ### ####", flag: "🇮🇶" },
    "+965": { name: "Kuwait", mask: "+965 ########", flag: "🇰🇼" },
    "+966": { name: "Saudi Arabia", mask: "+966 ## ### ####", flag: "🇸🇦" },
    "+967": { name: "Yemen", mask: "+967 ### ### ###", flag: "🇾🇪" },
    "+968": { name: "Oman", mask: "+968 ########", flag: "🇴🇲" },
    "+970": { name: "Palestine", mask: "+970 ## ### ####", flag: "🇵🇸" },
    "+971": { name: "United Arab Emirates", mask: "+971 ## ### ####", flag: "🇦🇪" },
    "+972": { name: "Israel", mask: "+972 ## ### ####", flag: "🇮🇱" },
    "+973": { name: "Bahrain", mask: "+973 ########", flag: "🇧🇭" },
    "+974": { name: "Qatar", mask: "+974 ########", flag: "🇶🇦" },
    "+975": { name: "Bhutan", mask: "+975 # ### ###", flag: "🇧🇹" },
    "+976": { name: "Mongolia", mask: "+976 ## ## ####", flag: "🇲🇳" },
    "+977": { name: "Nepal", mask: "+977 ## ### ###", flag: "🇳🇵" },
    "+98": { name: "Iran", mask: "+98 ### ### ####", flag: "🇮🇷" },
    "+992": { name: "Tajikistan", mask: "+992 ## ### ####", flag: "🇹🇯" },
    "+993": { name: "Turkmenistan", mask: "+993 # ######", flag: "🇹🇲" },
    "+994": { name: "Azerbaijan", mask: "+994 ## ### ## ##", flag: "🇦🇿" },
    "+995": { name: "Georgia", mask: "+995 ### ######", flag: "🇬🇪" },
    "+996": { name: "Kyrgyzstan", mask: "+996 ### ######", flag: "🇰🇬" },
    "+998": { name: "Uzbekistan", mask: "+998 ## ### ####", flag: "🇺🇿" }
};
    
    

    
                
    if (useEmailBtn && usePhoneBtn && appleIdentifier) {
        useEmailBtn.addEventListener("click", () => {
            useEmailBtn.classList.add("active");
            usePhoneBtn.classList.remove("active");
            if (inputLabel) inputLabel.textContent = "Email";
            appleIdentifier.type = "email";
            appleIdentifier.placeholder = "example@icloud.com";
            appleIdentifier.value = "";
            if (countryDisplayTag) countryDisplayTag.textContent = "";
            updateAppleButtonState();
        });

        usePhoneBtn.addEventListener("click", () => {
            usePhoneBtn.classList.add("active");
            useEmailBtn.classList.remove("active");
            if (inputLabel) inputLabel.textContent = "Phone";
            appleIdentifier.type = "tel";
            appleIdentifier.placeholder = "+*** *** ***";
            appleIdentifier.value = "+";
            if (countryDisplayTag) countryDisplayTag.textContent = "";
            updateAppleButtonState();
        });

        appleIdentifier.addEventListener("input", (e) => {
            if (usePhoneBtn.classList.contains("active")) {
                let val = e.target.value;
                
                // Ensure it always starts with '+'
                if (!val.startsWith("+")) {
                    val = "+" + val.replace(/\+/g, "");
                }

                let cleanDigits = val.replace(/[^\d+]/g, "");
                let detectedCountry = "";
                let matchedRule = null;

                // Sort prefixes by length descending to match longer codes first (e.g., +234 before +2)
                const sortedPrefixes = Object.keys(countryRules).sort((a, b) => b.length - a.length);
                for (let prefix of sortedPrefixes) {
                    if (cleanDigits.startsWith(prefix)) {
                        detectedCountry = countryRules[prefix].name;
                        matchedRule = countryRules[prefix];
                        break;
                    }
                }

                if (countryDisplayTag) {
                    countryDisplayTag.textContent = detectedCountry;
                }

                if (matchedRule) {
                    let activePrefix = Object.keys(countryRules).find(p => cleanDigits.startsWith(p));
                    let rawNums = cleanDigits.slice(activePrefix.length);
                    
                    // Count how many placeholders ('#') exist in the mask to enforce maximum limit
                    let maxAllowedDigits = (matchedRule.mask.match(/#/g) || []).length;
                    if (rawNums.length > maxAllowedDigits) {
                        rawNums = rawNums.slice(0, maxAllowedDigits); // Truncate excess digits
                    }

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
                    
                    if (digitIdx < rawNums.length) {
                        formatted += rawNums.slice(digitIdx);
                    }
                    
                    appleIdentifier.value = formatted;
                } else {
                    appleIdentifier.value = cleanDigits;
                }
            }
        });
    }

    const passwordInput = document.getElementById("applePassword");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const eyeIcon = document.getElementById("eyeIcon");
    const continueBtn = document.getElementById('continueButton');
    const errorContainer = document.getElementById('errorAlertMessage');

    if (togglePasswordBtn && passwordInput) {
        togglePasswordBtn.addEventListener("click", () => {
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";

            if (isPassword) {
                eyeIcon.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                `;
                togglePasswordBtn.setAttribute("aria-label", "Hide password");
            } else {
                eyeIcon.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                `;
                togglePasswordBtn.setAttribute("aria-label", "Show password");
            }
        });
    }

    // Dynamic Button State Controller Function with full phone mask completion checks
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

                // Check if user has completely filled out all required digits for the country format mask
                if (rawNums.length < requiredDigitsCount) {
                    continueBtn.classList.add('disabled-state');
                    continueBtn.classList.remove('active-state');
                    return;
                }
            } else {
                // If prefix or mask isn't completely matched yet, keep it disabled
                continueBtn.classList.add('disabled-state');
                continueBtn.classList.remove('active-state');
                return;
            }
        }

        // Once requirements are met, turn blue
        continueBtn.classList.remove('disabled-state');
        continueBtn.classList.add('active-state');
    }

    // Listen to inputs for real-time button coloring and error clearance
    if (appleIdentifier) {
        appleIdentifier.addEventListener('input', () => {
            if (errorContainer) {
                errorContainer.classList.remove('visible');
                errorContainer.textContent = "";
            }
            updateAppleButtonState();
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('input', () => {
            updateAppleButtonState();
        });
    }

    // Initialize state on load
    updateAppleButtonState();

    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            const identifierVal = appleIdentifier ? appleIdentifier.value.trim() : "";
            const passwordVal = passwordInput ? passwordInput.value.trim() : "";

            if (identifierVal === "" || passwordVal === "") {
                return;
            }

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

            if (errorContainer) {
                errorContainer.classList.remove('visible');
                errorContainer.textContent = "";
            }
            continueBtn.classList.remove('shake-animation');
            console.log("Validation passed successfully!");
        });
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
