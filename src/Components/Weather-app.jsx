import sunny from "../assets/images/sun-messenger.webp"
import cloudy from "../assets/images/cloud_2601-fe0f.webp"
import rainy from "../assets/images/cloud-with-rain.webp"
import snowy from "../assets/images/cloud-with-snow_1f328-fe0f.webp"
import loadingImage from "../assets/images/360_F_1177857682_IgmLnlyphmf1XXgEFGArEYSSeOrdYktk.webp"
import { useState,useEffect,useRef } from "react"



const WeatherApp = () => {
  const[data,SetData]=useState()
  const[location,SetLocation]=useState('')
  const[isLoading,setIsLoading]=useState(true)
  const requestId=useRef(0)
  const api_key="6f1f429f8dcb14b49709542025dca264"

  useEffect(()=>{
  const requests=requestId
  const currentRequest=++requests.current
  const fetchDefaultWeather=async()=>{
    const DefaultLocation="Tbilisi"
    const url=`
    
    https://api.openweathermap.org/data/2.5/weather?q=${DefaultLocation}&units=Metric&appid=${api_key}`
    try {
      const res=await fetch(url)
      if (!res.ok) throw new Error(`Weather request failed: ${res.status}`)
      const defaultData=await res.json()
      if (currentRequest === requests.current) SetData(defaultData)
    } catch (error) {
      if (currentRequest === requests.current) {
        console.error("Could not load weather:", error)
        SetData({requestError:true})
      }
    } finally {
      if (currentRequest === requests.current) setIsLoading(false)
    }
  }

  fetchDefaultWeather()
  return ()=>{ requests.current++ }
},[])

  const handleInputChange=(e)=>{
    SetLocation(e.target.value)
    
  }

  const search=async()=>{
    if(location.trim() !==""){
  const currentRequest=++requestId.current
  setIsLoading(true)
  const url=`
    https://api.openweathermap.org/data/2.5/weather?q=${location}&units=Metric&appid=${api_key}`
  try {
    const res= await fetch(url)
    if (res.status === 404) {
      if (currentRequest === requestId.current) SetData({notFound:true})
    } else {
      if (!res.ok) throw new Error(`Weather request failed: ${res.status}`)
      const searchData=await res.json()
      if (currentRequest === requestId.current) {
        SetData(searchData)
        SetLocation('')
      }
    }
  } catch (error) {
    if (currentRequest === requestId.current) {
      console.error("Could not search weather:", error)
      SetData({requestError:true})
    }
  } finally {
    if (currentRequest === requestId.current) setIsLoading(false)
  }
    } 
  }

  const HandleKeyDown=(e)=>{
    if(e.key=='Enter')
      search()
  }

  const weatherImages ={
    Clear:sunny,
    Clouds:cloudy,
    Rain:rainy,
    Snow:snowy,
    Haze:cloudy,
    Mist:cloudy,
  }

  const WeatherImage=data?.weather ? weatherImages[data.weather[0].main]:null

  const backgroundImages={
    Clear: 'linear-gradient(to right,#f3b07c,#fcd283)',
    Clouds: 'linear-gradient(to right,#57d6d4,#71eeec)',
    Rain: 'linear-gradient(to right,#5bc8fb,#80eaff)',
    Snow:'linear-gradient(to right,#aff2ff,#80eaff)',
    Haze: 'linear-gradient(to right,#57d6d4,#71eeec)',
    Mist: 'linear-gradient(to right,#57d6d4,#71eeec)',
  }

  const backgroundImage=data?.weather ? backgroundImages[data.weather[0].main]:'linear-gradient(to right,#f3b07c,#fcd283)'
  
  const currentDate=new Date()

  const daysOfWeek=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

  const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

const dayofWeek=daysOfWeek[currentDate.getDay()]
const month=months[currentDate.getMonth()]
const dayOfMonth=currentDate.getDate()

const formattedDate=`${dayofWeek},${month},${dayOfMonth}`

  return (
    <div className="container" style={{backgroundImage}}>
      <div className="weather-app" style={{backgroundImage:backgroundImage && backgroundImage.replace?backgroundImage.replace("to right","to top"):null}}>
        <div className="search">
          <div className="search-top">
            <i className="fa-solid fa-location-dot">
            </i>
            <div className="location">{data?.name}</div>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Enter Location"
              value={location}
              onChange={handleInputChange}
              onKeyDown={HandleKeyDown}
            />
            <i className="fa-solid fa-magnifying-glass" onClick={search}></i>
          </div>
        </div>
        {isLoading?(<img className="loader" src={loadingImage} alt="Loading" />): data?.requestError ? (<div className="not-found" role="alert">Could not load weather. Please try again.</div>): data?.notFound ? (<div className="not-found"> Not Found🥲</div>):(
          <>
          <div className="weather">
            <img src={WeatherImage} alt={data?.weather?.[0]?.main ?? "Weather"} />
            <div className="weather-type">{data?.weather? data.weather[0].main :null}</div>
            <div className="temp">{data?.main ? `${Math.floor(data.main.temp)}C` : null}</div>
        </div>
        <div className="weather-date">
          <p>{formattedDate}</p>
        </div>
        <div className="weather-data">
          <div className="humidity">
            <div className="data-name">Humidity</div>
            <i className="fa-solid fa-droplet"></i>
            <div className="data">{data?.main ? data.main.humidity:null }</div>
          </div>
          <div className="wind">
            <div className="data-name">Wind</div>
            <i className="fa-solid fa-wind"></i>
            <div className="data">{data?.wind ? data.wind.speed:null}</div>
          </div>
        </div>
          </>
        )}
        
      </div>
    </div>
  )
}

export default WeatherApp