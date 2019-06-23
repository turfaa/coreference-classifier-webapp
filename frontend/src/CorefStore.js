import {observable} from 'mobx'
import ApiClient from './ApiClient';
import {BASE_API} from './constants';

export class CorefStore {
  @observable loading = false;
  @observable result = null;
  @observable error = null;

  constructor(baseApi = BASE_API) {
    this.apiClient = new ApiClient(baseApi);
  }

  async getMarkableClusters(text) {
    this.loading = true;
    this.error = null;

    try {
      const ret = await this.apiClient.getMarkableClusters(text);
      ret.data.data.sentence.phrase = ret.data.data.sentence.phrase.map(phrase => ({
        ...phrase, 
        '#text': phrase['#text'].split(' ').map(word => word.split('\\').slice(0, -1).join('\\')).join(' ')
      }));
      
      this.result = ret.data;
    }
    catch (err) {
      this.error = err;
    }
    finally {
      this.loading = false;
    }
  }
}

export default new CorefStore();