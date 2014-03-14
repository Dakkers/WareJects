//data holds all the project data, IDs assigns a number to each project (for easy jQuery manipulation)
var data = {"1": {"tt": "WareJects", "desc": "A Chrome extension that allows the user to organize their software and hardware project ideas.", 
					"lng": "JavaScript, HTML, CSS", "mod": "jQuery", "time": "when it's feasible!"}}, IDs = {"WareJects": "1"}, maxID, activetab, IDnums = [];
var editing = false;
var boxes = ['tt', 'desc', 'lng', 'mod', 'time'];




function proj_div_tag(title, descrip, lang, modules, starttime, initial_load, idnumber) {
	//create a <div> tag for the project data (or create its child)
	//if initial_load is true (user is loading warejects), return entire div tag
	//if initial_load is false (user is adding a project), return child (as div must be created and hidden pre-)
	var contenttobeadded =
		["<h4>Project Title</h4><p class='proj-tt'>" + title + "</p>",
		"<h4>Description</h4><p class='proj-desc'>" + descrip.replace(/\n/g, "<br>") + "</p>",
		"<h4>Languages</h4><p class='proj-lng'>" + lang + "</p>",
		"<h4>Libraries, Devices, etc.</h4><p class='proj-mod'>" + modules + "</p>",
		"<h4>Starting Time</h4><p class='proj-time'>" + starttime + "</p>"].join('\n');
	if (initial_load) {
		return "<div id='proj-"+ idnumber +"' class='proj-inactive proj'>"+ contenttobeadded +"</div>";
	} else {
		return contenttobeadded;
	}
}

function proj_li_tag(title, initial_load, idnumber) {
	//create a <li> tag for the project title
	//if initial_load is true (user is loading warejects), <li> will not be hidden and <ul> will slide down instead
	//if initial_load is false (user is adding a project), <li> will be hidden and it itself will slide down
	if (initial_load) {
		return "<li id='proj-li-"+idnumber+"'><div class='proj-li'><span class='proj-li-content'>"+ title +"</span><span class='fui-cross'></span></div></li>";
	} else {
		return "<li id='proj-li-new'><div class='proj-li'><span class='proj-li-content'>"+ title +"</span><span class='fui-cross'></span></div></li>";
	}
}

function add_textarea_html(idnumber) {
	//create the textareas inside the html
	for (var i=0; i<boxes.length; i++ ) {
		$("#proj-"+ idnumber +" > .proj-" + boxes[i]).after("<textarea style='display: none;' class='proj-"+ boxes[i] +"-ta' rows='1'></textarea>");
	}
	$("#proj-"+ idnumber +" > .proj-desc-ta").attr('rows', '3');
}

function save(title, descrip, lang, mods, starttime, idnumber, data_container, IDs_container) {
	//save stuff to localStorage
	data_container[idnumber] = {"tt": title, "desc": descrip, "lng": lang, "mod": mods, "time": starttime}
	IDs_container[title] = idnumber;
	localStorage["warejects"] = JSON.stringify({"data": data_container, "IDs": IDs_container});
}



$(window).load(function() {


	if (typeof localStorage["warejects"] != "undefined") {
		//if warejects has been loaded before, get project data and IDs
		data = JSON.parse(localStorage["warejects"])["data"];
		IDs = JSON.parse(localStorage["warejects"])["IDs"];
		activetab = parseInt(localStorage["warejects-activetab"]);

	} else {
		//if warejects hasn't been loaded before, create data in local storage for it
		localStorage["warejects"] = JSON.stringify({"data": data, "IDs": IDs});
		activetab = "1";
		localStorage["warejects-activetab"] = activetab;
	}

	//get project titles, their ID-numbers, largest ID number, and sort project titles alphabetically
	var proj_tts = Object.keys(IDs);
	for (var i=0; i < proj_tts.length; i++) {IDnums.push(parseInt(IDs[proj_tts[i]]));}
	proj_tts.sort();
	maxID = Math.max.apply(Math, IDnums);

	for (var i=0; i<proj_tts.length; i++) {
		//get proj data
		var tt = proj_tts[i];
		var IDnum = IDs[tt];
		var desc = data[IDnum]["desc"], lng = data[IDnum]["lng"], mod = data[IDnum]["mod"], time = data[IDnum]["time"];

		//add proj data to projectlist and project section
		$("#proj-list").append(proj_li_tag(tt, true, IDnum));
		$("#projs").append(proj_div_tag(tt, desc, lng, mod, time, true, IDnum));

		//add textarea HTML
		add_textarea_html(IDnum);
	}


	//after projects have been added, make project list slide down
	$("#proj-"+activetab).removeClass('proj-inactive').addClass('proj-active');
	$("#proj-li-"+ activetab +" > .proj-li").addClass('proj-li-active');
	$("#content").slideDown(400);
	


	$("#btn-edit").click(function() {
		/*This is for when the user edits their project.*/
		var thisid = $(".proj-active").attr('id');
		editing = !editing;

		//change text of edit button
		if (editing) { 
			$("#btn-edit").text('Done');

			for (var i=0; i<boxes.length; i++) {
				var box = boxes[i];
				var ptag = "#"+thisid+" > .proj-"+box, tatag = "#"+thisid+" > .proj-"+box+"-ta";
				$(tatag).text($(ptag).text());
				$(ptag).hide();
				$(tatag).show();
				$("#btn-add").attr('disabled', 'disabled');
				$("#btn-crt").attr('disabled', 'disabled');
				$("#btn-save").attr('disabled', 'disabled');
			}

		} else { 
			$("#btn-edit").text('Edit');
			for (var i=0; i<boxes.length; i++) {
				var box = boxes[i];
				var ptag = "#"+thisid+" > .proj-"+box, tatag = "#"+thisid+" > .proj-"+box+"-ta";
				$(ptag).html($(tatag).val().replace(/\n/g, "<br>"));
				$(tatag).hide();
				$(ptag).show();
				//$("#proj-li-"+thisid.replace("proj-", "")+ " > .proj-li-content").text($(tatag).val()); //change <li>
				$("#btn-add").removeAttr('disabled');
				$("#btn-crt").removeAttr('disabled');
				$("#btn-save").removeAttr('disabled');
			}
		}

	});


	$("#btn-save").on('click', function() {
		//add stuff to localStorage
		$(".proj").each(function() {
			console.log(this);
			var projID = $(this).attr('id');
			var tt = $("#"+projID+ " > .proj-tt").text(), desc = $("#"+projID+" > .proj-desc").text(), lng = $("#"+projID+" > .proj-lng").text();
			var mod = $("#"+projID+" > .proj-mod").text(), time = $("#"+projID+" > .proj-time").text();
			save(tt, desc, lng, mod, time, projID.replace("proj-", ""), data, IDs);
		});
	});


	$("#btn-add").on('click', function() {
		//make the input field slide down when "Add" button is pressed
		$("#proj-crt").slideDown(400);
	});


	$("#btn-crt").on('click', function() {
		/*This is for when the user creates a project, i.e. presses "Create".*/

		//temporarily disable Add/Create buttons
		$("#btn-crt").attr('disabled', 'disabled');
		$("#btn-add").attr('disabled', 'disabled');

		//grab input vales and create content for div, also update maxID each creation
		maxID = Math.max.apply(Math, IDnums);
		var tt = $("#proj-crt-tt").val(), desc = $("#proj-crt-desc").val(), lng = $("#proj-crt-lng").val();
		var mod = $("#proj-crt-mod").val(), time = $("#proj-crt-time").val();
		var projID = (maxID + 1).toString();
		IDnums.push(parseInt(projID));
		var contenttobeadded = proj_div_tag(tt, desc, lng, mod, time, false, null);

		console.log(maxID); console.log(IDnums);

		//create list item, slide it down, give it a proper ID
		$("#proj-list").append(proj_li_tag(tt, false, null));
		$("#proj-li-new").slideDown(400);
		$("#proj-li-new").attr('id', "proj-li-"+projID);

		//create empty div, hide it, THEN add its content because something wasn't loading properly
		$("#projs").append("<div id='proj-" + projID + "'></div>");
		newprojID = "#proj-" + projID;
		$(newprojID).hide();
		$(newprojID).append(contenttobeadded);

		//make the current project disappear and make the new project appear
		$(".proj-active").slideUp(400, function() {
			$(".proj-active").addClass('proj-inactive').removeClass('proj-active');
			$(newprojID).slideDown(400, function() {
				$(newprojID).addClass('proj-active');
			});
		});

		//make the inputs slide up and make them empty, re-enable Create button
		$("#proj-crt").slideUp(400, function() {
			$(".proj-crt-in").each(function() {
				$(this).val('');
			});
			$("#btn-crt").removeAttr('disabled');
		});

		//change active <li>
		$('.proj-li-active').removeClass("proj-li-active");
		$("#proj-li-"+ (maxID+1).toString() + " > .proj-li").addClass("proj-li-active");

		//save the new stuff, add the textarea HTML, update last active projects
		save(tt, desc, lng, mod, time, projID, data, IDs);
		add_textarea_html(projID);
		localStorage["warejects-activetab"] = (maxID+1).toString();
		$("#btn-add").removeAttr('disabled');

	});

	
	$("#proj-list").on('click', "li", function(e) {
		/*This is for when the user switches projects (clicks on the list).*/

		//make sure user is not currently editing a project and that the X wasn't clicked instead
		if ((!editing) && (e.target.className !== 'fui-cross')) {
			var li_id = "#"+$(this).attr('id');     //e.g. #proj-li-3
			var projid = li_id.replace("li-", "");  //e.g. #proj-3

			if ($('.proj-active').attr('id') !== projid.replace("#","")) {
				//change colour of <li>
				$('.proj-li-active').removeClass("proj-li-active");
				$(li_id + " > .proj-li").addClass("proj-li-active");

				//load different project
				$(".proj-active").slideToggle(300, function() {
					$(".proj-active").addClass('proj-inactive').removeClass('proj-active');
					$(projid).slideToggle(300, function() {
						$(projid).addClass('proj-active').removeClass('proj-inactive');
					});
				});
			}

			//change last active tab
			activetab = projid.replace("#proj-", "");
			localStorage["warejects-activetab"] = activetab;
		}
	});


	
	$(".fui-cross").on('click', function() {

		//make sure there's more than 1 proj - FAILSAFES, FAILSAFES EVERYWHERE!
		if ($('.proj').length !== 1) {

			var li_id = "#"+$(this).parent().parent().attr('id');
			var projid = li_id.replace("li-", "");

			//if the currently active project is deleted...
			if ($('.proj-active').attr('id') === projid.replace("#","")) {

				//make it disappear before removal, and make a sibling appear
				$(projid).slideUp(200, function() {
					console.log('proj slide')
					if ($(projid).is('#projs > div:last')) {
						console.log('proj is indeed last');
						$(projid).prev().slideDown(200).addClass('proj-active');
					} else {
						$(projid).next().slideDown(200).addClass('proj-active');
					}

					$(projid).remove();
				});

				//make its <li> disappear before removal, make sibling appear
				$(li_id).slideUp(200, function() {
					if ($(li_id).is('#proj-list > li:last')) {
						$("#"+ $(li_id).prev().attr('id') ).children().addClass('proj-li-active'); //I'm sorry
					} else {
						$("#"+ $(li_id).next().attr('id') ).children().addClass('proj-li-active');
					}
				});

			//if it's not the currently active proj...
			} else {
				$(li_id).slideUp(200, function() {
					$(li_id).remove();
					$(projid).remove();
				});
			}

			//remove the project, remove its data
			delete IDs[data[projid.replace("#proj-", "")]["tt"]];
			delete data[projid.replace("#proj-","")];

		}
	});
});