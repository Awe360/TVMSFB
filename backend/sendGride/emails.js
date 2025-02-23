import dotenv from 'dotenv';
import sgMail from '@sendgrid/mail';
import {
	WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
 
} from "./emailTemplates.js";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export const sendWelcomeEmail = async ({email, name, tempPassword,ID,loginUrl}) => {
	const msg = {
	  to: email,
	  from: process.env.SENDER_EMAIL,
	  subject: 'Welcome To Ministry of Innovation and Technology Media Management Team',
	  html: WELCOME_EMAIL_TEMPLATE
		.replace('{name}', name)
		.replace('{adminEmail}', email)
		.replace('{ID}', ID)
		.replace('{tempPassword}', tempPassword)
		.replace('{loginUrl}',loginUrl)
		.replace('{logoUrl}', process.env.logoUrl || 'https://upload.wikimedia.org/wikipedia/en/9/9f/Ministry_of_Innovation_and_Technology_%28Ethiopia%29.png'), // Add your logo URL
	  category: 'Welcome Email',
	};
  
	try {
	  await sgMail.send(msg);
	  console.log(`Welcome email sent successfully to ${email}`);
	} catch (error) {
	  console.error(`Error sending welcome email: ${error}`);
	  throw new Error(`Error sending welcome email: ${error.message}`);
	}
  };

// 	const msg = {
// 	  to: email,
// 	  from: process.env.SENDER_EMAIL,
// 	  templateId: process.env.templateId,
// 	  dynamic_template_data: {
// 		name: name,
// 	  },
// 	};
  
// 	try {
// 	  await sgMail.send(msg);
// 	  console.log('Welcome email sent successfully');
// 	} catch (error) {
// 	  console.error(`Error sending welcome email: ${error}`);
// 	  throw new Error(`Error sending welcome email: ${error.message}`);
// 	}
//   };
  export const sendPasswordResetEmail = async (email, resetURL) => {
	const msg = {
	  to: email,
	  from: process.env.SENDER_EMAIL,
	  subject: 'Reset your password',
	  html:PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}',resetURL),
	  category: 'Password Reset',
	};
  
	try {
	  await sgMail.send(msg);
	  console.log('Password reset email sent successfully');
	} catch (error) {
	  console.error(`Error sending password reset email: ${error}`);
	  throw new Error(`Error sending password reset email: ${error.message}`);
	}
  };
  export const sendResetSuccessEmail = async (email) => {
	const msg = {
	  to: email,
	  from: process.env.SENDER_EMAIL,
	  subject: 'Password Reset Successful',
	  html:PASSWORD_RESET_SUCCESS_TEMPLATE,
	  category: 'Password Reset Success',
	};
  
	try {
	  await sgMail.send(msg);
	  console.log('Password reset success email sent successfully');
	} catch (error) {
	  console.error(`Error sending password reset success email: ${error}`);
	  throw new Error(`Error sending password reset success email: ${error.message}`);
	}
  };
