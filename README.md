# Notifications-Firebase-Cloud-Function
Automatically send instant push notifications ⚡ whenever there's a change in your firestore/firebase database!

This Notification Micro-service - Firebase Cloud Function can be used to send push notifications to users based on a document update in Firebase Firestore database. It automatically triggers whenever the firestore database collections(specified)/documents are updated.

I've used an example of a restaurant food ordering system in the code.
It sends notifications to the user whenever his/her order status changes.
The same thing is followed for the restaurant vendor, he gets a push notification whenever there's a new order. 

You can modify the firestore document collections as per your requirements. 

Note: We need the user's FCM TOken which you should ideally get and save in the db for smooth functioning..
