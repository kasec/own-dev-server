### WEBTOOL TODO
- [TODO] Create a `pug dev server` focused in **serve rollup plugin**
- [TODO] Implement markdown.

- [STANDBY] Clone vite, nollup and snowpack to know how this works and create a projects with this implementations, i need it.
- [DOING] Commit everything til now.
- [DOING] Read rollup docs.
    + How plugins works.
    + Look answers in comunities.
- [DOING] Create a environment function. iI is **dev** create a temp dir, if is **prod** must be add dir name to prod.
- The built html has some head tags fix that.
- [TESTING] Implement plugin about js and css chunks.
    - see this.emitFile examples in rollup docs.
    - see chunks  in rollup docs.
    - see multi input and output rollup docs.
    + investigate css plugin and renderchunk hook in rollupjs
- Check livereloading(fresh refresh always works)
- check when its needed to use load hook.
- Create dir to views and dont use bundle.js just use chunks of js files.
- [STAND-BY] Looking for a better git flow includes, version, pr and everything about better development proccess, simulating a open source library flow.
- [TODO] Create a dev server, 'cause i need compile JIT the pug files. thats the reason cause doesnt works live reload in project

with chunks can create a small pieces of code but always this pieces go to bundle output but you can got that pieces and import them in another sources without to import all bundle js file.  

### TODO WEBSITE
- Create a script or search a way to active the topbar button with the url
    - do it with regex and js.
- Create test in a11y firefox and fix all suggestions.
- Audit with chrome and fix all suggestions.
- Topbar add logo and name together and log add as slack logo as see it.
- Change index or main view with a short description and new posts(thoughts, TIL, news, blog)
- Add new tab with `about me` and this will be currently is index or main view
