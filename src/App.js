import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom"
import { pAuth, pFirestore } from "./services/firebaseconfig";
import Header from "./components/Header";
import Home from "./components/Home";
import {TotalContext} from "./services/context"
import AdminDashboard from "./components/AdminComponents/AdminDashboard";
import ProductsList from "./components/ProductsList";
import OrderInfo from "./components/OrderInfo";
import Order from "./components/Order";
import Footer from "./components/Footer";
import Instructions from "./components/Instructions";


function App() {
  const [order,changeOrder] = useState({});
  const [isAdmin,toggleIsAdmin] = useState(false);
  const [orderNum,changeOrderNum] = useState(0);
  const [fundraiser,changeFundraiser] = useState();
  const [products,changeProducts] = useState({})
  const [fSettings,changeFSettings] = useState({});
  
pAuth.onAuthStateChanged(user=>{
  if(user){
    pFirestore.collection("users").doc(pAuth.currentUser.uid).get().then((doc)=>{
      if(doc.exists){
        console.log("true")
        toggleIsAdmin(true);
      }else{
        toggleIsAdmin(false);
      }
    })
  }else{
    toggleIsAdmin(false);
  }
})

useEffect(()=>{
  pFirestore.collection("settings").doc('publicsettings').get().then((doc)=>{
    changeFundraiser(doc.data().defaultFundraiser);
    pFirestore.collection('fundraisers').doc(doc.data().defaultFundraiser).collection('products').get().then((docs)=>{
      var arr = [];
      var startingOrder = {};
      docs.forEach((d)=>{
        arr.push({...d.data()})
        startingOrder[d.id] = 0;
      })
      changeOrder(startingOrder);
      changeProducts(arr);
    })
    pFirestore.collection('fundraisers').doc(doc.data().defaultFundraiser).get().then((doc)=>{
      changeFSettings(doc.data());
    })
  })
},[])


  return (
    <TotalContext.Provider value={{
      order: order,
      changeOrder: changeOrder,
      isAdmin: isAdmin,
      toggleIsAdmin: toggleIsAdmin,
      orderNum: orderNum,
      changeOrderNum: changeOrderNum,
      fundraiser: fundraiser,
      changeFundraiser: changeFundraiser,
      products: products,
      changeProducts: changeProducts,
      fSettings: fSettings,
      changeFSettings: changeFSettings,
    }}>
      <div className="App">
      <Router>
        <Header/>
        {orderNum>0&&<Instructions/>}
        <Switch>
          <Route path="/" exact>
            <Home/>
          </Route>
          <Route path="/admin">
            <AdminDashboard/>
          </Route>
          <Route path="/fundraiser">
            <ProductsList/>
          </Route>
          <Route path="/orderinfo">
            <Order/>
          </Route>
        </Switch>
        <Footer/>
      </Router>
      
      </div>
    </TotalContext.Provider>
  );
}

export default App;
