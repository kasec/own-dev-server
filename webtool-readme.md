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


Quiero crear un pug dev server que se actualice cada vez que se modifique un archivo, actualmente funciona cuando modificas los script js y css styles, pero cuando modificas un componente de pugjs no la vista no se actualiza.
Intente pero no pude, creo que el problema no se esta solucionando de la forma correcta, otra opcion seria checar los plugins  y que es lo que hace el de css para que si lo modique el stilo y que no hace el de pug en el componente.

habra que ver si crear el dev server es la mejor opcion por que se tendria que  agregar estilos y scripts asi como componentes cada vez que se actualize algun cambio.

ver la doc de rollup para ver si alguna opcion de cuando se cargue(load) la vista importarla su code para re crear el html en el output con alguna funcion de `this` y/o checar que es lo que hace el css y el de pug no.

Se me ocurrio en la manana que podiamos cambiar el servidor y ahi mandar los .static/.views a transform hook escuchar la url del cliente y asi editarlo el archivo view, actualizar esa vista ya cuando escuchaste los archivos modificados.

Ahora me viene la idea otra vez de modificar/crear el servidor express, que utilize en engine de pug ahi mismo y haga la compilacion JIT, solo al eschuchar ese archivo lo mandarias a la carpeta la cual estas escuchando. y lo cambios se harian.

Funciona el server pero no refresca y cuando refrescas se pierden los estilos
ademas se tiene que ver si no va haber conflictos con los scripts.

Checar si el numero del emitFile cambia en el css file cuando se refresca, porque si funciona cuando editas el archivo y nose porque, se supone que crea el archivo otra vez pero si crea uno diferente con distinta referencia no sabria el html como asociarlo, o a menos que no cambie el id de referecia o si este modificando

al parecer no cambia porque el id de referencia es el nombre del archivo no es un creado con un hash, lo que me lleva a la siguiente pregunta, cuando el archivo de js ver ese comportamiento y ver si cambia el nombre del archivo.

al parecer los archivos de js se deben de crear con emitFile type chunk ya que si resuelve los archivs de forma correcta a diferencia del emit file que al querer resolver las importaciones no lo ahce de forma adecuada.

## TODO

- Create 2 environments:
+ **Prod** env, works now, but dont refresh when a pug component its updated, that's the reason becuase I gonna create a dev environment. Leave a rollup object exactly as it is currently, quit not needed plugins(livereload and serve)

- **Dev** env, create a dev server, I made this currently, but doesnt work at all yet, when you refresh the styles are lost, fix every feature is need it.

TASK above its ready

- Read how to works filter to create mine with plugins about markdown-it
https://pugjs.org/language/filters.html
https://github.com/pugjs/pug/issues/404
