/**
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *  Client : Nill
 * 
 * OTP 7882 - Custom page for display sales order based on the status
 * 
 * 
 * *************************************************************************************
 * ***
 * 
 * Author : Jobin And Jismi IT Services
 * 
 * Date Created : 17 - September - 2024
 * 
 * Description : This script is for populating a Custom page for displaying sales order based on the status. The
 *               form is devoloped using Suitelet
 * 
 * 
 * REVISION HISTORY : 1.0
 * 
 * 
 * 
 * ------------------------------------------------------------------------
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record','N/ui/serverWidget', 'N/format'],
    /**
 * @param{record} record
 */
    (record, serverWidget, format) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        const onRequest = (scriptContext) => {

            if (scriptContext.request.method === 'GET')
            {
            
            let form = serverWidget.createForm({
                title: 'Blood Donation Requirement',
            });

            
            form.addField({
                id: 'custpage_firstname',
                type: serverWidget.FieldType.TEXT,
                label: 'First Name'
            });
            form.addField({
                id: 'custpage_lastname',
                type: serverWidget.FieldType.TEXT,
                label: 'Last Name'
            });
            let gender = form.addField({
                id: 'custpage_gender',
                type: serverWidget.FieldType.SELECT,
                label: 'Gender'
            });
            gender.addSelectOption({
                value : '',
                text : ''
            });
            gender.addSelectOption({
                value : 'Male',
                text : 'Male'
            });
            gender.addSelectOption({
                value : 'Female',
                text : 'Female'
            });
            form.addField({
                id: 'custpage_phonenumber',
                type: serverWidget.FieldType.PHONE,
                label: 'Phone Number'
            });
            form.addField({
                id: 'custpage_bloodgroup',
                type: serverWidget.FieldType.TEXT,
                label: 'Blood Group'
            });
            form.addField({
                id: 'custpage_lastdonation',
                type: serverWidget.FieldType.DATE,
                label: 'Last Donation Date'    
            });
            form.addSubmitButton({
                label: "Submit"
            });

            scriptContext.response.writePage(form);
        }
        else if (scriptContext.request.method === 'POST')
        {
            
            var firstName = scriptContext.request.parameters.custpage_firstname;
            var lastName = scriptContext.request.parameters.custpage_lastname;
            var genderType = scriptContext.request.parameters.custpage_gender;
            var phoneNumber = scriptContext.request.parameters.custpage_phonenumber;
            var bloodGroup = scriptContext.request.parameters.custpage_bloodgroup;
            var lastDonation = scriptContext.request.parameters.custpage_lastdonation;

            var formatDate = format.parse({
                value: lastDonation,
                type: format.Type.DATE
            });

            

            createRecord (firstName,lastName,genderType,phoneNumber,bloodGroup,formatDate, scriptContext)
            

        }
        }

        return {onRequest}




/**
 * Creates a new blood donation record and displays the submitted information.
 *
 * @param {string} firstName - The first name of the donor.
 * @param {string} lastName - The last name of the donor.
 * @param {string} genderType - The gender of the donor (should be 'male' or 'female').
 * @param {string} phoneNumber - The phone number of the donor.
 * @param {string} bloodGroup - The blood group of the donor.
 * @param {Date} formatDate - The date of the last donation.
 * @param {Object} scriptContext - The context object containing the response to write back to the client.
 * @returns {void} - This function does not return a value. It writes HTML output directly to the response.
 * 
 * 
 */


        function createRecord (firstName,lastName,genderType,phoneNumber,bloodGroup,formatDate, scriptContext)
        {
            var bloodReqirementRegistration = record.create({
                type: 'customrecord5',
                isDynamic: true
            });
            bloodReqirementRegistration.setValue({ fieldId: 'custrecord_jj_firstname', value: firstName });
            bloodReqirementRegistration.setValue({ fieldId: 'custrecord_jj_lastname', value: lastName });
            let genderValue;
            if (genderType === 'male') 
            {
                genderValue = '1'; // replace with the actual value for Male
            } 
            else if (genderType === 'female')
            {
                genderValue = '2';
            }

            bloodReqirementRegistration.setValue({ fieldId: 'custrecord_jj_gender', value: genderValue });
            bloodReqirementRegistration.setValue({ fieldId: 'custrecord_jj_phonenumber', value: phoneNumber });
            bloodReqirementRegistration.setValue({ fieldId: 'custrecord_jj_bloodgroup', value: bloodGroup });
            bloodReqirementRegistration.setValue({ fieldId: 'custrecord_jj_lastdonation', value: formatDate });
            let bloodId = bloodReqirementRegistration.save();
            log.debug(bloodId);

            let html = `<html>
                            <body>
                            <h1> Customer Information</h1>
                            <p><strong>First Name:</strong> ${firstName}</p>
                            <p><strong>Second Name:</strong> ${lastName}</p>
                            <p><strong>Gender:</strong> ${genderType}</p>
                            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                            <p><strong>Blood Group:</strong> ${bloodGroup}</p>
                            <p><strong>Last Donation Date:</strong> ${formatDate}</p>
                            </body>
                            </html>`;
                scriptContext.response.write(html);

        }

    });
