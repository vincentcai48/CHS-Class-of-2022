import React, { useEffect, useState } from "react"
import { TotalContext } from "../../services/context"
import { pAuth, pFirestore } from "../../services/firebaseconfig"
import Auth from "./Auth"


var isDone = false;

function ProductsEdit(){

    const [currentFundraiser,changeCurrentFundraiser] = useState(""); //document Id
    const [allProducts,changeAllProducts] = useState([]); 
    const [iname,changeIname] = useState("");
    const [idescription,changeIdescription] = useState('');
    const [iid,changeIid] = useState(Math.round(Math.random()*100000));
    const [iprice,changeIprice] = useState(0.00);
    var fundraiserMappingObj = {}; //maps ids to fundraiser names


    var getFundraisers = (name) => {
        pFirestore.collection("fundraisers").get().then((docs)=>{
            var obj = {};
            docs.forEach(doc=>{
                obj[doc.id] = doc.data().name;
            })
            fundraiserMappingObj = obj;
            isDone = true;
            pFirestore.collection("settings").doc("publicsettings").get().then((doc)=>{
                var thisId = doc.data().defaultFundraiser;
                changeCurrentFundraiser(thisId)
                getProducts(thisId)

            })
        })
    }

    var getProducts = (fundraiserDocId) =>{
        pFirestore.collection('fundraisers').doc(fundraiserDocId).collection('products').onSnapshot((products)=>{
        var arr = [];
        products.forEach(p=>{
            console.log(p.data())
            arr.push({...p.data(),docid:p.id})
        })
        changeAllProducts(arr);
        })            
    }

    var addProduct = () => {
        if(!iid) return;
        pFirestore.collection('fundraisers').doc(currentFundraiser).collection("products").doc(String(iid)).set({
            name: iname,
            id: iid,
            description: idescription,
            price: iprice,
        }).then(()=>{console.log("Success")}).catch((e)=>{console.log("ERROR!",e)})
    }

    var deleteProduct = (docid) => {
        pFirestore.collection('fundraisers').doc(currentFundraiser).collection("products").doc(docid).delete().then(()=>console.log("Delete Successful")).catch((e)=>{console.log("Error!",e)})
    }

    useEffect(getFundraisers,[]);


    return <TotalContext.Consumer>
        {value=>{
            return value.isAdmin?<div>
                <section id="add-product">
                    <h2>Add A Product</h2>
                    <input value={iname} onChange={(e)=>changeIname(e.target.value)} placeholder="Product Name"></input><br></br>
                    <input type="number" value={iid} onChange={(e)=>changeIid(e.target.value)} placeholder="Product ID"></input><br></br>
                    <p>Must be unique, or else it will override the product with the existing ID</p>
                    $<input type="number" value={iprice} onChange={(e)=>changeIprice(e.target.value)} placeholder='Price'></input><br></br>
                    <textarea value={idescription} onChange={(e)=>changeIdescription(e.target.value)} placeholder="Description of Product"></textarea>
                    <button className="nomargin bred" onClick={addProduct}>Submit</button>
                </section>
                <section id="admin-products-list">
                    {allProducts.map((e)=>{
                        return <div className="product-row labeled">
                            
                                <h5>{e.name}</h5>
                                <p className="p-price red tlight">${e.price}</p>
                                <p className="p-id tl-label">#{e.id}</p>
                            
                            <button className="tbutton h-right" onClick={()=>deleteProduct(e.docid)}><i class="fas fa-trash"></i></button>
                            <div className="break"></div>
                            <p className="p-description">{e.description}</p>
                        </div>
                    })}
                </section>
            </div>:<Auth/>
        }}
    </TotalContext.Consumer>
}

export default ProductsEdit