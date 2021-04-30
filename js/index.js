(function () {
  
  function isObject(obj) {

    return obj instanceof Object
      && obj.constructor === Object
      && obj !== null 
      && typeof obj === 'object' 
      && Array.isArray(obj) === false;

  } // end of isObject

  var getClassOfTargetEl = function (hash) {

    return '.' + hash.slice(1, hash.length) 

  }; // end of getClassOfTargetEl

  var getIdByHash = function (str) { return str.substring(str.search('#') + 1); }; // getIdByHash

  var scrollToTargetSection = function (params) {

    if (!isObject(params)) {
      
      return console.error('Given argument must be an object.');

    }

    if (!params.smoothScroller) {

      return console.error('The smoothScroller object is not found.');

    }

    if (!params.targetEl
        || !( params.targetEl instanceof HTMLElement ) ) {

      return console.error('Target node is not found.');

    }

    if (!params.toggleEl) {

      return console.error('Toggling node is not found.');

    }
    
    params.smoothScroller.animateScroll(params.targetEl, params.toggleEl, {
      speed: 300,
      easing: 'easeOutCubic'
    }); // end of params.smoothScroller.animateScroll

  }; // end of scrollToTargetSection

  var mainNavHandler = function (eventType, smoothScroller) {
    
    var header = document.querySelector('.header');
    var container = document.querySelector('.headerTop .container');
    var logo = container.querySelector('.logo');
    var headerInf = container.querySelector('.headerInf');
    var mainNav = document.querySelector('.headerDown');
    var mainNavItems = mainNav.querySelectorAll('li a');
    var menuIcon = document.querySelector('.header .menuIcon');
    var crossIconSrc = "images/header/cross.svg";
    var burgerIconSrc = "images/header/hamburger.svg";
    var menuIconImage = menuIcon.querySelector('img');

    var menuIconClickHandler = function () {      
      
      var menuSrcAttr = menuIconImage.getAttribute('src'); 
      var srcVal;

      mainNav.classList.toggle('invisible');
      header.classList.toggle('whited');
      logo.classList.toggle('transparented');
      headerInf.classList.toggle('transparented');
      
      if (menuSrcAttr.search('hamburger') !== -1) {

        srcVal = crossIconSrc;

      }
      else if (menuSrcAttr.search('cross') !== -1) {

        srcVal = burgerIconSrc;

      }

      menuIconImage.setAttribute('src', srcVal);

    };

    if (eventType == 'load') {

      menuIcon.addEventListener('click', menuIconClickHandler, false);

      mainNavItems.forEach(function(mainNavItem) {

        mainNavItem.addEventListener('click', function(e) {
          e.preventDefault();

          var classOfTargetSection = getClassOfTargetEl(mainNavItem.hash);

          var targetEl = document.querySelector(classOfTargetSection);

          scrollToTargetSection({
            smoothScroller: smoothScroller,
            targetEl: targetEl,
            toggleEl: mainNavItem
          });

        }, false);

      }); // end of mainNavItems.forEach      

    } // endif (eventType == 'load')


    if (window.innerWidth <= 900) {

      var callBackButton = document.querySelector('.headerTop .callBackButton');

      container.setAttribute('style', 'height: ' + window.getComputedStyle(container).height + 'px; ');

      mainNav.classList.add('invisible');

      if (callBackButton) {

        mainNav.append(callBackButton);

      }

    }

    if (window.innerWidth > 900) {

      var callBackButton = document.querySelector('.headerTop .callBackButton');

      mainNav.classList.remove('invisible');

      if (!callBackButton) {

        callBackButton = document.querySelector('.headerDown .callBackButton');
        container.append(callBackButton)

      }

      if (header.classList.contains('whited')) {

        header.classList.remove('whited');

      }

      if ( mainNav.classList.contains('invisible')) {

        mainNav.classList.remove('invisible');

      }

      if (logo.classList.contains('transparented')) {

        logo.classList.remove('transparented');

      }
      
      if (headerInf.classList.contains('transparented')) {

        headerInf.classList.remove('transparented');

      }
      
      else if (menuIconImage.getAttribute('src').search('cross') !== -1) {

        menuIconImage.setAttribute('src', burgerIconSrc);

      }

    }

  }; // end of mainNavHandler

  var callBackFormResetter = function (callBackForm) {
    
    // initializing variables
    var formMsg = callBackForm.querySelector('.msg'),
        nameEl = callBackForm.querySelector('.name'),
        phoneEl = callBackForm.querySelector('.phoneNumber');

    // processing data
        
    formMsg.innerHTML = '';

    nameEl.value = "";

    if (nameEl.classList.contains('err')) {
      nameEl.classList.remove('err');
    }

    phoneEl.value = "";

    if (phoneEl.classList.contains('err')) {
      phoneEl.classList.remove('err');
    }

  }; // end of callBackFormResetter

  var callBackFormButtonHandler = function (callBackForm, xhr, callBackModal) {

    var formValidate = function (nameEl, phoneNumberEl) {

      var typedName = nameEl.value,
          typedPhoneNumber = phoneNumberEl.value,
          actualPhoneNumber ='';
      
      var errors = {
        name: { 
          msg: [], 
          el: nameEl
        },        
        phoneNumber: { 
          msg: [],
          el: phoneNumberEl
        }
      }; // end of errors
      
      if ( typedName.length < 2 
          || typedName.length > 50
          || !isNaN( Number.parseFloat( typedName.replace(/^\D+|D+$/g, '') ) ) ) {
            
            errors.name.msg.push('Пожалуйста, введите действительное имя');

      } // endif ( typedName.length < 2...

      for (var i = 0; i < typedPhoneNumber.length; i++) {

        if (!isNaN(Number.parseInt(typedPhoneNumber[i]))) {

          // these additional operations are needed because of the phone number mask (Imask.js)
          // it goes through all substrings (items of a string)
          // and checks if it's a number or not
          // then collects all number substrings in one array to check its length further

          actualPhoneNumber += typedPhoneNumber[i];

        }

      } // endfor

      if (actualPhoneNumber.length != 11) {

        errors.phoneNumber.msg.push('Пожалуйста, введите действительный номер телефона');

      } // endif (actualPhoneNumber.length != 11)

      if (errors.name.msg.length > 0
          || errors.phoneNumber.msg.length > 0) {

        return errors;

      } // endif (errors.name.msg.length != 0)

      return false;

    }; // end of formValidate

    var updateMsgBox = function (msgBox, contentHTML, successful = false) {

      if (successful) {

        msgBox.classList.add('successful');

      }
      else {

        msgBox.classList.add('err');

      }
      
      msgBox.innerHTML = contentHTML;

    }; // end of updateMsgBox

    var showMsgBox = function (msgBox) {
      
      msgBox.style.display = 'block';

    } // end of showMsgBox

    var showSuccessfulMsg = function (msgBox, msg) {
      
      updateMsgBox(msgBox, msg);
      showMsgBox(msgBox);

    }; // end of showSuccessfulMsg

    var showErrorMsg = function (msgBox, err) {

      var contentHTML = '';
      
      var addErrMsg = function (msg) {

        if (contentHTML.length != 0) {

          msg = '<br>' + msg;

        }

        contentHTML += msg;        
 
      }; // end of addErrMsg
      
      var generateMsg = function (arrayOfMsgs) {
        
        var concatenated = '';
        
        arrayOfMsgs.forEach(function (singleMsg) {

          concatenated += singleMsg + '<br>';

        });
        
        return concatenated;
      
      }; // end of generateMsg
      
      switch (err.type) {

        case 'validation':

          if (err.data.name.msg.length != 0) {

            err.data.name.el.classList.add('err');
            addErrMsg( generateMsg(err.data.name.msg) );

          }
          else if (err.data.name.el.classList.contains('err')) {
            
            err.data.name.el.classList.remove('err');
          
          }

          if (err.data.phoneNumber.msg.length != 0) {
            
            err.data.phoneNumber.el.classList.add('err');
            addErrMsg( generateMsg(err.data.phoneNumber.msg) );
          
          }
          else if (err.data.phoneNumber.el.classList.contains('err')) {
            
            err.data.phoneNumber.el.classList.remove('err');
          
          }

        break; // end of case 'validation'
        
        case 'ajax':
          
          addErrMsg(err.data);

        break; // end of case 'ajax'

      } // end of switch (err.type)

      if (contentHTML.length != 0) {
        
        updateMsgBox(msgBox, contentHTML, false);
        showMsgBox(msgBox);
      
      } // endif (contentHTML.length != 0)

    }; // end of showErrorMsg

    var submitForm = function (callBackForm, xhr, msgBox) {

      // initializing variables
      var mailerScriptPath = callBackForm.getAttribute('action'),
          formFields = callBackForm.querySelectorAll('input'),
          formData = '',
          responseData;

      // setting ready state change handler
      xhr.onreadystatechange = function () {

        if (xhr.readyState === 4 && xhr.status === 200) {

          responseData = xhr.responseText;

        } // end if (xhr.readyState === 4 && xhr.status === 200)

      }; // end of xhr.onreadystatechange


      
      // opening a request
      // xhr.open('POST', mailerScriptPath);



      // setting request header
      // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');



      // preparing form data
      formFields.forEach(function(field, index) {

        if (index > 0) {

          formData += '&';

        }

        formData += field.getAttribute('name') + '=';
        formData += field.value;
      }); // end of formFields.forEach        

      // sending the form
      // xhr.send(formData);


      // $.ajax({
      //   type: "POST",
      //   url: $(sendingFormSelector).attr('action'),
      //   data: $(sendingFormSelector).serialize()
      // })

      // .done(function () {

      //   setTimeout(function () {

      //     $(sendingFormSelector).trigger("reset");
      //     showSuccessfulMsg(msgBox, 'Ваши данные успешно отправлены!');
        
      //   }, 500); // end of setTimeout

      // }) // end of .done

      // .fail(function () {
        
      //   showErrorMsg({
      //     type: 'ajax',
      //     data: 'Что-то пошло не так... Пожалуйста, попробуйте позднее.'
      //   }, false);
      
      // }); // end of .fail
      
      // return false;
    
    }; // end of submitForm


    /* ========== processing click event ========== */

    // initializing variables
    var msgBox = callBackForm.querySelector('.msg'),
        nameEl = callBackForm.querySelector('input.name'),
        phoneNumberEl = callBackForm.querySelector('input.phoneNumber');

    // validating the form

    var errors = formValidate(nameEl, phoneNumberEl);

    if (errors) {
          
      showErrorMsg(msgBox, {
        type: 'validation',
        data: errors
      });
    
    } // endif (errors)
    else {

      if (nameEl.classList.contains('err')) {
        
        nameEl.classList.remove('err');
      
      }

      if (phoneNumberEl.classList.contains('err')) {
        
        phoneNumberEl.classList.remove('err');
      
      }

      if (window.getComputedStyle(msgBox).display === 'block') {

        msgBox.style.display = 'none';
      
      }
      
      // sending form

      submitForm(callBackForm, xhr, msgBox);

      if (callBackModal) {
        callBackModal.close();
      }


    } // end of if (errors) { ... } else ...    

  }; // end of callBackFormButtonHandler

  var maskCallBackForm = function (callBackForm) {
    
    // initializing variables
    var phoneEl = callBackForm.querySelector('.phoneNumber'),
        nameEl = callBackForm.querySelector('.name');

    // getting mask options ready
    var nameMaskOptions = {
      mask: '[aaaaaaaaaaaaaaaaaaaa]',
      lazy: false
    };

    var phoneNumberMaskOptions = {
      mask: '+{\\7}(000) 000-00-00',
      lazy: false
    };    

    // return an object with form element masks
    return {
      nameMask: IMask(nameEl, nameMaskOptions),
      phoneNumberMask: IMask(phoneEl, phoneNumberMaskOptions)
    };

  }; // end of maskCallBackForm

  var callBackButtonHandler = function (xhr) {

    // initializing variables

    var callBackModal,
        callBackModalContent,
        callBackButtons = document.querySelectorAll('.callBackButton'),
        mailerScriptPath = 'mail.php',
        formSubject = 'Заявка на установку натяжного потолка',
        projectName = 'MASTERPOTOLOK.KZ',
        adminEmail = 'masterpotolok.kz@gmail.com',
        phoneNumberMask,
        nameMask;



    // preparing the content of the call back modal window

    callBackModalContent = '<h2>Проконсультироваться</h2>';
    callBackModalContent += '<form';
    callBackModalContent += ' class="callBackForm"';
    callBackModalContent += ' name="callBackForm"';
    callBackModalContent += ' action="' + mailerScriptPath +'">';
    callBackModalContent += '<input';
    callBackModalContent += ' type="hidden"';
    callBackModalContent += ' name="project_name"';
    callBackModalContent += ' value="' + projectName + '">';
    callBackModalContent += '<input';
    callBackModalContent += ' type="hidden"';
    callBackModalContent += ' name="admin_email"';
    callBackModalContent += ' value="' + adminEmail + '">';
    callBackModalContent += '<input';
    callBackModalContent += ' type="hidden"';
    callBackModalContent += ' name="form_subject"';
    callBackModalContent += ' value="' + formSubject + '">';
    callBackModalContent += '<input';
    callBackModalContent += ' class="name"';
    callBackModalContent += ' type="text"';
    callBackModalContent += ' name="Имя"';
    callBackModalContent += ' placeholder="Имя">';
    callBackModalContent += '<br>';
    callBackModalContent += '<input';
    callBackModalContent += ' class="phoneNumber"';
    callBackModalContent += ' type="tel"';
    callBackModalContent += ' name="Номер телефона"';
    callBackModalContent += ' placeholder="Номер телефона"';
    callBackModalContent += ' maxlength="18">';
    callBackModalContent += '<div class="msg"></div>';
    callBackModalContent += '</form>';



    // instanciate new modal

    callBackModal = new tingle.modal({
      footer: true,
      stickyFooter: false,
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Закрыть",
      cssClass: ['callBackModal', 'modal'],
      onOpen: function () {

        // here goes setting a mask for form fields
        var callBackForm = document.querySelector('.callBackModal .callBackForm');

        var callBackFormMask = maskCallBackForm(callBackForm);

        phoneNumberMask = callBackFormMask.phoneNumberMask;

        nameMask = callBackFormMask.nameMask;

      },
      onClose: function() {

        // here goes form resetting
        var callBackForm = document.querySelector('.callBackModal .callBackForm');

        callBackFormResetter(callBackForm);

        phoneNumberMask.destroy();
        nameMask.destroy();

      } // end of onClose

    }); // end of new tingle.modal



    // setting the content into the modal window
    
    callBackModal.setContent(callBackModalContent);


    
    // adding a button to send call back form

    callBackModal.addFooterBtn('Отправить', 'tingle-btn tingle-btn--primary button', function() {
      
      // here goes form validation and sending and the xhr object is needed
      var callBackForm = document.querySelector('.callBackModal .callBackForm');

      callBackFormButtonHandler(callBackForm, xhr, callBackModal);

    }); // end of modal.addFooterBtn('Отправить',...


    
    // adding event listeners for all call back buttons

    callBackButtons.forEach(function (callBackButton) {
      
      callBackButton.addEventListener('click', function () {
        
        callBackModal.open();

      }); // end of callBackButton.addEventListener('click',...
    
    }, false); // end of callBackButtons.forEach

  }; // end of callBackButtonHandler

  var getCostsOfServices = function (serveFor) {

    // defining constants
    var costByArea = 1500;
    
    // return costs depending on whom it serves for
    switch (serveFor) {
      case 'littleCalc':
        return {
          costByArea: costByArea
        };
      
      // end of case 'littleCalc'
    }
  }; // end of getCostsOfServices

  var litteCalcHandler = function (inputChanged, smoothScroller) {

    // initializing variables
    var areaInput = document.querySelector('.littleCalc input.areaOfCeiling'),
        areaAsText = document.querySelector('.littleCalc span.areaOfCeiling'),
        totalForPayment = document.querySelector('.littleCalc .totalAmount'),
        mainCalcLink = document.querySelector('.littleCalc .mainCalcLink'),
        costsOfServices = getCostsOfServices('littleCalc');

      var areaInputHandler = function () {

        // initializing variables
        var areaOfCeiling = areaAsText.textContent = Number.parseFloat(areaInput.value),
            costByArea = costsOfServices.costByArea;
        
        if (areaOfCeiling > 0) {
          
          // calculating the price
          var priceByArea = areaOfCeiling * costByArea;

          // showing the price on the fly
          totalForPayment.textContent = priceByArea;

        }
        else {
          
          // resetting the indicator
          totalForPayment.textContent = 0;
        
        }
  
      }; // end of areaInputHandler

      // setting an event listener to the area input
      areaInput.addEventListener('input', areaInputHandler, false);

      // dispatching the custom event which makes possible to show numbers on the fly
      areaInput.dispatchEvent(inputChanged);

      // setting an event listener to the link to the main calculator
      mainCalcLink.addEventListener('click', function (e) {

        e.preventDefault();
        
        // initializing variables
        var classOfMainCalc = getClassOfTargetEl(mainCalcLink.hash),  
            mainCalcEl = document.querySelector(classOfMainCalc);

        // invoking smoothscroller
        scrollToTargetSection({
          smoothScroller: smoothScroller,
          targetEl: mainCalcEl,
          toggleEl: mainCalcLink
        });
  
      }); // end of mainCalcLink.addEventListener('click'

  }; // end of litteCalcHandler

  var generalPricesSectionHandler = function () {
    
    // getting link to the modal window
    var forMoreLinkEl = document.querySelector('.generalPrices .forMoreLink a'),
        modalClass = getIdByHash(forMoreLinkEl.hash),
        pricesModal = new tingle.modal({
          footer: false,
          stickyFooter: false,
          closeMethods: ['overlay', 'button', 'escape'],
          closeLabel: "Закрыть",
          cssClass: [modalClass, 'modal']    
        }), // end of pricesModal        
        modalContent = '';
    
    // preparing the content of the modal window
    
    modalContent += '<h2>';
    modalContent += 'Дополнительные услуги';
    modalContent += '</h2>';
    modalContent += '<ul>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Монтаж крючковой люстры:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += 'от 1500 тенге (шт.)';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Установка планочной люстры:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += 'от 2000 тенге (шт.) (включая каркас)';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Установка крючков с тех. отверстием:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += 'от 500 тенге (шт.)';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Установка каркаса под планочную люстру:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += 'от 1000 тенге (шт.) (без монтажа люстры)';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Сборка люстр:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += 'от 3000 тенге (шт.)';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Установка спотов:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += 'от 1200 тенге (шт.)';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Разделительный багет:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += 'от 2000 тенге (п.м.)';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Маскирующая лента с монтажом (п.м.):';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += '2500 тенге';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Установка потолочной гардины на натяжной потолок (п.м.):';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += '2500 тенге';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Установка потолочной гардины на натяжной потолок (п.м.):';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += '1500 тенге';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Обвод трубы:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += 'от 2000 тенге (шт.)';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Монтаж пожарных датчиков:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += '500 тенге';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Установка вытяжки:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += 'от 2000 тенге (шт.)';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Дальность (за пределы г. Алматы, свыше 20км.):';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += 'от 3000 тенге';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Монтаж электропроводки (п.м.) с материалом заказчика:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += '500 тенге';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Повторный выезд в районе города:';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += '2000 тенге';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '<span class="field">';
    modalContent += 'Керамо-гранитная поверхность (п.м.):';
    modalContent += '</span>';
    modalContent += '<span class="value"> ';
    modalContent += '1500 тенге';
    modalContent += '</span>';
    modalContent += '</li>';
    modalContent += '</ul>';


    // setting the content into the modal window
    
    pricesModal.setContent(modalContent);

    forMoreLinkEl.addEventListener('click', function (e) {
      
      e.preventDefault();

      pricesModal.open();

      
    }, false); // end of forMoreLinkEl.onclick

  }; // end of generalPricesSectionHandler

  var ceilingTypesSectionHandler = function () {

    // initializing variables
    var targetCeilingTypeAsStr,
        ceilingTypesList = document.querySelectorAll('.ceilingTypes .ceilingTypeListItem'),
        ceilingTypeIllustrations = document.querySelectorAll('.ceilingTypes .ceilingTypeIllustration');

    ceilingTypesList.forEach(function (ceilingTypesListItem) {

      // setting an event listener for each list item
      ceilingTypesListItem.addEventListener('click', function (e) {

        e.preventDefault();
        e.stopPropagation();

        var clickedEl = e.target,
            clickedElTagName = e.target.tagName;

        // making sure that the clicked element is a list item
        if (clickedElTagName == 'A') {

          clickedEl = clickedEl.parentElement;

        } // endif (clickedElTagName == 'A')

        // adding a label that this list item is selected
        clickedEl.classList.add('selected');

        // going through the list again to unselect the previous one
        ceilingTypesList.forEach(function (ceilingTypesListItem) {

          if (ceilingTypesListItem.classList.contains("selected")) {

            if (ceilingTypesListItem !== clickedEl) {

              ceilingTypesListItem.classList.remove('selected');

            } // endif (ceilingTypesListItem !== clickedEl)

          } // endif (ceilingTypesListItem.classList.contains("selected"))

        }); // end of inner ceilingTypesList.forEach

        // getting the target ceiling type as a string
        targetCeilingTypeAsStr = getIdByHash(ceilingTypesListItem.querySelector('a').hash);

        // finding corresponding ceiling type illustration by targetCeilingTypeAsStr
        for (var i = 0; i < ceilingTypeIllustrations.length; i++) {

          // initializing temporary
          var ceilingTypeImage = ceilingTypeIllustrations[i].querySelector('.ceilingTypeImage'),
              ceilingTypeImageLocation = ceilingTypeImage.getAttribute('src');

          if (ceilingTypeImageLocation.search(targetCeilingTypeAsStr) != -1) {

            // adding a label that this illustration is selected
            ceilingTypeIllustrations[i].classList.add('selected');

            // unselect the previous ceiling type illustration
            ceilingTypeIllustrations.forEach(function(ceilingTypeIllustration) {
              if ( ceilingTypeIllustration != ceilingTypeIllustrations[i]
                   && ceilingTypeIllustration.classList.contains('selected') ) {
                    
                    ceilingTypeIllustration.classList.remove('selected');

              }
            }); // end of ceilingTypeIllustrations.forEach

          } // if (ceilingTypeImageLocation.search(targetCeilingTypeAsStr) != -1)

        } // endfor

      }, false); // end of  ceilingTypesListItem.addEventListener('click',...

    }); // end of outer ceilingTypesList.forEach

  }; // end of ceilingTypesSectionHandler

  var ceilingsCatalogHandler = function () {
    
    var CeilingCategoriesData = (function () {
      
      var Filter = (function () {

        function Filter(name, idName, selected, imageSet) {

          Object.defineProperty(this, 'name', {
            value: name
          });
          
          Object.defineProperty(this, 'idName', {
            value: idName
          });
          
          Object.defineProperty(this, 'selected', {
            value: selected
          });
          
          Object.defineProperty(this, 'imageSet', {
            value: imageSet
          });

        }

        return Filter;

      })();
      
      var Category = (function () {

        var _content;
        
        function Category(name, idName, selected, content) {

          if (Array.isArray(content) && content.length) {

            Object.defineProperty(this, 'name', {
              value: name
            });
            
            Object.defineProperty(this, 'idName', {
              value: idName
            });
            
            Object.defineProperty(this, 'selected', {
              value: selected
            });
            
            if (typeof content[0] == "string") {

              _content = {
                type: 'imageSet',
                itself: content
              };
            
            }

            if (typeof content[0] == 'object' && content[0] instanceof Object) {

              _content = {
                type: 'filters',
                itself: content
              };

            }

            Object.defineProperty(this, 'content', {
              value: _content
            });

          }// endif (Array.isArray(content) && content.length)
          else {
            
            console.error( new TypeError('invalid type has been specified') );
          
          }
        } // end of Category constructor

        return Category;

      })(); // end of Category wrapper
      
      var imageSet = [
        "./images/ceiling_catalog/by_facturer/by_satin/1.jpg",
        "./images/ceiling_catalog/by_facturer/by_satin/2.jpg",
        "./images/ceiling_catalog/by_facturer/by_satin/3.jpg",
        "./images/ceiling_catalog/by_facturer/by_matt/1.jpg",
        "./images/ceiling_catalog/by_facturer/by_matt/2.jpg",
        "./images/ceiling_catalog/by_facturer/by_matt/3.jpg",
        "./images/ceiling_catalog/by_facturer/by_glossy/1.jpg",
        "./images/ceiling_catalog/by_facturer/by_glossy/2.jpg",
        "./images/ceiling_catalog/by_facturer/by_glossy/3.jpg",
        "./images/ceiling_catalog/by_material/pvc/1.jpg",
        "./images/ceiling_catalog/by_material/pvc/2.jpg",
        "./images/ceiling_catalog/by_material/pvc/3.jpg",
        "./images/ceiling_catalog/by_material/tissular/1.jpg",
        "./images/ceiling_catalog/by_material/tissular/2.jpg",
        "./images/ceiling_catalog/by_material/tissular/3.jpg",
        "./images/ceiling_catalog/by_housing/for_hallway/1.jpg",
        "./images/ceiling_catalog/by_housing/for_hallway/2.jpg",
        "./images/ceiling_catalog/by_housing/for_hallway/3.jpg",
        "./images/ceiling_catalog/by_housing/for_bedroom/1.jpg",
        "./images/ceiling_catalog/by_housing/for_bedroom/2.jpg",
        "./images/ceiling_catalog/by_housing/for_bedroom/3.jpg",
        "./images/ceiling_catalog/by_housing/for_livingroom/1.jpg",
        "./images/ceiling_catalog/by_housing/for_livingroom/2.jpg",
        "./images/ceiling_catalog/by_housing/for_livingroom/3.jpg",
        "./images/ceiling_catalog/by_housing/for_bathroom/1.jpg",
        "./images/ceiling_catalog/by_housing/for_bathroom/2.jpg",
        "./images/ceiling_catalog/by_housing/for_bathroom/3.jpg",
        "./images/ceiling_catalog/by_housing/for_toilet/1.jpg",
        "./images/ceiling_catalog/by_housing/for_toilet/2.jpg",
        "./images/ceiling_catalog/by_housing/for_toilet/3.jpg",
        "./images/ceiling_catalog/by_housing/for_guestroom/1.jpg",
        "./images/ceiling_catalog/by_housing/for_guestroom/2.jpg",
        "./images/ceiling_catalog/by_housing/for_guestroom/3.jpg",
        "./images/ceiling_catalog/by_housing/for_kitchen/1.jpg",
        "./images/ceiling_catalog/by_housing/for_kitchen/2.jpg",
        "./images/ceiling_catalog/by_housing/for_kitchen/3.jpg",
        "./images/ceiling_catalog/by_housing/for_kidsroom/1.jpg",
        "./images/ceiling_catalog/by_housing/for_kidsroom/2.jpg",
        "./images/ceiling_catalog/by_housing/for_kidsroom/3.jpg",
        "./images/ceiling_catalog/by_housing/for_balcony/1.jpg",
        "./images/ceiling_catalog/by_housing/for_balcony/2.jpg",
        "./images/ceiling_catalog/by_housing/for_balcony/3.jpg",
        "./images/ceiling_catalog/by_housing/for_loggia/1.jpg",
        "./images/ceiling_catalog/by_housing/for_loggia/2.jpg",
        "./images/ceiling_catalog/by_housing/for_loggia/3.jpg",
        "./images/ceiling_catalog/by_housing/for_attic/1.jpg",
        "./images/ceiling_catalog/by_housing/for_attic/2.jpg",
        "./images/ceiling_catalog/by_housing/for_attic/3.jpg",
        "./images/ceiling_catalog/by_housing/for_corridor/1.jpg",
        "./images/ceiling_catalog/by_housing/for_corridor/2.jpg",
        "./images/ceiling_catalog/by_housing/for_corridor/3.jpg",
        "./images/ceiling_catalog/business_center/1.jpg",
        "./images/ceiling_catalog/business_center/2.jpg",
        "./images/ceiling_catalog/business_center/3.jpg",
        "./images/ceiling_catalog/office/1.jpg",
        "./images/ceiling_catalog/office/2.jpg",
        "./images/ceiling_catalog/office/3.jpg"
      ];
      
      function CeilingCategoriesData() {
        
        Object.defineProperty(this, 'categories', {
          get: function () {
            
            var categories = [];
            
            categories.push(
              
              new Category( 'По фактуре', 'byFacture', false, [
                
                new Filter('сатиновые', 'bySatin', false, [
                  
                  imageSet[0],
                  imageSet[1],
                  imageSet[2]
                
                ]),
                
                new Filter('матовые', 'byMatt', true, [
                  
                  imageSet[3],
                  
                  imageSet[4],
                  
                  imageSet[5]
                
                ]),
                
                new Filter('глянцевые', 'byGlossy', false, [
                  
                  imageSet[6],
                  
                  imageSet[7],
                  
                  imageSet[8]
                
                ])
              
              ]) // end of new Category( 'По фактуре',...
              
            ); // end of categories.push
            
            categories.push(
              
              new Category('По материалу', 'byMaterial', false, [
                
                new Filter('ПВХ', 'byPVC', false, [
                  
                  imageSet[9],
                  
                  imageSet[10],
                  
                  imageSet[11]
                
                ]),
                
                new Filter('тканевые', 'byTissular', true, [
                  
                  imageSet[12],
                  
                  imageSet[13],
                  
                  imageSet[14]
                
                ])
              
              ]) // end of new Category('По материалу',...
            
            ); // end of categories.push
            
            categories.push(
              
              new Category('Жилой комплекс', 'byHousingСomplex', true, [
                
                new Filter('в прихожую', 'forHallway', false, [
                  
                  imageSet[15],
                  
                  imageSet[16],
                  
                  imageSet[17]
                
                ]),
                
                new Filter('в спальню', 'forBedroom', false, [
                  
                  imageSet[18],
                  
                  imageSet[19],
                  
                  imageSet[20]
                
                ]),
                
                new Filter('в зал', 'forLivingroom', false, [
                  
                  imageSet[21],
                  
                  imageSet[22],
                  
                  imageSet[23]
                
                ]),
                
                new Filter('в ванную комнату', 'forBathroom', false, [
                  
                  imageSet[24],
                  
                  imageSet[25],
                  
                  imageSet[26]
                
                ]),
                
                new Filter('в туалет', 'forToilet', false, [
                  
                  imageSet[27],
                  
                  imageSet[28],
                  
                  imageSet[29]
                
                ]),
                
                new Filter('в гостиную', 'forGuestroom', true, [
                  
                  imageSet[30],
                  
                  imageSet[31],
                  
                  imageSet[32]

                ]),
                
                new Filter('на кухню', 'forKitchen', false, [
                  
                  imageSet[33],
                  
                  imageSet[34],
                  
                  imageSet[35]
                
                ]),
                
                new Filter('в детскую', 'forKidsroom', false, [
                  
                  imageSet[36],
                  
                  imageSet[37],
                  
                  imageSet[38]
                
                ]),
                
                new Filter('на балкон', 'forBalcony', false, [
                  
                  imageSet[39],
                  
                  imageSet[40],
                  
                  imageSet[41]
                
                ]),
                
                new Filter('на лоджию', 'forLoggia', false, [
                  
                  imageSet[42],
                  
                  imageSet[43],
                  
                  imageSet[44]
                
                ]),
                
                new Filter('на мансарду', 'forAttic', false, [
                  
                  imageSet[45],
                  
                  imageSet[46],
                  
                  imageSet[47]
                
                ]),
                
                new Filter('в коридор', 'forCorridor', false, [
                  
                  imageSet[48],
                  
                  imageSet[49],
                  
                  imageSet[50]
                
                ])
              
              ]) // end of new Category('Жилой комплекс',...

            ); // end of categories.push
            
            categories.push(
              
              new Category('Бизнес-центры', 'byBusinessCenter', false, [
                
                imageSet[51],
                
                imageSet[52],
                
                imageSet[53]

              ]) // end of new Category('Бизнес-центры',...

            ); // end of categories.push
            
            categories.push(

              new Category('Офисы', 'byOffice', false, [
                
                imageSet[54],
                
                imageSet[55],
                
                imageSet[56]
              
              ]) // end of new Category('Офисы',...
              
            ); // end of categories.push
            
            return categories;

          } // end of categories' getter
        
        }); // end of Object.defineProperty(this, 'categories',...

      } // end of CeilingCategoriesData's constructor
      
      return CeilingCategoriesData;

    })(); // end of CeilingCategoriesData's wrapper
    
    var CategoryInf = (function () {

      var ceilingCategoryInfEl = document.createElement('div');
      
      ceilingCategoryInfEl.classList.add('categoryInf');
      
      function CategoryInf() {
        
        Object.defineProperty(this, 'element', {
          
          get: function () {
            
            return ceilingCategoryInfEl;

          }
        
        }); // end of element
        
        this.append = function (childNode) {
          
          ceilingCategoryInfEl.append(childNode);
        
        } // enf of append

      } // end of CategoryInf's constructor

      return CategoryInf;

    })(); // end of CategoryInf's wrapper
    
    var FiltersNav = (function () {

      function FiltersNav(
        filters, 
        categoryIdName, 
        categoryInfEl, 
        displayedImageGallery, 
        arrayChanged) {

        var filterNavEl = document.createElement('nav');

        filterNavEl.classList.add('filterNav');

        var filtersEl = document.createElement('ul');
        
        filtersEl.classList.add('filterList'); 
        
        filtersEl.classList.add(categoryIdName);

        filterNavEl.append(filtersEl);
        
        filters.forEach(function (filter) {

          var filterEl = document.createElement('li');

          filterEl.classList.add('filterListItem');
          
          var filterAnchorEl = document.createElement('a');

          filterAnchorEl.classList.add('filterLink');
          
          filterAnchorEl.setAttribute('href', '#' + filter.idName); 
          
          var filterTextNode = document.createTextNode(filter.name); 
          
          filterAnchorEl.append(filterTextNode); 
          
          filterEl.append(filterAnchorEl); 
          
          filterEl.addEventListener('click', function (e) {

            e.preventDefault(); 
            
            if (this.tagName == 'LI') {

              var activeCeilingByPlaceEl = this; 
              
              activeCeilingByPlaceEl.classList.add('selected'); 
              
              this.parentElement
              .querySelectorAll('li')
              .forEach(function (anotherFilterEl) { 
                
                if (anotherFilterEl 
                  !== activeCeilingByPlaceEl 
                  && anotherFilterEl.classList.contains('selected')) { 
                    
                    anotherFilterEl.classList.remove('selected') 
                  
                } // endif

              }); // endforEach
              
              var targetImageGalleryClass = activeCeilingByPlaceEl.querySelector('a').getAttribute('href'); 
              
              var hashIndex = targetImageGalleryClass.search('#'); 
              
              targetImageGalleryClass = targetImageGalleryClass.substring(hashIndex + 1); 
              
              if (!(categoryInfEl.querySelector('.' + targetImageGalleryClass))) {

                categoryInfEl.childNodes.forEach(function (childNode) {

                  if (childNode.classList.contains('imageGallery')) {

                    var classListAsString = childNode.className; 
                    
                    var indexOfBy = classListAsString.search('by'); 
                    
                    if (indexOfBy == -1) { 
                      
                      var indexOfFor = classListAsString.search('for'); 
                      
                      var targetClass = classListAsString.substring(indexOfFor);
                      
                    }// endif (indexOfBy == -1)

                    else {
                      
                      var targetClass = classListAsString.substring(indexOfBy);
                    
                    }

                    var indexOfWhiteSpace = targetClass.search(" ");
                    
                    if (indexOfWhiteSpace != -1) {
                      
                      targetClass = targetClass.substring(indexOfWhiteSpace);
                    
                    } // endif (indexOfWhiteSpace != -1)

                    categoryInfEl.querySelector('.imageGallery.' + targetClass).remove();
                    
                    if (displayedImageGallery) {
                      
                      displayedImageGallery.removeEventListeners();
                      
                      Object.keys(displayedImageGallery).forEach(function (key) {
                        
                        delete displayedImageGallery[key];
                      
                      }); // endforEach
                      
                      displayedImageGallery = undefined;
                    
                    } // endif (displayedImageGallery)

                  } // endif (childNode.classList.contains('imageGallery'))
                  
                }); // end of categoryInfEl.childNodes.forEach
                
                displayedImageGallery = new ImageGallery(filter.imageSet, arrayChanged, filter.idName);
                
                displayedImageGallery.addEventListeners();
                
                categoryInfEl.append(displayedImageGallery.element);

              } // endif (!(categoryInfEl.querySelector('.' + targetImageGalleryClass)))

            } // endif (this.tagName == 'LI') {

          }, false); // end of filterEl.onclick
          
          if (filter.selected) {
            
            filterEl.classList.add('selected');
          
          } // endif (filter.selected)

          filtersEl.append(filterEl);

        }); // end of filters.forEach
        
        Object.defineProperty(this, 'element', {
          
          get: function () {

            return filterNavEl;

          }

        }); // end of element

      } // end ofFiltersNav's constructor

      return FiltersNav;

    })(); // end of FiltersNav's wrapper
    
    var ImageGallery = (function () {

      function ImageGallery(imageSet, arrayChanged, categoryIdName) {

        if (arrayChanged === undefined) {
          
          console.error(new ReferenceError('the second argument is not specified'));
        
        }

        if (arrayChanged instanceof Event && arrayChanged.type == 'arrayChanged') {

          var CeilingImage = (function () {

            function CeilingImage(imagePath) {

              var imageEl = document.createElement('img');
              
              imageEl.setAttribute('alt', 'Иллюстрация потолка');
              
              imageEl.setAttribute('src', imagePath);
              
              Object.defineProperty(this, 'element', {
                
                get: function () {
                  
                  return imageEl;
                
                } // end of element's getter
              
              }); // end of element
              
              Object.defineProperty(this, 'clickHandler', {

                get: function () {

                  return function (e) {

                    e.preventDefault();

                  }
                }
              }); // end of clickHandler

            } // end of CeilingImage's constructor

            return CeilingImage;

          })(); // end of CeilingImage's wrapper
          
          var CeilingIllustration = (function () {

            var ceilingIllustrationEl = document.createElement('figure');
            
            ceilingIllustrationEl.classList.add('imageGalleryIllustration');
            
            var mainImageContainer = document.createElement('figure');
            
            mainImageContainer.classList.add('mainImageContainer');
            
            var secondaryImagesContainer = document.createElement('div');
            
            secondaryImagesContainer.classList.add('secondaryImagesContainer');
            
            var imageEls = [],
                ceilingImages = [];
                
            function CeilingIllustration(imageSet) {

              imageSet.forEach(function (imagePath) {
                
                var ceilingImage = new CeilingImage(imagePath);
                
                var imageEl = ceilingImage.element;
                
                ceilingImages.push(ceilingImage);
                
                imageEls.push(imageEl);
              
              }); // end of imageSet.forEach
              
              // adding an appropriate class to the main image element
              imageEls[0].classList.add('mainImage');

              mainImageContainer.append(imageEls[0]);
              
              ceilingIllustrationEl.append(mainImageContainer);
              
              for (var i = 1; i < imageEls.length; i++) {
                
                var secondaryImageContainer = document.createElement('figure');
                
                secondaryImageContainer.classList.add('secondaryImageContainer');
                
                // adding an appropriate class to the secondary image element
                imageEls[i].classList.add('secondaryImage');
                
                secondaryImageContainer.append(imageEls[i]);
                
                secondaryImagesContainer.append(secondaryImageContainer);
              
              } // endfor

              ceilingIllustrationEl.append(secondaryImagesContainer);
              
              Object.defineProperty(this, 'element', {
                
                get: function () {
                  
                  return ceilingIllustrationEl;
                
                } // end of element's getter
              
              }); // end of element
              
              Object.defineProperty(this, 'imageEls', {
                
                get: function () {
                  
                  return imageEls;
                
                } // end of imageEls' getter
              
              }); // end of imageEls
              
              Object.defineProperty(this, 'ceilingImages', {
                
                get: function () {
                  
                  return ceilingImages;
                
                } // end of ceilingImages' getter
              
              }); // end of ceilingImages
              
              Object.defineProperty(this, 'arrayChangedHandler', {
                
                get: function () {
                  
                  return function () {
                    
                    mainImageContainer.append(imageEls[0]);
                    
                    secondaryImagesContainer.querySelector('.secondaryImageContainer:last-of-type')
                      .append(imageEls[imageEls.length - 1]);
                      
                    var secondaryImageContainers = secondaryImagesContainer.querySelectorAll('.secondaryImageContainer');
                    
                    for (var i = 1, j = 0; i < imageEls.length - 1; i++, j++) {
                      
                      secondaryImageContainers[j].append(imageEls[i]);
                    
                    } // endfor
                  
                  };
                
                } // end of arrayChangedHandler's getter
              
              }); // end of arrayChangedHandler

            }; // end of CeilingIllustration's constructor
            
            return CeilingIllustration;

          })(); // end of CeilingIllustration's wrapper
          
          var CeilingIllustrationController = (function () {

            var controllersContainer = document.createElement('div');
            
            controllersContainer.classList.add('controllersContainer');
            
            var DirectionController = (function () {

              var directionControllersContainer = document.createElement('div');
              
              directionControllersContainer.classList.add('directionControllersContainer');
              
              var prevEl = document.createElement('a');

              prevEl.classList.add('directionController');
              
              prevEl.classList.add('prev');
              
              prevEl.setAttribute('href', '#');
              
              // prevEl.append(document.createTextNode('prev'));
              
              directionControllersContainer.append(prevEl);
              
              var nextEl = document.createElement('a');

              nextEl.classList.add('directionController');
              
              nextEl.classList.add('next');
              
              nextEl.setAttribute('href', '#');
              
              // nextEl.append(document.createTextNode('next'));
              
              directionControllersContainer.append(nextEl);
              
              function DirectionController(imageEls, arrayChanged) {

                Object.defineProperty(this, 'element', {
                  
                  get: function () {
                    
                    return directionControllersContainer;
                  
                  } // end of element's getter
                
                }); // end of element
                
                Object.defineProperty(this, 'children', {
                  
                  get: function () {
                    
                    return {

                      'prevEl': prevEl,
                      
                      'nextEl': nextEl
                    
                    };
                  
                  } // end of children's getter
                
                }); // end of children
                
                Object.defineProperty(this, 'clickHandler', {

                  get: function () {

                    return function (e) {

                      e.preventDefault();
                      
                      var pagerEl = e.target.parentElement.parentElement.querySelector('.pager');

                      if (e.target.classList.contains('prev')) {

                        var pagerItems = pagerEl.querySelectorAll('a');
                          
                        if ( pagerItems[0].classList.contains('selected') ) {
                          
                          pagerItems[pagerItems.length - 1].classList.add('selected');
                          
                          pagerItems[0].classList.remove('selected');
                        
                        } // endif ( pagerItems[0].classList.contains('selected') )

                        else {
                        
                          for (var i = 0; i < pagerItems.length; i++) {
                          
                            if ( pagerItems[i].classList.contains('selected') ) {
                            
                              pagerItems[i - 1].classList.add('selected');
                            
                              pagerItems[i].classList.remove('selected');
                          
                            } // endif ( pagerItems[i].classList.contains('selected') )
                        
                          } // endfor
                      
                        } // endelse

                        imageEls.push(imageEls.shift());
                      
                        ceilingIllustrationEl.dispatchEvent(arrayChanged);

                      }

                      else if (e.target.classList.contains('next')) {
                        var prevActivePagerItem = pagerEl.querySelector('.selected');
                        
                        var nextPagerItem = prevActivePagerItem.nextSibling;
                      
                        if (!nextPagerItem) {
                        
                          nextPagerItem = pagerEl.querySelector('a');
                      
                        } // endif (!nextPagerItem)

                        nextPagerItem.classList.add('selected');
                      
                        prevActivePagerItem.classList.remove('selected');
                      
                        // main logic of the pager
                        imageEls.unshift(imageEls.pop());
                      
                        ceilingIllustrationEl.dispatchEvent(arrayChanged);

                      }

                    };
                  
                  } // end of clickHandler's getter

                }); // end of clickHandler

              } // end of DirectionController's constructor

              return DirectionController;

            })(); // end of DirectionController's wrapper
            
            var ImageGalleryPager = (function () {

              var pagerEl = document.createElement('div');
              
              pagerEl.classList.add('pager');
              
              function ImageGalleryPager(imageEls, arrayChanged) {

                var initialImageEls = imageEls.slice();
                
                for (var i = 0; i < imageEls.length; i++) {

                  var pagerItem = document.createElement('a');
                  
                  pagerItem.classList.add('pagerItem');
                  
                  pagerItem.setAttribute('href', '#');
                  
                  if (i == 0) {
                    
                    pagerItem.classList.add('selected');
                  
                  } // endif (i == 0)

                  // pagerItem.append(document.createTextNode(i));
                  
                  pagerEl.append(pagerItem);

                } // endfor

                Object.defineProperty(this, 'element', {
                  
                  get: function () {
                    
                    return pagerEl;
                  
                  } // end of element's getter
                
                }); // end of element
                
                Object.defineProperty(this, 'clickHandler', {

                  get: function () {

                    return function (e) {

                      e.preventDefault();

                      var mainImageIndex = 0;

                      for (var i = 0; i <= e.target.parentElement.childNodes.length; i++) {

                        if (e.target.parentElement.childNodes[i] === e.target) {

                          mainImageIndex = i;

                        }

                      }
                      
                      var initialLengthOfimageEls = initialImageEls.length;
                      
                      if (mainImageIndex == 0) {

                        for (var i = 0; i < initialLengthOfimageEls; i++) {

                          // main logic of the pager
                          imageEls.pop();
                        
                        } // endfor

                        for (var i = 0; i < initialLengthOfimageEls; i++) {
                          
                          // main logic of the pager
                          imageEls.push(initialImageEls[i]);
                        
                        } // endfor

                      } // endif (mainImageIndex == 0)

                      else {

                        var tempFirstPartOfImageEls = initialImageEls.slice(initialImageEls.length - mainImageIndex);
                        
                        var diff = initialImageEls.length - tempFirstPartOfImageEls.length;
                        
                        var tempSecondPartOfImageEls = initialImageEls.slice(0, diff);
                        
                        for (var i = 0; i < initialLengthOfimageEls; i++) {
                          
                          // main logic of the pager
                          imageEls.pop();
                        
                        } // endfor

                        if (tempFirstPartOfImageEls) {
                          
                          tempFirstPartOfImageEls.forEach(function (imageOfFirstPart) {
                            
                            // main logic of the pager
                            imageEls.push(imageOfFirstPart);
                          
                          }); // end of tempFirstPartOfImageEls.forEach
                        
                        } // endif (tempFirstPartOfImageEls)

                        if (tempSecondPartOfImageEls) {
                          
                          tempSecondPartOfImageEls.forEach(function (imageOfSecondPart) {
                            
                            // main logic of the pager
                            imageEls.push(imageOfSecondPart);
                          
                          }); // end of tempSecondPartOfImageEls.forEach
                        
                        } // endif (tempSecondPartOfImageEls)

                      } // endelse

                      ceilingIllustrationEl.dispatchEvent(arrayChanged);
                      
                      if ( !( e.target.classList.contains('selected') ) ) {
                        
                        e.target.classList.add('selected');
                      
                      } // endif ( !( e.target.classList.contains('selected') ) )

                      var pagerEl = e.target.parentElement;
                      
                      pagerEl.childNodes.forEach(function (childNode) {
                        
                        if ( childNode != e.target 
                              && childNode.classList.contains('selected') ) {
                                
                                childNode.classList.remove('selected');

                        } // endif ( childNode != e.target...

                      }); // end of pagerEl.childNodes.forEach

                    };

                  } // end of clickHandler's getter

                }); // end of clickHandler

              } // end of ImageGalleryPager's constructor

              return ImageGalleryPager;

            })(); // end of ImageGalleryPager's wrapper
            
            function CeilingIllustrationController(imageEls, arrayChanged) {
              
              var directionController = new DirectionController(imageEls, arrayChanged);
              
              var directionControllersContainer = directionController.element;
              
              controllersContainer.append(directionControllersContainer);
              
              var imageGalleryPager = new ImageGalleryPager(imageEls, arrayChanged);
              
              var pagerEl = imageGalleryPager.element;
              
              controllersContainer.append(pagerEl);
              
              Object.defineProperty(this, 'element', {
                
                get: function () {
                  
                  return controllersContainer;
                
                } // end of element's getter
              
              }); // end of element
              
              Object.defineProperty(this, 'children', {
                
                get: function () {
                  
                  return {
                    
                    'directionController': directionController,
                    
                    'imageGalleryPager': imageGalleryPager
                  
                  };
                
                } // end of children's getter
              
              }); // end of children
            
            } // end of CeilingIllustrationController's constructor

            return CeilingIllustrationController;

          })(); // end of CeilingIllustrationController's wrapper
          
          var ceilingIllustration = new CeilingIllustration(imageSet);
          
          var ceilingIllustrationController = new CeilingIllustrationController(ceilingIllustration.imageEls, arrayChanged);
          
          var ceilingIllustrationEl = ceilingIllustration.element;
          
          var ceilingIllustrationControllerEl = ceilingIllustrationController.element;
          
          var pagerEl = ceilingIllustrationController.children.imageGalleryPager.element;
          
          var nextEl = ceilingIllustrationController.children.directionController.children.nextEl;
          
          var prevEl = ceilingIllustrationController.children.directionController.children.prevEl;
          
          Object.defineProperty(this, 'element', {
            
            get: function () {
              
              var imageGalleryEl = document.createElement('div');
              
              imageGalleryEl.classList.add('imageGallery');
              
              imageGalleryEl.classList.add(categoryIdName);
              
              imageGalleryEl.append(ceilingIllustrationEl);
              
              imageGalleryEl.append(ceilingIllustrationControllerEl);
              
              return imageGalleryEl;
            
            } // end of element's getter
          
          }); // end of element
          
          Object.defineProperty(this, 'children', {
            
            get: function () {
              
              return {
                
                'ceilingIllustration': ceilingIllustration,
                
                'ceilingIllustrationController': ceilingIllustrationController
              
              };
            
            } // end of children's getter
          
          }); // end of children
          
          this.removeEventListeners = function () {
            
            ceilingIllustrationEl.removeEventListener('arrayChanged', ceilingIllustration.arrayChangedHandler, false);
            
            nextEl.removeEventListener('click', ceilingIllustrationController.children.directionController.clickHandler, false);
            
            prevEl.removeEventListener('click', ceilingIllustrationController.children.directionController.clickHandler, false);
            
            pagerEl.removeEventListener('click', ceilingIllustrationController.children.imageGalleryPager.clickHandler, false);
            
            for (var i = 0; i < ceilingIllustration.ceilingImages.length; i++) {
              
              ceilingIllustration.ceilingImages[i].element.removeEventListener('click', ceilingIllustration.ceilingImages[i].clickHandler, false);
            
            } // endfor
          
          }; // end of removeEventListeners

          this.addEventListeners = function () {
            
            ceilingIllustrationEl.addEventListener('arrayChanged', ceilingIllustration.arrayChangedHandler, false);
            
            nextEl.addEventListener('click', ceilingIllustrationController.children.directionController.clickHandler, false);
            
            prevEl.addEventListener('click', ceilingIllustrationController.children.directionController.clickHandler, false);
            
            pagerEl.addEventListener('click', ceilingIllustrationController.children.imageGalleryPager.clickHandler, false);
            
            for (var i = 0; i < ceilingIllustration.ceilingImages.length; i++) {
              
              ceilingIllustration.ceilingImages[i].element.addEventListener('click', ceilingIllustration.ceilingImages[i].clickHandler, false);
            
            } // endfor
          
          } // end of addEventListeners

        } // endif (arrayChanged instanceof Event && arrayChanged.type == 'arrayChanged')

        else {
          
          console.error( new TypeError('the second argument must be a custom event which means that it must be an instance of the Event object and also it must have a "arrayChanged" type') );
        
        }// endelse

      } // end of ImageGallery's constructor

      return ImageGallery;

    })(); // end of ImageGallery's wrapper
    
    var CategoriesNav = (function () {

      function CategoriesNav(categories, categoryInfEl, displayedFiltersNav, displayedImageGallery, arrayChanged) {

        var categoryNavEl = document.createElement('nav');

        categoryNavEl.classList.add('categoryNav');

        var ceilingCategoriesEl = document.createElement('ul');
        
        ceilingCategoriesEl.classList.add('categoryList');

        categoryNavEl.append(ceilingCategoriesEl);
        
        var that = this;
        
        categories.forEach(function (category) {

          var categoryEl = document.createElement('li');

          categoryEl.classList.add('categoryListItem');
          
          if (category.selected) {
            
            categoryEl.classList.add('selected');
            
            switch (category.content.type) {
              
              case 'filters':
                
                displayedFiltersNav = new FiltersNav(category.content.itself, category.idName, categoryInfEl, displayedImageGallery, arrayChanged);
                
                var selectedFilter = category.content.itself.find(function (filter) {
                  
                  return filter.selected;
                
                }); // end of selectedFilter
                
                displayedImageGallery = new ImageGallery(selectedFilter.imageSet, arrayChanged, selectedFilter.idName);
                
                displayedImageGallery.addEventListeners();
                
                categoryInfEl.append(displayedFiltersNav.element);
                
                categoryInfEl.append(displayedImageGallery.element);

              break; // end of case 'filters'
              
              case 'imageSet':
                
                var categoriesNavEl = selectedCategoryEl.parentElement;
                
                categoriesNavEl.classList.add('withoutFiltersNav');
                
                displayedImageGallery = new ImageGallery(category.content.itself, arrayChanged, category.idName);
                
                displayedImageGallery.addEventListeners();
                
                categoryInfEl.append(displayedImageGallery.element);
                
              break; // end of case 'imageSet'
            
            } // end of switch (category.content.type)
          
          } // end of if (category.selected)

          var categoryAnchorEl = document.createElement('a');
          
          categoryAnchorEl.classList.add('categoryLink');

          categoryAnchorEl.setAttribute('href', '#' + category.idName);
          
          var categoryTextNode = document.createTextNode(category.name);
          
          categoryAnchorEl.append(categoryTextNode);
          
          categoryEl.append(categoryAnchorEl);
          
          categoryEl.addEventListener('click', function (e) {

            e.preventDefault();
            
            var targetElClass, hashIndex;
            
            var triggerEl = e.target;
            
            switch (triggerEl.tagName) {
              
              case 'A':
                
                var selectedCategoryEl = triggerEl.parentElement;
              
              break; // end of case 'A'
              
              case 'LI':
                
                var selectedCategoryEl = triggerEl;
                
                triggerEl = triggerEl.querySelector('a');
                
              break; // end of case 'LI'
            
            } // end of switch (triggerEl.tagName)

            targetElClass = triggerEl.getAttribute('href');
            
            hashIndex = targetElClass.search('#');
            
            targetElClass = targetElClass.substring(hashIndex + 1);
            
            var categoriesNavEl = selectedCategoryEl.parentElement;
            
            if ( !selectedCategoryEl.classList.contains('selected') ) {
              
              selectedCategoryEl.classList.add('selected');
            
            } // endif if ( !selectedCategoryEl.classList.contains('selected') )

            categoriesNavEl.childNodes.forEach(function (childNode) {
              
              if ( childNode.classList.contains('selected')
                  && childNode != selectedCategoryEl ) {
                    
                    childNode.classList.remove('selected');

              } // endif if ( childNode.classList.contains('selected')...
            
            }); // end of categoriesNavEl.childNodes.forEach
            
            if ( !( categoryInfEl.querySelector('.' + targetElClass) ) ) {

              var previousImageGalleryEl = categoryInfEl.querySelector('.imageGallery');
              
              if (previousImageGalleryEl) {
                
                previousImageGalleryEl.remove();
                
                if (displayedImageGallery) {
                  
                  displayedImageGallery.removeEventListeners();
                  
                  Object.keys(displayedImageGallery).forEach(function (key) {
                    
                    delete displayedImageGallery[key];
                  
                  }); // end of displayedImageGallery.forEach
                  
                  displayedImageGallery = undefined;
                
                } // endif (displayedImageGallery)
              
              } // endif (previousImageGalleryEl)

              var previousFiltersNavEl = categoryInfEl.querySelector('.filterNav');
              
              if (previousFiltersNavEl) {
                
                previousFiltersNavEl.remove();
                
                if (displayedFiltersNav) {
                  
                  Object.keys(displayedFiltersNav).forEach(function (key) {
                    
                    delete displayedFiltersNav[key];
                  
                  }); // end of displayedFiltersNav.forEach
                  
                  displayedFiltersNav = undefined;
              
                } // endif (displayedFiltersNav)
            
              } // endif (previousFiltersNavEl)
              
              switch (category.content.type) {

                case 'filters':
                
                  if ( categoriesNavEl.classList.contains('withoutFiltersNav') ) {
                    
                    categoriesNavEl.classList.remove('withoutFiltersNav');
                  
                  } // endif ( categoriesNavEl.classList.contains('withoutFiltersNav') )

                  displayedFiltersNav = new FiltersNav(category.content.itself, category.idName, categoryInfEl, displayedImageGallery, arrayChanged);
                  
                  var selectedFilter = category.content.itself.find(function (filter) {

                    return filter.selected;
                  
                  }); // end of selectedFilter
                  
                  displayedImageGallery = new ImageGallery(selectedFilter.imageSet, arrayChanged, selectedFilter.idName);
                  
                  displayedImageGallery.addEventListeners();
                  
                  categoryInfEl.append(displayedFiltersNav.element);
                  
                  categoryInfEl.append(displayedImageGallery.element);
                
                break; // end of case 'filters'
                
                case 'imageSet':
                  
                  categoriesNavEl.classList.add('withoutFiltersNav');
                  
                  displayedImageGallery = new ImageGallery(category.content.itself, arrayChanged, category.idName);
                  
                  displayedImageGallery.addEventListeners();
                  
                  categoryInfEl.append(displayedImageGallery.element);
                  
                break; // end of case 'imageSet'

              } // end of switch (category.content.type)

            } // end of if ( !( categoryInfEl.querySelector('.' + targetElClass) ) )

          }, false);
          
          ceilingCategoriesEl.append(categoryEl);

        }); // end of categories.forEach
        
        Object.defineProperty(this, 'element', {
          
          get: function () {
            
            return categoryNavEl;
          
          } // end of element's getter
        
        }); // end of element

      } // end of CategoriesNav's constructor

      return CategoriesNav;

    })(); // end of CategoriesNav's wrapper
    
    var ceilingCategoriesData = new CeilingCategoriesData();
    
    var ceilingCategoryInf = new CategoryInf();
    
    var ceilingCategoryInfEl = ceilingCategoryInf.element;
    
    var ceilingCategories = ceilingCategoriesData.categories;
    
    var displayedImageGallery, displayedFiltersNav;
    
    var arrayChangedEvent = new Event('arrayChanged');
    
    var ceilingCategoriesNav = new CategoriesNav(ceilingCategories, ceilingCategoryInfEl, displayedFiltersNav, displayedImageGallery, arrayChangedEvent);

    var catalogOfCeilingsEl = document.querySelector('section.ceilingCatalog .container');

    catalogOfCeilingsEl.append(ceilingCategoriesNav.element);
    
    catalogOfCeilingsEl.append(ceilingCategoryInfEl);

  }; // end of ceilingsCatalogHandler

  var aboutSectionHandler = function () {

    // initializing variables

    var linkToDetailsEl = document.querySelector('.about .linkToDetails a');
    
    var modalClass = getClassOfTargetEl(linkToDetailsEl.getAttribute('href'));
    
    var aboutModal = new tingle.modal({
      footer: false,
      stickyFooter: false,
      closeMethods: ['overlay', 'button', 'escape'],
      closeLabel: "Закрыть",
      cssClass: [modalClass, 'modal']    
    }); // end of aboutModal
    
    var modalContent = '';

    // preparing the content of the about modal window

    modalContent += '<div class="aboutInDetails modal">';
    modalContent += '<h2>';
    modalContent += 'Компания &laquo;Master Potolok&raquo;';
    modalContent += '</h2>';
    modalContent += '<p>';
    modalContent += 'Компания &laquo;Master Potolok&raquo; успешно работает на рынке ';
    modalContent += '<strong>';
    modalContent += 'Алматы и Алматинской области';
    modalContent += '</strong>';
    modalContent += ' с 2008 года. Первоначально организация представляла собой ';
    modalContent += 'структурное подразделение ТОО &laquo;КазМирСтрой&laquo; и ';
    modalContent += 'специализировалась на монтаже ПХВ-потолков. ';
    modalContent += 'С увеличением количества заказов и ростом профессионализма ';
    modalContent += 'сотрудников, структурное подразделение превратилось в ';
    modalContent += '<strong>';
    modalContent += 'динамично развивающуюся';
    modalContent += '</strong>';
    modalContent += 'компанию.';
    modalContent += '</p>';
    modalContent += '<ul>';
    modalContent += '<li>';
    modalContent += '2010 год. Спустя 2 года после основания ';
    modalContent += '&laquo;Master Potolok&raquo;';
    modalContent += ' стала официальным дилером компании ';
    modalContent += 'Saros Design и в ассортименте компании появились ';
    modalContent += 'французские натяжные потолки шириной до 2 метров.';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '2011 год. В 2011 году, наша компания открыла собственное ';
    modalContent += 'производство натяжных потолков (пленка ПВХ раскраивалась ';
    modalContent += 'на полотна под индивидуальные размеры потолков Заказчиков, ';
    modalContent += 'после чего сваривались при помощи специального оборудования).';
    modalContent += '</li>';
    modalContent += '<li>2012 год. Еще спустя 1 год, помимо штапиковой технологии ';
    modalContent += 'монтажа натяжных потолков, стала использоваться ';
    modalContent += 'голландская клиновая технология Mondeo.';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '2013 год. Следующий год стал знаковым для &laquo;Master Potolok&raquo;, ';
    modalContent += 'ведь в ассортименте появились первые ';
    modalContent += 'бесшовные потолки Clipso, которые наши специалисты устанавливают ';
    modalContent += 'в крепеж для бесшовных потолков (полотна ';
    modalContent += 'заправляются в паз-защелку при помощи шпателя).';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '2014 год. В 2014 году был подписан знаковый официальный договор ';
    modalContent += 'с компанией MSD, благодаря чему в ассортименте появилась бюджетная ';
    modalContent += 'ПВХ пленка шириной до 3,2 метра. Далее официальный договор был ';
    modalContent += 'подписан с компанией Pongs (официальный дилер на территории РК), ';
    modalContent += 'а так же налажены оптовые поставки полотен Descor.';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '2015 год. В 2015 году компания установила натяжные потолки на базе ';
    modalContent += 'футбольного клуба &laquo;Кайрат&raquo; (более чем 2000 м2), ';
    modalContent += 'а еще спустя год, ассортимент пополнился коллекцией пленки Lackfolie и Descor.';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '2016 год. В 2016 году компания &laquo;Master Potolok&raquo; ';
    modalContent += 'вышла на новый уровень и наладила производство алюминиевых конструкций для ';
    modalContent += 'двух- и многоуровневых потолков.';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += '2016 год. Еще одно знаковое событие в жизнедеятельности компании произошло в 2016 ';
    modalContent += 'году, ';
    modalContent += 'когда мы стали официальными дилерами компании EcoFolien.';
    modalContent += '</li>';
    modalContent += '<li>';
    modalContent += 'На сегодняшний день ТОО &laquo;Master Potolok&raquo; является одним из лидеров ';
    modalContent += 'рынка натяжных потолков.';
    modalContent += '<strong>';
    modalContent += 'Высокий профессионализм';
    modalContent += '</strong>';
    modalContent += 'наших специалистов позволяет справляться с заказами любой сложности. ';
    modalContent += 'Спешите заказать натяжные потолки в компании &laquo;Master Potolok&raquo;';
    modalContent += 'и Вы получите отличный результат по приятной цене.';
    modalContent += '</li>';
    modalContent += '</ul>';
    modalContent += '<p>';
    modalContent += 'Наш девиз ';
    modalContent += '<strong>';
    modalContent += '&laquo;престиж и комфорт в Вашем доме&raquo;!';
    modalContent += '</strong>';
    modalContent += '</p>';
    modalContent += '</div>';

    // setting the content
    aboutModal.setContent(modalContent);

    linkToDetailsEl.addEventListener('click', function (e) {
      
      e.preventDefault();

      aboutModal.open();
    
    }); // end of linkToDetailsEl.onclick
    
  }; // end of aboutSectionHandler

  var mainCalcInit = function (inputChanged) {

    var mainCalcHandler = function (elements) {

      var getAllData = function (elements) {
        
        var totalPrice = 0;
        
        totalPriceLimit = 25000;
        
        var perimeterOfCeiling = 0;
        
        var warningMsg = '';
        
        return {
          
          elements: elements,
          
          totalPrice: totalPrice,
          
          updateTotalPrice: function (increase) {
            
            this.totalPrice += increase;
          
          },
          
          resetTotalPrice: function () {
            
            this.totalPrice = 0;
          
          },
          
          totalPriceLimit: totalPriceLimit,
          
          updateTotalPriceLimit: function (newLimit) {
            
            this.totalPriceLimit = newLimit;
          
          },
          
          warningMsg: warningMsg,
          
          updateWarningMsg: function (newMsg) {
            
            this.warningMsg = newMsg;
          
          },
          
          resetWarningMsg: function () {
            
            this.warningMsg = '';
          
          },
          
          perimeterOfCeiling: perimeterOfCeiling,
          
          updatePerimeterOfCeiling: function (value) {
            
            this.perimeterOfCeiling = value;
          
          }
        
        }
      
      };
      
      var resetAdditionalSection = function (data, isAdditionalElsAvailable = false) {

        if (!isAdditionalElsAvailable) {

          data.resetWarningMsg();
          
          data.elements.additionalSecTriggerEl.setAttribute('disabled', 'true');
          
          data.elements.additionalSecTriggerEl.checked = false;
          
          data.elements.additionalSecTriggerLabelEl.classList.add('disabled');
        
        }

        data.elements.chandeliersAmountEl.value = '';
        
        data.elements.lightspotsAmountEl.value = '';
        
        data.elements.pipesAmountEl.value = '';
        
        data.elements.fireDetectorsAmountEl.value = '';
        
        data.elements.perimeterOfCurtainsEl.value = '';
        
        data.elements.chandeliersAmountEl.setAttribute('disabled', 'true');
        
        data.elements.lightspotsAmountEl.setAttribute('disabled', 'true');
        
        data.elements.pipesAmountEl.setAttribute('disabled', 'true');
        
        data.elements.fireDetectorsAmountEl.setAttribute('disabled', 'true');
        
        data.elements.perimeterOfCurtainsEl.setAttribute('disabled', 'true');
        
        data.elements.profileTypesTriggerEl.checked = false;
        
        data.elements.profileTypeEls.forEach(function (profileType) {
          
          profileType.setAttribute('disabled', 'true');
        
        });
        
        data.elements.camouflageInsertTypesTriggerEl.checked = false;
        
        data.elements.camouflageInsertTypeEls.forEach(function (camInsType) {
          
          camInsType.setAttribute('disabled', 'true');
        
        });
        
        data.elements.profileTypesTriggerEl.setAttribute('disabled', 'true');
        
        data.elements.camouflageInsertTypesTriggerEl.setAttribute('disabled', 'true');
        
        data.elements.additionalSection.classList.add('disabled');

      };
      
      var enableAdditionalSection = function (elements) {
        
        elements.additionalSecTriggerEl.removeAttribute("disabled");
        
        elements.additionalSecTriggerLabelEl.classList.remove('disabled');
        
        data.elements.chandeliersAmountEl.removeAttribute("disabled");
        
        data.elements.lightspotsAmountEl.removeAttribute("disabled");
        
        data.elements.pipesAmountEl.removeAttribute("disabled");
        
        data.elements.fireDetectorsAmountEl.removeAttribute("disabled");
        
        data.elements.perimeterOfCurtainsEl.removeAttribute("disabled");
        
        data.elements.profileTypesTriggerEl.removeAttribute("disabled");
        
        data.elements.profileTypeEls.forEach(function (profileType) {
          
          profileType.removeAttribute("disabled");
        
        });
        
        data.elements.camouflageInsertTypesTriggerEl.removeAttribute("disabled");
        
        data.elements.camouflageInsertTypeEls.forEach(function (camInsType) {
          
          camInsType.removeAttribute("disabled");
        
        });
        
        data.elements.additionalSection.classList.remove('disabled');
      
      };

      var displayElement = function (element) {
        
        element.setAttribute('style', 'display: block;');
      
      };
      
      var hideElement = function (element) {
        
        element.setAttribute('style', 'display: none;');
      
      };

      var getPriceBySize = function (perimeterOfCeiling, areaOfCeiling, costByArea) {

        var priceBySize = 0;
        
        var diff = 0;
        
        var additionalPaymentByPerimeter = 0;
        
        var priceByArea = areaOfCeiling * costByArea; 
        
        priceBySize += priceByArea;
        
        if (perimeterOfCeiling != areaOfCeiling) {
          
          diff = Math.abs(perimeterOfCeiling - areaOfCeiling);
          
          additionalPaymentByPerimeter = diff * 300;
          
          priceBySize += additionalPaymentByPerimeter;
        
        }

        return priceBySize;

      };
      
      var getAreaOfCeiling = function (sizeX, sizeY) {
        
        return sizeX * sizeY;
      
      };
      
      var getPerimeterOfCeiling = function (sizeX, sizeY) {
        
        return 2 * sizeX + 2 * sizeY;
      
      };
      
      var getCostByArea = function (widthOfCeiling) {

        if (widthOfCeiling <= 3.2) {
          
          return 1500;
        
        }

        else if (widthOfCeiling > 3.2 && widthOfCeiling <= 4) {
          
          return 1600;
        
        }

        else if (widthOfCeiling > 4) {
          
          return 1700;
        
        }

      };
      
      var getWidthOfCeiling = function (sizeX, sizeY) {
        
        if (sizeX < sizeY){

          return sizeX;

        }
        
        if (sizeY < sizeX) {

          return sizeY;

        }
        
        return sizeX;
      
      };
      
      var sizeHandler = function (data) {

        var sizeXEl = data.elements.sizeXEl;
        
        var sizeYEl = data.elements.sizeYEl;
        
        var sizeX = Number.parseFloat(sizeXEl.value);
        
        var sizeY = Number.parseFloat(sizeYEl.value);
        
        var widthOfCeiling, areaOfCeiling, costByArea, priceBySize;
        
        var sizeXEl = data.elements.sizeXEl;
        
        var sizeYEl = data.elements.sizeYEl;
        
        if (sizeXEl.value.length == 0 || sizeYEl.value.length == 0) {
          
          resetAdditionalSection(data);
        
        }

        if (sizeXEl.value.length > 0 && sizeYEl.value.length > 0) {

          areaOfCeiling = getAreaOfCeiling(sizeX, sizeY);
          
          if (areaOfCeiling > 0) {

            widthOfCeiling = getWidthOfCeiling(sizeX, sizeY);
            
            data.updatePerimeterOfCeiling( getPerimeterOfCeiling(sizeX, sizeY) );
            
            costByArea = getCostByArea(widthOfCeiling);
            
            priceBySize = getPriceBySize(data.perimeterOfCeiling, areaOfCeiling, costByArea);
            
            enableAdditionalSection(data.elements);
            
            if (areaOfCeiling <= 10) {
              
              data.updateTotalPriceLimit(25000);
            
            }

            else if (areaOfCeiling <= 15) {
              
              data.updateTotalPriceLimit(35000);
            
            }

          }
          else {
            
            resetAdditionalSection(data);
          
          }

        }

        if (priceBySize) {
          
          data.updateTotalPrice(priceBySize);
        
        }

      };
      
      var getPriceByAdditionalServices = function (elements, perimeterOfCeiling) {

        var priceByAdditionalServices = 0;
        
        var chandeliersAmountEl = elements.chandeliersAmountEl;
        
        var lightspotsAmountEl = elements.lightspotsAmountEl;
        
        var perimeterOfCurtainsEl = elements.perimeterOfCurtainsEl;
        
        var fireDetectorsAmountEl = elements.fireDetectorsAmountEl;
        
        var pipesAmountEl = elements.pipesAmountEl;
        
        var profileTypeEls = elements.profileTypeEls;
        
        var camouflageInsertTypeEls = elements.camouflageInsertTypeEls;
        
        var costOfChandelier = 2000;
        
        var costOfSpot = 1500;
        
        var costOfCurtains = 2000;
        
        var costOfFireDetectorMounting = 1500;
        
        var costOfContouringPipes = 1500;
        
        var costOfAluminumProfile = 250;
        
        var costOfPVCProfile = 0;
        
        var costOfWhitecamouflageInsertType = 400;
        
        var costOfColourfulcamouflageInsertType = 600;
        
        var priceOfChandelier = 0;
        
        var priceOfSpot = 0;
        
        var priceOfCurtains = 0;
        
        var priceOfFireDetectorMounting = 0;
        
        var priceOfContouringPipes = 0;
        
        var priceOfAluminumProfile = 0;
        
        var priceOfPVCProfile = 0;
        
        var priceOfWhitecamouflageInsertType = 0;
        
        var priceOfColourfulcamouflageInsertType = 0;
        
        if (chandeliersAmountEl.value.length != 0) {
          
          var chandeliersAmount = Number.parseFloat(chandeliersAmountEl.value);
          
          priceOfChandelier = chandeliersAmount * costOfChandelier;
          
          priceByAdditionalServices += priceOfChandelier;
        
        }

        if (lightspotsAmountEl.value.length != 0) {
          
          var lightspotsAmount = Number.parseFloat(lightspotsAmountEl.value);
          
          priceOfSpot = lightspotsAmount * costOfSpot;
          
          priceByAdditionalServices += priceOfSpot;
        
        }

        if (perimeterOfCurtainsEl.value.length != 0) {
          
          var perimeterOfCurtains = Number.parseFloat(perimeterOfCurtainsEl.value);
          
          priceOfCurtains = perimeterOfCurtains * costOfCurtains;
          
          priceByAdditionalServices += priceOfCurtains;
        
        }

        if (fireDetectorsAmountEl.value.length != 0) {
          
          var fireDetectorsAmount = Number.parseFloat(fireDetectorsAmountEl.value);
          
          priceOfFireDetectorMounting = fireDetectorsAmount * costOfFireDetectorMounting;
          
          priceByAdditionalServices += priceOfFireDetectorMounting;
        
        }

        if (pipesAmountEl.value.length != 0) {
          
          var pipesAmount = Number.parseFloat(pipesAmountEl.value);
          
          priceOfContouringPipes = pipesAmount * costOfContouringPipes;
          
          priceByAdditionalServices += priceOfContouringPipes;
        
        }

        profileTypeEls.forEach(function (profileType) {
          
          if (profileType.checked) {
            
            switch (profileType.value) {
              
              case "aluminum":
                
                priceOfAluminumProfile = perimeterOfCeiling * costOfAluminumProfile;
                
                priceByAdditionalServices += priceOfAluminumProfile;
                
              return;
                
              case "PVC":
                
                priceOfPVCProfile = perimeterOfCeiling * costOfPVCProfile;
                
                priceByAdditionalServices += priceOfPVCProfile;
              return;
            
            }
          
          }
        
        });
        
        camouflageInsertTypeEls.forEach(function (camInsType) {
          
          if (camInsType.checked) {
            
            switch (camInsType.value) {
              
              case "white":
                
                priceOfWhitecamouflageInsertType = costOfWhitecamouflageInsertType * perimeterOfCeiling;
                
                priceByAdditionalServices += priceOfWhitecamouflageInsertType;
                
              return;
              
              case "colourful":
                
                priceOfColourfulcamouflageInsertType = costOfColourfulcamouflageInsertType * perimeterOfCeiling;
                
                priceByAdditionalServices += priceOfColourfulcamouflageInsertType;
                
              return;
            
            }
          
          }
        
        });
        
        return priceByAdditionalServices;

      };
      
      var additionalSecHandler = function (data) {

        var additionalSection = data.elements.additionalSection;
        
        var additionalSecTriggerEl = data.elements.additionalSecTriggerEl;
        
        var priceByAdditionalServices;
        
        if (additionalSecTriggerEl.checked) {

          enableAdditionalSection(data.elements);
          
          displayElement(additionalSection);
          
          var profileTypesTriggerEl = data.elements.profileTypesTriggerEl;
          
          var profileTypeEls = data.elements.profileTypeEls;
          
          var profileTypesContainerEl = data.elements.profileTypesContainerEl;
          
          var camouflageInsertTypesTriggerEl = data.elements.camouflageInsertTypesTriggerEl;
          
          var camouflageInsertTypeEls = data.elements.camouflageInsertTypeEls;
          
          var camouflageInsertTypesContainerEl = data.elements.camouflageInsertTypesContainerEl;
          
          if (profileTypesTriggerEl.checked) {
            
            profileTypesContainerEl.setAttribute('style', 'display:block;');
            
            profileTypeEls.forEach(function (profileType) {
              
              profileType.removeAttribute('disabled');
            
            });
          
          }

          if (!profileTypesTriggerEl.checked) {
            
            profileTypesContainerEl.setAttribute('style', 'display:none;');
            
            profileTypeEls.forEach(function (profileType) {
              
              profileType.checked = false;
              
              profileType.setAttribute('disabled', 'true');
            
            });
          
          }

          if (camouflageInsertTypesTriggerEl.checked) {
            
            camouflageInsertTypesContainerEl.setAttribute('style', 'display:block;');
            
            camouflageInsertTypeEls.forEach(function (camouflageInsertType) {
              
              camouflageInsertType.removeAttribute('disabled');
            
            });
          
          }

          if (!camouflageInsertTypesTriggerEl.checked) {
            
            camouflageInsertTypesContainerEl.setAttribute('style', 'display:none;');
            
            camouflageInsertTypeEls.forEach(function (camouflageInsertType) {
              
              camouflageInsertType.checked = false;
              
              camouflageInsertType.setAttribute('disabled', 'true');
            
            });
          
          }

          priceByAdditionalServices = getPriceByAdditionalServices(data.elements, data.perimeterOfCeiling);

        }

        if (!additionalSecTriggerEl.checked) {
          
          hideElement(additionalSection);
          
          resetAdditionalSection(data, true);
        
        }

        if (priceByAdditionalServices) {
          
          data.updateTotalPrice(priceByAdditionalServices);
        
        }

      };
      
      var warningMsgHandler = function (warningMsg, warningMsgEl) {
        
        if (warningMsg.length > 0) {

          warningMsgEl.textContent = warningMsg;
          
          warningMsgEl.setAttribute('style', 'display: block;');
        
        }

        else {
          
          warningMsgEl.setAttribute('style', 'display:none;');
          
          warningMsgEl.textContent = '';
        
        }

      };
      
      var totalPriceHandler = function (totalPriceEl, totalPrice, totalPriceLimit) {

        if (totalPrice > 0) {

          if (totalPrice < totalPriceLimit) {
            
            data.updateWarningMsg('Минимальный заказ: ' + totalPriceLimit + ' тенге!');
          
          }

          if (data.totalPrice >= totalPriceLimit) {
            
            data.resetWarningMsg();
          
          }

        }

        totalPriceEl.textContent = totalPrice;

      };
      
      var data = getAllData(elements);
      
      sizeHandler(data);
      
      additionalSecHandler(data);
      
      totalPriceHandler(data.elements.totalPriceEl, data.totalPrice, data.totalPriceLimit);
      
      warningMsgHandler(data.warningMsg, data.elements.warningMsgEl);

    };
    
    var getElements = function () {
      
      var mainCalc = document.querySelector('section.mainCalc'),

          totalPriceEl = document.querySelector('.mainCalc .totalAmount .value'),

          sizeXEl = document.querySelector('.mainCalc input.lengthOfCeiling'),

          sizeYEl = document.querySelector('.mainCalc input.widthOfCeiling'),

          sizeXViewEl = document.querySelector('.mainCalc span.lengthOfCeiling'),
          
          sizeYViewEl = document.querySelector('.mainCalc span.widthOfCeiling'),
          
          additionalSecTriggerLabelEl = document.querySelector('.mainCalc .showAdditionalEls .labelText'),
          
          additionalSecTriggerEl = document.querySelector('.mainCalc input.showAdditionalEls'),
          
          additionalSection = document.querySelector('.mainCalc .additionalServices'),
          
          fireDetectorsAmountEl = document.querySelector('.mainCalc input.fireDetectorsAmount'),
          
          lightspotsAmountEl = document.querySelector('.mainCalc input.lightspotsAmount'),
          
          pipesAmountEl = document.querySelector('.mainCalc input.pipesAmount'),
          
          perimeterOfCurtainsEl = document.querySelector('.mainCalc input.perimeterOfCurtains'),
          
          chandeliersAmountEl = document.querySelector('.mainCalc input.chandeliersAmount'),
          
          profileTypesTriggerEl = document.querySelector('.mainCalc input.profileOfCeiling'),
          
          profileTypesContainerEl = document.querySelector('.mainCalc .profileTypes'),
          
          profileTypeEls = profileTypesContainerEl.querySelectorAll('input.typeOfCeilingProfile'),
          
          camouflageInsertTypesTriggerEl = document.querySelector('.mainCalc input.camouflageInsert'),
          
          camouflageInsertTypesContainerEl = document.querySelector('.mainCalc .camouflageInsertTypes'),
          
          camouflageInsertTypeEls = camouflageInsertTypesContainerEl.querySelectorAll('input.camouflageInsertType'),
          
          warningMsgEl = document.querySelector('.mainCalc .msg');
          
      return {
            
        mainCalc: mainCalc,
        
        totalPriceEl: totalPriceEl,
        
        sizeXEl: sizeXEl,
        
        sizeYEl: sizeYEl,
        
        sizeXViewEl: sizeXViewEl,
        
        sizeYViewEl: sizeYViewEl,
        
        additionalSecTriggerLabelEl: additionalSecTriggerLabelEl,
        
        additionalSecTriggerEl: additionalSecTriggerEl,
        
        additionalSection: additionalSection,
        
        fireDetectorsAmountEl: fireDetectorsAmountEl,
        
        lightspotsAmountEl: lightspotsAmountEl,
        
        pipesAmountEl: pipesAmountEl,
        
        perimeterOfCurtainsEl: perimeterOfCurtainsEl,
        
        chandeliersAmountEl: chandeliersAmountEl,
        
        profileTypesTriggerEl: profileTypesTriggerEl,
        
        profileTypesContainerEl: profileTypesContainerEl,
        
        profileTypeEls: profileTypeEls,
        
        camouflageInsertTypesTriggerEl: camouflageInsertTypesTriggerEl,
        
        camouflageInsertTypesContainerEl: camouflageInsertTypesContainerEl,
        
        camouflageInsertTypeEls: camouflageInsertTypeEls,
        
        warningMsgEl: warningMsgEl
          
      };
        
    };
        
    var rangeInputHandler = function (inputEl, viewEl) {

      if (inputEl.value > 0) {
        
        viewEl.textContent = inputEl.value;
      
      }

      else {
        
        viewEl.textContent = 0;
      
      }

    };
        
    var elements = getElements();
        
    var mainCalc = elements.mainCalc;
    
    var sizeXEl = elements.sizeXEl;
    
    var sizeYEl = elements.sizeYEl;
    
    var sizeXViewEl = elements.sizeXViewEl;
    
    var sizeYViewEl = elements.sizeYViewEl;
        
    var InputEls = [
      
      elements.additionalSecTriggerEl,
      
      elements.fireDetectorsAmountEl,
      
      elements.lightspotsAmountEl,
      
      elements.pipesAmountEl,
      
      elements.perimeterOfCurtainsEl,
      
      elements.chandeliersAmountEl,
      
      elements.profileTypesTriggerEl,
      
      elements.camouflageInsertTypesTriggerEl
    
    ];
        
    sizeXEl.addEventListener('input', function () {
      
      rangeInputHandler(sizeXEl, sizeXViewEl);
      
      mainCalcHandler(elements);
    
    }, true);
        
    sizeXEl.dispatchEvent(inputChanged);
    
    sizeYEl.addEventListener('input', function () {
      
      rangeInputHandler(sizeYEl, sizeYViewEl);
      
      mainCalcHandler(elements);
    
    }, true);
        
    sizeYEl.dispatchEvent(inputChanged);
    
    elements.profileTypeEls.forEach(function (profileType) {
      
      profileType.addEventListener('input', function () {
        
        mainCalcHandler(elements)
      
      }, true);
      
      profileType.dispatchEvent(inputChanged);
    
    });
        
    elements.camouflageInsertTypeEls.forEach(function (camInsType) {
      
      camInsType.addEventListener('input', function () {
        
        mainCalcHandler(elements);
      
      }, true);
      
      camInsType.dispatchEvent(inputChanged);
    
    });
        
    InputEls.forEach(function (singleInput) {
      
      singleInput.addEventListener('input', function () {
        
        mainCalcHandler(elements);
      
      }, true);
      
      singleInput.dispatchEvent(inputChanged);
    
    });
        
    mainCalc.addEventListener('change', function () {
      
      mainCalcHandler(elements);
    
    }, false);

  };

  var faqSectionHandler = function () {

    // getting needed elements
    var faqSection = document.querySelector('.faq'),
        accordionButtons = faqSection.querySelectorAll('.accordionButton');

    // adding click events for all accordion buttons
    accordionButtons.forEach(function (button) {
      
      button.addEventListener('click', function () {
        
        button.classList.toggle('selected');
      
      }, false);
    
    }); // end of accordionButtons.forEach
  
  }; // end of faqSectionHandler  

  var scrollToTop = function (smoothScroller, backToTopBtn) {
    
    var firstView = document.querySelector('.firstView');

    scrollToTargetSection({
      smoothScroller: smoothScroller,
      targetEl: firstView,
      toggleEl: backToTopBtn
    });
  
  }; // end of scrollToTop

  var backToTopBtnHandler = function (smoothScroller) {

    // initializing variables
    var backToTopButton = document.querySelector('.backToTop'),
        faq = document.querySelector('.faq'),
        footer = document.querySelector('.footer'),
        footerHeight = Number.parseInt(footer.clientHeight),
        screenLimit = footer.offsetTop - (window.innerHeight - footerHeight),
        heightOfFooter = parseFloat( document.querySelector('.footer' ).clientHeight ) + 5, // adding 5 pixels in order to separate button from footer
        heightOfHeader = parseFloat( window.getComputedStyle( document.querySelector('.firstView .header' ) ).height );
        
    // setting a click event listener for the back to top button
    backToTopButton.addEventListener('click', function (e) {

      e.preventDefault();

      scrollToTop(smoothScroller, backToTopButton);

    }, false); // end of backToTopButton.addEventListener('click',...

    // setting an event listener to the browser window in order to controll the appearance of the button
    window.addEventListener('scroll', function () {

      if ( window.pageYOffset > heightOfHeader && window.pageYOffset <= faq.offsetTop ) {

        backToTopButton.setAttribute('style', 'display: block;');

      }

      if (window.pageYOffset <= heightOfHeader) {

        backToTopButton.setAttribute('style', 'display: none;');

      }

      if ( window.pageYOffset > heightOfHeader && screenLimit >= window.pageYOffset && window.pageYOffset > faq.offsetTop ) {
        
        backToTopButton.setAttribute('style', 'display: block; bottom: ' + heightOfFooter + 'px;');
      
      }
      
    }, false); // end of window.addEventListener('scroll',...

    // the logic below runs only when page loads

    if (window.pageYOffset > heightOfHeader && screenLimit >= window.pageYOffset) {

      if ( window.pageYOffset > faq.offsetTop ) {
        
        backToTopButton.setAttribute('style', 'display: block; bottom: ' + heightOfFooter + 'px;');
      
      }

      else {

        backToTopButton.setAttribute('style', 'display: block;');

      }
    }

  }; // end of backToTopBtnHandler

  var mainHandler = function (e) {    

    if (e.type == "load") {

      // initializing variables
      var smoothScroller, loader, xhr;

      // getting the components ready
      
      loader = document.querySelector(".loader");
      loader.className += " hidden";

      var inputChanged = new Event('input', {

        'bubbles': true,

        'cancelable': true

      });

      new Glide('.mainSlider .glide', {
        type: 'carousel',
        startAt: 0,
        perView: 1,
        autoplay: 3000,
        hoverpause: false,
        gap: 0,
        perTouch: 1
      }).mount();

      smoothScroller = new SmoothScroll();

      xhr = new XMLHttpRequest();

      callBackButtonHandler(xhr);

      litteCalcHandler(inputChanged, smoothScroller);

      generalPricesSectionHandler();

      ceilingTypesSectionHandler();

      ceilingsCatalogHandler();

      aboutSectionHandler();

      mainCalcInit(inputChanged);

      faqSectionHandler();
      
      backToTopBtnHandler(smoothScroller);
      
    }
    
    mainNavHandler(e.type, smoothScroller);

  }; // end of mainHandler

  window.addEventListener('load', mainHandler, false);
  window.addEventListener('resize', mainHandler, false)

})();