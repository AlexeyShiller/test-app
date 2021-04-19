import axios from 'axios'
import authHeader from './auth-header'

const API_URL = 'http://localhost:8080/api/test/'

class UserService {
  getPublicContent () {
    return axios.get(API_URL + 'all')
  }

  deleteUser (id) {
    return axios.delete(API_URL + 'user/' + (id))
  }

  muteUser (id) {
    return axios.put(API_URL + 'user/' + (id))
  }
}

export default new UserService()
