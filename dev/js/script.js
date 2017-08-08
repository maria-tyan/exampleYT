var kirpich = {
    init: function() {
        this.initCache();
        this.initEvents();
        this.initSlider();
        this.initValidation();
    },

    initCache: function() {
        this.$body = $('body');
        this.$overlay = $('.js-overlay');
        this.$popupform = $('.js-popup');
        this.$popupformLeader = $('.js-popup-leader');
        this.$thn = $('.js-thn');
        this.$close = $('.js-close');
        this.$order = $('.js-order');
        this.$orderLeader = $('.js-order-leader');
        this.$popupClose = $('.js-popup-close');
        this.$menu = $('.js-menu');
        this.$sliderReviews = $('.js-slider-reviews');
        this.$sliderLogo = $('.js-slider-logo');
        this.$catalog = $('.js-catalog');
        this.$catalogBtn = $('.js-catalog-btn');
        this.$catalogBtnWrap = $('.js-btn-wrap');
        this.$accordion = $('.js-accorgion');
        this.$accordionContent = $('.js-accorgion-content');

        this.$radioColor = $('.js-radio-color');
        this.$radioSize = $('.js-radio-size');
        this.$radioTexture = $('.js-radio-texture');
        this.$radioRastvor = $('.js-radio-rastvor');

        this.$color = $('.js-color');
        this.$size = $('.js-size');
        this.$texture = $('.js-texture');
        this.$rastvor = $('.js-rastvor');
        this.$brick = $('.js-brick');
        this.$updateColor = $('.js-update-color');
        
    },
    initSlider: function () {
        var sliderReviews = this.$sliderReviews;
        var sliderLogo = this.$sliderLogo;
        
        if($(sliderReviews)){
            $(sliderReviews).slick({
                slidesToShow:1,
                slidesToScroll:1,
                arrows:false,
                dots:true,
                infinite:true,
                autoplay: true,
                autoplaySpeed: 4000,
                // appendArrows: '.slide-content',
            })
        }

        if($(sliderLogo)){
            $(sliderLogo).slick({
                slidesToShow:10,
                slidesToScroll:1,
                arrows:false,
                dots:false,
                infinite:true,
                autoplay: true,
                autoplaySpeed: 2000,
                variableWidth: false
                // centerMode: true,
                // appendArrows: '.slide-content',
            })
        }
    },
    initValidation: function () {
        $('form').each(function () {
            $(this).validate({
                errorPlacement: function (error, element) {

            },
                submitHandler: function (form) {
                    var object = $(form);
                    send(object);
                }
            });
        });
        /*----------------------form send-------------------*/

        $.validator.addMethod(
        'regexp',
        function (value, element, regexp) {
            var re = new RegExp(regexp);
            return this.optional(element) || re.test(value);
        },
        "Please check your input."
        );

        $.validator.addClassRules({
            userphone: {
                required: true
            },
            usermail: {
                email: true,
                required: true
            },
            username: {
                required: true
            },
            login: {
                required: true
            },
            password: {
                required: true
            },
        });

        function send(object) {
            var fieldArr = [], newFieldArr = {}, special = [];
            fieldArr = object.find(':input,textarea,select').serializeArray();
            // special = object.find('input[type="hidden"]').serializeArray();
            for (var c = 0; c < fieldArr.length; c++) {
                var title = object.find('input[name="' + fieldArr[c].name + '"],select[name="' + fieldArr[c].name + '"],textarea[name="' + fieldArr[c].name + '"]').attr('data-title');
                fieldArr[c]['title'] = title;
                temp = {};
                temp.title = fieldArr[c].title;
                temp.value = fieldArr[c].value;
                var name = fieldArr[c].name;

                if (fieldArr[c].value.length > 0) {
                    newFieldArr[name] = temp;
                }
            }

            var data = {
                formData: newFieldArr
            };
            $.ajax({
                type: "POST",
                url: 'form-handler.php',
                dataType: 'json',
                data: data
            }).done(function () {
                kirpich.$popupform.closePopUp();
                kirpich.$popupformLeader.closePopUp();
                kirpich.$thn.openPopUp();

                object.trigger('reset');
                setTimeout(function () {
                kirpich.$thn.closePopUp();

                }, 3000)
            })
        }
    },
    initEvents: function () {
        var _this = this;
        this.$order.click(function () {
            $('.js-input-hidden').val($(this).data('from'));
            _this.$popupform.find('h2').text($(this).data('from'));
            _this.$popupform.openPopUp();
        });

        this.$orderLeader.click(function () {
            $('.js-input-hidden').val($(this).data('from'));
            _this.$popupformLeader.openPopUp();
        });

        this.$close.click(function () {
            _this.$popupform.closePopUp();
            _this.$popupformLeader.closePopUp();
        });

        /*-----------------calculator-info---------------------*/

        this.$radioColor.click(function () {
            var val = $(this).find('input').val();
            var color = $(this).attr('data-color');
            _this.$color.find('span').text(val);
            _this.$brick.css('background-color', color);
        });

        this.$radioSize.click(function () {
            var val = $(this).find('input').val();
            var width = $(this).attr('data-width');
            var height = $(this).attr('data-height');
            _this.$size.find('span').text(val);
            _this.$brick.css({
                'width': width,
                'height': height
            });
        });

        this.$radioTexture.click(function () {
            var val = $(this).find('input').val();
            var img = $(this).attr('data-img');
            _this.$texture.find('span').text(val);
            _this.$brick.find('img').attr('src', img);
        });

        this.$radioRastvor.click(function () {
            var val = $(this).find('input').val();
            var color = $(this).attr('data-color');
            _this.$rastvor.find('span').text(val);

            if(color != 'color'){
                _this.$brick.css('border-color', color);
            }
        });

        this.$updateColor.on('change', function() {
            var color = '#' + $(this).val();
            _this.$brick.css('border-color', color);
        })

        /*-----------------filtration--------------------------*/

        this.$catalog.isotope({
          itemSelector: '.mix',
          layoutMode: 'fitRows',
          filter: '.light.single'
        })

        var filters = {color: ".light", size: ".single"};

        $('.filter').on( 'click', '.button', function() {
          var $this = $(this);
          var $buttonGroup = $this.parents('.button-group');
          var filterGroup = $buttonGroup.attr('data-filter-group');
          filters[ filterGroup ] = $this.attr('data-filter');

          var filterValue = concatValues( filters );
          _this.$catalog.isotope({ filter: filterValue });
        });

        $('.button-group').each( function( i, buttonGroup ) {
          var $buttonGroup = $( buttonGroup );
          $buttonGroup.on( 'click', 'button', function() {
            $buttonGroup.find('._active').removeClass('_active');
            $( this ).addClass('_active');
          });
        });
          
        function concatValues( obj ) {
          var value = '';
          for ( var prop in obj ) {
            value += obj[ prop ];
          }
          return value;
        }

        $('.js-filter-all').click(function(){
            $('.button-group').each( function( i, buttonGroup ) {
                var $buttonGroup = $( buttonGroup );
                $buttonGroup.find('._active').removeClass('_active');
            });

            for ( var prop in filters ) {
                filters[ prop ] = '';
            }
            _this.$catalog.isotope({ filter: '' });
        })

        /*---------------------animation------------------------*/
        var ww = $(window).width(), wh = $(window).height(), blockarray;
        function Indexation() {
            blockarray = $('body').find('.indexed').map(function () {
                var minOffset = $(this).offset().top;
                var maxOffset = minOffset + $(this).height();
                var array = {blockParam: [minOffset, maxOffset]};
                return  array;
            });
        }
        function animations(pos) {
            var wihheight = (wh / 2) + 300;

            for (var i = 0; i < blockarray.length; i++) {

                if ((pos >= blockarray[i].blockParam[0] - wihheight) && (pos < blockarray[i].blockParam[1] - wihheight)) {
                    $('body .indexed').eq(i).addClass('animate');

                    $('body .indexed').eq(i).find('.animated').each(function () {
                        var type = $(this).attr('data-animate-type').split(',');
                        $(this).css({'animation-delay': type[1], '-webkit-animation-delay': type[1]});
                        $(this).addClass(type[0]);
                    });
                }
            }
        }
        function is_touch_device() {
            return !!('ontouchstart' in window);
        }
        $(window).load(function () {
            function loadPage() {
                var pos;
                Indexation();
                $(window).scroll(function () {
                    
                    pos = $(window).scrollTop();
                    animations(pos);
                    if(pos<10){
                        $('.js-header').removeClass('_scrool');
                    }
                    else{
                        $('.js-header').addClass('_scrool');
                    }
                    
                })
            }
            loadPage();
        });
    },
};

$.fn.closePopUp = function () {
    this.fadeOut(600);
    kirpich.$overlay.fadeOut(600);
};
$.fn.openPopUp = function () {
    this.fadeIn(600);
    kirpich.$overlay.fadeIn(600);
};

var max_slider_number = 10000;
function range_init(){
    $('#calculator_range').slider({
        range:"min",
        min:10,
        max:max_slider_number,
        value:2500,
        slide:function(event,ui){
            $('#range_input').val(ui.value);
            $('.js-range').find('span').text(ui.value);
        },
        stop:function(){
            $('.calculator_form').change();
        }

    });
}

$(".number_only").keydown(function(event) {
    if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || 
        (event.keyCode == 65 && event.ctrlKey === true) || 
        (event.keyCode >= 35 && event.keyCode <= 39)) {
             return;
    }
    else {
        if ((event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
            event.preventDefault(); 
        }   
    }    
});

function checkNum(){
    var el_var = Number($('#range_input').val());
    if(el_var > max_slider_number){
        el_var = max_slider_number;
        $('#range_input').val(el_var);
    }
    if(el_var < 10){
        el_var = 10;
        $('#range_input').val(el_var);
    }
    $('#calculator_range').slider('value',el_var);
    $('.js-range').find('span').text(el_var);
}

$('#range_input').keydown(function(event) {
    if(event.keyCode == 13){
        checkNum();
        event.preventDefault();

    }
})

$('#range_input').focusout(function(){
    checkNum();
})

range_init();

$(document).ready(function () {
    
    kirpich.init();
    $(window).resize(function () {
    });
    $(window).scroll(function () {
    })
    $('.userphone').mask("+7(999)999-99-99",{placeholder:'_'});
    /*----------------------scroll menu------------------------*/
    $('a[href^="#"]').click(function(){
      var target = $(this).attr('href');
        $('html, body').animate({scrollTop: $(target).offset().top - 60 }, 800);
      return false;
    });

});

var officesMap;
function initMap() {
    
    var myMap = new ymaps.Map("map", {
        center: [55.800616, 37.524681],
        zoom: 13,
        controls: ['smallMapDefaultSet']
    }, {
        
    }),

    myPlacemark1 = new ymaps.Placemark([55.800616, 37.524681], {
    }, {
        iconLayout: 'default#image',
        iconImageHref: 'images/map-marker.png',
        iconImageSize: [79, 96],
        balloonPanelMaxMapArea: 0
    }),
    myPlacemark2 = new ymaps.Placemark([55.582058, 37.711006], {
    }, {
        iconLayout: 'default#image',
        iconImageHref: 'images/map-marker.png',
        iconImageSize: [79, 96],
        balloonPanelMaxMapArea: 0
    }),
    myPlacemark3 = new ymaps.Placemark([55.603320, 37.480274], {
    }, {
        iconLayout: 'default#image',
        iconImageHref: 'images/map-marker.png',
        iconImageSize: [79, 96],
        balloonPanelMaxMapArea: 0
    });

    myMap.geoObjects.add(myPlacemark1);
    myMap.geoObjects.add(myPlacemark2);
    myMap.geoObjects.add(myPlacemark3);

    myMap.behaviors.disable('scrollZoom');
    if(isMobile.any()){
        myMap.behaviors.disable('drag');
    }

    $(".js-accorgion").bind('click', function () {

        if(!$(this).hasClass('_active')){
            myMap.panTo($(this).data('coor'), {
                delay: 700
            });

            kirpich.$accordion.removeClass('_active').find(kirpich.$accordionContent).slideUp();
            $(this).addClass('_active');
            $(this).find(kirpich.$accordionContent).slideDown();
        }        
    });
}

ymaps.ready(initMap);

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

