import { Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

//Validate RESEND_API inside .env file
if(!process.env.RESEND_API){
    console.log("RESEND_API is not available, Please provide RESEND_API inside the .env file")
}

const resend = new Resend(process.env.RESEND_API);

//send email to the user
const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        //send the mail to the user
        const { data, error } = await resend.emails.send({
            from: 'My Blinkit <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error)
    }
}

export default sendEmail

