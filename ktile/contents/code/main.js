// Get keybinds
const focusLeftKeybind = readConfig("left", "Meta+H");
const focusRightKeybind = readConfig("left", "Meta+L");
const focusUpKeybind = readConfig("left", "Meta+K");
const focusDownKeybind = readConfig("left", "Meta+J");
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

function getDesktopWindowList() {
	const desktops = Array.from({ length: workspace.desktops.length }, () => [])
	for (const window of workspace.windowList()) {
		if (window.normalWindow) {
			desktops[workspace.desktops.findIndex(desktop =>
				desktop === window.desktops[0]
			)].push(window)
		}
	}
	return desktops
}

function ktileInit() {
	print('KTile_Init_____________________________')
	const desktops = getDesktopWindowList()
	const workspaceGeometry = getWorkspaceGeometry()
	return { desktops, workspaceGeometry }
}

const { desktops, workspaceGeometry } = ktileInit()
print(`Desktops: ${desktops}`)
print(`Workspace Geometry: ${JSON.stringify(workspaceGeometry)}`)

// This will create a tiler for each of our desktops
// Takes in the desktops we have created, this is just a list of windows organzised by virtual desktop
// Takes in an inital tiler to be used on each window, in our case: monocole
function createWorkspaces(desktops, InitalTiler) {
	return desktops.map(windows => new InitalTiler(windows))
}
// Class for a super simple monocle tiler
class MonocleTiler {
	// We take in a list of windows
	// We store these as the windows along with a location they would ideally like to be placed
	// We also tag windows as floating or not
	constructor(windows, onWindowChangeHandler) {
		this.windows = windows.map((window, preferedOrder) => ({
			window,
			preferedOrder,
			floating: false
		}))
		this.windows.forEach((window, index) => {
			// Basically we pass in a handler that has access to all our tilers
			// This function then gets passed the index it would need to pop from.
			// Externally it can keep track of the index of the tiler to use to pop
			// We will need to use the windows current desktop to find where the window is getting moved to
			window.window.desktopsChanged.connect(() => onWindowChangeHandler(index))
		})
		this.currentFocusIndex = windows.findIndex(
			window => window === workspace.activeWindow
		)
		if (this.currentFocusIndex === -1) this.currentFocusIndex = 0
	}
	// Tile function will retile the existing windows
	tile() {
		this.windows.forEach((window, index) => {
			window.window.frameGeometry = workspaceGeometry
			window.window.keepBelow = !window.floating && index !== this.currentFocusIndex
			window.window.keepAbove = window.floating
			window.window.noBorder = !window.floating
		})
	}
	// Focus Left will make us focus the previous window
	focusLeft() {
		this.currentFocusIndex += 1
		this.currentFocusIndex %= this.windows.length
		workspace.activeWindow = this.windows[this.currentFocusIndex].window
		this.tile()
	}
	popWindow(window) {
		print(`Window: ${window}`)
		print(`Found: ${this.windows.find(w => w.window === window)}`)
	}
}

// Get and update the current desktop index
let currentDesktopIndex = workspace.desktops.findIndex(
	desktop => desktop === workspace.currentDesktop
)
function onDesktopChanged() {
	currentDesktopIndex = workspace.desktops.findIndex(
		desktop => desktop === workspace.currentDesktop
	)
}
workspace.currentDesktopChanged.connect(onDesktopChanged)

const workspaces = createWorkspaces(desktops, MonocleTiler)
// Inital tiling
workspaces.forEach(workspace => workspace.tile())

function focusLeft() {
	workspaces[currentDesktopIndex].focusLeft()
}

// Register shortcuts for interacting with tilers
registerShortcut("KTile focus left", "Cause desktop to focus one screen to the left", focusLeftKeybind, focusLeft)
// Delay experimental function call
// const timer = new QTimer()
// timer.singleShot = true
// timer.timeout.connect(focusLeft)
// timer.start(2000)
