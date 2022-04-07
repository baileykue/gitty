/* eslint-disable no-console */
const exchangeCodeForToken = async (code) => {
  console.log(`MOCK INVOKED: exchangeCodeForToken(${code})`);
  return `MOCK_TOKEN_FOR_CODE_${code}`;
};

const getGithubProfile = async (token) => {
  console.log(`MOCK INVOKED: getGithubProfile(${token})`);
  return {
    username: 'cookie_monster',
    avatar:
      'https://cdn.britannica.com/66/218266-050-77C3D624/Cookie-Monster-Sesame-Street-2016.jpg',
    email: 'choco-chips@example.com',
  };
};

module.exports = { exchangeCodeForToken, getGithubProfile };
