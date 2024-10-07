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
 * @NScriptType ClientScript
 */
define(['N/search'], function(search) {

    function saveRecord(context) {
        var currentRecord = context.currentRecord;

        // Retrieve the phone number entered by the user
        var phoneField = currentRecord.getValue({ fieldId: 'custpage_phonenumber' });

        // Validate phone number format
        var phoneRegex = /^\d{10}$/; 
        if (!phoneRegex.test(phoneField)) {
            alert('Please enter a valid 10-digit phone number.');
            return false; // Prevent form submission
        }

        // Date validation: Last Donation Date should not be a future date
        var lastDonationField = currentRecord.getValue({ fieldId: 'custpage_lastdonation' });
        if (lastDonationField) {
            var today = new Date();
            var lastDonationDate = new Date(lastDonationField);
            if (lastDonationDate > today) {
                alert('Last Donation Date cannot be in the future.');
                return false; // Prevent form submission
            }
        }

        // Perform duplicate check before submission
        var duplicateFound = checkForDuplicate(phoneField);

        if (duplicateFound) {
            alert('A donor with this phone number already exists.');
            return false; // Prevent form submission if duplicate exists
        }

        return true; // Allow form submission
    }

    /**
     * Checks for duplicate records in the system by searching for matching phone numbers.
     * 
     * @param {string} phoneNumber - The phone number entered by the user.
     * @returns {boolean} - True if a duplicate is found, false otherwise.
     */
    function checkForDuplicate(phoneNumber) {
        var donorSearch = search.create({
            type: 'customrecord5',  // Replace with your custom record type
            filters: [
                ['custrecord_jj_phonenumber', 'is', phoneNumber]
            ],
            columns: ['custrecord_jj_phonenumber']
        });

        var searchResult = donorSearch.run().getRange({
            start: 0,
            end: 1 // Only care if at least one result is found
        });

        return searchResult.length > 0; // Return true if duplicate is found
    }

    return {
        saveRecord: saveRecord
    };

});