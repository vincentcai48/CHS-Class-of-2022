import React, { useContext, useState } from "react"
import { TotalContext } from "../../services/context";
import { googleAuthProvider, pAuth, pFirestore } from "../../services/firebaseconfig";
import AuthVerification from "./AuthVerification";



function Auth(){
    const [userToAdd,changeUserToAdd] = useState(null);
    const {toggleIsAdmin} = useContext(TotalContext);

    const login = () => {
        pAuth.signInWithPopup(googleAuthProvider).then((result)=>{
            
            var user = result.user;

            pFirestore.collection("users").doc(user.uid).get().then(doc=>{
                if(!doc.exists){
                    changeUserToAdd(user);
                }else{
                  
                }
            })


            // pFirestore.collection("users").doc(user.uid).set({
            //     displayName: user.displayName,
            //     email: user.email,
            //     uid: user.uid,
            //     photoURL: user.photoURL,
            //     phoneNumber: user.phoneNumber
            // })
        })
    }

    const logout = () => {
        pAuth.signOut().then(()=>console.log("success signing out!")).catch((e)=>{
            console.log("Error signing out",e);
        })
    }

    const createNewUser = (user) => {
        pFirestore.collection("users").doc(user.uid).set({
                displayName: user.displayName,
                email: user.email,
                uid: user.uid,
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber
        }).then(()=>{
            toggleIsAdmin(true);
        })
    }


    return(
        <div className="auth-container centerchild">
            <div><div className="login-container centerchild">
                <h3>Login to Administer this Site</h3>
                <button onClick={login}>Login With Google</button>
            </div>
            {userToAdd&&<AuthVerification userToAdd={userToAdd} createNewUser={createNewUser}/>}</div>
        </div>
    )
}

export default Auth;