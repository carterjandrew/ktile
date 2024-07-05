export default class SpiralTiler {
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