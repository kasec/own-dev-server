### WEBTOOL TODO
- [DOING] Commit everything til now.
- [DOING] Read rollup docs.
    + How plugins works.
    + Look answers in comunities.
- Implement markdown implementation.
- Create a environment function. iI is **dev** create a temp dir, if is **prod** must be add dir name to prod.
- The built html has some head tags fix that.
- [TESTING] Implement plugin about js and css chunks.
    - see this.emitFile examples in rollup docs.
    - see chunks  in rollup docs.
    - see multi input and output rollup docs.
    + investigate css plugin and renderchunk hook in rollupjs
- Check livereloading(fresh refresh always works)
- Create dir to views and dont use bundle.js just use chunks of js files.
- [STAND-BY] Looking for a better git flow includes, version, pr and everything about better development proccess, simulating a open source library flow.

with chunks can create a small pieces of code but always this pieces go to bundle output but you can got that pieces and import them in another sources without to import all bundle js file.  

### TODO WEBSITE
- Create a script or search a way to active the topbar button with the url
    - do it with regex and js.
- Create test in a11y firefox and fix all suggestions.
- Audit with chrome and fix all suggestions.
- Topbar add logo and name together and log add as slack logo as see it.
