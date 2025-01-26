const forgotPasswordTemplate = ({ name, otp })=>{
    return `<div>
                <p>Dear, ${name}</p>
                <p>You've requested password reset.</p>
                <div style="background:yellow; font-size:20px;padding:20px;text-align:center;font-weight : 800;">
                    ${otp}
                </div>
                <p>This otp is valid for 10 minute only. Please use above OTP to reset your password.</p>
                <br/>
                </br>
                <p>Thanks</p>
                <p>My Blinkit</p>
            </div>`
}

export default forgotPasswordTemplate