import dbQuery from '../db/dev/dbQuery';
import { errorMessage, successMessage, status } from '../helpers/status';

const webpush = require('web-push');
var schedule = require('node-schedule');

const vapidKeys = {
  publicKey:
    'BJjd6xAKWtVRmFGWJfDGdBBsSo5syPiTA8aKDCJ0kBvHWOZd-Es4wXbA4OBnx6CPe9PFljj9YheM1d5XivjX5Hw',
  privateKey: 'obqcvZEHQxgZOqkyIqBdkO-pNLUdGVFFjht9oH3zU9s',
};

webpush.setVapidDetails(
  'http://127.0.0.1:8080',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const addSubscription = async (req, res) => {
  const { endpoint, expirationTime, p256dh, auth } = req.body;
  const { user_id } = req.user;
  const insertQuery = `INSERT INTO subscriptions(id, user_id, endpoint, expirationtime, p256dh, auth)
  VALUES (default, $1, $2, $3, $4, $5) ON CONFLICT (user_id) DO NOTHING RETURNING *;`;
  try {
    const { rows } = await dbQuery.query(insertQuery, [
      user_id,
      endpoint,
      expirationTime,
      p256dh,
      auth,
    ]);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = 'Unable to add subscription';
    return res.status(status.error).send(errorMessage);
  }
};

const sendNotifications = schedule.scheduleJob('*/1 * * * *', async () => {
  const getSubscriptionQuery = `select endpoint, s.user_id, expirationtime, p256dh, auth, title, start_time from subscriptions s
    JOIN events ev on s.user_id = ev.user_id
    JOIN users u on u.id = s.user_id
    where ev.start_date::date = CURRENT_DATE::date and
    DATE_PART('minute',TO_TIMESTAMP(ev.start_time, 'HH24:MI')::TIME - TO_TIMESTAMP(to_char(now(),'HH24:MI'), 'HH24:MI')::TIME) BETWEEN 1 AND 60 and
    notifications = TRUE;`;
  try {
    const { rows } = await dbQuery.query(getSubscriptionQuery);
    const dbResponse = rows;
    Promise.all(
      dbResponse.map((element) => {
        const subscription = {
          endpoint: element.endpoint,
          keys: {
            p256dh: element.p256dh,
            auth: element.auth,
          },
        };
        const notificationPayload = {
          notification: {
            title: 'Event Notification',
            body: `Your event - ${element.title} - will start at ${element.start_time}  `,
            icon: 'assets/images/logos/logo.png',
            vibrate: [100, 50, 100],
            data: {
              dateOfArrival: Date.now(),
              primaryKey: 1,
            },
            actions: [],
          },
        };

        webpush.sendNotification(
          subscription,
          JSON.stringify(notificationPayload)
        );
      })
    ).then(() => console.log('Newsletter sent successfully.'));
  } catch (error) {
    console.log('Error:', error);
  }
});

export { addSubscription };
