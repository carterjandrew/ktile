import { SpiralTiler } from './spiralTiler.js';

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
