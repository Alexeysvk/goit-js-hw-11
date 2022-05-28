import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api';
const MY_API_KEY = '27687056-f14cdc56d168c42ac76f46ae3';

export default class ImagesApiServise {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.totalImages;
    this.perPage = 40;
  }

  async fetchImages() {
    const response = await axios(
      `/?key=${MY_API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.page}`,
    );

    const images = await response.data;

    this.incrementPage();
    this.totalImages = images.totalHits;

    return images.hits;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}