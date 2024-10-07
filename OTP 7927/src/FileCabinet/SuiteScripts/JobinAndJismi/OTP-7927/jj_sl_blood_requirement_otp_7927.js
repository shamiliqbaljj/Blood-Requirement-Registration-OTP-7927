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
 * OTP 7927 - Custom form to store blood donor details and track them in database
 * 
 * 
 * *************************************************************************************
 * ***

 * Author : Jobin And Jismi IT Services
 * 
 * Date Created : 17 - September - 2024
 * 
 * Description : This script is for creating a custom form for data collection of blood donor
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


define(['N/record', 'N/ui/serverWidget', 'N/format'],
    (record, serverWidget, format) => {
        const onRequest = (scriptContext) => {
            if (scriptContext.request.method === 'GET') {
                let form = serverWidget.createForm({
                    title: 'Blood Donation Requirement',
                });
                form.addField({
                    id: 'custpage_firstname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'First Name'
                }).isMandatory = true;
                form.addField({
                    id: 'custpage_lastname',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Last Name'
                });
                
                let gender = form.addField({
                    id: 'custpage_gender',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Gender',
                });
                gender.addSelectOption({ value: '', text: '' });
                gender.addSelectOption({ value: 'Male', text: 'Male' });
                gender.addSelectOption({ value: 'Female', text: 'Female' });

                form.addField({
                    id: 'custpage_phonenumber',
                    type: serverWidget.FieldType.PHONE,
                    label: 'Phone Number'
                }).isMandatory = true;

                let bloodGroupField = form.addField({
                    id: 'custpage_bloodgroup',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Blood Group',
                })
                bloodGroupField.isMandatory = true;

                // Adding the Select Options
                const bloodGroups = [
                    { value: '', text: '' },  // Default "Select" option
                    { value: 'A+', text: 'A+' },
                    { value: 'A-', text: 'A-' },
                    { value: 'B+', text: 'B+' },
                    { value: 'B-', text: 'B-' },
                    { value: 'AB+', text: 'AB+' },
                    { value: 'AB-', text: 'AB-' },
                    { value: 'O+', text: 'O+' },
                    { value: 'O-', text: 'O-' }
                ];

                bloodGroups.forEach(group => {
                    bloodGroupField.addSelectOption({
                        value: group.value,
                        text: group.text
                    });
                });

                form.addField({
                    id: 'custpage_lastdonation',
                    type: serverWidget.FieldType.DATE,
                    label: 'Last Donation Date'
                });
                form.addSubmitButton({
                    label: "Submit"
                });

                // Bind the client script using the module path
                form.clientScriptModulePath = 'SuiteScripts/JobinAndJismi/OTP-7927/jj_cs_blood_otp_7927.js'; // Provide the module path for the client script

                scriptContext.response.writePage(form);
            } else if (scriptContext.request.method === 'POST') {
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
                

                createRecord(firstName, lastName, genderType, phoneNumber, bloodGroup, formatDate, scriptContext);
            }
        };

/**
 * Creates a new blood donation requirement record and saves it to the system.
 * Displays the submitted donor information in an HTML format after successful creation.
 *
 * @param {string} firstName - The first name of the blood donor.
 * @param {string} lastName - The last name of the blood donor.
 * @param {string} genderType - The gender of the blood donor (e.g., 'Male', 'Female').
 * @param {string} phoneNumber - The phone number of the blood donor.
 * @param {string} bloodGroup - The blood group of the donor (e.g., 'A+', 'O-', etc.).
 * @param {Date} formatDate - The date of the last blood donation, formatted as a Date object.
 * @param {Object} scriptContext - The context object passed into the Suitelet, containing the request and response objects.
 * 
 * @returns {void}
 */

        function createRecord(firstName, lastName, genderType, phoneNumber, bloodGroup, formatDate, scriptContext) {
            var bloodRequirementRegistration = record.create({
                type: 'customrecord5',
                isDynamic: true
            });
            bloodRequirementRegistration.setValue({ fieldId: 'custrecord_jj_firstname', value: firstName });
            bloodRequirementRegistration.setValue({ fieldId: 'custrecord_jj_lastname', value: lastName });

            let genderValue;
            if (genderType === 'Male') {
                genderValue = '1'; // replace with the actual value for Male
            } else if (genderType === 'Female') {
                genderValue = '2';
            }

            bloodRequirementRegistration.setValue({ fieldId: 'custrecord_jj_gender', value: genderValue });
            bloodRequirementRegistration.setValue({ fieldId: 'custrecord_jj_phonenumber', value: phoneNumber });
            bloodRequirementRegistration.setValue({ fieldId: 'custrecord_jj_bloodgroup', value: bloodGroup });
            bloodRequirementRegistration.setValue({ fieldId: 'custrecord_jj_lastdonation', value: formatDate });

            let bloodId = bloodRequirementRegistration.save();
            log.debug(bloodId);

            let html = `<html>
                            <body>
                            <h1> Blood Donor Information</h1>
                            <p><strong>First Name:</strong> ${firstName}</p>
                            <p><strong>Last Name:</strong> ${lastName}</p>
                            <p><strong>Gender:</strong> ${genderType}</p>
                            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
                            <p><strong>Blood Group:</strong> ${bloodGroup}</p>
                            <p><strong>Last Donation Date:</strong> ${formatDate}</p>
                            </body>
                            </html>`;
            scriptContext.response.write(html);
        }

        return { onRequest };
    }
);
