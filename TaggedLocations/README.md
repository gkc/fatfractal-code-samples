## TaggedLocations
#### Run up a FatFractal engine on your dev machine
( see http://fatfractal.com/docs/getting-started/ )
#### Deploy this sample locally
```Bash
cd /path/to/fatfractal-code-samples/TaggedLocations/FatFractal
ffef deploylocal
```
#### Open and run TaggedLocations.xcodeproj
The app is simple - it allows the user to create "events" and tag them, and stores all data on the device using CoreData. The original ReadMe is [here](ReadMe.txt)

I've made some simple modifications to
* Also store all of the user's events in a FatFractal backend
* 'sync' the user's events when the app starts up, by retrieving any events that have been modified, for example on another device

#### Overview of the mods to the original Apple sample code:
* Let the FatFractal SDK know how to handle your CoreData objects, by creating a [custom FatFractal subclass](TaggedLocations/APLAppDelegate.m#L58-L94) and [modifying the AppDelegate to create an instance of it](TaggedLocations/APLAppDelegate.m#L147-L160)

** This is the code that holds everything together. We're over-riding
```Objective-C
- (id) createInstanceOfClass:(Class) class forObjectWithMetaData:(FFMetaData *)objMetaData
```
so that when the FatFractal SDK needs to create an instance of one of your objects, then you can control how that's done. If it's an NSManagedObject subclass, then we're first checking to see if we already have that object locally, and if not then we're calling the appropriate CoreData initializer.
* Added an 'ffUrl' property to [APLEvent](TaggedLocations/APLEvent.h#L55) and [APLTag](TaggedLocations/APLTag.h#L55)
** While not the only way, this is the simplest way possible to handle both the 'unique id' issue as well as allowing FatFractal's object REFERENCEs to work seamlessly
* Changed the name of the 'creationDate' property in APLEvent (and the core data model) to 'createdAt' (which is one of FatFractal's default built-in metadata attributes)
* Modified [APLEventsTableViewController](TaggedLocations/APLEventsTableViewController.m#L199-L205) so it first fetches from the CoreData store on the device, and [then from the FatFractal backend](TaggedLocations/APLEventsTableViewController.m#L149-L188)
** I've also added a 'lastRefreshDate' property, stored locally in NSUserDefaults, to limit the data that is pulled from the backend
* Added code to [create](TaggedLocations/APLEventsTableViewController.m#L419-L433) or [update](TaggedLocations/APLEventsTableViewController.m#L405-L419) an event on the backend as required
* Added code to [delete an event](TaggedLocations/APLEventsTableViewController.m#L286) from the FatFractal backend (uses 'queueing' for this so if your app is offline, the delete will be processed when it reconnects)
* Adding basic ['login'](TaggedLocations/APLEvent.h#L58) functionality
* Similarly, APLTagSelectionController will [fetch tags from the backend](TaggedLocations/APLTagSelectionController.m#L125-L157), [create](TaggedLocations/APLTagSelectionController.m#L443), [update](TaggedLocations/APLTagSelectionController.m#L429) and [delete](TaggedLocations/APLTagSelectionController.m#L320) tags, and [add](TaggedLocations/APLTagSelectionController.m#L404) or [remove](TaggedLocations/APLTagSelectionController.m#L399) a tag from an event.
