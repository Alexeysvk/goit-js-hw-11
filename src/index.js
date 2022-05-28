import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { render, gallery } from './js/render';
import ImagesApiServise from './js/images-service';
import LoadMoreBtn from './js/load-more-btn';

import './css/styles.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

Notiflix.Notify.init({
  width: '280px',
  position: 'left-top',
  distance: '10px',
  opacity: 1,
  timeout: 5000,
  fontSize: '15px',
});

const form = document.querySelector('#search-form');
const imagesApiServise = new ImagesApiServise();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more', hidden: true });
const galleryModal = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionType: 'alt',
  captionDelay: 200,
  captionPosition: 'bottom',
});

form.addEventListener('submit', onSubmitBtnClick);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);
// window.addEventListener('scroll', handleScroll);

function onSubmitBtnClick(e) {
  e.preventDefault();
  imagesApiServise.query = e.currentTarget.elements.searchQuery.value;
  imagesApiServise.resetPage();
  gallery.innerHTML = '';

  if (imagesApiServise.query.trim() === '') {
    loadMoreBtn.hide();
    Notiflix.Notify.warning('Please enter correct search details!!!');
    return;
  }
  loadMoreBtn.show();
  fetchImages();

  e.currentTarget.reset();
}

async function fetchImages() {
  loadMoreBtn.disabled();

  try {
    const images = await imagesApiServise.fetchImages();
    countOfImages();
    if (images.length === 0) {
      loadMoreBtn.hide();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      gallery.innerHTML = '';
    }
    render(images);

    galleryModal.refresh();

    if (images.length < imagesApiServise.perPage) {
      loadMoreBtn.hide();
    }
    loadMoreBtn.enable();
  } catch {
    Notiflix.Notify.failure('Sorry.Something wrong(');
  }
}

function countOfImages() {
  const quantityImagesOnPage = imagesApiServise.perPage;
  const currentImages = imagesApiServise.page * imagesApiServise.perPage - imagesApiServise.perPage;
  const totalImages = imagesApiServise.totalImages;

  if (currentImages === quantityImagesOnPage && totalImages !== 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalImages} images.`);
  }

  if (currentImages > totalImages && totalImages !== 0 && totalImages > quantityImagesOnPage) {
    loadMoreBtn.hide();
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search ${totalImages} results`,
    );
  }
}

function handleScroll(e) {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 5) {
    fetchImages();
  }
}