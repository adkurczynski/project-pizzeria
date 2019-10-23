import {templates} from '../settings.js';

export class HomePage{
  constructor(homePageWrapper){
    const thisHomePage = this;
    thisHomePage.render(homePageWrapper);
    thisHomePage.initCarousel();
  }
  render(homePageWrapper){
    const thisHomePage = this;
    const generatedHTML = templates.homePage();
    thisHomePage.dom = {};
    thisHomePage.dom.wrapper = homePageWrapper;
    thisHomePage.dom.wrapper.innerHTML = generatedHTML;
  }
  initCarousel(){
    const thisHomePage = this;
    thisHomePage.carouselTrack = document.getElementById('carousel-track');
    thisHomePage.slides = Array.from(thisHomePage.carouselTrack.children);
    thisHomePage.slideWidth = thisHomePage.slides[0].getBoundingClientRect().width;
    thisHomePage.slides[1].style.visibility = 'hidden';
    thisHomePage.slides[2].style.visibility = 'hidden';
    //console.log(slides);
    thisHomePage.currentItem = 0;
    thisHomePage.startCarouselTimeout();
    console.log(thisHomePage.carouselTrack);
  }
  carouselNext(){
    const thisHomePage = this;
    thisHomePage.currentItem ++;
    if(thisHomePage.currentItem >= 3){
      thisHomePage.currentItem = 0;
    }
    console.log(thisHomePage.currentItem);
    thisHomePage.displayCarouselItem();
  }
  displayCarouselItem(){
    const thisHomePage = this;

    thisHomePage.startCarouselTimeout();
    console.log(thisHomePage.currentItem);
    for(let slide of thisHomePage.slides){
      slide.style.visibility = 'hidden';
    }

    thisHomePage.slides[thisHomePage.currentItem].style.visibility = 'visible';
    thisHomePage.carouselTrack.style.right =  thisHomePage.currentItem  * thisHomePage.slideWidth - 300 + 'px';
    console.log(thisHomePage.carouselTrack.style);
    console.log(thisHomePage.slideWidth);

  }
  startCarouselTimeout(){
    const thisHomePage = this;
    clearTimeout(thisHomePage.interval);
    thisHomePage.interval = setTimeout(function(){
      thisHomePage.carouselNext();
    },3000);
  }
}
