// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const env = {
    production: true, 
    api_domain: 'http://172.16.12.19:8000/vi/api/',
    api_domain_root: 'http://172.16.12.19:8000',
    key_recaptcha: '6LcuZ1EUAAAAAA9otxmMIyEZJiXwQPSIaWvbpFn6'
};
