

import {select, settings} from '../settings.js';
import {BaseWidget} from './BaseWidget.js';
import {utils} from '../utils.js';
import rangeSlider from '../../vendor/range-slider.js';

export class HourPicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, settings.hours.open);
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.input);
    thisWidget.dom.output = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisWidget.value = thisWidget.dom.input.value;
    console.log(thisWidget.dom.output);
    thisWidget.initPlugin();
  }
  initPlugin(){
    const thisWidget = this;
    rangeSlider.create(thisWidget.dom.input);
    thisWidget.dom.input.addEventListener('input', function(){
      thisWidget.value = thisWidget.dom.input.value;
    });
  }
  parseValue(value){
    const parsedValue = utils.numberToHour(value);
    console.log(parsedValue);
    return parsedValue;
  }
  isValid(){
    return true;
  }
  renderValue(){
    const thisWidget = this;
    thisWidget.dom.output.innerHTML = thisWidget.value;
  }
}
