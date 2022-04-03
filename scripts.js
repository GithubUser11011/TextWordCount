function initialize()
{
   // ************************ Drag and drop ***************** //
   stopDropArea = document.getElementById("stop-drop-area")
   textDropArea = document.getElementById("text-drop-area")
   
   var stop_file = ""
   var text_file = ""

   stop_list = []
   word_map = new Map()

   // Prevent default drag behaviors
   ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => 
   {
       stopDropArea.addEventListener(eventName, preventDefaults, false)
       textDropArea.addEventListener(eventName, preventDefaults, false)
       document.body.addEventListener(eventName, preventDefaults, false)
   })

   // Highlight drop area when item is dragged over it
   ;['dragenter', 'dragover'].forEach(eventName => 
   {
       stopDropArea.addEventListener(eventName, stophighlight, false)
       textDropArea.addEventListener(eventName, texthighlight, false)
   })

   ;['dragleave', 'drop'].forEach(eventName => 
   {
       stopDropArea.addEventListener(eventName, stopunhighlight, false)
       textDropArea.addEventListener(eventName, textunhighlight, false)
   })

   // Handle dropped files
   stopDropArea.addEventListener('drop', handleStopDrop, false)
   textDropArea.addEventListener('drop', handleTextDrop, false)
}

function preventDefaults(e)
{
   e.preventDefault()
   e.stopPropagation()
}

function stophighlight(e)
{
   stopDropArea.classList.add('highlight')
}

function stopunhighlight(e)
{
   stopDropArea.classList.remove('highlight')
}

function texthighlight(e)
{
   textDropArea.classList.add('highlight')
}

function textunhighlight(e)
{
   textDropArea.classList.remove('highlight')
}

function handleStopDrop(e)
{
   var dt = e.dataTransfer;
   var files = dt.files;

   if (files.length > 1)
   {
      alert ("Please only upload one file at a time")
   }
   else
   {
      var file = this.files[0];

      var reader = new FileReader();
      reader.onload = function(progressEvent)
      {
         // Entire file
         console.log(this.result);
    
         // By lines
         var lines = this.result.split('\n');
         for(var line = 0; line < lines.length; line++)
         {
            console.log(lines[line]);
         }
      };
   }
}

function handleTextDrop(e)
{
   var dt = e.dataTransfer;
   var files = dt.files;

   console.log("handleTextDrop");

   if (files.length > 1)
   {
      alert ("Please only upload one file at a time")
   }
   else
   {
      //make sure the file is either a .zip or a .txt file
      text_file = files[0].name;
      console.log (text_file)

/*      if (extension == ".xml" || extension == ".txt")
      {
         handleFile(txt_file)
      }
      else
      {
         document.getElementById('error').innerHTML = "Please only upload .txt or .xml files from MTA";
      }
   */
   }
}


function handleFile(txt_file)
{
   //Provide feedback to the user
   document.getElementById('error').innerHTML = "Upload successful<br>Please Note: Very large requests/replies will take a while to load but the site is not hanging!";

   var comboBox = document.getElementById('reqs');

   //clear the request list box
   while (comboBox.options.length > 0)
   {
      comboBox.removeChild(comboBox.options[0]);
   }

   var fr = new FileReader(txt_file);

   //Request List has to be populated here because FileReader loads asynch
   //and this function only runs after FileReader is done loading.
   //If we move this code outside of this function, it all gets executed 
   //before FileLoader is ready and everything looks empty
   //Once it's finished and the request list is populated however,
   //the rest can be done in the functions handling request list clicks.
   fr.onload = function ()
   {
      document.getElementById('req_details').textContent = "";

      var remaining_text = fr.result;
      var eachLine = [];

      //set file format - xml or old school
      var xml_pos = remaining_text.search('<RequestMeta>');

      var is_old_school = true;   //determines whether to read old school format or XML
      if (xml_pos > 0)
      {
         is_old_school = false;
      }

      //Get the position of the next </Request> or </Reply
      var next_req = 0;
      var next_rep = 0;

      var start_block;
      var end_block;

      var file_complete = 0;

      //variables to skip past <Request> and <Reply> tags for split_pos - declared here so we don't have to search through the code if they need updated
      var req_spacer = 10;
      var rep_spacer = 8;

      if (!is_old_school)      //if it's an XML file, we just need to grab everything between the trace lines and create new items with it.
      {
         console.log("!old school");

         while (!file_complete)
         {
            start_block = 0;
            end_block = remaining_text.indexOf("[trace-", start_block + 5);

            if (end_block < 0)   //end of file - add whatever's left
            {
               file_complete = true;
               end_block = remaining_text.length;
            }

            //Create a new item and add it to the list
            console.log("start = " + start_block + " end = " + end_block);
            item_list.push(new Item_XML(remaining_text.slice(start_block, end_block)));

            //remove that line from remaining_text
            remaining_text = remaining_text.slice(end_block, remaining_text.length);
         }
      }
      else
      {
         while (!file_complete)
         {
            next_req = remaining_text.search('</Request>');
            next_rep = remaining_text.search('</Reply>');

            if (next_req == -1 && next_rep == -1)
            {
               //No more legible data - end of file
               file_complete = 1;
               break;
            }
            else if (next_req > -1 && next_rep == -1)
            {
               //Shouldn't be possible but may be out of sequence - handle anyway
               split_pos = next_req + req_spacer;
            }
            else if (next_req == -1 && next_rep > -1)
            {
               //Should be end of file but if sequence is off - handle as if there's more
               split_pos = next_rep + rep_spacer;
            }
            else
            {
               //Both still exist in file so get the next one and add appropriate offset
               if (next_req < next_rep)
               {
                  split_pos = next_req + req_spacer;
               }
               else
               {
                  split_pos = next_rep + rep_spacer;
               }
            }

            //Create a new item and add it to the list
            item_list.push(new Item_SRV(remaining_text.slice(0, split_pos)));

            //remove that line from remaining_text
            remaining_text = remaining_text.slice(split_pos, remaining_text.length);
         }
      }

      //Add Request Numbers as options to option list
      for (i = 0; i < item_list.length; i++)
      {
         var option = document.createElement('option');
         option.value = option.text = item_list[i].getReqNumber();
         comboBox.appendChild(option);
      }

   }

   fr.readAsText(txt_file);
}
