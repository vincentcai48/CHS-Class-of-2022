import React from "react"
import { Link } from "react-router-dom"
import jslide1 from "../images/jslide1.webp"
import jslide2 from "../images/jslide2.webp"
import jslide3 from "../images/jslide3.webp"

function Home(){
    return(<div>
        <div className="home-primary">
            <div className="largeleft centerchild">
                <div className="j-slide labeled" id="j-slide1">
                    <img src={jslide1}></img>
                    <div className="j-slide-description red tdark br-label">
                        <h5>Tangy and Tasty Rubs</h5>
                        <p>$5.99 - $7.99</p>
                    </div>
                </div>
                <div className="j-slide labeled" id="j-slide2">
                    <img src={jslide2}></img>
                    <div className="j-slide-description red tdark br-label">
                        <h5>Savory Herbs</h5>
                        <p>$5.99 - $7.99</p>
                    </div>
                </div>
                <div className="j-slide labeled" id="j-slide3">
                    <img src={jslide3}></img>
                    <div className="j-slide-description red tdark br-label">
                        <h5>Sprinkles, Salt and More!!</h5>
                        <p>$5.99 - $7.99</p>
                    </div>
                </div>
            </div>
            <div className="smallright centerchild">
                <div >
                <h2>Buy Our Spices</h2>
                <p>Support the fundraiser</p>
                <Link to="/fundraiser" className="button bred nomargin lbutton">Buy Now</Link></div>
            </div>
        </div>
    </div>)
}

export default Home