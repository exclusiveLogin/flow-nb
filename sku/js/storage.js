export default class LStore{
    saveSettings(objectToSave){
        Object.keys(objectToSave).map(function (element,idx) {
            console.log("ELEMENT-"+idx+":"+element+" is saved");

        });
        //localStorage.setItem("username",user);
    }
    loadRTSettings() {
        //localStorage.getItem("username");
    }
    loadDSSettings() {
        //localStorage.getItem("username");
    }
}
