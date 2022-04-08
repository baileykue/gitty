const pool = require('../utils/pool');
const fetch = require('cross-fetch');

module.exports = class Quote {
  static getAll() {
    const api1 = fetch(
      'https://programming-quotes-api.herokuapp.com/quotes/random'
    );
    const api2 = fetch('https://futuramaapi.herokuapp.com/api/quotes/1');
    const api3 = fetch('https://api.quotable.io/random');

    // Promise.allSettled([api1, api2, api3]);

    return Promise.all([api1, api2, api3])
      .then((response) => {
        return Promise.all(response.map((res) => res.json()));
      })
      .then((response) =>
        response.flat().map((quote) => {
          return {
            author: quote.author || quote.character,
            content: quote.en || quote.quote || quote.content,
          };
        })
      );
  }
};
