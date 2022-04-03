function initialize()
{
   wordCounter = new WordCounter()

   // ************************ Drag and drop ***************** //
   stopDropArea = document.getElementById("stop-drop-area")
   textDropArea = document.getElementById("text-drop-area")

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
      wordCounter.setStopFile (files[0])
   }
}

function handleTextDrop(e)
{
   var dt = e.dataTransfer;
   var files = dt.files;

   if (files.length > 1)
   {
      alert ("Please only upload one file at a time")
   }
   else
   {
      wordCounter.setTextFile (files[0])
   }
}

class WordCounter
{
   /**
    * This class takes in a stop file and a text file.
    * Once both files are set, it reads them in and creates a list of words and how many times they're used in the text file
    * Get functions are provided to retrieve the list of words and counts
   */
   constructor(data)
   {
      this.text_file_set = false;
      this.stop_file_set = false;

      this.stop_words = new Array();
   }

   //Set the stop file - if text file is already set, process everything
   setStopFile(stop_file)
   {
      //Read in the text file
      console.log ("In setStopFile")

      var fr = new FileReader(stop_file)
      fr.onload = readSuccess;

      //This is done after load is successful so load up the stop-list here
      function readSuccess(evt)
      {
         const file_text  = evt.target.result
         var stop_lines = file_text.split(/\r?\n/)

         //Initialize this.stop_words
         this.stop_words = []

         //Remove blank lines and any lines that start with '#' or ' '
         stop_lines.forEach((line, index, object) =>
         {
            if (line.length > 0 && line.charAt(0) != '#' && !(line.trim() === ''))
            {
               //while we're adding words, filter out the duplicates
               if (!this.stop_words.includes(line.trim()))
               {
                  this.stop_words.push(line.trim())
               }
            }
         })
      }
      
      //load the file into memory
      fr.readAsText(stop_file);
   }

   //Set the text file - if stop file is already set, process everything
   setTextFile(text_file_info)
   {
      //Read in the text file
      console.log ("In setTextFile")
   }
}