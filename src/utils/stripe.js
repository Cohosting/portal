export const createStripeConnectAccount = async (userId, stripeConnectAccountId, cb) => { 
    cb(true);
    try {
      const response = await fetch('http://localhost:9000/create-connect-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          stripeConnectAccountId
        })  
      });
      const {accountLink} = await response.json();
      cb(false)
      window.location.href = accountLink.url;
    } catch(err) {
        cb(false)
    }


  }