import api from "./api";

class UserService {
  async getUserInfo() {
    try {
      return api.get("/user");
    } catch (e) {
      alert(e.message);
    }
  }

  async resetPassword(email) {
    try {
      return api.post(`/user/reset_password?email=${email}`);
    } catch (e) {
      alert(e.message);
    }
  }
}

export default new UserService();
