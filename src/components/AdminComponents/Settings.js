import React from "react"
import { TotalContext } from "../../services/context";

class Settings extends React.Component{
    constructor(){
        super();
        this.state = {}
    }

    render(){
        return(<div>
            <div>
                <ul id="allsettings">
                    
                </ul>
            </div>
        </div>)
    }
}
Settings.contextType = TotalContext;

export default Settings