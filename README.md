# TextWordCount
Reads in two files and a value N.  The first file contains words not to count.  The second file is a block of text.  This project displays the N words with the highest word count in the block of text.

### Design Decisions
I try to design and code my projects with empathy.  That means considering who will be reading, using, maintaining, upgrading, or fixing bugs in my code later.  To that end, I try to design code that's reusable and easy to reuse.  This extends projects but also lowers technical debt and increases readability.  If it's not easy to use though, people won't use it.  If they are forced to use it, I want it to be as easy to use as possible to avoid frustration.

Coding with empathy also includes making code easier to read.  The brain looks for patterns so simple things like lining up equal signs in blocks of code introduces a pattern that the brain can ignore.  For code reviews, for example, this makes identifying variable names, variable types, what values are being set, and if everything's being set correctly much quicker and easier.  It also means good comments, which I admit I need to get better at, doing things in smaller sections, and not being "clever".  There are sometimes clever, elegant ways to solve a problem however, by definition, you must be twice as clever to debug a piece of code so if you're as clever as you can be while coding, you literally can't debug it.  Also, clever code can be very confusing which is frustrating for others behind you.

To that end, I chose Javascript/HTML/CSS as the language to solve this problem.  I thought about doing a Windows app or C# but Microsoft tends to automatically introduce a lot of complexities when it's trying to be helpful.  That could possibly require extra installations and be frustrating when trying to run it.  Containing everything in 3 simple files should make it easy to download and test.

I also chose to create a class that handled most of the functionality.  This eliminates duplicate coding and creates single failure points that are easier to debug.  It also makes using the functionality in later programs a lot easier.

### Update
After I had all of that designed out, I fought and fought with scope issues while reading in files asynchronously.  I had to scrap the class and pull the data in functions.  I had to hack a couple of things because I spent so much time in the weeds of asynch file reading but I'll go back when I have time and do it properly.

### Still To Do:
Make the UI prettier
Figure out scoping and finish the class
Add slider control to adjust how many words and counts appear

## Usage
I went with these languages to make the utility very simple to test and use and I think I've accomplished that.

To use, simply download TextWordCount.html, StyleSheet.css, and scripts.js into a directory.  Then double click on TextWordCount.

Once it's opened, drag a stop-words text file to the Stop Words area.  It will list the words and turn green if it succeeded.  If the file is improperly formatted, it will turn red and alert you.

After stop-words have been uploaded, drag the file with text to count to the Text to Count area.  It will throw an alert if Stop Words hasn't populated properly or uploaded at all.  Otherwise, it will show a list of the top 10 words and their counts.

To reset the page, simply refresh the browser tab or press F5

Tested in Chrome and Edge