function validate(phoneNumber) {
    if (phoneNumber.length !== 8) {
        return false;
    }
    var f = phoneNumber.substring(0,3);
    var s = phoneNumber.substring(4);
    if (phoneNumber.charAt(3) !== "-" || isNaN(f) || isNaN(s)) {
        return false;
    }
    return true
}