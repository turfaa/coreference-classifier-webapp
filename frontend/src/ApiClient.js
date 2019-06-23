import axios from 'axios';
import {BASE_API} from './constants';

export default class ApiClient {
  constructor(baseApi = BASE_API) {
    this.baseApi = baseApi;
  }

  async getMarkableClusters(text) {
    return axios.post(`${this.baseApi}/generate-markable-clusters`, {text});
  }
}