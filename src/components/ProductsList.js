import React, { useContext, useEffect, useState } from "react"
import { TotalContext } from "../services/context";
import { pFirestore } from "../services/firebaseconfig";
import Instructions from "./Instructions";


class ProductsList extends React.Component{

    constructor(){
        super();
        this.state = {
            products: [],
            currentOrder: {},
        }
    }

    componentDidMount(){
        pFirestore.collection("settings").doc("publicsettings").get().then((doc)=>{
            var id = doc.data().defaultFundraiser;
            pFirestore.collection('fundraisers').doc(id).collection('products').onSnapshot((products)=>{
            var arr = [];
            products.forEach(p=>{
                console.log(p.data())
                arr.push({...p.data(),docid:p.id})
            }) 
            this.setState({products: arr});
            })            
        });
    }

    //change both the state and the context so it can rerender.
    updateOrder = (newOrder) => {
        var keys = Object.keys(newOrder);
        var total = 0;
        keys.forEach(key=>{
            total += newOrder[key];
        })
        this.context.changeOrderNum(total);
        this.context.changeOrder(newOrder)
        this.setState({currentOrder: newOrder})
        
    }

    addToOrder = (productId) => {
        productId = String(productId)
        var newOrder = this.context.order;
        var baseAmount = this.context.order[productId] || 0;
        newOrder[productId] =baseAmount + 1;
        this.updateOrder(newOrder)
    }

    removeFromOrder = (productId)=>{
        productId = String(productId)
        var newOrder = this.context.order;
        newOrder[productId] = 0;
        this.updateOrder(newOrder)
    }

    changeOrderManually = (e) => {
        var newOrder = this.context.order;
        newOrder[e.target.name] = Number(e.target.value)&&Number(e.target.value)>-1?Number(e.target.value):0;
        this.updateOrder(newOrder);
        console.log(this.context.order);
    }
 
    render(){
        console.log(this.context.order)
        return(<div>
            
            <div id="f-title-description">
                <h2>{this.context.fSettings.name}</h2>
                <p>{this.context.fSettings.description}</p>
            </div>
            <section id="admin-products-list">
                {this.state.products.map((e)=>{
                    var className1 = "product-row labeled";
                    className1 += this.context.order[String(e.id)]?" in-order":"";
                    console.log(className1)
                    return <div className={className1}>
                        <h5>{e.name}</h5>
                       
                        <p className="p-price red tlight">${e.price}</p>
                        <p className="p-id tl-label">#{e.id}</p>
                        <div className="h-right">
                            <TotalContext.Consumer>
                                {value=>{
                                    return value.order[String(e.id)]&&Number(value.order[String(e.id)])>0?<button className="bred" onClick={()=>this.removeFromOrder(e.id)}>Remove from Order</button>:<button className="bred"onClick={()=>this.addToOrder(e.id)}>Add to Order</button>
                                }}
                            </TotalContext.Consumer>
                            Qty:<input type="number" className="qty-input" onChange={this.changeOrderManually} name={String(e.id)} value={this.context.order[String(e.id)]}></input>
                        </div>
                        <div className="break"></div>
                        <p className="p-description">{e.description}</p>
                    </div>
                })}
            </section>
        </div>)
    }
   
}
ProductsList.contextType = TotalContext;


export default ProductsList