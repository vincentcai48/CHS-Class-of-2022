import React from "react"
import { TotalContext } from "../../services/context"
import { pAuth } from "../../services/firebaseconfig"
import Auth from "./Auth"
import FundraiserSettings from "./FundraiserSettings"
import OrdersList from "./OrdersList"
import ProductsEdit from "./ProductsEdit"

class AdminDashboard extends React.Component{
    constructor(){
        super()
        this.state = {
            tab: "products",
        }
    }

    logout = () =>{
        pAuth.signOut().catch((e)=> console.log("Error signing out",e))
    }

    changeTab = (e) => {
        const {name} = e.target
        this.setState({tab: name})
    }
    

    render(){
        return(<div>
            {this.context.isAdmin?<div>
                <div>
                    <button onClick={this.changeTab} name="products" className={this.state.tab=="products"?"selected admin-tab":"admin-tab"}>Products</button>
                    <button onClick={this.changeTab} name="orders" className={this.state.tab=="orders"?"selected admin-tab":"admin-tab"}>Orders</button>
                    <button onClick={this.changeTab} name="fundraiserSettings" className={this.state.tab=="fundraiserSettings"?"selected admin-tab":"admin-tab"}>Fundraiser Settings</button>
                    <button onClick={this.logout}>Logout</button>
                </div>
                <section id="admin-main">
                    {this.state.tab=='products'&&<ProductsEdit/>}
                    {this.state.tab=='orders'&&<OrdersList/>}
                    {this.state.tab=='fundraiserSettings'&&<FundraiserSettings/>}
                </section>
            </div>:<Auth/>}
        </div>)
    }
}
AdminDashboard.contextType = TotalContext;

export default AdminDashboard;