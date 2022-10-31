import axios from 'axios';
import Notiflix from 'notiflix';

const API_KEY = '30693264-9f2d2acf319fb28e9e78d56a0';

export default class PictureApiService {
  constructor() {
    this.searchQuery = '';
    this.pageNumber = 1;
    this.totalPage = 1;
  }

  async fetchPicture() {
    const base_url = 'https://pixabay.com/api/?';
    const searchParams = new URLSearchParams({
      key: API_KEY,
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page: this.pageNumber,
      per_page: 40,
    });

    try {
      const data = await axios.get(`${base_url}${searchParams}`);
      this.totalPage = Math.ceil(data.data.totalHits / 40);
      if (!data.data.hits.length) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }
      if (this.totalPage <= this.pageNumber) {
        Notiflix.Notify.warning(
          "We're sorry, but you've reached the end of search results."
        );
      }
      if (this.pageNumber === 1) {
        Notiflix.Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
      }
      this.pageNumber += 1;
      return data.data.hits;
    } catch {
      error => console.log(error);
    }
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPageNumber() {
    this.pageNumber = 1;
  }
}
