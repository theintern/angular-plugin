intern.registerPlugin('angular', async function () {
	async function initTestEnv() {
		const { TestBed } = await import('@angular/core/testing');
		const { BrowserDynamicTestingModule, platformBrowserDynamicTesting } = await import('@angular/platform-browser-dynamic/testing');

		TestBed.initTestEnvironment(
			BrowserDynamicTestingModule,
			platformBrowserDynamicTesting()
		);

		intern.on('suiteAdd', suite => {
			suite['afterEach'] = () => {
				TestBed.resetTestingModule();
			};
		});
	}

	await intern.loadScript([
		'zone.js/dist/zone.js',
		'zone.js/dist/long-stack-trace-zone.js'
	]);

	await initTestEnv();
});
