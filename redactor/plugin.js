/**
 * Redactor plugin for zipgallery
 * 
 * Copyright 2017 - TDSystem Beratung & Training - Thomas Dausner
 * 
 * @param $
 */
/* global ZIPGallery, ConcreteFileManager */
(function($)
{
	$.Redactor.prototype.tds_z_i_p_gallery = function()
	{
		return {
			init: function()
			{
				this.modal.addTemplate('zipgallery', 
					'<section id="redactor-modal-zipgallery-insert">'
						+ '<div class="form-group">'
						+ 	'<label class="control-label">' + ZIPGallery.messages.zg_zipurl + '</label>'
						+ 	'<div class="err_no_zip" style="color: red; display: none; float: right;">' + ZIPGallery.messages.zg_no_zip + '</div>'
						+ 	'<div class="err_no_url" style="color: red; display: none; float: right;">' + ZIPGallery.messages.zg_url_non_empty + '</div>'
						+ 	'<div class="input-group">'
						+ 		'<input type="text" class="form-control" id="redactor-zipgallery-url" readonly="readonly" />'
						+ 		'<a href="#" data-action="choose-file-from-file-manager" class="btn btn-default input-group-addon"><i class="fa fa-file"></i></a>'
						+ 	'</div>'
						+ '</div>'
						+ '<div class="err_no_title" style="color: red; display: none; float: right;">' + ZIPGallery.messages.zg_title_non_empty + '</div>'
						+ '<div class="form-group">'
						+ 	'<label class="control-label">' + ZIPGallery.messages.zg_linktitle + '</label>'
						+ 	'<input class="form-control" type="text" id="redactor-zipgallery-url-text" />'
						+ '</div>'
						+ '<div class="form-group">'
						+ 	'<input class="form-control" type="checkbox" id="redactor-zipgallery-inh-dl" />'
						+ 	'<label class="control-label">' + ZIPGallery.messages.zg_inhibitDownload + '</label>'
						+ '</div>'
					+ '</section>'
				);
				var button = this.button.add('zipgallery', ZIPGallery.messages.zg_add);
				this.button.addCallback(button, this.tds_z_i_p_gallery.show);
				this.button.setAwesome('zipgallery', 'fa-camera-retro');

			},
			show: function()
			{
				var buttonText = !this.observe.isCurrent('a') ? ZIPGallery.messages.zg_add : ZIPGallery.messages.zg_edit;
				this.modal.load('zipgallery', buttonText, 600);

				this.modal.createCancelButton();

				this.tds_z_i_p_gallery.buttonInsert = this.modal.createActionButton(buttonText);

				this.selection.get();

				this.link.getData();
				this.link.cleanUrl();

				this.tds_z_i_p_gallery.$inputUrl = $('#redactor-zipgallery-url');
				this.tds_z_i_p_gallery.$inputText = $('#redactor-zipgallery-url-text');
				this.tds_z_i_p_gallery.$inputIdl = $('#redactor-zipgallery-inh-dl');

				this.tds_z_i_p_gallery.$inputText.val(this.link.text);
				this.tds_z_i_p_gallery.$inputUrl.val(this.link.url);
				this.tds_z_i_p_gallery.$inputIdl.prop('checked', this.link.target.match(/^gallery-/) ? 'checked' : '');
				
				this.tds_z_i_p_gallery.$inputUrl.change(function() {
					if ($(this).val() !== '') {
						$('#redactor-modal-zipgallery-insert .err_no_url').hide();
					} 
				});
				this.tds_z_i_p_gallery.$inputText.change(function() {
					if ($(this).val() !== '') {
						$('#redactor-modal-zipgallery-insert .err_no_title').hide();
					}
				});

				this.tds_z_i_p_gallery.buttonInsert.on('click', $.proxy(this.tds_z_i_p_gallery.insert, this));

				// hide link's tooltip
				$('.redactor-zipgallery-tooltip').remove();

				if (this.opts.concrete5.filemanager) {
					$('a[data-action=choose-file-from-file-manager]').on('click', function(e) {
						e.preventDefault();
						var opts = { filters: [
								{ field: "type", type: 6 }
						]};
						ConcreteFileManager.launchDialog(function(data) {
							jQuery.fn.dialog.showLoader();
							ConcreteFileManager.getFileDetails(data.fID, function(r) {
								jQuery.fn.dialog.hideLoader();
								var file = r.files[0];
								$('#redactor-zipgallery-url').val(file.urlDownload);
								var zipUrl = file.url;
								var $err_no_zip = $('#redactor-modal-zipgallery-insert .err_no_zip');
								if (!zipUrl.match(/\.zip$/)) {
									$err_no_zip.show();
								} else {
									$err_no_zip.hide();
								}
								$('#redactor-modal-zipgallery-insert .err_no_url').hide();
							});
						}, opts);
					});
				} else {
					$('a[data-action=choose-file-from-file-manager]').remove();
				}

				if (!this.opts.concrete5.filemanager) {
					$('#redactor-zipgallery-url').parent().removeClass(); // remove the input group
				}

				// show modal
				this.selection.save();
				this.modal.show();
		
			},
			insert: function()
			{
				var inputUrl = this.tds_z_i_p_gallery.$inputUrl.val();
				var inputText = this.tds_z_i_p_gallery.$inputText.val();
				if (inputUrl === '') {
					$('#redactor-modal-zipgallery-insert .err_no_url').show();
				} 
				if (inputText === '') {
					$('#redactor-modal-zipgallery-insert .err_no_title').show();
				}
				if (inputUrl !== '' && inputText !== '') {
					this.placeholder.remove();
					this.link.set(inputText.replace(/(<([^>]+)>)/ig, ''), inputUrl, 'gallery' 
											+ (this.tds_z_i_p_gallery.$inputIdl.prop('checked') ? ('-' + this.opts.redactorEditor) : ''));
					this.modal.close();
				} 
			}
		};
	};
})(jQuery);

