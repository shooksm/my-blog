---
title: React Native badf00d Error
date: "2018-07-21T00:01:30.968Z"
---

I have recently been struggling with an error in React Native and wanted to share my findings as it might help others. We recently started to separate React Native projects at work. We had gotten them setup to build nightly and deploy latest Android and iOS versions to HockeyApp. But after a while we started getting crashes from the iOS version before the splash screen would clear. Checking the logs produced an exception with the termination reason `Namespace SPRINGBOARD, Code 0x8badf00d`.

Turns out this crash is caused by the Watchdog service tracking the app during startup and seeing that it has not started up and cleared the splash screen fast enough. The search results were not entirely helpful with most answers telling the questioner to limit running async code on the main thread. Since this is a React Native application, we had little control over what was happening on the main thread. Since the splash screen was not clearing, it was not even finished loading the bundle when it would crash let alone processing AJAX requests or performing other tasks.

After trying a number of things from reducing the bundle size, to stripping down the app to little more than a Hello World and even configuring HockeyApp Crash Reporting, I could not get the crash to go away. Finally today I had a breakthrough. It happen entirely by accident shortly after demoing some code from within the app. I just happened to have left my Metro bundler terminal active and it was in view when I tried duplicating our release. I was totally shocked when after installing the release IPA on a device and running the application the Metro bundler started to produce a bundle. I was expecting it to use the `main.jsbundle` our release build scripts created. That happy accident let me figure out what the issue was.

I read through the React Native Running on Device guide and in the [Configure app to use static bundle](https://facebook.github.io/react-native/docs/running-on-device#3-configure-app-to-use-static-bundle) section it prompts the reader that a line of code in `AppDelegate.m` need to be changed so that it points to the static bundle instead of a Metro instance.

Oops. Our release builds were still trying to use a Metro bundle. That somewhat explained the funky behavior of why the release build would work sometimes when a device was tethered or on the same WiFI as a Metro instance.

Working with our iOS developers we added the following code to `AppDelegate.m` that uses the DEBUG preprocessor flag in the build configuration to switch to using a static bundle only on release scheme builds. Hope this helps someone in the future.

```objectivec
#ifdef DEBUG
    jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
```

Right now we are still using the basic schemes and build configurations that came when we initiated the app. So this simple config may not stay this way long term but it fixed the crash. Now it is back to work on adding features.
