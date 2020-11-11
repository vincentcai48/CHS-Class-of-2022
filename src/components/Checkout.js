import React from "react"
import { TotalContext } from "../services/context";
import { fbFieldValue, pFirestore } from "../services/firebaseconfig";

class Checkout extends React.Component{
    constructor(props){
        super();
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            confirmEmail: '',
            phone: '',
            errorMessage: '',
            procedure: '',
            procedureAccepted: false,
            amountOK: false,
            productMapping: {}, //map the id to the doc data
            showPopup: false,
        }
    }

    componentDidMount(){
        pFirestore.collection("settings").doc("publicsettings").get().then((doc)=>{
            var data = doc.data()
            var id = data.defaultFundraiser;
            pFirestore.collection('fundraisers').doc(id).get().then((d)=>{
                this.setState({procedure: d.data().procedure})
            })
            pFirestore.collection('fundraisers').doc(id).collection("products").onSnapshot((snap)=>{
                var obj = {};
                snap.forEach(d=>{
                    obj[d.id] = d.data();
                })
                this.setState({productMapping: obj})
            })
        });
    }

    changeState = (e) =>{
        const {name,value} = e.target;
        this.setState({[name]: value, errorMessage: ''})
    }

    changeCheckboxState = (e) => {
        const {name,checked} = e.target;
        this.setState({[name]: checked, errorMessage: ''})
    
    }

    submit = () => {
        if(!this.validateEmail(this.state.email)) return this.setState({errorMessage: "Please Enter a Valid Email"})
        if(this.state.email !== this.state.confirmEmail) return this.setState({errorMessage: "Emails Do Not Match"})
        if(!this.state.firstName || !this.state.lastName) return this.setState({errorMessage: "Please Fill Out All Required Fields"})
        if(!this.state.procedureAccepted) return this.setState({errorMessage: "Please check that you have read the procedure and the terms and conditions"})
        if(!this.state.amountOK) return this.setState({errorMessage: "Please Accept the Payment Amount"})
        
        //If no errors, then start filling out the order object
        var orderObject = {};
        orderObject.firstName = this.state.firstName;
        orderObject.lastName = this.state.lastName;
        orderObject.email = this.state.email;
        orderObject.phone = this.state.phone;
        
        var keys = Object.keys(this.context.order);
        var itemsList = [];
        var stringsList = [];
        keys.forEach(k=>{
            if(!Number(this.context.order[k])<1){
                itemsList.push({
                    id: Number(k),
                    name: this.state.productMapping[k].name,
                    qty: this.context.order[k],
                    price: Number(this.context.order[k])*(this.state.productMapping[k].price), 
                })
                stringsList.push(this.state.productMapping[k].name + " Qty: "+this.context.order[k]+" -  $"+Number(this.context.order[k])*(this.state.productMapping[k].price))
            }
        })
        orderObject.itemsList = itemsList;
        orderObject.stringsList = stringsList;
        orderObject.totalCost = this.props.totalCost;
        orderObject.timePlaced = fbFieldValue.serverTimestamp();

        pFirestore.collection('fundraisers').doc(this.context.fundraiser).collection("orders").doc(this.state.email).get().then((doc)=>{
            if(doc.exists){
                this.setState({showPopup: true});
            }else{
                pFirestore.collection('fundraisers').doc(this.context.fundraiser).collection("orders").doc(this.state.email).set(orderObject).then(()=>{
                    this.context.changeOrder({})
                    this.context.changeOrderNum(0);
                    this.props.completeFunction(true);
                    
                })
            }
        })
    }

    validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }


    render(){
        return(<div id="checkout-container">
            <button onClick={()=>this.props.backFunction(false)}>{"<<< "}Back to Order</button>
            <h3 id="place-order-text">Place An Order</h3>
            <div id="procedure">
                <h3>Procedure</h3>
                <div>{this.state.procedure}</div>
                <div className="checkbox-div">
                    <input type='checkbox' onChange={this.changeCheckboxState} name="procedureAccepted" value={this.state.procedureAccepted}></input>I have read and accepted the procedure for this fundraiser
                </div>
            </div>
            <div className="checkout-form">
                <h3>Information</h3>
                <input placeholder="First Name" name="firstName" onChange={this.changeState} required></input>
                <input placeholder="Last Name" name="lastName" onChange={this.changeState}  required></input>
                <input placeholder="Email Address" name="email" type="email" onChange={this.changeState} required></input>
                <input placeholder="Confirm Email Address" name="confirmEmail" type="email" onChange={this.changeState} required></input>
                <input placeholder="Phone Number (Optional)" onChange={this.changeState} name="phone"></input>
                <div className="checkbox-div">
                    <input type="checkbox" onChange={this.changeCheckboxState} value={this.state.amountOK} name="amountOK"></input>Amount ${this.props.totalCost} OK? Pay with cash or check at pickup</div>
                <div className="error-message">{this.state.errorMessage}</div>
                <button className="bred" id="place-order" onClick={this.submit}>Place Order</button>
            </div>
            {this.state.showPopup&&<div style={{position: "relative"}}>
                <div className="gob">
                    <div className="popup">
                        <h3>Limit of one order per person</h3>
                        <p>There has already been an order placed with this email address.</p>
                        <button className="bred nomargin" onClick={()=>this.setState({showPopup: false, email: "", confirmEmail: ''})}>OK</button>
                    </div>
                </div>
            </div>}
        </div>)
    }
}
Checkout.contextType = TotalContext;

export default Checkout;