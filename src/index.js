import Notiflix from 'notiflix';

const form = document.querySelector(".search-form");
const btnButton = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');
let page = 1;
let nameImg = '';

btnButton.classList.add('visually-hidden');
form.addEventListener('input', onNameImg);
form.addEventListener('submit', onSubmitNameImg);
btnButton.addEventListener('click', onLoadMore);

function onNameImg(e) {
	nameImg = e.target.value;
return nameImg

}

function onSubmitNameImg(e) {
	e.preventDefault();
	page = 1;
	fetchNameImg(nameImg, page)
	.then(renderCardImg)
	.catch(error=>console.log(error));
	gallery.innerHTML='';
	btnButton.classList.remove('visually-hidden');
}
async function fetchNameImg(nameImg, page) {
	const response = await  fetch(`https://pixabay.com/api/?key=32401247-d831a8438a21bb86fb66fd7b1&q=${nameImg}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`);
	const imgs = await response.json();
	return imgs;
}
function renderCardImg({hits, total}) {
	if (total===0) {
		Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
	}
	const markup = hits.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads})=> {
		return `<div class="photo-card">
		<img src="${webformatURL}" alt="${tags}" loading="lazy" />
		<div class="info">
		  <p class="info-item">
			 <b>Likes: </b>${likes}
		  </p>
		  <p class="info-item">
			 <b>Views: </b>${views}
		  </p>
		  <p class="info-item">
			 <b>Comments: </b>${comments}
		  </p>
		  <p class="info-item">
			 <b>Downloads: </b>${downloads}
		  </p>
		</div>
	 </div>`;
	}).join("");

	gallery.insertAdjacentHTML('beforeend', markup)
}
function onLoadMore(e) {
	page+=1;
	fetchNameImg(nameImg, page)
	.then(r => {
		renderCardImg(r);
		if ((r.total/40)<40) {
			btnButton.classList.add('visually-hidden');
			Notiflix.Notify.failure("We're sorry, but you've reached the end of search results.");
		}
	})
	.catch(error=>console.log(error));
}


