import React, { useContext, useEffect, useState } from "react"
import { googleAuthProvider, pAuth, pFirestore } from "../services/firebaseconfig";
import chsseal from "../images/chsseal.jpg"
import { Link } from "react-router-dom";
import { TotalContext } from "../services/context";



function Header(){
    const {orderNum} = useContext(TotalContext);
    const [stateOrderNum,changeStateOrderNum] = useState(orderNum);
    // const [totalNum,changeTotalNum] = useState(0);


    // var itemsInOrder = () => {
    //     console.log(order);
    //     var keys = order.keys();
    //     console.log(keys)
    //     var total = 0;
    //     keys.forEach((key)=>{
    //         total+= order[key];
    //     })
    //     changeTotalNum(total)
    // }

    useEffect(()=>{
        changeStateOrderNum(orderNum)
    },[orderNum])



    return(<header className="header">
        <Link to="/" className="h-left" id="header-title">
            <img src={chsseal} className="h-icon"/>
            <h1 className="h-title">Class of 2022</h1>
        </Link>
        <div className="h-right">
            <Link to="/fundraiser" className='button bred h-item'>Buy Spices</Link>
            <Link to="/orderinfo" id="myorder" className="h-item tbutton"><i class="fas fa-shopping-cart"></i>My Order{stateOrderNum>0&&<span className="centerchild">{stateOrderNum}</span>}</Link>   
            <TotalContext.Consumer>
                {value=>{
                    return value.isAdmin?<Link to="/admin" className="h-item tbutton admin-button"><div>Admin</div><p>({pAuth.currentUser.displayName})</p></Link>:<div></div>
                    console.log(value);
                    console.log(value.isAdmin)
                    if(value.idAdmin){
                        console.log("hello")
                        return <div className="h-item">{pAuth.currentUser.displayName}</div>
                    }else{
                        console.log(value.isAdmin)
                        return <div></div>
                    }
                }}
            </TotalContext.Consumer>
            
        </div>
        
    </header>)
}

export default Header;

/***
 *  <Link to="/info" className="tbutton h-item">Information</Link>
    <Link to="/contact" className="tbutton h-item">Contact</Link> 
*/