import React from "react"
import { Link } from "react-router-dom";
import { TotalContext } from "../services/context";
import { pFirestore } from "../services/firebaseconfig";
import Instructions from "./Instructions";

class OrderInfo extends React.Component{
    constructor(props){
        super();
        this.state = {
            orderProducts: [],
            cost: 0,
            flatFees: [],
            percentFees: [],
            percentFirst: true,
        }
    }

    componentDidMount(){
        pFirestore.collection("settings").doc("publicsettings").get().then((doc)=>{

            //get the fees
            var data = doc.data()
            console.log(data.percentFees)
            this.setState({flatFees: data.flatFees,percentFees: data.percentFees, percentFirst: data.percentFirst})


            var id = data.defaultFundraiser;
            pFirestore.collection('fundraisers').doc(id).collection('products').onSnapshot((products)=>{
            //object mapping of id to data
            var allProducts = {};
            products.forEach(p=>{
                allProducts[String(p.id)] = p.data();
            }) 
            var orderProducts = [];
            var keys = Object.keys(this.context.order);
            console.log(keys);
            keys.forEach(key=>{
                if(this.context.order[key]||this.context.order[key]>0){
                    orderProducts.push({...allProducts[key],qty: this.context.order[key]})
                }
            })
            this.setState({orderProducts: orderProducts});
            })            
        });
    }

    //returns an object {subtotal: ,total:} both these values are converted strings
    getTotalCost = () => {
        var subtotal = 0;
        this.state.orderProducts.forEach(p=>{
            subtotal += Number(p.price)*Number(p.qty);
        })
        var total = subtotal;
        console.log(this.state.percentFirst)
        if(this.state.percentFirst){
            total = this.applyPercentFees(total);
            console.log(total);
        }
        this.state.flatFees.forEach(fFee=>{
            total += Number(fFee.amount);
        })
        console.log(total);
        if(!this.state.percentFirst){
            total = this.applyPercentFees(total);
            console.log(total)
        }
        return {total: total.toFixed(2), subtotal: subtotal.toFixed(2)}
    }

    
    applyPercentFees = (amount) => {
        
        //doesn't matter the order of percent fees, will be the same. What does matter is the order of percent first or flat fee first
        if(this.state.percentFees){
            this.state.percentFees.forEach(pFee=>{
                amount *= (1+Number(pFee.amount)/100);
            })
        }
        return amount;
    }

    render(){
        var totalObj = this.getTotalCost();
        return(
            <div>
                
                <ul className="order-list">
                    <li className="order-list-button-container">
                        <h3 id="my-order-text">My Order</h3>
                        <Link to="/fundraiser" className="button change-order">Edit Order</Link>
                    </li>
                    {this.state.orderProducts.map(e=>{
                        return <div><li className="order-list-item">
                            <p className="p-id">#{e.id}</p>
                            <h5>{e.name}</h5>
                            <p className="p-unitprice">${e.price} each</p>
                            <div className="h-right">
                                <p className="p-qty">Qty: {e.qty}</p>
                                <p className="p-totalprice">${Number(e.price)*Number(e.qty)}</p>
                            </div>
                            
                        </li>
                        <hr></hr>
                        </div>
                    })}
                    {this.state.orderProducts.length<1&&<li className="no-items-text">No Items to Order</li>}
                    <li>
                        <div id="cost">
                        <div className='subtotal'>Subtotal: ${totalObj.subtotal}</div>
                        <ul id="fees">
                            {!this.state.percentFirst&&this.state.flatFees.map(f=>{
                                return <li>{f.name}: <span>${f.amount}</span></li>
                            })}
                            {this.state.percentFees.map(f=>{
                                return <li>{f.name}: <span>{f.amount}%</span></li>
                            })}
                            {this.state.percentFirst&&this.state.flatFees.map(f=>{
                                return <li>{f.name}: <span>${f.amount}</span></li>
                            })}
                        </ul>
                        <div className="total"> Total: ${totalObj.total}</div>
                        <p className="fineprint">All amounts are in USD</p>
                        </div>
                    </li>
                    <li className="order-list-button-container">
                        <button className="bred finalize-order" onClick={()=>{
                            this.props.checkoutFunction(true);
                            this.props.setTotalCost(totalObj.total);
                        }}>Finalize Order</button>
                    </li>
                    
                </ul>
            </div>
        )
    }
}
OrderInfo.contextType = TotalContext;

export default OrderInfo