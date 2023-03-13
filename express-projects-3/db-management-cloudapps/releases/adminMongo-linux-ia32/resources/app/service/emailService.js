const nodemailer = require('nodemailer');
var hbs = require('nodemailer-express-handlebars');
var mandrillTransport = require('nodemailer-mandrill-transport');
module.exports = {
  sendEmail,
  deleteModelRecord,
  sendCredentialsByEmail,
  sendRandomPasswordByEmail
}

var transporter = nodemailer.createTransport(mandrillTransport({
    auth: {
      apiKey: '_sTuqnrpNCg4bGce9vlzoQ'
    }
  }));


transporter.use('compile',hbs({
  viewPath:'templates/emails',
  extName:'.hbs'
}))

function sendEmail(user,model,conn){
  if(model == 'appointments' || model == 'questions' || model == 'quotations' || model == 'enquete'){
      var mailOptions = {};
      var reqDate = '';
    if(model == 'appointments'){
          if(user.date){
            reqDate = new Date(user.date);
            reqDate = reqDate.getDate() + "-" + (reqDate.getMonth() + 1) + "-" + reqDate.getFullYear();
          }else {
              reqDate = '';
          }
          mailOptions = {
              from: 'Brixxs<info@cloudapps.services>',
              to: user.emailnotification || user.emailNotification,
              subject: 'Uw App: Afspraakverzoek van ' + user.name,
              text: '',
              html: "<h4>Afspraakverzoek via de App:</h4><br><p>Naam: " + user.name + "</p><p>Telefoonnummer: " + user.phone + "</p><p>Email: <a href=''>" + user.email + "</a></p><p>Bedrijf: " + user.company + "</p><br><p>Datum verzoek: " + reqDate + "</p><p>Tijdstip: " + user.time + "</p><br><p>Onderwerp(en): " + user.topic + "</p><p>Overige: " + user.comment + "</p>"
          }
    } else if(model == 'enquete'){
              mailOptions = {
              from: 'Brixxs<info@cloudapps.services>',
              to: user.emailnotification || user.emailNotification,
              subject: 'Uw App: Enquete van ' + user.name,
              text: '',
              html: "<h4>Enquete via de App:</h4><br><p>Naam: " + user.name + "</p><p>Telefoonnummer: " + user.phone + "</p><p>Email: <a href=''>" + user.email + "</a></p><p>Bedrijf: " + user.company + "</p><br><p>Hoe vaak heeft u afgelopen jaar contact gehad met ons kantoor: " + user.q1 + "</p><p>Wat vindt u van de kwaliteit van onze diensten: " + user.q2 + "</p><p>Wat is de algemene indruk die u heeft van ons kantoor: " + user.q3 + "</p><p>Bent u van plan ons in de komende periode weer in de schakelen voor een dienst: " + user.q4 + "</p><p>Zo ja, voor welke dienst: " + user.q5 + "</p><p>Zo ja, op welke termijn: " + user.q6 + "</p><p>Mogen wij eventueel naar aanleiding van deze enquete contact met u opnemen: " + user.q7 + "</p><p>Tips of ideeen voor verbetering: " + user.comment + "</p>"
          }
    } else if(model == 'questions'){
              mailOptions = {
              from: 'Brixxs<info@cloudapps.services>',
              to: user.emailnotification || user.emailNotification,
              subject: 'Uw App: Vraag van ' + user.name,
              text: '',
              html: "<h4>Vraag via de App:</h4><br><p>Naam: " + user.name + "</p><p>Telefoonnummer: " + user.phone + "</p><p>Email: <a href=''>" + user.email + "</a></p><p>Bedrijf: " + user.company + "</p><p>Onderwerp(en): " + user.topic + "</p><br><p>Vraag: " + user.question + "</p>"
          }
    } else if(model == 'quotations'){
          mailOptions = {
              from: 'Brixxs<info@cloudapps.services>',
              to: user.emailnotification || user.emailNotification,
              subject: 'Uw App: Offerteaanvraag van ' + user.name,
              text: '',
              html: "<h4>Offerteaanvraag via de App:</h4><br><p>Naam: " + user.name + "</p><p>Telefoonnummer: " + user.phone + "</p><p>Email: <a href=''>" + user.email + "</a></p><p>Bedrijf: " + user.company +  "</p><br><p>Voor de volgende dienst(en): " + user.topic + "</p><p>Offerteverzoek: " + user.comment + "</p>"
          }
    }

   transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
      deleteModelRecord(model,user.Id,conn);
  }else{
    if(model == 'oauth'){
        var mailOptions = {
              from: 'Brixxs<info@cloudapps.services>',
              to: user,
              subject: 'Security alert',
              text: '',
              html: "<body style='background: #e8e8e8'><p style='text-align: center;background: #ffffff; width: 60%; margin: auto; padding: 50px 100px'>Your Cloud Backend Service Account was tried to access with "+ conn +" IP. You're getting this email to make sure that it was you.</p>"
          }
           transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      });
    }
}

}

function deleteModelRecord(model,Id,conn) {
    const requiredModel = require('../models/' + model);
    model = conn.model(model, requiredModel.schema);
    model.remove({Id: Id}, function (err, user) {
        if (err) {
            console.log(err);
        }
    })
}

// function to send credentials after the registration of user
function sendCredentialsByEmail(obj){
   transporter.sendMail({
         from: 'Cloudapps<info@cloudapps.services>',
         to: obj.Email,
         subject: 'Welcome to cloudapps',
         template: 'sendCredentials',
         context:{
           "Username": obj.Username,
           "Password": obj.Password
         }
   },function(err,response){
     if(err){
       console.log(err);
     }else{
       console.log(response);
     }
   })
}

//reset password
function sendRandomPasswordByEmail(obj){
   transporter.sendMail({
         from: 'Cloudapps<info@cloudapps.services>',
         to: obj.Email,
         subject: 'Wachtwoord reset',
         template: 'reset-password',
         context:{
           "Username": obj.Username,
           "Password": obj.Password
         }
   },function(err,response){
     if(err){
       console.log(err);
     }else{
       console.log(response);
     }
   })
}
