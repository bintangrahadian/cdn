( function( $ ) {
	"use strict";

	/**
	 * Global Vars
	 */

	var windowWidth = window.innerWidth,
		windowHeight = window.innerHeight,
		adminBarHeight = $( '#wpadminbar' ).innerHeight(),
		headerHeight = $( '.site-header' ).innerHeight(),
		navBarHeight = $( '.navbar-primary' ).innerHeight();

	if ( $( 'body' ).hasClass( 'admin-bar' ) ) {
		if ( window.innerWidth > 782 ) {
			adminBarHeight = 32;
		} else {
			adminBarHeight = 46;
		}
	}

	$( document ).ready( function() {
		headerHeight = $( '.site-header' ).innerHeight();
		navBarHeight = $( '.navbar-primary' ).innerHeight();
	} );

	$( window ).resize( function() {
		windowWidth = window.innerWidth;
		windowHeight = window.innerHeight;
		adminBarHeight = $( '#wpadminbar' ).innerHeight();
		headerHeight = $( '.site-header' ).innerHeight();
		navBarHeight = $( '.navbar-primary' ).innerHeight();
	} );

	var isIE = /MSIE|Trident/i.test( navigator.userAgent );

	var isRetina = false;

	if ( window.matchMedia ) {
		var mq = window.matchMedia( "only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen  and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)" );
		if ( mq && mq.matches || ( window.devicePixelRatio > 1 ) ) {
			isRetina = true;
		}
	}

	var rtl = false;

	if ( $( 'body' ).hasClass( 'rtl' ) ) {
		rtl = true;
	}

	/**
	 * Responsive Navigation Menu
	 */

	$.fn.responsiveNav = function() {
		this.removeClass( 'menu-item-expanded' );
		if ( this.prev().hasClass( 'submenu-visible' ) ) {
			this.prev().removeClass( 'submenu-visible' ).slideUp( 350 );
			this.parent().removeClass( 'menu-item-expanded' );
		} else {
			this.parent().parent().find( '.menu-item .sub-menu' ).removeClass( 'submenu-visible' ).slideUp( 350 );
			this.parent().parent().find( '.menu-item-expanded' ).removeClass( 'menu-item-expanded' );
			this.prev().toggleClass( 'submenu-visible' ).hide().slideToggle( 350 );
			this.parent().toggleClass( 'menu-item-expanded' );
		}
	};

	// Make widget nav responsive.

	$( document ).ready( function( e ) {

		$( '.widget_nav_menu .menu-item-has-children' ).each( function( e ) {

			// Add a caret.
			$( this ).append( '<span></span>' );

			// Fire responsiveNav() when clicking a caret.
			$( '> span', this ).click( function( e ) {
				e.preventDefault();
				$( this ).responsiveNav();
			} );

			// Fire responsiveNav() when clicking a parent item with # href attribute.
			if ( '#' === $( '> a', this ).attr( 'href' ) ) {
				$( '> a', this ).click( function( e ) {
					e.preventDefault();
					$( this ).next().next().responsiveNav();
				} );
			}

		} );

	} );

	/**
	 * Offcanvas Navigation
	 */

	( function( $ ) {
		var offcanvas = $( '.offcanvas' ),
			body = $( 'body' ),
			container = $( '.site-inner' ),
			push = $( '.offcanvas-push' ),
			offcanvasOpen = 'offcanvas-open',
			siteOverlay = $( '.site-overlay' ),
			menuBtn = $( '.offcanvas-toggle' ),
			menuSpeed = 400,
			menuWidth = offcanvas.width() + 'px';

		function toggleOffcanvas() {
			body.toggleClass( offcanvasOpen );
			// recalc sticky sidebar by simulating window resize
			//  with a delay equal to the animation speed
			setTimeout( function() { $( window ).trigger( 'resize' ); }, 399 );
		}

		function openOffcanvasFallback() {
			body.addClass( offcanvasOpen );
			offcanvas.animate( { right: '0px' }, menuSpeed );
			container.animate( { right: menuWidth }, menuSpeed );
			push.animate( { right: menuWidth }, menuSpeed );
		}

		function closeOffcanvasFallback() {
			body.removeClass( offcanvasOpen );
			offcanvas.animate( { right: "-" + menuWidth }, menuSpeed );
			container.animate( { right: "0px" }, menuSpeed );
			push.animate( { right: "0px" }, menuSpeed );
		}

		//checks if 3d transforms are supported removing the modernizr dependency
		var cssTransforms3d = ( function csstransforms3d() {
			var el = document.createElement( 'p' ),
				supported = false,
				transforms = {
					'webkitTransform': '-webkit-transform',
					'OTransform': '-o-transform',
					'msTransform': '-ms-transform',
					'MozTransform': '-moz-transform',
					'transform': 'transform'
				};

			// Add it to the body to get the computed style
			document.body.insertBefore( el, null );

			for ( var t in transforms ) {
				if ( el.style[ t ] !== undefined ) {
					el.style[ t ] = 'translate3d(1px,1px,1px)';
					supported = window.getComputedStyle( el ).getPropertyValue( transforms[ t ] );
				}
			}

			document.body.removeChild( el );

			return ( supported !== undefined && supported.length > 0 && supported !== "none" );
		} )();

		if ( cssTransforms3d ) {

			//make menu visible
			offcanvas.css( { 'visibility': 'visible' } );

			//toggle menu
			menuBtn.on( 'click', function() {
				toggleOffcanvas();
			} );

			//close menu when clicking site overlay
			siteOverlay.on( 'click', function() {
				toggleOffcanvas();
			} );

		} else {
			//add css class to body
			body.addClass( 'no-csstransforms3d' );

			//hide menu by default
			if ( offcanvas.hasClass( offcanvasLeft ) ) {
				offcanvas.css( { left: "-" + menuWidth } );
			} else {
				offcanvas.css( { right: "-" + menuWidth } );
			}

			//make menu visible
			offcanvas.css( { 'visibility': 'visible' } );
			//fixes IE scrollbar issue
			container.css( { "overflow-x": "hidden" } );

			//keep track of menu state (open/close)
			var opened = false;

			//toggle menu
			menuBtn.on( 'click', function() {
				if ( opened ) {
					closeOffcanvasFallback();
					opened = false;
				} else {
					openOffcanvasFallback();
					opened = true;
				}
			} );

			//close menu when clicking site overlay
			siteOverlay.on( 'click', function() {
				if ( opened ) {
					closeOffcanvasFallback();
					opened = false;
				} else {
					openOffcanvasFallback();
					opened = true;
				}
			} );
		}
	}( jQuery ) );

	/**
	 * Always Sticky Navigation
	 */

	var stickyElements = $( '.sticky-sidebar-enabled.stick-last .sidebar .widget:last-child, .sticky-sidebar-enabled .post-sidebar .bsb-wrap' );

	$( document ).ready( function() {

		var stickyNav = $( '.navbar-sticky-enabled .navbar-primary' );

		if ( stickyNav.length ) {

			var sticky = new Waypoint.Sticky( {
				element: $( stickyNav )[ 0 ],
				stuckClass: 'navbar-stuck',
			} );

			$( stickyElements ).css( 'top', 32 + adminBarHeight + navBarHeight + 'px' );

			var resizeTimer;

			$( window ).on( 'resize', function( e ) {

				clearTimeout( resizeTimer );
				resizeTimer = setTimeout( function() {

					sticky.destroy();
					sticky = new Waypoint.Sticky( {
						element: $( '.navbar-sticky-enabled .navbar-primary' )[ 0 ],
						stuckClass: 'navbar-stuck',
					} );

					$( stickyElements ).css( 'top', 32 + adminBarHeight + navBarHeight + 'px' );

				}, 250 );

			} );

		}

	} );

	/**
	 * Smart Sticky Navigation
	 */

	$( document ).ready( function() {

		var smartNav = $( '.navbar-smart-enabled .navbar-primary' );

		if ( smartNav.length ) {

			var previousScroll = 0,
				navbarOffset = $( '.site-header' ).offset().top + $( '.site-header' ).height() - smartNav.height();

			// Event on scrolling down past the header.
			var waypointsHeaderDown = $( '.site-header' ).waypoint( function( direction ) {
				if ( direction === 'down' ) {
					if ( !$( smartNav ).parent().hasClass( 'sticky-wrapper' ) ) {
						$( smartNav ).wrap( '<div class="sticky-wrapper"></div>' );
						$( '.sticky-wrapper' ).height( smartNav.height() );
						$( smartNav ).addClass( 'navbar-stuck' );
					}
				}
			}, {
				offset: -headerHeight
			} );

			// Event on scrolling up past the header.
			var waypointsHeaderUp = $( '.site-header' ).waypoint( function( direction ) {
				if ( direction === 'up' ) {
					if ( $( smartNav ).parent().hasClass( 'sticky-wrapper' ) ) {
						$( smartNav ).unwrap();
						$( smartNav ).removeClass( 'navbar-stuck' );
						$( smartNav ).css( 'transition', 'none' );
						$( smartNav ).removeClass( 'navbar-visible' );
					}
				}
			}, {
				offset: -$( '.site-header' ).height() + smartNav.height() - 0.0001
			} );

			// Recalc header offset on window resize.
			$( window ).resize( function() {
				navbarOffset = $( '.site-header' ).offset().top + $( '.site-header' ).height() - smartNav.height();
			} );

			// Hide / show navigation on scroll up and down.
			$( window ).scroll( function() {
				// Check if we scrolled past header area.
				if ( $( this ).scrollTop() > navbarOffset ) {
					if ( $( this ).scrollTop() > previousScroll ) {
						// Hide navbar on scroll down
						smartNav.removeClass( 'navbar-visible' );
						// Move the sticky sidebar content back up.
						if ( $( window ).width() >= 1020 ) {
							$( stickyElements ).css( 'top', 32 + adminBarHeight + 'px' );
						}
					} else {
						// Show navbar on scroll up
						smartNav.addClass( 'navbar-visible' );
						smartNav.css( 'transition', '.2s ease all' );
						// Move the sticky sidebar content down by the height of the navbar.
						if ( $( window ).width() >= 1020 ) {
							$( stickyElements ).css( 'top', 32 + navBarHeight + adminBarHeight + 'px' );
						}
					}
				}
				previousScroll = $( this ).scrollTop();
			} );

		}
	} );

	/**
	 * Parallax
	 */

	function initParallax() {

		$( '.parallax-enabled .parallax:not(.parallax-video)' ).each( function() {

			$( this ).jarallax( {
				speed: 0.8,
			} );

		} );

		var parallaxVideo = $( '.parallax-video' ),
			speed = 0.8;

		if ( !$( 'body' ).hasClass( 'parallax-enabled' ) ) {
			speed = 1;
		}

		$( parallaxVideo ).each( function() {

			if ( !$( this ).hasClass( 'parallax' ) ) {
				speed = 1;
			}

			$( this ).jarallax( {
				speed: speed,
				videoSrc: $( this ).attr( 'data-video' ),
				videoStartTime: $( this ).data( 'start' ),
				videoEndTime: $( this ).data( 'end' ),
			} );

		} );

	}

	$( document ).ready( function() {
		initParallax();
		$( 'body' ).on( 'csco-post-load', function() {
			initParallax();
		} );
	} );

	/**
	 * Large Page Header
	 */

	var pageHeader = $( '.page-header-large' ),
		pageHeaderOuter = $( '.overlay-outer', pageHeader );

	// Function for calculating Page Header height.

	function setPageHeaderHeight() {

		// Redefine variables.
		pageHeader = $( '.page-header-large' );
		pageHeaderOuter = $( '.overlay-outer', pageHeader );

		// Define heights.
		var contentHeight = $( '.overlay-inner', pageHeader ).innerHeight(),
			offsetHeight = adminBarHeight + headerHeight,
			availableHeight = windowHeight - offsetHeight,
			viewPortHeight = '100vh';

		// Offset page header.
		pageHeader.css( 'margin-top', '-' + offsetHeight + 'px' );
		pageHeaderOuter.css( 'padding-top', offsetHeight + 'px' );

		// Set the page header height.
		if ( availableHeight >= contentHeight ) {
			pageHeaderOuter.css( 'height', viewPortHeight );
		} else {
			pageHeaderOuter.css( 'height', contentHeight + offsetHeight + 'px' );
		}

		// Return if overlay position is set to bottom.
		if ( $( 'body' ).hasClass( 'style-align-left' ) ) {
			return;
		}

		// Add extra padding, if possible.
		if ( availableHeight - offsetHeight >= contentHeight ) {
			pageHeaderOuter.css( 'padding-bottom', offsetHeight + 'px' );
		} else {
			pageHeaderOuter.css( 'padding-bottom', 0 );
		}
	}

	// Set initial height.

	$( document ).ready( function() {
		setPageHeaderHeight();
	} );

	// Recalculate height on resize.

	$( window ).resize( function() {
		setPageHeaderHeight();
	} );

	/**
	 * Masonry Archive
	 */

	function initMasonry() {

		var masonryArchive = $( '.archive-masonry' ),
			masonryArchiveOptions = {
				columns: '.archive-col',
				items: '.post-masonry, .post-featured, .widget'
			};

		$( masonryArchive ).imagesLoaded( function() {
			$( masonryArchive ).colcade( masonryArchiveOptions );
		} );

		/**
		 * Masonry Sidebar
		 */

		var masonrySidebar = $( '.sidebar-area' ),
			masonrySidebarOptions = {
				columns: '.sidebar',
				items: ' .widget'
			};

		$( masonrySidebar ).imagesLoaded( function() {
			$( masonrySidebar ).colcade( masonrySidebarOptions );
		} );

	}

	$( document ).ready( function() {
		initMasonry();
	} );

	/**
	 * Fullscreen Search
	 */

	$( 'a[href="#search"]' ).on( 'click', function( event ) {
		event.preventDefault();
		$( '#search' ).addClass( 'open' );
		$( '#search input[type="search"]' ).focus();
		$( 'body' ).addClass( 'search-open' );
	} );

	$( '#search, #search button.close' ).on( 'click keyup', function( event ) {
		if ( event.target === this || event.target.className === 'close' || event.keyCode === 27 ) {
			event.preventDefault();
			$( this ).removeClass( 'open' );
			$( 'body' ).removeClass( 'search-open' );
		}
	} );

	/**
	 * Scroll To Top
	 */

	// Click event.

	$( 'a[href="#top"]' ).click( function() {
		$( 'html, body' ).animate( { scrollTop: 0 }, 'slow' );
		return false;
	} );

	// Show the button after scrolling past 800 pixels.

	$( document ).scroll( function() {
		var y = $( this ).scrollTop();
		if ( y > 800 ) {
			$( '.scroll-to-top' ).css( { 'opacity': 1 } );
		} else {
			$( '.scroll-to-top' ).css( { 'opacity': 0 } );
		}
	} );

	/**
	 * Pin It
	 */

	$.fn.pinIt = function() {

		$( this ).each( function() {

			if ( $( this ).hasClass( 'csco-pin-it-ready' ) ) {
				return;
			}

			if ( !( $( this ).width() > 120 && $( this ).height() > 120 ) ) {
				$( this ).addClass( 'csco-pin-it-ready' );
				return;
			}

			var container = $( this ).parent(),
				postURL = $( location ).attr( 'href' ),
				pinURL;

			if ( $( container ).is( 'a' ) ) {

				var imagehref = $( container ).attr( 'href' );

				if ( typeof imagehref !== 'undefined' && imagehref.match( /\.(gif|jpeg|jpg|png)/ ) ) {
					pinURL = imagehref;
				}

				if ( !( $( container ).closest( 'figure' ).length ) ) {
					$( container ).wrap( '<figure class="pin-it-container"></figure>' );
				}

				container = $( container ).parent();

			} else {

				if ( !( $( container ).is( 'figure' ) || $( container ).closest( 'figure' ).length ) ) {
					$( this ).wrap( '<figure class="pin-it-container"></figure>' );
				}

				container = $( this ).parent();

			}

			if ( !$( this ).closest( 'figure' ).hasClass( 'pin-it-container' ) ) {
				$( this ).closest( 'figure' ).addClass( 'pin-it-container' );
			}

			if ( !pinURL ) {
				if ( $( this ).is( 'img' ) ) {
					pinURL = ( typeof $( this ).data( 'src' ) !== 'undefined' ) ? $( this ).data( 'src' ) : $( this ).attr( 'src' );
				} else {
					pinURL = ( typeof $( container ).find( 'img' ).data( 'src' ) !== 'undefined' ) ? $( container ).find( 'img' ).data( 'src' ) : $( container ).find( 'img' ).attr( 'src' );
				}
			}

			pinURL = encodeURIComponent( pinURL );
			postURL = encodeURIComponent( postURL );

			var figure = container;

			if ( !$( container ).is( 'figure' ) ) {
				figure = $( container ).closest( 'figure' );
			}

			// Get caption text.
			var imgDescription = $( figure ).find( '.wp-caption-text' ).text();

			if ( !imgDescription ) {
				// Get image alt attribute if there's no caption.
				imgDescription = $( figure ).find( 'img' ).attr( 'alt' );
			}

			if ( imgDescription ) {
				// Add attribute to share URL.
				imgDescription = '&amp;description=' + encodeURIComponent( imgDescription );
			}

			// Img classes.
			var imgClasses = [ 'alignnone', 'aligncenter', 'alignleft', 'alignright' ];

			imgClasses.forEach( function( el ) {
				if ( $( container ).find( 'img' ).hasClass( el ) ) {
					$( container ).find( 'img' ).removeClass( el );
					$( container ).find( 'img' ).closest( 'figure' ).addClass( el );

					// Add width to figure.
					var imgWidth = $( container ).find( 'img' ).attr( 'width' );

					if ( parseInt( imgWidth ) !== 'NaN' ) {
						$( container ).find( 'img' ).closest( 'figure' ).width( imgWidth );
					}
				}
			} );

			$( container ).hover( function() {

				$( '<a class="pin-it btn btn-primary btn-lg btn-effect" href="http://www.pinterest.com/pin/create/bookmarklet/?url=' + postURL + '&amp;media=' + pinURL + imgDescription + '&is_video=false" target="_blank"><span>Pin</span><span><i class="icon icon-pinterest"></i></span></a>' )
					.appendTo( this )
					.addClass( 'pin-it-visible' );

			}, function() {
				$( this ).children( '.pin-it' ).remove();
			} );

			$( this ).addClass( 'csco-pin-it-ready' );

		} );

	};


	function initPinIt() {

		if ( !$( 'body' ).hasClass( 'pin-it-enabled' ) ) {
			return;
		}

		$( '.content, .post-media' ).imagesLoaded( function() {

			// All figures in the post content, except for galleries.
			$( '.content img' ).not( '.gallery figure img' ).pinIt();

			// All figures in default galleries.
			$( '.gallery:not(.gallery-type-slider):not(.gallery-type-justified) img' ).pinIt();

			// Figure in image post format in post media section in single posts.
			$( '.single-format-image .post-media img' ).pinIt();

			// Figure in standard post format in post media section in single posts.
			$( '.single-format-standard .post-media img' ).pinIt();

			// Figure in default post format in post media section in post archives.
			$( '.post-archive .format-standard .post-media img' ).pinIt();

			// Figure in image post format in post media section in post archives.
			$( '.post-archive .format-image .post-media img' ).pinIt();

			// Figure in tiled galleries.
			$( '.post-media .tiled-gallery img' ).pinIt();

		} );

	}

	$( document ).ready( function() {
		initPinIt();
		$( 'body' ).on( 'csco-post-load', function() {
			initPinIt();
		} );
	} );

	/**
	 * Image Lightboxes
	 */

	function initLightBox() {

		// All figures in post content, except for any galleries.

		$( '.lightbox-enabled .content img' ).not( '.gallery img' ).each( function() {

			var container = $( this ).parent();

			if ( !$( container ).is( 'a' ) ) {
				return;
			}

			var imagehref = $( container ).attr( 'href' );

			if ( !imagehref.match( /\.(gif|jpeg|jpg|png)/ ) ) {
				return;
			}

			if ( !( $( container ).closest( 'figure' ).length ) ) {
				$( container ).wrap( '<figure class="lightbox-container"></figure>' );
			}

			if ( !$( container ).closest( 'figure' ).hasClass( 'lightbox-container' ) ) {
				$( container ).closest( 'figure' ).addClass( 'lightbox-container' );
			}

			// Img classes.
			var imgClasses = [ 'alignnone', 'aligncenter', 'alignleft', 'alignright' ];

			imgClasses.forEach( function( el ) {
				if ( $( container ).find( 'img' ).hasClass( el ) ) {
					$( container ).find( 'img' ).removeClass( el );
					$( container ).find( 'img' ).closest( 'figure' ).addClass( el );

					// Add width to figure.
					var imgWidth = $( container ).find( 'img' ).attr( 'width' );

					if ( parseInt( imgWidth ) !== 'NaN' ) {
						$( container ).find( 'img' ).closest( 'figure' ).width( imgWidth );
					}
				}
			} );

			container = $( container ).parent();

			$( '> a', container ).addClass( 'image-popup' );
			$( container ).magnificPopup( {
				delegate: '.image-popup',
				type: 'image',
				tClose: translation.close + '(Esc)',
				tLoading: translation.loading,
				image: {
					titleSrc: function( item ) {
						return item.el.next( '.wp-caption-text' ).text();
					}
				},
			} );
		} );

		// All figures in grid and slider galleries.

		$( '.lightbox-enabled .gallery' ).not( '.gallery-type-justified' ).each( function() {
			if ( $( this ).data( 'carousel-extra' ) && null !== $( this ).data( 'carousel-extra' ) ) {
				return;
			}
			var href = $( 'figure a', this ).attr( 'href' );
			if ( href && href.match( /\.(gif|jpeg|jpg|png)/ ) ) {
				$( 'figure a', this ).addClass( 'image-popup' );
				$( this ).magnificPopup( {
					delegate: '.image-popup',
					type: 'image',
					tClose: translation.close + '(Esc)',
					tLoading: translation.loading,
					image: {
						titleSrc: function( item ) {
							return item.el.closest( '.gallery-item' ).find( '.wp-caption-text' ).text();
						}
					},
					gallery: {
						enabled: true,
						tPrev: translation.previous,
						tNext: translation.next,
					}
				} );
			}
		} );

		// All figures in tiled galleries.

		$( '.lightbox-enabled .tiled-gallery' ).each( function() {
			if ( null !== $( this ).data( 'carousel-extra' ) ) {
				return;
			}
			var href = $( '.tiled-gallery-item a', this ).first().attr( 'href' );
			if ( href && href.match( /\.(gif|jpeg|jpg|png)/ ) ) {
				$( '.tiled-gallery-item a', this ).addClass( 'image-popup' );
				$( this ).magnificPopup( {
					delegate: '.image-popup',
					type: 'image',
					tClose: translation.close + '(Esc)',
					tLoading: translation.loading,
					image: {
						titleSrc: function( item ) {
							return item.el.closest( '.tiled-gallery-item' ).find( '.tiled-gallery-caption' ).text();
						}
					},
					gallery: {
						enabled: true,
						tPrev: translation.previous,
						tNext: translation.next,
					}
				} );
			}
		} );

		// Figure in image post format in post media section in single posts.

		$( '.lightbox-enabled.single-format-image .post-media figure > a, .lightbox-enabled.single-format-standard .post-media figure > a' ).addClass( 'image-popup' ).magnificPopup( {
			type: 'image',
			tClose: translation.close + '(Esc)',
			tLoading: translation.loading,
			gallery: {
				enabled: false,
				tPrev: translation.previous,
				tNext: translation.next,
			}
		} );
	}

	$( document ).ready( function() {
		initLightBox();
		$( 'body' ).on( 'csco-post-load', function() {
			initLightBox();
		} );
	} );

	/**
	 * Sliders
	 */

	// Slider Parallax

	var owlSlide = $( '.parallax-enabled .slider-featured .slide-parallax:not(.slide-video)' );
	var owlVideo = $( '.slide-video' );

	// Init Hook

	function onInitialized( event ) {

		var $container = $( event.target );

		owlSlide = $( '.parallax-enabled .slider-featured .slide-parallax:not(.slide-video)' );
		$( '.overlay-media', owlSlide ).each( function() {

			$( this ).jarallax( {
				speed: 0.8,
				elementInViewport: $container,
				noIos: false,
			} );

			$( this ).attr( 'data-parallax', 'image' );

		} );

		owlVideo = $( '.slide-video' );

		$( owlVideo ).each( function() {

			var videoSrc = $( this ).data( 'video' ),
				videoStartTime = $( this ).data( 'start' ),
				videoEndTime = $( this ).data( 'end' ),
				speed = 0.8;

			if ( !$( this ).hasClass( 'slide-parallax' ) ) {
				speed = 1;
			}

			$( '.overlay-media', this ).jarallax( {
				speed: speed,
				videoSrc: videoSrc,
				videoStartTime: videoStartTime,
				videoEndTime: videoEndTime,
				elementInViewport: $container,
				noIos: false,
			} );

			$( '.overlay-media', this ).attr( 'data-parallax', 'video' );

		} );

		// Recalc Waypoints.
		Waypoint.refreshAll();

	}

	// Resize Hook

	function onResized() {
		// Reinit Parallax.
		owlSlide = $( '.parallax-enabled .slider-featured .slide-parallax .overlay-media' );

		$( owlSlide ).each( function() {
			if ( $( this ).attr( 'data-parallax' ) ) {
				$( this ).jarallax( 'clipContainer' ).jarallax( 'coverImage' ).jarallax( 'onScroll' );
			}
		} );
	}

	// Center

	var sliderCenter = $( '.slider-center' );

	sliderCenter.each( function() {

		function setArrowWidth( event ) {
			var carousel = $( event.target );
			$( '.owl-arrows > div', carousel.parent() ).css( 'width', ( carousel.innerWidth() - $( '.owl-item.center', carousel ).innerWidth() - carousel.parent().data( 'padding' ) * 2 ) / 2 + 'px' );
		}

		function sliderCenterInitialized( event ) {
			setArrowWidth( event );
			onInitialized( event );
		}

		function sliderCenterResized( event ) {
			setArrowWidth( event );
			onResized();
		}

		var container = $( this );
		var owl = $( '.owl-carousel', container );

		owl.owlCarousel( {
			autoplay: $( this ).data( 'autoplay' ),
			autoplayTimeout: $( this ).data( 'timeout' ),
			autoplayHoverPause: true,
			dragEndSpeed: 500,
			smartSpeed: 500,
			dotsContainer: $( '.owl-dots', container ),
			navContainer: $( '.owl-arrows', container ),
			navText: [ '', '' ],
			autoHeight: true,
			rtl: rtl,
			responsive: {
				0: {
					items: 1,
					loop: false,
					margin: 0,
					dots: true,
					nav: false,
				},
				1240: {
					center: true,
					items: 3,
					loop: true,
					margin: $( this ).data( 'padding' ),
					autoWidth: true,
					dots: false,
					nav: true,
				}
			},
			onInitialized: sliderCenterInitialized,
			onResized: sliderCenterResized,
		} );

	} );

	// Boxed

	var sliderBoxed = $( '.slider-boxed' );

	sliderBoxed.each( function() {

		var container = this;
		var owl = $( '.owl-carousel', this );

		owl.owlCarousel( {
			autoplay: $( this ).data( 'autoplay' ),
			autoplayTimeout: $( this ).data( 'timeout' ),
			autoplayHoverPause: true,
			dragEndSpeed: 500,
			smartSpeed: 500,
			items: 1,
			margin: 0,
			autoHeight: true,
			navText: [
				'<div class="btn btn-primary btn-effect"><span><i style="display: inline-block;width: 7px;height: 17px;padding: 0;padding-bottom: 45px;"><img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMy4zIDUuMSIgc3R5bGU9IndpZHRoOjhweDtoZWlnaHQ6MTdweDtmaWxsOndoaXRlO2VuYWJsZS1iYWNrZ3JvdW5kOnRyYW5zcGFyZW50OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggaWQ9IlhNTElEXzI4XyIgY2xhc3M9InN0MCIgZD0iTTMuMyw1LjFMMCwyLjVMMy4zLDBMMS44LDIuNkwzLjMsNS4xeiI+PC9wYXRoPjwvc3ZnPg==" style="width: 8px;height: 18px;transform: rotate(90deg);padding-top: 7px;"></i></span><span><i style="display: inline-block;width: 7px;height: 17px;padding: 0;padding-bottom: 45px;"><img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMy4zIDUuMSIgc3R5bGU9IndpZHRoOjhweDtoZWlnaHQ6MTdweDtmaWxsOndoaXRlO2VuYWJsZS1iYWNrZ3JvdW5kOnRyYW5zcGFyZW50OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggaWQ9IlhNTElEXzI4XyIgY2xhc3M9InN0MCIgZD0iTTMuMyw1LjFMMCwyLjVMMy4zLDBMMS44LDIuNkwzLjMsNS4xeiI+PC9wYXRoPjwvc3ZnPg==" style="width: 8px;height: 18px;transform: rotate(90deg);padding-top: 7px;"></i></span></div>',
				'<div class="btn btn-primary btn-effect"><span><i style="display: inline-block;width: 7px;height: 17px;padding: 0;padding-bottom: 45px;"><img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMy4zIDUuMSIgc3R5bGU9IndpZHRoOjhweDtoZWlnaHQ6MTdweDtmaWxsOndoaXRlO2VuYWJsZS1iYWNrZ3JvdW5kOnRyYW5zcGFyZW50OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggaWQ9IlhNTElEXzI4XyIgY2xhc3M9InN0MCIgZD0iTTMuMyw1LjFMMCwyLjVMMy4zLDBMMS44LDIuNkwzLjMsNS4xeiI+PC9wYXRoPjwvc3ZnPg==" style="width: 8px;height: 18px;transform: rotate(90deg);padding-top: 7px;"></i></span><span><i style="display: inline-block;width: 7px;height: 17px;padding: 0;padding-bottom: 45px;"><img src="data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMy4zIDUuMSIgc3R5bGU9IndpZHRoOjhweDtoZWlnaHQ6MTdweDtmaWxsOndoaXRlO2VuYWJsZS1iYWNrZ3JvdW5kOnRyYW5zcGFyZW50OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggaWQ9IlhNTElEXzI4XyIgY2xhc3M9InN0MCIgZD0iTTMuMyw1LjFMMCwyLjVMMy4zLDBMMS44LDIuNkwzLjMsNS4xeiI+PC9wYXRoPjwvc3ZnPg==" style="width: 8px;height: 18px;transform: rotate(90deg);padding-top: 7px;"></i></span></div>'
			],
			dots: true,
			dotsContainer: $( '.owl-dots', container ),
			navContainer: $( '.owl-arrows', container ),
			rtl: rtl,
			responsive: {
				0: {
					nav: false,
				},
				1020: {
					nav: true,
					loop: true
				}
			},
			onInitialized: onInitialized,
			onResized: onResized,
		} );

	} );

	// Large

	var sliderLarge = $( '.slider-large' ),
		sliderLargeOuter = $( '.overlay-outer', sliderLarge );

	function sliderLargePosition() {

		// Redefine variables.
		sliderLarge = $( '.slider-large' );
		sliderLargeOuter = $( '.overlay-outer', sliderLarge );

		// Define heights.
		var owlSlide = $( '.post-outer', sliderLarge ),
			contentHeight = $( '.overlay-inner', owlSlide ).innerHeight(),
			offsetHeight = adminBarHeight + headerHeight,
			availableHeight = windowHeight - offsetHeight,
			viewPortHeight = '100vh';

		// Offset page header.
		sliderLarge.css( 'margin-top', -offsetHeight + 'px' );
		sliderLargeOuter.css( 'padding-top', offsetHeight + 'px' );

		// Set the slider height.
		if ( availableHeight >= contentHeight ) {
			sliderLargeOuter.css( 'height', viewPortHeight );
		} else {
			sliderLargeOuter.css( 'height', contentHeight + offsetHeight + 'px' );
		}

		// Return if overlay variant is set to bottom.
		if ( $( 'body' ).hasClass( 'style-align-left' ) ) {
			return;
		}

		// Add extra padding, if possible.
		if ( availableHeight - offsetHeight >= contentHeight ) {
			sliderLargeOuter.css( 'padding-bottom', offsetHeight + 'px' );
		} else {
			sliderLargeOuter.css( 'padding-bottom', 0 );
		}
	}

	function sliderLargeInitialized( event ) {
		sliderLargePosition();
		onInitialized( event );
	}

	function sliderLargeResized( event ) {
		sliderLargePosition();
		onResized();
	}

	sliderLarge.each( function() {

		var container = this,
			owl = $( '.owl-carousel', this ),
			autoHeight = false;

		if ( $( 'body' ).hasClass( 'style-type-classic' ) ) {
			autoHeight = true;
		}

		owl.owlCarousel( {
			autoplay: $( this ).data( 'autoplay' ),
			autoplayTimeout: $( this ).data( 'timeout' ),
			autoplayHoverPause: true,
			dragEndSpeed: 500,
			smartSpeed: 500,
			autoHeight: autoHeight,
			items: 1,
			margin: 0,
			navText: [
				'<div class="btn btn-primary btn-effect"><span><i class="icon icon-chevron-up"></i></span><span>' + translation.previous + '</span></div>',
				'<div class="btn btn-primary btn-effect"><span><i class="icon icon-chevron-up"></i></span><span>' + translation.next + '</span></div>'
			],
			dots: true,
			dotsContainer: $( '.owl-dots', container ),
			navContainer: $( '.owl-arrows', container ),
			rtl: rtl,
			responsive: {
				0: {
					nav: false,
				},
				1020: {
					nav: true,
					loop: true,
				}
			},
			onInitialized: sliderLargeInitialized,
			onTranslated: sliderLargePosition,
			onResized: sliderLargeResized,
		} );

	} );

	// Recalc slider on vertical window resize.
	$( window ).resize( function() {
		if ( $( window ).width() === windowWidth ) {
			return;
		}
		windowWidth = $( window ).width();
		sliderLargeResized();
	} );

	// Multiple

	var sliderMultiple = $( '.slider-multiple' );

	sliderMultiple.each( function() {

		var container = this;
		var owl = $( '.owl-carousel', this );

		owl.owlCarousel( {
			autoplay: $( this ).data( 'autoplay' ),
			autoplayTimeout: $( this ).data( 'timeout' ),
			autoplayHoverPause: true,
			dragEndSpeed: 500,
			smartSpeed: 500,
			navContainer: $( '.owl-arrows', container ),
			navText: [ '', '' ],
			dots: true,
			dotsContainer: $( '.owl-dots', container ),
			autoHeight: true,
			rtl: rtl,
			responsive: {
				0: {
					nav: false,
					loop: false,
					margin: 0,
					stagePadding: 0,
					items: 1,
				},
				1120: {
					nav: true,
					loop: true,
					margin: $( this ).data( 'padding' ),
					stagePadding: 90,
					items: $( this ).data( 'slides-visible' ),
				}
			},
			onInitialized: onInitialized,
			onResized: onResized,
		} );

	} );

	// Simple

	function initSliderSimple() {

		var sliderSimple = $( '.gallery-type-slider' );

		function onTranslated( event ) {
			setTimeout( function() {
				Waypoint.refreshAll();
			}, 1000 );
		}

		function onInitialized( event ) {
			var container = $( event.target );
			if ( $( 'body' ).hasClass( 'pin-it-enabled' ) ) {
				$( 'img', container ).pinIt();
			}
			Waypoint.refreshAll();
		}

		sliderSimple.each( function() {

			var container = this,
				owl = $( '.owl-carousel', this );

			if ( $( owl ).hasClass( 'owl-loaded' ) ) {
				return;
			}

			$( container ).prepend( '<div class="images-loading"></div>' );

			$( owl ).imagesLoaded( function() {

				owl.parent().find( '.images-loading' ).remove();

				owl.owlCarousel( {
					dragEndSpeed: 250,
					smartSpeed: 250,
					autoHeight: true,
					items: 1,
					margin: 0,
					navText: [
						'<div class="btn btn-primary btn-effect"><span><i class="icon icon-chevron-up"></i></span><span>' + translation.previous + '</span></div>',
						'<div class="btn btn-primary btn-effect"><span><i class="icon icon-chevron-up"></i></span><span>' + translation.next + '</span></div>'
					],
					navContainer: $( '.owl-arrows', container ),
					dots: true,
					dotsContainer: $( '.owl-dots', container ),
					rtl: rtl,
					responsive: {
						0: {
							nav: false,
						},
						1020: {
							nav: true,
						}
					},
					onInitialized: onInitialized,
					onTranslated: onTranslated,
				} );

			} );

		} );
	}

	$( document ).ready( function() {
		initSliderSimple();
		$( 'body' ).on( 'csco-post-load', function() {
			initSliderSimple();
		} );
	} );

	// Flip

	function initSliderFlip() {

		var sliderFlip = $( '.slider-flip' );

		function sliderFlipInitialized() {
			Waypoint.refreshAll();
		}

		sliderFlip.each( function() {

			var container = this,
				owl = $( '.owl-carousel', this ),
				effectOut = 'flipOut',
				effectIn = 'flipIn';

			if ( isIE ) {
				effectOut = 'fadeOut';
				effectIn = 'fadeIn';
			}

			$( owl ).imagesLoaded( function() {

				owl.owlCarousel( {
					dragEndSpeed: 250,
					smartSpeed: 250,
					autoHeight: true,
					animateOut: effectOut,
					animateIn: effectIn,
					items: 1,
					margin: 0,
					dots: true,
					dotsContainer: $( '> .owl-dots', container ),
					rtl: rtl,
					onInitialized: sliderFlipInitialized,
				} );

			} );

		} );

	}

	$( document ).ready( function() {
		initSliderFlip();
		$( 'body' ).on( 'csco-post-load', function() {
			initSliderFlip();
		} );
	} );

	// Loop

	var sliderLoop = $( '.slider-loop' );

	sliderLoop.each( function() {

		var container = this;
		var owl = $( '.owl-carousel', this );

		$( container ).prepend( '<div class="images-loading"></div>' );

		$( owl ).imagesLoaded( function() {

			owl.parent().find( '.images-loading' ).remove();

			owl.owlCarousel( {
				dragEndSpeed: 250,
				smartSpeed: 250,
				autoHeight: true,
				dots: true,
				dotsContainer: $( '> .owl-dots', container ),
				rtl: rtl,
				responsive: {
					0: {
						items: 1,
						margin: 0,
					},
					760: {
						items: 2,
						margin: 40,
					},
					1020: {
						items: 3,
						margin: 30,
					},
					1120: {
						items: 3,
						margin: 40,
					},
					1240: {
						items: $( container ).data( 'columns' ),
						margin: 30,
					},
					1640: {
						items: $( container ).data( 'columns' ),
						margin: 40,
					},
				},
			} );

		} );

	} );

	/**
	 * Justified Gallery
	 */

	function initJustifiedGallery() {

		$( '.gallery-type-justified' ).each( function() {

			var rowHeight = 300;

			if ( $( this ).closest( 'article' ).length && $( 'body' ).hasClass( 'layout-sidebar' ) ) {
				rowHeight = 200;
			}

			$( this ).justifiedGallery( {
				border: 0,
				margins: 10,
				lastRow: 'justify',
				rowHeight: rowHeight,
				selector: 'figure',
				captions: true,
				maxRowHeight: '200%',
				cssAnimation: true,
				captionSettings: {
					animationDuration: 100,
					visibleOpacity: 1.0,
					nonVisibleOpacity: 0.0
				}
			} ).on( 'jg.complete', function( e ) {
				$( '.pin-it-enabled' ).find( $( 'img', this ) ).pinIt();
				var href = $( 'figure > a', this ).attr( 'href' );
				if ( href && href.match( /\.(gif|jpeg|jpg|png)/ ) ) {
					$( 'figure > a', this ).addClass( 'image-popup' );
					$( this ).magnificPopup( {
						delegate: '.image-popup',
						type: 'image',
						tClose: translation.close + '(Esc)',
						tLoading: translation.loading,
						image: {
							titleSrc: function( item ) {
								return item.el.next( '.caption' ).text();
							}
						},
						gallery: {
							enabled: true,
							tPrev: translation.previous,
							tNext: translation.next,
						}
					} );
				}
			} );

		} );

	}

	$( document ).ready( function() {
		initJustifiedGallery();
		$( 'body' ).on( 'csco-post-load', function() {
			initJustifiedGallery();
		} );
	} );

	/**
	 * Waypoints
	 */

	// Fix waypoints on older versions.
	if ( !$.isFunction( $.waypoints ) && $.isFunction( jQuery.fn.waypoint ) ) {
		$.waypoints = jQuery.fn.waypoint;
	}

	/*
	var waypointsTopShareButtons = $( '.content > .gallery' ).waypoint( function( direction ) {
		if ( direction === 'down' ) {
			$( '.post-sidebar .sticky' ).css( 'opacity', '0' );
		} else {
			$( '.post-sidebar .sticky' ).css( 'opacity', '1' );
		}
	}, {
		offset: function() {
			var element = $( '.post-sidebar .sticky' );
			return element.height() + 96;
		}
	} );


	var waypointsBottomShareButtons = $( '.content > .gallery' ).waypoint( function( direction ) {
		if ( direction === 'down' ) {
			$( '.post-sidebar .sticky' ).css( 'opacity', '1' );
		} else {
			$( '.post-sidebar .sticky' ).css( 'opacity', '0' );
		}
	}, {
		offset: function() {
			var element = $( '.content > .gallery' );
			return -element.height();
		}
	} );
	*/

	/**
	 * Prev / Next Post Pagination
	 */

	// Display pagination on scrolling past article content.
	var waypointsPageContent = $( '.single-post .site-main > article' ).waypoint( function( direction ) {
		if ( direction === 'down' ) {
			$( '.post-pagination' ).addClass( 'pagination-visible' );
		} else {
			$( '.post-pagination' ).removeClass( 'pagination-visible' );
		}
	} );

	// Hide pagination on scrolling near footer.
	var waypointsSiteFooter = $( '.single-post .site-footer' ).waypoint( function( direction ) {
		if ( direction === 'down' ) {
			$( '.post-pagination' ).removeClass( 'pagination-visible' );
		} else {
			$( '.post-pagination' ).addClass( 'pagination-visible' );
		}
	}, {
		offset: 300
	} );


	/**
	 * AJAX Load More.
	 *
	 * Contains functions for AJAX Load More.
	 */


	/**
	 * Check if Load More is defined by the wp_localize_script
	 */
	if ( typeof csco_ajax_pagination !== 'undefined' ) {

		$( '.post-archive .archive-pagination' ).append( '<span class="load-more btn btn-lg btn-primary">' + csco_ajax_pagination.translation.load_more + '</span>' );

		var query_args = $.parseJSON( csco_ajax_pagination.query_args ),
			infinite = $.parseJSON( query_args.infinite_load ),
			button = $( '.post-archive .load-more' ),
			page = 2,
			loading = false,
			scrollHandling = {
				allow: infinite,
				reallow: function() {
					scrollHandling.allow = true;
				},
				delay: 400 //(milliseconds) adjust to the highest acceptable value
			};

	}

	/**
	 * Get next posts
	 */
	function csco_ajax_get_posts() {
		loading = true;
		// Set button text to Load More.
		button.text( csco_ajax_pagination.translation.loading );
		var data = {
			action: 'csco_ajax_load_more',
			nonce: csco_ajax_pagination.nonce,
			page: page,
			query_vars: csco_ajax_pagination.query_vars,
			query_args: csco_ajax_pagination.query_args,
		};

		// Request Url.
		var csco_pagination_url;
		if ( 'ajax_restapi' === csco_ajax_pagination.type ) {
			csco_pagination_url = csco_ajax_pagination.rest_url;
		} else {
			csco_pagination_url = csco_ajax_pagination.url;
		}

		// Send Request.
		$.post( csco_pagination_url, data, function( res ) {
			if ( res.success ) {

				// Get the posts.
				var data = $( res.data.content );

				// Check if there're any posts.
				if ( data.length ) {

					data.imagesLoaded( function() {

						// Append new posts to list, standard and grid archives.
						$( '.archive-main.archive-list, .archive-main.archive-standard, .archive-main.archive-grid' ).append( data );

						// Append new posts to masonry layout.
						$( '.archive-main.archive-masonry' ).colcade( 'append', data );

						// Trigger hooked actions.
						$( document.body ).trigger( 'csco-post-load' );

						// WP Post Load trigger.
						$( document.body ).trigger( 'post-load' );

						// Reinit Facebook widgets.
						if ( $( '#fb-root' ).length ) {
							FB.XFBML.parse();
						}

						// Set button text to Load More.
						button.text( csco_ajax_pagination.translation.load_more );

						// Increment a page.
						page = page + 1;

						// Set the loading state.
						loading = false;

					} );

				}

				// Remove Button on Posts End.
				if ( res.data.posts_end || !data.length ) {

					// Remove Load More button.
					button.remove();
				}

			} else {
				// console.log(res);
			}
		} ).fail( function( xhr, textStatus, e ) {
			// console.log(xhr.responseText);
		} );
	}

	/**
	 * Check if Load More is defined by the wp_localize_script
	 */
	if ( typeof csco_ajax_pagination !== 'undefined' ) {

		// On Scroll Event.
		$( window ).scroll( function() {
			if ( button.length && !loading && scrollHandling.allow ) {
				scrollHandling.allow = false;
				setTimeout( scrollHandling.reallow, scrollHandling.delay );
				var offset = $( button ).offset().top - $( window ).scrollTop();
				if ( 4000 > offset ) {
					csco_ajax_get_posts();
				}
			}
		} );

		// On Click Event.
		$( 'body' ).on( 'click', '.load-more', function() {
			if ( !loading ) {
				csco_ajax_get_posts();
			}
		} );

	}

	/**
	 * Google AdSense
	 */

	try {
		$( '.adsbygoogle' ).each( function() {
			( adsbygoogle = window.adsbygoogle || [] ).push( {} );
		} );
	} catch ( ex ) {}
	/**
	 * Quanity Incrementor
	 */

	function quantity_increment() {
		var controls = $( '.quantity-controls' );
		controls.each( function() {
			$( this ).on( 'click', '.plus', function( e ) {
				var input = $( this ).parent().parent().find( 'input.qty' );
				var val = parseInt( input.val() );
				var step = input.attr( 'step' );
				step = 'undefined' !== typeof( step ) ? parseInt( step ) : 1;
				input.val( val + step ).change();
			} );
			$( this ).on( 'click', '.minus',
				function( e ) {
					var input = $( this ).parent().parent().find( 'input.qty' );
					var val = parseInt( input.val() );
					var step = input.attr( 'step' );
					step = 'undefined' !== typeof( step ) ? parseInt( step ) : 1;
					if ( val > 0 ) {
						input.val( val - step ).change();
					}
				} );
		} );
	}

	jQuery( document ).ready( function( $ ) {
		quantity_increment();
	} );

	$( document.body ).on( 'updated_wc_div', function() {
		quantity_increment();
	} );

	/**
	 * Product Thumbnail Slider
	 */

	var owlProductGallery = $( '.product-gallery-wrapper' );

	owlProductGallery.each( function() {

		var container = this;
		var owl = $( '.owl-carousel', this );

		$( container ).prepend( '<div class="images-loading"></div>' );

		$( owl ).imagesLoaded( function() {

			owl.parent().find( '.images-loading' ).remove();

			owl.owlCarousel( {
				dragEndSpeed: 250,
				smartSpeed: 250,
				autoHeight: true,
				dots: true,
				dotsContainer: $( '> .owl-dots', container ),
				rtl: rtl,
				responsive: {
					0: {
						items: 1,
						margin: 0,
					},
					760: {
						items: 2,
						margin: 15,
					},
					1020: {
						items: 3,
						margin: 15,
					},
					1240: {
						items: 4,
						margin: 15,
					}
				},
			} );

		} );

	} );

	/**
	 * Lightbox
	 */

	$( '.lightbox-enabled .woocommerce-product-gallery__wrapper' ).each( function() {
		var href = $( '.woocommerce-product-gallery__image > a', this ).attr( 'href' );
		if ( href && href.match( /\.(gif|jpeg|jpg|png)/ ) ) {
			$( '.woocommerce-product-gallery__image > a', this ).addClass( 'image-popup' );
			$( this ).magnificPopup( {
				delegate: '.image-popup',
				type: 'image',
				image: {
					titleSrc: function( item ) {
						return item.el.children().attr( 'title' );
					}
				},
				gallery: {
					enabled: true
				}
			} );
		}
	} );

	/*
	 * Load Mega Menu Posts
	 */
	function cscoLoadMenuPosts( menuItem ) {
		var dataCat = menuItem.children( 'a' ).data( 'cat' ),
			dataNumberposts = menuItem.children( 'a' ).data( 'numberposts' ),
			loading = false,
			menuContainer,
			postsContainer;

		// Containers.
		if ( menuItem.hasClass( 'csco-mega-menu-category' ) ) {
			menuContainer = menuItem;
			postsContainer = menuContainer.find( '.csco-mega-menu-content' );
		} else {
			menuContainer = menuItem.closest( '.sub-menu' );
			postsContainer = menuContainer.find( '.csco-mega-menu-content[data-cat="' + dataCat + '"]' );
		}

		// Set Active.
		menuContainer.find( '.menu-item, .csco-mega-menu-content' ).removeClass( 'active-item' );
		menuItem.addClass( 'active-item' );

		if ( postsContainer ) {
			postsContainer.addClass( 'active-item' );
		}

		// Check Loading.
		if ( menuItem.hasClass( 'loading' ) || menuItem.hasClass( 'loaded' ) ) {
			return false;
		}

		// Check Category.
		if ( !dataCat || typeof dataCat === 'undefined' ) {
			return false;
		}

		// Check Container.
		if ( !postsContainer || typeof postsContainer === 'undefined' ) {
			return false;
		}

		// Create Data.
		var data = {
			'cat': dataCat,
			'per_page': dataNumberposts
		};

		// Get Results.
		$.ajax( {
			url: csco_mega_menu.rest_url,
			type: 'GET',
			data: data,
			global: false,
			async: true,
			beforeSend: function() {

				// Set the loading state.
				menuItem.addClass( 'loading' );
				postsContainer.addClass( 'loading' );
			},
			success: function( res ) {
				if ( res.status && 'success' === res.status ) {

					// Check if there're any posts.
					if ( res.content && res.content.length ) {

						$( res.content ).imagesLoaded( function() {

							// Append Data.
							postsContainer.html( res.content );
						} );
					}
				}

				// Set the loading state.
				menuItem.removeClass( 'loading' ).addClass( 'loaded' );
				postsContainer.removeClass( 'loading' ).addClass( 'loaded' );
			},
			error: function( xhr ) {
				// Set the loading state.
				menuItem.removeClass( 'loading' );
				postsContainer.removeClass( 'loading' );
			}
		} );
	}

	/*
	 * Get First Tab
	 */
	function cscoGetFirstTab( container ) {
		var firstTab = false;

		container.find( '.csco-mega-menu-child' ).each( function( index, el ) {
			if ( $( el ).hasClass( 'menu-item-object-category' ) ) {
				firstTab = $( el );
				return false;
			}
		} );

		return firstTab;
	}

	/*
	 * Menu on document ready
	 */
	$( document ).ready( function() {

		/*
		 * Get Menu Posts on Hover
		 */
		$( '.navbar-nav .menu-item.csco-mega-menu-category, .navbar-nav .menu-item.csco-mega-menu-child' ).on( 'hover', function() {
			cscoLoadMenuPosts( $( this ) );
		} );

		/*
		 * Load First Tab on Mega Menu Hover
		 */
		$( '.navbar-nav .menu-item.csco-mega-menu-tabs' ).on( 'hover', function() {
			var tab = cscoGetFirstTab( $( this ) );

			if ( tab ) {
				cscoLoadMenuPosts( tab );
			}
		} );
	} );

	/*
	 * Load First Tab on Navbar Ready.
	 */
	$( document, '.navbar-nav' ).ready( function() {
		var tab = false;

		// Autoload First Tab.
		$( '.navbar-nav .menu-item.csco-mega-menu-tabs' ).each( function( index, el ) {
			tab = cscoGetFirstTab( $( this ) );
			if ( tab ) {
				cscoLoadMenuPosts( tab );
			}
		} );

		// Autoload Category.
		$( '.navbar-nav .menu-item.csco-mega-menu-category' ).each( function( index, el ) {
			cscoLoadMenuPosts( $( this ) );
		} );
	} );

	/**
	 * OWL Lazy Load Images
	 */

	function fixOwlCarousel() {
		$( '.gallery-type-slider, .slider-loop, .slider-flip' ).each( function() {
			var carousel = $( '> .owl-carousel', this );
			$( 'img', this ).each( function( index ) {
				$( this ).on( 'load', function() {
					if ( !$( this ).hasClass( 'csco-lazyloaded' ) ) {
						$( carousel ).trigger( 'refresh.owl.carousel' );
						$( this ).addClass( 'csco-lazyloaded' );
					}
				} );
			} );
		} );
	}

	$( document ).ready( function() {
		fixOwlCarousel();
		$( 'body' ).on( 'csco-post-load', function() {
			fixOwlCarousel();
		} );
	} );

	/**
	 * Object Fit Images
	 */

	jQuery( document ).ready( function( $ ) {
		objectFitImages();
	} );

} )( jQuery );