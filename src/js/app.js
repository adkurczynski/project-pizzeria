import {Product} from './components/Product.js';
import {Cart} from './components/Cart.js';
import {Booking} from './components/Booking.js';
import {HomePage} from './components/Home.js';
import {select, settings, classNames} from './settings.js';


const app = {
  initMenu: function(){
    const thisApp = this;
    //console.log('thisApp.data', thisApp.data);
    console.log(thisApp.data.products);
    for(let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  initData: function(){
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;
    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  initCart: function(){
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },
  appInitPages: function(){
    const thisApp = this;
    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);

    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));

    thisApp.activatePage('home');

    let pagesMatchingHash = [];

    if(window.location.hash.length > 2){
      const idFromHash = window.location.hash.replace('#/', '');

      pagesMatchingHash = thisApp.pages.filter(function(page){
        return page.id == idFromHash;
      });
    }

    thisApp.activatePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages.id);
    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        event.preventDefault();

        const href = link.getAttribute('href');
        const pageId= href.replace('#','');
        thisApp.activatePage(pageId);
        console.log(pageId);
      });
    }

  },

  activatePage: function(pageId){
    const thisApp = this;

    for(let link of thisApp.navLinks){
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
    }
    for(let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.getAttribute('id') == pageId);
    }
    window.location.hash = '#/' + pageId;
  },
  initHome : function(){
    const thisApp = this;
    const homePageContainer = document.querySelector(select.containerOf.home);
    thisApp.homePage = new HomePage(homePageContainer);
    thisApp.homeLinks = Array.from(document.querySelectorAll('.two-image-box a'));
    console.log(thisApp.homeLinks);
    for(let link of thisApp.homeLinks){
      link.addEventListener('click', function(event){
        event.preventDefault();
        const href = link.getAttribute('href');
        const pageId = href.replace('#','');
        thisApp.activatePage(pageId);
      });

    }
  },
  initBooking : function(){
    const thisApp = this;
    const widgetContainer = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking (widgetContainer);

  },
  init: function(){
    const thisApp = this;
    console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);
    thisApp.appInitPages();
    thisApp.initHome();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();


  },
};
app.init();
