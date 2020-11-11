import React, { useState } from "react"
import { pFirestore } from "../../services/firebaseconfig";

function AuthVerification(props){
    const [inputText,changeInputText] = useState("");
    const [showError,toggleShowError] = useState(false);


    const verifyPasscode = (passcodeTry) => {
        pFirestore.collection("settings").doc("passcode").update({passcode: passcodeTry}).then((doc)=>{
            props.createNewUser(props.userToAdd);
            toggleShowError(false);
        }).catch(e=>{
            toggleShowError(true);
        })
    } 


    return(<div>
        <hr></hr>
        <br></br>
        <input value={inputText} onChange={(e)=>{changeInputText(e.target.value); toggleShowError(false);}} placeholder="Admin Passcode"></input>
        <div>{showError&&"Incorect Passcode"}</div>
        <br></br>
        <button onClick={()=>verifyPasscode(inputText)} className="nomargin">Submit</button>
    </div>)
}

export default AuthVerification;