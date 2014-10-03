##### Extra Features
|[less](http://lesscss.org/) | [Jade](http://jade-lang.com/) | [traceur](https://github.com/google/traceur-compiler) | [Reactjs](http://facebook.github.io/react/index.html) | [di.js](https://github.com/angular/di.js#d6d42e10727b30d8a9d8d3277fb8a6d40f6ad251) | [Zone](https://github.com/angular/zone.js#74947b6f509b)| [browserify](http://browserify.org/)| [casper](http://casperjs.org/) | [mocha](http://visionmedia.github.io/mocha/) |
|--- |--- |--- |--- |--- |--- |--- |--- |--- |


## Quickstart

```sh
$ npm install --global gulp bower phantomjs
```

This will install Gulp, Bower and Phantomjs globally. Depending on your user account, you may need to gain elevated permissions using `sudo` (i.e `sudo npm install --global gulp`). Next, install the local dependencies Web Starter Kit requires:

```sh
$ npm install
```

That's it! You should now have everything needed to use the Gulp tools in Web Starter Kit.

### Gulp Commands

You can now use Gulp with the following commands to stay productive during development:

#### Watch For Changes & Automatically Refresh Across Devices

```sh
$ gulp watch dev serve
```
Now direct your browser to `http://localhost:3000/`

#### Watch For Changes, Fully build it & Automatically Re-Run Tests on PhantomJS

```sh
$ gulp watch test build serve
```

#### Build & Optimize

```sh
$ gulp
```

Build and optimize the current project, ready for deployment. This includes linting as well as image, script, stylesheet and HTML optimization and minification.



