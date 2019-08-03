---
title: React Native Experience
date: "2019-06-21T00:57:21.462Z"
---

For the last year, I have been working on converting an existing Ionic to React Native and wanted to provide some insight in to my experience with the conversion.

### Things I liked about the conversion

* The development experience was very similar to what I had grown accustomed to with developing React and Redux web based applications. [React Native Debugger](https://github.com/jhen0409/react-native-debugger) is an [Electron](https://electronjs.org/) app that provides the same development and debugging experience to having the React and Redux extensions enabled in Chrome dev tools.
* Hot reloading UI changes is so much nicer than waiting for re-compiles to complete.
* The effort on making things look the same between Android and iOS was minimal.
* [Fastlane](https://fastlane.tools/) really helped make our builds consistent and the plugins help with all kinds of tasks from updating certs, to posting to App Center.
* Adding security measures like certificate pinning and using the key stores to securely store app state were relatively easy to setup

### Things that were painful

* Upgrading React Native versions and plugins are not easy.
* `npm link`, which we use heavily for developing shared libraries for web apps, does not work with the Metro bundler and is still an [open issue](https://github.com/facebook/metro/issues/1). The linked github issue does have several examples of rn-cli.config.js/metro.config.js files towards the end that can be hacked together to allow linking to work. While it is being worked on, see the first pain point for when it finally does become available.
* Troubleshooting native issues is difficult. I can't recommend enough the importance of having dedicated native developers on a team. Investing in crash reporting through [Firebase](https://firebase.google.com/docs/crashlytics) or [App Center](https://appcenter.ms/) is also useful for trapping native issues. Android Studio and Xcode were regular fixtures on my desktop during development for tweaking app settings, viewing logs, and installing plugins manually.
* Try not to change your bundle identifier between development and store builds. We had an old requirement where our non-production build bundle identifier had to differ from our production one. This required some lost time troubleshooting Android crashes and fixing the build to rename all the java packages to match the bundle identifier.
* Finding the right package to extend functionality required more attention than finding packages for web projects. Rare are the projects that have excellent support cross platform and that are well written. React Native projects end up being written in 3 languages across two platforms, which makes it hard to expect any individual maintaining a package to be an expert at everything.
* Ionic had a great plugin experience. React Native linking a new plugin was hit and miss. I was forced to manually install a number of plugins.
