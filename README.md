# TextWordCount
Reads in two files and a value N.  The first file contains words not to count.  The second file is a block of text.  This project displays the N words with the highest word count in the block of text.

### Design Decisions
I try to design and code my projects with empathy.  That means considering who will be reading, using, maintaining, upgrading, or fixing bugs in my code later.  To that end, I try to design code that's reusable and easy to reuse.  This extends projects but also lowers technical debt and increases readability.  If it's not easy to use though, people won't use it.  If they are forced to use it, I want it to be as easy to use as possible to avoid frustration.

Coding with empathy also includes making code easier to read.  The brain looks for patterns so simple things like lining up equal signs in blocks of code introduces a pattern that the brain can ignore.  For code reviews, for example, this makes identifying variable names, variable types, what values are being set, and if everything's being set correctly much quicker and easier.  It also means good comments, which I admit I need to get better at, doing things in smaller sections, and not being "clever".  There are sometimes clever, elegant ways to solve a problem however, by definition, you must be twice as clever to debug a piece of code so if you're as clever as you can be while coding, you literally can't debug it.  Also, clever code can be very confusing which is frustrating for others behind you.

To that end, I chose Javascript/HTML/CSS as the language to solve this problem.  I thought about doing a Windows app or C# but Microsoft tends to automatically introduce a lot of complexities when it's trying to be helpful.  That could possibly require extra installations and be frustrating when trying to run it.  Containing everything in 3 simple files should make it easy to download and test.

I also chose to create a class that handled most of the functionality.  This eliminates duplicate coding and creates single failure points that are easier to debug.  It also makes using the functionality in later programs a lot easier.

