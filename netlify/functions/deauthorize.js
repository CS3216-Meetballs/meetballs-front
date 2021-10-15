const axios = require('axios');

exports.handler = async function (event, context, callback) {
  const endpoint = `${process.env.REACT_APP_API_URL}/zoom/deauthorize`;

  const body = await JSON.parse(event.body)
  console.log(body)
  return axios
    .post(endpoint, body, {
      headers: {
        Authorization: event.headers['authorization'],
        'Content-Type': 'application/json',
      },
    })
    .then((result) => {
      // console.log('success', result)
      return {
        statusCode: result.status,
        body: JSON.stringify({ message: result.data }),
      };
    })
    .catch((error) => {
      if (error.response) {
        // console.log('Response failed', error.response)
        return {
          statusCode: error.response.status,
          body: JSON.stringify({ message: error.response.data }),
        };
      } else if (error.request) {
        // console.log('Request failed', error.request)
        return {
          statusCode: 500,
          body: JSON.stringify({ message: `Oops! Something went wrong. ${error}` }),
        };
      } else {
        // Something happened in setting up the request that triggered an Error
        // console.log('Error', error.message);
        return {
          statusCode: 443,
          body: JSON.stringify({ message: `Oops! Something went wrong. ${error}` }),
        };
      }
    });
};
