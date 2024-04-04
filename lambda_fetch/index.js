var admin = require("firebase-admin");

var serviceAccount = require("./newServiceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://runningstatsdashboard-default-rtdb.firebaseio.com"
});

exports.handler = async (event) => {

  const uid = event.pathParameters.uid;
  const db = admin.database();
  const ref = db.ref(`users/${uid}/runs`);

  try {
    const snapshot = await ref.once('value');
    const runs = snapshot.val();
    return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*", 
          "Access-Control-Allow-Credentials": true 
        },
        body: JSON.stringify(runs),
      };
  } catch (error) {
    return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*", 
        },
        body: JSON.stringify({ error: error.message }),
      };
  }
};

