import React from "react"
import { TotalContext } from "../../services/context"
import { pFirestore } from "../../services/firebaseconfig"


class OrdersList extends React.Component{
    constructor(){
        super()
        this.state = {
            orders: []
        }
    }

    componentDidMount(){
        pFirestore.collection('fundraisers').doc(this.context.fundraiser).collection('orders').orderBy("timePlaced","desc").onSnapshot(snap=>{
            var arr = []
            snap.forEach(e=>{
                console.log(e.data())
                arr.push(e.data())
            })
            this.setState({orders: arr})
        })
    }

    render(){
        return(
            <div>
                <div>
                    <ul id="orders-list">
                        {this.state.orders.map(e=>{
                            return <li key={e.email} className="single-order">
                                <div>
                                    <p className="order-time">{e.timePlaced.toDate().toString().split("GMT-")[0]}</p>
                                </div>
                                <div>
                                    <h5>{e.firstName} {e.lastName}</h5>
                                    <p>Email: {e.email}</p>
                                    {e.phone?<p>Phone: {e.phone}</p>:<p>No Phone #</p>}
                                    <p style={{fontWeight: "bolder"}}>Total: ${e.totalCost}</p>

                                </div>
                                <div>
                                    <ul>
                                        {e.stringsList&&e.stringsList.map(e=>{
                                            return <li>{e}</li>
                                        })}
                                    </ul>
                                </div>
                            </li>
                        })}
                    </ul>
                </div>
            </div>
        )
    }
}
OrdersList.contextType = TotalContext;

export default OrdersList;