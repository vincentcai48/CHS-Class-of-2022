import React, { useState } from "react"
import Checkout from "./Checkout";
import OrderComplete from "./OrderComplete";
import OrderInfo from "./OrderInfo";

function Order(){
    const [isCheckout, toggleIsCheckout] = useState(false);
    const [isComplete, toggleIsComplete] = useState(false)
    const [totalCost, changeTotalCost] = useState(0);

    return(
        <div>
           {isCheckout
            ?
            (isComplete?<OrderComplete/>:<Checkout backFunction={toggleIsCheckout} totalCost={totalCost} completeFunction={toggleIsComplete}/>):(
           <OrderInfo checkoutFunction={toggleIsCheckout} setTotalCost={changeTotalCost}/>
           )}
        </div>
    )
}

export default Order;