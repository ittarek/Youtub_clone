const detailsModal = document.querySelector('.details_modal');
const details_button = document.getElementsByClassName('details_button');

const removeActiveClass = () => {
  const activeButton = document.getElementsByClassName('active');
  for (let btn of activeButton) {
    btn.classList.remove('active');
  }
};
const openModal = id => {
  detailsModal.style.display = 'block';
  // detailsModal.classList.remove('hidden');
  loadVideoDetails(id);
};

// click the outside and close modal
window.onclick = function (event) {
  if (event.target == detailsModal) {
    detailsModal.style.display = 'none';
  }
};
// searching method

const getVideoBySearch = () => {
  const search = document.getElementById('search');
  const searchText = search.value;
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      displayVideo(data.videos);
    });
};

const loadVideoDetails = videoId => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayVideoDetails(data.video);
    });
};
const closeModal = () => {
  detailsModal.style.display = 'none';
};
const displayVideoDetails = video => {
  console.log(video);

  const detailsContainer = document.querySelector('.details_modal');
  detailsContainer.innerHTML = '';
  const div = document.createElement('div');
  div.innerHTML = `
      <div class=" mx-auto mt-[10%]  w-[35rem] h-[35rem]   image-full shadow-sm">
      <div class="p-11 bg-black text-white rounded-lg">
        <p class="font-semibold mb-2">${video.title}</p>
        <p>
         ${video.description}
        </p>
      </div>
      <div><img src="${video.thumbnail}" class="object-cover w-full h-full" alt=""></div>
      <button onclick="closeModal()" class="float-end  bg-red-400 text-white font-bold p-3">Close</button>
    </div>
  `;
  detailsContainer.append(div);
};
// show category for navigation items
const fetchCategory = () => {
  fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(res => res.json())
    .then(data => displayCategory(data.categories));
};

const displayCategory = data => {
  const categoryContainer = document.querySelector('.navigation_buttons');
  //   categoryContainer.innerHTML = '';
  for (let cat of data) {
    const ul = document.createElement('div');
    ul.innerHTML = ` 
     <button id='btn - ${cat.category_id}' onclick="showByCategory(${cat.category_id})"
        class="flex justify-between  items-center mx-3 my-3 hover:bg-red-600 bg-gray-100 rounded px-2 font-[400] duration-300 cursor-pointer hover:text-white [first-child]:bg-red-500 ">
        ${cat.category}
    
      </button>
    
  
    `;
    categoryContainer.append(ul);
  }
};

const fetchData = (searchText = '') => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(data => data.json())
    .then(res => {
      displayVideo(res.videos);
      removeActiveClass();
      const allBtn = document.getElementById('all_btn');
      allBtn.classList.add('active');
    });
};
// show data by category wise
const showByCategory = id => {
  const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      displayVideo(data.category);
      removeActiveClass();
      const clickEdButton = document.getElementById(`btn - ${id}`);
      clickEdButton?.classList.add('active');
    });
};

const displayVideo = videos => {
  const videoContainer = document.getElementById('video-container');
  if (videos?.length == 0) {
    videoContainer.innerHTML = `
    <div
        class="py-20 col-span-full flex flex-col justify-center items-center text-center"
      >
        <img class="w-[120px]" src="./assets/Icon.png" alt="" />
        <h2 class="text-2xl font-bold">
          Oops!! Sorry, There is no content here
        </h2>
      </div>
    `;
    // hideLoader();
    return;
  }
  videoContainer.innerHTML = '';
  videos?.forEach(video => {
    let videoCard = document.createElement('div');
    videoCard.innerHTML = `
     <div key=${
       video.video_id
     } class="card flex flex-col gap-4 w-full]  h-[27rem] relative ">
        <!-- img -->
        <div class="img_div">
          <img src=${
            video.thumbnail
          }  class="rounded relative w-full h-[18rem]" alt="video_thumbLane" />
          <div class="absolute md:top-[37%] top-[40%] md:left-[22%] right-0 mr-6">
            <p class="text-white text-xl">10:25</p>
          </div>
        </div>
        <!-- chanel details -->
        <div class="chanel_details">
          <div class="flex items-start gap-3">
            <img
              src=${video.authors[0]?.profile_picture}
              class="border p-1 w-11 h-11 rounded-full object-fit"
              alt="user" />
            <div>
              <h2 class="font-semibold text-lg">${video.title}</h2>
              <div class=" flex gap-3 items-center"><span class="text-gray-500 text-sm">${
                video.authors[0].profile_name
              }</span>  <span>${
      video.authors[0].verified === true
        ? `  <img class="w-6 h-6 rounded-full"
            src="https://media.istockphoto.com/id/1344841941/vector/blue-verified-account-icon-approved-profile-sign-tick-in-rounded-corners-star-top-page-logo.jpg?s=1024x1024&w=is&k=20&c=tcJRy7xVzVho8Uo2FrqIXs0NNsahka9JVXSRZaWdwDk="
            alt=""
          />`
        : ''
    }</span> </div>
              <p class="text-gray-500 text-sm">${video.others.views} views</p>
            </div>
          </div>
          <button  onclick="openModal('${video.video_id}')"
            class="details_button bg-gray-100 border border-gray-200 rounded w-full py-2 font-semibold mx-auto mt-8 absolute bottom-0">
            Show Details
          </button>
        </div>
      </div>
      `;
    videoContainer.append(videoCard);
  });
};
showByCategory();
fetchCategory();
fetchData();
