
steal('steal/build').then(function( steal ) {

	/**
	 * Builds and compresses CSS files.
	 * @param {Object} opener a steal opener that can give the final version of scripts
	 * @param {Object} options options configuring the css building
	 * 
	 *   - __to__ where the css should be built.
	 */
	var styles = (steal.build.builders.styles = function( opener, options ) {
		steal.print("\nBUILDING STYLES --------------- ");
		//where we are putting stuff
		var folder = options.to.substr(0, options.to.length - 1),
			//where the page is
			pageFolder = steal.File(opener.url).dir(),
			scriptsConverted = [],
			currentPackage = [];

		opener.each('css', function( link, text, i ) {
			steal.print("   " + link.rootSrc)
			scriptsConverted.push(link.rootSrc)
			var converted = convert(text, link.rootSrc, folder);
			currentPackage.push(converted)
		});
		steal.print("")
		
		if ( currentPackage.length ) {
			steal.print("STYLE BUNDLE > " + folder + "/production.css")
            //now that we have all the css minify and save it
            var raw_css = currentPackage.join(""),
				minified_css = styles.min(raw_css);
            steal.print("Nice! "+calcSavings(raw_css.length,minified_css.length));
            steal.File(folder + "/production.css").save(minified_css);
		} else {
			steal.print("no styles\n");
			return;
		}
		
		return {
			name: folder+"/production.css",
			dependencies: scriptsConverted
		}
	});

	//used to convert css referencs in one file so they will make sense from prodLocation
	var convert = function( css, cssLocation, prodLocation ) {
		//how do we go from prod to css
		var cssLoc = new steal.File(cssLocation).dir(),
			newCSS = css.replace(/url\(['"]?([^'"\)]*)['"]?\)/g, function( whole, part ) {

				//check if url is relative
				if (isAbsoluteOrData(part) ) {
					return whole
				}

				//it's a relative path from cssLocation, need to convert to
				// prodLocation
				var rootImagePath = steal.File(part).joinFrom(cssLoc),
					fin = steal.File(rootImagePath).toReferenceFromSameDomain(prodLocation);
				//print("  -> "+rootImagePath);
				// steal.print("  " + part + " > " + fin);
				return "url(" + fin + ")";
			});
		return newCSS;
	},
	isAbsoluteOrData = function( part ) {
		return /^(data:|http:\/\/|https:\/\/|\/)/.test(part)
	},
    calcSavings = function(raw_len, minified_len) {
        var diff_len = raw_len - minified_len, x = Math.pow(10,1);
        return 'Compressed: '+(Math.round((diff_len/raw_len*100)*x)/x)+'%  Before: '+
            string2size(raw_len)+'  After: '+string2size(minified_len);
    },
    string2size = function(bytes) {
        var s = ['bytes','kb','mb','gb','tb','pb'];
        var e = Math.floor(Math.log(bytes)/Math.log(1024));
        return (bytes/Math.pow(1024,Math.floor(e))).toFixed(1)+' '+s[e];
    };
},'steal/build/styles/cssmin.js');
