const admin = require('firebase-admin');
const serviceAccount = require('./newServiceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://runningstatsdashboard-default-rtdb.firebaseio.com"
});

exports.handler = async (event) => {
  // Parse the run data from the body and uid from the path parameters
  const requestBody = JSON.parse(event.body);
  const newRun = requestBody.run;
  const uid = event.pathParameters.uid; 

  const db = admin.database();
  const runsRef = db.ref(`users/${uid}/runs`);

  try {
    const runsSnapshot = await runsRef.once('value');
    let runsData = runsSnapshot.val();

    let runsArray = runsData ? (runsData instanceof Array ? runsData : Object.values(runsData)) : [];

    runsArray.push(newRun);

    await runsRef.set(runsArray);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*", 
        "Access-Control-Allow-Credentials": true 
      },
      body: JSON.stringify({ success: true, runs: runsArray }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin": "*", 
      },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};


