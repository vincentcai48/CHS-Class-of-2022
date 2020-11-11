import React from "react"
import { TotalContext } from "../../services/context";
import { pFirestore } from "../../services/firebaseconfig";

class FundraiserSettings extends React.Component{
    constructor(){
        super();
        this.state = {
            description: '',
            instructions: '',
            procedure: '',
            message: "",
        }
    }

    componentDidMount(){
        pFirestore.collection('fundraisers').doc(this.context.fundraiser).onSnapshot(snap=>{
            var data = snap.data();
            this.setState({
                description: data.description,
                instructions: data.instructions,
                procedure: data.procedure,
            })
        })
    }

    changeState = (e) => {
        const {name,value} = e.target;
        this.setState({[name]: value, message: ''})
    }

    saveChanges = () => {
        pFirestore.collection('fundraisers').doc(this.context.fundraiser).update({
                description: this.state.description,
                instructions: this.state.instructions,
                procedure: this.state.procedure,
        }).then(()=>{this.setState({message: "Successfully updated!"})}).catch(()=>{
            this.setState({message: "An Error Occured"})
        })
    }

    render(){
        return(<div id="fundraiser-settings-container">
            <div>
                <h5>Description:</h5>
                <textarea name="description" value={this.state.description} onChange={this.changeState} placeholder="Description"></textarea><br></br>
                <h5>Instructions:</h5>
                <textarea name="instructions" value={this.state.instructions} onChange={this.changeState} placeholder="Instructions"></textarea><br></br>
                <h5>Procedure:</h5><textarea name="procedure" value={this.state.procedure} onChange={this.changeState} placeholder="Procedure"></textarea><br></br>
                <div>{this.state.message}</div><br></br>
                <button className="bred nomargin" onClick={this.saveChanges}>Save Changes</button>
            </div>
        </div>)
    }
}
FundraiserSettings.contextType = TotalContext;

export default FundraiserSettings;