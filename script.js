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

    // --- Country code prefix mapping dictionary & formatting definitions ---
 const countryRules = {
    // North America & Caribbean (Zone 1)
    "+1": { name: "USA / Canada", flag: "🇺🇸", mask: "+1 (###) ###-####" },
    "+1242": { name: "Bahamas", flag: "🇧🇸", mask: "+1 (242) ###-####" },
    "+1246": { name: "Barbados", flag: "🇧🇧", mask: "+1 (246) ###-####" },
    "+1264": { name: "Anguilla", flag: "🇦🇮", mask: "+1 (264) ###-####" },
    "+1268": { name: "Antigua and Barbuda", flag: "🇦🇬", mask: "+1 (268) ###-####" },
    "+1284": { name: "British Virgin Islands", flag: "🇻🇬", mask: "+1 (284) ###-####" },
    "+1345": { name: "Cayman Islands", flag: "🇰🇾", mask: "+1 (345) ###-####" },
    "+1441": { name: "Bermuda", flag: "🇧🇲", mask: "+1 (441) ###-####" },
    "+1473": { name: "Grenada", flag: "🇬🇩", mask: "+1 (473) ###-####" },
    "+1649": { name: "Turks and Caicos Islands", flag: "🇹🇨", mask: "+1 (649) ###-####" },
    "+1664": { name: "Montserrat", flag: "🇲🇸", mask: "+1 (664) ###-####" },
    "+1671": { name: "Guam", flag: "🇬🇺", mask: "+1 (671) ###-####" },
    "+1684": { name: "American Samoa", flag: "🇦🇸", mask: "+1 (684) ###-####" },
    "+1758": { name: "Saint Lucia", flag: "🇱🇨", mask: "+1 (758) ###-####" },
    "+1767": { name: "Dominica", flag: "🇩🇲", mask: "+1 (767) ###-####" },
    "+1784": { name: "Saint Vincent and the Grenadines", flag: "🇻🇨", mask: "+1 (784) ###-####" },
    "+1809": { name: "Dominican Republic", flag: "🇩🇴", mask: "+1 (809) ###-####" },
    "+1829": { name: "Dominican Republic", flag: "🇩🇴", mask: "+1 (829) ###-####" },
    "+1849": { name: "Dominican Republic", flag: "🇩🇴", mask: "+1 (849) ###-####" },
    "+1868": { name: "Trinidad and Tobago", flag: "🇹🇹", mask: "+1 (868) ###-####" },
    "+1876": { name: "Jamaica", flag: "🇯🇲", mask: "+1 (876) ###-####" },

    // Africa (Zone 2)
    "+20": { name: "Egypt", flag: "🇪🇬", mask: "+20 ### ### ####" },
    "+212": { name: "Morocco", flag: "🇲🇦", mask: "+212 ## ####-###" },
    "+213": { name: "Algeria", flag: "🇩🇿", mask: "+213 ## ### ####" },
    "+216": { name: "Tunisia", flag: "🇹🇳", mask: "+216 ## ### ###" },
    "+218": { name: "Libya", flag: "🇱🇾", mask: "+218 ## ### ####" },
    "+220": { name: "Gambia", flag: "🇬🇲", mask: "+220 ### ####" },
    "+221": { name: "Senegal", flag: "🇸🇳", mask: "+221 ## ### ####" },
    "+222": { name: "Mauritania", flag: "🇲🇷", mask: "+222 ## ## ####" },
    "+223": { name: "Mali", flag: "🇲🇱", mask: "+223 ## ## ####" },
    "+224": { name: "Guinea", flag: "🇬🇳", mask: "+224 ### ## ## ##" },
    "+225": { name: "Ivory Coast", flag: "🇨🇮", mask: "+225 ## ## ## ##" },
    "+226": { name: "Burkina Faso", flag: "🇧🇫", mask: "+226 ## ## ####" },
    "+227": { name: "Niger", flag: "🇳🇪", mask: "+227 ## ## ####" },
    "+228": { name: "Togo", flag: "🇹🇬", mask: "+228 ## ## ####" },
    "+229": { name: "Benin", flag: "🇧🇯", mask: "+229 ## ## ####" },
    "+230": { name: "Mauritius", flag: "🇲🇺", mask: "+230 ### ####" },
    "+231": { name: "Liberia", flag: "🇱🇷", mask: "+231 ### ### ###" },
    "+232": { name: "Sierra Leone", flag: "🇸🇱", mask: "+232 ## ######" },
    "+233": { name: "Ghana", flag: "🇬🇭", mask: "+233 ## ### ####" },
    "+234": { name: "Nigeria", flag: "🇳🇬", mask: "+234 ### ### ####" },
    "+235": { name: "Chad", flag: "🇹🇩", mask: "+235 ## ## ## ##" },
    "+236": { name: "Central African Republic", flag: "🇨🇫", mask: "+236 ## ## ####" },
    "+237": { name: "Cameroon", flag: "🇨🇲", mask: "+237 #### ####" },
    "+238": { name: "Cape Verde", flag: "🇨🇻", mask: "+238 ### ## ##" },
    "+239": { name: "Sao Tome and Principe", flag: "🇸🇹", mask: "+239 ## #####" },
    "+240": { name: "Equatorial Guinea", flag: "🇬🇶", mask: "+240 ### ### ###" },
    "+241": { name: "Gabon", flag: "🇬🇦", mask: "+241 # ## ## ##" },
    "+242": { name: "Republic of the Congo", flag: "🇨🇬", mask: "+242 ## ### ####" },
    "+243": { name: "Democratic Republic of the Congo", flag: "🇨🇩", mask: "+243 ### ### ###" },
    "+244": { name: "Angola", flag: "🇦🇴", mask: "+244 ### ### ###" },
    "+245": { name: "Guinea-Bissau", flag: "🇬🇼", mask: "+245 # ######" },
    "+248": { name: "Seychelles", flag: "🇸🇨", mask: "+248 # ### ###" },
    "+249": { name: "Sudan", flag: "🇸🇩", mask: "+249 ## ### ####" },
    "+250": { name: "Rwanda", flag: "🇷🇼", mask: "+250 ### ### ###" },
    "+251": { name: "Ethiopia", flag: "🇪🇹", mask: "+251 ## ### ####" },
    "+252": { name: "Somalia", flag: "🇸🇴", mask: "+252 # ### ###" },
    "+253": { name: "Djibouti", flag: "🇩🇯", mask: "+253 ## ## ## ##" },
    "+254": { name: "Kenya", flag: "🇰🇪", mask: "+254 ### ######" },
    "+255": { name: "Tanzania", flag: "🇹🇿", mask: "+255 ## ### ####" },
    "+256": { name: "Uganda", flag: "🇺🇬", mask: "+256 ### ######" },
    "+257": { name: "Burundi", flag: "🇧🇮", mask: "+257 ## ## ####" },
    "+258": { name: "Mozambique", flag: "🇲🇿", mask: "+258 ## ### ###" },
    "+260": { name: "Zambia", flag: "🇿🇲", mask: "+260 ## #######" },
    "+261": { name: "Madagascar", flag: "🇲🇬", mask: "+261 ## ## #####" },
    "+263": { name: "Zimbabwe", flag: "🇿🇼", mask: "+263 # ######" },
    "+264": { name: "Namibia", flag: "🇳🇦", mask: "+264 ## ### ####" },
    "+265": { name: "Malawi", flag: "🇲🇼", mask: "+265 # ### ####" },
    "+266": { name: "Lesotho", flag: "🇱🇸", mask: "+266 # ### ####" },
    "+267": { name: "Botswana", flag: "🇧🇼", mask: "+267 ## ### ###" },
    "+268": { name: "Eswatini", flag: "🇸🇿", mask: "+268 ## ## ####" },
    "+269": { name: "Comoros", flag: "🇰🇲", mask: "+269 ## ## ####" },
    "+27": { name: "South Africa", flag: "🇿🇦", mask: "+27 ## ### ####" },

    // Europe (Zones 3 & 4)
    "+30": { name: "Greece", flag: "🇬🇷", mask: "+30 ### ### ####" },
    "+31": { name: "Netherlands", flag: "🇳🇱", mask: "+31 # ########" },
    "+32": { name: "Belgium", flag: "🇧🇪", mask: "+32 ### ## ## ##" },
    "+33": { name: "France", flag: "🇫🇷", mask: "+33 # ## ## ## ##" },
    "+34": { name: "Spain", flag: "🇪🇸", mask: "+34 ### ### ###" },
    "+350": { name: "Gibraltar", flag: "🇬🇮", mask: "+350 ########" },
    "+351": { name: "Portugal", flag: "🇵🇹", mask: "+351 ### ### ###" },
    "+352": { name: "Luxembourg", flag: "🇱🇺", mask: "+352 ### ###" },
    "+353": { name: "Ireland", flag: "🇮🇪", mask: "+353 ## ### ####" },
    "+354": { name: "Iceland", flag: "🇮🇸", mask: "+354 ### ####" },
    "+355": { name: "Albania", flag: "🇦🇱", mask: "+355 ## ### ###" },
    "+356": { name: "Malta", flag: "🇲🇹", mask: "+356 #### ####" },
    "+357": { name: "Cyprus", flag: "🇨🇾", mask: "+357 ## ######" },
    "+358": { name: "Finland", flag: "🇫🇮", mask: "+358 ## ### ## ##" },
    "+359": { name: "Bulgaria", flag: "🇧🇬", mask: "+359 ### ### ###" },
    "+36": { name: "Hungary", flag: "🇭🇺", mask: "+36 ## ### ####" },
    "+370": { name: "Lithuania", flag: "🇱🇹", mask: "+370 ### #####" },
    "+371": { name: "Latvia", flag: "🇱🇻", mask: "+371 ## ### ###" },
    "+372": { name: "Estonia", flag: "🇪🇪", mask: "+372 #### ####" },
    "+373": { name: "Moldova", flag: "🇲🇩", mask: "+373 #### ####" },
    "+374": { name: "Armenia", flag: "🇦🇲", mask: "+374 ## ######" },
    "+375": { name: "Belarus", flag: "🇧🇾", mask: "+375 ## ### ## ##" },
    "+376": { name: "Andorra", flag: "🇦🇩", mask: "+376 ### ###" },
    "+377": { name: "Monaco", flag: "🇲🇨", mask: "+377 # ## ## ## ##" },
    "+378": { name: "San Marino", flag: "🇸🇲", mask: "+378 #### ######" },
    "+380": { name: "Ukraine", flag: "🇺🇦", mask: "+380 ## ### ## ##" },
    "+381": { name: "Serbia", flag: "🇷🇸", mask: "+381 ## ### ####" },
    "+382": { name: "Montenegro", flag: "🇲🇪", mask: "+382 ## ### ###" },
    "+383": { name: "Kosovo", flag: "🇽🇰", mask: "+383 ## ### ###" },
    "+385": { name: "Croatia", flag: "🇭🇷", mask: "+385 ## ### ####" },
    "+386": { name: "Slovenia", flag: "🇸🇮", mask: "+386 ## ### ###" },
    "+387": { name: "Bosnia and Herzegovina", flag: "🇧🇦", mask: "+387 ## ######" },
    "+389": { name: "North Macedonia", flag: "🇲🇰", mask: "+389 ## ### ###" },
    "+39": { name: "Italy", flag: "🇮🇹", mask: "+39 ### ### ####" },
    "+40": { name: "Romania", flag: "🇷🇴", mask: "+40 ### ### ###" },
    "+41": { name: "Switzerland", flag: "🇨🇭", mask: "+41 ## ### ####" },
    "+420": { name: "Czech Republic", flag: "🇨🇿", mask: "+420 ### ### ###" },
    "+421": { name: "Slovakia", flag: "🇸🇰", mask: "+421 ### ### ###" },
    "+423": { name: "Liechtenstein", flag: "🇱🇮", mask: "+423 ### ####" },
    "+43": { name: "Austria", flag: "🇦🇹", mask: "+43 ### ########" },
    "+44": { name: "UK", flag: "🇬🇧", mask: "+44 #### ######" },
    "+45": { name: "Denmark", flag: "🇩🇰", mask: "+45 ## ## ## ##" },
    "+46": { name: "Sweden", flag: "🇸🇪", mask: "+46 ## ### ## ##" },
    "+47": { name: "Norway", flag: "🇳🇴", mask: "+47 ### ## ###" },
    "+48": { name: "Poland", flag: "🇵🇱", mask: "+48 ### ### ###" },
    "+49": { name: "Germany", flag: "🇩🇪", mask: "+49 ### #######" },

    // South & Central America (Zone 5)
    "+500": { name: "Falkland Islands", flag: "🇫🇰", mask: "+500 #####" },
    "+501": { name: "Belize", flag: "🇧🇿", mask: "+501 ### ####" },
    "+502": { name: "Guatemala", flag: "🇬🇹", mask: "+502 #### ####" },
    "+503": { name: "El Salvador", flag: "🇸🇻", mask: "+503 #### ####" },
    "+504": { name: "Honduras", flag: "🇭🇳", mask: "+504 #### ####" },
    "+505": { name: "Nicaragua", flag: "🇳🇮", mask: "+505 #### ####" },
    "+506": { name: "Costa Rica", flag: "🇨🇷", mask: "+506 #### ####" },
    "+507": { name: "Panama", flag: "🇵🇦", mask: "+507 #### ####" },
    "+508": { name: "Saint Pierre and Miquelon", flag: "🇵🇲", mask: "+508 ## ## ##" },
    "+509": { name: "Haiti", flag: "🇭🇹", mask: "+509 #### ####" },
    "+51": { name: "Peru", flag: "🇵🇪", mask: "+51 ### ### ###" },
    "+52": { name: "Mexico", flag: "🇲🇽", mask: "+52 ## #### ####" },
    "+53": { name: "Cuba", flag: "🇨🇺", mask: "+53 # #######" },
    "+54": { name: "Argentina", flag: "🇦🇷", mask: "+54 # ########" },
    "+55": { name: "Brazil", flag: "🇧🇷", mask: "+55 ## ##### ####" },
    "+56": { name: "Chile", flag: "🇨🇱", mask: "+56 # #### ####" },
    "+57": { name: "Colombia", flag: "🇨🇴", mask: "+57 ### ### ####" },
    "+58": { name: "Venezuela", flag: "🇻🇪", mask: "+58 ### ### ####" },
    "+591": { name: "Bolivia", flag: "🇧🇴", mask: "+591 # ### ####" },
    "+592": { name: "Guyana", flag: "🇬🇾", mask: "+592 ### ####" },
    "+593": { name: "Ecuador", flag: "🇪🇨", mask: "+593 # ### ####" },
    "+595": { name: "Paraguay", flag: "🇵🇾", mask: "+595 ### ### ###" },
    "+597": { name: "Suriname", flag: "🇸🇷", mask: "+597 ### ###" },
    "+598": { name: "Uruguay", flag: "🇺🇾", mask: "+598 # ### ####" },

    // Oceania & Southeast Asia (Zone 6)
    "+60": { name: "Malaysia", flag: "🇲🇾", mask: "+60 ## #### ####" },
    "+61": { name: "Australia", flag: "🇦🇺", mask: "+61 ### ### ###" },
    "+62": { name: "Indonesia", flag: "🇮🇩", mask: "+62 ### ### ####" },
    "+63": { name: "Philippines", flag: "🇵🇭", mask: "+63 ### ### ####" },
    "+64": { name: "New Zealand", flag: "🇳🇿", mask: "+64 ## ### ####" },
    "+65": { name: "Singapore", flag: "🇸🇬", mask: "+65 #### ####" },
    "+66": { name: "Thailand", flag: "🇹🇭", mask: "+66 ## ### ####" },
    "+670": { name: "East Timor", flag: "🇹🇱", mask: "+670 #### ####" },
    "+673": { name: "Brunei", flag: "🇧🇳", mask: "+673 ### ####" },
    "+674": { name: "Nauru", flag: "🇳🇷", mask: "+674 ### ####" },
    "+675": { name: "Papua New Guinea", flag: "🇵🇬", mask: "+675 ### ####" },
    "+676": { name: "Tonga", flag: "🇹🇴", mask: "+676 #####" },
    "+677": { name: "Solomon Islands", flag: "🇸🇧", mask: "+677 #####" },
    "+678": { name: "Vanuatu", flag: "🇻🇺", mask: "+678 #####" },
    "+679": { name: "Fiji", flag: "🇫🇯", mask: "+679 ## #####" },
    "+680": { name: "Palau", flag: "🇵🇼", mask: "+680 ### ####" },
    "+685": { name: "Samoa", flag: "🇼🇸", mask: "+685 #####" },
    "+686": { name: "Kiribati", flag: "🇰🇮", mask: "+686 #####" },
    "+688": { name: "Tuvalu", flag: "🇹🇻", mask: "+688 #####" },
    "+689": { name: "French Polynesia", flag: "🇵🇫", mask: "+689 ## ## ##" },
    "+690": { name: "Tokelau", flag: "🇹🇰", mask: "+690 ####" },
    "+691": { name: "Micronesia", flag: "🇫🇲", mask: "+691 ### ####" },
    "+692": { name: "Marshall Islands", flag: "🇲🇭", mask: "+692 ### ####" },

    // Russia & Central Asia (Zone 7)
    "+7": { name: "Russia / Kazakhstan", flag: "🇷🇺", mask: "+7 (###) ###-##-##" },

    // East Asia & Special Services (Zone 8)
    "+81": { name: "Japan", flag: "🇯🇵", mask: "+81 ## #### ####" },
    "+82": { name: "South Korea", flag: "🇰🇷", mask: "+82 ## #### ####" },
    "+84": { name: "Vietnam", flag: "🇻🇳", mask: "+84 ## #### ####" },
    "+852": { name: "Hong Kong", flag: "🇭🇰", mask: "+852 #### ####" },
    "+853": { name: "Macau", flag: "🇲🇴", mask: "+853 #### ####" },
    "+855": { name: "Cambodia", flag: "🇰🇭", mask: "+855 ## ### ###" },
    "+856": { name: "Laos", flag: "🇱🇦", mask: "+856 ## ## ### ###" },
    "+86": { name: "China", flag: "🇨🇳", mask: "+86 ### #### ####" },
    "+880": { name: "Bangladesh", flag: "🇧🇩", mask: "+880 ### ########" },
    "+886": { name: "Taiwan", flag: "🇹🇼", mask: "+886 # #### ####" },

    // West, Central & South Asia (Zone 9)
    "+90": { name: "Turkey", flag: "🇹🇷", mask: "+90 ### ### ####" },
    "+91": { name: "India", flag: "🇮🇳", mask: "+91 ##### #####" },
    "+92": { name: "Pakistan", flag: "🇵🇰", mask: "+92 ### #######" },
    "+93": { name: "Afghanistan", flag: "🇦🇫", mask: "+93 ## ### ####" },
    "+94": { name: "Sri Lanka", flag: "🇱🇰", mask: "+94 ## ### ####" },
    "+95": { name: "Myanmar", flag: "🇲🇲", mask: "+95 # ### ####" },
    "+960": { name: "Maldives", flag: "🇲🇻", mask: "+960 ### ####" },
    "+961": { name: "Lebanon", flag: "🇱🇧", mask: "+961 ## ### ###" },
    "+962": { name: "Jordan", flag: "🇯🇴", mask: "+962 # #### ####" },
    "+963": { name: "Syria", flag: "🇸🇾", mask: "+963 ## ########" },
    "+964": { name: "Iraq", flag: "🇮🇶", mask: "+964 ### ### ####" },
    "+965": { name: "Kuwait", flag: "🇰🇼", mask: "+965 ########" },
    "+966": { name: "Saudi Arabia", flag: "🇸🇦", mask: "+966 ## ### ####" },
    "+967": { name: "Yemen", flag: "🇾🇪", mask: "+967 ### ### ###" },
    "+968": { name: "Oman", flag: "🇴🇲", mask: "+968 ########" },
    "+970": { name: "Palestine", flag: "🇵🇸", mask: "+970 ## ### ####" },
    "+971": { name: "United Arab Emirates", flag: "🇦🇪", mask: "+971 ## ### ####" },
    "+972": { name: "Israel", flag: "🇮🇱", mask: "+972 ## ### ####" },
    "+973": { name: "Bahrain", flag: "🇧🇭", mask: "+973 ########" },
    "+974": { name: "Qatar", flag: "🇶🇦", mask: "+974 ########" },
    "+975": { name: "Bhutan", flag: "🇧🇹", mask: "+975 # ### ###" },
    "+976": { name: "Mongolia", flag: "🇲🇳", mask: "+976 ## ## ####" },
    "+977": { name: "Nepal", flag: "🇳🇵", mask: "+977 ## ### ###" },
    "+98": { name: "Iran", flag: "🇮🇷", mask: "+98 ### ### ####" },
    "+992": { name: "Tajikistan", flag: "🇹🇯", mask: "+992 ## ### ####" },
    "+993": { name: "Turkmenistan", flag: "🇹🇲", mask: "+993 # ######" },
    "+994": { name: "Azerbaijan", flag: "🇦🇿", mask: "+994 ## ### ## ##" },
    "+995": { name: "Georgia", flag: "🇬🇪", mask: "+995 ### ######" },
    "+996": { name: "Kyrgyzstan", flag: "🇰🇬", mask: "+996 ### ######" },
    "+998": { name: "Uzbekistan", flag: "🇺🇿", mask: "+998 ## ### ####" }
};

    
     
  

    // --- iOS 26 Country Picker Mini-Page Engine Elements & Functions ---
    const countryDisplayTag = document.getElementById("countryDisplayTag");
    const countryPickerMiniPage = document.getElementById("countryPickerMiniPage");
    const closeCountryPickerBtn = document.getElementById("closeCountryPickerBtn");
    const countryListContainer = document.getElementById("countryListContainer");
    const countrySearchInput = document.getElementById("countrySearchInput");

    function renderCountryList(filterText = "") {
        if (!countryListContainer) return;
        countryListContainer.innerHTML = "";

        Object.entries(countryRules).forEach(([code, data]) => {
            const query = filterText.toLowerCase();
            if (data.name.toLowerCase().includes(query) || code.includes(query)) {
                const row = document.createElement("div");
                row.className = "settings-row clickable country-item-row";
                row.innerHTML = `
                    <div class="row-left" style="display: flex; align-items: center; gap: 12px;">
                        <span class="country-flag" style="font-size: 20px;">${data.flag || "🌍"}</span>
                        <span class="row-label-text">${data.name}</span>
                    </div>
                    <div class="row-right">
                        <span class="row-status-text" style="color: var(--text-sub);">${code}</span>
                    </div>
                `;
                row.addEventListener("click", () => {
                    if (appleIdentifier) {
                        appleIdentifier.value = code + " ";
                        if (countryDisplayTag) countryDisplayTag.textContent = data.name;
                        updateAppleButtonState();
                    }
                    closeCountryPickerMiniPage();
                });
                countryListContainer.appendChild(row);
                
                const divider = document.createElement("div");
                divider.className = "card-divider indent";
                countryListContainer.appendChild(divider);
            }
        });
    }

    function openCountryPickerMiniPage() {
        if (countryPickerMiniPage) {
            renderCountryList();
            countryPickerMiniPage.classList.add("active");
        }
    }

    function closeCountryPickerMiniPage() {
        if (countryPickerMiniPage) {
            countryPickerMiniPage.classList.remove("active");
            if (countrySearchInput) countrySearchInput.value = "";
        }
    }

    if (countryDisplayTag) {
        countryDisplayTag.addEventListener("click", openCountryPickerMiniPage);
    }

    if (closeCountryPickerBtn) {
        closeCountryPickerBtn.addEventListener("click", closeCountryPickerMiniPage);
    }

    if (countrySearchInput) {
        countrySearchInput.addEventListener("input", (e) => {
            renderCountryList(e.target.value.trim());
        });
    }

    // --- iOS 26 Apple Account Signup Advanced Interactivity & Container State Engine ---
    const useEmailBtn = document.getElementById("useEmailBtn");
    const usePhoneBtn = document.getElementById("usePhoneBtn");
    const appleIdentifier = document.getElementById("appleIdentifier");
    const inputLabel = document.getElementById("inputLabel");
    const ios26AlertBox = document.getElementById("ios26AlertBox");

    let alertFadeTimer = null;

    function showIOS26Alert(message) {
        if (!ios26AlertBox) return;
        
        if (alertFadeTimer) {
            clearTimeout(alertFadeTimer);
        }

        ios26AlertBox.textContent = message;
        ios26AlertBox.classList.add("show");

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
        });
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
    const batteryPercentText = document.getElementById("batteryPercentText");
    const mainBatteryStatusText = document.getElementById("mainBatteryStatusText");
    const batteryLevelFill = document.getElementById("batteryLevelFill");
    const lastChargedText = document.getElementById("lastChargedText");

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
