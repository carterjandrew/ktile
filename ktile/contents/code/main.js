// Get keybinds
const focusLeftKeybind = readConfig("left", "Meta+H");
const focusRightKeybind = readConfig("left", "Meta+L");
const focusUpKeybind = readConfig("left", "Meta+K");
const focusDownKeybind = readConfig("left", "Meta+J");
// Define a function to get desktop index for convinience
const findDesktopIndex = (window) => workspace.desktops.findIndex(desktop =>
	desktop === window.desktops[0]
)
// Function for convinence to get all normal windows
const getNormalWindows = () => workspace.windowList()
	.filter(window => window.normalWindow)

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

// Returns a object whos:
// Keys are a string cast of each window
// Values are the index of the tiler they are currently assosiated with
function getWindowToTilerHash() {
	const windowToTiler = {}
	getNormalWindows()
		.forEach(window => {
			const windowId = String(window)
			const tilerIndex = findDesktopIndex(window)
			windowToTiler[windowId] = tilerIndex
		})
	return windowToTiler
}

function ktileInit() {
	print('KTile_Init_____________________________')
	const windowToTiler = getWindowToTilerHash()
	const workspaceGeometry = getWorkspaceGeometry()
	return { windowToTiler, workspaceGeometry }
}

const { windowToTiler, workspaceGeometry } = ktileInit()

// This will create a tiler for each of our desktops
// Each tiler is passed the windows on that desktop
function createTilers(InitalTiler) {
	const windowList = getNormalWindows()
	return workspace.desktops.map(desktop =>
		new InitalTiler(
			windowList.filter(window => window.desktops[0] === desktop)
		)
	)
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
		console.log("Focus index:", this.currentFocusIndex)
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
		const w = this.windows.find(w => w.window === window)
		this.windows = this.windows.filter(w => w.window !== window)
		return w
	}
	pushWindowObject(window) {
		this.windows = [...this.windows, window]
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

const tilers = createTilers(MonocleTiler)
// Inital tiling
tilers.forEach(workspace => workspace.tile())

function focusLeft() {
	tilers[currentDesktopIndex].focusLeft()
	tilers[currentDesktopIndex].tile()
}

// Define a function that can take in a window object and change it's tiler
function handleWindowDesktopChange(window) {
	const windowId = String(window)
	const tilerIndex = windowToTiler[windowId]
	const newIndex = findDesktopIndex(window)
	console.log(`Moving window object from ${tilerIndex} to ${newIndex}`)
	const windowObject = tilers[tilerIndex].popWindow(window)
	tilers[newIndex].pushWindowObject(windowObject)
	tilers[newIndex].tile()
}

getNormalWindows().forEach(window => {
	window.desktopsChanged.connect(() => {
		handleWindowDesktopChange(window)
	})
})

// Register shortcuts for interacting with tilers
registerShortcut("KTile focus left", "Cause desktop to focus one screen to the left", focusLeftKeybind, focusLeft)
// Delay experimental function call
// const timer = new QTimer()
// timer.singleShot = true
// timer.timeout.connect(focusLeft)
// timer.start(2000)
