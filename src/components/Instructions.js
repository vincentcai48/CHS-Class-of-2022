import React from "react"
import { TotalContext } from "../services/context"

function Instructions(){
    return(<div id="instructions">
        <TotalContext.Consumer>
            {value=>{return <div><i class="fas fa-exclamation-triangle"></i>{value.fSettings.instructions}</div>}}
        </TotalContext.Consumer>
    </div>)
}

export default Instructions