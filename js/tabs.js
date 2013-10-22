$(function() {
	var tabTitle = $( "#tab_title" ),
	  tabLang = $("#tab_lang")
	  tabMods = $("#tab_mods"),
	  tabContent = $( "#tab_content" ),
	  tabTime = $("#tab_time")
	  tabTemplate = "<li><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close' role='presentation'>Remove Tab</span></li>",
	  window.tabCounter = 1;

	var tabs = $( "#tabs" ).tabs();

	tabs.find( ".ui-tabs-nav" ).sortable({
	  axis: "x",
	  stop: function() {
	    tabs.tabs( "refresh" );
	  }
	});

	// modal dialog init: custom buttons and a "close" callback reseting the form inside
	var dialog = $( "#dialog" ).dialog({
	  autoOpen: false,
	  modal: true,
	  buttons: {
	    Add: function() {
	      addTab();
	      $( this ).dialog( "close" );
	    },
	    Cancel: function() {
	      $( this ).dialog( "close" );
	    }
	  },
	  close: function() {
	    form[ 0 ].reset();
	  }
	});

	// addTab form: calls addTab function on submit and closes the dialog
	var form = dialog.find( "form" ).submit(function( event ) {
	  addTab();
	  dialog.dialog( "close" );
	  event.preventDefault();
	});

	// actual addTab function: adds new tab using the input from the form above
	function addTab() {
	  var label = tabTitle.val() || "Project " + tabCounter,
	    id = "tabs-" + tabCounter,
	    li = $( tabTemplate.replace( /#\{href\}/g, "#" + id ).replace( /#\{label\}/g, label ) ),

	    tabNameValHtml = label;
		tabContentValHtml = tabContent.val() || "(None - no description? What's up with that?)";
		tabLangValHtml = tabLang.val() || "(None)";
		tabModsValHtml = tabMods.val() || "(None)";
		tabTimeValHtml = tabTime.val() || "(None)";

		tabNameHtml = "<h2 class='hname'>Project Title</h2><p class='pname'>" + tabNameValHtml + "</p>"
		tabContentHtml = "<h2 class='hdesc'>Rough Idea</h2><p class='pdesc'>" + tabContentValHtml + "</p>";
	    tabLangHtml = "<h2 class='hlang'>Languages</h2><p class='plang'>" + tabLangValHtml + "</p>";
	    tabModsHtml = "<h2 class='hmods'>Modules, Libraries, Devices, etc.</h2><p class='pmods'>" + tabModsValHtml + "</p>";
	    tabTimeHtml = "<h2 class='htime'>Starting Time</h2><p class='ptime'>" + tabTimeValHtml + "</p>"


	  tabs.find( ".ui-tabs-nav" ).append( li );
	  tabs.append( "<div id='" + id + "'>" + tabNameHtml + tabContentHtml + tabLangHtml + tabModsHtml + tabTimeHtml + "</div>" );
	  tabs.tabs( "refresh" );
	  window.tabCounter++;
	}

	// addTab button: just opens the dialog
	$( "#add_tab" )
	  .button()
	  .click(function() {
	    dialog.dialog( "open" );
	  });

	// close icon: removing the tab on click
	tabs.delegate( "span.ui-icon-close", "click", function() {
	  var panelId = $( this ).closest( "li" ).remove().attr( "aria-controls" );
	  $( "#" + panelId ).remove();
	  tabs.tabs( "refresh" );
	});

	tabs.bind( "keyup", function( event ) {
	  if ( event.altKey && event.keyCode === $.ui.keyCode.BACKSPACE ) {
	    var panelId = tabs.find( ".ui-tabs-active" ).remove().attr( "aria-controls" );
	    $( "#" + panelId ).remove();
	    tabs.tabs( "refresh" );
	  }
	});
});