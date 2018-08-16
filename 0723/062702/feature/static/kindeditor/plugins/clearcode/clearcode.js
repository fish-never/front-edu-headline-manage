/*******************************************************************************
* KindEditor - WYSIWYG HTML Editor for Internet
* Copyright (C) 2006-2011 kindsoft.net
*
* @author Roddy <luolonghao@gmail.com>
* @site http://www.kindsoft.net/
* @licence http://www.kindsoft.net/license.php
*******************************************************************************/

KindEditor.plugin('clearcode', function(K) {
	var self = this, name = 'clearcode';
	self.clickToolbar(name, function() {
		self.focus();
		var html = self.html();
		html = html.replace(/(<script[^>]*>)([\s\S]*?)(<\/script>)/ig, '');
		html = html.replace(/(<style[^>]*>)([\s\S]*?)(<\/style>)/ig, '');
		// html = K.formatHtml(html, {
		// 	a : ['href', 'target'],
		// 	embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
		// 	img : ['src', 'width', 'height', 'border', 'alt', 'title', '.width', '.height'],
		// 	table : ['border'],
		// 	'td,th' : ['rowspan', 'colspan'],
		// 	'div,hr,br,tbody,tr,p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : []
		// });
		// html = K.formatHtml(html, {
		// 	a : ['href', 'target'],
		// 	embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
		// 	img : ['src', 'width', 'border', 'alt', 'title'],
		// 	table : ['border'],
		// 	'td,th' : ['rowspan', 'colspan'],
		// 	'div,hr,br,tbody,tr,p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : []
		// });
		html = html.replace(/\n\r/g,'');
		html = html.replace(/(?<!\-)color:.*?;/ig,'');
		html = html.replace(/font-size:.*?;/ig,'');
		
		//清理头部img
		var hs = html.split(/\<img .*?>/i);
		if(hs.length > 0){
			var text = $('<div>' + hs[0] + '</div>').text();
			text = text.replace(/(^\s*)|(\s*$)/g, "")
			if(text == ''){
				html =  $('<div>' + html + '</div>').find('img:first').remove().end().html()
			}
		}
		//清理尾部html
		var hs = html.split(/\<img .*?>/i);
		if(hs.length > 0){
			var text = $('<div>' + hs[hs.length-1] + '</div>').text();
			text = text.replace(/(^\s*)|(\s*$)/g, "")
			if(text == ''){
				html = $('<div>' + html + '</div>').find('img:last').remove().end().html()
			}
		}
		html = html.replace(/\n\r/g,'');
		console.log(html)
		html = html.replace(/<p><br\s*\/><\/p>/g,'');
		html = html.replace(/<br\s*\/>/g,'');
		html = html.replace(/<p>\s*<\/p>/g,'');
		html = html.replace(/<p>\s*<br\s*\/>\s*<\/p>/g,'');
		self.html(html);
		self.cmd.selection(true);
		self.addBookmark();
	});
});
