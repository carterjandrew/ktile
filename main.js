function ktileInit(){
    print('KTile_Init_____________________________')
    const desktops = Array.from({length: workspace.desktops.length}, () => [])
    var workspaceGeometry = {x: 0, y: 0, width: workspace.virtualScreenSize.width, height: workspace.virtualScreenSize.height}
    for(const window of workspace.windowList()){
        if(window.normalWindow){
            desktops[workspace.desktops.findIndex(desktop => desktop === window.desktops[0])].push(window)
        }
        else if(window.dock){
            workspaceGeometry.y += window.frameGeometry.height
            workspaceGeometry.height -= window.frameGeometry.height
        }
    }
    return {desktops: desktops, workspaceGeometry: workspaceGeometry}
}

class SpiralTiler {
    constructor(){
        this.lineOffsets = Array.from({length: workspace.desktops.length}, () => [])
    }
    tile(desktop){
        function tileRecurse(remainingWindows, remainingGeometry, splitDir){
            if(remainingWindows.length === 0) return;
            if(remainingWindows.length === 1){
                remainingWindows[0].frameGeometry = remainingGeometry
                return
            }
            var currentGeometry = {x: remainingGeometry.x, y: remainingGeometry.y, width: remainingGeometry.width, height: remainingGeometry.height}
            var nextGeometry = {x: remainingGeometry.x, y: remainingGeometry.y, width: remainingGeometry.width, height: remainingGeometry.height}
            if(splitDir % 2 == 0){ // Tile horizontal
                currentGeometry.width /= 2
                nextGeometry.width /= 2
                nextGeometry.x += nextGeometry.width
            } else { // Tile vertical
                currentGeometry.height /= 2
                nextGeometry.height /= 2
                nextGeometry.y += nextGeometry.height
            }
            if(splitDir > 1){ // Reverse tile direction
                const tempGeometry = currentGeometry
                currentGeometry = nextGeometry
                nextGeometry = tempGeometry
            }
            remainingWindows[0].frameGeometry = currentGeometry
            tileRecurse(remainingWindows.slice(1), nextGeometry, (splitDir + 1) % 3)
        }
        tileRecurse(desktop, workspaceGeometry, 0)
    }
    pushLeft(desktop, activeIndex){
        if(activeIndex === 0){

        }
    }
}

const spiralTiler = new SpiralTiler()
for(desktop of desktops){
    spiralTiler.tile(desktop)
}

workspace.windowAdded.connect(handleAddWindow)

function handleAddWindow(newWindow){
    if(!newWindow.normalWindow) return
    const desktopIndex = workspace.desktops.findIndex(desktop => desktop === newWindow.desktops[0])
    desktops[desktopIndex].push(newWindow)
    if(lineOffsets.length < desktops[desktopIndex].length - 1) lineOffsets.push(0)
    spiralTiler.tile(desktops[desktopIndex])
}

workspace.windowRemoved.connect(handleRemoveWindow)

function handleRemoveWindow(oldWindow){
    print(oldWindow)
    for(const i in desktops){
        const removeIndex = desktops[i].findIndex(window => window === oldWindow)
        if(removeIndex !== -1){
            desktops[i].splice(removeIndex,1)
            spiralTiler.tile(desktops[i])
        }
    }
}
