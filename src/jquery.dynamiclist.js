/*!
 * jQuery DynamicList Plugin
 *
 * Version 0.0.1
 *
 * Copyright 2013, Dominik Deobald / interdose.com
 * Licensed under the MIT license.
*/

// TODO: Not yet fully "pluginized". Will need to make it more reuseable later.

(function ( $ ) {
	$.fn.dynamicList = function(options) {
		// This is the easiest way to have default options.
		var settings = $.extend({
			data: [],
			suggest_url: '',
			id_column: 'id',
			text_column: 'text',
			new_item_input: null,
			new_item_button: null,
			hidden_field: null
		}, options);
		
		return this.each(function() {
			var $ml = $(this).addClass('dynamic-list');
			
			$('#saveMemberChanges').prop('disabled', true);
			
			function addItem(item) {
				var $li = $('<li>').data('id', item[settings.id_column]);
				
				$li.append(
					$('<span>').addClass('dynamic-list-item-text').text(item[settings.text_column])
				);
				
				if (settings.hidden_field) {
					$li.append(
						$('<input>').attr({
							'type': 'hidden',
							'name': settings.hidden_field,
							'value': item[settings.id_column]
						})
					);
				}

				$li.append($('<span class="action-btn"><button type="button" class="smallbutton famfamfam delete removeItem">Remove</button></span>'));

				$ml.append($li);
				
				return $li;
			}
			
			function showData(data) {
				$ml.html('');				
				for (var i in data) addItem(data[i]);
				$('#saveMemberChanges').prop('disabled', false);
			}
			
			var selectedItem = null;
			
			if (settings.new_item_input) {
				$(settings.new_item_input).jsonSuggest({
					url: settings.suggest_url, 
					maxResults: 20,
					autoMatchOnBlur: true,
					minCharacters: 3,
					onSelect: function(event, item) {
						selectedItem = item;
					}		
				});
				
				if (settings.new_item_button) {
					$(settings.new_item_button).click(function() {
						if (!selectedItem) return;
						addItem(selectedItem).effect('highlight');
						selectedItem = null;
						$(settings.new_item_input).val('');
					});				
				}
			}
			
			$ml.on('click', '.removeItem', function() {
				var $row = $(this).parentsUntil('ul');
				$row.fadeOut(function() {$(this).remove();});
			});
			
			
			if($.isArray(settings.data)) {
				// Data in array
				showData(settings.data);
			} else if($.isFunction(settings.data)) {
				// Data from callback
				settings.data(showData);
			} else {
				// URL -> AJAX
				$.ajax({
					'url': settings.data,
					'dataType': 'json',
					'success': showData
				});				
			}
		});
	}
}( jQuery ));