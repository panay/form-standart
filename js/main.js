/*------------------------------------*\
 $SVG
 \*------------------------------------*/
var getSVGSprite = function (url) {

  $.get(url, function (data) {
    var div = document.createElement('div');
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
};

var setMasksOnInput = function (list) {

  $(list.date).inputmask("date", {placeholder: "дд/мм/гггг"});

  $(list.currency).inputmask("numeric", {
    alias: "numeric",
    groupSeparator: ',',
    autoGroup: true,
    digits: 2,
    digitsOptional: false,
    prefix: '₽ ',
    placeholder: '0'
  });

  $(list.name).inputmask('Regex', {regex: "[_a-zA-Zа-яА-Я- ]+$"});

  $(list.tel).inputmask("mask", {"mask": "+7 (999) 999-99-99"});

  $(list.creditcard).inputmask("mask", {"mask": "9999-9999-9999-9999"});

  $(list.email).inputmask("email");
};

var togglePasswordType = function (btn) {

  var isPasswordType = $(btn).parent().find('input').attr('type') === 'password',
      $btn = $(btn),
      $input = $btn.parent().find('input');

  if (isPasswordType) {
    $input.attr('type', 'text');
    $btn.removeClass('unmask__on').addClass('unmask__off');
  }
  else {
    $input.attr('type', 'password');
    $btn.removeClass('unmask__off').addClass('unmask__on');
  }
  return false;
};

var validate = function (form) {

  $(form).validate({
    debug: true,
    ignore: ".ignore",
    errorElement: "span",
    //onsubmit: false,
    invalidHandler: function (event, validator) {
      var errors = validator.numberOfInvalids();
      if (errors) {
        var message = "Пожалуйста, заполните все поля корректно.";
        $("div.errors span").html(message);
        $("div.errors").show();
        $(this).find('fieldset').removeClass('valid');
        $(this).find('fieldset').addClass('invalid');
      } else {
        $("div.errors").hide();
        $(this).find('fieldset').removeClass('invalid');
        $(this).find('fieldset').addClass('valid');
      }
    },
    submitHandler: function (form) {
      $(form).find('fieldset').removeClass('invalid');
      $(form).find('fieldset').addClass('valid');
      //form.submit();
    },
    rules: {
      name: {
        required: true,
        minlength: 2
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
        required: true
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
};

var styledSelect = function () {

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
};

var cookies = (function () {

  return {
    get: function (name) {
      var matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    set: function (name, value, options) {
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
    },
    delete: function (name) {
      this.set(name, "", {
        expires: -1
      });
    },
    deleteAll: function () {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  };
}());

$(function () {

  getSVGSprite('/img/sprite.svg');

  setMasksOnInput({
    'date': "[name='date']",
    'currency': "[name='currency']",
    'name': "[name='name']",
    'tel': "[type='tel']",
    'creditcard': "[name='creditcard']",
    'email': "[name='email']"
  });

  $('.unmask').on('click', function () {
    togglePasswordType(this);
  });

  validate('#common-form');
  validate('#form-login');
  validate('#registration-form');
  validate('#recovery-pass');
  validate('#feedback');

  $('#tags').tagsInput({
    'width': '100%',
    'defaultText': 'добавить'
  });

  styledSelect();

  var $cookies = $('[data-cookie]');

  // Заполнить значения
  $.each($cookies, function (index) {
    if (cookies.get('' + index)) {
      this.value = cookies.get('' + index);
    }
  });

  // Сохранить значение при изменении
  $cookies.on('change', function () {
    $.each($cookies, function (index) {
      cookies.set(index, this.value, {expires: 3600 * 24 * 7});
    });
  });

  // Управление cookies
  $('#set_cookies').on('click', function () {
    $.each($cookies, function (index) {
      cookies.set(index, this.value, {expires: 3600 * 24 * 7});
    });
  });
  $('#delete_cookies').on('click', cookies.deleteAll);
});