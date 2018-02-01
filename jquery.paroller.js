/**
 * jQuery plugin paroller.js
 * Original: https://github.com/tgomilar/paroller.js
 **/

;( function( factory ) {
	// AMD
	if( typeof define === 'function' && define.amd ) 
	{
		define( [ 'jquery' ], factory );
	}
	// CommonJS
	else if( ( typeof exports === 'undefined' ? 'undefined' : _typeof( exports ) ) === 'object' ) 
	{
		module.exports = factory( window.Zepto || window.jQuery || window.$ || require( 'jquery' ) );
	}
	// 
	else 
	{
		factory( window.Zepto || window.jQuery || window.$ );
	}
} )( function( $ ) 
{
	'use strict';

	// Default options
	var defaults = {
		factor: 0, // - to +
		type: 'background', // foreground
		direction: 'vertical' // horizontal
	};
	
	//
	function Plugin( element, options )
	{
		this.element = element;
		this.$element = $( element );
		this.options = $.extend( true, { }, defaults, options );
		
		this.init( );
	}
	
	//
	Plugin.prototype = 
	{
		init: function( )
		{
			var context = this;
			
			this._updatePosition( );
			$( window ).on( 'scroll.paroller resize.paroller', function( ) { context._updatePosition( ); } );
		},
		
		_updatePosition: function( )
		{
			var scrolling = $( window ).scrollTop( );
			var windowHeight = $( window ).height( );
			var documentHeight = $( document ).height( );
			
			//
			var offset = this.$element.offset( ).top;
			var height = this.$element.outerHeight( );
			var dataFactor = this.$element.data( 'paroller-factor' );
			var dataType = this.$element.data( 'paroller-type' );
			var dataDirection = this.$element.data( 'paroller-direction' );
			
			//
			var factor = ( dataFactor ) ? dataFactor : this.options.factor;
			var type = ( dataType) ? dataType : this.options.type;
			var direction = ( dataDirection ) ? dataDirection : this.options.direction;
			
			if( type === 'background' )
			{
				var bgOffset = Math.round( ( ( offset - scrolling ) * factor ) );

				if( direction === 'vertical' ) 
				{
					this._verticalBPosition( ( height / 2 ) + bgOffset );
				}
				else if( direction === 'horizontal' ) 
				{
					this._horizontalBPosition( bgOffset );
				}
			} 
			else if( ( type === 'foreground' ) && ( scrolling < documentHeight ) )
			{
				var transform = Math.round( ( ( offset - ( windowHeight / 2 ) + height ) - scrolling ) * factor );

				if( direction === 'vertical' )
				{
					this._verticalTransform( transform );
				} 
				else if( direction === 'horizontal' )
				{
					this._horizontalTransform( transform );
				}
			}
		},
		
		_verticalBPosition: function( offset ) 
		{
			return this.$element.css( { 'background-position': 'center ' + -offset + 'px' } );
		},
		
		_horizontalBPosition: function( offset ) 
		{
			return this.$element.css( { 'background-position': -offset + 'px' + ' center' } );
		},
		
		_verticalTransform: function( offset )
		{
			return this.$element.css( {
				'-webkit-transform': 'translateY(' + offset + 'px)',
				'-moz-transform': 'translateY(' + offset + 'px)',
				'transform': 'translateY(' + offset + 'px)',
                		'transition': 'transform linear',
                		'will-change': 'transform'
			} );
		},
		
		_horizontalTransform: function( offset ) 
		{
			return this.$element.css( {
				'-webkit-transform': 'translateX(' + offset + 'px)',
				'-moz-transform': 'translateX(' + offset + 'px)',
				'transform': 'translateX(' + offset + 'px)',
                		'transition': 'transform linear',
                		'will-change': 'transform'
			} );
		},
		
		destroy: function( reinitialize )
		{
			// Not remove data in reinit
			if( !reinitialize ) { this.$element.removeData( '_paroller' ); }
			
			this.$element.off( '.paroller' );
		},

		reinitialize: function( options )
		{
			this.destroy( true ); 
			this.options = $.extend( true, { }, this.options, options );
			this.init( );
		},
		
		//
		reinit: function( options )
		{
			this.reinitialize( );
		}
	};

	$.fn.paroller = function( options ) 
	{
		var args = arguments;
		var $element = this.is( '[data-paroller-factor]' ) ? this : this.find( '[data-paroller-factor]' );
		
		// Init plugin
		if( options === undefined || typeof options === 'object' )
		{
			$element.each( function( )
			{
				if( !$.data( this, '_paroller' ) )
				{
					$.data( this, '_paroller' , new Plugin( this, options ) );
				}
			} );
					
			return this;
		}
		// Call function
		else if( typeof options === 'string' && options[0] !== '_' && options !== 'init' )
		{
			var returns = undefined;
			
			$element.each( function( )
			{
				var instance = $.data( this, '_paroller' );
				
				if( instance instanceof Plugin && typeof instance[ options ] === 'function' )
				{
					returns = instance[ options ].apply( instance, Array.prototype.slice.call( args, 1 ) );
				}
			} );
			
			return returns !== undefined ? returns : this;
		}
	};
} );
