# About
ktile is **working towards** being a replacement for bismuth, a tiling manager for kde 5.

There is no denying kde 6 is the dekstop of the future. However right now it's a little underwhelming because of the lack of backwards compatability with legacy software. Many of the functions I fell in love with kde 5 for having are no longer supported, including bismuth. 

ktile will work off the same principles as bismth with one key exception: this plugin will be a full on kwin script and require no building or external libraries to work. 

# Project Status
The projects current state is a **complete** proof of concept that tiling is possible within kde6. Even if the API for kwin is a little broken we can still access the nessisary components to tile. 

I have decided to start with a simple spiral tiling manager. If you want to learn about how **you** can develop using ktile check the `notes.md` file. 

# Next Steps
Next up for me is architecting a simple way to manager window tiler types so we can flexibly tile windows. Then we can basically make an api so people can make their own tilers or use one of the presets.