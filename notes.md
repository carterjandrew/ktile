ktile is a tiling application built to work with the new kde framework. Now that the most recent version is out there is a gap in the functionality of tilers like bismuth. So using the kwin scripting platform I will build a new ultra-clean and custom tiling manager

# Todo
- [x] Figure out how to get full window dimensions with frame
	- [ ] Figure out how to properly account for docs
	- [ ] Figure out how to update working geometry on dock changes
- [ ] Figure out how to unmount functions on disable/restart
	- [ ] Figure out how to mount functions so they can change on user switching modes
- [ ] Make floating window override last window in index when un-floated if max tiled windows
- [ ] Make each window hold record of ideal position 

^ktile-todo

# Ideal Functionality:
- [ ] Has the same tiling functions as Bismuth
- [ ] Allows users to highlight windows same as Bismuth
- [ ] Has configuration of shortcuts, functionality, and appearance similar to Bismuth
- [ ] Works fast as hell and anywhere KDE 6.0+
- [x] Built without external libraries
# Research
![[kwin scripts]]

# Ideal Pseudo-code
## Philosophy
We will imagine each window or 'application' as a item in a list. The tiling manager will use this list to rearrange and manage tiled windows.

However we want items to retain their order in that list even if they move to a different window so when they return they do not get placed out of order. 

This is advantageous because it let's us spawn in windows every time into either the head or tail position and allows us to rearrange and jump windows with rules based on the current windows index.

The application will create a object for each 'virtual desktop'. These object will be made up of the following components

| Name           | Function                                                                                     |
| -------------- | -------------------------------------------------------------------------------------------- |
| Tiling engine  | An imported engine that has functions to handle the tiling of a window given the live tiles. |
| Tiling windows | A list of window objects that we want to preform tiling on, in order                         |
| Spatial Shifts | A array of 'break' offsets that dictates offsets of all 'divisions' of screen space.         |
Spatial shifts explained via example:
	Imagine in your desktop you only have two windows: when tiled, those windows are placed side by side horizontally. The split in the middle between them is what is referenced by the first element in the spatial shift. So if we had a spatial shift of -10 then the left window would be 10 pixels smaller than the right. 