//Preferences dialog
var preferenceslist = [];
var language_save = language;
var defaultpreferenceslist= "[{\
                                            \"language\":\"en\",\
                                            \"enable_camera\":\"false\",\
                                            \"auto_load_camera\":\"false\",\
                                            \"camera_address\":\"\",\
                                            \"enable_second_extruder\":\"false\",\
                                            \"enable_bed\":\"false\",\
                                            \"enable_fan\":\"false\",\
                                            \"enable_z\":\"true\",\
                                            \"enable_control_panel\":\"true\",\
                                            \"interval_positions\":\"3\",\
                                            \"interval_temperatures\":\"3\",\
                                            \"xy_feedrate\":\"1000\",\
                                            \"z_feedrate\":\"100\",\
                                            \"e_feedrate\":\"400\",\
                                            \"e_distance\":\"5\",\
                                            \"enable_temperatures_panel\":\"true\",\
                                            \"enable_extruder_panel\":\"true\",\
                                            \"enable_files_panel\":\"true\",\
                                            \"enable_commands_panel\":\"true\",\
                                            \"enable_autoscroll\":\"true\",\
                                            \"enable_temperatures_filters\":\"true\"\
                                            }]";
var preferences_file_name = '/preferences.json';
function getpreferenceslist(){
    var url = preferences_file_name;
    preferenceslist = [];
    //removeIf(production)
    var response= defaultpreferenceslist;
    processPreferencesGetSuccess(response);
    return;
    //endRemoveIf(production)
    SendGetHttp(url, processPreferencesGetSuccess, processPreferencesGetFailed);
}

function prefs_toggledisplay(id_source) {
    switch(id_source) {
        case 'show_camera_panel':
            if (document.getElementById(id_source).checked) document.getElementById("camera_preferences").style.display = "block";
            else document.getElementById("camera_preferences").style.display = "none";
            break;
        case 'show_control_panel':
            if (document.getElementById(id_source).checked) document.getElementById("control_preferences").style.display = "block";
            else document.getElementById("control_preferences").style.display = "none";
            break;
        case 'show_extruder_panel':
            if (document.getElementById(id_source).checked) document.getElementById("extruder_preferences").style.display = "block";
            else document.getElementById("extruder_preferences").style.display = "none";
            break;
        case 'show_temperatures_panel':
            if (document.getElementById(id_source).checked) document.getElementById("temperatures_preferences").style.display = "block";
            else document.getElementById("temperatures_preferences").style.display = "none";
            break;
        case 'enable_z_controls':
            if (document.getElementById(id_source).checked) document.getElementById("control_z_feedrate").style.display = "block";
            else document.getElementById("control_z_feedrate").style.display = "none";
            break;
        case 'show_commands_panel':
            if (document.getElementById(id_source).checked) document.getElementById("cmd_preferences").style.display = "block";
            else document.getElementById("cmd_preferences").style.display = "none";
            break;
    }
}

function processPreferencesGetSuccess(response){
     if (response.indexOf("<HTML>") == -1)  Preferences_build_list(response);
     else Preferences_build_list(defaultpreferenceslist);
}

function processPreferencesGetFailed(errorcode, response){
     console.log("Error " + errorcode + " : " + response);
     Preferences_build_list(defaultpreferenceslist);
}

function Preferences_build_list(response_text){
    preferenceslist = [];
     try {
        if(response_text.length != 0) { 
            console.log("found");
            console.log(response_text);  
            preferenceslist = JSON.parse(response_text);
        } else {
             console.log("default");
             console.log(defaultpreferenceslist);  
             preferenceslist = JSON.parse(defaultpreferenceslist);
         }
    }
    catch (e) {
        console.error("Parsing error:", e); 
        preferenceslist = JSON.parse(defaultpreferenceslist);
    }
    applypreferenceslist();
}

function applypreferenceslist(){
    //Assign each control state
    translate_text(preferenceslist[0].language);
   if (typeof document.getElementById('camtab') != "undefined") {
       var camoutput =false;
        if (typeof(preferenceslist[0].enable_camera ) !== 'undefined') {
             if (preferenceslist[0].enable_camera === 'true'){
                 document.getElementById('camtablink').style.display = "block";
               camera_GetAddress();
             if (typeof(preferenceslist[0].auto_load_camera ) !== 'undefined') {              
                      if (preferenceslist[0].auto_load_camera === 'true') {
                         var saddress = document.getElementById('camera_webaddress').value
                         camera_loadframe();
                         camoutput=true;
                        }
                    }
                }
             else {
                 document.getElementById("maintablink").click();
                 document.getElementById('camtablink').style.display = "none";
                }
             } else {
                 document.getElementById("maintablink").click();
                 document.getElementById('camtablink').style.display = "none";
             }
        if (!camoutput) {
                 document.getElementById('camera_frame').src = "";
                 document.getElementById('camera_frame_display').style.display = "none";
                 document.getElementById('camera_detach_button').style.display = "none";
            }
         }
    
    if (preferenceslist[0].enable_second_extruder === 'true') {
        document.getElementById('second_extruder_UI').style.display='block';
        document.getElementById('temperature_secondExtruder').style.display='table-row';
        }
    else {
        document.getElementById('second_extruder_UI').style.display='none';
        document.getElementById('temperature_secondExtruder').style.display='none';
        }
    
    if (preferenceslist[0].enable_bed === 'true') {
        document.getElementById('temperature_bed').style.display='table-row';
        document.getElementById('bedtemperaturesgraphic').style.display='block';
        }
    else {
        document.getElementById('temperature_bed').style.display='none';
        document.getElementById('bedtemperaturesgraphic').style.display='none';
        }
    
    if (preferenceslist[0].enable_fan === 'true')document.getElementById('fan_UI').style.display='block';
    else document.getElementById('fan_UI').style.display='none';
    
    if (preferenceslist[0].enable_z === 'true')showZcontrols();
    else hideZcontrols();
    
    if (preferenceslist[0].enable_control_panel === 'true')document.getElementById('controlPanel').style.display='flex';
    else {
        document.getElementById('controlPanel').style.display='none';
        on_autocheck_position(false);
    }
    
    if (preferenceslist[0].enable_temperatures_panel === 'true') {
        document.getElementById('temperaturesPanel').style.display='block';
        document.getElementById('cmd_temperature_filter').style.display='inline';
        if (preferenceslist[0].enable_temperatures_filters === 'true'){
            document.getElementById('monitor_enable_filter_temperatures').checked =true;
            Monitor_check_filter_temperatures();
        } else document.getElementById('monitor_enable_filter_temperatures').checked =false;
    }
    else {
        document.getElementById('temperaturesPanel').style.display='none';
        on_autocheck_temperature(false);
        document.getElementById('cmd_temperature_filter').style.display='none';
    }
    
    if (preferenceslist[0].enable_extruder_panel === 'true')document.getElementById('extruderPanel').style.display='flex';
    else document.getElementById('extruderPanel').style.display='none';
    
    if (preferenceslist[0].enable_files_panel === 'true')document.getElementById('filesPanel').style.display='flex';
    else document.getElementById('filesPanel').style.display='none';
    
    if (preferenceslist[0].enable_commands_panel === 'true') {
        document.getElementById('commandsPanel').style.display='flex';
           if (preferenceslist[0].enable_autoscroll === 'true'){
            document.getElementById('monitor_enable_autoscroll').checked =true;
            Monitor_check_autoscroll();
            } else document.getElementById('monitor_enable_autoscroll').checked =false;
        }
    else document.getElementById('commandsPanel').style.display='none';
    
    document.getElementById('posInterval_check').value= preferenceslist[0].interval_positions;
    document.getElementById('control_xy_velocity').value= preferenceslist[0].xy_feedrate;
    document.getElementById('control_z_velocity').value= preferenceslist[0].z_feedrate;
    document.getElementById('tempInterval_check').value= preferenceslist[0].interval_temperatures;
    document.getElementById('filament_length').value= preferenceslist[0].e_distance;
    document.getElementById('extruder_velocity').value= preferenceslist[0].e_feedrate;
}

function showpreferencesdlg() {
   var modal = setactiveModal('preferencesdlg.html');
    if ( modal == null) return;
    language_save = language;
    build_dlg_preferences_list();
    document.getElementById('preferencesdlg_upload_msg').style.display='none';
    showModal() ;
}

function build_dlg_preferences_list(){
    //use preferenceslist to set dlg status
    var content = "<table><tr><td>";
     content+= get_icon_svg("flag") + "&nbsp;</td><td>";
     content+=build_language_list("language_preferences");
     content+="</td></tr></table>";
     document.getElementById("preferences_langage_list").innerHTML=content;
    //camera
     if (typeof(preferenceslist[0].enable_camera ) !== 'undefined') {
        document.getElementById('show_camera_panel').checked = (preferenceslist[0].enable_camera === 'true');
     } else document.getElementById('show_camera_panel').checked = false;
     //autoload camera
     if (typeof(preferenceslist[0].auto_load_camera ) !== 'undefined') {
        document.getElementById('autoload_camera_panel').checked = (preferenceslist[0].auto_load_camera === 'true');
     } else document.getElementById('autoload_camera_panel').checked = false;
     //camera address
     if (typeof(preferenceslist[0].camera_address ) !== 'undefined') {
        document.getElementById('preferences_camera_webaddress').value = decode_entitie(preferenceslist[0].camera_address);
     } else document.getElementById('preferences_camera_webaddress').value = "";
     //second extruder
     if (typeof(preferenceslist[0].enable_second_extruder ) !== 'undefined') {
        document.getElementById('enable_second_extruder_controls').checked = (preferenceslist[0].enable_second_extruder === 'true');
     } else document.getElementById('enable_second_extruder_controls').checked = false;
     //bed
     if (typeof(preferenceslist[0].enable_bed ) !== 'undefined') {
        document.getElementById('enable_bed_controls').checked = (preferenceslist[0].enable_bed === 'true');
     } else document.getElementById('enable_bed_controls').checked = false;
     //fan
      if (typeof(preferenceslist[0].enable_fan ) !== 'undefined') {
        document.getElementById('enable_fan_controls').checked = (preferenceslist[0].enable_fan === 'true');
     } else document.getElementById('enable_fan_controls').checked = false;
       //z axis
      if (typeof(preferenceslist[0].enable_z ) !== 'undefined') {
        document.getElementById('enable_z_controls').checked = (preferenceslist[0].enable_z === 'true');
     } else document.getElementById('enable_z_controls').checked = false;
     //control panel
      if (typeof(preferenceslist[0].enable_control_panel ) !== 'undefined') {
        document.getElementById('show_control_panel').checked = (preferenceslist[0].enable_control_panel === 'true');
     } else document.getElementById('show_control_panel').checked = false;
     //temperatures panel
      if (typeof(preferenceslist[0].enable_temperatures_panel ) !== 'undefined') {
        document.getElementById('show_temperatures_panel').checked = (preferenceslist[0].enable_temperatures_panel === 'true');
     } else document.getElementById('show_temperatures_panel').checked = false;
     //extruders
      if (typeof(preferenceslist[0].enable_extruder_panel ) !== 'undefined') {
        document.getElementById('show_extruder_panel').checked = (preferenceslist[0].enable_extruder_panel === 'true');
     } else document.getElementById('show_extruder_panel').checked = false;
     //files panel
      if (typeof(preferenceslist[0].enable_files_panel ) !== 'undefined') {
        document.getElementById('show_files_panel').checked = (preferenceslist[0].enable_files_panel === 'true');
     } else document.getElementById('show_files_panel').checked = false;
     //commands
      if (typeof(preferenceslist[0].enable_commands_panel ) !== 'undefined') {
        document.getElementById('show_commands_panel').checked = (preferenceslist[0].enable_commands_panel === 'true');
     } else document.getElementById('show_commands_panel').checked = false;
     //interval positions
      if (typeof(preferenceslist[0].interval_positions ) !== 'undefined') {
        document.getElementById('preferences_pos_Interval_check').value = parseInt(preferenceslist[0].interval_positions) ;
     } else document.getElementById('preferences_pos_Interval_check').value = parseInt(defaultpreferenceslist[0].interval_positions);
     //xy feedrate
      if (typeof(preferenceslist[0].xy_feedrate ) !== 'undefined') {
        document.getElementById('preferences_control_xy_velocity').value = parseInt(preferenceslist[0].xy_feedrate) ;
     } else document.getElementById('preferences_control_xy_velocity').value = parseInt(defaultpreferenceslist[0].xy_feedrate);
     //z feedrate
      if (typeof(preferenceslist[0].z_feedrate ) !== 'undefined') {
        document.getElementById('preferences_control_z_velocity').value = parseInt(preferenceslist[0].z_feedrate) ;
     } else document.getElementById('preferences_control_z_velocity').value = parseInt(defaultpreferenceslist[0].z_feedrate);
      //interval temperatures
      if (typeof(preferenceslist[0].interval_temperatures ) !== 'undefined') {
        document.getElementById('preferences_tempInterval_check').value = parseInt(preferenceslist[0].interval_temperatures) ;
     } else document.getElementById('preferences_tempInterval_check').value = parseInt(defaultpreferenceslist[0].interval_temperatures);
      //e feedrate
      if (typeof(preferenceslist[0].e_feedrate ) !== 'undefined') {
        document.getElementById('preferences_e_velocity').value = parseInt(preferenceslist[0].e_feedrate) ;
     } else document.getElementById('preferences_e_velocity').value = parseInt(defaultpreferenceslist[0].e_feedrate);
      //e distance
      if (typeof(preferenceslist[0].e_distance ) !== 'undefined') {
        document.getElementById('preferences_filament_length').value = parseInt(preferenceslist[0].e_distance) ;
     } else document.getElementById('preferences_filament_length').value = parseInt(defaultpreferenceslist[0].e_distance);
     //autoscroll
      if (typeof(preferenceslist[0].enable_autoscroll ) !== 'undefined') {
        document.getElementById('preferences_autoscroll').checked = (preferenceslist[0].enable_autoscroll === 'true');
     } else document.getElementById('preferences_autoscroll').checked = false;
     //filter temperatures
      if (typeof(preferenceslist[0].enable_temperatures_filters ) !== 'undefined') {
        document.getElementById('preferences_filter_temperatures').checked = (preferenceslist[0].enable_temperatures_filters === 'true');
     } else document.getElementById('preferences_filter_temperatures').checked = false;
     
     prefs_toggledisplay( 'show_camera_panel');
     prefs_toggledisplay( 'show_control_panel');
     prefs_toggledisplay( 'show_extruder_panel');
     prefs_toggledisplay( 'show_temperatures_panel');
     prefs_toggledisplay( 'enable_z_controls');
     prefs_toggledisplay( 'show_commands_panel');
}

function closePreferencesDialog(){
    var modified = false;
    if (preferenceslist[0].length !=0) {
        //check dialog compare to global state
        if ( (typeof(preferenceslist[0].language ) === 'undefined') ||
            (typeof(preferenceslist[0].enable_camera ) === 'undefined') || 
            (typeof(preferenceslist[0].auto_load_camera ) === 'undefined') ||
            (typeof(preferenceslist[0].camera_address ) === 'undefined') ||
            (typeof(preferenceslist[0].enable_second_extruder ) === 'undefined') || 
            (typeof(preferenceslist[0].enable_bed ) === 'undefined') || 
            (typeof(preferenceslist[0].enable_fan ) === 'undefined') ||
            (typeof(preferenceslist[0].enable_z ) === 'undefined') ||
            (typeof(preferenceslist[0].xy_feedrate ) === 'undefined') ||
            (typeof(preferenceslist[0].z_feedrate ) === 'undefined') ||
            (typeof(preferenceslist[0].e_feedrate ) === 'undefined') ||
            (typeof(preferenceslist[0].e_distance ) === 'undefined') ||
            (typeof(preferenceslist[0].enable_control_panel ) === 'undefined') || 
            (typeof(preferenceslist[0].enable_temperatures_panel ) === 'undefined') || 
            (typeof(preferenceslist[0].enable_extruder_panel ) === 'undefined') ||
            (typeof(preferenceslist[0].enable_files_panel ) === 'undefined') ||
            (typeof(preferenceslist[0].interval_positions ) === 'undefined') ||
            (typeof(preferenceslist[0].interval_temperatures ) === 'undefined') ||
            (typeof(preferenceslist[0].enable_autoscroll ) === 'undefined') ||
            (typeof(preferenceslist[0].enable_temperatures_filters ) === 'undefined') ||
            (typeof(preferenceslist[0].enable_commands_panel ) === 'undefined') ){
            modified = true;
        } else {
            //camera
            if (document.getElementById('show_camera_panel').checked != (preferenceslist[0].enable_camera === 'true')) modified = true;
            //Autoload
            if (document.getElementById('autoload_camera_panel').checked !=  (preferenceslist[0].auto_load_camera === 'true')) modified = true;
            //camera address
             if (document.getElementById('preferences_camera_webaddress').value !=  decode_entitie(preferenceslist[0].camera_address)) modified = true;
            //second extruder
            if (document.getElementById('enable_second_extruder_controls').checked != (preferenceslist[0].enable_second_extruder === 'true')) modified = true;
            //bed
            if (document.getElementById('enable_bed_controls').checked != (preferenceslist[0].enable_bed === 'true')) modified = true;
            //fan.
            if (document.getElementById('enable_fan_controls').checked !=  (preferenceslist[0].enable_fan === 'true')) modified = true;
             //Z 
            if (document.getElementById('enable_z_controls').checked !=  (preferenceslist[0].enable_z === 'true')) modified = true;
            //control panel
            if (document.getElementById('show_control_panel').checked !=  (preferenceslist[0].enable_control_panel === 'true')) modified = true;
            //temperatures panel
            if (document.getElementById('show_temperatures_panel').checked != (preferenceslist[0].enable_temperatures_panel === 'true')) modified = true;
            //extruder panel
            if (document.getElementById('show_extruder_panel').checked != (preferenceslist[0].enable_extruder_panel === 'true')) modified = true;
            //files panel
            if (document.getElementById('show_files_panel').checked != (preferenceslist[0].enable_files_panel === 'true')) modified = true;
            //commands
            if (document.getElementById('show_commands_panel').checked != (preferenceslist[0].enable_commands_panel === 'true')) modified = true;
            //interval positions
             if (document.getElementById('preferences_pos_Interval_check').value != parseInt(preferenceslist[0].interval_positions)) modified = true;
             //xy feedrate
             if (document.getElementById('preferences_control_xy_velocity').value != parseInt(preferenceslist[0].xy_feedrate)) modified = true;
             //z feedrate
             if (document.getElementById('preferences_control_z_velocity').value != parseInt(preferenceslist[0].z_feedrate)) modified = true;
             //interval temperatures
             if (document.getElementById('preferences_tempInterval_check').value != parseInt(preferenceslist[0].interval_temperatures)) modified = true;
             //e feedrate
             if (document.getElementById('preferences_e_velocity').value != parseInt(preferenceslist[0].e_feedrate)) modified = true;
             //e distance
             if (document.getElementById('preferences_filament_length').value != parseInt(preferenceslist[0].e_distance)) modified = true;
             //autoscroll
            if (document.getElementById('preferences_autoscroll').checked != (preferenceslist[0].enable_autoscroll === 'true')) modified = true;
             //filter temperatures
            if (document.getElementById('preferences_filter_temperatures').checked != (preferenceslist[0].enable_temperatures_filters === 'true')) modified = true;
        }
    } else  modified = true;
   if (language_save != language)  modified = true;
    if (modified){
         confirmdlg(translate_text_item("Data mofified"), translate_text_item("Do you want to save?"), process_preferencesCloseDialog)
     }
     else {
            closeModal('cancel');
            }
}

function process_preferencesCloseDialog(answer){
if (answer == 'no' ){
    //console.log("Answer is no so exit");
    translate_text(language_save);
    closeModal('cancel');
    }
else {
       // console.log("Answer is yes so let's save");
        SavePreferences();
        }
}

function SavePreferences(current_preferences){
    if (http_communication_locked) {
         alertdlg (translate_text_item("Busy..."), translate_text_item("Communications are currently locked, please wait and retry."));
    return;
    }
     if (((typeof( current_preferences ) != 'undefined' )&& !current_preferences) || (typeof( current_preferences ) == 'undefined' )){
        if (!Checkvalues("preferences_pos_Interval_check") ||
             !Checkvalues("preferences_control_xy_velocity") ||
             !Checkvalues("preferences_control_z_velocity") ||
             !Checkvalues("preferences_e_velocity") ||
             !Checkvalues("preferences_tempInterval_check") ||
              !Checkvalues("preferences_filament_length")
             ) return;
        preferenceslist =[];
        var saveprefs ="[{\"language\":\"" + language ;
        saveprefs += "\",\"enable_camera\":\"" + document.getElementById('show_camera_panel').checked ;
        saveprefs += "\",\"auto_load_camera\":\"" + document.getElementById('autoload_camera_panel').checked ;
        saveprefs += "\",\"camera_address\":\"" + HTMLEncode(document.getElementById('preferences_camera_webaddress').value) ;
        saveprefs +="\",\"enable_second_extruder\":\"" + document.getElementById('enable_second_extruder_controls').checked ; 
        saveprefs +="\",\"enable_bed\":\"" +  document.getElementById('enable_bed_controls').checked ;
        saveprefs +="\",\"enable_fan\":\"" +  document.getElementById('enable_fan_controls').checked ;
        saveprefs +="\",\"enable_z\":\"" +  document.getElementById('enable_z_controls').checked ;
        saveprefs +="\",\"enable_control_panel\":\"" +  document.getElementById('show_control_panel').checked ;
        saveprefs +="\",\"enable_temperatures_panel\":\"" +  document.getElementById('show_temperatures_panel').checked ;
        saveprefs +="\",\"enable_extruder_panel\":\"" +  document.getElementById('show_extruder_panel').checked ;
        saveprefs +="\",\"enable_files_panel\":\"" +  document.getElementById('show_files_panel').checked ;
        saveprefs +="\",\"interval_positions\":\"" +  document.getElementById('preferences_pos_Interval_check').value ;
        saveprefs +="\",\"xy_feedrate\":\"" +  document.getElementById('preferences_control_xy_velocity').value ;
        saveprefs +="\",\"z_feedrate\":\"" +  document.getElementById('preferences_control_z_velocity').value ;
        saveprefs +="\",\"interval_temperatures\":\"" +  document.getElementById('preferences_tempInterval_check').value ;
        saveprefs +="\",\"e_feedrate\":\"" +  document.getElementById('preferences_e_velocity').value ;
        saveprefs +="\",\"e_distance\":\"" +  document.getElementById('preferences_filament_length').value ;
        saveprefs +="\",\"enable_autoscroll\":\"" +  document.getElementById('preferences_autoscroll').checked ;
        saveprefs +="\",\"enable_temperatures_filters\":\"" +  document.getElementById('preferences_filter_temperatures').checked ;
        saveprefs +="\",\"enable_commands_panel\":\""+   document.getElementById('show_commands_panel').checked +"\"}]";
        preferenceslist = JSON.parse(saveprefs);
        } 
    var blob = new Blob([JSON.stringify(preferenceslist, null, " ")], {type : 'application/json'});
    var file = new File([blob], preferences_file_name);
    var formData = new FormData();
    var url = "/files";
    formData.append('path', '/');
    formData.append('myfile[]', file, preferences_file_name);
    if ((typeof( current_preferences ) != 'undefined' ) && current_preferences )SendFileHttp(url, formData);
    else SendFileHttp(url, formData, preferencesdlgUploadProgressDisplay, preferencesUploadsuccess, preferencesUploadfailed);
}

function preferencesdlgUploadProgressDisplay(oEvent){
    if (oEvent.lengthComputable) {
        var percentComplete = (oEvent.loaded / oEvent.total)*100;
        document.getElementById('preferencesdlg_prg').value=percentComplete;
        document.getElementById('preferencesdlg_upload_percent').innerHTML = percentComplete.toFixed(0) ;
        document.getElementById('preferencesdlg_upload_msg').style.display='block';
      } else {
        // Impossible because size is unknown
      }
}

function preferencesUploadsuccess(response){
    document.getElementById('preferencesdlg_upload_msg').style.display='none';
    applypreferenceslist();
    closeModal('ok');
}

function preferencesUploadfailed(errorcode, response){
    alertdlg (translate_text_item("Error"), translate_text_item("Save preferences failed!"));
}


function Checkvalues(id_2_check){
var status = true;
var value = 0;
   switch (id_2_check) {
        case "preferences_tempInterval_check":
        case "preferences_pos_Interval_check":
            value = parseInt(document.getElementById(id_2_check).value);
            if (!(!isNaN(value) && value >= 1 && value <= 100 )) { 
               error_message = translate_text_item( "Value of auto-check must be between 0s and 99s !!");
               status = false;
                }
            break;
       case "preferences_control_xy_velocity":
            value = parseInt(document.getElementById(id_2_check).value);
            if (!(!isNaN(value) && value >= 1 && value <= 9999 )) { 
                error_message = translate_text_item( "XY feedrate value must be between 1 mm/min and 9999 mm/min !");
                status = false;
                }
            break;
        case "preferences_control_z_velocity":
            value = parseInt(document.getElementById(id_2_check).value);
            if (!(!isNaN(value) && value >= 1 && value <=999 )) { 
                error_message = translate_text_item( "Z feedrate value must be between 1 mm/min and 9999 mm/min !");
                status = false;
                }
            break;
         case "preferences_tempInterval_check":
            value = parseInt(document.getElementById(id_2_check).value);
            if (!(!isNaN(value) && value > 0 && value < 100 )) { 
               error_message = translate_text_item( "Value of auto-check must be between 0s and 99s !!");
               status = false;
                }
            break;
         case "preferences_e_velocity":
         value = parseInt(document.getElementById(id_2_check).value);
            if (!(!isNaN(value) && value >= 1 && value <= 9999 )) { 
               error_message = translate_text_item( "Value of extruder velocity must be between1 mm/min and 9999 mm/min !");
               status = false;
                }
            break;
        case "preferences_filament_length":
         value = parseInt(document.getElementById(id_2_check).value);
            if (!(!isNaN(value) && value >= 0.001 && value <= 9999 )) { 
               error_message = translate_text_item( "Value of filament length must be between 0.001 mm and 9999 mm !");
               status = false;
                }
            break;
       
    }
    if (status) {
        document.getElementById(id_2_check+"_group").className="form-group";
        document.getElementById(id_2_check+"_icon").innerHTML="";
    } else {
        document.getElementById(id_2_check+"_group").className="form-group has-feedback has-error";
        document.getElementById(id_2_check+"_icon").innerHTML=get_icon_svg("remove");
         alertdlg (translate_text_item("Out of range"), error_message);
    }
   return status;
}
