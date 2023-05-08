import api from "./api";
import TokenService from "./tokenService";

class AuthService {
  login({ email, password }) {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('password', password);
    return api
      .post(
        "/auth/token", 
        params,
        {
          "Content-Type": "application/x-www-form-urlencoded",
        }
      )
      .then((response) => {
        if (response.data.accessToken) {
          TokenService.setUser(response.data);
        }

        return response.data;
      });
  }

  logout() {
    TokenService.removeUser();
    return api
      .post(
        "/signout",
        {headers: {"Authorization": 'Bearer ' + TokenService.getLocalAccessToken()}}
      )
      .then((response) => {
        return response.data;
      })
      .finally(() => {
        TokenService.removeUser();
      })
  }

  register({ username, email, password, repeatPassword, firstName, surname}) {
    return api.post("/signup", {
      "login": username,
      email,
      password,
      repeatPassword,
      firstName,
      "lastName": surname,
      "role": "USER"
    },
    {
      "Content-Type": "application/json",
    }
    );
  }
}

export default new AuthService();
