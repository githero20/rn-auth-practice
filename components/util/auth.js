import axios from "axios";
const API_KEY = process.env.API_KEY;
// API key is gotten from Web API key on fire base project settings

const authenticate = async (mode, email, password) => {
  let url = `https://identitytoolkit.googleapis.com/v1/accounts:${mode}?key=${API_KEY}`;

  const res = await axios.post(url, {
    email,
    password,
    returnSecureToken: true,
  });

  const token = res.data.idToken;

  return token;
};

export function signUp(email, password) {
  return authenticate("signUp", email, password);
}

export function login(email, password) {
  return authenticate("signInWithPassword", email, password);
}

// export const createUser = async (email, password) => {
//   const res = await axios.post(
//     "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + API_KEY,
//     {
//       email,
//       password,
//       returnSecureToken: true,
//     }
//   );
// };
// https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]
// URL to sign In with password, so similar to the sign up url, so they were combined
