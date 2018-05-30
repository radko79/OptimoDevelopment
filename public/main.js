$(document).ready(function() {

  var cities = ['Lodz', 'Warsaw', 'Berlin', 'New York', 'London'];
  var randomCities = [];
  var insert_data = $('#items');
  
  // shuffle cities every request
  function shuffle(array) {
    randomCities = [];
    var randomIndex = 0;
    var currentIndex = 5;
    city = '';

    while (randomCities.length < 3) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      city = array[randomIndex];
      if (randomCities.indexOf(city) < 0) randomCities.push(array[randomIndex]);
    }
    return randomCities;
  }

  //acquire data from Yahoo API
  function getWeatherDemo() {
    insert_data.empty();
    for ( var i = 0 ; i < randomCities.length ; i++ ) {
      $.ajax({
        url: `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="${randomCities[i]}") and u='c'&format=json`,
        method: 'get',
        success: showResults
      });
    }
  };
      
  function showResults(data) {
    var shortcut = data.query.results.channel;
    var cityName = shortcut.location.city;
    var temperature = shortcut.item.condition.temp;
    var unitOfMeasurement = shortcut.units.temperature;
    var description = shortcut.item.condition.text;
    var condition = shortcut.item.condition;
    var yahooLink = shortcut.link;
    var linkToYahoo = yahooLink.substr(yahooLink.indexOf('*') + 1);

    var a_link = $('<a>').attr('class', 'mainLink').attr('href', linkToYahoo).attr('target', '_blank');
    var weatherIcon_div = $('<div>').attr('class', 'icon');
    var infotainment_div = $('<div>').attr('class', 'info');
    var cityName_div = $('<div>').attr('class', 'cityName');
    var temp_div = $('<div>').attr('class', 'temperature');
    var desc_div = $('<div>').attr('class', 'description');
    var infobox_div = $('<div>').attr('class', 'infobox');
    var iconsData = icons;
    
    var result_icon = iconsData['codes'].filter(function(item){
      return item.number == condition.code;
    });
    var icon_i = $('<i>').attr('class', `wi ${result_icon[0].class}`);
    
    // add weather icon
    a_link.append(weatherIcon_div);
    weatherIcon_div.append(icon_i)
    // add all other data, like:
    a_link.append(infotainment_div);
    // city name
    infotainment_div.append(cityName_div);
    cityName_div.append(cityName);
    // temperature
    infotainment_div.append(temp_div);
    temp_div.append(temperature + `&deg;`);
    temp_div.append(unitOfMeasurement);
    // description
    infotainment_div.append(desc_div);
    desc_div.append(description);
    // put everything together
    a_link.appendTo(infobox_div);
    infobox_div.appendTo(insert_data);
    // better look
    infobox_div.hide();
    infobox_div.fadeIn('fast');

    console.log(`The temperature in ${cityName} is ${temperature} ${unitOfMeasurement}`);
  }

  insert_data.empty();
  shuffle(cities);
  console.log(randomCities);
  getWeatherDemo();
  // load new data every 60 seconds
  var mainInterval = setInterval(function() {
    shuffle(cities);
  }, 60000);
  // refresh data every 10 seconds
  var refreshInterval = setInterval(function() {
    getWeatherDemo();
  }, 10000);


});
