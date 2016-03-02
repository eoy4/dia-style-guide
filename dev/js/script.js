(function(){
	fx = {
		showHidden: function(element, callback) {
			var $element = (element instanceof jQuery) ? element : $(element);

			$element.addClass('start-hidden');

			$element.show(10, function(){
				$element.removeClass('start-hidden')
						.css({width: '', height: ''});

				if(typeof(callback) === 'function') {
					setTimeout(callback, 300);
				}
			})
		},
		hide: function(element, callback) {
			var $element = (element instanceof jQuery) ? element : $(element);

			$element.css({display: 'block'})
					.addClass('start-hidden');

			setTimeout(function(){
				this.collapse($element, callback);
			}.bind(this), 300)
		},
		collapse: function(element, callback) {
			var $element = (element instanceof jQuery) ? element : $(element);

			$element.css({
				width: $element.outerWidth(),
				height: $element.outerHeight()
			});

			$element.animate({width: 1, height: 1}, 200, function(){
				$element.hide();

				if(typeof(callback) === 'function') {
					callback();
				}
			});
		}
	};

	forms = {
		inputChanged: function(element) {
			var $element = (element instanceof jQuery) ? element : $(this);

			var $enclosing = $element.parent('.custom-select').length
				? $element.parent('.custom-select')
				: $element;

			if($element.val().trim() !== '') {
				$enclosing.addClass('not-empty');
			} else {
				$enclosing.removeClass('not-empty');
			}
		}
	};

	responsive = {
		init: function(){
			$('<div class="mobile-checker">').prependTo($('body'));


			$('<style type="text/css">\
				.mobile-checker {\
					display: block;\
					height: 100px;\
					left: -9999px;\
					position: absolute;\
					top: -9999px;\
					width: 100px;\
				}\
				@media screen and (max-width: 991px){\
					.mobile-checker {\
						display: none;\
					}\
				}\
			   </style>').appendTo($('head'));
		},
		isMobile: function(){
			return !($('.mobile-checker').is(':visible'));
		}
	};

	app = {
		inputs: $('input[type="text"], input[type="password"], input[type="email"], textarea, select'),
		menu: $('#MainNav'),
		isFormFull: function() {
			var full = true;

			$('#Form1 input').filter('[required]:visible').each(function(){
				var $this = $(this);
				if($this.val().trim() === '') {
					full = false;
				}
			});

			if(full) {
				$('#Form1 select').each(function(){
					if(!$(this).val()) {
						full = false;
					}
				});
			}

			if(full) {
				full = false;
				if($('#Form1 :radio:checked').length) {
					full = true;
				}
			}

			return full;
		},
		isTemplateChosen: function(){
			var $form = $('#Form1');
			return ($form.find('#TemplateName').val() || $form.find('#UploadTemplateFile').val());
		},
		showForm2: function() {
			var $form1 = $('#Form1');
			var $form2 = $('#Form2');

			if(this.isFormFull() && this.isTemplateChosen()) {
				if($form2.is(':visible')) {
					return true;
				}
				fx.showHidden($form2, this.positionMenu);
			} else {
				if($form2.is(':visible')) {
					fx.hide($form2, this.positionMenu);
				}
			}
		},
		positionMenu: function() {
			var $mainNav = $('#MainNav');

			if(!responsive.isMobile()) {
				$mainNav.css({
								display: 'block',
								height: '',
								minHeight: '',
								top: ''
							});
				return false;
			}

			var headerHeight = $("#PageHeader").outerHeight();
			var minHeight = $(window).height() - headerHeight;
			var height = $('html').outerHeight() - headerHeight;
			var menuHeight = $mainNav.outerHeight();
			height = menuHeight > height ? menuHeight : height;

			$mainNav.css({
							minHeight: minHeight,
							height: height,
							top: headerHeight
						});
		},
		hideMenu: function() {
			this.menu.removeClass('shown');

			setTimeout(function(){
				this.menu.hide();
			}.bind(this), 300);
		},
		showMenu: function(){
			this.menu.show(10, function(){
				this.menu.addClass('shown');
			}.bind(this));
		},
		showHideMenu: function() {
			if(!responsive.isMobile()) {
				return false;
			} else {
				if(this.menu.hasClass('shown')) {
					this.hideMenu();
				} else {
					this.showMenu();
				}
			}
		},
		setupEvents: function() {
			this.inputs.on('change', forms.inputChanged);
			$('#Form1 :input').on('change', this.showForm2.bind(this));
			$('.hamburger-menu-button').on('click', this.showHideMenu.bind(this));
			$(window).on('resize', this.positionMenu);
		},
		fillMockupData: function() {
			$('#Form1 input[type="text"]').val('Dummy Text');
			$('#Form1 select').val('One');
			$('#Form1 #AffinitiesYes').prop('checked', true);
			this.showForm2();
		},
		demoCards: function(){
			var $levelsCard = $("#TestCard");

			$levelsCard.find('.level-up').on('click', function(){
				var level = $levelsCard.data('level') ? $levelsCard.data('level') : 1;

				$levelsCard.removeClass('level' + level);

				level++;

				level = level > 4 ? 1 : level;

				$levelsCard.data('level', level).addClass('level' + level);
				$levelsCard.find('h2').text('Level ' + level);
			});

			$levelsCard.find('.level-down').on('click', function(){
				var level = $levelsCard.data('level') ? $levelsCard.data('level') : 1;

				$levelsCard.removeClass('level' + level);

				level--;

				level = level < 1 ? 4 : level;

				$levelsCard.data('level', level).addClass('level' + level);
				$levelsCard.find('h2').text('Level ' + level);
			});

			$('body').on('click', '.card .close-card', function(e){
				e.preventDefault();
				var $this = $(this);
				var $card = ( $this.closest('.card-container').length )
				            ? $this.closest('.card-container')
				            : $this.closest('.card')
				fx.hide($card);
			});

			$('body').on('click', '.add-card', function(e){
				e.preventDefault();
				var $newCard = $('<div class="col-md-6 card-container hides start-hidden">')
					.append($('<div class="card hides ">')
            .append($('<div class="text-container" >')
  						.append($('<a href="#" class="close-card">X</a>'))
  						.append($('<h2>This is a new card</h2>'))
  						.append($('<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis quia optio minus quasi quae assumenda consectetur minima quos quaerat aspernatur! Vel quasi repellendus debitis. Placeat quas tenetur illo ratione veniam.</p>'))));
				$(this).parent().before($newCard);
				fx.showHidden($newCard);
			});
		},
		init: function() {
			responsive.init();
			this.setupEvents();
			// this.fillMockupData();
			this.inputs.each(function(){
				var $this = $(this);
				forms.inputChanged($this);
			});
			this.positionMenu();

			this.demoCards();
		}
	};

	app.init();

	jQuery.extend(window, {app: app, fx : fx});
})(jQuery);
