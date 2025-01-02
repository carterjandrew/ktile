// Currently the hooks for our windows changing is attached to the windows
// This is rather awkward for us because it means if we try to assign this hook from inside our class we don't have access to the other classes to transfer data
// This means we need to store our windows in a way such that they don't have to be moved each time they transfer. 
// My first idea is to simply store the indecies of the windows under a class. This seems reasonable but hard to manage if the ordering of windows ever changes. If a window is closed then we would have to remove the index but decrement all indecies higher. Now that I'm saying this out loud it really seems quite reasonable.
// Also, we could just get rid of this entire silly structure and instead use filter operations to simply fetch the correct windows at runtime. I kind of dislike this because it makes it more complex to be reliable and increases computation.


// Get keybinds
const focusLeftKeybind = readConfig("left", "Meta+H");
const focusRightKeybind = readConfig("left", "Meta+L");
const focusUpKeybind = readConfig("left", "Meta+K");
const focusDownKeybind = readConfig("left", "Meta+J");
// Fetches the geometry we have availible to tile in
function getWorkspaceGeometry() {
	var workspaceGeometry = {
		x: 0,
		y: 0,
		width: workspace.virtualScreenSize.width,
		height: workspace.virtualScreenSize.height
	}
	for (const window of workspace.windowList()) {
		if (window.dock) {
			// Docks need at least one side that maches in order to subtract
			// Check that either the width or the height matches desktop dimensions
			// If width matches it is a horizontal dock, we modify height
			if (window.frameGeometry.width == workspaceGeometry.width) {
				workspaceGeometry.height -= window.frameGeometry.height
				if (window.frameGeometry.y === 0)
					workspaceGeometry.y += window.frameGeometry.height
			}
			// If height maches it is a vertical dock, we modify width
			if (window.frameGeometry.height == workspaceGeometry.height) {
				workspaceGeometry.width -= window.frameGeometry.width
				if (window.frameGeometry.x === 0)
					workspaceGeometry.x += window.frameGeometry.width
			}
		}
	}
	return workspaceGeometry
}
// Defines a simple monocle tiler for testing
class MonocleTiler {
	constructor(windowIndecies) {
		this.windows = windowIndecies.map(((windowListIndex, preferedOrder) => ({
			windowListIndex,
			preferedOrder,
			floating: false
		})))
	}
}
// Loops over all desktops, finds the currently placed windows, and assigns their indecies into a new tiler object

function getWindowIndexByDesktop() {
	const desktops = Array.from({
		length: workspace.desktops.length
	}, () => [])
	workspace.windowList().forEach((window, index) => {
		if (!window.normalWindow) return
		const desktopIndex = workspace.desktops.findIndex(desktop =>
			desktop === window.desktops[0]
		)
		desktops[desktopIndex].push(index)
	})
	return desktops
}

function createInitalTilers(Tiler) {
	const desktops = getWindowIndexByDesktop()
	return desktops.map(windowIndecies =>
		new Tiler(windowIndecies)
	)
}

const tilers = createInitalTilers(MonocleTiler)
