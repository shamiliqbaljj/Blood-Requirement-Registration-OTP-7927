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
 * Description : This script is validating phone number and last donation date
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
define([], function() {
    
    function saveRecord(context) {
        // Phone number validation
        var phoneField = context.currentRecord.getValue({ fieldId: 'custpage_phonenumber' });
        var phoneRegex = /^\d{10}$/; 

        if (!phoneRegex.test(phoneField)) {
            alert('Please enter a valid phone number.');
            return false; // Prevent form submission
        }

        // Date validation: Last Donation Date should not be a future date
        var lastDonationField = context.currentRecord.getValue({ fieldId: 'custpage_lastdonation' });

        if (lastDonationField) {
            var today = new Date();
            var lastDonationDate = new Date(lastDonationField);

            if (lastDonationDate > today) {
                alert('Enter valid date');
                return false; // Prevent form submission
            }
        }

        return true; // Allow form submission
    }

    return {
        saveRecord: saveRecord
    };
});
