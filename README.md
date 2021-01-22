# My GitHub Graph
Plan your next GitHub contributions to draw some GitHub art!

This is my first web project written in HTML, CSS and JavaScript, a good pretext for me to have fun and put into practice what I've been learning so far. To know more about this project: ```about.html```.

## Website structure

* src
  * assets: all the images, SVG and video used in the website
  * css: the CSS file handling the style
  * js: the logic (computation of dates, cell color updates, navigation of the grid using arrow keys)
  * views:
    * components: ```posthtml``` modules to avoid duplication of HTML code (mostly header and footer)
    * the website consists of only 2 pages: ```index.html``` for the project itself and ```about.html``` for the documentation
* dist: published website. Everything in here is generated so any updates will be overwritten.

+ configuration files of Webpack, Eslint, Stylelint, PostHTML and NPM. More details below.
    
## Dependencies

* [Prism](https://prismjs.com) for highlighting code keywords in ```about.html```. I use direct links to the stylesheets and JavaScript hosted by a CDN.
* [Font Awesome](https://fontawesome.com) for the cool icons. I use a direct link to their stylesheet.

The rest of the dependencies are handled by NPM and listed in ```package.json```:
* JavaScript libraries:
  * [Luxon](https://moment.github.io/luxon) for the dates: it's so easy to perform operations on dates with that. Plus, there are some nice formatting methods too.
  * [SaveSvgAsPng](https://github.com/exupero/saveSvgAsPng): I'm still learning SVG but I thought it was a "nice-to-have" feature.
* Linters: I use Visual Studio Code so I have already some pretty nice extensions for that but I wanted to lint the code during the build too.
  * eslint for JavaScript (configuration in ```.eslintrc```)
  * stylelint for CSS (configuration in ```.stylelintrc```)
* Web browser compatibility:
  * Babel, configured as a Webpack plugin, for JavaScript (configuration in ```webpack.config.js```)
  * Autoprefixer and postcss for CSS
* posthtml to avoid code duplication (configuration in ```posthtml.json```)
* browser-sync: a nice web server that refreshed each time there is a change in the files
* onchange: pretty useful to detect any changes in my files and run a build command to have the changes pushed to the web server
* npm-run-all: I rely on NPM scripts (check ```package.json```) to automate all the repetitive tasks of tesing, building and publishing so I use that to run multiple NPM scripts

## Run locally

```bash
npm install
npm run serve
```

If you plan to do some changes, use ```npm run watch``` instead of ```npm run serve``` to run the web server AND trigger a build+publication automatically upon changes.
