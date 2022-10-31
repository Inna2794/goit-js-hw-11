import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PictureApiService from './fetch-picture';

let gallery = new SimpleLightbox('.gallery a', {
  enableKeyboard: true,
});

const fetchPhotos = new PictureApiService();

const markupData = {
  markup: '',
  htmlCode: '',
};

const searchForm = document.querySelector('.search-form');
const gallerySelector = document.querySelector('.gallery');
const decoration = document.querySelector('.animation-decor');
const btnLoadMore = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSubmit);
btnLoadMore.addEventListener('click', onBtnClick);

async function onSubmit(e) {
  e.preventDefault();
  btnLoadMore.classList.add('is-hidden');
  cleanContainer();
  fetchPhotos.query = e.currentTarget.elements.searchQuery.value
    .toLowerCase()
    .trim();
  e.target.reset();
  console.log('searchQueryResult:', `${fetchPhotos.searchQuery}`);

  await fetchPhotos.fetchPicture().then(renderedPhotos).catch(console.log);

  decoration.style.display = 'none';
}

function onBtnClick() {
  fetchPhotos.fetchPicture().then(renderedPhotos).catch(console.log);
}

function renderedPhotos(results) {
  console.log(results);

  markupData.markup = results
    .map(
      hit =>
        `<a href="${hit.largeImageURL}"><div class="photo-card">
        <img src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy"
          class="img-item" />
        <div class="info">
    <p class="info-item">
      <b>Likes:</b>${hit.likes}
    </p>
    <p class="info-item">
      <b>Views:</b>${hit.views}
    </p>
    <p class="info-item">
      <b>Comments:</b>${hit.comments}
    </p>
    <p class="info-item">
      <b>Downloads:</b>${hit.downloads}
    </p>
  </div>
</div></a>`
    )
    .join('');

  gallerySelector.insertAdjacentHTML('beforeend', markupData.markup);
  gallery.refresh();
  btnLoadMore.classList.remove('is-hidden');
  console.log(fetchPhotos.pageNumber, fetchPhotos.totalPage);
  if (fetchPhotos.pageNumber > fetchPhotos.totalPage) {
    btnLoadMore.classList.add('is-hidden');
  }
  return markupData.markup;
}

function cleanContainer() {
  gallerySelector.innerHTML = '';
}
