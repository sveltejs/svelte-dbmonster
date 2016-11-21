import Table from './Table.html';

perfMonitor.startFPSMonitor();
perfMonitor.startMemMonitor();
perfMonitor.initProfiler('view update');

const table = new Table({
	target: document.querySelector( '#body' ),
	data: {
		dbs: ENV.generateData().toArray()
	}
});

function redraw() {
	perfMonitor.startProfile('view update');
	table.set({ dbs: ENV.generateData().toArray() });
	perfMonitor.endProfile('view update');
	setTimeout(redraw, ENV.timeout);
}

redraw();
