function initialize()
{
   // ************************ Drag and drop ***************** //
   stopDropArea = document.getElementById("stop-drop-area")
   textDropArea = document.getElementById("text-drop-area")
   wordsTable   = document.getElementById("words-table")

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

   stop_words = []
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

   //Read in the file and store the text in the stop-drop-area
   var fr = new FileReader(files[0])
   fr.onload = readSuccess;

   //This is done after load is successful so load up the stop-list here
   function readSuccess(evt)
   {
      const file_text  = evt.target.result
      var stop_lines = file_text.split(/\r?\n/)
      var stop_words = []

      //Remove blank lines and any lines that start with '#' or ' '
      stop_lines.forEach((line, index, object) =>
      {
         if (line.length > 0 && line.charAt(0) != '#' && !(line.trim() === ''))
         {
            //while we're adding words, filter out the duplicates
            if (!stop_words.includes(line.trim()))
            {
               stop_words.push(line.trim())
            }
         }
      })

      stopDropArea.innerHTML = ""
      stop_words.forEach((line) =>
      {
         stopDropArea.innerHTML = stopDropArea.innerHTML + line + "<br>"
      })

      stopDropArea.style.color = '#0f0'
   }
   
   //load the file into memory
   fr.readAsText(files[0]);   
}

function handleTextDrop(e)
{
   var dt = e.dataTransfer;
   var files = dt.files;

   //Read in the file and store the text in the stop-drop-area
   var fr = new FileReader(files[0])
   fr.onload = readSuccess;

   //This is done after load is successful so load up the stop-list here
   function readSuccess(evt)
   {
      var file_text  = evt.target.result
      file_text = file_text.toLowerCase();
      word_count = new Map();

      //This feels like a hack but I can't figure out why stop_words isn't staying populated - read it in from stopDropArea
      stop_words = stopDropArea.innerHTML.split("<br>")
      console.log (stop_words)

      //remove punctuation - I can't seem to get all of them removed - probably what's messing with my counts a bit
      //It would be less "clever" to do these separately and it'll probably be hard to modify 
      file_text = file_text.replace(/[.,\/#!$%?”“’\^&\*;:{}=\-_`~()]/g,"")

      //make multiple spaces/tabs/whitespace into a single space
      file_text = file_text.replace(/\s\s+/g, ' ');

      //split file_text on spaces and store as words array
      var text_words = file_text.split(/\s/)
      
      for (var i = 0; i < text_words.length; i++) 
      {
         if (!stop_words.includes(text_words[i]))
         {
            if (word_count.has (text_words[i]))
            {
               word_count.set(text_words[i], (word_count.get(text_words[i])) + 1)
            }
            else
            {
               word_count.set(text_words[i], 1)
            }
         }
      }

      //Convert the word_counts map to an array and then sort the array
      let top_words      = [...word_count]

      //console.table (top_words)

      let num_top_words  = 0
      let min_word_count = 5000

      //Sort the array
      top_words.sort(function(a,b)
      {
         return b[1]-a[1]
      });

      console.table (top_words)

      //textDropArea.innerHTML = ""
      //Build the top 10 words list table
      //wordsTable.innerHTML = 

   }
   
   //load the file into memory
   fr.readAsText(files[0]);   
}

