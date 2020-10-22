const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// sendOrderNotificationToUser
const sendOrderNotificationToUser = async (customerFCMToken, orderStatus) => {
    if (customerFCMToken && customerFCMToken !== "" && orderStatus !== "") {
        let message = {
            token: customerFCMToken,
            notification: {
                body: "You gotta get your appetite filled now!",
                title: "Your order is ready",
            },
            data: {
                screen: "Home",
            },
            apns: {
                payload: {
                    aps: {
                        "mutable-content": 1,
                    },
                },
                fcm_options: {
                    image:
                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=602&q=80",
                },
            },
            android: {
                notification: {
                    image:
                        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=602&q=80",
                },
            },
        };
        switch (orderStatus) {
            case "order_preparing":
                message.notification.title = "Your order is being prepared!";
                message.notification.body = "It will be ready soon 😋";
                message.apns.fcm_options.image =
                    "https://image.freepik.com/free-vector/pizza-maker-concept-illustration_114360-3085.jpg";
                message.android.notification.image =
                    "https://image.freepik.com/free-vector/pizza-maker-concept-illustration_114360-3085.jpg";
                break;

            case "order_ready":
                message.notification.title = "Hurray! Your Order is Ready 🙌";
                message.notification.body =
                    "You gotta get your appetite filled now! 😁";
                message.apns.fcm_options.image =
                    "https://image.freepik.com/free-vector/chef-with-tray-poster_98292-554.jpg";
                message.android.notification.image =
                    "https://image.freepik.com/free-vector/chef-with-tray-poster_98292-554.jpg";
                break;

            case "order_cancelled":
                message.notification.title =
                    "Sorry! Your order is cancelled by Restaurant 😶";
                message.notification.body =
                    "Please get in touch with restaurant for any assistance";
                message.apns.fcm_options.image =
                    "https://st3.depositphotos.com/24286222/36355/v/380/depositphotos_363556486-stock-illustration-sorry-hand-drawn-vector-illustration.jpg";
                message.android.notification.image =
                    "https://st3.depositphotos.com/24286222/36355/v/380/depositphotos_363556486-stock-illustration-sorry-hand-drawn-vector-illustration.jpg";
                break;

            default:
                console.log(
                    "Not sending notification because the order status is something else!"
                );
                return false;
        }
        admin
            .messaging()
            .send(message)
            .then((response) => {
                console.log("Successfully sent notification:", response);
                return true;
            })
            .catch((error) => {
                console.log("Error sending notification:", error);
                return false;
            });
    }
};
const sendOrderNotificationToVendor = async (vendorFCMToken, orderStatus) => {
    console.log("sendOrderNotificationToVendor called!");
    //converting nullish to null ( !!vendorFCMToken )
    if (!!vendorFCMToken && vendorFCMToken.length && orderStatus.length) {
        console.log("The vendorFCMToken is ", vendorFCMToken);
        console.log("the order status is", orderStatus);
        let message = {
            token: vendorFCMToken,
            notification: {
                body: "You gotta get your appetite filled now!",
                title: "Your order is ready",
            },
            data: {
                screen: "Home",
            },
        };
        switch (orderStatus) {
            case "order_received":
                message.notification.title = "You've got a new order! ✔";
                message.notification.body =
                    "Received a new order, please check Feazy console";
                break;
            // case "order_preparing":
            //     message.notification.title = "Your order is being prepared!";
            //     message.notification.body = "It will be ready soon 😋";
            //     // message.apns.fcm_options.image =
            //     //     "https://image.freepik.com/free-vector/pizza-maker-concept-illustration_114360-3085.jpg";
            //     // message.android.notification.image =
            //     //     "https://image.freepik.com/free-vector/pizza-maker-concept-illustration_114360-3085.jpg";
            //     break;

            // case "order_ready":
            //     message.notification.title = "Hurray! Your Order is Ready 🙌";
            //     message.notification.body =
            //         "You gotta get your appetite filled now! 😁";
            //     // message.apns.fcm_options.image =
            //     //     "https://image.freepik.com/free-vector/chef-with-tray-poster_98292-554.jpg";
            //     // message.android.notification.image =
            //     //     "https://image.freepik.com/free-vector/chef-with-tray-poster_98292-554.jpg";
            //     break;

            // case "order_cancelled":
            //     message.notification.title =
            //         "Sorry! Your order is cancelled by Restaurant 😶";
            //     message.notification.body =
            //         "Please get in touch with restaurant for any assistance";
            //     // message.apns.fcm_options.image =
            //     //     "https://st3.depositphotos.com/24286222/36355/v/380/depositphotos_363556486-stock-illustration-sorry-hand-drawn-vector-illustration.jpg";
            //     // message.android.notification.image =
            //     //     "https://st3.depositphotos.com/24286222/36355/v/380/depositphotos_363556486-stock-illustration-sorry-hand-drawn-vector-illustration.jpg";
            //     break;

            default:
                console.log(
                    "Not sending notification because the order status is something else!"
                );
                return false;
        }
        admin
            .messaging()
            .send(message)
            .then((response) => {
                console.log(
                    "Successfully sent notification for VENDOR:",
                    response
                );
                return true;
            })
            .catch((error) => {
                console.log("Error sending notification VENDOR:", error);
                return false;
            });
    }
};

const getVendorsToken = async (restaurantId) => {
    let restaurantData = await admin
        .firestore()
        .collection("restaurants")
        .doc(restaurantId)
        .get();
    if (restaurantData.exists) {
        console.log("restaurantData exists!!");
        console.log(restaurantData.data());
        let vendorId = restaurantData.data().vendorId;
        if (!!vendorId && vendorId.length) {
            let vendorData = await admin
                .firestore()
                .collection("users")
                .doc(vendorId)
                .get();
            if (vendorData.exists) {
                console.log(vendorData.data());
                let vendorToken = vendorData.data().token;
                if (vendorToken && vendorToken !== "") {
                    console.log("got vendorToken");
                    return vendorToken;
                } else {
                    console.log("vendorToken does not exist");
                    return false;
                }
            } else {
                console.log("vendorData does not exist");
                return false;
            }
        } else {
            console.log("vendorId does not exist");
            return false;
        }
    } else {
        console.log("restaurantData does not exist");
        return false;
    }
};

exports.notificationService = functions.firestore
    .document("orders/{orderId}")
    .onUpdate(async (change, context) => {
        // Get an object representing the document
        // e.g. {'name': 'Marie', 'age': 66}
        const newValue = change.after.data();
        // ...or the previous value before this update
        const previousValue = change.before.data();
        const newOrderStatus = newValue.orderStatus;
        const oldOrderStatus = previousValue.orderStatus;
        const customerFCMToken = newValue.customerFCMToken;
        const restaurantId = previousValue.restaurantId;
        if (newOrderStatus !== oldOrderStatus) {
            //the order status is changed! and hence we're sending a notification
            //send notification to user/customer - Android/Ios Push notification
            let job1 = await sendOrderNotificationToUser(
                customerFCMToken,
                newOrderStatus
            );

            if (newOrderStatus === "order_received") {
                // get vendor's token, based on the restaurantId
                let vendorToken = await getVendorsToken(restaurantId);
                //Send web push notification to the restaurant Vendor
                if (!!vendorToken && vendorToken.length) {
                    return await sendOrderNotificationToVendor(
                        vendorToken,
                        newOrderStatus
                    );
                }
            } else {
                console.log(
                    "didn't fetched the vendor token or sent notification as order status is not order received!"
                );
            }

            return job1;
        } else {
            //no status change and hence not sending notification
            return false;
        }
    });
