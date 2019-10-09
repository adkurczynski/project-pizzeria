import {select, settings} from '../settings.js';
import {BaseWidget} from './BaseWidget.js';

export class AmountWidget extends BaseWidget{
  constructor(wrapper){
    super(wrapper, settings.amountWidget.defaultValue);
    const thisWidget = this;
    thisWidget.getElements();
    thisWidget.initActions();
    thisWidget.value =  thisWidget.dom.input.value;
    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments', element);
  }
  getElements(){
    const thisWidget = this;

    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }


  initActions(){
    const thisWidget = this;
    thisWidget.dom.input.addEventListener('change',function(){
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkDecrease.addEventListener('click', function(event){
      event.preventDefault();
      thisWidget.dom.input.value --;
      thisWidget.value = thisWidget.dom.input.value;
    });

    thisWidget.dom.linkIncrease.addEventListener('click',function(event){
      event.preventDefault();
      thisWidget.dom.input.value ++;
      thisWidget.value = thisWidget.dom.input.value;
    });
  }
  isValid(newValue){
    return !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax;
  }
}
