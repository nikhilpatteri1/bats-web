//====================== Timestamp to Date Conversion =====================
batsGeneralHome.filter('timestampToDate', function () {
    return function (timestamp) {
        var date = new Date(timestamp);
        var dateString = timeStamp_value.toLocaleDateString();
        var timeString = timeStamp_value.toLocaleTimeString();
        var dateObject = dateString +", "+ timeString;
        return dateObject;
    };
});