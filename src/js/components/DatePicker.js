import {select} from '../settings.js';
import {BaseWidget} from './BaseWidget.js';
import {utils} from '../utils.js';



export class DatePicker extends BaseWidget{
  constructor(wrapper){
    super(wrapper, utils.dateToStr(new Date()));
    const thisWidget = this;
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.input);
    thisWidget.value = utils.dateToStr(new Date());
    thisWidget.initPlugin();

  }
  initPlugin(){
    const thisWidget = this;
    thisWidget.minDate = utils.dateToStr(new Date(thisWidget.value));
    thisWidget.maxDate = utils.dateToStr(new Date(utils.addDays(thisWidget.minDate, 14)));
    console.log(thisWidget.maxDate);
    flatpickr(thisWidget.dom.input,{
      dateFormat: 'Y-m-d',
      altInput: true,
      defaultDate: thisWidget.minDate,
      minDate: thisWidget.minDate,
      maxDate: thisWidget.maxDate,
      'disable': [
        function(date){
          return (date.getDay()===1);
        }
      ],
      'locale': {
        'firstDayOfWeek': 2
      },
      onChange: function(dateStr){
        thisWidget.value = dateStr;
      }
    });
    console.log(thisWidget.value);
  }
  parseValue(arg){
    return arg;
  }
  isValid(){
    return true;
  }
  renderValue(){
    return true;
  }
}
