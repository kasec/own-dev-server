## Overview

- Create a project structure where pug js templates are rendering to html files in dev server, using something like pages    directory like nextjs and nuxtjs.
- Create a markdown implementation to blog.

### Technologies 
- Rollup
- Pugjs
- Markedjs
- TS

### TASKS

[TESTING] Looking for rollup dev server debug the plugin.
[DONE] Read PUG files and watch them in browser something hmr(hot module reload).
[DOING] run rollup-plugin and watch how this works to made reverse engineering

> Con respecto a la recopilacion de informacion de hoy se llego a la siguiente conclusion y se tomaran las siguientes descisiones con base al proceso del marco de trabajo que se desea crear. 
Se tomaran bases sobre la informacion recabada en la documentacion de rollup acerca de (*emitfile*), asi como sobre la informacion recabada en la inspeccion del plugin **rollup-plugin-html**.

### PLAN
- Create a minimal configuration to migrate html project.
    1. Check Dev Server Rollup plugin, Webpack dev Server, etc. for create my own dev server
    2. Implement Pug and Marked JS.
    3. Check and analize a best way to build to prod, check and investigate.
- Check everything can i improve and writing in docs.
- Start with a framework with the main ideas this is after the project is ready.
- Add chunks namespaced with view from js and styles.
    Check chunks & this.emitFile example in rollup docs.

### IDEAS
- Check EMBER, ANGULAR, etc. To watch a better way to handle the routes and project structure.
- Check a JSX, Shadow DOM, Virtual DOM, Documentation to find a better way to manage it.
- Check Investigate info about reactive programming.
- Check Information about mdx.js could be a idea to implement a idea with it.

- Implement in some place of a file *microcomponents* something like mixins in pug.
- Implementic a place to add ui states something like that and minimal behaviors.

### Tech Steps.
- [TESTING] Se tiene que configurar la parte de **input** para ver donde estara agarrando los archivos.
    [-] Recomendable `src`, solo que se tendra como en nuxt y next un directorio llamado `pages`.
    [-] Otra opcion es tener cada vista en su propia carpeta donde la vista tendra la terminacion `.view.pug`, para que no cometa el mismo error que **nextjs** y todos los `.tsx` los procese al momento de pasar a prod.
    o se pueden usar ambas opciones.
    [Bonus] para esto se tiene que checar distintas metodologias de trabajo como angular, ember, entre otras tecnologias, se dejara para despues.
- [DONE] Se estara leyendo con la api de node los archivos del directorio que hablamos arriba, posiblemente esta parte sea la mas dolorosa, abra que mantenerse cuerdo y no perder el ritmo..

- [TESTING] Se estaran actualizando los archivo en ambiente de desarrollo con **rollup-plugin-serve**.

- [TESTING] Se usuara `rollup-plugin-pug` para la transformacion de los archivos `.pug` a *es* y de ahi una pequena configuracion para pasarlos a html5, nos basaremos en la informacion de `plugin-html` asi como la informacion de rollup sobre **emitFile**.

- [STANDBY] La parte de markdown queda pendiente hasta que esta parte este realmente funcional.

- [TODO] Organizar el proyecto para ver que modificaciones y/o actualizaciones se le hacen al proyecto, sirvira para testear la applicacion.

- Check how script reload works and fix to works in any file, maybe add script in all pugfiles, check the behavior.
