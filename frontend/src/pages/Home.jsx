import React, { useEffect } from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import Banner from '../components/Banner'
import Marquee from '../components/MarqueeContainer'
import Marquee2 from '../components/Marquee2Container'
import MarqueeScroll from '../components/MarqueeScroll'



const Home = () => {

  return (
    <div>
      <Header/>
      <SpecialityMenu />
      <MarqueeScroll />
      <div className="md:sticky top-[-100vh] lg:top-[-28px] z-10">
        <Marquee />  
      </div>
        <div className="h-screen mt-[-2vh] lg:mt-[-350px] z-20"></div> 
        <Marquee2 /> 
      <Banner />
    </div>
  )
}

export default Home