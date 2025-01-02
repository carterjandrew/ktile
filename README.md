# About
ktile is **working towards** being a replacement for bismuth, a tiling manager for kde 5.

There is no denying kde 6 is the dekstop of the future. However right now it's a little underwhelming because of the lack of backwards compatability with legacy software. Many of the functions I fell in love with kde 5 for having are no longer supported, including bismuth. 

ktile will work off the same principles as bismth with one key exception: this plugin will be a full on kwin script and require no building or external libraries to work. 

# Project Status
The projects current state is a **complete** proof of concept that tiling is possible within kde6. Even if the API for kwin is a little broken we can still access the nessisary components to tile. 

I have decided to start with a simple spiral tiling manager. If you want to learn about how **you** can develop using ktile check the `notes.md` file. 

# Next Steps
Next up for me is architecting a simple way to manager window tiler types so we can flexibly tile windows. Then we can basically make an api so people can make their own tilers or use one of the presets.

# Goal for Today
Finish up the re-write so that the hooks on each window work properly. 
There are two options here: 
1. Use the existing architecture and just add hooks after. Kind of complex to keep running
2. New Architecutre. We need to make it so that:
The windows can reference what desktop they are being stored on
The tilers can reference the windows that they have under them

To do this we will just make flat arrays with indecies to each other. This way, we can store and find references easily. 

Each time we tile we will need to lookup from this table in a rather random order. I don't like how this feels. 

Could it be better to just store all objects both under and have a reference to them?

No, let's just start with something simple, and move our way into something more complex. First things first we should build a test to see if we can handle simple assignment of windows to desktops. 

Okay, got things working, but I still feel really odd about it. This arcitecture feels like it's not built with flexible metadata in mind. Instead we would have to reference Objects brutally. I feel we should just build in a hook for each window 

Should we just have universal metadata??
That feels odd for sure. 
But so does transferring 
Fuck it we ball with global metadata. 

I feel like each window can have a genric hook that handles transfer though

Okay walk me through it then. 

Say we have a tiler, and a global index

Global index maps from window to tiler
{
    windowId: number
}
Tilers include the window under them that also now store this window representation. This means when a window get's reasigned we can find it's position easily and then command the current window to pop it off. Then we can use the window object to push it onto the new stack. 

This keeps things efficient but adds some overhead from the perspective of the manager. I like the approach though so we will go ahead with it. 

My one worry is that the windows stored under the tiler will not update properly. We shall see what happens I guess. 

Also do these triggers automatically destroy themselves when a window is closed??

So now we seem to be having issues with stepping tilers after moving, no idea why :/
