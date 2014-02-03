var edit = true;
var editingHandler = [];
var idsHandler = [];
tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>";

function setshowp (id, classname, textval) {
	//sets the paragraph tag and shows it
	$(id).children(classname).html(textval.replace(/\n/g, "<br>"));
	$(id).children(classname).show(1, function () {});
};

function setDescTextarea (id, textval) {
	//sets and adds description textarea if first time pressing edit - didn't need a function for this, but fuck it
	$(id).children(".hdesc").after("<textarea class='editdesc'>" + textval + "</textarea>");
	$(id).children(".editdesc").height( $(".editdesc")[0].scrollHeight );
};

function setOtherTextarea (id, headername, classname, textval) {
	//sets and adds lang or mods textarea if first time pressing edit
	$(id).children(headername).after("<textarea class='" + classname + "' rows='1'>" + textval + "</textarea>");
	$(id).children("." + classname).height( $("." + classname)[0].scrollHeight );
};

function showTextarea (id, classname, textval) {
	//shows textarea tag if not first time pressing button
	$(id).children(classname).text(textval);
	$(id).children(classname).show(1, function () {});
};

function editingScript (id) {
	/*This script is activated when the Edit button is clicked or, if the textareas are active,
	when the active tab is changed. On first button press, create the textareas and add them to
	the HTML and show them, right after hiding the paragraph tags. On every other button press,
	hide the textarea tag and show the paragraph tags.*/
	edit = !edit;
	if (edit) {
		//clicking the Done button
		var nametext = $(id).children('.editname').val();
		var desctext = $(id).children('.editdesc').val(); //get values of current textareas
		var langtext = $(id).children('.editlang').val();
		var modstext = $(id).children('.editmods').val();
		var timetext = $(id).children('.edittime').val();
		$(".editbutton").text('Edit');
		$(id).children(".editname").hide(1, setshowp(id, ".pname", nametext));
		$(id).children(".editdesc").hide(1, setshowp(id, ".pdesc", desctext));  //call setshowp upon hiding
		$(id).children(".editlang").hide(1, setshowp(id, ".plang", langtext));
		$(id).children(".editmods").hide(1, setshowp(id, ".pmods", modstext));
		$(id).children(".edittime").hide(1, setshowp(id, ".ptime", timetext));
		$('.savebutton').removeAttr('disabled');
		$("a[href='" + id + "']").text(nametext); //change tab name too
		tabs.tabs("refresh");
	}
	else {
		//clicking the Edit button
		var nametext = $(id).children(".pname").text(); //get values of current paragraphs
		var desctext = $(id).children(".pdesc").text();
		var langtext = $(id).children(".plang").text();
		var modstext = $(id).children(".pmods").text();
		var timetext = $(id).children(".ptime").text();
		$(".editbutton").text('Done');
		$('.savebutton').attr('disabled', 'true'); //do not allow saving while editing

		if ($.inArray(id, editingHandler) === -1) {
			//first time pressing edit in this session
			$(id).children(".pname").hide(1, setOtherTextarea(id, '.hname', 'editname', nametext)); //call setTextarea functions upon hiding
			$(id).children(".pdesc").hide(1, setDescTextarea(id, desctext));
			$(id).children(".plang").hide(1, setOtherTextarea(id, '.hlang', 'editlang', langtext));
			$(id).children(".pmods").hide(1, setOtherTextarea(id, '.hmods', 'editmods', modstext));
			$(id).children(".ptime").hide(1, setOtherTextarea(id, '.htime', 'edittime', timetext));
			editingHandler.push(id);
		}
		else {
			//not first time pressing edit in this session
			$(id).children(".pname").hide(1, showTextarea(id, ".editname", nametext));
			$(id).children(".pdesc").hide(1, showTextarea(id, ".editdesc", desctext));
			$(id).children(".plang").hide(1, showTextarea(id, ".editlang", langtext));
			$(id).children(".pmods").hide(1, showTextarea(id, ".editmods", modstext));
			$(id).children(".ptime").hide(1, showTextarea(id, ".edittime", timetext));
		}
	}
}

function updateProjs() {
	/*This function checks all of the anchor tags and gets the text from them. The text is
	then appended to an array. Why? Because all of the anchor tags in the HTML code are 
	actually the project names. The array is then returned.

	Note: we can't just iterate through the array of IDs (#tabs-0, ... etc) because the 
	order of the anchor tags will change if the tabs are sorted differently. The IDs array
	will always be in the order of increasing ID numbers.*/
	array = [];
	var ancs = $("a").each( function () {
		array.push($(this).text());
	});
	return array;
}




$(document).ready(function() {

	//localStorage["projlist"] = updateProjs().join(" ^%^ ");
	var tabs = $( "#tabs" ).tabs();

	if  (typeof localStorage["$$__nothinglikethefirstsave__$$"] === "undefined") {
		//this runs if the user hasn't hit the savebutton yet; loads default WareJects info
		label = "WareJects"; //proj title
		li = $( tabTemplate.replace( /#\{href\}/g, "#tabs-0" ).replace( /#\{label\}/g, label ) );
		tabNameHtml = "<h2 class='hname'>Project Title</h2><p class='pname'>WareJects</p>";
		tabContentHtml = "<h2 class='hdesc'>Rough Idea</h2><p class='pdesc'>A Chrome extension that allows the user to manage their software and hardware project ideas. Should have a simple tabbing system (maybe refer to jQuery UI instead of building one from scratch?), a section for languages the user may write it in (if any), a section for tools (MakeyMakey, Raspberry Pi...) or modules (Flask, jQuery...), and a section for the description of the project.</p>";
		tabLangHtml = "<h2 class='hlang'>Languages</h2><p class='plang'>JavaScript, HTML, CSS</p>";
		tabModsHtml = "<h2 class='hmods'>Modules, Libraries, Devices, etc.</h2><p class='pmods'>jQuery, jQuery UI</p>";
		tabTimeHtml = "<h2 class='htime'>Starting Time</h2><p class='ptime'>Sometime in October?</p>";
		tabs.find( ".ui-tabs-nav" ).append( li );
		tabs.append( "<div id='tabs-0'>" + tabNameHtml + tabContentHtml + tabLangHtml + tabModsHtml + tabTimeHtml + "</div>" );
		$( "#tabs" ).tabs( "option", "active", 0 );
		tabs.tabs( "refresh" );
		localStorage["lastactivetab"] = "0";
	}

	
	else if (localStorage["projlist"].split(" ^%^ ").length != 0) {

		//localStorage["projlist"] = updateProjs().join(" ^%^ ");
		projsInStorage = localStorage["projlist"].split(" ^%^ ");

		for (var i=0; i < projsInStorage.length; i++ ) {

			idhere = "tabs-" + i.toString();
			label = projsInStorage[i]; //proj title
			li = $( tabTemplate.replace( /#\{href\}/g, "#" + idhere ).replace( /#\{label\}/g, label ) );

			tabNameHtml =  "<h2 class='hname'>Project Title</h2><p class='pname'>" + label + "</p>";
			tabContentHtml = "<h2 class='hdesc'>Rough Idea</h2><p class='pdesc'>" + localStorage[label + "-_-desc"] + "</p>";
			tabLangHtml = "<h2 class='hlang'>Languages</h2><p class='plang'>" + localStorage[label + "-_-lang"] + "</p>";
			tabModsHtml = "<h2 class='hmods'>Modules, Libraries, Devices, etc.</h2><p class='pmods'>" + localStorage[label + "-_-mods"] + "</p>";
			tabTimeHtml = "<h2 class='htime'>Starting Time</h2><p class='ptime'>" + localStorage[label + "-_-time"] + "</p>";

			tabs.find( ".ui-tabs-nav" ).append( li );
			tabs.append( "<div id='" + idhere + "'>" + tabNameHtml + tabContentHtml + tabLangHtml + tabModsHtml + tabTimeHtml + "</div>" );
			tabs.tabs( "refresh" );
			window.tabCounter++;
		}

	}


	localStorage["projlist"] = updateProjs().join(" ^%^ ");
	$("#tabs").tabs("option", "active", parseInt(localStorage["lastactivetab"]));
	id = "#tabs-" + localStorage["lastactivetab"];

	$("#tabs").tabs({
		beforeActivate: function (event, ui) {
			//this function is called before switching to a new tab

			if (!edit) {
				//disable the textareas if they are still open upon switching tabs
				editingScript(id);
			}

			id = "#" + ui.newPanel.attr('id');

			if ($.inArray(id, idsHandler) === -1 ) {
				//if the tab ID is not in the array of IDs, add it
				idsHandler.push(id);
			}

			projnames = updateProjs();
		}
	});

	$("#tabs").tabs({
		activate: function (event, ui) {
			//save what the last active tab was
			localStorage["lastactivetab"] = $( "#tabs" ).tabs( "option", "active" ).toString();
		}
	})

	$('.savebutton').click(function() {
		//savebutton saves to HTML5 localStorage
		localStorage["$$__nothinglikethefirstsave__$$"] = "true"; //the user has hit the save button once
		projnames = updateProjs();
		projsInStorage = localStorage["projlist"].split(" ^%^ ");
		
		for (var i = 0; i < projsInStorage.length; i++) {
			if ($.inArray(projsInStorage[i], projnames) === -1) {
				//check to see if any projects have been deleted by comparing array of project names to those in storage -
				//if so, remove the desc/lang/mods text
				localStorage.removeItem(projsInStorage[i] + "-_-desc");
				localStorage.removeItem(projsInStorage[i] + "-_-lang");
				localStorage.removeItem(projsInStorage[i] + "-_-mods");
				localStorage.removeItem(projsInStorage[i] + "-_-time");
			}
		}

		localStorage["projlist"] = projnames.join(" ^%^ "); //now update storage list

		for (var i = 0; i < projnames.length; i++) {
			$("a").each(function() {
				if ($(this).text() === projnames[i]) {
					id = $(this).attr('href');
					name = $(this).text();
					localStorage[name + "-_-desc"] = $(id).children('.pdesc').text();
					localStorage[name + "-_-lang"] = $(id).children('.plang').text();
					localStorage[name + "-_-mods"] = $(id).children('.pmods').text();
					localStorage[name + "-_-time"] = $(id).children('.ptime').text();
				}
			});
		}
	});
	
	$('.editbutton').click(function() {
		editingScript(id);
	});
});