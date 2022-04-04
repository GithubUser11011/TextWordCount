function initialize()
{
   // ************************ Drag and drop ***************** //
   stopDropArea = document.getElementById("stop-drop-area");
   textDropArea = document.getElementById("text-drop-area");
   wordsTable   = document.getElementById("words-div");

   // Prevent default drag behaviors
   ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => 
   {
       stopDropArea.addEventListener(eventName, preventDefaults, false);
       textDropArea.addEventListener(eventName, preventDefaults, false);
       document.body.addEventListener(eventName, preventDefaults, false);
   })

   // Highlight drop area when item is dragged over it
   ;['dragenter', 'dragover'].forEach(eventName => 
   {
       stopDropArea.addEventListener(eventName, stophighlight, false);
       textDropArea.addEventListener(eventName, texthighlight, false);
   })

   ;['dragleave', 'drop'].forEach(eventName => 
   {
       stopDropArea.addEventListener(eventName, stopunhighlight, false);
       textDropArea.addEventListener(eventName, textunhighlight, false);
   })

   // Handle dropped files
   stopDropArea.addEventListener('drop', handleStopDrop, false);
   textDropArea.addEventListener('drop', handleTextDrop, false);
}

function preventDefaults(e)
{
   e.preventDefault();
   e.stopPropagation();
}

function stophighlight(e)
{
   stopDropArea.classList.add('highlight');
}

function stopunhighlight(e)
{
   stopDropArea.classList.remove('highlight');
}

function texthighlight(e)
{
   textDropArea.classList.add('highlight');
}

function textunhighlight(e)
{
   textDropArea.classList.remove('highlight');
}

function handleStopDrop(e)
{
   var dt = e.dataTransfer;
   var files = dt.files;

   //Read in the file and store the text in the stop-drop-area
   var fr = new FileReader(files[0]);
   fr.onload = readSuccess;

   //This is done after load is successful so load up the stop-list here
   function readSuccess(evt)
   {
      const file_text       = evt.target.result;
      var stop_lines        = file_text.split(/\r?\n/);
      var stop_words        = [];
      var formatting_failed = false;

      //Remove blank lines and any lines that start with '#' or ' '
      for (let line of stop_lines)
      {
         let trimmed_line = line.trim();

         if (trimmed_line.length > 0 && trimmed_line.charAt(0) != '#' && !(trimmed_line === ''))
         {  
            //if the trimmed line contains whitespace, the file's not properly formatted
            //This also prevents hanging if the wrong file is dropped here
            if (/\s/g.test(trimmed_line))
            {
               formatting_failed = true;
               break;
            }

            //while we're adding words, filter out the duplicates
            if (!stop_words.includes(trimmed_line))
            {
               stop_words.push(trimmed_line);
            }
         }
      }

      //Set the stopDropArea text - Red if it failed and green if it succeeded
      stopDropArea.innerHTML = ""
      
      if (formatting_failed)
      {
         stopDropArea.innerHTML   = "The file is not formatted properly - please put only one word per line after the comments"    ;     
         stopDropArea.style.color = '#f00';
      }
      else
      {
         stop_words.forEach((line) =>
         {
            stopDropArea.innerHTML = stopDropArea.innerHTML + line + "<br>";
         })

         stopDropArea.style.color = '#0f0';
      }
   }
   
   //load the file into memory
   fr.readAsText(files[0]);   
}

function handleTextDrop(e)
{
   var dt = e.dataTransfer;
   var files = dt.files;

   //Read in the file and store the text in the stop-drop-area
   var fr    = new FileReader(files[0]);
   fr.onload = readSuccess;

   //This is done after load is successful so load up the stop-list here
   function readSuccess(evt)
   {
      var file_text  = evt.target.result;
      var file_text  = file_text.toLowerCase();
      var word_count = new Map();

      //This feels like a hack but I can't figure out why stop_words isn't staying populated - read it in from stopDropArea
      if (stopDropArea.innerHTML.includes ("formatted properly") || stopDropArea.innerHTML.includes ("Stop Words"))
      {
         alert ("Please upload a valid stop words file before the text file");
         return;
      }

      stop_words = stopDropArea.innerHTML.split("<br>");

      //remove everything except alphanumeric characters and whitespace, then collapse multiple spaces into a single space
      file_text = file_text.replace(/[^\w\s]|_/g, "");
      file_text = file_text.replace(/\s+/g, " ");

      //split file_text on spaces and store as words array
      var text_words = file_text.split(/\s/);
      
      for (var i = 0; i < text_words.length; i++) 
      {
         if (!stop_words.includes(text_words[i]))
         {
            if (word_count.has (text_words[i]))
            {
               word_count.set(text_words[i], (word_count.get(text_words[i])) + 1);
            }
            else
            {
               word_count.set(text_words[i], 1);
            }
         }
      }

      //Convert the word_counts map to an array and then sort the array
      let top_words      = [...word_count];
      let num_top_words  = 0;
      let min_word_count = 5000;

      //Sort the array
      top_words.sort(function(a,b)
      {
         return b[1]-a[1];
      });

      //Update the textDropArea text to show that the words are all counted
      textDropArea.innerHTML = "SUCCESS! <br> Counts are displayed!";
      textDropArea.style.color = '#0f0';

      //Build the top 10 words list table
      let html_str = "<table><tr><th>Word</th><th>Occurances</th></tr>";

      //Some input may not contain 10 words to count (for example, if the user puts back in the stop-words text file as text to count)
      //In this case, we don't want to for loop to 10, just to the word count, so set a variable to 10 if there are more than 10, or length of array if not
      let num_words = top_words.length;

      if (num_words > 10)
      {
         num_words = 10;
      }

      for (var i = 0; i < num_words; i++)
      {
         html_str = html_str + "<tr><td>" + top_words[i][0] + "</td><td>" + top_words[i][1] + "</td></tr>";
      }

      html_str = html_str + "</table>";

      wordsTable.innerHTML = html_str;

      console.table (top_words);
      console.log (num_words);
   }

   //load the file into memory
   fr.readAsText(files[0]);   
}

