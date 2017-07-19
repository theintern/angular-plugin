interface AngularConfig {
	config?: string | SystemJSLoader.Config | (string | SystemJSLoader.Config)[];
	require?: string | string[];
}

intern.registerPlugin('angular', async function ({ config: configs, require: requires }: AngularConfig) {
	async function configureLoader(config: string | SystemJSLoader.Config) {
		if (typeof config === "string") {
			await intern.loadScript(config);
		} else {
			SystemJS.config(config);
		}
	}

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

	if (configs) {
		if (Array.isArray(configs)) {
			for (let config of configs) {
				await configureLoader(config);
			}
		}
		else {
			await configureLoader(configs);
		}
	}

	if (requires && requires.length) {
		await intern.loadScript(requires);
	}

	await initTestEnv();
});
