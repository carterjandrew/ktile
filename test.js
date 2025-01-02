/// Define a function to get desktop index for convinience
const findDesktopIndex = (window) => workspace.desktops.findIndex(desktop =>
	desktop === window.desktops[0]
)

// Define our global index, this maps from window id to desktop
const windowToTiler = {}
workspace.windowList()
	.filter(window => window.normalWindow)
	.forEach(window => {
		const windowId = String(window)
		const tilerIndex = findDesktopIndex(window)
		windowToTiler[windowId] = tilerIndex
	})
// Define a list of fake tilers that is just a array of windows for each desktop
let tilers = workspace.desktops.map((_, index) =>
	Object.entries(windowToTiler)
		.filter(([key, value]) => value === index)
		.map(([key, value]) =>
			workspace.windowList().find(window => String(window) === key)
		)
)
// Define a function that can take in a window object and change it's tiler
function handleWindowDesktopChange(window) {
	const windowId = String(window)
	const tilerIndex = windowToTiler[windowId]
	const newIndex = findDesktopIndex(window)
	tilers[tilerIndex] = tilers[tilerIndex].filter(w => w != window)
	tilers[newIndex].push(window)
}
// Connect function to the signals for each window
workspace.windowList()
	.filter(window => window.normalWindow)
	.forEach(window => {
		window.desktopsChanged.connect(() => {
			handleWindowDesktopChange(window)
		})
	})
