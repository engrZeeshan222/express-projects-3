# ClothingApp
Gsoft-online-purchasing-clothing-app

### NodeJS Project Setup

Use following steps to setup NodeJs project with VS Code:

- Clone repository from gsoft github

- To create `package.json` file for project, run the following in the terminal
    ```
    npm init
    ```
- This utility will walk you through creating a package.json file. It will ask you to for field values to configure in `package.json`, please add the relevant values. You can press enter to move to next option.


- `package.json` will be available in project root folder and you can open to verify/change the field values. Please confirm for the following values

 - Use following to run `.js` files with `node`
    ```
    node app.js
    ```
- To install the packages in your project you can use the following command to install a package and save it as a dependency in the `package.json` file. Change your package name with `<pkg>` which you want to install.

    ```
    npm install <pkg>
    ```
### Configure ESLint

Run following command  to install `eslint`
   ```
   npm install eslint
   ```
Run following command in terminal to configure `eslint` in project and select the options that are suitable for the project.
```
eslint --init
```
### Configure Prettier

Run following command  to install `prettier`
```
npm install prettier
```

### Backend


- Following is a application structure for backend system.

    ```
    >src
        > configs
        > models
        > routes
        > middlewares
        > controllers
        > services
    > app.js
    > package.json
    > .env
   ```

#### Module Structure
- Following is a node module structure.

    ```
        >src
        >test
        package.json
        app.js
        package.json
        .env
    ```

#### Usage Standards
	Following are the usage standards
       > DataBases: Caching - redis | Storage - RDMS - PostgreSQL
       > FrameWork : Node js / Express js 
       > Logging : Winston-logger-npm
       > Node version : v12.22.9
       > npm version  : 8.19.1
       > Use ES6 imports/exports
       > 
