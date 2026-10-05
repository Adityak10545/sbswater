(function ($) {

    "use strict";

    /*------------------------------------------
        = TOGGLE MOBILE NAVIGATION
    -------------------------------------------*/
    function toggleMobileNavigation() {
        const navbarEl = $(".navigation-holder");
        const openBtnEl = $(".mobile-menu .open-btn");
        const toggleBtnEl = $(".mobile-menu .navbar-toggler");

        openBtnEl.on("click", function (e) {
            e.stopImmediatePropagation();
            navbarEl.toggleClass("slideIn");
            toggleBtnEl.toggleClass("x-close");
            return false;
        });
    }
    toggleMobileNavigation();

    /*------------------------------------------
       = SMALL NAV CLASS
    -------------------------------------------*/
    function toggleClassForSmallNav() {
        const mainNavEl = $("#navbar > ul");
        (window.innerWidth <= 991)
            ? mainNavEl.addClass("small-nav")
            : mainNavEl.removeClass("small-nav");
    }
    toggleClassForSmallNav();

    /*------------------------------------------
        = SMALL NAV FUNCTIONALITY
    -------------------------------------------*/
    function smallNavFunctionality() {
        const windowWidth = window.innerWidth;
        const navHolder = $(".navigation-holder");
        const smallNavEl = $(".navigation-holder > .small-nav");
        const subMenuEl = smallNavEl.find(".sub-menu");
        const megaMenuEl = smallNavEl.find(".mega-menu");
        const submenuLinks = smallNavEl.find(".menu-item-has-children > a");

        if (windowWidth <= 991) {
            subMenuEl.hide();
            megaMenuEl.hide();

            submenuLinks.on("click", function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                const $this = $(this);
                $this.siblings().slideToggle();
                $this.toggleClass("rotate");
            });

        } else {
            navHolder.find(".sub-menu").show();
            navHolder.find(".mega-menu").show();
        }
    }
    smallNavFunctionality();

    /* Close menu */
    $("body").on("click", function () {
        $('.navigation-holder').removeClass('slideIn');
    });
    $(".menu-close").on("click", function () {
        $('.navigation-holder').removeClass('slideIn');
        $('.open-btn').removeClass('x-close');
    });

    /*------------------------------------------
     = SETTING HEADER MIDDLE LOGO
 -------------------------------------------*/
    function siteMiddleLogoSetting() {

        $('.header-style-s2 .brand-logo').remove();

        if ($(window).width() > 991) {

            $('.header-style-s2 .navigation, .sticky-header-bottom').each(function () {

                var $nav = $(this).find('.navbar-nav').first();

                if (!$nav.length) return;

                var $logo = $('.header-style-s2 .navbar-brand').first().clone();

                $('<li class="brand-logo"></li>')
                    .append($logo)
                    .insertAfter($nav.children('li').eq(2));

            });

            $('.header-style-s2 .navbar-header').hide();

        } else {

            $('.header-style-s2 .navbar-header').show();
        }
    }

    siteMiddleLogoSetting();

    /*------------------------------------------
        = TOOLTIP
    -------------------------------------------*/
    try {
        var tooltipList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
            .map(function (el) {
                return new bootstrap.Tooltip(el);
            });
    } catch (err) {
        console.warn("Tooltip init failed:", err);
    }

    /*------------------------------------------
        = TEAM SOCIAL TOGGLE
    -------------------------------------------*/
    $(".social").on('click', function () {
        $(this).toggleClass('active');
    });

    /*------------------------------------------
        = Testimonial SLIDER
    -------------------------------------------*/
    if ($(".testimonial-silde").length) {
        $(".testimonial-silde").owlCarousel({
            autoplay: true,
            autoplayHoverPause: true,
            smartSpeed: 300,
            loop: true,
            dots: true,
            nav: true,
            items: 1
        });
    }

    /*------------------------------------------
      = Testimonial SLIDER
  -------------------------------------------*/
    if ($(".testimonial-silde-s2").length) {
        $(".testimonial-silde-s2").owlCarousel({
            autoplay: true,
            autoplayHoverPause: true,
            smartSpeed: 300,
            margin: 15,
            loop: true,
            dots: true,
            nav: false,
            items: 1
        });
    }

    /*------------------------------------------
        = team-slider
    -------------------------------------------*/
    if ($(".team-slider").length) {
        $(".team-slider").owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            loop: true,
            margin: 20,
            dots: true,
            nav: false,
            items: 3,
            responsive: {
                0: {
                    items: 1,
                },

                575: {
                    items: 2,
                },

                1200: {
                    items: 3,
                }
            }
        });
    }

    /*------------------------------------------
         = ODOMETER
     -------------------------------------------*/
    if ($(".odometer").length && $.fn.appear) {
        $('.odometer').appear();
        $(document.body).on('appear', '.odometer', function () {
            $(".odometer").each(function () {
                var countNumber = $(this).attr("data-count");
                $(this).html(countNumber);
            });
        });
    }

    /*------------------------------------------
        = PRELOADER
    -------------------------------------------*/
    var wow = new WOW();

    function preloader() {
        if ($('.preloader').length) {
            $('.preloader').delay(100).fadeOut(500, function () {
                wow.init();
            });
        }
    }

    /*------------------------------------------
        = FANCYBOX
    -------------------------------------------*/
    if ($(".fancybox").length && $.fancybox) {
        try {
            $(".fancybox").fancybox({
                openEffect: "elastic",
                closeEffect: "elastic",
                wrapCSS: "project-fancybox-title-style"
            });
        } catch (e) {
            console.warn("Fancybox failed:", e);
        }
    }

    /*------------------------------------------
        = POPUP YOUTUBE, VIMEO, GMAPS
    -------------------------------------------*/
    if ($(".popup-youtube").length && $.fn.magnificPopup) {
        $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false
        });
    }

    /*------------------------------------------
        = POPUP VIDEO
    -------------------------------------------*/
    if ($(".video-btn").length) {
        $(".video-btn").on("click", function () {
            $.fancybox({
                href: this.href,
                aspectRatio: true,
                type: $(this).data("type"),
                'title': this.title,
                helpers: {
                    title: { type: 'inside' },
                    media: {}
                },

                beforeShow: function () {
                    $(".fancybox-wrap").addClass("gallery-fancybox");
                }
            });
            return false
        });
    }

    /*------------------------------------------
        = SORTING GALLERY
    -------------------------------------------*/
    function sortingGallery() {
        if ($(".sortable-gallery .gallery-filters").length && $.fn.isotope) {
            const $container = $('.gallery-container');

            $container.isotope({
                filter: '*',
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });

            $(".gallery-filters li a").on("click", function () {
                $('.gallery-filters li .current').removeClass('current');
                $(this).addClass('current');

                const selector = $(this).attr('data-filter');
                $container.isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 750,
                        easing: 'linear',
                        queue: false
                    }
                });

                return false;
            });
        }
    }
    sortingGallery();

    // HERO SLIDER IMAGE
    var sliderBgSetting = $(".slide-bg-image");
    sliderBgSetting.each(function (indx) {
        if ($(this).attr("data-background")) {
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });

    var heroSlider = new Swiper(".hero-slider", {
        loop: true,
        speed: 1500,
        effect: "fade",
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },

        pagination: {
            el: ".swiper-pagination",

            clickable: true,
            renderBullet: function (index, className) {

                return '<span class="' + className + '">' +
                    ('0' + (index + 1)).slice(-2) +
                    "</span>";

            }
        }
    });

    /*------------------------------------------
        = STICKY HEADER
    -------------------------------------------*/
    function cloneNavForSticky($ele, className) {
        $ele.addClass('original')
            .clone()
            .insertAfter($ele)
            .addClass(className)
            .removeClass('original');
    }

    if ($('.wpo-site-header .navigation').length) {
        cloneNavForSticky($('.wpo-site-header .navigation'), "sticky-header");
    }

    let lastScrollTop = 0;

    function stickyMenu($menu, className) {
        const st = $(window).scrollTop();

        if (st > 900) {
            (st > lastScrollTop)
                ? $menu.removeClass(className)
                : $menu.addClass(className);
        } else {
            $menu.removeClass(className);
        }

        lastScrollTop = st;
    }


    /*------------------------------------------
        = TOUCHSPIN
    -------------------------------------------*/
    if ($("input[name='product-count']").length && $.fn.TouchSpin) {
        $("input[name='product-count']").TouchSpin({
            verticalbuttons: true
        });
    }

    /*------------------------------------------
    = Portfolio Image
  -------------------------------------------*/
    document.addEventListener("DOMContentLoaded", () => {

        if (window.innerWidth <= 991) return;

        const items = document.querySelectorAll(".portfolio-item");
        let activeImage = document.querySelector(".image-bg.active");

        items.forEach(item => {

            item.addEventListener("mouseenter", () => {

                const nextImage = document.querySelector(item.dataset.show);

                if (!nextImage || nextImage === activeImage) return;

                items.forEach(i => i.classList.remove("active"));
                item.classList.add("active");

                nextImage.style.zIndex = 2;
                activeImage.style.zIndex = 1;

                nextImage.classList.add("active");

                setTimeout(() => {
                    activeImage.classList.remove("active");
                    activeImage = nextImage;
                }, 80);

            });

        });

    });

    /*------------------------------------------
      = Blog Image
    -------------------------------------------*/

    const cards = document.querySelectorAll(".blog-card");
    if (window.innerWidth > 991) {
        cards.forEach(card => {
            card.addEventListener("mouseenter", () => {
                cards.forEach(item => item.classList.remove("active"));
                card.classList.add("active");
            });
        });
    }
    /*------------------------------------------
      = Story Image
    -------------------------------------------*/
    document.addEventListener("DOMContentLoaded", () => {
        if (window.innerWidth <= 767) return;
        const preview = document.getElementById("preview");
        const items = document.querySelectorAll(".story-item");
        items.forEach(item => {
            item.addEventListener("mouseenter", function () {
                items.forEach(i => i.classList.remove("active"));
                this.classList.add("active");
                preview.classList.add("blur");
                setTimeout(() => {
                    preview.src = this.dataset.image;
                    preview.classList.remove("blur");
                }, 250);
            });
        });
    });

    /*------------------------------------------
    = partners-slider
    -------------------------------------------*/
    $('.partners-slider').slick({
        infinite: true,
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 600,
        arrows: false,
        dots: false,
        slidesToShow: 6,
        slidesToScroll: 1,

        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 5
                }
            },

            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 2
                }
            }
        ]
    });

    /*------------------------------------------
      = POST SLIDER
  -------------------------------------------*/
    if ($(".post-slider").length) {
        $(".post-slider").owlCarousel({
            mouseDrag: false,
            smartSpeed: 500,
            margin: 30,
            loop: true,
            nav: true,
            navText: ['<i class="fi ti-angle-left"></i>', '<i class="fi ti-angle-right"></i>'],
            dots: false,
            items: 1
        });
    }

    /*------------------------------------------
     = wpo-project-single-main-img
 -------------------------------------------*/
    if ($(".wpo-project-single-main-img".length)) {
        $(".wpo-project-single-main-img").owlCarousel({
            mouseDrag: false,
            smartSpeed: 500,
            margin: 30,
            loop: true,
            nav: true,
            navText: ['<i class="fi ti-arrow-left"></i>', '<i class="fi ti-arrow-right"></i>'],
            dots: false,
            items: 1
        });
    }

    /*------------------------------------------
        = BACK TO TOP
    -------------------------------------------*/
    $("body").append("<a href='#' class='back-to-top'><i class='ti-arrow-up'></i></a>");

    function toggleBackToTopBtn() {
        ($(window).scrollTop() > 1000)
            ? $(".back-to-top").fadeIn("slow")
            : $(".back-to-top").fadeOut("slow");
    }

    $(".back-to-top").on("click", function () {
        $("html,body").animate({ scrollTop: 0 }, 700);
        return false;
    });

    /*------------------------------------------
        = CONTACT FORM (main)
    -------------------------------------------*/
    if ($("#contact-form-main").length && $.fn.validate) {
        $("#contact-form-main").validate({
            rules: {
                name: { required: true, minlength: 2 },
                email: "required",
                phone: "required",
                service: "required",
                subject: "required"
            },

            messages: {
                name: "Please enter your name",
                email: "Please enter your email address",
                phone: "Please enter your phone number",
                service: "Please select your contact service",
                subject: "Please select your contact subject",
            },

            submitHandler: function (form) {
                $.ajax({
                    type: "POST",
                    url: "mail-contact.php",
                    data: $(form).serialize(),
                    success: function () {
                        $("#loader").hide();
                        $("#success").slideDown();

                        setTimeout(() => $("#success").slideUp(), 3000);
                        form.reset();
                    },
                    error: function () {
                        $("#loader").hide();
                        $("#error").slideDown();

                        setTimeout(() => $("#error").slideUp(), 3000);
                    }
                });
                return false;
            }
        });
    }

    /*------------------------------------------
        = CONTACT FORM (simple)
    -------------------------------------------*/
    if ($("#contact-form").length && $.fn.validate) {
        $("#contact-form").validate({
            rules: {
                name: { required: true, minlength: 2 },
                email: "required",
                phone: "required",
                address: "required",
                subject: "required"
            },

            messages: {
                name: "Please enter your name",
                email: "Please enter your email address",
                phone: "Please enter your phone number",
                subject: "Please select your contact subject",
                address: "Please select your address"
            },

            submitHandler: function (form) {
                $.ajax({
                    type: "POST",
                    url: "mail-contact.php",
                    data: $(form).serialize(),

                    success: function () {
                        $("#loader").hide();
                        $("#success").slideDown();

                        setTimeout(() => $("#success").slideUp(), 3000);
                        form.reset();
                    },

                    error: function () {
                        $("#loader").hide();
                        $("#error").slideDown();

                        setTimeout(() => $("#error").slideUp(), 3000);
                    }
                });
                return false;
            }
        });
    }

    // tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    $(function () {
        $("#datepicker").datepicker();
    });

    $(function () {
        $("#datepicker2").datepicker();
    });

    //  hover-active
    let items = document.querySelectorAll('.service-all-content .service-item, .portfolio-all-item .portfolio-card');
    items.forEach(item => item.addEventListener('mouseenter', function () { handleHover(this, items) }))
    function handleHover(el) {
        items.forEach(item => {
            item.classList.remove('active')
            item.classList.add('item')
        })

        el.classList.add('active')
    }

    /*------------------------------------------
= Header shopping cart toggle
-------------------------------------------*/
    if ($(".mini-cart").length) {
        var cartToggleBtn = $(".cart-toggle-btn");
        var cartContent = $(".mini-cart-content");
        var cartCloseBtn = $(".mini-cart-close");
        var body = $("body");

        cartToggleBtn.on("click", function (e) {
            cartContent.toggleClass("mini-cart-content-toggle");
            e.stopPropagation();
        });

        cartCloseBtn.on("click", function (e) {
            cartContent.removeClass("mini-cart-content-toggle");
            e.stopPropagation();
        });

        body.on("click", function () {
            cartContent.removeClass("mini-cart-content-toggle");
        }).find(cartContent).on("click", function (e) {
            e.stopPropagation();
        });
    }



    /*------------------------------------------
        = WINDOW LOAD
    -------------------------------------------*/
    $(window).on('load', function () {
        preloader();
        sortingGallery();
        toggleMobileNavigation();
        smallNavFunctionality();
    });

    /*------------------------------------------
        = WINDOW SCROLL
    -------------------------------------------*/
    $(window).on("scroll", function () {
        if ($(".sticky-header").length) {
            stickyMenu($('.sticky-header'), "sticky-on");
        }
        toggleBackToTopBtn();
    });


    /* languageSelect js */
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".language-selector").forEach(selector => {

            const selectElement = selector.querySelector(".languageSelect");
            const customSelectWrapper = selector.querySelector(".custom-select-wrapper");
            const customSelect = selector.querySelector(".custom-select");
            const customOptions = selector.querySelector(".custom-options");

            if (!selectElement) return;

            const selectedOption = selectElement.options[selectElement.selectedIndex];

            customSelect.innerHTML = `
            <img src="${selectedOption.dataset.icon}" alt="">
            ${selectedOption.text}
        `;

            customOptions.innerHTML = "";

            Array.from(selectElement.options).forEach(option => {

                const optionDiv = document.createElement("div");

                optionDiv.innerHTML = `
                <img src="${option.dataset.icon}" alt="">
                ${option.text}
            `;

                optionDiv.addEventListener("click", () => {
                    customSelect.innerHTML = `
                    <img src="${option.dataset.icon}" alt="">
                    ${option.text}
                `;

                    selectElement.value = option.value;
                    customOptions.style.display = "none";
                });

                customOptions.appendChild(optionDiv);
            });

            customSelectWrapper.addEventListener("click", function (e) {
                e.stopPropagation();

                customOptions.style.display =
                    customOptions.style.display === "block" ? "none" : "block";
            });

            document.addEventListener("click", () => {
                customOptions.style.display = "none";
            });
        });
    });

    /* cursor style js*/
    var cursor = document.querySelector('.cursor');
    var cursorinner = document.querySelector('.cursor2');
    var a = document.querySelectorAll('a');

    document.addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;
        cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`
    });

    document.addEventListener('mousemove', function (e) {
        var x = e.clientX;
        var y = e.clientY;
        cursorinner.style.left = x + 'px';
        cursorinner.style.top = y + 'px';
    });

    document.addEventListener('mousedown', function () {
        cursor.classList.add('click');
        cursorinner.classList.add('cursorinnerhover')
    });

    document.addEventListener('mouseup', function () {
        cursor.classList.remove('click')
        cursorinner.classList.remove('cursorinnerhover')
    });

    a.forEach(item => {
        item.addEventListener('mouseover', () => {
            cursor.classList.add('hover');
        });
        item.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    })

    /*------------------------------------------
        = WINDOW RESIZE
    -------------------------------------------*/
    $(window).on("resize", function () {
        toggleClassForSmallNav();
        clearTimeout($.data(this, 'resizeTimer'));
        $.data(this, 'resizeTimer', setTimeout(function () {
            smallNavFunctionality();
            siteMiddleLogoSetting();
        }, 200));
    });

})(window.jQuery);
