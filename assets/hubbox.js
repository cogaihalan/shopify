document.addEventListener("DOMContentLoaded", function() {
    const HUBBOX_VERSION = '3.3.4';

    if (!window.HubBox) window.HubBox = {};
    /* Config */
    if (!window.HubBox.theme) window.HubBox.theme = 'hubbox';
    if (!window.HubBox.configId) window.HubBox.configId = 'oh_polly_uk';
    if (!window.HubBox.frameUrl) window.HubBox.frameUrl = 'https://frame.hub-box.com/';
    if (!window.HubBox.containerId) window.HubBox.containerId = 'hubbox-widget-1';
    if (!window.HubBox.isD2REnabled) window.HubBox.isD2REnabled = true;
    if (!window.HubBox.D2RField) window.HubBox.D2RField = 'address1'; // Accepted values: address1, address2, company. Default: address1
    
    /** DO NOT CHANGE ANYTHING BELOW THIS LINE */
    window.HubBox.shopiBox = {};
    if (window.HubBox.theme == '') {
        console.log('IMPORTANT: HubBox Theme config is not set. Fallback to HubBox theme');
        window.HubBox.theme = 'hubbox';
    }

    if (window.HubBox.theme == 'hubbox') {
        if (window.HubBox.configId == '') {
            window.HubBox.configId = 'theme_hubbox_tooltip';
        }
        window.HubBox.enhanceLanguage = {
            form: {
                prompt: 'Just add your name, email, and phone number to continue.',
                introText: 'Make sure you never miss a delivery by selecting Click & Collect. There are more than 4,500 locations to choose from',
                introTextChanged: 'Thank you for choosing to pick up your order, you have chosen a <span style="color:green">greener</span> shipping option! You will receive an email when your order is ready to pickup from your chosen location. <a href="#" onclick="window.HubBox.showSingleWidget();" id="hubbox_find_another_location">Find another location</a>',
                showWidgetButton: 'Click & Collect',
              	showWidgetButtonSelected: 'Click & Collect',
                showWidgetClass: 'hubbox-theme'
            },
            moreInfo: {
                private: {
                    imgUrl: 'https://s3-eu-west-1.amazonaws.com/hub-box-assets/production/widget/images/icons/grey-location-shopping.png',
                    title: 'You have chosen to use Click & Collect',
                    body: 'Your order will be sent to your chosen pickup location:',
                    homeDelivery: {
                        intro: 'Changed your mind about Click & Collect?',
                        link: 'Use home delivery instead'
                    }
                },
                network: {
                    imgUrl: 'https://s3-eu-west-1.amazonaws.com/hub-box-assets/production/widget/images/icons/grey-location-shopping.png',
                    title: 'You have chosen to use Click & Collect',
                    body: 'Your order will be sent to your chosen pickup location:',
                    homeDelivery: {
                        intro: 'Changed your mind about Click & Collect?',
                        link: 'Use home delivery instead'
                    }
                }
            },
            secondCapture: {
                title: 'Click and Collect',
                tag: 'Collect from thousands of <span>HubBox</span> locations nationwide (UK only)'
            }
        };
    } else if (window.HubBox.theme == 'dpd') {
        if (window.HubBox.configId == '') {
            window.HubBox.configId = 'theme_dpd_tooltip';
        }
        window.HubBox.enhanceLanguage = {
            form: {
                prompt: 'Just add your name, email, and phone number to continue.',
                introText: 'Make sure you never miss a delivery by selecting DPD Pickup. There are more than 6,500 locations to choose from and it\'s better for the environment!',
                introTextChanged: 'Thank you for choosing to pick up your order, you have chosen a <span style="color:green">greener</span> shipping option! You will receive an email when your order is ready to pickup from your chosen location. <a href="#" onclick="window.HubBox.showSingleWidget();" id="hubbox_find_another_location">Find another location</a>',
                showWidgetButton: '<img src="https://www.dpd.co.uk/content/about_dpd/press_centre/dpduk-logo-large.png" alt="dpdlogo" style="height:30px;margin-top:-10px;margin-bottom:-8px;margin-right:2px;"> Pickup',
                showWidgetButtonSelected: '<img src="https://shopify-hubbox.s3.eu-west-1.amazonaws.com/production/assets/images/dpd/DPD_logo_redwhite_rgb.png" alt="dpdlogowhite" style="height:30px;margin-top:-10px;margin-bottom:-8px;margin-right:2px;"> Pickup',
                showWidgetClass: 'dpd-theme'
            },
            moreInfo: {
                private: {
                    imgUrl: 'https://hub-box-assets.s3.eu-west-1.amazonaws.com/production/widget/images/icons/DPD_symbol_white_rgb.png',
                    title: 'You have chosen to use DPD Pickup',
                    body: 'Your order will be sent to your chosen pickup location:',
                    homeDelivery: {
                        intro: 'Changed your mind about DPD Pickup?',
                        link: 'Use home delivery instead'
                    }
                },
                network: {
                    imgUrl: 'https://hub-box-assets.s3.eu-west-1.amazonaws.com/production/widget/images/icons/DPD_symbol_white_rgb.png',
                    title: 'You have chosen to use DPD Pickup',
                    body: 'Your order will be sent to your chosen pickup location:',
                    homeDelivery: {
                        intro: 'Changed your mind about DPD Pickup?',
                        link: 'Use home delivery instead'
                    }
                }
            },
            secondCapture: {
                title: 'Click and Collect',
                tag: 'Collect from thousands of <span>DPD</span> locations'
            }
        };
    } else {
        if (window.HubBox.configId == '') {
            window.HubBox.configId = 'theme_ups_tooltip';
        }
        window.HubBox.enhanceLanguage = {
            form: {
                prompt: 'Just add your name, email, and phone number to continue.',
                introText : 'Make sure you never miss a delivery by selecting Local Pickup from a nearby UPS Access Point. \
        There are more than 20,000 locations to choose from.',
                introTextChanged: 'Thank you for choosing to pick up your order, you have chosen a <span style="color:green">greener</span> shipping option! You will receive an email when your order is ready to pickup from your chosen location. <a href="#" onclick="window.HubBox.showSingleWidget();" id="hubbox_find_another_location">Find another location</a>',
                showWidgetButton: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/United_Parcel_Service_logo_2014.svg/402px-United_Parcel_Service_logo_2014.svg.png" alt="upslogo" style="width:23px;margin-top:-10px;margin-bottom:-8px;margin-right:3px;"> Local Pickup',
              	showWidgetButtonSelected: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/United_Parcel_Service_logo_2014.svg/402px-United_Parcel_Service_logo_2014.svg.png" alt="upslogo" style="width:23px;margin-top:-10px;margin-bottom:-8px;margin-right:3px;"> Local Pickup',
              	showWidgetClass: 'ups-theme'
            },
            moreInfo: {
                private: {
                    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/UPS_Logo_Shield_2017.svg/859px-UPS_Logo_Shield_2017.svg.png',
                    title: 'Thank you for choosing Local Pickup',
                    body: 'Your order will be sent to your chosen Access Point. You will receive an email when your order is ready for pickup.',
                    homeDelivery: {
                        intro: 'Changed your mind about Local Pickup?',
                        link: 'Use home delivery instead'
                    }
                },
                network: {
                    imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/UPS_Logo_Shield_2017.svg/859px-UPS_Logo_Shield_2017.svg.png',
                    title: 'Thank you for choosing Local Pickup',
                    body: 'Your order will be sent to your chosen Access Point. You will receive an email when your order is ready for pickup.',
                    homeDelivery: {
                        intro: 'Changed your mind about Local Pickup?',
                        link: 'Use home delivery instead'
                    }
                }
            }
        };
    }

    (function(){
        // Detect if on checkout page
        var detectCheckout = function() {
            return typeof window.Shopify.Checkout !== 'undefined';
        };

        window.HubBox.detectInfoStepInCheckout = function() {
            return detectCheckout() && Shopify.Checkout.step === "contact_information";
        };

        window.HubBox.detectThanks = function() {
            return detectCheckout() && Shopify.Checkout.step === "thank_you";
        };

        var isCompanyPopulated = function() {
            var companyElement = window.parent.document.getElementById("checkout_shipping_address_company");
            if (!companyElement) {
                return false;
            }
            return (companyElement.value && companyElement.value.trim().length > 0);
        };

        var detectHubBoxElement = function() {
            return (getHubBoxElement() !== null);
        };

        var getHubBoxElement = function() {
            var elementId = (isCompanyPopulated()) ? "checkout_shipping_address_company" : "checkout_shipping_address_address1";
            return window.parent.document.getElementById(elementId);
        };

        // Detect if user has selected a lockable address (any selected collect point)
        var detectShouldLockAddress = function() {
            var regexCheck = /Pickup|D2R|HubBox|S2S|HBC|HBCF|PCP|PCPF/;
            if (detectFromCompanyLine(regexCheck)) {
                return true;
            } else {
                return detectFromAddress(regexCheck);
            }
        };

        var hasBeenResetToHomeDelivery = function() {
            if (sessionStorage.hubBox_cp) {
              	console.log({"hasBeenResetToHomeDelivery" : sessionStorage.hubBox_cp });
                return true;
            } else {
                return false;
            }
        };

        // Detect if order is a private cp or connect point (different messaging displayed)
        var isPrivateCollectPointAddress = function() {
            var regexCheck = /HBC|HBCF|PCP|PCPF/;
            if (detectFromCompanyLine(regexCheck)) {
                return true;
            } else {
                return detectFromAddress(regexCheck);
            }
        };

        var isCouponUsed = function () {
            var proxied = window.XMLHttpRequest.prototype.send;
            window.XMLHttpRequest.prototype.send = function() {
                var pointer = this;
                var intervalId = window.setInterval(function(){
                    if(pointer.readyState != 4){
                        return;
                    }
                    var res = /^\/(\d*)\/checkouts\/([0-9]|[abcdef])*$/.test(pointer._url);
                    if(res){
                        console.log("Coupon change");
                        var hubboxButtonExists = window.parent.document.getElementById("hubbox_find_another_location");
                        var hubboxClickAndCollectExists = window.parent.document.getElementById("click-and-collect");

                        if (hubboxButtonExists == null && hubboxClickAndCollectExists == null) {
                            console.log("Hub-box - reInject");
                            window.HubBox.initCheckoutEnhancement();
                            hubboxButtonExists = window.parent.document.getElementById("hubbox_find_another_location");
                            hubboxClickAndCollectExists = window.parent.document.getElementById("click-and-collect");
                            if (hubboxButtonExists == null && hubboxClickAndCollectExists == null) {
                                /* v1 */
                                if (window.HubBox.$) {
                                    // jQuery exists
                                    /* If not selected collect point */
                                    var hubbox_summary_close = window.HubBox.$("a#hubbox-summary-close");
                                    if (hubbox_summary_close == null) {
                                        //showButtonAfterCoupon();
                                        clearInterval(intervalId);
                                    } else {
                                        // DO NOTHING
                                    }
                                } else {
                                    //howButtonAfterCoupon();
                                    clearInterval(intervalId);
                                }
                            }
                        }
                    }
                    clearInterval(intervalId);
                }, 10);
                return proxied.apply(this, [].slice.call(arguments));
            };
        };

        var showButtonAfterCoupon = function () {
            var initVars = window.HubBox.templates['checkout_button'];
            var checkoutButtonVar = window.HubBox.language['hubbox'].checkoutButton;
            initVars = initVars.replace('{{clickAndCollect}}', checkoutButtonVar.clickAndCollect);
            initVars = initVars.replace('{{{tag}}}', checkoutButtonVar.tag);
            initVars = initVars.replace('{{whatIsThis}}', checkoutButtonVar.whatIsThis);
            var checkoutButton = document.createRange().createContextualFragment(initVars);
            var injectionPoint = document.querySelector('.section--shipping-address > .section__header > h2');
            if (checkoutButton && checkoutButtonVar) {
                if(document.body.contains(window.parent.document.getElementById('hubbox-summary-close'))) {
                    /* Do nothing */
                    console.log("HubBox - Checkout Change - User Selected collect point");
                } else {
                    if(document.body.contains(window.parent.document.getElementById('hubbox-button-and-info'))) {
                        /* Do nothing */
                        console.log("HubBox - Checkout Change - Button exists");
                    } else {
                        /* Re-Inject */
                        injectionPoint.parentNode.insertBefore(checkoutButton, injectionPoint);
                        console.log("HubBox - Checkout Change - Inject Button");
                        var x = window.parent.document.getElementById("hubbox-button-and-info");
                        if (x.style.display === "none") {
                            x.style.display = "block";
                        }

                        window.parent.document.getElementById("click-and-collect").addEventListener("click", function(){
                            var x = window.parent.document.getElementById("hubbox-widget");
                            if (x.style.display === "none") {
                                x.style.display = "block";
                            }
                            x.classList.add('open');
                        });
                    }
                }

            }
        };

        var detectFromAddress = function(regex) {
            //Address 1 field
            var field = window.parent.document.getElementById('checkout_shipping_address_address1');
            if(window.location == null) return false;
            var params = window.location.search;
            var matches = params.match(regex);
            if(matches && matches.length > 0) return true;
            if(field && field.value && field.value.match(regex)){ 
                return true;
            }

            //Address 2 field
            var field = window.parent.document.getElementById('checkout_shipping_address_address2');
            if(window.location == null) return false;
            var params = window.location.search;
            var matches = params.match(regex);
            if(matches && matches.length > 0) return true;
            if(field && field.value && field.value.match(regex)){ 
                return true;
            }
            return false;
        };

        var detectFromCompanyLine = function(regex) {
            //Company Field
            if (!isCompanyPopulated()) {
                return false;
            }
            var field = window.parent.document.getElementById('checkout_shipping_address_company');
            if(window.location == null) return false;
            var params = window.location.search;
            var matches = params.match(regex);
            if(matches && matches.length > 0) return true;
            if(field && field.value && field.value.match(regex)) return true;
            return false;
        };

        // Add hubbox details
        var addMoreInfo = function() {
            var div = document.createElement('div');
            var section = getHubBoxElement().parentElement.parentElement.parentElement;
            var languageKey = (isPrivateCollectPointAddress()) ? 'private' : 'network';
            var lang = window.HubBox.enhanceLanguage.moreInfo[languageKey];

            div.innerHTML = '\
            <div class="hubbox-checkout-confirmation-container" id="hubbox-checkout-confirmation-container">\
            ' + lang.body + '\
            </div>';
            section.insertBefore( div, section.firstChild );
        };

        window.HubBox.hideSingleWidget = function() {
            if (!jQuery) {
                var jQuery = window.Checkout.jQuery;
            }
            var SingleWidgetContainer = '#'+window.HubBox.containerId;
            var SingleWidget        = jQuery(SingleWidgetContainer);
            var closeSingleWidget   = jQuery("#hb-close-sw");
            closeSingleWidget.hide();
            SingleWidget[0].style.visibility = "hidden";
        };

        window.HubBox.confirmCollectionPointSingleWidget = function(cp) {
            window.Checkout.jQuery('.hubbox-option').hide();
            window.HubBox.hideSingleWidget();
            console.log({ CollectionPoint: cp });
            sessionStorage.setItem("hubBox_cp", JSON.stringify(cp));
            ShopiRestore.init({storeId: Shopify.Checkout.apiHost});
            window.HubBox.addValuesToElements();
            window.HubBox.disableFields();
            window.HubBox.hideFields();
        };

        window.HubBox.confirmHomeDelivery = function() {
            if (sessionStorage.hubBox_cp) {
                sessionStorage.removeItem("hubBox_cp");
                ShopiRestore.init({storeId: Shopify.Checkout.apiHost});
            }
            window.HubBox.enableFields();
            window.HubBox.emptyCheckoutFields();
            location.reload();
        };

        window.HubBox.resetAndHomeDelivery = function() {
            if (sessionStorage.hubBox_cp) {
                sessionStorage.removeItem("hubBox_cp");
            }
            window.Checkout.jQuery('#hb-not-going-to-be-home').slideUp();
            window.Checkout.jQuery('#hb-not-going-to-be-home-helper').show(300);
        }

        window.HubBox.showSingleWidget = function() {
            if (!jQuery) {
                var jQuery = window.Checkout.jQuery;
            }
            var SingleWidgetContainer = '#'+window.HubBox.containerId;
            var isModal               = true;
            var SingleWidget          = jQuery(SingleWidgetContainer);
            var closeSingleWidget     = jQuery("#hb-close-sw");

            var hbTheme = window.HubBox.theme;
            var iframeUrl = window.HubBox.frameUrl;
            var configId = window.HubBox.configId;

            if (isModal) {
                SingleWidget.addClass("hubbox-modal");
            } else {
                SingleWidget.removeClass("hubbox-modal");
            }

            if (!window.HubBox.widget) {
                singleWidgetManager = new SingleWidgetManager({
                    container: document.getElementById(window.HubBox.containerId),
                    iframeUrl: iframeUrl,
                    iframeParams: {
                        configId: (configId != '') ? configId : hbTheme
                    }
                });

                singleWidgetManager.events.subscribe(singleWidgetManager.topics.subscribe.COLLECT_POINT_CONFIRMED,
                    (messageAndTopic) => (
                        window.HubBox.confirmCollectionPointSingleWidget(messageAndTopic.message)
                    ));

                window.HubBox.widget = singleWidgetManager;

                SingleWidget.show();

                if (SingleWidget.hasClass('hubbox-modal')) {
                    closeSingleWidget.show(1000);
                    closeSingleWidget.click(function(){
                        window.HubBox.hideSingleWidget();
                    });
                } else {
                    closeSingleWidget.hide();
                }

            } else {
                singleWidgetManager.events.emit(singleWidgetManager.topics.emit.RESET_STATE);
                SingleWidget[0].style.visibility = "visible";

                if (SingleWidget.hasClass('hubbox-modal')) {
                    closeSingleWidget.show(1000);
                } else {
                    closeSingleWidget.hide();
                }
                console.log("Hub-Box - ReUse Existing Single Widget");
            }

        };

        // Add second capture details
        var addSecondInfo = function() {
          	var exists = document.querySelector('div.hubbox-toggle-buttons');
          
          	var languageTranslation = window.HubBox.enhanceLanguage;
          
          	var homeDeliverySelected = '';
            var clickCollectSelected = '';
            if (!sessionStorage.hubBox_cp) {
              var homeDeliverySelected = languageTranslation.form.showWidgetClass + '-selected';
              var clickCollectSelected = '';
            } else {
              var homeDeliverySelected = '';
              var clickCollectSelected = languageTranslation.form.showWidgetClass + '-selected';
              languageTranslation.form.showWidgetButton = languageTranslation.form.showWidgetButtonSelected;
              languageTranslation.form.introText = languageTranslation.form.introTextChanged;
            }
          
          	if (!exists) {
              var div = document.createElement('div');
              var section = getHubBoxElement().parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
              
              div.innerHTML =  '\
              <div class="hubbox-toggle-buttons hubbox-toggle-buttons-custom hb-toggles">\
              <div class="actions-toolbar">\
              <h2 class="dynamic-checkout__title">Delivery Location</h2>\
                  <div class="dynamic-checkout__content">\
                      <div tabindex="3" class="btn hubbox-toggle-button ' + homeDeliverySelected + '" onclick="window.HubBox.confirmHomeDelivery();" id="home-delivery">Home Delivery</div>\
                      <div tabindex="2" class="btn hubbox-toggle-button ' + clickCollectSelected + '" onclick="window.HubBox.showSingleWidget();" id="click-and-collect">\
						' + languageTranslation.form.showWidgetButton + '</div>\
                            <div class="launch-intro">' + languageTranslation.form.introText + '</div>\
                  </div>\
              </div>\
          	  </div>\
  			  <br><br></div>\
              <div id="' + window.HubBox.containerId + '">\
              <img id="hb-close-sw" src="https://s3.eu-west-2.amazonaws.com/kostas-hub-box.com/m2/single-widget/x.svg" />\
              </div>';
              section.insertBefore( div, section.firstChild );
            } else {
                var launch = document.querySelector('.launch-intro');
                if (launch) {
                    launch.innerHTML = languageTranslation.form.introText;
                }

                var click_and_collect = document.querySelector('div#click-and-collect');
                if (click_and_collect) {
                    click_and_collect.innerHTML = languageTranslation.form.showWidgetButton;
                    click_and_collect.classList.add(clickCollectSelected);
                }

                var home_delivery = document.querySelector('div#home-delivery');
                if (home_delivery) {
                    home_delivery.classList.remove(clickCollectSelected);
                }
            }
        };

        // Move some fields at the top of the div for visual distinction between prefilled elemnts and stuff that needs to be completed
        var arrangeFields = function() {
            var elements = [
                "checkout_shipping_address_phone", 
                "checkout_shipping_address_last_name", 
                "checkout_shipping_address_first_name"
            ];

            elements.forEach(function(field){
                var element = window.parent.document.getElementById(field);
                if(!element) return false;

                var fieldWrapper = window.parent.document.getElementById(field).parentElement.parentElement;
                var section = window.parent.document.getElementById(field).parentElement.parentElement.parentElement;

                section.insertBefore( fieldWrapper, section.firstChild );
            })
        };

        // Force move shopify hidden fields to top in order to prevent empty submissions
        var arrangeHiddenFields = function() {
            var elements = ["checkout[shipping_address][phone]", 
                            "checkout[shipping_address][last_name]", 
                            "checkout[shipping_address][first_name]"
                           ];

            elements.forEach(function(field){
                var element = document.getElementsByName(field);
                if(!element[1]) return false;

                var fieldWrapper = element[1];
                var section = element[1].parentElement;

                section.insertBefore( fieldWrapper, section.firstChild );
            })
        };

        // Force hidden fields to match in order to enable field locking
        var setHiddenFields = function() {
            var elements = [
                "checkout[shipping_address][company]",
                "checkout[shipping_address][address1]",
                "checkout[shipping_address][address2]",
                "checkout[shipping_address][city]",
                "checkout[shipping_address][country]",
                "checkout[shipping_address][zip]",
                "checkout[shipping_address][province]"
            ];

            elements.forEach(function(field){
                var element = document.getElementsByName(field);
                if(!element[1]) return false;
                element[0].value = element[1].value;
            })
        };

        window.HubBox.removeErrorMessages = function() {
            var fields = [
                "checkout_shipping_address_company",
                "checkout_shipping_address_address1",
                "checkout_shipping_address_address2",
                "checkout_shipping_address_city",
                "checkout_shipping_address_zip",
                "checkout_remember_me",
                "checkout_shipping_address_country",
                "checkout_shipping_address_province"
            ];

            fields.forEach(function (field) {
                var element = window.parent.document.getElementById(field);
                if (!element) return false;

                element.parentNode.parentNode.classList.remove('field--error');

            });
        }

        window.HubBox.hideFields = function() {
            /* Hide Fetchify only if Click & Collect is selected */
            if (sessionStorage.hubBox_cp) {
                console.log("HubBox - Hide Fetchify fields now we have C&C selected");
                var fieldsToHide = [
                    //Fetchify (formerly Crafty Clicks)
                    'shipping_cc_search_input',
                    '_cc_button_0'
                ];

                fieldsToHide.forEach(function (field) {
                    var element = window.parent.document.getElementById(field);
                    if (!element) return false;

                    element.setAttribute("disabled", true);
                    element.style.display = "none";
                });

            }
        }

        window.HubBox.disableFields = function() {
            var disable = [
                "checkout_shipping_address_company",
                "checkout_shipping_address_address1",
                "checkout_shipping_address_address2",
                "checkout_shipping_address_city",
                "checkout_shipping_address_zip",
                "checkout_remember_me",
                "checkout_shipping_address_country",
                "checkout_shipping_address_province"
            ];

            // Box styles
            var styles = "background: #eee; color: #333333; -webkit-text-fill-color: #333333";

            disable.forEach(function (field) {
                var element = window.parent.document.getElementById(field);
                if (!element) return false;

                if (field == "checkout_shipping_address_province") {
                    if (window.HubBox.collectPoint.address.county) {
                        var county = window.HubBox.collectPoint.address.county;
                        if (county != "") {
                            var queryCounty = '#checkout_shipping_address_province option[value="' + county + '"]';

                            if (document.querySelector(queryCounty) != null) {
                                document.querySelector(queryCounty).selected = true;
                            }
                        }
                    }
                }

                if (field == "checkout_shipping_address_country") {
                    if (window.HubBox.collectPoint.address.country) {
                        var country = window.HubBox.collectPoint.address.country;
                        if (country != "") {
                            var queryCountry = '#checkout_shipping_address_country option[data-code="' + country + '"]';

                            if (document.querySelector(queryCountry) != null) {
                                document.querySelector(queryCountry).selected = true;

                            }
                        } else {
                            console.log("HubBox - CP's Missing Country code");
                        }
                    }
                }

                if (field != "checkout_remember_me") {
                    element.setAttribute("disabled", true);
                    // stop autocomplete
                    element.setAttribute("autocomplete", "new-password");
                    element.setAttribute("style", styles);
                }

            });
        }

        window.HubBox.enableFields = function() {
            var fields = [
                "checkout_shipping_address_company",
                "checkout_shipping_address_address1",
                "checkout_shipping_address_address2",
                "checkout_shipping_address_city",
                "checkout_shipping_address_zip",
                "checkout_remember_me",
                "checkout_shipping_address_country",
                "checkout_shipping_address_province"
            ];

            // Box styles
            var styles = "background: #fff; color: #333333; -webkit-text-fill-color: none";

            fields.forEach(function (field) {
                var element = window.parent.document.getElementById(field);
                if (!element) return false;

                if (field != "checkout_remember_me") {
                    element.removeAttribute("disabled");
                    // stop autocomplete
                    element.removeAttribute("autocomplete");
                    element.setAttribute("style", styles);
                }

            });
        }

        window.HubBox.addValuesToElements = function(cp) {
            if (!cp) {
                cp = window.HubBox.collectPoint = JSON.parse(sessionStorage.hubBox_cp);
            }

            if (!cp) {
                return;
            }

            window.HubBox.removeErrorMessages();

            var settings = {
                selectors: {
                    launch: {
                        button: '#hubbox-button-and-info'
                    },
                    address: {
                        address1: '#checkout_shipping_address_address1',
                        address1name: 'checkout[shipping_address][address1]',
                        address2: '#checkout_shipping_address_address2',
                        address2name: 'checkout[shipping_address][address2]',
                        company: '#checkout_shipping_address_company',
                        companyname: 'checkout[shipping_address][company]',
                        city: '#checkout_shipping_address_city',
                        cityname: 'checkout[shipping_address][city]',
                        postCode: '#checkout_shipping_address_zip',
                        postCodename: 'checkout[shipping_address][zip]',
                        county: '#checkout_shipping_address_province',
                        countyname: 'checkout[shipping_address][province]',
                        country: '#checkout_shipping_address_country',
                        countryname: 'checkout[shipping_address][country]'
                    },
                    hiddenAttribute: {
                        name: "input[name='checkout[attributes[hubbox_collectpoint_id]]']",
                        injectionPoint: '.section--shipping-address h2.section__title'
                    }
                }
            }; 
            var i = settings.selectors.address;

            var hasCompanyEnabled = document.querySelector(i.company);
            switch(window.HubBox.theme.toLowerCase()) {
                case 'dpd':
                    var prefix = 'S2S' + cp.id;
                    if (hasCompanyEnabled) { //Company field exists
                        document.querySelectorAll('[name="'+i.companyname+'"]').forEach((elm) => {
                            elm.value = cp.name;
                            elm.setAttribute('value', elm.value);
                        });

                        document.querySelectorAll('[name="'+i.address1name+'"]').forEach((elm) => {
                            elm.value = prefix + ' ' + cp.address.street1;
                            elm.setAttribute('value', elm.value);
                        });

                        if (cp.address.street2 && cp.address.street2.length > 0) {
                            document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                elm.value = cp.address.street2;
                                elm.setAttribute('value', elm.value);
                            });
                            
                        } else {
                            document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                elm.value = '-';
                                elm.setAttribute('value', elm.value);
                            });
                            
                        }                        
                    } else { //No company field in checkout
                        document.querySelectorAll('[name="'+i.address1name+'"]').forEach((elm) => {
                            elm.value = prefix + ' ' + cp.name;
                            elm.setAttribute('value', elm.value);
                        });
                        
                        document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                            elm.value = cp.address.street1;
                            elm.setAttribute('value', elm.value);
                        });
                    }
                    
                    //Common fields
                    if (document.querySelector(i.province)) { //if Province enabled then US State Code used
                        document.querySelectorAll('[name="'+i.countyname+'"]').forEach((elm) => {
                            elm.value = getUSStateCode(cp.address.county);
                            elm.setAttribute('value', elm.value);
                        });
                    }

                    document.querySelectorAll('[name="'+i.cityname+'"]').forEach((elm) => {
                        elm.value = cp.address.city;
                        elm.setAttribute('value', elm.value);
                    });

                    document.querySelectorAll('[name="'+i.postCodename+'"]').forEach((elm) => {
                        elm.value = cp.address.postcode;
                        elm.setAttribute('value', elm.value);
                    });

                    document.querySelectorAll('[name="'+i.countryname+'"]').forEach((elm) => {
                        elm.value = cp.address.country;
                        elm.setAttribute('value', elm.value);
                    });
                    break;
                case 'ups':
                    if (window.HubBox.isD2REnabled) {
                        var prefix = ".D2R.";
                        var postfix = "";
                    } else {
                        var prefix = "";
                        var postfix = " Pickup";
                    }

                    if (hasCompanyEnabled) { //Company field exists
                        if (window.HubBox.isD2REnabled) { //Is D2R config enabled?
                            if (window.HubBox.D2RField && window.HubBox.D2RField.toLowerCase() == "address1") {

                                document.querySelectorAll('[name="'+i.companyname+'"]').forEach((elm) => {
                                    elm.value = cp.name;
                                    elm.setAttribute('value', elm.value);
                                });

                                document.querySelectorAll('[name="'+i.address1name+'"]').forEach((elm) => {
                                    elm.value = prefix + ' ' + cp.address.street1;
                                    elm.setAttribute('value', elm.value);
                                });

                                if (cp.address.street2 && cp.address.street2.length > 0) {
                                    document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                        elm.value = cp.address.street2;
                                        elm.setAttribute('value', elm.value);
                                    });
            
                                } else {
                                    document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                        elm.value = '-';
                                        elm.setAttribute('value', elm.value);
                                    });
                                }      
                            } else if (window.HubBox.D2RField && window.HubBox.D2RField.toLowerCase() == "company") {
                                document.querySelectorAll('[name="'+i.companyname+'"]').forEach((elm) => {
                                    elm.value = prefix + ' ' + cp.name;
                                    elm.setAttribute('value', elm.value);
                                });

                                document.querySelectorAll('[name="'+i.address1name+'"]').forEach((elm) => {
                                    elm.value = cp.address.street1;
                                    elm.setAttribute('value', elm.value);
                                });

                                if (cp.address.street2 && cp.address.street2.length > 0) {
                                    document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                        elm.value = cp.address.street2;
                                        elm.setAttribute('value', elm.value);
                                    });
            
                                } else {
                                    document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                        elm.value = '-';
                                        elm.setAttribute('value', elm.value);
                                    });
                                }      
                            } else if (window.HubBox.D2RField && window.HubBox.D2RField.toLowerCase() == "address2") {
                                document.querySelectorAll('[name="'+i.companyname+'"]').forEach((elm) => {
                                    elm.value = cp.name;
                                    elm.setAttribute('value', elm.value);
                                });

                                document.querySelectorAll('[name="'+i.address1name+'"]').forEach((elm) => {
                                    elm.value = cp.address.street1;
                                    elm.setAttribute('value', elm.value);
                                });

                                if (cp.address.street2 && cp.address.street2.length > 0) {
                                    document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                        elm.value = prefix + ' ' + cp.address.street2;
                                        elm.setAttribute('value', elm.value);
                                    });
            
                                } else {
                                    document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                        elm.value = '-';
                                        elm.setAttribute('value', elm.value);
                                    });
                                }      
                            }
                        } else {
                            //No D2R Config
                            document.querySelectorAll('[name="'+i.companyname+'"]').forEach((elm) => {
                                elm.value = cp.name;
                                elm.setAttribute('value', elm.value);
                            });

                            document.querySelectorAll('[name="'+i.address1name+'"]').forEach((elm) => {
                                elm.value = cp.address.street1 + ' ' + postfix;
                                elm.setAttribute('value', elm.value);
                            });

                            if (cp.address.street2 && cp.address.street2.length > 0) {
                                document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                    elm.value = cp.address.street2;
                                    elm.setAttribute('value', elm.value);
                                });
        
                            } else {
                                document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                    elm.value = '-';
                                    elm.setAttribute('value', elm.value);
                                });
                            }        
                        }
                                             
                    } else { //No company field in checkout
                        if (window.HubBox.isD2REnabled) { //Is D2R config enabled?
                            if (window.HubBox.D2RField && window.HubBox.D2RField.toLowerCase() == "address1") {
                                document.querySelectorAll('[name="'+i.address1name+'"]').forEach((elm) => {
                                    elm.value = prefix + ' ' + cp.address.street1;
                                    elm.setAttribute('value', elm.value);
                                });

                                if (cp.address.street2 && cp.address.street2.length > 0) {
                                    document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                        elm.value = cp.address.street2;
                                        elm.setAttribute('value', elm.value);
                                    });
            
                                } else {
                                    document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                        elm.value = '-';
                                        elm.setAttribute('value', elm.value);
                                    });
                                }      
                            } else if (window.HubBox.D2RField && window.HubBox.D2RField.toLowerCase() == "address2") {
                                document.querySelectorAll('[name="'+i.address1name+'"]').forEach((elm) => {
                                    elm.value = cp.address.street1;
                                    elm.setAttribute('value', elm.value);
                                });

                                if (cp.address.street2 && cp.address.street2.length > 0) {
                                    document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                        elm.value = prefix + ' ' + cp.address.street2;
                                        elm.setAttribute('value', elm.value);
                                    });
            
                                } else {
                                    document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                        elm.value = '-';
                                        elm.setAttribute('value', elm.value);
                                    });
                                }      
                            }
                        } else {
                            //No D2R Config - Default UPS
                            document.querySelectorAll('[name="'+i.address1name+'"]').forEach((elm) => {
                                elm.value = cp.address.street1 + ' ' + postfix;
                                elm.setAttribute('value', elm.value);
                            });

                            if (cp.address.street2 && cp.address.street2.length > 0) {
                                document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                    elm.value = cp.address.street2;
                                    elm.setAttribute('value', elm.value);
                                });
        
                            } else {
                                document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                    elm.value = '-';
                                    elm.setAttribute('value', elm.value);
                                });
                            }   
                        }
                    }
                    
                    //Common fields
                    if (document.querySelector(i.province)) { //if Province enabled then US State Code used
                        document.querySelectorAll('[name="'+i.countyname+'"]').forEach((elm) => {
                            elm.value = getUSStateCode(cp.address.county);
                            elm.setAttribute('value', elm.value);
                        });
                    }

                    document.querySelectorAll('[name="'+i.cityname+'"]').forEach((elm) => {
                        elm.value = cp.address.city;
                        elm.setAttribute('value', elm.value);
                    });

                    document.querySelectorAll('[name="'+i.postCodename+'"]').forEach((elm) => {
                        elm.value = cp.address.postcode;
                        elm.setAttribute('value', elm.value);
                    });

                    document.querySelectorAll('[name="'+i.countryname+'"]').forEach((elm) => {
                        elm.value = cp.address.country;
                        elm.setAttribute('value', elm.value);
                    });
                    break;
                default:
                    //HubBox (default)
                    var postfix = 'HubBox';
                    if (hasCompanyEnabled) { //Company field exists
                        document.querySelectorAll('[name="'+i.address1name+'"]').forEach((elm) => {
                            elm.value = cp.address.street1 + ' ' + postfix;
                            elm.setAttribute('value', elm.value);
                        });

                        document.querySelectorAll('[name="'+i.companyname+'"]').forEach((elm) => {
                            elm.value = cp.name;
                            elm.setAttribute('value', elm.value);
                        });

                        if (cp.address.street2 && cp.address.street2.length > 0) {
                            document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                elm.value = cp.address.street2;
                                elm.setAttribute('value', elm.value);
                            });
    
                        } else {
                            document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                                elm.value = '-';
                                elm.setAttribute('value', elm.value);
                            });
                        }                        
                    } else { //No company field in checkout
                        document.querySelectorAll('[name="'+i.address1name+'"]').forEach((elm) => {
                            elm.value = cp.name + ' ' + postfix;
                            elm.setAttribute('value', elm.value);
                        });

                        document.querySelectorAll('[name="'+i.address2name+'"]').forEach((elm) => {
                            elm.value = cp.address.street1;
                            elm.setAttribute('value', elm.value);
                        });
                    }
                    
                    //Common fields
                    if (document.querySelector(i.province)) { //if Province enabled then US State Code used
                        document.querySelectorAll('[name="'+i.countyname+'"]').forEach((elm) => {
                            elm.value = getUSStateCode(cp.address.county);
                            elm.setAttribute('value', elm.value);
                        });
                    }

                    document.querySelectorAll('[name="'+i.cityname+'"]').forEach((elm) => {
                        elm.value = cp.address.city;
                        elm.setAttribute('value', elm.value);
                    });

                    /* Private Collection point 
                    this.jQ(i.city).val(("[PCP]" !== e ? "[" + o + "] " : "") + t.address.city),
                    */

                    document.querySelectorAll('[name="'+i.postCodename+'"]').forEach((elm) => {
                        elm.value = cp.address.postcode;
                        elm.setAttribute('value', elm.value);
                    });

                    document.querySelectorAll('[name="'+i.countryname+'"]').forEach((elm) => {
                        elm.value = cp.address.country;
                        elm.setAttribute('value', elm.value);
                    });
                }


            //If any custom handling, it's here
            var elements = [
                "checkout[shipping_address][company]",
                "checkout[shipping_address][address1]",
                "checkout[shipping_address][address2]",
                "checkout[shipping_address][city]",
                "checkout[shipping_address][country]",
                "checkout[shipping_address][zip]",
                "checkout[shipping_address][province]"
            ];

            elements.forEach(function (field) {
                var element = document.querySelector('[name="'+ field + '"]');
                if (element) {
                    element.setAttribute("autocomplete", "new-password");

                    if (field == "checkout[shipping_address][province]") {
                        if (cp.address.county && cp.address.county != "") {
                            element.value = cp.address.county;
                        }
                    } else if (field == "checkout[shipping_address][country]") {
                        if (cp.address.country && cp.address.country != "") {
                            if (window.HubBox.$) {
                                if (window.HubBox.$.find('#checkout_shipping_address_country option[value="' + cp.address.country + '"]').length) {
                                    window.HubBox.$('#checkout_shipping_address_country').val(cp.address.country);
                                } else {
                                    window.HubBox.$('#checkout_shipping_address_country').val(getCountryNameFromCode(cp.address.country));
                                }
                            } else {
                                element.value = cp.address.country;
                            }
                        }
                    }
                }
            });

        }

        window.HubBox.lockFields = function() {
            if (!sessionStorage.hubBox_cp) {
                return false;
            }
            // keep it locked
            window.HubBox.checkoutEnhancementWatch = setInterval(function () {
                if (!document.querySelector('div.hubbox-checkout-confirmation-container')) {
                    console.log('HubBox - Locking Fields');

                    setHiddenFields();
                    addMoreInfo();
                    window.HubBox.addValuesToElements();
                    arrangeFields();
                    arrangeHiddenFields();

                    if (!window.HubBox.collectPoint) {
                        window.HubBox.collectPoint = JSON.parse(sessionStorage.hubBox_cp);
                        console.log({ "HubBox Retrieve Collection Point from session":
                            window.HubBox.collectPoint })
                    }

                    // disable autocomplete on hidden fields too
                    window.HubBox.disableFields();

                    var hide = [
                        // craft clicks https://craftyclicks.co.uk/
                        ".cc_address_search",
                        "#_cc_button_0", "#_cc_button_1", "#_cc_button_2",
                        '#checkout_shipping_address_id',
                        // postcoder web https://www.alliescomputing.com/
                        '.addresssearchcontainer'
                    ];

                    var customElem = document.getElementById("hubbox_custom_css_styles");
                    if (customElem) {
                        customElem.remove();
                    }

                    var divNode = document.createElement("div");
                    divNode.setAttribute("id", "hubbox_custom_css_styles");

                    var content = "";
                    hide.forEach(function (cssField) {
                        content += cssField + " { display: none!important; }";
                    });

                    divNode.innerHTML = "<br><style>" + content + "</style>";
                    document.body.appendChild(divNode);
                } else {
                    //window.HubBox.addValuesToElements();
                    //arrangeFields();
                    //arrangeHiddenFields();                
                }
            }, 100);
        }

        window.HubBox.emptyCheckoutFields = function() {
            var elements = [
                "checkout_shipping_address_company",
                "checkout_shipping_address_address1",
                "checkout_shipping_address_address2",
                "checkout_shipping_address_city",
                "checkout_shipping_address_zip",
                "checkout_shipping_address_country",
                "checkout_shipping_address_province"
            ];

            elements.forEach(function (field) {
                var element = document.getElementById(field);
                if (element && !element.isArray) {
                    element.setAttribute("autocomplete", "new-password");
                    element.value = '';
                } else if (element && element.isArray) {
                    element[0].setAttribute("autocomplete", "new-password");
                    element[0].value = '';
                }
                
            });
            console.log("HubBox - Remove CP's details from checkout fields");
        }

        // Set elements as disabled/readonly;
        window.HubBox.initCheckoutEnhancement = function() {

            console.log("Hub-box Checkout Enhancement v" + HUBBOX_VERSION);
            window.HubBox.checkoutEnhancementWatch = null;

            if (window.HubBox.detectInfoStepInCheckout()) {

                // allow language override
                if (window.hubBoxEnhanceLanguage && Object.keys(window.hubBoxEnhanceLanguage).length > 0) {
                    window.HubBox.enhanceLanguage = Checkout.$.extend(true, {}, window.HubBox.enhanceLanguage, window.hubBoxEnhanceLanguage);
                }
                if (detectHubBoxElement() || true) {

                    isCouponUsed();

                    if (detectShouldLockAddress() && hasBeenResetToHomeDelivery()) {

                        window.HubBox.lockFields();
						addSecondInfo();
                    } else {
                        console.log("Show Options - Local Pickup - Home Delivery");
                        console.log({ detectShouldLockAddress: detectShouldLockAddress() });
                        console.log({ hasBeenResetToHomeDelivery: hasBeenResetToHomeDelivery() });
                        addSecondInfo();

                        if (detectShouldLockAddress() && !hasBeenResetToHomeDelivery()) {
                            /** User has selected CP before, Shopify saved it but now selected Home Delivery 
                             * We should empty all fields.
                            */
                             window.HubBox.emptyCheckoutFields();
                        }
                        
                    }
                }

                // if we are on the thanks page, lets clear HubBox form session storage for edge cases where
                // we re-order on the same session and HubBox ends up being a bit too aggressive
                if (window.HubBox.detectThanks()) {
                    if (sessionStorage.hubBox_cp) {
                        sessionStorage.removeItem("hubBox_cp");
                    }
                }
            }
        };

        if (typeof(Checkout) !== 'undefined') {
            Checkout.$(document).trigger('hubBoxEnhancementLoaded');
        }

    })(window);

    window.HubBox.initCheckoutEnhancement();
});

/* Restore */
var HUBBOX_SANDBOX = "sandbox"
    , HUBBOX_PRODUCTION = "production"
    , HUBBOX_ENV = HUBBOX_PRODUCTION
    , APP_BASE_URL = "https://platform-app.hub-box.com"
    , HUBBOX_API_URL = "https://api.hub-box.com/v1"
    , HUBBOX_ASSETS_URL = "https://shopify-hubbox.s3.amazonaws.com/production/assets"
    , HUBBOX_CONFIG_URL = "https://shopify-hubbox.s3.amazonaws.com/production/configs"
    , PING_KEY = "5pUaPH99kb2Z5HoT3pfkwLFhe2VpPwYT";
function hubBoxBootWidget(t) {
    if ((t = void 0 !== t ? t : {}).clicked = void 0 !== t.clicked ? t.clicked : "",
        t.ajaxCartSelector = void 0 !== t.ajaxCartSelector ? t.ajaxCartSelector : "",
        t.submitButtonSelector = void 0 !== t.submitButtonSelector ? t.submitButtonSelector : "",
        t.onOpen = void 0 !== t.onOpen ? t.onOpen : function() {}
        ,
        t.onClose = void 0 !== t.onClose ? t.onClose : function() {}
        ,
    void 0 === window.HubBox.$ && !findJQueryForHubBox())
        return console.log("Oops, HubBox requires JQuery!"),
            !1;
    if (window.HubBox.widget)
        window.HubBox.widget.showInfo(),
            window.HubBox.widget.openWidget(),
            console.log("hubBox: widget already booted, just show.");
    else {
        if ("" === t.ajaxCartSelector) {
            var e = "hubbox-cart-form-tmp"
                , o = "hubbox-proceed-ajax-tmp"
                , i = document.createElement("form");
            i.method = "post",
                i.action = shopiBox.clearShippingAction(),
                i.style.display = "none",
                i.id = e;
            var n = document.createElement("input");
            n.type = "submit",
                n.id = o,
                i.appendChild(n),
                document.body.appendChild(i),
                t.ajaxCartSelector = "#" + e,
                t.submitButtonSelector = "#" + o,
                t.clicked = $(t.submitButtonSelector)
        }
        if ("" === t.clicked) {
            var s = "hubbox-ajax-hidden-tmp"
                , a = document.createElement("div");
            a.id = s,
                document.body.appendChild(a),
                t.clicked = $("#" + s)
        }
        $(window.HubBox.templates.hubbox_ajax_hidden).insertBefore(t.clicked),
            window.HubBox.showOnReady = !0;
        var r = {
            storeId: Shopify.shop,
            injectionPoint: "#hubbox_hidden_toggles",
            cartForm: $(t.ajaxCartSelector),
            cartFormSubmitButton: $(t.submitButtonSelector),
            callbacks: {
                widgetOpenCallback: t.onOpen,
                widgetClosedCallback: t.onClose
            }
        };
        shopiBox.init(r)
    }
    return !1
}
window.HubBox || (window.HubBox = {}),
window.HubBox.templates || (window.HubBox.templates = []),
window.HubBox.language || (window.HubBox.language = []),
    window.HubBox.showOnReady = !1,
    window.HubBox.callbacks = {
        collectPointSelectedCallback: function() {},
        collectPointUnselectedCallback: function() {},
        widgetOpenedCallback: function() {},
        widgetClosedCallback: function() {},
        collectPointRestoreCallback: function() {},
        queryCallback: function() {}
    };
var Zapiet = {
    Cart: {
        getUrlParams: function() {
            var t = {};
            if (void 0 !== window.HubBox.collectPoint && null !== window.HubBox.collectPoint) {
                var e = window.HubBox.collectPoint
                    , o = shopiBox.getAddressIdentifier(e);
                t = shopiBox.getCartParams(e, o)
            }
            return t
        }
    }
};
function isInt(t) {
    return "number" == typeof t && (!isNaN(t) && parseInt(Number(t)) == t && !isNaN(parseInt(t, 10)))
}
function hbGenerateUID() {
    var t = 46656 * Math.random() | 0
        , e = 46656 * Math.random() | 0;
    return (t = ("000" + t.toString(36)).slice(-3)) + (e = ("000" + e.toString(36)).slice(-3))
}
function getCountryString(t) {
    return lower = t.toLowerCase(),
        -1 !== lower.indexOf("states") ? "United States" : 0 === lower.trim().length ? "United Kingdom" : t
}
function getCountryNameFromCode(e) {
    var o = {
        GB: "United Kingdom",
        US: "United States",
        DE: "Germany",
        FR: "France",
        IT: "Italy",
        ES: "Spain",
        BE: "Belgium"
    }

    if (o.hasOwnProperty(e)) {
        return o[e];
    }
    
    return e;
}

function getCountryFromCounty(e) {
    var o = {
        England: "United Kingdom",
        London: "United Kingdom",
    }

    if (o.hasOwnProperty(e)) {
        return o[e];
    }
    
    return e;
}

function getUSStateCode(e) {
    var o = {
        AL: "Alabama",
        AK: "Alaska",
        AS: "American Samoa",
        AZ: "Arizona",
        AR: "Arkansas",
        CA: "California",
        CO: "Colorado",
        CT: "Connecticut",
        DE: "Delaware",
        DC: "District Of Columbia",
        FM: "Federated States Of Micronesia",
        FL: "Florida",
        GA: "Georgia",
        GU: "Guam",
        HI: "Hawaii",
        ID: "Idaho",
        IL: "Illinois",
        IN: "Indiana",
        IA: "Iowa",
        KS: "Kansas",
        KY: "Kentucky",
        LA: "Louisiana",
        ME: "Maine",
        MH: "Marshall Islands",
        MD: "Maryland",
        MA: "Massachusetts",
        MI: "Michigan",
        MN: "Minnesota",
        MS: "Mississippi",
        MO: "Missouri",
        MT: "Montana",
        NE: "Nebraska",
        NV: "Nevada",
        NH: "New Hampshire",
        NJ: "New Jersey",
        NM: "New Mexico",
        NY: "New York",
        NC: "North Carolina",
        ND: "North Dakota",
        MP: "Northern Mariana Islands",
        OH: "Ohio",
        OK: "Oklahoma",
        OR: "Oregon",
        PW: "Palau",
        PA: "Pennsylvania",
        PR: "Puerto Rico",
        RI: "Rhode Island",
        SC: "South Carolina",
        SD: "South Dakota",
        TN: "Tennessee",
        TX: "Texas",
        UT: "Utah",
        VT: "Vermont",
        VI: "Virgin Islands",
        VA: "Virginia",
        WA: "Washington",
        WV: "West Virginia",
        WI: "Wisconsin",
        WY: "Wyoming"
    }
        , t = Object.keys(o).filter(function(t) {
        return o[t] === e
    });
    return 0 < t.length ? t[0] : e
}
var findJQueryForHubBox = function() {
    return window.HubBox.$ = window.jQuery,
    window.HubBox.$ || void 0 !== window.Checkout && (window.HubBox.$ = Checkout.jQuery),
    void 0 !== window.HubBox.$
};

var findJQueryAnywhereForHubBox = function() {
    for (key in window) {
        if (!key.startsWith('jQuery')) continue;

        if (typeof window[key] !== 'undefined'){
            window.HubBox.$ = window[key];
            return window.HubBox.$;
        }
    }
    return false;
};
function CommonBox(t) {
    this.jQ = t,
        this.getMergedConfig = function(t) {
            var e = window.location.href
                , o = {}
                , i = document.createElement("a");
            i.href = e;
            for (var n = i.search.substring(1).split("&"), s = 0; s < n.length; s++) {
                var a = n[s].split("=");
                o[a[0]] = decodeURIComponent(a[1])
            }
            var r = this.jQ.extend(!0, {}, t, o);
            return window.HubBoxConfigs && 0 < Object.keys(window.HubBoxConfigs).length && (r = this.jQ.extend(!0, {}, r, window.HubBoxConfigs)),
                r
        }
        ,
        this.getAddressIdentifier = function(t) {
            if (window.HubBox.theme == "ups") {
                if (!window.HubBox.isD2REnabled) { //Preserve previous UPS logic before D2R
                    var e = " Pickup"
                    , o = this.settings.storeConfig.private_free_shipping ? "F]" : "]";
                } else {
                    var e = ".D2R.";
                }
            } else if (window.HubBox.theme == "dpd") {
                var e = " S2S" + t.id, o = this.settings.storeConfig.private_free_shipping ? "F]" : "]";
            } else {
                var e = " HubBox"
                    , o = this.settings.storeConfig.private_free_shipping ? "F]" : "]";
            }

            return "private" == t.meta.type.toLowerCase() && 
                    (e = t.meta.connect ? " [HBC" + o : " [PCP" + o), e
        }
        ,
        this.ping = function(t, e) {
            if (sessionStorage.hubBox_ping) {
                var o = JSON.parse(sessionStorage.hubBox_ping);
                if (t === o.cpid)
                    return e(o.guid)
            }
            var i = hbGenerateUID();
            sessionStorage.setItem("hubBox_ping", JSON.stringify({
                guid: i,
                cpid: t
            })),
                this.jQ.ajax({
                    url: APP_BASE_URL + "/ping?guid=" + i + "&cpid=" + t + "&key=" + PING_KEY,
                    dataType: 'text',
                    type: "GET",
                    complete: function() {
                        return e(i)
                    },
                    error: function(t, e, o) {
                        console.log(o)
                    }
                })
        }
        ,
        this.getConfig = function(t) {
            var e = "";
            return this.jQ.ajax({
                url: HUBBOX_CONFIG_URL + "/" + t + ".json",
                type: "GET",
                success: function(t) {
                    e = t
                },
                error: function(t, e, o) {
                    console.log(o)
                },
                async: !1
            }),
                e
        }
        ,
        this.collectPointSelectedHandler = function(e) {
            var o = this, i = o.settings.selectors, n = i.hiddenAttribute;
            
            window.HubBox.isClickAndCollect = !0, window.HubBox.collectPoint = e;

            var s = o.getAddressIdentifier(e);
            this.ping(e.id, function(t) {
                o.updateAddressForm(e, s, t),
                    o.hiddenAttributeExists(n.name) ? o.updateHiddenAttribute(e.id, n.name) : o.injectAttributeField(e.id, n.name, n.injectionPoint),
                    window.HubBox.initCheckoutEnhancement(),
                0 < o.jQ(i.launch.button).length && o.jQ(i.launch.button).hide()
            })
        }
        ,
        this.updateAddressForm = function(t, e, o) {
            var i = this.settings.selectors.address;
      		if (window.HubBox.theme && window.HubBox.theme == "dpd") {
        		!this.settings.storeConfig.hasOwnProperty("no_company") || 
                  !0 !== this.settings.storeConfig.no_company && 1 !== this.settings.storeConfig.no_company ? (this.jQ(i.company).val(t.name),
                  this.jQ(i.address1).val(e + ' ' + t.address.street1),
                  t.address.street2 && 0 < t.address.street2.trim().length ? this.jQ(i.address2).val(t.address.street2) : this.jQ(i.address2).val("-")) : (this.jQ(i.address1).val(e + ' ' + t.name),
                  this.jQ(i.address2).val(t.address.street1)),
                  this.jQ(i.city).val(t.address.city),
              this.jQ(i.province) && this.jQ(i.province).val(getUSStateCode(t.address.county)),
                  this.jQ(i.postCode).val(t.address.postcode),
                  this.jQ(i.country).val(getCountryString(t.address.country))
            }else if (window.HubBox.theme && window.HubBox.theme == "ups" && window.HubBox.isD2REnabled) { //D2R changes
                if (!this.settings.storeConfig.hasOwnProperty("no_company") || 
                  !0 !== this.settings.storeConfig.no_company && 
                  1 !== this.settings.storeConfig.no_company
                  ){ //Choose the field to add D2R prefix -- default fallback: address1
                    if (window.HubBox.D2RField && window.HubBox.D2RField.toLowerCase() == "address1") {
                        (this.jQ(i.company).val(t.name),
                        this.jQ(i.address1).val(e + ' ' + t.address.street1),
                        t.address.street2 && 0 < t.address.street2.trim().length ? this.jQ(i.address2).val(t.address.street2) : this.jQ(i.address2).val("-")) 
                    } else if (window.HubBox.D2RField && window.HubBox.D2RField.toLowerCase() == "company") {
                        (this.jQ(i.company).val(e + ' ' + t.name),
                        this.jQ(i.address1).val(t.address.street1),
                        t.address.street2 && 0 < t.address.street2.trim().length ? this.jQ(i.address2).val(t.address.street2) : this.jQ(i.address2).val("-")) 
                    } else if (window.HubBox.D2RField && window.HubBox.D2RField.toLowerCase() == "address2") {
                        (this.jQ(i.company).val(t.name),
                        this.jQ(i.address1).val(t.address.street1),
                        t.address.street2 && 0 < t.address.street2.trim().length ? this.jQ(i.address2).val(e + ' ' + t.address.street2) : this.jQ(i.address2).val(e)) 
                    } else {
                        //default: address1
                        (this.jQ(i.company).val(t.name),
                        this.jQ(i.address1).val(e + ' ' + t.address.street1),
                        t.address.street2 && 0 < t.address.street2.trim().length ? this.jQ(i.address2).val(t.address.street2) : this.jQ(i.address2).val("-")) 
                    }
                       
                } else {
                    (this.jQ(i.address1).val(e + ' ' + t.name),
                    this.jQ(i.address2).val(t.address.street1)),
                    this.jQ(i.city).val(t.address.city),
                    this.jQ(i.province) && this.jQ(i.province).val(getUSStateCode(t.address.county)),
                    this.jQ(i.postCode).val(t.address.postcode),
                    this.jQ(i.country).val(getCountryString(t.address.country))
                }
            } else {
                //HubBox
                if (!this.settings.storeConfig.hasOwnProperty("no_company") || 
                  !0 !== this.settings.storeConfig.no_company && 
                  1 !== this.settings.storeConfig.no_company
                  ){
                    this.jQ(i.company).val(t.name + e),
                    this.jQ(i.address1).val(t.address.street1);
                    if (t.address.street2 && 0 < t.address.street2.trim().length){
                         this.jQ(i.address2).val(t.address.street2) 
                    }else {
                        this.jQ(i.address2).val("-")
                    }
                } else {
                    (this.jQ(i.address1).val(t.name + e),
                    this.jQ(i.address2).val(t.address.street1)),
                    this.jQ(i.city).val(("[PCP]" !== e ? "[" + o + "] " : "") + t.address.city),
                    this.jQ(i.province) && this.jQ(i.province).val(getUSStateCode(t.address.county)),
                    this.jQ(i.postCode).val(t.address.postcode),
                    this.jQ(i.country).val(getCountryString(t.address.country))
                }
            }
            
        }
        ,
        this.injectAttributeField = function(t, e, o) {
            var i = document.createElement("input");
            i.setAttribute("type", "hidden"),
                i.setAttribute("name", e),
                i.setAttribute("autocomplete", "new-password"),
                i.setAttribute("value", t),
                this.jQ(i).insertBefore(o)
        }
        ,
        this.hiddenAttributeExists = function(t) {
            var e = this.jQ(t);
            return 0 < e.length && 0 < e.val().length
        }
        ,
        this.updateHiddenAttribute = function(t, e) {
            this.jQ(e).val(t)
        }
        ,
        this.clearShippingAction = function() {
            return "/cart?step=contact_information&" + 
                [
                    "checkout[shipping_address][company]=", 
                    "checkout[shipping_address][address1]=", 
                    "checkout[shipping_address][address2]=", 
                    "checkout[shipping_address][city]=", 
                    "checkout[shipping_address][zip]=", 
                    "checkout[shipping_address][country]=", 
                    "checkout[shipping_address][province]="
                ].join("&")
        }
}
if (!findJQueryForHubBox()) {
    console.log("HubBox - jQuery missing, loading alternative options");
    findJQueryAnywhereForHubBox();
}
var ShopiRestore = new CommonBox(window.HubBox.$);

CommonBox.prototype.settings = {
    storeId : '',
    storeConfig : {},
    selectors: {
        launch: {
            button: '#hubbox-button-and-info'
        },
        address: {
            address1: '#checkout_shipping_address_address1',
            address2: '#checkout_shipping_address_address2',
            company: '#checkout_shipping_address_company',
            city: '#checkout_shipping_address_city',
            postCode: '#checkout_shipping_address_zip',
            county: '#checkout_shipping_address_province',
            country: '#checkout_shipping_address_country'
        },
        hiddenAttribute: {
            name: "input[name='checkout[attributes[hubbox_collectpoint_id]]']",
            injectionPoint: '.section--shipping-address h2.section__title'
        }
    }
};

CommonBox.prototype.init = function(options) {
    this.settings = this.jQ.extend(true, this.settings, options);
    this.settings.storeConfig = this.getConfig(this.settings.storeId);

    // restore from session storage if we haven't already 'locked' down the form and detected already
    if (sessionStorage.hubBox_cp && window.HubBox.checkoutEnhancementWatch == null) {
        console.log('hubbox: restored address');
        var collectPoint = JSON.parse(sessionStorage.hubBox_cp);
        this.collectPointSelectedHandler(collectPoint);
    } else if (sessionStorage.hubBox_cp) {
        console.log('hubbox: user changed selected CP');
        var collectPoint = JSON.parse(sessionStorage.hubBox_cp);
        this.collectPointSelectedHandler(collectPoint);
    }

    window.HubBox.shopiBox = this;
};

if (typeof window.Checkout !== 'undefined') {
    if (!(window.HubBox.initCheckoutEnhancement)) {
        window.HubBox.$(document).bind('hubBoxEnhancementLoaded', function (e) {
            if (window.HubBox.detectInfoStepInCheckout()) {
                ShopiRestore.init({storeId: Shopify.Checkout.apiHost});
            }
        });
    } else {
        if (window.HubBox.detectInfoStepInCheckout()) {
            ShopiRestore.init({storeId: Shopify.Checkout.apiHost});
        }
    }
}