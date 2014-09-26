##### Extra Features
|[less](http://lesscss.org/) | [Jade](http://jade-lang.com/) | [traceur](https://github.com/google/traceur-compiler) | [Reactjs](http://facebook.github.io/react/index.html) | [Zone](https://github.com/angular/zone.js#74947b6f509b)| [webpack](https://github.com/webpack/webpack)| [casper](http://casperjs.org/) | [mocha](http://visionmedia.github.io/mocha/) |
|--- |--- |--- |--- |--- |--- |--- |--- |


This project is showing off my wsk-react-di with less version of bootstrap (and some jquery hack, off-course :) to create a prototype of super responsive table

You can sort rows in the tables or filter them out by clicking (or touching) at the head of the collumn. It will bring a popover with a list with the checked rows.  

Note that the order on the filter will reflect the current sorting of the table dynamicaly. And that each table are complete isolated from each other. And that I have support for source maps (well, not 100%, reactjs got a bug on their sourcemaps :)

## Quickstart

```sh
$ npm install --global gulp bower phantomjs
```

This will install Gulp, Bower and Phantomjs globally. Depending on your user account, you may need to gain elevated permissions using `sudo` (i.e `sudo npm install --global gulp`). Next, install the local dependencies Web Starter Kit requires:

```sh
$ npm install && bower install
```

That's it! You should now have everything needed to use the Gulp tools in Web Starter Kit.

### Gulp Commands

You can now use Gulp with the following commands to stay productive during development:

#### Watch For Changes & Automatically Refresh Across Devices

```sh
$ gulp serve dev
```
Now direct your browser to `http://localhost:3000/`

#### Watch For Changes, Fully build it & Automatically Re-Run Tests on PhantomJS

```sh
$ gulp serve watch build test
```

#### Build & Optimize

```sh
$ gulp
```

Build and optimize the current project, ready for deployment. This includes linting as well as image, script, stylesheet and HTML optimization and minification.



