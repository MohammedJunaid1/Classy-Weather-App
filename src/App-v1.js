import React from 'react'

function getWeatherIcon(wmoCode) {
  const icons = new Map([
    [[0], "☀️"],
    [[1], "🌤"],
    [[2], "⛅️"],
    [[3], "☁️"],
    [[45, 48], "🌫"],
    [[51, 56, 61, 66, 80], "🌦"],
    [[53, 55, 63, 65, 57, 67, 81, 82], "🌧"],
    [[71, 73, 75, 77, 85, 86], "🌨"],
    [[95], "🌩"],
    [[96, 99], "⛈"],
  ]);
  const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
  if (!arr) return "NOT FOUND";
  return icons.get(arr);
}

function convertToFlag(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function formatDay(dateStr) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
  }).format(new Date(dateStr));
}

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {search:'',isLoading:false, displayLocation:'', weather:{}}
    this.handleInput = this.handleInput.bind(this)
    this.fetchWeather = this.fetchWeather.bind(this)
  }
  handleInput(e){
    this.setState(
      {search:e.target.value}
    )
    // console.log(e.target.value)
  }
  async fetchWeather(){
    try {
      this.setState({isLoading:true})
      // 1) Getting location (geocoding)
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${this.state.search}`
      );
      const geoData = await geoRes.json();
      console.log(geoData);
  
      if (!geoData.results) throw new Error("Location not found");
  
      const { latitude, longitude, timezone, name, country_code } =
        geoData.results.at(0);
      this.setState({displayLocation:`${name} ${convertToFlag(country_code)}`})
  
      // 2) Getting actual weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
      );
      const weatherData = await weatherRes.json();
     this.setState({weather:weatherData.daily});
     console.log(this.state.weather)
    } catch (err) {
      console.error(err);
    }finally{
      this.setState({isLoading:false})
    }
  }

  render(){


    return <div className='app'>
      <h1>Classy Weather</h1>
      <div >
    <input type='text' placeholder='Search for loacation' value={this.state.search} onChange={this.handleInput} />
      </div>
      <button onClick={this.fetchWeather}>Get weather</button>
{this.state.isLoading && <p>Loading...</p>}
{this.state.weather.weathercode && <Weather weather={this.state.weather} loaction={this.state.displayLocation} />
      }    </div>
  }
}

export default App 

class Weather extends React.Component{
  render(){
    const {temperature_2m_max:max, temperature_2m_min:min, time:dates, weathercode:code} = this.props.weather
  
    return <div>
      <h2>Weather {this.props.loaction}</h2>
      <ul className='weather'>
   {dates.map((date,i)=> <Day 
   date={date}
   max={max[i]}
   min={min[i]}
   code={code?.[i]}
   isToday={i===0}
 key = {date}

   />)}
      </ul>
    </div>
  }
}

class Day extends React.Component{

  render(){
    const {date,max,min,code,isToday} = this.props
    return <li className='day'> 
    <span>{getWeatherIcon(code)}</span>
      <p>{isToday?"Today":formatDay(date)}</p>
      <p>{Math.floor(max)}&deg; &mdash; <strong>{Math.ceil(min)}&deg;</strong></p>
       </li>
  }
}

// import React from 'react'

// class App extends React.Component{
//   constructor(props){
//     super(props)
//     this.state = {counter:0}
//     this.handleIncrement = this.handleIncrement.bind(this)
//     this.handleDecrement = this.handleDecrement.bind(this)
//      }
     
//      handleDecrement(){
//      this.setState(currState=> { 
//      return {counter:currState.counter-1}})
//      }
//      handleIncrement(){
//      this.setState(currState=> { 
//      return {counter:currState.counter+1}})
//      }

//   render(){
// const date = new Date()
// date.setDate(date.getDate() + this.state.count)

//    return  <div>

//     <button onClick={this.handleDecrement}>-</button>
//     <span>{date.toDateString()}||{this.state.counter}</span>
//     <button onClick={this.handleIncrement}>+</button>
//    </div>
//   }
// }

// export default App



// import React from 'react'

// class App extends React.Component{
//   constructor(props){
//     super(props)
//     this.state = {counter:0}
//     this.handleIncrement = this.handleIncrement.bind(this)
//     this.handleDecrement = this.handleDecrement.bind(this)
//      }
     
//      handleDecrement(){
//      this.setState(currState=> { 
//      return {counter:currState.counter-1}})
//      }
//      handleIncrement(){
//      this.setState(currState=> { 
//      return {counter:currState.counter+1}})
//      }

//   render(){
// const date = new Date()
// date.setDate(date.getDate() + this.state.count)

//    return  <div>

//     <button onClick={this.handleDecrement}>-</button>
//     <span>{date.toDateString()}||{this.state.counter}</span>
//     <button onClick={this.handleIncrement}>+</button>
//    </div>
//   }
// }

// export default App