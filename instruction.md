# Background
I need to build a brainfog simulator for an exhibit. The exhibit will have one desktop computer with two speakers. The exhibit intends to demostrate how brainfog affects women and how difficult it can become for them to work under these conditions. The plan is to make a game using react and react-game-kit to make a multi step 2d game experience that looks like an real task one would have to deal with in an office. The whole app runs on a raspberry pi.

## about brainfog
- brainfog causes difficulty in memory, focus, loosing train of thought, and completing ordinary tasks.
- A human can experience lack of clarity, feeling hazy, zoned out and cloudy.

# Game beats
## first
The user enters their name on a screen and presses start.

## second
The user is given a simple task of adding some numbers in a column in an excel-like spreadsheet and entering the answers in a following row. There are random door knock sounds in the background.

## third
The excel sheet's elements keep becoming blur, and clear at random making it harder for the user to see the sheet and its elements clearly. The door knocks persist, and become more frequent.

## fourth
When the user is done inputting the values the press a submit button on top right and move onto the next task. The user hears mild whispers sounds.

## fifth
The next task is a spell check task, user sees three words on screen which have spelling errors all in red color and they become green when the users fixed the letters. The user hears phone ringing sounds.

## sixth
The words on spell check also have the same issue of blur out the entire screen and individual parts at random so its harder to fix. The user now also hears TTS generated voices calling their name.

## seventh
When user finished fixing the words, they get an urgent alert message from boss saying that they made an error in the first task. The user hears alert messaging sounds along with previously playing noise.

## eight
The user is taken to a screen looking exactly like the first task except one of the numbers is different. This screen is keeps getting blurier and normal more rapidly.

## ninth
Once the user submits, everything calms down, the screen has 0 blur, all the noises disappear and user sees a completed message.

# Your task
You need to make a systematic, detailed plan to create this web game project that can be delegated to a coding agent to be implemented. Make it tickited, and loosely coupled for multiple agent to easily takeover from each other.

Also create a list of assets ex. sound clips that I can label and store in a directory to be used.

Add appropriate threading for tts generation, background sounds and other processes as this will run on a Raspberry PI.