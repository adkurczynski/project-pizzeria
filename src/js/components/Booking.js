import {select, templates, settings, classNames} from '../settings.js';
import {AmountWidget} from './AmountWidget.js';
import {DatePicker} from './DatePicker.js';
import {HourPicker} from './HourPicker.js';
import {utils} from '../utils.js';
export class Booking{

  constructor(bookingWrapper){
    const thisBooking = this;
    thisBooking.render(bookingWrapper);
    thisBooking.initWidgets();
    thisBooking.getData();
  }
  render(bookingWrapper){
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.dom.wrapper = bookingWrapper;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = bookingWrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = bookingWrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = bookingWrapper.querySelectorAll(select.booking.tables);
  }
  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
    for(let table of thisBooking.dom.tables){
      table.addEventListener('click',function(){
        if(!table.classList.contains(classNames.booking.tableBooked)){
          thisBooking.markTable(table);
        }else console.log('Stolik zajety!');
      });

      thisBooking.dom.wrapper.addEventListener('submit', function(event){
        event.preventDefault();
        thisBooking.getBookingData();
      });
    }
  }
  getData(){
    const thisBooking = this;

    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = thisBooking.datePicker.minDate;
    startEndDates[settings.db.dateEndParamKey] = thisBooking.datePicker.maxDate;

    const endDate= {};
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];

    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };
    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    };
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),

    ])
      .then(function([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]){
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
    console.log('getData urls', urls);
    console.log('getData params', params);
  }
  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;
    thisBooking.booked = {};
    const currentDate = utils.dateToStr(new Date());
    for(let params in eventsCurrent){
      thisBooking.makeBooked(eventsCurrent[params].date, eventsCurrent[params].hour, eventsCurrent[params].table, eventsCurrent[params].duration);
      console.log(eventsCurrent[params].hour);
    }
    for(let params in bookings){
      thisBooking.makeBooked(bookings[params].date, bookings[params].hour, bookings[params].table, bookings[params].duration);
      console.log(bookings[params].date);
      console.log(bookings[params].hour);
      console.log(bookings[params].table);
      console.log(bookings[params].duration);
    }
    for(let i=0; i<14; i++){
      for(let params in eventsRepeat){
        thisBooking.makeBooked(utils.dateToStr(utils.addDays(currentDate, i)), eventsRepeat[params].hour, eventsRepeat[params].table, eventsRepeat[params].duration);
      }

    }
    thisBooking.updateDOM();
    const bookingJSON = JSON.stringify(thisBooking.booked, null, '  ');
    console.log(bookingJSON);
  }
  makeBooked(date, hour, table, duration){
    const thisBooking = this;
    thisBooking.tables = [];
    const length = table.length;
    console.log(length);
    hour = utils.hourToNumber(hour);

    if(!thisBooking.booked[date]){
      thisBooking.booked[date] = {};
    }
    for(let i = 0; i<length; i++){
      thisBooking.tables.push(table[i]);
    }
    for(let i = 0; i < duration*2; i++){
      if(!thisBooking.booked[date][hour + i/2]){
        thisBooking.booked[date][hour + i/2] = thisBooking.tables;
      }else{
        const joinedTables = thisBooking.booked[date][hour + i/2].concat(thisBooking.tables);
        thisBooking.booked[date][hour + i/2] = joinedTables;
      }
    }
  }
  updateDOM(){
    console.log('updateDOM');
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    for(let table of thisBooking.dom.tables){
      if(thisBooking.booked[thisBooking.date] && thisBooking.booked[thisBooking.date][thisBooking.hour] && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(parseInt(table.getAttribute(settings.booking.tableIdAttribute)))){
        table.classList.add(classNames.booking.tableBooked);
      }else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  markTable(table){
    const thisBooking = this;
    table.classList.toggle(classNames.booking.tableBookedNow);
    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    if(thisBooking.date != thisBooking.datePicker.value && thisBooking.hour != utils.hourToNumber(thisBooking.hourPicker.value)){
      table.classList.remove(classNames.booking.tableBookedNow);
    }
  }
  getBookingData(){
    const thisBooking = this;
    const tab = [];
    thisBooking.bookload = {};
    thisBooking.bookload.date = thisBooking.date;
    thisBooking.bookload.hour = utils.numberToHour(thisBooking.hour);
    for(let table of thisBooking.dom.tables){
      if(table.classList.contains(classNames.booking.tableBookedNow)){
        tab.push(parseInt(table.getAttribute(settings.booking.tableIdAttribute)));
      }
    }
    thisBooking.bookload.table = tab;
    thisBooking.bookload.repeat = 'false';
    thisBooking.bookload.duration = thisBooking.hoursAmount.value;
    thisBooking.bookload.ppl = thisBooking.peopleAmount.value;
    thisBooking.bookload.starters = ['bread', 'lemonwater'];
    thisBooking.sendBooking();

  }
  sendBooking(){
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    const bookload =  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(thisBooking.bookload),
    };
    console.log(JSON.stringify(thisBooking.bookload));
    fetch(url, bookload)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });

  }
}
