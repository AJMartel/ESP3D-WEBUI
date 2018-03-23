var interval_position=-1;
var control_macrolist = [];

function init_controls_panel(){
    loadmacrolist();
}

function hideZcontrols(){
    document.getElementById('JogBar').style.display = 'none';
    document.getElementById('HomeZ').style.display = 'none';
    document.getElementById('CornerZ').style.display = 'block';
    document.getElementById('control_z_position_display').style.display = 'none';
    document.getElementById('z_velocity_display').style.display = 'none';
}

function showZcontrols(){
    document.getElementById('CornerZ').style.display = 'none';
    document.getElementById('JogBar').style.display = 'block';
    document.getElementById('HomeZ').style.display = 'block';
    document.getElementById('control_z_position_display').style.display = 'block';
    document.getElementById('z_velocity_display').style.display = 'inline';
    
}

function loadmacrolist() {
    control_macrolist = [];
    var url = "/macrocfg.json";
    //removeIf(production)
    var response= "[{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":0},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":1},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":2},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":3},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":4},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":5},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":6},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":7},{\"name\":\"\",\"glyph\":\"\",\"filename\":\"\",\"target\":\"\",\"class\":\"\",\"index\":8}]";
    processMacroGetSuccess(response);
    return;
    //endRemoveIf(production)
    SendGetHttp(url, processMacroGetSuccess, processMacroGetFailed);
}

function Macro_build_list(response_text){
    var response = [];
    try {
        if(response_text.length != 0) 
        {
            response = JSON.parse(response_text);
        }
        }
    catch (e) {
        console.error("Parsing error:", e); 
    }
    for (var i = 0; i < 9 ; i++) {
        var entry; 
        if ((response.length != 0) && (typeof(response[i].name ) !== 'undefined' && typeof(response[i].glyph ) !== 'undefined'  && typeof(response[i].filename ) !== 'undefined'  && typeof(response[i].target ) !== 'undefined'  && typeof(response[i].class ) !== 'undefined'  && typeof(response[i].index ) !== 'undefined' )) {
            entry = {name : response[i].name, glyph: response[i].glyph,  filename : response[i].filename, target : response[i].target, class : response[i].class, index: response[i].index};
        }
        else {
            entry = {name :'', glyph: '', filename : '', target : '', class : '', index: i};
         }
        control_macrolist.push(entry);
    }
    control_build_macro_ui();
}

function processMacroGetSuccess(response){
     if (response.indexOf("<HTML>") == -1)  Macro_build_list(response);
     else Macro_build_list("");
}

function processMacroGetFailed(errorcode, response){
     console.log("Error " + errorcode + " : " + response);
     Macro_build_list("");
}

function on_autocheck_position(use_value){
    if (typeof (use_value) !== 'undefined' )  document.getElementById('autocheck_position').checked =use_value;
    if (document.getElementById('autocheck_position').checked) {
       var interval = parseInt(document.getElementById('posInterval_check').value);
       if (!isNaN(interval) && interval > 0 && interval < 100) {
           if (interval_position != -1 )clearInterval(interval_position);
           interval_position = setInterval(function(){ get_Position() }, interval * 1000);
            }
        else {
            document.getElementById('autocheck_position').checked = false;
            document.getElementById('posInterval_check').value = 0;
            if (interval_position != -1 )clearInterval(interval_position);
            interval_position = -1;
        }
    }
  else {
        if (interval_position != -1 )clearInterval(interval_position);
        interval_position = -1;
    }
}

function onPosIntervalChange(){
var interval = parseInt(document.getElementById('posInterval_check').value);
 if (!isNaN(interval) && interval > 0 && interval < 100 ) {
       on_autocheck_position();   
    }
else {
    document.getElementById('autocheck_position').checked = false;
    document.getElementById('posInterval_check').value = 0;
    if (interval != 0)alertdlg (translate_text_item("Out of range"), translate_text_item( "Value of auto-check must be between 0s and 99s !!"));
    on_autocheck_position();
    }
}

function get_Position(){
    var command = "M114";
    if (target_firmware == "grbl")  command = "?";
    //removeIf(production)
    var response = "ok C: X:0.0000 Y:0.0000 Z:0.0000 E:0.0000 ";
    if (target_firmware == "grbl")  response = "<Idle|MPos:10.000,0.000,0.000|FS:0,0|Ov:71,100,147>";
    process_Position(response);
    return;
    //endRemoveIf(production)
    SendPrinterCommand(command, false, process_Position);
}

 function Control_get_position_value(label, result_data) {
    var result = "";
    var pos1  = result_data.indexOf(label, 0);
    if (pos1 > -1){
        pos1 += label.length;
        var pos2 = result_data.indexOf(" ", pos1);
        if (pos2 > -1){
            result = result_data.substring(pos1,pos2);
        } else  result = result_data.substring(pos1);
    }
    return result.trim();
}

function process_Position(response){
     if (target_firmware == "grbl"){
         var tab1 = response.split("MPos:");
         if (tab1.length >1) {
            var tab2 = tab1[1].split("|");
            var tab3 = tab2[0].split(",");
            document.getElementById('control_x_position').innerHTML = tab3[0];
            if (tab3.length > 1) document.getElementById('control_y_position').innerHTML = tab3[1];
            if (tab3.length > 2) document.getElementById('control_z_position').innerHTML = tab3[2];
            } 
     } else {
        document.getElementById('control_x_position').innerHTML = Control_get_position_value("X:", response);
        document.getElementById('control_y_position').innerHTML = Control_get_position_value("Y:", response);
        document.getElementById('control_z_position').innerHTML = Control_get_position_value("Z:", response);
        }
}

function control_motorsOff(){
    var command = "M84";
    SendPrinterCommand(command, true);
}

function SendHomecommand (cmd){
     SendPrinterCommand(cmd, true, get_Position);
}

 function SendJogcommand(cmd, feedrate){
     var feedratevalue = "";
     var command ="";
    if (feedrate == "XYfeedrate") {
        feedratevalue = parseInt(document.getElementById('control_xy_velocity').value);
        if (feedratevalue < 1 || feedratevalue > 9999 || isNaN(feedratevalue) || (feedratevalue === null)) {
            alertdlg (translate_text_item("Out of range"), translate_text_item( "XY feedrate value must be between 1 mm/min and 9999 mm/min !"));
            document.getElementById('control_xy_velocity').value = preferenceslist[0].xy_feedrate;
            return;
        }
    } else {
        feedratevalue = parseInt(document.getElementById('control_z_velocity').value);
         if (feedratevalue < 1 || feedratevalue > 999 || isNaN(feedratevalue) || (feedratevalue === null)) {
            alertdlg (translate_text_item("Out of range"), translate_text_item( "Z feedrate value must be between 1 mm/min and 999 mm/min !"));
            document.getElementById('control_z_velocity').value = preferenceslist[0].z_feedrate;
            return;
        }
    }
    command = "G91\nG1 " + cmd + " F" + feedratevalue + "\nG90"; 
    SendPrinterCommand(command, true, get_Position);
 }
  
 function onXYvelocityChange () {
    var feedratevalue =  parseInt(document.getElementById('control_xy_velocity').value);
    if (feedratevalue < 1 || feedratevalue > 9999 || isNaN(feedratevalue) || (feedratevalue === null)) {
        //we could display error but we do not
        }
}
        
function onZvelocityChange () {
    var feedratevalue =  parseInt(document.getElementById('control_z_velocity').value);
    if (feedratevalue < 1 || feedratevalue > 999 || isNaN(feedratevalue) || (feedratevalue === null)) {
        //we could display error but we do not
        }
}


function processMacroSave(answer){
    if (answer == "ok"){
        //console.log("now rebuild list");
        control_build_macro_ui();
    }
}

function control_build_macro_button(index){
    var content = "";
    var entry  = control_macrolist[index];
    content+="<button class='btn "+control_macrolist[index].class+"' type='text' ";
    if (entry.glyph.length == 0){
        content+="style='display:none'";
     }
    content+= "onclick='macro_command (\"" + entry.target + "\",\"" + entry.filename + "\")'";
    content+="><span style='position:relative; top:3px;'>";
    if (entry.glyph.length == 0){
        content+=get_icon_svg("star");
     } else content+=get_icon_svg(entry.glyph);
    content+="</span>";
    if (entry.name.length > 0){
        content+="&nbsp;";
     }
    content+=entry.name;
    content+="</button>";
            
    return content;
}

function control_build_macro_ui(){
    var content = "<button class='btn btn-primary' onclick='showmacrodlg(processMacroSave)'>";
    content +="<span class='badge'>";
    content +="<svg width='1.3em' height='1.2em' viewBox='0 0 1300 1200'>";
     content +="<g transform='translate(50,1200) scale(1, -1)'>";
    content +="<path  fill='currentColor' d='M407 800l131 353q7 19 17.5 19t17.5 -19l129 -353h421q21 0 24 -8.5t-14 -20.5l-342 -249l130 -401q7 -20 -0.5 -25.5t-24.5 6.5l-343 246l-342 -247q-17 -12 -24.5 -6.5t-0.5 25.5l130 400l-347 251q-17 12 -14 20.5t23 8.5h429z' />";
    content +="</g>";
    content +="</svg>";
    content +="<svg width='1.3em' height='1.2em' viewBox='0 0 1300 1200'>";
    content +="<g transform='translate(50,1200) scale(1, -1)'>";
    content +="<path  fill='currentColor' d='M1011 1210q19 0 33 -13l153 -153q13 -14 13 -33t-13 -33l-99 -92l-214 214l95 96q13 14 32 14zM1013 800l-615 -614l-214 214l614 614zM317 96l-333 -112l110 335z' />";
    content +="</g>";
    content +="</svg>";
    content +="</span>";
    content +="</button>";
     for (var i = 0; i < 9 ; i++) {
        content+=control_build_macro_button(i);
     }
     document.getElementById('Macro_list').innerHTML=content;
}

function macro_command (target, filename) {
    var cmd = ""
    if (target == "ESP") {
        cmd = "[ESP700]"+filename;
        } else if (target == "SD") {
        cmd = "play " + filename;
        if (target_firmware != "smoothieware"){
            cmd =  "M23 " + filename + "\nM24"; 
            }
        } else return;
    //console.log(cmd);
    SendPrinterCommand(cmd);
}

