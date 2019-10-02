import {select, templates} from '../settings.js';
import {utils} from '../utils.js';
import {AmountWidget} from './AmountWidget.js';


export class Product{
  constructor(id, data){
    const thisProduct = this;
    thisProduct.id = id;
    thisProduct.data = data;
    thisProduct.renderInMenu();
    thisProduct.getElements();
    //console.log('new product:', thisProduct);
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
  }
  renderInMenu(){
    const thisProduct = this;
    const generatedHTML = templates.menuProduct(thisProduct.data);
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    const menuContainer = document.querySelector(select.containerOf.menu);
    menuContainer.appendChild(thisProduct.element);
  }
  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }
  initAccordion(){
    const thisProduct = this;
    thisProduct.accordionTrigger.addEventListener('click',function(){
      thisProduct.element.classList.toggle('active');
      //console.log(thisProduct);
      const activeProducts = document.querySelectorAll(select.all.menuProductsActive);
      //console.log(activeProducts);
      //console.log(thisProduct.element);
      for(let activeProduct of activeProducts){
        if(activeProduct != thisProduct.element){
          //console.log(activeProduct);
          activeProduct.classList.remove('active');
        }
      }
    });
  }
  initOrderForm(){
    const thisProduct = this;
    //console.log('initOrderForm');
    thisProduct.form.addEventListener('submit',function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change',function(){
        thisProduct.processOrder();
      });
    }
    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  processOrder(){
    const thisProduct = this;
    //console.log('processOrder');
    const formData = utils.serializeFormToObject(thisProduct.form);
    //console.log('form Data:', formData);

    let price = thisProduct.data.price;
    thisProduct.params = {};
    for(let paramId in thisProduct.data.params){
      //console.log(paramId);
      const param = thisProduct.data.params[paramId];
      //console.log('param' ,param);
      for(let optionId in param.options){
        const option = param.options[optionId];
        const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
        if(optionSelected && !option.default){
          price += option.price;
        }else if (!optionSelected && option.default)  {
          price -= option.price;
        }
        const imageWrapper = thisProduct.imageWrapper;
        const searchedImages = imageWrapper.querySelectorAll('.' + paramId + '-' + optionId);
        if(optionSelected){
          if(!thisProduct.params[paramId]){
            thisProduct.params[paramId] = {
              label: param.label,
              options: {},
            };
          }
          thisProduct.params[paramId].options[optionId] = option.label;
          for(let searchedImage of searchedImages){
            //console.log(searchedImage);
            searchedImage.classList.add('active');
          }
        }else{
          for(let searchedImage of searchedImages){
            //console.log(searchedImage);
            searchedImage.classList.remove('active');
          }
        }
      }
    }
    //console.log(price);
    /* multiply price by amount */
    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
    console.log('params: ',thisProduct.params);
  }
  initAmountWidget(){
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function(){
      thisProduct.processOrder();
    });
  }
  addToCart(){
    const thisProduct = this;
    thisProduct.name = thisProduct.data.name;
    thisProduct.amount = thisProduct.amountWidget.value;
    const event = new CustomEvent('add-to-cart',{
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });
    thisProduct.element.dispatchEvent(event);
  }
}
