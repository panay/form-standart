//  $SVG
//------------------------------------------------------------------------

$.get("img/sprite.svg", function (data) {
  var div = document.createElement("div");
  $(div).css({
    'border': '0',
    'clip': 'rect(0 0 0 0)',
    'overflow': 'hidden',
    'margin': '-1px',
    'padding': '0',
    'position': 'absolute',
    'width': '1px',
    'height': '1px'
  });
  div.innerHTML = new XMLSerializer().serializeToString(data.documentElement);
  document.body.insertBefore(div, document.body.childNodes[0]);
});

//---------------------------------------
//	$MASK
//---------------------------------------

//$('[type="tel"]').mask("+7 (999) 999 - 99 - 99", {placeholder: "_"});
//$('[name="creditcard"]').mask("9999-9999-9999-9999", {placeholder: "_"});

$(document).ready(function () {
  // Date
  $("[name='date']").inputmask("date", {placeholder: "дд/мм/гггг"});

  // Currency
  $("[name='currency']").inputmask("numeric", {
    alias: "numeric",
    groupSeparator: ',',
    autoGroup: true,
    digits: 2,
    digitsOptional: false,
    prefix: '₽ ',
    placeholder: '0'
  });

  // Name

  //$('#name').inputmask({
  //  mask: "a{2,65}[-]a{2,65} a{2,65}[-]a{2,65}",
  //  greedy: false
  //});

  $("[name='name']").inputmask('Regex', {regex: "[_a-zA-Zа-яА-Я- ]+$"});


  // Telephone
  $('input[type="tel"]').inputmask("mask", {"mask": "+7 (999) 999-99-99"});

  // Bank Card
  $('[name="creditcard"]').inputmask("mask", {"mask": "9999-9999-9999-9999"});

  // Email
  $("[name='email']").inputmask("email");
});

//========================================================================
//  $STYLED--SELECT
//========================================================================

$(document).ready(function () {


  // Select

  $('.select').wrap('<div class="select-wrapper"></div>');

  // Styled select
  $('.select--styled').fancySelect();

  // Select iconed
  $('.select--iconed').fancySelect({
    triggerTemplate: function (optionEl) {
      return '<svg role="img"><use xlink:href="#icon-' + optionEl.data('icon') + '"></use></svg>' + '&nbsp;' + optionEl.text();
    },
    optionTemplate: function (optionEl) {
      return '<svg role="img"><use xlink:href="#icon-' + optionEl.data('icon') + '"></use></svg>' + '&nbsp;' + optionEl.text();
    }
  });


  /*
   function from : https://gist.github.com/3559343
   Thank you bminer!
   */

  function changeType(x, type) {
    if (x.prop('type') == type)
      return x; //That was easy.
    try {
      return x.prop('type', type); //Stupid IE security will not allow this
    } catch (e) {
      //Try re-creating the element (yep... this sucks)
      //jQuery has no html() method for the element, so we have to put into a div first
      var html = $("<div>").append(x.clone()).html();
      var regex = /type=(\")?([^\"\s]+)(\")?/; //matches type=text or type="text"
      //If no match, we add the type attribute to the end; otherwise, we replace
      var tmp = $(html.match(regex) == null ?
          html.replace(">", ' type="' + type + '">') :
          html.replace(regex, 'type="' + type + '"'));
      //Copy data from old element
      tmp.data('type', x.data('type'));
      var events = x.data('events');
      var cb = function (events) {
        return function () {
          //Bind all prior events
          for (i in events) {
            var y = events[i];
            for (j in y)
              tmp.bind(i, y[j].handler);
          }
        }
      }(events);
      x.replaceWith(tmp);
      setTimeout(cb, 10); //Wait a bit to call function
      return tmp;
    }
  }

  // Password show/hide
  $('[type="password"] + .unmask').on('click', function () {

    if ($(this).prev('input').attr('type') == 'password')
      changeType($(this).prev('input'), 'text');

    else
      changeType($(this).prev('input'), 'password');

    return false;
  });


});

//---------------------------------------
//	$VALIDATE
//---------------------------------------

$(document).ready(function () {

  $("#form").validate({
    debug: true,
    ignore: ".ignore",
    errorElement: "span",
    wrapper: 'div class="relative"',
    onsubmit: false,
    onkeyup: true,
    rules: {
      name: {
        required: true,
        minlength: 2,
      },
      email: {
        required: true,
        email: true
      },
      email_confirm: {
        required: true,
        email: true,
        equalTo: "#email"
      },
      agree: {
        required: true
      },
      url: {
        url: true
      },
      password: {
        required: true,
        minlength: 6
      },
      password_confirm: {
        required: true,
        minlength: 6,
        equalTo: "#password"
      },
      tel: {
        required: true,
      },
      number: {
        number: true,
        min: 0,
        max: 100
      },
      creditcard: {
        required: true
      }
    }
  });

  // Сообщения по-умолчанию
  $.extend($.validator.messages, {
    required: "Это поле необходимо заполнить.",
    remote: "Пожалуйста, введите правильное значение.",
    email: "Пожалуйста, введите корректный адрес электронной почты.",
    url: "Пожалуйста, введите корректный URL.",
    date: "Пожалуйста, введите корректную дату.",
    dateISO: "Пожалуйста, введите корректную дату в формате ISO.",
    number: "Пожалуйста, введите число.",
    digits: "Пожалуйста, вводите только цифры.",
    creditcard: "Пожалуйста, введите правильный номер кредитной карты.",
    equalTo: "Пожалуйста, введите такое же значение ещё раз.",
    extension: "Пожалуйста, выберите файл с правильным расширением.",
    maxlength: $.validator.format("Пожалуйста, введите не больше {0} символов."),
    minlength: $.validator.format("Пожалуйста, введите не меньше {0} символов."),
    rangelength: $.validator.format("Пожалуйста, введите значение длиной от {0} до {1} символов."),
    range: $.validator.format("Пожалуйста, введите число от {0} до {1}."),
    max: $.validator.format("Пожалуйста, введите число, меньшее или равное {0}."),
    min: $.validator.format("Пожалуйста, введите число, большее или равное {0}.")
  });
});

//========================================
//  $COOKIES
//========================================

// возвращает cookie с именем name, если есть, если нет, то undefined
function getCookie(name) {
  var matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// устанавливает cookie c именем name и значением value
// options - объект с свойствами cookie (expires, path, domain, secure)
function setCookie(name, value, options) {
  options = options || {};

  var expires = options.expires;

  if (typeof expires == "number" && expires) {
    var d = new Date();
    d.setTime(d.getTime() + expires * 1000);
    expires = options.expires = d;
  }
  if (expires && expires.toUTCString) {
    options.expires = expires.toUTCString();
  }

  value = encodeURIComponent(value);

  var updatedCookie = name + "=" + value;

  for (var propName in options) {
    updatedCookie += "; " + propName;
    var propValue = options[propName];
    if (propValue !== true) {
      updatedCookie += "=" + propValue;
    }
  }

  document.cookie = updatedCookie;
}

// удаляет cookie с именем name
function deleteCookie(name) {
  setCookie(name, "", {
    expires: -1
  });
}

// Удаляет все куки
function deleteAllCookies() {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

//  $COOKIES > FUNCTIONS
//------------------------------------------

$(document).ready(function () {

  var $cookies = $('[data-cookie]');

  // Сохранить значения
  function storeValues() {
    $.each($cookies, function (index) {
      setCookie(index, this.value, {expires: 3600 * 24 * 7});
    });
  }

  // Заполнить значения
  $.each($cookies, function (index) {
    if (getCookie('' + index)) {
      this.value = getCookie('' + index);
    }
  });

  // Сохранить значение при изменении
  $cookies.on('change', function () {
    storeValues();
  });

  // Управление cookies
  $('#set_cookies').on('click', storeValues);
  $('#delete_cookies').on('click', deleteAllCookies);
});